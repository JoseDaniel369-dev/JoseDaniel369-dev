import { expect, type Page } from '@playwright/test'

/** Todas las páginas indexables, en los dos idiomas. `h1` es un fragmento del titular principal. */
export const sitePages = [
  { key: 'home', path: '/', lang: 'es', h1: 'Webs, apps y automatizaciones' },
  { key: 'home', path: '/en/', lang: 'en', h1: 'Custom websites, apps and automation' },
  { key: 'se7en', path: '/proyectos/se7en/', lang: 'es', h1: 'Se7en Antequera' },
  { key: 'se7en', path: '/en/projects/se7en/', lang: 'en', h1: 'Se7en Antequera' },
  { key: 'jfood', path: '/proyectos/jfood/', lang: 'es', h1: 'JfooD' },
  { key: 'jfood', path: '/en/projects/jfood/', lang: 'en', h1: 'JfooD' },
  { key: 'legal', path: '/aviso-legal/', lang: 'es', h1: 'Aviso legal y privacidad' },
  { key: 'legal', path: '/en/legal/', lang: 'en', h1: 'Legal notice and privacy' },
] as const

/** Espera a que React haya hidratado (la barra pinta la hora solo en el cliente). */
export async function ready(page: Page) {
  await expect(page.locator('.bar__time')).not.toBeEmpty()
}

/** Recorre la página entera para que todas las secciones se pinten (content-visibility las salta fuera de pantalla). */
export async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(20)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
}

/**
 * Espera a que no quede ninguna animación ni transición en curso. Con "reducir movimiento" (que usan las pruebas)
 * duran milisegundos, pero bajo mucha carga axe podía medir los colores a mitad de una y dar falsos positivos.
 */
export async function settled(page: Page) {
  // Las animaciones terminadas que se quedan fijadas (fill) no cuentan: solo las que siguen en marcha.
  await page
    .waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), undefined, { timeout: 4000 })
    .catch(() => undefined)
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

/**
 * Responde a las peticiones de GitHub con datos fijos: el panel de JfooD las hace al verse, y un límite de
 * peticiones o una caída de GitHub no debe romper las pruebas.
 */
export async function stubGithub(page: Page) {
  await page.route('https://api.github.com/**', (route) => {
    const url = route.request().url()
    const json = url.endsWith('/languages')
      ? { TypeScript: 9600, JavaScript: 400 }
      : url.endsWith('/releases/latest')
        ? { tag_name: 'v0.2.0' }
        : { pushed_at: new Date().toISOString(), stargazers_count: 0 }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(json),
    })
  })
}

/** Texto visible de un HTML: sin scripts, estilos ni etiquetas (el titular va partido en un <span> por palabra). */
export const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
