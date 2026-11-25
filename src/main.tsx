import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './i18n/I18nContext'
import { NetworkProvider } from './context/NetworkContext'
import App from './App'
import './styles/tokens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </I18nProvider>
  </StrictMode>,
)
