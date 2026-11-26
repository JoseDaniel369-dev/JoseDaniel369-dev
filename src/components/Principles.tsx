import { FileDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import { Avatar } from './Avatar'
import { SectionHead } from './SectionHead'
import './Principles.css'

/** Sobre mí: quién soy y cómo trabajo, con tarjetas tipo notificación que se apilan con el scroll (sticky, sin JS). */
export function Principles() {
  const { t } = useI18n()
  const a = t.about

  return (
    <section className="section" id="sobre-mi" aria-labelledby="about-title">
      <div className="wrap approach">
        <div className="approach__head">
          <SectionHead n={5} eyebrow={a.eyebrow} title={a.title} lead={a.lead} id="about-title" />
          <div className="about">
            <Avatar alt={t.hero.photoAlt} size={88} />
            <p>{a.bio}</p>
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
              <div className="notif__card card">
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
