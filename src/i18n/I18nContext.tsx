import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { es, type Dict } from './es'
import { en } from './en'

export type Lang = 'es' | 'en'

interface I18nValue {
  lang: Lang
  t: Dict
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* sin almacenamiento: seguimos con el idioma del navegador */
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = (lang === 'es' ? es : en).docTitle
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* ignorar */
    }
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: lang === 'es' ? es : en,
      toggle: () => setLang((l) => (l === 'es' ? 'en' : 'es')),
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return ctx
}
