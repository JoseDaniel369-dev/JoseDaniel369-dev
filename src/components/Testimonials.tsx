import { useI18n } from '../i18n/I18nContext'
import { testimonials } from '../data/testimonials'
import './Testimonials.css'

/** Citas de clientes. Si no hay ninguna aprobada, no se pinta nada. */
export function Testimonials({ project }: { project?: string }) {
  const { t, lang } = useI18n()
  const list = testimonials.filter((x) => !project || x.project === project)
  if (!list.length) return null

  return (
    <div className="quotes" role="group" aria-label={t.se7en.testimonialLabel}>
      {list.map((q) => (
        <figure className="quote card" key={q.name}>
          <blockquote>{q.quote[lang]}</blockquote>
          <figcaption>
            <b>{q.name}</b> · {q.role}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
