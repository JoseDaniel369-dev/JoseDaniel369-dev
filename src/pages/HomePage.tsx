import { Suspense } from 'react'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { Clients } from '../components/Clients'
import { Projects } from '../components/Projects'
import { Process } from '../components/Process'
import { Principles } from '../components/Principles'
import { Marquee } from '../components/Marquee'
import { HomeScreenStack } from '../components/HomeScreenStack'
import { Faq } from '../components/Faq'
import { ContactChat } from '../components/ContactChat'

/**
 * Portada: orientada a que una empresa entienda qué ofrezco, vea pruebas y contacte.
 * Cada <Suspense> es un límite de hidratación: React hidrata el hero primero y las demás secciones
 * por turnos, cediendo el hilo entre una y otra (sin una sola tarea larga).
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Suspense>
        <Services />
      </Suspense>
      <Suspense>
        <Clients />
      </Suspense>
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Process />
      </Suspense>
      <Suspense>
        <Principles />
      </Suspense>
      <Marquee />
      <Suspense>
        <HomeScreenStack />
      </Suspense>
      <Suspense>
        <Faq />
      </Suspense>
      <Suspense>
        <ContactChat />
      </Suspense>
    </>
  )
}
