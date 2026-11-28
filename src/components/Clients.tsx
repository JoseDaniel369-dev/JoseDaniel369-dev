import { ArrowUpRight, Building2, Palette, Store, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { QuoteLink } from './QuoteLink'
import { SectionHead } from './SectionHead'
import './Clients.css'

const icons: LucideIcon[] = [Store, Palette, Building2]

/** Para quién trabajo: cada público tiene necesidades distintas, así que cada uno tiene su propio mensaje. */
export function Clients() {
  const { t } = useI18n()
  const c = t.clients

  return (
    <section className="section" id="clientes" aria-labelledby="clients-title">
      <div className="wrap">
        <SectionHead n={3} eyebrow={c.eyebrow} title={c.title} id="clients-title" />

        <ul className="clients">
          {c.items.map((it, i) => {
            const Icon = icons[i]
            return (
              <li key={it.t} className="client">
                <span className="client__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
                <QuoteLink className="client__link" preset={{ type: it.type }}>
                  {it.cta}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </QuoteLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
