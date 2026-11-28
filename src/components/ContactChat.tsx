import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { AlertCircle, ArrowUpRight, CalendarCheck, Check, Clock, Copy, FileDown, Loader, Phone, Send } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import {
  intents,
  PRESET_BRIEF,
  presetFromSearch,
  projectTypes,
  type BriefPreset,
  type Intent,
  type ProjectType,
} from '../lib/brief'
import { hasForm, loadQueue, openMail, saveQueue, sendMessage, subjectFor, whatsappHref, type Outgoing } from '../lib/contact'
import { Avatar } from './Avatar'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { SectionHead } from './SectionHead'
import { Toast } from './Toast'
import './ContactChat.css'

type Status = 'sent' | 'queued' | 'sending' | 'error'
interface Msg extends Outgoing {
  status: Status
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Contacto: canales directos y un brief (tipo de proyecto, mensaje) con forma de conversación. */
export function ContactChat() {
  const { t, href } = useI18n()
  const { offline } = useNetwork()
  const c = t.contact
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [intent, setIntent] = useState<Intent>('quote')
  const [type, setType] = useState<ProjectType | ''>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState<'empty' | 'email' | null>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)
  const wasOffline = useRef(offline)
  const thread = useRef<HTMLDivElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  // Copia síncrona de los mensajes para los envíos (evita cierres con datos viejos).
  const msgsRef = useRef<Msg[]>([])
  msgsRef.current = msgs
  // Mensajes que ya están en camino o entregados: evita enviar dos veces el mismo (p. ej. si se sale del
  // modo avión justo cuando se restaura la cola de una visita anterior).
  const delivered = useRef(new Set<string>())
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

  // Un botón de «pedir presupuesto» deja el formulario preparado: por evento (misma página) o por la URL (otra página).
  useEffect(() => {
    const apply = (p: BriefPreset) => {
      if (p.type) setType(p.type)
      if (p.intent) setIntent(p.intent)
    }
    apply(presetFromSearch(location.search))
    const onPreset = (e: Event) => apply((e as CustomEvent<BriefPreset>).detail)
    window.addEventListener(PRESET_BRIEF, onPreset)
    return () => window.removeEventListener(PRESET_BRIEF, onPreset)
  }, [])

  /** Envía los mensajes pendientes. Con formulario real salen uno a uno; sin él se abre un solo correo. */
  const deliver = useCallback(
    async (all: Msg[]) => {
      const pending = all.filter((msg) => !delivered.current.has(msg.id))
      if (!pending.length) return
      if (!hasForm) {
        pending.forEach((msg) => setStatus(msg.id, 'sent'))
        const body = pending
          .map((msg) =>
            [
              [msg.intent, msg.type].filter(Boolean).join(' · '),
              msg.company,
              '',
              msg.text,
              '',
              [msg.name, msg.email].filter(Boolean).join(' · '),
            ]
              .join('\n')
              .trim(),
          )
          .join('\n\n---\n\n')
        openMail(subjectFor(c.subject, pending[0]), body)
        return
      }
      for (const msg of pending) {
        delivered.current.add(msg.id)
        setStatus(msg.id, 'sending')
        try {
          await sendMessage(msg, c.subject)
          setStatus(msg.id, 'sent')
        } catch {
          // Si falla, puede reintentarse.
          delivered.current.delete(msg.id)
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
  }, [msgs])

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
      company: company.trim(),
      intent: c.intents[intent],
      type: type ? c.types[type] : '',
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
          <SectionHead n={8} eyebrow={c.eyebrow} title={c.title} lead={offline ? c.offlineHint : c.lead} id="contact-title" />

          <div className="contact__actions">
            <a className="btn btn--primary btn--lg" href={whatsappHref(c.whatsappText)} target="_blank" rel="noreferrer">
              <WhatsappIcon size={20} />
              {c.whatsapp}
            </a>
            {profile.booking && (
              <a className="btn btn--outline btn--lg" href={profile.booking} target="_blank" rel="noreferrer">
                <CalendarCheck size={18} aria-hidden="true" />
                {c.booking}
              </a>
            )}
            <button type="button" className="btn btn--outline btn--lg" onClick={copyEmail}>
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
                  {(msg.intent || msg.type) && (
                    <span className="bubble__meta">{[msg.intent, msg.type].filter(Boolean).join(' · ')}</span>
                  )}
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
                  {msg.status === 'sent' && (
                    <m.p
                      className="bubble bubble--in bubble--reply"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      {hasForm ? c.reply : c.replyMail}
                    </m.p>
                  )}
                </m.div>
              ))}
            </AnimatePresence>
          </div>

          <form className="chat__form" onSubmit={onSubmit} noValidate>
            <fieldset className="seg">
              <legend className="sr-only">{c.intentLabel}</legend>
              {intents.map((i) => (
                <label key={i} className="seg__opt">
                  <input type="radio" name="intent" value={i} checked={intent === i} onChange={() => setIntent(i)} />
                  <span>{c.intents[i]}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="types">
              <legend>{c.typeLabel}</legend>
              <div>
                {projectTypes.map((tp) => (
                  <label key={tp} className="tchip">
                    <input type="radio" name="type" value={tp} checked={type === tp} onChange={() => setType(tp)} />
                    <span>{c.types[tp]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

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
            <label>
              <span className="sr-only">{c.companyLabel}</span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={c.companyLabel}
                autoComplete="organization"
              />
            </label>
            {/* Campo trampa para bots: oculto a la vista y al teclado. */}
            <input ref={honeypot} className="chat__hp" type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="chat__row">
              <label>
                <span className="sr-only">{c.messageLabel}</span>
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    if (error === 'empty') setError(null)
                  }}
                  placeholder={c.messagePlaceholder}
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
              <p>
                {c.privacy} <a href={href('legal')}>{c.privacyMore}</a>.
              </p>
            </details>
          </form>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
