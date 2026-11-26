import { expect, test } from '@playwright/test'
import { ready, scrollThrough, sitePages, stubGithub } from './helpers'

const site = process.env.SITE_URL?.replace(/\/+$/, '')

test.describe('Cada página prerenderizada, en los dos idiomas', () => {
  test('trae su h1, su título propio, su descripción y datos estructurados válidos', async ({ request }) => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const p of sitePages) {
      const html = await (await request.get(p.path)).text()
      expect(html, p.path).toContain(`<html lang="${p.lang}">`)
      expect(html, p.path).not.toContain('<div id="root"></div>')
      expect(html, p.path).toContain(`data-page="${p.key}"`)
      expect((html.match(/<h1[\s>]/g) ?? []).length, `${p.path}: un solo h1`).toBe(1)
      expect(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), p.path).toContain(p.h1)

      const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
      expect(title, `${p.path}: título`).toBeTruthy()
      expect(description, `${p.path}: descripción`).toBeTruthy()
      titles.add(title!)
      descriptions.add(description!)

      // JSON-LD: cada bloque es JSON válido y tiene @graph con al menos un nodo.
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
      expect(blocks.length, `${p.path}: JSON-LD`).toBeGreaterThan(0)
      for (const raw of blocks) {
        const data = JSON.parse(raw)
        expect(data['@context']).toBe('https://schema.org')
        expect(data['@graph'].length).toBeGreaterThan(0)
      }
    }
    // Ninguna página repite título ni descripción (ni entre páginas ni entre idiomas).
    expect(titles.size).toBe(sitePages.length)
    expect(descriptions.size).toBe(sitePages.length)
  })

  test('los casos de estudio declaran sus migas de pan', async ({ request }) => {
    for (const path of ['/proyectos/se7en/', '/proyectos/jfood/']) {
      const html = await (await request.get(path)).text()
      expect(html, path).toContain('"@type":"BreadcrumbList"')
    }
  })

  test('canonical, hreflang y og:url se cruzan entre idiomas en todas las páginas', async ({ request }) => {
    test.skip(!site, 'Construye con SITE_URL para comprobar canonical y hreflang')
    const byKey = new Map<string, { es: string; en: string }>()
    for (const p of sitePages) {
      const cur = byKey.get(p.key) ?? { es: '', en: '' }
      cur[p.lang] = p.path
      byKey.set(p.key, cur)
    }
    for (const p of sitePages) {
      const html = await (await request.get(p.path)).text()
      const pair = byKey.get(p.key)!
      expect(html, p.path).toContain(`rel="canonical" href="${site}${p.path}"`)
      expect(html, p.path).toContain(`hreflang="es" href="${site}${pair.es}"`)
      expect(html, p.path).toContain(`hreflang="en" href="${site}${pair.en}"`)
      expect(html, p.path).toContain(`hreflang="x-default" href="${site}${pair.es}"`)
      expect(html, p.path).toContain(`property="og:url" content="${site}${p.path}"`)
    }
  })

  test('el sitemap lista todas las páginas y robots.txt lo enlaza', async ({ request }) => {
    test.skip(!site, 'Construye con SITE_URL para comprobar el sitemap')
    const xml = await (await request.get('/sitemap.xml')).text()
    for (const p of sitePages) expect(xml, p.path).toContain(`<loc>${site}${p.path}</loc>`)
    expect((xml.match(/<loc>/g) ?? []).length).toBe(sitePages.length)
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain(`Sitemap: ${site}/sitemap.xml`)
  })

  test('la 404 existe, no se indexa y no tiene canonical', async ({ request }) => {
    const html = await (await request.get('/404.html')).text()
    expect(html).toContain('data-page="notFound"')
    expect(html).toContain('<meta name="robots" content="noindex" />')
    expect(html).not.toContain('rel="canonical"')
  })
})

test.describe('Enlaces internos', () => {
  test('todos los enlaces internos llevan a una página que existe y a un ancla que existe', async ({ request }) => {
    const cache = new Map<string, string>()
    const get = async (path: string) => {
      if (!cache.has(path)) {
        const res = await request.get(path)
        expect(res.status(), `GET ${path}`).toBe(200)
        cache.set(path, await res.text())
      }
      return cache.get(path)!
    }

    const broken: string[] = []
    for (const p of sitePages) {
      const html = await get(p.path)
      const hrefs = new Set([...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))
      for (const href of hrefs) {
        if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue
        const [pathAndQuery, hash] = href.split('#')
        const target = pathAndQuery ? pathAndQuery.split('?')[0] : p.path
        const body = await get(target)
        if (hash && !body.includes(`id="${hash}"`)) broken.push(`${p.path} → ${href}: no hay id="${hash}" en ${target}`)
      }
    }
    expect(broken).toEqual([])
  })
})

test.describe('Maquetación en cualquier ancho', () => {
  // Móvil pequeño, móvil grande, tableta vertical, tableta apaisada: el desbordamiento horizontal suele aparecer
  // en los anchos intermedios (un correo largo en el pie lo provocó a 768 px).
  for (const width of [320, 600, 768, 1024]) {
    test(`${width}px: ninguna página desborda en horizontal`, async ({ page }) => {
      await stubGithub(page)
      await page.setViewportSize({ width, height: 900 })
      const wide: string[] = []
      for (const p of sitePages) {
        await page.goto(p.path)
        await ready(page)
        await scrollThrough(page)
        const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        if (extra > 0) wide.push(`${p.path}: +${extra}px`)
      }
      expect(wide).toEqual([])
    })
  }
})

test.describe('Imágenes', () => {
  for (const p of sitePages) {
    test(`${p.path}: todas las imágenes tienen alt y medidas`, async ({ page }) => {
      await stubGithub(page)
      await page.goto(p.path)
      await ready(page)
      const bad = await page.evaluate(() =>
        [...document.images]
          .filter((img) => !img.hasAttribute('alt') || !img.getAttribute('width') || !img.getAttribute('height'))
          .map((img) => img.src),
      )
      expect(bad).toEqual([])
    })
  }

  test('las capturas reales de Se7en cargan de verdad', async ({ page }) => {
    await page.goto('/proyectos/se7en/')
    await ready(page)
    const imgs = page.locator('img.shot')
    await expect(imgs).toHaveCount(4)
    for (const img of await imgs.all()) {
      await img.scrollIntoViewIfNeeded()
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
      await expect(img).toHaveAttribute('alt', /.{40,}/)
    }
  })
})

test.describe('Conversión: de cada servicio al formulario', () => {
  test('el botón de un servicio deja preparado el tipo de proyecto', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    await page.getByRole('link', { name: 'Pedir presupuesto para esto' }).nth(1).click()
    await expect(page).toHaveURL(/#contacto$/)
    await expect(page.getByRole('radio', { name: 'Software a medida' })).toBeChecked()
    await page.getByRole('link', { name: 'Pedir presupuesto para esto' }).nth(2).click()
    await expect(page.getByRole('radio', { name: 'Automatización o IA' })).toBeChecked()
  })

  test('«Pedir una primera conversación» elige esa intención', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    await page.getByRole('link', { name: 'Pedir una primera conversación' }).click()
    await expect(page.getByRole('radio', { name: 'Una primera conversación' })).toBeChecked()
  })

  test('desde un caso de estudio, el CTA lleva a la portada con el formulario preparado', async ({ page }) => {
    await stubGithub(page)
    await page.goto('/proyectos/jfood/')
    await ready(page)
    await page.locator('.casecta').getByRole('link', { name: 'Hablemos de tu proyecto' }).click()
    await expect(page).toHaveURL(/\/\?tipo=software#contacto$/)
    await ready(page)
    await expect(page.getByRole('radio', { name: 'Software a medida' })).toBeChecked()
  })

  test('el parámetro ?tipo= se ignora si no es un tipo válido', async ({ page }) => {
    await page.goto('/?tipo=<script>&intencion=nada#contacto')
    await ready(page)
    await expect(page.locator('input[name="type"]:checked')).toHaveCount(0)
    await expect(page.getByRole('radio', { name: 'Pedir presupuesto' })).toBeChecked()
  })
})

test.describe('Botón fijo «Pedir presupuesto» (móvil)', () => {
  test('aparece al bajar, se esconde en el formulario y no existe en escritorio', async ({ page }, info) => {
    await page.goto('/')
    await ready(page)
    const cta = page.locator('.mcta')
    if (info.project.name === 'desktop') {
      await expect(cta).toBeHidden()
      return
    }
    await expect(cta).toBeHidden()
    await page.evaluate(() => window.scrollTo(0, 1400))
    await expect(cta).toBeVisible()
    await expect(cta.getByRole('link', { name: /Pedir presupuesto/ })).toBeVisible()
    await page.locator('#contacto').scrollIntoViewIfNeeded()
    await page.evaluate(() => document.getElementById('contacto')!.scrollIntoView({ block: 'center' }))
    await expect(cta).toBeHidden()
  })

  test('no se muestra en el aviso legal', async ({ page }) => {
    await page.goto('/aviso-legal/')
    await ready(page)
    await expect(page.locator('.mcta')).toHaveCount(0)
  })
})
