import { m } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { CountUp } from './JfoodNumbers'
import './JfoodNumbers.css'
import './Se7enNumbers.css'

/** Anillo tipo Lighthouse: verde, con el valor en el centro. */
function ScoreRing({ value, label }: { value: number; label: string }) {
  const r = 34
  return (
    <li className="score">
      <div className="score__ring">
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
          <g transform="rotate(-90 40 40)">
            <m.circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="var(--mint)"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: value / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </g>
        </svg>
        <strong>{value}</strong>
      </div>
      <span>{label}</span>
    </li>
  )
}

/**
 * Bento con las cifras reales de la web de Se7en. Las cifras salen de su README, salvo Lighthouse, medido sobre la web publicada:
 * Lighthouse móvil de 96 en rendimiento (mediana de 3 mediciones propias en noviembre de 2026), 100 y 100,
 * 16 páginas, 140 pruebas e2e y ninguna cookie de seguimiento.
 */
export function Se7enNumbers() {
  const { t } = useI18n()
  const s = t.se7en

  return (
    <section className="bento" aria-label={s.numbersLabel}>
      <article className="tile tile--free card spot">
        <h3>{s.lighthouseTitle}</h3>
        <ul className="scores">
          <ScoreRing value={96} label={s.perf} />
          <ScoreRing value={100} label={s.a11y} />
          <ScoreRing value={100} label={s.bp} />
        </ul>
        <p className="tile__note">{s.lighthouseNote}</p>
      </article>

      <article className="tile card spot">
        <strong className="tile__big">
          <CountUp to={16} />
        </strong>
        <p>{s.pages}</p>
      </article>

      <article className="tile card spot">
        <strong className="tile__big">
          <CountUp to={140} />
        </strong>
        <p>{s.tests}</p>
      </article>

      <article className="tile tile--wide card spot">
        <strong className="tile__big">0</strong>
        <p>{s.cookies}</p>
      </article>
    </section>
  )
}
