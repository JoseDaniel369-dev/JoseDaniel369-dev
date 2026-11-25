import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Clock, Copy, Send } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { Avatar } from './Avatar'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { Toast } from './Toast'
import './ContactChat.css'

interface Msg {
  id: number
  name: string
  text: string
  status: 'sent' | 'queued'
}

export function ContactChat() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const c = t.contact
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)
  const nextId = useRef(1)
  const wasOffline = useRef(offline)
  const thread = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  function showToast(message: string) {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3500)
  }

  function openMail(from: string, texts: string[]) {
    const body = `${texts.join('\n\n')}\n\n${from}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(body)}`
  }

  // Al salir del modo avión, los mensajes en cola se envían de una vez.
  useEffect(() => {
    if (wasOffline.current && !offline) {
      const queued = msgs.filter((m) => m.status === 'queued')
      if (queued.length) {
        setMsgs((all) => all.map((m) => (m.status === 'queued' ? { ...m, status: 'sent' } : m)))
        openMail(queued[0].name, queued.map((m) => m.text))
      }
    }
    wasOffline.current = offline
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offline])

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: 'smooth' })
  }, [msgs.length])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) {
      setError(true)
      return
    }
    setError(false)
    const from = name.trim()
    setMsgs((all) => [...all, { id: nextId.current++, name: from, text: clean, status: offline ? 'queued' : 'sent' }])
    setText('')
    if (!offline) openMail(from, [clean])
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      showToast(c.copied)
    } catch {
      showToast(c.copyFailed)
    }
  }

  const links = [
    { label: c.github, href: profile.github.main, icon: <GithubIcon size={20} /> },
    { label: c.githubSchool, href: profile.github.school, icon: <GithubIcon size={20} /> },
    ...(profile.linkedin ? [{ label: c.linkedin, href: profile.linkedin, icon: <LinkedinIcon size={20} /> }] : []),
  ]

  return (
    <section className="section" id="contacto" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="contact__intro">
          <h2 id="contact-title" className="section__title">
            {c.title}
          </h2>
          <p className="section__lead">{offline ? c.offlineHint : c.bubbles[2]}</p>

          <div className="contact__actions">
            <button className="btn btn--primary" onClick={copyEmail}>
              <Copy size={18} aria-hidden="true" />
              {c.copy}
            </button>
            <a className="contact__email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>

          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.href}>
                <a className="btn btn--outline" href={l.href} target="_blank" rel="noreferrer">
                  {l.icon}
                  {l.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat card">
          <header className="chat__head">
            <Avatar alt={t.hero.photoAlt} size={44} />
            <div>
              <p className="chat__name">Jose Daniel</p>
              <p className={`chat__status${offline ? ' is-off' : ''}`}>
                <i aria-hidden="true" />
                {offline ? c.statusOffline : c.statusOnline}
              </p>
            </div>
          </header>

          <div className="chat__thread" ref={thread} aria-live="polite">
            {c.bubbles.slice(0, 2).map((b) => (
              <p className="bubble bubble--in" key={b}>
                {b}
              </p>
            ))}
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  className="bubble-wrap"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  <p className="bubble bubble--out">{m.text}</p>
                  <span className={`bubble__state${m.status === 'queued' ? ' is-queued' : ''}`}>
                    {m.status === 'queued' ? (
                      <>
                        <Clock size={13} aria-hidden="true" /> {c.queued}
                      </>
                    ) : (
                      <>
                        <Check size={13} aria-hidden="true" /> {c.sent}
                      </>
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form className="chat__form" onSubmit={onSubmit} noValidate>
            <label>
              <span className="sr-only">{c.nameLabel}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.nameLabel}
                autoComplete="name"
              />
            </label>
            <div className="chat__row">
              <label>
                <span className="sr-only">{c.messageLabel}</span>
                <textarea
                  rows={2}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    if (error) setError(false)
                  }}
                  placeholder={c.messageLabel}
                  aria-invalid={error}
                  aria-describedby={error ? 'chat-error' : undefined}
                />
              </label>
              <button type="submit" className="chat__send" aria-label={c.send}>
                <Send size={20} aria-hidden="true" />
              </button>
            </div>
            {error && (
              <p className="chat__error" id="chat-error" role="alert">
                {c.empty}
              </p>
            )}
          </form>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
