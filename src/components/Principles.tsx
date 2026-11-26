import { FileDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import { Avatar } from './Avatar'
import './Principles.css'

/** Tarjetas tipo notificación que se apilan con el scroll (sticky escalonado, sin JS). */
export function Principles() {
  const { t } = useI18n()
  const a = t.approach

  return (
    <section className="section" id="enfoque" aria-labelledby="approach-title">
      <div className="wrap approach">
        <div className="approach__head">
          <h2 id="approach-title" className="section__title">
            {a.title}
          </h2>
          <p className="section__lead">{a.lead}</p>
          <div className="about">
            <Avatar alt={t.hero.photoAlt} size={88} />
            <p>{a.about}</p>
            {profile.cv && (
              <a className="btn btn--outline" href={profile.cv} download>
                <FileDown size={18} aria-hidden="true" />
                {t.contact.cv}
              </a>
            )}
          </div>
        </div>
        <ol className="notifs">
          {a.items.map((it, i) => (
            <li className="notif" key={it.t} style={{ ['--i' as string]: i }}>
              <div className="notif__card card spot">
                <span className="notif__app">{it.app}</span>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
