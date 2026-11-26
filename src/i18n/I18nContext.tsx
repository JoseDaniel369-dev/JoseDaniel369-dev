import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { es, type Dict } from './es'
import { en } from './en'
import { pathFor, type Lang } from './lang'

export type { Lang } from './lang'

interface I18nValue {
  lang: Lang
  t: Dict
  /** URL del otro idioma: el botón ES/EN es un enlace normal, no un estado. */
  otherHref: string
}

const I18nContext = createContext<I18nValue | null>(null)

/** El idioma viene de la URL (la fija quien renderiza), así servidor y cliente coinciden siempre. */
export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    // Con el HTML prerenderizado ya viene bien; esto cubre el modo desarrollo.
    const dict = lang === 'es' ? es : en
    document.documentElement.lang = lang
    document.title = dict.docTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.docDescription)
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({ lang, t: lang === 'es' ? es : en, otherHref: pathFor(lang === 'es' ? 'en' : 'es') }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return ctx
}
