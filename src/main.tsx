import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { I18nProvider } from './i18n/I18nContext'
import { langFromPath } from './i18n/lang'
import { NetworkProvider } from './context/NetworkContext'
import App from './App'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/instrument-sans/index.css'
import './styles/tokens.css'

const app = (
  <StrictMode>
    <I18nProvider lang={langFromPath(location.pathname)}>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </I18nProvider>
  </StrictMode>
)

const root = document.getElementById('root')!
// En producción el HTML llega prerenderizado y solo se hidrata; en desarrollo se pinta desde cero.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
