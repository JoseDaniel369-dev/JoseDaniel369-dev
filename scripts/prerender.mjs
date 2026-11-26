// Prerenderiza la web a HTML estático: una página por ruta e idioma (portada, casos de estudio y aviso legal,
// en ES y EN) y la 404. Se ejecuta después de `vite build` (npm run build lo encadena). Así Google, WhatsApp y
// quien no tenga JavaScript reciben el contenido real, y el navegador solo "hidrata" lo que ya está pintado.
// También escribe robots.txt y sitemap.xml, que dependen de las mismas rutas.
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { buildGraph } from './seo-data.mjs'

const dist = path.resolve('dist')
const site = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// Carga el módulo de servidor con el mismo vite.config.ts (respeta BASE, plugins y alias).
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { render, dictionaries, paths, indexablePages, langs } = await vite.ssrLoadModule('/src/entry-server.tsx')

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

/** URL absoluta de una página en un idioma (vacía si no se construye con SITE_URL). */
const abs = (page, lang) => (site ? `${site}/${paths[page][lang]}` : '')

// Una entrada por página e idioma, más la 404 (solo en español: el hosting la sirve en cualquier ruta desconocida).
const routes = [
  ...indexablePages.flatMap((page) =>
    langs.map((lang) => ({ page, lang, out: path.join(paths[page][lang], 'index.html') })),
  ),
  { page: 'notFound', lang: 'es', out: '404.html' },
]

const og = { es: { locale: 'es_ES', alt: 'en_US' }, en: { locale: 'en_US', alt: 'es_ES' } }
// Imagen para compartir de cada idioma (la genera scripts/og-image.mjs).
const ogImage = { es: 'og-image.png', en: 'og-image-en.png' }

// Analítica sin cookies (Cloudflare Web Analytics): solo si hay token al construir.
const beacon = process.env.VITE_CF_BEACON_TOKEN

for (const route of routes) {
  const { page, lang } = route
  const d = dictionaries[lang].meta[page]
  const indexable = page !== 'notFound'
  let html = template

  html = setTag(html, /<html lang="[^"]*">/, `<html lang="${lang}">`)
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(d.title)}</title>`)
  html = setTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(d.description)}" />`)
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(d.ogTitle)}" />`)
  html = setTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(d.ogDescription)}" />`)
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(d.ogTitle)}" />`)
  html = setTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(d.ogDescription)}" />`)
  html = setTag(html, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${og[lang].locale}" />`)
  html = setTag(html, /<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${og[lang].alt}" />`)
  if (!indexable) {
    html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex" />')
  }

  const head = [
    ...preloads,
    ...(site && indexable
      ? [
          `    <link rel="canonical" href="${abs(page, lang)}" />`,
          `    <link rel="alternate" hreflang="es" href="${abs(page, 'es')}" />`,
          `    <link rel="alternate" hreflang="en" href="${abs(page, 'en')}" />`,
          `    <link rel="alternate" hreflang="x-default" href="${abs(page, 'es')}" />`,
          `    <meta property="og:url" content="${abs(page, lang)}" />`,
          `    <meta property="og:image" content="${site}/${ogImage[lang]}" />`,
          `    <meta property="og:image:width" content="1200" />`,
          `    <meta property="og:image:height" content="630" />`,
          `    <meta property="og:image:alt" content="${esc(d.ogTitle)}" />`,
          `    <meta name="twitter:image" content="${site}/${ogImage[lang]}" />`,
        ]
      : []),
    ...(indexable
      ? [
          `    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': buildGraph(site, lang, page, (p) => abs(p, lang)) })}</script>`,
        ]
      : []),
    ...(beacon
      ? [`    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token: beacon })}'></script>`]
      : []),
  ].join('\n')
  html = html.replace('</head>', `${head}\n  </head>`)

  // El contenido ya va en el HTML: el <noscript> de respaldo sobra.
  html = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '')
  // data-page y data-lang le dicen al cliente qué página hidrata (la 404 se sirve en rutas arbitrarias).
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root" data-page="${page}" data-lang="${lang}">${render(lang, page)}</div>`)

  const file = path.join(dist, route.out)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  console.log(`prerender ${page}/${lang}: ${path.relative(process.cwd(), file)} (${(html.length / 1024).toFixed(1)} KB)`)
}

// robots.txt y sitemap.xml
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`)

if (site) {
  const alt = (l, href) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  const urls = indexablePages
    .flatMap((page) =>
      langs.map((lang) => {
        const links = [alt('es', abs(page, 'es')), alt('en', abs(page, 'en')), alt('x-default', abs(page, 'es'))].join('\n')
        return `  <url>\n    <loc>${abs(page, lang)}</loc>\n${links}\n  </url>`
      }),
    )
    .join('\n')
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  )
  console.log(`sitemap.xml: ${indexablePages.length * langs.length} URL`)
}

await vite.close()
