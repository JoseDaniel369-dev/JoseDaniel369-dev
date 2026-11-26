// Capturas reales de la web de Se7en para el caso de estudio. Script puntual: no forma parte del build.
// Uso:  node scripts/capture-se7en.mjs [carpeta-de-salida]
// Por defecto escribe en public/shots/se7en/. Las imágenes se suben al repositorio.
//
// Cada captura sale en dos tamaños (para srcset): escritorio a 1280 y 640 px de ancho, móvil a 780 y 390 px,
// en WebP (un ~45 % más ligero que JPEG). Se recodifica con el propio Chromium, sin dependencias extra.
// Solo se capturan pantallas con permiso del cliente (el gimnasio autorizó enseñar su web tal cual).
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const SITE = process.env.SE7EN_URL ?? 'https://se7enmartialartsgymweb.josedanielgarcialeon4.workers.dev'
const out = path.resolve(process.argv[2] ?? 'public/shots/se7en')
fs.mkdirSync(out, { recursive: true })

// name: archivo de salida · route: ruta de la web de Se7en
const shots = [
  { name: 'home', route: '/' },
  { name: 'horarios', route: '/horarios' },
  { name: 'clase', route: '/clase-de-prueba' },
]

const targets = [
  { kind: 'desktop', viewport: { width: 1280, height: 800 }, scales: [1, 0.5], isMobile: false },
  { kind: 'mobile', viewport: { width: 390, height: 844 }, scales: [2, 1], isMobile: true },
]

const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' })

// Página auxiliar que convierte un PNG en WebP con el codificador del navegador.
const encoder = await browser.newPage()
await encoder.goto('about:blank')
async function toWebp(png) {
  const b64 = await encoder.evaluate(async (data) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + data
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8))
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result).split(',')[1])
      reader.readAsDataURL(blob)
    })
  }, png.toString('base64'))
  return Buffer.from(b64, 'base64')
}

for (const target of targets) {
  for (const scale of target.scales) {
    const ctx = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: scale,
      isMobile: target.isMobile && scale >= 1,
      hasTouch: target.isMobile,
      reducedMotion: 'reduce',
      locale: 'es-ES',
      timezoneId: 'Europe/Madrid',
    })
    const page = await ctx.newPage()
    for (const shot of shots) {
      await page.goto(SITE + shot.route, { waitUntil: 'networkidle' })
      // La web enseña una cortinilla de entrada y carga fuentes y fotos: se deja asentar antes de capturar.
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(2500)
      const width = Math.round(target.viewport.width * scale)
      const file = path.join(out, `${shot.name}-${target.kind}-${width}.webp`)
      fs.writeFileSync(file, await toWebp(await page.screenshot({ type: 'png' })))
      console.log(`${path.relative(process.cwd(), file)}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`)
    }
    await ctx.close()
  }
}

await browser.close()
