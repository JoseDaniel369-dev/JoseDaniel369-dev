import { Plus } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import './Faq.css'

/** Preguntas de negocio con <details>: accesibles y legibles por buscadores sin JavaScript. */
export function Faq() {
  const { t } = useI18n()
  const f = t.faq

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq">
        <h2 id="faq-title" className="section__title">
          {f.title}
        </h2>
        <div className="faq__list">
          {f.items.map((it) => (
            <details key={it.q} className="faq__item card">
              <summary>
                <span>{it.q}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
