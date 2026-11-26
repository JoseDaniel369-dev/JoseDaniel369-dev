import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { BriefPreset } from '../lib/brief'
import type { IndexablePage } from '../routes'
import { Magnetic } from './Magnetic'
import { QuoteLink } from './QuoteLink'
import './Case.css'

interface Props {
  /** Qué rellenar en el formulario al pedir algo parecido. */
  preset: BriefPreset
  /** El otro caso de estudio, para seguir leyendo. */
  next: Extract<IndexablePage, 'se7en' | 'jfood'>
}

/** Cierre de cada caso: invita a pedir algo parecido y lleva al otro caso. */
export function CaseCta({ preset, next }: Props) {
  const { t, href, sec } = useI18n()
  const c = t.caseCta

  return (
    <section className="section casecta" aria-labelledby="casecta-title">
      <div className="wrap">
        <div className="casecta__card">
          <h2 id="casecta-title">{c.title}</h2>
          <p>{c.text}</p>
          <div className="casecta__btns">
            <Magnetic>
              <QuoteLink className="btn btn--primary btn--lg" preset={preset}>
                {c.cta}
                <ArrowUpRight size={18} aria-hidden="true" />
              </QuoteLink>
            </Magnetic>
            <a className="btn btn--outline btn--lg" href={sec('proyectos')}>
              {c.all}
            </a>
          </div>
        </div>

        <a className="casecta__next" href={href(next)}>
          <span>{c.nextLabel}</span>
          <strong>{t.projects.items[next].name}</strong>
          <ArrowRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
