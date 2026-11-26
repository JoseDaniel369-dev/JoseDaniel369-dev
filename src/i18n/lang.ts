export type Lang = 'es' | 'en'

/** Ruta base del sitio con barra final (p. ej. '/' o '/JoseDaniel369-dev/'). */
export const BASE = import.meta.env.BASE_URL

/** Cada idioma tiene su propia URL: '/' es español y '/en/' inglés (así Google puede indexar los dos). */
export function pathFor(lang: Lang): string {
  return lang === 'en' ? `${BASE}en/` : BASE
}

export function langFromPath(pathname: string): Lang {
  return pathname.startsWith(`${BASE}en`) ? 'en' : 'es'
}
