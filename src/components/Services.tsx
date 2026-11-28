import { ArrowUpRight, Check, LayoutTemplate, MessagesSquare, Smartphone, Workflow, Wrench, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { Magnetic } from './Magnetic'
import { QuoteLink } from './QuoteLink'
import { SectionHead } from './SectionHead'
import './Services.css'

const icons: Record<string, LucideIcon> = {
  web: LayoutTemplate,
  software: Smartphone,
  automation: Workflow,
}

/** Lo que vendo, ordenado como lo compra un cliente: qué problema resuelve, para quién y qué entrega. */
export function Services() {
  const { t, href } = useI18n()
  const s = t.services

  return (
    <section className="section" id="servicios" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead n={2} eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="services-title" />

        <ul className="services">
          {s.items.map((it, i) => {
            const Icon = icons[it.id]
            return (
              <li key={it.id}>
                <article className="service card">
                  <header className="service__head">
                    <span className="service__icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="service__n" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </header>
                  <h3>{it.t}</h3>

                  <dl className="service__facts">
                    <div>
                      <dt>{s.problemLabel}</dt>
                      <dd>{it.problem}</dd>
                    </div>
                    <div>
                      <dt>{s.forLabel}</dt>
                      <dd>{it.who}</dd>
                    </div>
                  </dl>

                  <div className="service__inc">
                    <p className="service__label">{s.includesLabel}</p>
                    <ul>
                      {it.includes.map((x) => (
                        <li key={x}>
                          <Check size={17} aria-hidden="true" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="service__proof">
                    {s.proofLabel}{' '}
                    <a href={href(it.proof.page)}>
                      {it.proof.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </p>

                  <Magnetic>
                    <QuoteLink className="btn btn--primary" preset={{ type: it.type }}>
                      {s.cta}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </QuoteLink>
                  </Magnetic>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="extras">
          <article className="extra card">
            <span className="service__icon" aria-hidden="true">
              <Wrench size={22} />
            </span>
            <div>
              <h3>{s.maintenance.t}</h3>
              <p>{s.maintenance.d}</p>
            </div>
            <QuoteLink className="btn btn--outline" preset={{ type: s.maintenance.type }}>
              {s.maintenance.cta}
            </QuoteLink>
          </article>

          <article className="assess">
            <span className="assess__icon" aria-hidden="true">
              <MessagesSquare size={22} />
            </span>
            <h3>{s.assessment.t}</h3>
            <p>{s.assessment.d}</p>
            <ul>
              {s.assessment.includes.map((x) => (
                <li key={x}>
                  <Check size={17} aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="assess__not">{s.assessment.not}</p>
            <QuoteLink className="btn assess__btn" preset={{ intent: 'call' }}>
              {s.assessment.cta}
              <ArrowUpRight size={18} aria-hidden="true" />
            </QuoteLink>
          </article>
        </div>
      </div>
    </section>
  )
}
