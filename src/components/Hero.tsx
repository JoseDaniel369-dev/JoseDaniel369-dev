import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { Avatar } from './Avatar'
import { AirplaneSwitch } from './AirplaneSwitch'
import { Magnetic } from './Magnetic'
import { Phone } from './Phone'
import { Screen } from './screens/Screens'
import './Hero.css'

const ease = [0.2, 0.8, 0.2, 1] as const

/** El titular sube palabra a palabra: es el único momento orquestado de la entrada. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="word">
            <motion.span
              className="word__in"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease, delay: 0.1 + i * 0.07 }}
            >
              {w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

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

          <h1 className="hero__title">
            <Words text={t.hero.title} />
          </h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
          >
            {t.hero.lead}
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.65 }}
          >
            <Magnetic>
              <a className="btn btn--primary" href="#proyectos">
                {t.hero.ctaProject}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn--outline" href="#contacto">
                {t.hero.ctaContact}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            className="hero__invite card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.75 }}
          >
            <p aria-live="polite">{offline ? t.hero.inviteOn : t.hero.invite}</p>
            <AirplaneSwitch />
          </motion.div>
        </div>

        <motion.div
          className="hero__phone"
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
        >
          <Phone tilt label={t.project.mockCaption}>
            <Screen id="diary" />
          </Phone>
        </motion.div>
      </div>
    </section>
  )
}
