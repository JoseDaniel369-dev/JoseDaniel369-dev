import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { I18nProvider } from './i18n/I18nContext'
import { routeFromPath, type Lang, type Page } from './routes'
import { NetworkProvider } from './context/NetworkContext'
import App from './App'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/instrument-sans/index.css'
import './styles/tokens.css'

const root = document.getElementById('root')!

// El HTML prerenderizado declara su página e idioma en data-*: así el cliente hidrata exactamente lo que
// llegó (también en la 404, que se sirve en cualquier ruta). En desarrollo no hay data-*: se deduce de la URL.
const fromUrl = routeFromPath(location.pathname)
const lang = (root.dataset.lang as Lang | undefined) ?? fromUrl.lang
const page = (root.dataset.page as Page | undefined) ?? fromUrl.page

const app = (
  <StrictMode>
    <I18nProvider lang={lang} page={page}>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </I18nProvider>
  </StrictMode>
)

// En producción el HTML llega prerenderizado y solo se hidrata; en desarrollo se pinta desde cero.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
