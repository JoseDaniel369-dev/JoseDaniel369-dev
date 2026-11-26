import { Fragment, useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { Avatar } from './Avatar'
import { AirplaneSwitch } from './AirplaneSwitch'
import { Magnetic } from './Magnetic'
import { Phone } from './Phone'
import { Screen } from './screens/Screens'
import './Hero.css'

const ease = [0.2, 0.8, 0.2, 1] as const

/** Maquetas que alternan en el teléfono: la app (JfooD) y la web (Se7en). */
const rotation = ['diary', 'se7en'] as const

/**
 * El titular sube palabra a palabra con CSS puro (no depende de JS): así el LCP no espera
 * a la hidratación ni a ninguna animación orquestada.
 */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="word">
            <span className="word__in" style={{ ['--i' as string]: i }}>
              {w}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

/** Entrada escalonada de un bloque (CSS): `n` es su turno en la secuencia. */
const rise = (n: number) => ({ ['--i' as string]: n })

export function Hero() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Alterna solo si nadie ha elegido, el puntero no está encima y no hay "reducir movimiento".
  // Sin red se queda en JfooD: es la maqueta que cuenta la historia offline-first.
  useEffect(() => {
    if (offline || reduce || picked || hovered) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % rotation.length), 5500)
    return () => window.clearInterval(id)
  }, [offline, reduce, picked, hovered])

  const current = offline ? rotation[0] : rotation[index]
  const choices = [
    { id: 0, label: t.hero.screenJfood },
    { id: 1, label: t.hero.screenSe7en },
  ]

  return (
    <section className="hero" id="top">
      <div className="hero__inner wrap">
        <div className="hero__copy">
          <div className="hero__id rise" style={rise(0)}>
            <Avatar alt={t.hero.photoAlt} size={44} />
            <p>
              <span className="hero__name">{t.hero.name}</span>
              <span className="hero__role">{t.hero.role}</span>
            </p>
            <span className={`hero__status${offline ? ' is-off' : ''}`}>
              <i aria-hidden="true" />
              {offline ? t.hero.offline : t.hero.online}
            </span>
          </div>

          <h1 className="hero__title">
            <Words text={t.hero.title} />
          </h1>

          <p className="hero__lead rise" style={rise(5)}>
            {t.hero.lead}
          </p>

          <div className="hero__cta rise" style={rise(6)}>
            <Magnetic>
              <a className="btn btn--primary" href="#proyectos">
                {t.hero.ctaProject}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn--outline" href="#servicios">
                {t.hero.ctaServices}
              </a>
            </Magnetic>
          </div>
          <p className="hero__quote rise" style={rise(7)}>
            {t.hero.quote}
          </p>

          <ul className="hero__proof rise" style={rise(8)} aria-label={t.hero.proofLabel}>
            {t.hero.proof.map((p) => (
              <li key={p.label}>
                <a href={p.href}>{p.label}</a>
              </li>
            ))}
          </ul>

          <div className="hero__invite card rise" style={rise(9)}>
            <p aria-live="polite">{offline ? t.hero.inviteOn : t.hero.invite}</p>
            <AirplaneSwitch />
          </div>
        </div>

        <m.div
          className="hero__phone"
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Phone tilt label={current === 'se7en' ? t.se7en.mockCaption : t.project.mockCaption}>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current}
                style={{ height: '100%' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <Screen id={current} />
              </m.div>
            </AnimatePresence>
          </Phone>

          <div className="hero__screens" role="group" aria-label={t.hero.screensLabel}>
            {choices.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={current === rotation[c.id]}
                disabled={offline && c.id !== 0}
                onClick={() => {
                  setPicked(true)
                  setIndex(c.id)
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
