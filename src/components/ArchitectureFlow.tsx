import { CloudOff } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import './ArchitectureFlow.css'

export function ArchitectureFlow() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const p = t.project
  const nodes = p.archNodes

  return (
    <div className="arch">
      <h3 className="arch__title">{p.archTitle}</h3>
      <ol className="arch__flow">
        {nodes.map((n, i) => {
          const dimmed = offline && i > 0
          return (
            <li className="arch__item" key={n.name}>
              <article className={`arch__node card${dimmed ? ' is-dim' : ''}${offline && i === 0 ? ' is-local' : ''}`}>
                <h4>{n.name}</h4>
                {offline && i === 0 && <span className="chip chip--mint">{p.localBadge}</span>}
                <ul className="arch__tech">
                  {n.tech.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p>{n.note}</p>
              </article>
              {i < nodes.length - 1 && (
                <div className={`arch__link${offline ? ' is-cut' : ''}`} aria-hidden="true">
                  {offline ? (
                    <span className="arch__cut">
                      <CloudOff size={16} />
                      {p.linkOffline}
                    </span>
                  ) : (
                    <>
                      <span className="arch__label">{i === 0 ? p.linkOnline : 'API'}</span>
                      <span className="arch__packet" />
                      <span className="arch__packet arch__packet--late" />
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="arch__caption" aria-live="polite">
        {offline ? p.archOffline : p.archOnline}
      </p>
    </div>
  )
}
