import { motion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { formatRelative, useGithubRepo } from '../hooks/useGithubRepo'
import './LivePanel.css'

const COLORS = ['var(--accent)', 'var(--mint)', 'var(--muted)']

export function LivePanel() {
  const { t, lang } = useI18n()
  const { offline } = useNetwork()
  const { repo, at, live } = useGithubRepo(offline)
  const p = t.project

  const cells = [
    { k: p.livePush, v: repo.pushedAt ? formatRelative(repo.pushedAt, lang, t.time.unknown) : null },
    { k: p.liveRelease, v: repo.release ?? (at ? null : `v${profile.jfood.fallbackVersion}`) },
    { k: p.liveStars, v: repo.stars === null ? null : String(repo.stars) },
  ].filter((c): c is { k: string; v: string } => c.v !== null)

  const hasData = at !== null

  return (
    <aside className="live card spot" aria-label={p.liveTitle}>
      <header className="live__head">
        <h3>{p.liveTitle}</h3>
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
                  <motion.i
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
    </aside>
  )
}
