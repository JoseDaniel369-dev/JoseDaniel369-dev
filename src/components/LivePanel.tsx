import { useRef } from 'react'
import { m, useInView } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { formatRelative, useGithubRepo } from '../hooks/useGithubRepo'
import './LivePanel.css'

const COLORS = ['var(--accent)', 'var(--mint)', 'var(--muted)']

export function LivePanel() {
  const { t, lang } = useI18n()
  const { offline } = useNetwork()
  const ref = useRef<HTMLElement>(null)
  // Solo se consulta GitHub cuando el panel está a punto de verse, no en cada visita.
  const near = useInView(ref, { once: true, margin: '300px 0px' })
  const { repo, at, live } = useGithubRepo(offline, near)
  const p = t.project

  const cells = [
    { k: p.livePush, v: repo.pushedAt ? formatRelative(repo.pushedAt, lang, t.time.unknown) : null },
    { k: p.liveRelease, v: repo.release ?? (at ? null : `v${profile.jfood.fallbackVersion}`) },
    // Con 0 estrellas el dato resta más que suma: solo se muestra cuando hay alguna.
    { k: p.liveStars, v: repo.stars ? String(repo.stars) : null },
  ].filter((c): c is { k: string; v: string } => c.v !== null)

  const hasData = at !== null

  return (
    <section ref={ref} className="live card spot" aria-label={p.liveTitle}>
      <header className="live__head">
        <h2>{p.liveTitle}</h2>
        {hasData && (
          <span className={`chip${live ? ' chip--mint' : ''}`}>
            {live ? p.liveFresh : `${p.liveCached} ${formatRelative(at, lang, t.time.unknown)}`}
          </span>
        )}
      </header>

      {!hasData && offline && <p className="live__none">{p.liveNone}</p>}
      {(hasData || !offline) && (
        <>
          <dl className="live__cells">
            {cells.map((c) => (
              <div key={c.k}>
                <dt>{c.k}</dt>
                <dd>{c.v}</dd>
              </div>
            ))}
          </dl>

          {repo.languages.length > 0 && (
            <div className="live__langs">
              <div className="live__bar" role="img" aria-label={repo.languages.map((l) => `${l.name} ${l.pct}%`).join(', ')}>
                {repo.languages.map((l, i) => (
                  <m.i
                    key={l.name}
                    style={{ background: COLORS[i] }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.12 }}
                  />
                ))}
              </div>
              <ul>
                {repo.languages.map((l, i) => (
                  <li key={l.name}>
                    <i style={{ background: COLORS[i] }} aria-hidden="true" />
                    {l.name} <b>{l.pct}%</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}
