import { useI18n } from '../i18n/I18nContext'
import { stackApps } from '../data/stack'
import './Marquee.css'

/** Tira infinita de tecnologías. La segunda copia es decorativa para que el bucle sea continuo. */
export function Marquee() {
  const { t } = useI18n()

  return (
    <section className="marquee" aria-label={t.marquee.label}>
      <ul className="marquee__track">
        {[...stackApps, ...stackApps].map((a, i) => (
          <li key={`${a.id}-${i}`} aria-hidden={i >= stackApps.length || undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={a.icon.path} fill="currentColor" />
            </svg>
            {t.stack.items[a.id].name}
          </li>
        ))}
      </ul>
    </section>
  )
}
