import { renderToString } from 'react-dom/server'
import { I18nProvider } from './i18n/I18nContext'
import { NetworkProvider } from './context/NetworkContext'
import type { Lang } from './i18n/lang'
import { es } from './i18n/es'
import { en } from './i18n/en'
import App from './App'

/** Usado por scripts/prerender.mjs: devuelve el HTML de la web entera en un idioma. */
export function render(lang: Lang): string {
  return renderToString(
    <I18nProvider lang={lang}>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </I18nProvider>,
  )
}

export const dictionaries = { es, en }
