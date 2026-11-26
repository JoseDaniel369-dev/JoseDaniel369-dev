import { Suspense } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './i18n/I18nContext'
import { StatusBar } from './components/StatusBar'
import { Hero } from './components/Hero'
import { JfoodStory } from './components/JfoodStory'
import { HomeScreenStack } from './components/HomeScreenStack'
import { Marquee } from './components/Marquee'
import { Projects } from './components/Projects'
import { Services } from './components/Services'
import { Se7enStory } from './components/Se7enStory'
import { Principles } from './components/Principles'
import { useSpotlight } from './hooks/useSpotlight'
import { ContactChat } from './components/ContactChat'
import { Faq } from './components/Faq'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'

// Las funciones de animación (drag, layout, gestos) llegan después del primer pintado.
const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default)

export default function App() {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  useSpotlight()

  // Cada <Suspense> es un límite de hidratación: React hidrata el hero primero y las demás
  // secciones por turnos, cediendo el hilo entre una y otra (sin una sola tarea larga).
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures}>
        <a className="skip-link" href="#contenido">
          {t.bar.skip}
        </a>
        <StatusBar theme={theme} onToggleTheme={toggle} />
        <main id="contenido" tabIndex={-1}>
          <Hero />
          <Marquee />
          <Suspense>
            <Services />
          </Suspense>
          <Suspense>
            <Projects />
          </Suspense>
          <Suspense>
            <Se7enStory />
          </Suspense>
          <Suspense>
            <JfoodStory />
          </Suspense>
          <Suspense>
            <HomeScreenStack />
          </Suspense>
          <Suspense>
            <Principles />
          </Suspense>
          <Suspense>
            <Faq />
          </Suspense>
          <Suspense>
            <ContactChat />
          </Suspense>
        </main>
        <Suspense>
          <Footer />
        </Suspense>
        <CommandPalette />
      </LazyMotion>
    </MotionConfig>
  )
}
