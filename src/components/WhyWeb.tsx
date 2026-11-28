import { ArrowUpRight, BarChart3, Clock, KeyRound, MousePointerClick, Search, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { QuoteLink } from './QuoteLink'
import { SectionHead } from './SectionHead'
import './WhyWeb.css'

const icons: Record<string, LucideIcon> = {
  found: Search,
  always: Clock,
  trust: ShieldCheck,
  own: KeyRound,
  convert: MousePointerClick,
  measure: BarChart3,
}

/** Por qué un negocio necesita una web: motivos en lenguaje llano, las dudas típicas y una llamada a la acción. */
export function WhyWeb() {
  const { t, href } = useI18n()
  const w = t.why

  return (
    <section className="section" id="por-que-una-web" aria-labelledby="why-title">
      <div className="wrap">
        <SectionHead n={1} eyebrow={w.eyebrow} title={w.title} lead={w.lead} id="why-title" />

        <ul className="why">
          {w.items.map((it) => {
            const Icon = icons[it.id]
            return (
              <li key={it.id}>
                <article className="why__item card">
                  <span className="service__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3>{it.t}</h3>
                  <p>{it.d}</p>
                  <p className="why__example">
                    <b>{w.practiceLabel}</b>
                    {it.example}
                    {it.id === 'convert' && (
                      <>
                        {' '}
                        <a href={href('se7en')}>
                          {w.seeCase}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="why__more">
          <div className="why__objections">
            <h3>{w.objectionsTitle}</h3>
            <dl>
              {w.objections.map((o) => (
                <div key={o.q}>
                  <dt>{o.q}</dt>
                  <dd>{o.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="why__cta">
            <h3>{w.cta.title}</h3>
            <p>{w.cta.text}</p>
            <div className="why__btns">
              <QuoteLink className="btn why__primary" preset={{ type: 'web' }}>
                {w.cta.primary}
                <ArrowUpRight size={18} aria-hidden="true" />
              </QuoteLink>
              <a className="btn why__secondary" href={href('se7en')}>
                {w.cta.secondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
