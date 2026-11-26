// Genera la imagen para compartir (Open Graph, 1200×630) en español e inglés.
// Script puntual: no forma parte del build. Uso:  node scripts/og-image.mjs
// Escribe public/og-image.png (ES) y public/og-image-en.png (EN). Las imágenes se suben al repositorio.
// Usa las mismas fuentes que la web (de node_modules) y la captura real de Se7en de public/shots/.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const root = process.cwd()
const url = (...p) => pathToFileURL(path.join(root, ...p)).href

const fonts = {
  bricolage: url('node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2'),
  instrument: url('node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2'),
}
const shot = url('public/shots/se7en/home-mobile-780.webp')

const copy = {
  es: {
    file: 'public/og-image.png',
    role: 'Desarrollador independiente',
    title: 'Webs, apps y automatizaciones a medida',
    sub: 'Hablando directamente con quien las programa.',
    chips: ['Desarrollo web', 'Apps y software', 'Automatización e IA'],
    place: 'Málaga · en remoto',
  },
  en: {
    file: 'public/og-image-en.png',
    role: 'Independent developer',
    title: 'Custom websites, apps and automation',
    sub: 'Working directly with the person who builds them.',
    chips: ['Web development', 'Apps and software', 'Automation and AI'],
    place: 'Málaga, Spain · remote',
  },
}

const html = (c) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: 'Bricolage'; src: url('${fonts.bricolage}') format('woff2'); font-weight: 200 800; font-stretch: 75% 100%; }
  @font-face { font-family: 'Instrument'; src: url('${fonts.instrument}') format('woff2'); font-weight: 400 700; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #eef2f6; color: #0b1220; font-family: 'Instrument', system-ui, sans-serif; }
  .bg { position: absolute; inset: 0; background: radial-gradient(760px 520px at 92% 0%, rgba(42, 96, 238, 0.22), transparent 70%); }
  .dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(11, 18, 32, 0.16) 1px, transparent 1.4px); background-size: 28px 28px; -webkit-mask-image: radial-gradient(60% 70% at 78% 30%, #000, transparent 80%); }
  .left { position: absolute; left: 72px; top: 64px; width: 690px; height: 502px; display: flex; flex-direction: column; }
  .id { display: flex; align-items: center; gap: 18px; }
  .mono { width: 64px; height: 64px; border-radius: 18px; background: #0b1220; color: #eef2f6; display: grid; place-items: center; font: 800 26px 'Bricolage'; letter-spacing: -0.03em; }
  .name { font: 700 30px 'Bricolage'; letter-spacing: -0.02em; line-height: 1.1; }
  .role { color: #55607a; font-size: 22px; line-height: 1.2; }
  h1 { margin-top: 36px; font: 800 70px/0.98 'Bricolage'; font-stretch: 92%; letter-spacing: -0.035em; }
  .sub { margin-top: 20px; color: #55607a; font-size: 28px; line-height: 1.3; }
  .chips { margin-top: auto; display: flex; gap: 12px; flex-wrap: wrap; }
  .chip { padding: 10px 20px; border-radius: 999px; background: #fff; border: 1.5px solid rgba(11, 18, 32, 0.12); font: 700 21px 'Instrument'; }
  .chip:first-child { background: #2a60ee; border-color: #2a60ee; color: #fff; }
  .place { margin-top: 16px; color: #55607a; font-size: 21px; }
  .phone { position: absolute; right: 86px; top: 50px; width: 298px; height: 596px; padding: 11px; border-radius: 46px; background: #0b1220; transform: rotate(5deg); box-shadow: inset 0 0 0 2px #2a3550, 0 40px 70px -26px rgba(42, 96, 238, 0.5), 0 24px 40px -20px rgba(0, 0, 0, 0.5); }
  .screen { width: 100%; height: 100%; border-radius: 36px; overflow: hidden; background: #0a0505; position: relative; }
  .screen img { display: block; width: 100%; margin-top: 34px; height: calc(100% - 34px); object-fit: cover; object-position: top center; }
  .island { position: absolute; top: 11px; left: 50%; width: 92px; height: 24px; margin-left: -46px; border-radius: 999px; background: #0b1220; z-index: 2; }
</style></head>
<body>
  <div class="bg"></div><div class="dots"></div>
  <div class="left">
    <div class="id"><div class="mono">JD</div><div><div class="name">Jose Daniel García León</div><div class="role">${c.role}</div></div></div>
    <h1>${c.title}</h1>
    <p class="sub">${c.sub}</p>
    <div class="chips">${c.chips.map((x) => `<span class="chip">${x}</span>`).join('')}</div>
    <p class="place">${c.place}</p>
  </div>
  <div class="phone"><div class="screen"><span class="island"></span><img src="${shot}" alt="" /></div></div>
</body></html>`

const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'))

for (const c of Object.values(copy)) {
  const file = path.join(tmp, 'og.html')
  fs.writeFileSync(file, html(c))
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.images].every((i) => i.complete))
  await page.screenshot({ path: path.join(root, c.file), type: 'png' })
  console.log(`${c.file}  ${(fs.statSync(path.join(root, c.file)).size / 1024).toFixed(0)} KB`)
}

await browser.close()
fs.rmSync(tmp, { recursive: true, force: true })
