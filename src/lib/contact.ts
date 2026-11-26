import { profile } from '../data/profile'

export interface Outgoing {
  id: string
  name: string
  email: string
  text: string
}

/** Clave pública de Web3Forms (se pone como VITE_WEB3FORMS_KEY al construir; es pública por diseño). */
const KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

/** Con clave, el mensaje llega al correo sin abrir nada. Sin clave, se cae a mailto: como antes. */
export const hasForm = Boolean(KEY)

/** Enlace de WhatsApp con el mensaje ya escrito. */
export function whatsappHref(text: string): string {
  return `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(text)}`
}

/**
 * Envía un mensaje por Web3Forms; lanza un error si no se pudo entregar.
 * Va como FormData (no JSON): así es una petición "simple" del navegador, sin preflight CORS, y la API
 * de Web3Forms rechaza con 403 las peticiones OPTIONS que ese preflight necesitaría.
 */
export async function sendMessage(msg: Outgoing, subject: string): Promise<void> {
  const body = new FormData()
  body.append('access_key', KEY ?? '')
  body.append('subject', subject)
  body.append('from_name', msg.name || 'Portfolio')
  body.append('name', msg.name)
  body.append('email', msg.email)
  body.append('message', msg.text)
  const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body })
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
  if (!res.ok || !data.success) throw new Error(data.message ?? `Web3Forms ${res.status}`)
}

/** Abre el cliente de correo con el mensaje (alternativa cuando no hay formulario). */
export function openMail(from: string, texts: string[], subject: string) {
  const body = `${texts.join('\n\n')}\n\n${from}`
  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Cola de mensajes escritos sin red (modo avión): sobrevive a recargas y sale al volver a conectar.
const QUEUE_KEY = 'contact-queue-v1'

export function loadQueue(): Outgoing[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as Outgoing[]) : []
  } catch {
    return []
  }
}

export function saveQueue(queue: Outgoing[]) {
  try {
    if (queue.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    else localStorage.removeItem(QUEUE_KEY)
  } catch {
    /* sin almacenamiento: la cola vive solo en esta visita */
  }
}
