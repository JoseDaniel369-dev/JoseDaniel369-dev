import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { whatsappHref } from '../lib/contact'
import './Footer.css'

export function Footer() {
  const { t, href, sec } = useI18n()
  const { offline } = useNetwork()
  const f = t.footer

  const explore = [
    { href: sec('servicios'), label: t.nav.services },
    { href: sec('proyectos'), label: t.nav.projects },
    { href: sec('proceso'), label: t.nav.process },
    { href: sec('sobre-mi'), label: t.nav.about },
    { href: sec('stack'), label: t.nav.stack },
    { href: sec('contacto'), label: t.nav.contact },
  ]

  const follow = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <Mail size={18} aria-hidden="true" />, external: false },
    { href: whatsappHref(t.contact.whatsappText), label: 'WhatsApp', icon: <WhatsappIcon size={18} />, external: true },
    { href: profile.phoneHref, label: profile.phone, icon: <Phone size={18} aria-hidden="true" />, external: false },
    { href: profile.github, label: 'GitHub', icon: <GithubIcon size={18} />, external: true },
    ...(profile.linkedin ? [{ href: profile.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={18} />, external: true }] : []),
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
          <p className="footer__place">
            <MapPin size={16} aria-hidden="true" />
            {f.place}
          </p>
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
            <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}. {f.built}{' '}
            <a className="footer__legal" href={href('legal')}>
              {f.legal}
            </a>
          </p>
          <span className={`footer__status${offline ? ' is-off' : ''}`}>
            <i aria-hidden="true" />
            {offline ? t.hero.offline : t.hero.online}
          </span>
          <a className="footer__up" href="#contenido">
            <ArrowUp size={16} aria-hidden="true" />
            {f.up}
          </a>
        </div>
      </div>
    </footer>
  )
}
