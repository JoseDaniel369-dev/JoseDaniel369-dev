import { MotionConfig } from 'motion/react'
import { useTheme } from './hooks/useTheme'
import { StatusBar } from './components/StatusBar'
import { Hero } from './components/Hero'
import { JfoodStory } from './components/JfoodStory'
import { HomeScreenStack } from './components/HomeScreenStack'
import { Marquee } from './components/Marquee'
import { Projects } from './components/Projects'
import { Principles } from './components/Principles'
import { useSpotlight } from './hooks/useSpotlight'
import { ContactChat } from './components/ContactChat'
import { Footer } from './components/Footer'

export default function App() {
  const { theme, toggle } = useTheme()
  useSpotlight()

  return (
    <MotionConfig reducedMotion="user">
      <StatusBar theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <JfoodStory />
        <HomeScreenStack />
        <Principles />
        <ContactChat />
      </main>
      <Footer />
    </MotionConfig>
  )
}
