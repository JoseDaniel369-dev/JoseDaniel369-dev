import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import './NotificationsTimeline.css'

/** Tarjetas tipo notificación que se apilan con el scroll (sticky escalonado, sin JS). */
export function NotificationsTimeline() {
  const { t } = useI18n()

  return (
    <section className="section" id="trayectoria" aria-labelledby="path-title">
      <div className="wrap path">
        <h2 id="path-title" className="section__title path__title">
          {t.path.title}
        </h2>
        <ol className="notifs">
          {t.path.items.map((it, i) => (
            <li className="notif" key={it.date} style={{ ['--i' as string]: i }}>
              <div className="notif__card card">
                <header>
                  <span className="notif__app">{it.app}</span>
                  <time>{it.date}</time>
                </header>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
                {'link' in it && it.link && (
                  <a className="notif__link" href={profile.github.school} target="_blank" rel="noreferrer">
                    {it.link}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
