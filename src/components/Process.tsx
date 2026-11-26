import { useI18n } from '../i18n/I18nContext'
import { SectionHead } from './SectionHead'
import './Process.css'

/** Los cinco pasos de trabajo. Cada uno dice qué recibe el cliente, que es lo que reduce la incertidumbre. */
export function Process() {
  const { t } = useI18n()
  const p = t.process

  return (
    <section className="section" id="proceso" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHead n={4} eyebrow={p.eyebrow} title={p.title} lead={p.lead} id="process-title" />

        <ol className="steps">
          {p.steps.map((st, i) => (
            <li key={st.t} className="stepc">
              <span className="stepc__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
              <p className="stepc__gets">
                <b>{p.receivesLabel}</b>
                {st.r}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
