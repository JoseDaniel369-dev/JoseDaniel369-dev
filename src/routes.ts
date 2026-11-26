// Páginas del sitio y sus URLs. Cada página existe como HTML estático en los dos idiomas
// (la prerenderiza scripts/prerender.mjs), así que no hace falta ninguna librería de rutas.

export type Lang = 'es' | 'en'

/** `notFound` es la página 404: no tiene URL propia (la sirve el hosting en cualquier ruta desconocida). */
export type Page = 'home' | 'se7en' | 'jfood' | 'legal' | 'notFound'

/** Ruta base del sitio con barra final (p. ej. '/' o '/JoseDaniel369-dev/'). */
export const BASE = import.meta.env.BASE_URL

/** Rutas relativas a BASE de las páginas indexables, por idioma. */
export const paths = {
  home: { es: '', en: 'en/' },
  se7en: { es: 'proyectos/se7en/', en: 'en/projects/se7en/' },
  jfood: { es: 'proyectos/jfood/', en: 'en/projects/jfood/' },
  legal: { es: 'aviso-legal/', en: 'en/legal/' },
} as const

export type IndexablePage = keyof typeof paths

export const indexablePages = Object.keys(paths) as IndexablePage[]
export const langs: Lang[] = ['es', 'en']

/** URL (con BASE) de una página en un idioma. */
export function pathFor(page: IndexablePage, lang: Lang): string {
  return BASE + paths[page][lang]
}

/** Página e idioma que corresponden a una ruta del navegador. Cualquier ruta desconocida es la 404. */
export function routeFromPath(pathname: string): { page: Page; lang: Lang } {
  let rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  rel = rel.replace(/index\.html$/, '')
  if (rel && !rel.endsWith('/')) rel += '/'
  for (const page of indexablePages) {
    for (const lang of langs) if (paths[page][lang] === rel) return { page, lang }
  }
  return { page: 'notFound', lang: rel.startsWith('en/') ? 'en' : 'es' }
}
