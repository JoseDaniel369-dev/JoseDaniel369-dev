import { ArrowUpRight, CalendarDays, Check, Clock, Globe, Image as ImageIcon, MapPin, Send, WifiOff, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { BrowserFrame } from './BrowserFrame'
import { Phone } from './Phone'
import { Screen } from './screens/Screens'
import { Se7enNumbers } from './Se7enNumbers'
import { Testimonials } from './Testimonials'
import './JfoodStory.css'
import './Se7enStory.css'

const builtIcons: Record<string, LucideIcon> = {
  clock: Clock,
  calendar: CalendarDays,
  gallery: ImageIcon,
  form: Send,
  map: MapPin,
}

/** Portada de escritorio de la web de Se7en. Es una maqueta: sin fotos de personas del gimnasio. */
function DesktopMock() {
  return (
    <div className="dm">
      <div className="dm__nav">
        <b>SE7EN</b>
        <span>Disciplinas</span>
        <span>Horarios</span>
        <span>Tarifas</span>
        <span>Galería</span>
        <span className="dm__cta">Clase gratis</span>
      </div>
      <div className="dm__hero">
        <div className="dm__copy">
          <p className="dm__title">Jiu-Jitsu, Muay Thai y MMA en Antequera</p>
          <div className="dm__next">
            <span>Próxima clase</span>
            <strong>Hoy, 19:00 · BJJ</strong>
          </div>
          <div className="dm__btns">
            <span className="dm__fill">Reservar clase gratis</span>
            <span>Ver horarios</span>
          </div>
        </div>
        <div className="dm__frame">
          <i />
        </div>
      </div>
    </div>
  )
}

export function Se7enStory() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const s = t.se7en
  const tech = projects.find((p) => p.id === 'se7en')?.tech ?? []
  const host = new URL(profile.se7en.siteUrl).host

  return (
    <section className="section" id="se7en" aria-labelledby="se7en-title">
      <div className="wrap">
        <span className="chip story__chip">{s.caseStudyChip}</span>
        <h2 id="se7en-title" className="section__title">
          {s.title}
        </h2>
        <p className="section__lead">{s.tagline}</p>
        <p className="story__body">{s.body}</p>

        <p className={`s7__status${profile.se7en.launched ? ' is-live' : ''}`}>
          <i aria-hidden="true" />
          {profile.se7en.launched ? s.statusLive : s.statusPreview}
        </p>

        <div className="story__cta">
          {offline ? (
            <button className="btn btn--ink" type="button" disabled>
              <WifiOff size={18} aria-hidden="true" />
              {s.visitOffline}
            </button>
          ) : (
            <a className="btn btn--ink" href={profile.se7en.siteUrl} target="_blank" rel="noreferrer">
              <Globe size={18} aria-hidden="true" />
              {s.visit}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
          <a className="btn btn--outline" href="#contacto">
            {s.want}
          </a>
        </div>
        <p className="s7__note">{s.privateNote}</p>

        <div className="s7__shots">
          <BrowserFrame label={s.browserLabel} url={host}>
            <DesktopMock />
          </BrowserFrame>
          <div className="s7__phone">
            <Phone label={s.mockCaption}>
              <Screen id="se7en" />
            </Phone>
          </div>
        </div>
        <p className="story__caption s7__caption">{s.mockCaption}</p>

        <Se7enNumbers />

        <Testimonials project="se7en" />

        <div className="s7__block">
          <h3 className="s7__h">{s.challengeTitle}</h3>
          <p className="s7__challenge">{s.challenge}</p>
          <ul className="s7__built">
            {s.decisions.map((d) => (
              <li key={d.t} className="card spot">
                <h4>{d.t}</h4>
                <p>{d.d}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="s7__block">
          <h3 className="s7__h">{s.builtTitle}</h3>
          <ul className="s7__built">
            {s.built.map((b) => {
              const Icon = builtIcons[b.id]
              return (
                <li key={b.id} className="card spot">
                  <span className="s7__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h4>{b.t}</h4>
                  <p>{b.d}</p>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="s7__block">
          <h3 className="s7__h">{s.marketingTitle}</h3>
          <div className="s7__marketing card">
            {[
              { title: s.marketingOnTitle, items: s.marketingOn },
              { title: s.marketingOffTitle, items: s.marketingOff },
            ].map((col) => (
              <div key={col.title}>
                <h4>{col.title}</h4>
                <ul>
                  {col.items.map((it) => (
                    <li key={it}>
                      <Check size={18} aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ul className="project__tech s7__tech" aria-label={s.stackLabel}>
          {tech.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
