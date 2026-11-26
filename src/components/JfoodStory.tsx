import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, Download } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { Phone } from './Phone'
import { Screen, type ScreenId } from './screens/Screens'
import { ArchitectureFlow } from './ArchitectureFlow'
import { JfoodNumbers } from './JfoodNumbers'
import { LivePanel } from './LivePanel'
import './JfoodStory.css'

export function JfoodStory() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const p = t.project
  const [active, setActive] = useState<ScreenId>('diary')
  const refs = useRef<Record<string, HTMLElement | null>>({})

  // En escritorio los pasos están todos visibles: el que cruza el centro del viewport manda.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute('data-step') as ScreenId)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    Object.values(refs.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section" id="jfood" aria-labelledby="project-title">
      <div className="wrap">
        <span className="chip story__chip">{p.caseStudyChip}</span>
        <h2 id="project-title" className="section__title">
          {p.title}
        </h2>
        <p className="section__lead">{p.tagline}</p>
        <p className="story__body">{p.body}</p>
        <div className="story__cta">
          <a className="btn btn--ink" href={profile.jfood.repoUrl} target="_blank" rel="noreferrer">
            {p.repo}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="btn btn--outline" href={profile.jfood.releaseUrl} target="_blank" rel="noreferrer">
            <Download size={18} aria-hidden="true" />
            {p.download}
          </a>
        </div>

        <JfoodNumbers />

        <div className="story">
          <div className="story__phone">
            <Phone label={p.mockCaption}>
              <AnimatePresence mode="wait">
                <m.div
                  key={active + String(offline)}
                  style={{ height: '100%' }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <Screen id={active} />
                </m.div>
              </AnimatePresence>
            </Phone>
            <p className="story__caption">{p.mockCaption}</p>
          </div>

          <div className="story__tabs" role="tablist" aria-label={p.stepsLabel}>
            {p.steps.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={active === s.id}
                className={active === s.id ? 'is-on' : ''}
                onClick={() => setActive(s.id as ScreenId)}
              >
                {s.t}
              </button>
            ))}
          </div>

          <ol className="story__steps">
            {p.steps.map((s) => (
              <li
                key={s.id}
                data-step={s.id}
                data-active={active === s.id}
                ref={(el) => {
                  refs.current[s.id] = el
                }}
                className="step"
              >
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                {s.id === 'ai' && offline && <p className="step__offline">{p.offlineNote}</p>}
              </li>
            ))}
          </ol>
        </div>

        <ArchitectureFlow />
        <LivePanel />
      </div>
    </section>
  )
}
