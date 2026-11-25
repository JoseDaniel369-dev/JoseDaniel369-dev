import { ArrowUp, Mail } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import './Footer.css'

export function Footer() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const f = t.footer

  const explore = [
    { href: '#proyectos', label: t.nav.project },
    { href: '#stack', label: t.nav.stack },
    { href: '#enfoque', label: t.nav.approach },
    { href: '#contacto', label: t.nav.contact },
  ]

  const follow = [
    { href: profile.github, label: 'GitHub', icon: <GithubIcon size={18} />, external: true },
    ...(profile.linkedin ? [{ href: profile.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={18} />, external: true }] : []),
    { href: `mailto:${profile.email}`, label: 'Email', icon: <Mail size={18} aria-hidden="true" />, external: false },
  ]

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <span className="footer__logo" aria-hidden="true">
            JD
          </span>
          <p className="footer__name">{profile.name}</p>
          <p className="footer__tagline">{f.tagline}</p>
        </div>

        <nav className="footer__col" aria-label={f.nav}>
          <p className="footer__title">{f.explore}</p>
          <ul>
            {explore.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <p className="footer__title">{f.follow}</p>
          <ul>
            {follow.map((l) => (
              <li key={l.label}>
                <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {l.icon}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap">
        <div className="footer__bar">
          <p>
            {new Date().getFullYear()} {profile.name}. {f.built}
          </p>
          <span className={`footer__status${offline ? ' is-off' : ''}`}>
            <i aria-hidden="true" />
            {offline ? t.hero.offline : t.hero.online}
          </span>
          <a className="footer__up" href="#top">
            <ArrowUp size={16} aria-hidden="true" />
            {f.up}
          </a>
        </div>
      </div>
    </footer>
  )
}
