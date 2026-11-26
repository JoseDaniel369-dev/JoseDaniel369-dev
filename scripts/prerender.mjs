// Prerenderiza la web a HTML estático, una página por idioma: dist/index.html (ES) y dist/en/index.html (EN).
// Se ejecuta después de `vite build` (npm run build lo encadena). Así Google, WhatsApp y quien no tenga
// JavaScript reciben el contenido real, y el navegador solo "hidrata" lo que ya está pintado.
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { buildGraph } from './seo-data.mjs'

const dist = path.resolve('dist')
const site = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// Carga el módulo de servidor con el mismo vite.config.ts (respeta BASE, plugins y alias).
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { render, dictionaries } = await vite.ssrLoadModule('/src/entry-server.tsx')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Sustituye el contenido de una etiqueta del <head> y falla si la plantilla ya no la tiene. */
function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`La plantilla no tiene ${pattern}`)
  return html.replace(pattern, replacement)
}

// Fuente principal precargada (si el build la trae): evita el parpadeo del texto al cargarla.
const assets = fs.existsSync(path.join(dist, 'assets')) ? fs.readdirSync(path.join(dist, 'assets')) : []
const base = process.env.BASE ?? '/'
const preloads = assets
  .filter((f) => /^(bricolage-grotesque-latin-standard-normal|instrument-sans-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `    <link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/${f}" />`)

const pages = [
  { lang: 'es', out: 'index.html', url: site ? `${site}/` : '' },
  { lang: 'en', out: path.join('en', 'index.html'), url: site ? `${site}/en/` : '' },
]
const og = { es: { locale: 'es_ES', alt: 'en_US' }, en: { locale: 'en_US', alt: 'es_ES' } }

for (const page of pages) {
  const d = dictionaries[page.lang]
  let html = template

  html = setTag(html, /<html lang="[^"]*">/, `<html lang="${page.lang}">`)
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(d.docTitle)}</title>`)
  html = setTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(d.docDescription)}" />`)
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(d.docOgTitle)}" />`)
  html = setTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(d.docOgDescription)}" />`)
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(d.docOgTitle)}" />`)
  html = setTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(d.docOgDescription)}" />`)
  html = setTag(html, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${og[page.lang].locale}" />`)
  html = setTag(html, /<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${og[page.lang].alt}" />`)

  const head = [
    ...preloads,
    ...(site
      ? [
          `    <link rel="canonical" href="${page.url}" />`,
          `    <link rel="alternate" hreflang="es" href="${site}/" />`,
          `    <link rel="alternate" hreflang="en" href="${site}/en/" />`,
          `    <link rel="alternate" hreflang="x-default" href="${site}/" />`,
          `    <meta property="og:url" content="${page.url}" />`,
          `    <meta property="og:image" content="${site}/og-image.png" />`,
          `    <meta property="og:image:width" content="1200" />`,
          `    <meta property="og:image:height" content="630" />`,
          `    <meta name="twitter:image" content="${site}/og-image.png" />`,
        ]
      : []),
    `    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': buildGraph(site, page.lang) })}</script>`,
  ].join('\n')
  html = html.replace('</head>', `${head}\n  </head>`)

  // El contenido ya va en el HTML: el <noscript> de respaldo sobra.
  html = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '')
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${render(page.lang)}</div>`)

  const file = path.join(dist, page.out)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  console.log(`prerender ${page.lang}: ${path.relative(process.cwd(), file)} (${(html.length / 1024).toFixed(1)} KB)`)
}

await vite.close()
