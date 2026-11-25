import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * SEO en build.
 * - Sin SITE_URL: genera robots.txt y los datos estructurados (JSON-LD) que no necesitan URL.
 * - Con SITE_URL (p. ej. SITE_URL=https://tu-dominio.com npm run build): añade además
 *   canonical, Open Graph con URL absoluta, Twitter card y sitemap.xml.
 */
function seo(): Plugin {
  const site = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
  const github = 'https://github.com/JoseDaniel369-dev'
  // Añade aquí tu LinkedIn cuando lo tengas: mejora el panel de conocimiento de Google.
  const sameAs = [github]

  const graph = [
    {
      '@type': 'Person',
      '@id': `${site}/#person`,
      name: 'Jose Daniel García León',
      jobTitle: 'Desarrollador full-stack',
      description:
        'Desarrollador full-stack que construye apps enteras, desde la base de datos hasta la pantalla, con React Native, TypeScript y Node.js.',
      knowsAbout: ['React Native', 'TypeScript', 'Node.js', 'Expo', 'Fastify', 'SQLite', 'Apps offline-first', 'Diseño de APIs'],
      sameAs,
      ...(site && { url: `${site}/` }),
    },
    // Cada app que publiques puede tener su propio bloque SoftwareApplication como este.
    {
      '@type': 'SoftwareApplication',
      name: 'JfooD',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Android',
      description:
        'Contador de nutrición gratuito y offline-first para Android, con reconocimiento de comida por IA. Sin anuncios, sin suscripción y sin cuenta.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      license: 'https://opensource.org/licenses/MIT',
      downloadUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
      author: { '@id': `${site}/#person` },
    },
  ]

  return {
    name: 'seo',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
          injectTo: 'head',
        },
      ]
      if (site) {
        const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${site}/` }, injectTo: 'head' },
          meta({ property: 'og:url', content: `${site}/` }),
          meta({ property: 'og:image', content: `${site}/og-image.png` }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ name: 'twitter:image', content: `${site}/og-image.png` }),
        )
      }
      return tags
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`,
      })
      if (site) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc></url>\n</urlset>\n`,
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


