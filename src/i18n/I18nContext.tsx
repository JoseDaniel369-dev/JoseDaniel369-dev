import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { es, type Dict } from './es'
import { en } from './en'
import { pathFor, type IndexablePage, type Lang, type Page } from '../routes'

export type { Lang, Page } from '../routes'

interface I18nValue {
  lang: Lang
  page: Page
  t: Dict
  /** URL de la misma página en el otro idioma: el botón ES/EN es un enlace normal, no un estado. */
  otherHref: string
  /** URL (con la base del sitio) de una página en el idioma actual. */
  href: (page: IndexablePage) => string
  /** Enlace a una sección de la portada: `#id` si ya estás en ella, y la portada con `#id` desde otra página. */
  sec: (id: string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

/** El idioma y la página vienen de la URL (los fija quien renderiza), así servidor y cliente coinciden siempre. */
export function I18nProvider({ lang, page, children }: { lang: Lang; page: Page; children: ReactNode }) {
  useEffect(() => {
    // Con el HTML prerenderizado ya viene bien; esto cubre el modo desarrollo.
    const dict = lang === 'es' ? es : en
    document.documentElement.lang = lang
    document.title = dict.meta[page].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta[page].description)
  }, [lang, page])

  const value = useMemo<I18nValue>(() => {
    const other: Lang = lang === 'es' ? 'en' : 'es'
    const own: IndexablePage = page === 'notFound' ? 'home' : page
    return {
      lang,
      page,
      t: lang === 'es' ? es : en,
      otherHref: pathFor(own, other),
      href: (p) => pathFor(p, lang),
      sec: (id) => (page === 'home' ? `#${id}` : `${pathFor('home', lang)}#${id}`),
    }
  }, [lang, page])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return ctx
}
