import { MotionConfig } from 'motion/react'
import { useTheme } from './hooks/useTheme'
import { StatusBar } from './components/StatusBar'
import { Hero } from './components/Hero'
import { JfoodStory } from './components/JfoodStory'
import { HomeScreenStack } from './components/HomeScreenStack'
import { NotificationsTimeline } from './components/NotificationsTimeline'
import { ContactChat } from './components/ContactChat'
import { Footer } from './components/Footer'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <StatusBar theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <JfoodStory />
        <HomeScreenStack />
        <NotificationsTimeline />
        <ContactChat />
      </main>
      <Footer />
    </MotionConfig>
  )
}
