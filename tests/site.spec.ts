import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ready, settled, sitePages, stubGithub, visibleText } from './helpers'

const isDesktop = (project: string) => project === 'desktop'

test.describe('HTML prerenderizado de la portada (lo que ven Google y WhatsApp sin JavaScript)', () => {
  for (const [path, lang, h1] of [
    ['/', 'es', 'Webs, apps y automatizaciones'],
    ['/en/', 'en', 'Custom websites, apps and automation'],
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
})

test.describe('Carga limpia', () => {
  for (const p of sitePages) {
    test(`${p.path}: sin errores de consola, sin hidratación fallida y sin peticiones rotas`, async ({ page }) => {
      const problems: string[] = []
      page.on('console', (m) => ['error', 'warning'].includes(m.type()) && problems.push(`console ${m.type()}: ${m.text()}`))
      page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
      page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`))
      await stubGithub(page)
      await page.goto(p.path)
      await ready(page)
      await page.locator('footer').scrollIntoViewIfNeeded()
      expect(problems).toEqual([])
    })

    test(`${p.path}: no hay desbordamiento horizontal`, async ({ page }) => {
      await stubGithub(page)
      await page.goto(p.path)
      await ready(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }

  test('los botones del hero se ven sin hacer scroll en un portátil de 1366×650', async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name))
    await page.setViewportSize({ width: 1366, height: 650 })
    await page.goto('/')
    await ready(page)
    for (const name of [/Hablemos de tu proyecto/, /Ver proyectos/]) {
      const box = await page.getByRole('link', { name }).first().boundingBox()
      expect(box && box.y + box.height).toBeLessThanOrEqual(650)
    }
  })
})

test.describe('Accesibilidad (axe: WCAG 2.2 AA + buenas prácticas)', () => {
  const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']
  // Axe mide el contraste por geometría. El botón fijo del móvil y la barra de progreso (del color de acento) solapan texto y
  // content-visibility (una optimización de rendimiento) va pintando secciones mientras axe recorre la página: todo eso
  // falsea el fondo que ve axe. Se desactiva en la medición (el botón fijo se mide aparte, sobre sí mismo).
  const withoutFloating = (page: Page) =>
    page.addStyleTag({
      content: '.mcta, .bar__progress { display: none !important; } .section { content-visibility: visible !important; }',
    })
  const report = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
    violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${(n.any[0]?.message ?? n.all[0]?.message ?? '').slice(0, 110)}`))

  // La portada, en los dos temas y también en modo avión (cambia el color de acento).
  for (const theme of ['light', 'dark']) {
    for (const offline of [false, true]) {
      test(`portada sin violaciones: tema ${theme}${offline ? ', modo avión' : ''}`, async ({ page }) => {
        await page.goto(`/?theme=${theme}${offline ? '&offline=1' : ''}`)
        await ready(page)
        // Las maquetas de teléfono hacen un fundido al cambiar de pantalla: se mide cuando ya terminó.
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.phone__screen > div')].every((d) => getComputedStyle(d).opacity === '1'),
        )
        await withoutFloating(page)
        await settled(page)
        const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
        expect(report(violations)).toEqual([])
      })
    }
  }

  // El resto de páginas, en los dos temas e idiomas.
  for (const p of sitePages.filter((x) => x.key !== 'home')) {
    for (const theme of ['light', 'dark']) {
      test(`${p.path} sin violaciones: tema ${theme}`, async ({ page }) => {
        await stubGithub(page)
        await page.goto(`${p.path}?theme=${theme}`)
        await ready(page)
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.phone__screen > div')].every((d) => getComputedStyle(d).opacity === '1'),
        )
        await withoutFloating(page)
        await settled(page)
        const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
        expect(report(violations)).toEqual([])
      })
    }
  }

  test('el botón fijo del móvil cumple el contraste en los dos temas', async ({ page }, info) => {
    test.skip(info.project.name === 'desktop', 'Solo existe en móvil')
    for (const theme of ['light', 'dark']) {
      await page.goto(`/?theme=${theme}`)
      await ready(page)
      await page.evaluate(() => window.scrollTo(0, 1400))
      await expect(page.locator('.mcta')).toBeVisible()
      await settled(page)
      const { violations } = await new AxeBuilder({ page }).include('.mcta').withTags(tags).analyze()
      expect(report(violations)).toEqual([])
    }
  })

  test('la 404 sin violaciones', async ({ page }) => {
    await page.goto('/404.html?theme=light')
    await ready(page)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Esta página no existe')
    await withoutFloating(page)
    await settled(page)
    const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
    expect(report(violations)).toEqual([])
  })
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

  test('el selector de idioma conserva la página: caso de estudio y aviso legal', async ({ page }) => {
    await stubGithub(page)
    for (const [es, en] of [
      ['/proyectos/jfood/', '/en/projects/jfood/'],
      ['/proyectos/se7en/', '/en/projects/se7en/'],
      ['/aviso-legal/', '/en/legal/'],
    ]) {
      await page.goto(es)
      await ready(page)
      await page.getByRole('link', { name: /Change language/ }).click()
      await expect(page).toHaveURL(new RegExp(`${en}$`))
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await page.getByRole('link', { name: /Cambiar idioma/ }).click()
      await expect(page).toHaveURL(new RegExp(`${es}$`))
    }
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
    await page.goto('/proyectos/se7en/')
    await ready(page)
    await expect(page.getByRole('link', { name: /Ver la web/ }).first()).toBeVisible()
    await page.getByRole('switch', { name: 'Modo avión' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-offline', 'true')
    await expect(page.getByRole('button', { name: /Necesitas conexión/ })).toBeDisabled()
    await page.getByRole('switch', { name: 'Modo avión' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-offline', 'false')
  })

  test('el caso de JfooD enseña la arquitectura sin red', async ({ page }) => {
    await stubGithub(page)
    await page.goto('/proyectos/jfood/?offline=1')
    await ready(page)
    await expect(page.locator('html')).toHaveAttribute('data-offline', 'true')
    await expect(page.getByText('Sin red, la conexión con la API se corta')).toBeVisible()
    // El interruptor de la demostración y el de la barra están en el mismo estado.
    await expect(page.getByRole('switch', { name: 'Modo avión' })).toHaveCount(2)
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

  test('desde un caso de estudio, la paleta lleva a una sección de la portada', async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), 'Atajos de teclado: solo escritorio')
    await stubGithub(page)
    await page.goto('/proyectos/se7en/')
    await ready(page)
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: 'Buscar en la web' })
    await dialog.getByRole('combobox').fill('proceso')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/#proceso$/)
  })
})
