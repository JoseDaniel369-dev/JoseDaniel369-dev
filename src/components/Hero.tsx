import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { Avatar } from './Avatar'
import { AirplaneSwitch } from './AirplaneSwitch'
import { Phone } from './Phone'
import { Screen } from './screens/Screens'
import './Hero.css'

const ease = [0.2, 0.8, 0.2, 1] as const

export function Hero() {
  const { t } = useI18n()
  const { offline } = useNetwork()

  return (
    <section className="hero" id="top">
      <div className="hero__inner wrap">
        <div className="hero__copy">
          <motion.div
            className="hero__card card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Avatar alt={t.hero.photoAlt} size={64} />
            <div>
              <p className="hero__name">{t.hero.name}</p>
              <p className="hero__role">{t.hero.role}</p>
            </div>
            <span className={`hero__status${offline ? ' is-off' : ''}`}>
              <i aria-hidden="true" />
              {offline ? t.hero.offline : t.hero.online}
            </span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            {t.hero.lead}
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            <a className="btn btn--primary" href="#proyecto">
              {t.hero.ctaProject}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="btn btn--outline" href="#contacto">
              {t.hero.ctaContact}
            </a>
          </motion.div>

          <motion.div
            className="hero__invite card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
          >
            <p aria-live="polite">{offline ? t.hero.inviteOn : t.hero.invite}</p>
            <AirplaneSwitch />
          </motion.div>
        </div>

        <motion.div
          className="hero__phone"
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
        >
          <Phone tilt label={t.project.mockCaption}>
            <Screen id="diary" />
          </Phone>
        </motion.div>
      </div>
    </section>
  )
}
