import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const isDesktop = (project: string) => project === 'desktop'

/** Espera a que React haya hidratado (la barra pinta la hora solo en el cliente). */
async function ready(page: Page) {
  await expect(page.locator('.bar__time')).not.toBeEmpty()
}

/** Texto visible de un HTML: sin scripts, estilos ni etiquetas (el titular va partido en un <span> por palabra). */
const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')

test.describe('HTML prerenderizado (lo que ven Google y WhatsApp sin JavaScript)', () => {
  for (const [path, lang, h1] of [
    ['/', 'es', 'Hago webs y apps'],
    ['/en/', 'en', 'I build websites and apps'],
  ] as const) {
    test(`${path} trae el contenido real en el HTML`, async ({ request }) => {
      const html = await (await request.get(path)).text()
      expect(html).toContain(`<html lang="${lang}">`)
      expect(visibleText(html)).toContain(h1)
      expect((html.match(/<h2/g) ?? []).length).toBeGreaterThanOrEqual(7)
      expect(html).toContain('application/ld+json')
      expect(html).not.toContain('<div id="root"></div>')
    })
  }

  // Los enlaces hreflang y canonical necesitan URL absoluta, así que solo existen con SITE_URL al construir.
  test('hreflang y canonical se cruzan entre idiomas', async ({ request }) => {
    test.skip(!process.env.SITE_URL, 'Construye con SITE_URL para comprobar hreflang')
    const site = process.env.SITE_URL!.replace(/\/+$/, '')
    const es = await (await request.get('/')).text()
    const en = await (await request.get('/en/')).text()
    for (const html of [es, en]) {
      expect(html).toContain(`hreflang="es" href="${site}/"`)
      expect(html).toContain(`hreflang="en" href="${site}/en/"`)
      expect(html).toContain(`hreflang="x-default" href="${site}/"`)
    }
    expect(es).toContain(`rel="canonical" href="${site}/"`)
    expect(en).toContain(`rel="canonical" href="${site}/en/"`)
  })
})

test.describe('Carga limpia', () => {
  test('sin errores de consola, sin hidratación fallida y sin peticiones rotas', async ({ page }) => {
    const problems: string[] = []
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && problems.push(`console ${m.type()}: ${m.text()}`))
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
    page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`))
    await page.goto('/')
    await ready(page)
    await page.locator('footer').scrollIntoViewIfNeeded()
    expect(problems).toEqual([])
  })

  test('no hay desbordamiento horizontal', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test('los botones del hero se ven sin hacer scroll en un portátil de 1366×650', async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name))
    await page.setViewportSize({ width: 1366, height: 650 })
    await page.goto('/')
    await ready(page)
    for (const name of [/Ver proyectos/, /Webs para negocios/]) {
      const box = await page.getByRole('link', { name }).first().boundingBox()
      expect(box && box.y + box.height).toBeLessThanOrEqual(650)
    }
  })
})

test.describe('Accesibilidad (axe: WCAG 2.2 AA + buenas prácticas)', () => {
  for (const theme of ['light', 'dark']) {
    for (const offline of [false, true]) {
      test(`sin violaciones: tema ${theme}${offline ? ', modo avión' : ''}`, async ({ page }) => {
        await page.goto(`/?theme=${theme}${offline ? '&offline=1' : ''}`)
        await ready(page)
        // Las maquetas de teléfono hacen un fundido al cambiar de pantalla: se mide cuando ya terminó.
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.phone__screen > div')].every((d) => getComputedStyle(d).opacity === '1'),
        )
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        expect(violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${(n.any[0]?.message ?? n.all[0]?.message ?? '').slice(0, 110)}`))).toEqual([])
      })
    }
  }
})

test.describe('Idioma y tema', () => {
  test('el selector de idioma lleva a /en/ y de vuelta', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    await page.getByRole('link', { name: /Change language/ }).click()
    await expect(page).toHaveURL(/\/en\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.getByRole('link', { name: /Cambiar idioma/ }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('el tema se cambia y se recuerda al recargar', async ({ page }) => {
    await page.goto('/?theme=light')
    await ready(page)
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.goto('/')
    await ready(page)
    const before = await page.locator('html').getAttribute('data-theme')
    await page.getByRole('button', { name: /tema claro y oscuro/ }).click()
    const after = await page.locator('html').getAttribute('data-theme')
    expect(after).not.toBe(before)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', after!)
  })
})

test.describe('Modo avión', () => {
  test('desconecta la web: banner, ámbar y botón de Se7en deshabilitado', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    await page.locator('#se7en').scrollIntoViewIfNeeded()
    await expect(page.getByRole('link', { name: /Ver la web/ }).first()).toBeVisible()
    await page.getByRole('switch', { name: 'Modo avión' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-offline', 'true')
    await expect(page.getByRole('button', { name: /Necesitas conexión/ })).toBeDisabled()
    await page.getByRole('switch', { name: 'Modo avión' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-offline', 'false')
  })
})

test.describe('Paleta de comandos', () => {
  test('Ctrl+K abre, filtra sin acentos, navega con Enter y Esc cierra', async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), 'Atajos de teclado: solo escritorio')
    await page.goto('/')
    await ready(page)
    const dialog = page.getByRole('dialog', { name: 'Buscar en la web' })
    await page.keyboard.press('Control+k')
    await expect(dialog).toBeVisible()
    const box = dialog.getByRole('combobox')
    await expect(box).toBeFocused()
    await box.fill('preguntas')
    await expect(dialog.getByRole('option')).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/#faq$/)
    await page.keyboard.press('/')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})

test.describe('Contacto', () => {
  test('mensaje vacío: error accesible', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    await page.locator('#contacto').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(page.getByRole('alert')).toContainText('Escribe un mensaje')
  })

  test('los canales de contacto apuntan a los destinos correctos', async ({ page }) => {
    await page.goto('/')
    await ready(page)
    const contact = page.locator('#contacto')
    await expect(contact.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/34684180746\?text=/)
    await expect(contact.getByRole('link', { name: '+34 684 18 07 46' })).toHaveAttribute('href', 'tel:+34684180746')
  })
})
