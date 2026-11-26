import { useEffect, useState } from 'react'
import { AnimatePresence, m, useScroll } from 'motion/react'
import { BatteryFull, Menu, Moon, Plane, Search, Signal, SignalZero, Sun, Wifi, WifiOff, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import type { Theme } from '../hooks/useTheme'
import { AirplaneSwitch } from './AirplaneSwitch'
import { OPEN_PALETTE } from './CommandPalette'
import './StatusBar.css'

/** La hora real solo existe en el navegador: el HTML prerenderizado la deja vacía y la rellena al montar. */
function useClock(lang: string) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return now ? new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' }).format(now) : ''
}

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

export function StatusBar({ theme, onToggleTheme }: Props) {
  const { t, lang, otherHref } = useI18n()
  const { offline } = useNetwork()
  const time = useClock(lang)
  // La tecla que se muestra depende del sistema; se decide tras montar para no desajustar la hidratación.
  const [isMac, setIsMac] = useState(false)
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), [])
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  const links = [
    { href: '#servicios', label: t.nav.services },
    { href: '#proyectos', label: t.nav.project },
    { href: '#stack', label: t.nav.stack },
    { href: '#enfoque', label: t.nav.approach },
    { href: '#contacto', label: t.nav.contact, cta: true },
  ]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="bar">
      <div className="bar__main">
        <m.i className="bar__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
        <div className="bar__inner wrap">
          <time className="bar__time">{time}</time>
          <a className="bar__logo" href="#top" aria-label={`JD, ${t.hero.name}`}>
            JD
          </a>

          <nav className="bar__links" aria-label={t.bar.nav}>
            {links.map((l) => (
              <a key={l.href} href={l.href} className={l.cta ? 'bar__cta' : undefined}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="bar__right">
            <span className="bar__signal" role="img" aria-label={offline ? t.bar.disconnected : t.bar.connected}>
              {offline ? <SignalZero size={18} /> : <Signal size={18} />}
              {offline ? <WifiOff size={18} /> : <Wifi size={18} />}
              <BatteryFull size={20} />
            </span>
            <button
              type="button"
              className="icon-btn bar__search"
              aria-label={t.palette.trigger}
              aria-keyshortcuts="Control+K Meta+K"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
            >
              <Search size={16} aria-hidden="true" />
              <kbd aria-hidden="true">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <a
              className="icon-btn icon-btn--text"
              href={otherHref}
              hrefLang={lang === 'es' ? 'en' : 'es'}
              lang={lang === 'es' ? 'en' : 'es'}
              aria-label={`${t.bar.langShort}: ${t.bar.lang}`}
              onClick={(e) => {
                // Conserva la sección en la que estabas al cambiar de idioma.
                if (location.hash) {
                  e.preventDefault()
                  location.href = otherHref + location.hash
                }
              }}
            >
              {t.bar.langShort}
            </a>
            <button className="icon-btn" onClick={onToggleTheme} aria-label={t.bar.theme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <AirplaneSwitch compact />
            <button
              className="icon-btn bar__menu"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-sheet"
              aria-label={open ? t.bar.closeMenu : t.bar.menu}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-sheet"
            className="sheet"
            aria-label={t.bar.nav}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} className={l.cta ? 'sheet__cta' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </m.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {offline && (
          <m.div
            className="banner"
            role="status"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p className="wrap">
              <Plane size={16} aria-hidden="true" />
              {t.bar.offlineBanner}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
