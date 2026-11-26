import { ArrowUpRight, CalendarDays, Check, Clock, Globe, Image as ImageIcon, MapPin, Send, WifiOff, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { projectById } from '../data/projects'
import { BrowserFrame } from '../components/BrowserFrame'
import { CaseCta } from '../components/CaseCta'
import { CaseHeader } from '../components/CaseHeader'
import { Phone } from '../components/Phone'
import { QuoteLink } from '../components/QuoteLink'
import { Se7enNumbers } from '../components/Se7enNumbers'
import { Shot } from '../components/Shot'
import { Testimonials } from '../components/Testimonials'
import '../components/Case.css'

const builtIcons: Record<string, LucideIcon> = {
  clock: Clock,
  calendar: CalendarDays,
  gallery: ImageIcon,
  form: Send,
  map: MapPin,
}

/** Caso de estudio de Se7en: un trabajo real para un cliente, con capturas reales y cifras medidas. */
export function Se7enPage() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const s = t.se7en
  const tech = projectById('se7en')?.tech ?? []
  const host = new URL(profile.se7en.siteUrl).host

  return (
    <>
      <section className="section case" id="se7en" aria-labelledby="se7en-title">
        <div className="wrap">
          <CaseHeader
            id="se7en-title"
            chip={s.caseStudyChip}
            title={s.title}
            tagline={s.tagline}
            body={s.body}
            status={{ text: profile.se7en.launched ? s.statusLive : s.statusPreview, live: profile.se7en.launched }}
            facts={[
              { label: s.facts.type, value: s.typeValue },
              { label: s.facts.role, value: s.roleValue },
              {
                label: s.facts.stack,
                value: (
                  <ul className="project__tech" aria-label={s.stackLabel}>
                    {tech.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
            actions={
              <>
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
                <QuoteLink className="btn btn--outline" preset={{ type: 'web' }}>
                  {s.want}
                </QuoteLink>
              </>
            }
            note={s.privateNote}
          />

          <div className="cs__block gallery">
            <h2 className="cs__h">{s.galleryTitle}</h2>
            <div className="gallery__main">
              <BrowserFrame url={host}>
                <Shot
                  project="se7en"
                  name="home"
                  kind="desktop"
                  alt={s.shots.homeDesktop}
                  sizes="(min-width: 1240px) 840px, (min-width: 900px) 65vw, 60vw"
                  priority
                />
              </BrowserFrame>
              <div className="gallery__phone">
                <Phone>
                  <Shot project="se7en" name="home" kind="mobile" alt={s.shots.homeMobile} sizes="280px" />
                </Phone>
              </div>
            </div>
            <div className="gallery__row">
              <BrowserFrame url={`${host}/horarios`}>
                <Shot project="se7en" name="horarios" kind="desktop" alt={s.shots.horariosDesktop} sizes="(min-width: 760px) 46vw, 60vw" />
              </BrowserFrame>
              <BrowserFrame url={`${host}/clase-de-prueba`}>
                <Shot project="se7en" name="clase" kind="desktop" alt={s.shots.claseDesktop} sizes="(min-width: 760px) 46vw, 60vw" />
              </BrowserFrame>
            </div>
            <p className="gallery__note">{s.galleryNote}</p>
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{s.challengeTitle}</h2>
            <p className="cs__lead">{s.challenge}</p>
            <ul className="cs__grid cs__grid--2">
              {s.decisions.map((d) => (
                <li key={d.t} className="card">
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{s.builtTitle}</h2>
            <ul className="cs__grid">
              {s.built.map((b) => {
                const Icon = builtIcons[b.id]
                return (
                  <li key={b.id} className="card">
                    <span className="cs__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <h3>{b.t}</h3>
                    <p>{b.d}</p>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{s.numbersLabel}</h2>
            <Se7enNumbers />
          </div>

          <Testimonials project="se7en" />

          <div className="cs__block">
            <h2 className="cs__h">{s.marketingTitle}</h2>
            <div className="s7__marketing card">
              {[
                { title: s.marketingOnTitle, items: s.marketingOn },
                { title: s.marketingOffTitle, items: s.marketingOff },
              ].map((col) => (
                <div key={col.title}>
                  <h3>{col.title}</h3>
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
        </div>
      </section>

      <CaseCta preset={{ type: 'web' }} next="jfood" />
    </>
  )
}
