import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { AlertCircle, ArrowUpRight, Check, Clock, Copy, FileDown, Loader, Phone, Send } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { hasForm, loadQueue, openMail, saveQueue, sendMessage, whatsappHref, type Outgoing } from '../lib/contact'
import { Avatar } from './Avatar'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { Toast } from './Toast'
import './ContactChat.css'

type Status = 'sent' | 'queued' | 'sending' | 'error'
interface Msg extends Outgoing {
  status: Status
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactChat() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const c = t.contact
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState<'empty' | 'email' | null>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)
  const wasOffline = useRef(offline)
  const thread = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  // Copia síncrona de los mensajes para los envíos (evita cierres con datos viejos).
  const msgsRef = useRef<Msg[]>([])
  msgsRef.current = msgs
  const offlineRef = useRef(offline)
  offlineRef.current = offline

  const setStatus = useCallback((id: string, status: Status) => {
    setMsgs((all) => all.map((msg) => (msg.id === id ? { ...msg, status } : msg)))
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3500)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  /** Envía los mensajes pendientes. Con formulario real salen uno a uno; sin él se abre un solo correo. */
  const deliver = useCallback(
    async (pending: Msg[]) => {
      if (!pending.length) return
      if (!hasForm) {
        pending.forEach((msg) => setStatus(msg.id, 'sent'))
        openMail(pending[0].name, pending.map((msg) => msg.text), c.subject)
        return
      }
      for (const msg of pending) {
        setStatus(msg.id, 'sending')
        try {
          await sendMessage(msg, c.subject)
          setStatus(msg.id, 'sent')
        } catch {
          setStatus(msg.id, 'error')
        }
      }
    },
    [c.subject, setStatus],
  )

  // Al montar: recupera los mensajes que quedaron en cola en una visita anterior y, si hay red, los envía.
  // Solo con formulario real: sin él no hay entrega posible y la cola vive únicamente en esta visita.
  useEffect(() => {
    if (!hasForm) return
    const saved = loadQueue()
    if (!saved.length) return
    const restored = saved.map((q) => ({ ...q, status: 'queued' as const }))
    setMsgs(restored)
    // Se espera un instante: ?offline=1 se aplica en el efecto del proveedor, que corre después que el de sus hijos.
    const timer = window.setTimeout(() => {
      if (!offlineRef.current) void deliver(restored)
    }, 250)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // La cola se guarda mientras haya mensajes pendientes o fallidos.
  useEffect(() => {
    if (!hasForm) return
    saveQueue(
      msgs.filter((msg) => msg.status === 'queued' || msg.status === 'error').map(({ status: _s, ...rest }) => rest),
    )
  }, [msgs])

  // Al salir del modo avión, los mensajes en cola salen de una vez.
  useEffect(() => {
    if (wasOffline.current && !offline) void deliver(msgsRef.current.filter((msg) => msg.status === 'queued'))
    wasOffline.current = offline
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offline])

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: 'smooth' })
  }, [msgs.length])

  function applyPreset(preset: string) {
    setText(preset)
    setError(null)
    field.current?.focus()
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return setError('empty')
    const mail = email.trim()
    if (hasForm && !EMAIL_RE.test(mail)) return setError('email')
    setError(null)

    // Trampa para bots: un humano nunca rellena este campo oculto.
    if (honeypot.current?.value) return

    const msg: Msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: mail,
      text: clean,
      status: offline ? 'queued' : 'sending',
    }
    setMsgs((all) => [...all, msg])
    setText('')
    if (!offline) void deliver([msg])
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
    { label: profile.phone, href: profile.phoneHref, icon: <Phone size={20} aria-hidden="true" />, external: false },
    { label: c.github, href: profile.github, icon: <GithubIcon size={20} />, external: true },
    ...(profile.linkedin
      ? [{ label: c.linkedin, href: profile.linkedin, icon: <LinkedinIcon size={20} />, external: true }]
      : []),
    ...(profile.cv
      ? [{ label: c.cv, href: profile.cv, icon: <FileDown size={20} aria-hidden="true" />, external: false, download: true }]
      : []),
  ]

  return (
    <section className="section" id="contacto" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="contact__intro">
          <h2 id="contact-title" className="section__title">
            {c.title}
          </h2>
          <p className="section__lead">{offline ? c.offlineHint : c.lead}</p>

          <div className="contact__actions">
            <a className="btn btn--primary" href={whatsappHref(c.whatsappText)} target="_blank" rel="noreferrer">
              <WhatsappIcon size={20} />
              {c.whatsapp}
            </a>
            <button className="btn btn--outline" onClick={copyEmail}>
              <Copy size={18} aria-hidden="true" />
              {c.copy}
            </button>
          </div>
          <a className="contact__email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  className="btn btn--outline"
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...('download' in l && l.download ? { download: '' } : {})}
                >
                  {l.icon}
                  {l.label}
                  {l.external && <ArrowUpRight size={16} aria-hidden="true" />}
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
            {c.bubbles.map((b) => (
              <p className="bubble bubble--in" key={b}>
                {b}
              </p>
            ))}
            <AnimatePresence initial={false}>
              {msgs.map((msg) => (
                <m.div
                  key={msg.id}
                  className="bubble-wrap"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  <p className="bubble bubble--out">{msg.text}</p>
                  <span className={`bubble__state${msg.status === 'queued' ? ' is-queued' : ''}${msg.status === 'error' ? ' is-error' : ''}`}>
                    {msg.status === 'queued' && (
                      <>
                        <Clock size={13} aria-hidden="true" /> {c.queued}
                      </>
                    )}
                    {msg.status === 'sending' && (
                      <>
                        <Loader size={13} aria-hidden="true" /> {c.sending}
                      </>
                    )}
                    {msg.status === 'sent' && (
                      <>
                        <Check size={13} aria-hidden="true" /> {c.sent}
                      </>
                    )}
                    {msg.status === 'error' && (
                      <>
                        <AlertCircle size={13} aria-hidden="true" /> {c.failed} {c.failedHint}{' '}
                        <button type="button" className="bubble__retry" onClick={() => void deliver([msg])}>
                          {c.retry}
                        </button>
                      </>
                    )}
                  </span>
                </m.div>
              ))}
            </AnimatePresence>
          </div>

          <form className="chat__form" onSubmit={onSubmit} noValidate>
            <div className="chat__presets" role="group" aria-label={c.presetsLabel}>
              {c.presets.map((p) => (
                <button key={p.label} type="button" onClick={() => applyPreset(p.text)}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="chat__pair">
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
              <label>
                <span className="sr-only">{c.emailLabel}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error === 'email') setError(null)
                  }}
                  placeholder={c.emailLabel}
                  autoComplete="email"
                  aria-invalid={error === 'email'}
                  aria-describedby={error === 'email' ? 'chat-error' : undefined}
                />
              </label>
            </div>
            {/* Campo trampa para bots: oculto a la vista y al teclado. */}
            <input ref={honeypot} className="chat__hp" type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="chat__row">
              <label>
                <span className="sr-only">{c.messageLabel}</span>
                <textarea
                  ref={field}
                  rows={2}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    if (error === 'empty') setError(null)
                  }}
                  placeholder={c.messageLabel}
                  aria-invalid={error === 'empty'}
                  aria-describedby={error === 'empty' ? 'chat-error' : undefined}
                />
              </label>
              <button type="submit" className="chat__send" aria-label={c.send}>
                <Send size={20} aria-hidden="true" />
              </button>
            </div>
            {error && (
              <p className="chat__error" id="chat-error" role="alert">
                {error === 'email' ? c.emailInvalid : c.empty}
              </p>
            )}
            <details className="chat__privacy">
              <summary>{c.privacyTitle}</summary>
              <p>{c.privacy}</p>
            </details>
          </form>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
