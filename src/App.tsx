import { LazyMotion, MotionConfig } from 'motion/react'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './i18n/I18nContext'
import { useSpotlight } from './hooks/useSpotlight'
import { StatusBar } from './components/StatusBar'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { MobileCta } from './components/MobileCta'
import { HomePage } from './pages/HomePage'
import { Se7enPage } from './pages/Se7enPage'
import { JfoodPage } from './pages/JfoodPage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Las funciones de animación (drag, layout, gestos) llegan después del primer pintado.
const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default)

/** Cada URL monta una sola página; la barra, el pie y la paleta son comunes a todas. */
export default function App() {
  const { theme, toggle } = useTheme()
  const { t, page } = useI18n()
  useSpotlight()

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures}>
        <a className="skip-link" href="#contenido">
          {t.bar.skip}
        </a>
        <StatusBar theme={theme} onToggleTheme={toggle} />
        <main id="contenido" tabIndex={-1}>
          {page === 'home' && <HomePage />}
          {page === 'se7en' && <Se7enPage />}
          {page === 'jfood' && <JfoodPage />}
          {page === 'legal' && <LegalPage />}
          {page === 'notFound' && <NotFoundPage />}
        </main>
        <Footer />
        <MobileCta />
        <CommandPalette />
      </LazyMotion>
    </MotionConfig>
  )
}
