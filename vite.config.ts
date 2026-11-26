import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * robots.txt y sitemap.xml en el build. El resto del SEO (título, descripción, canonical, hreflang,
 * Open Graph y datos estructurados) lo escribe scripts/prerender.mjs en el HTML de cada idioma.
 * Con SITE_URL (p. ej. SITE_URL=https://tu-dominio.com npm run build) el sitemap lista las dos URLs.
 */
function seo(): Plugin {
  const site = (process.env.SITE_URL ?? '').replace(/\/+$/, '')

  return {
    name: 'seo',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`,
      })
      if (site) {
        const alt = (lang: string, href: string) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`
        const links = [alt('es', `${site}/`), alt('en', `${site}/en/`), alt('x-default', `${site}/`)].join('\n')
        const url = (loc: string) => `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${url(`${site}/`)}\n${url(`${site}/en/`)}\n</urlset>\n`,
        })
      }
    },
  }
}

// Para GitHub Pages en un repo (p. ej. /portfolio/) lanza: BASE=/portfolio/ npm run build
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), seo()],
})
