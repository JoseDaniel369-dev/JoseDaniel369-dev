import { ArrowUpRight, LayoutTemplate, MapPin, RefreshCw, Search, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { Magnetic } from './Magnetic'
import { WhatsappIcon } from './BrandIcons'
import { whatsappHref } from '../lib/contact'
import './Services.css'

const icons: Record<string, LucideIcon> = {
  web: LayoutTemplate,
  seo: Search,
  google: MapPin,
  care: RefreshCw,
}

/** Lo que ofrezco a un negocio: web, SEO, ficha de Google y mantenimiento. Va justo tras el marquee. */
export function Services() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const s = t.services

  return (
    <section className="section" id="servicios" aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="section__title">
          {s.title}
        </h2>
        <p className="section__lead" aria-live="polite">
          {offline ? s.leadOffline : s.lead}
        </p>

        <ul className="services" aria-label={s.itemsLabel}>
          {s.items.map((it) => {
            const Icon = icons[it.id]
            return (
              <li key={it.id}>
                <article className="service card spot">
                  <span className="service__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3>{it.t}</h3>
                  <p>{it.d}</p>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="process">
          <h3 className="process__title">{s.processTitle}</h3>
          <ol className="process__steps">
            {s.steps.map((st, i) => (
              <li key={st.t}>
                <span className="process__n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h4>{st.t}</h4>
                  <p>{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="proof card">
          <div>
            <p className="proof__text">{s.proof}</p>
            <a className="proof__link" href="#se7en">
              {s.proofCta}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="proof__cta">
            <div className="proof__btns">
              <Magnetic>
                <a className="btn btn--primary" href="#contacto">
                  {s.cta}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </Magnetic>
              <a className="btn btn--outline" href={whatsappHref(t.contact.whatsappText)} target="_blank" rel="noreferrer">
                <WhatsappIcon size={18} />
                WhatsApp
              </a>
            </div>
            <p className="proof__quote">{t.hero.quote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
