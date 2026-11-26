import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

function resolveTheme(): Theme {
  // ?theme=dark|light fuerza el tema (útil para capturas y para compartir un enlace).
  const forced = new URLSearchParams(location.search).get('theme')
  if (forced === 'light' || forced === 'dark') return forced
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* sin almacenamiento */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Pequeño almacén externo: en el servidor el tema es siempre 'light' y en el cliente se resuelve
// tras hidratar, así no hay desajustes. El script de index.html ya pinta el tema real antes del primer frame.
let current: Theme | null = null
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const getSnapshot = (): Theme => (current ??= resolveTheme())
const getServerSnapshot = (): Theme => 'light'

export function setTheme(next: Theme) {
  current = next
  listeners.forEach((l) => l())
}

/** Alterna el tema desde cualquier sitio (p. ej. la paleta de comandos). */
export function toggleTheme() {
  setTheme(getSnapshot() === 'light' ? 'dark' : 'light')
}

const noopSubscribe = () => () => {}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  // false mientras se hidrata (valor del servidor) y true justo después: hasta entonces el DOM conserva
  // el tema que ya pintó el script de index.html, sin parpadear al tema claro del servidor.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B1220' : '#EEF2F6')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignorar */
    }
  }, [theme, hydrated])

  const toggle = useCallback(() => setTheme(getSnapshot() === 'light' ? 'dark' : 'light'), [])
  return { theme, toggle }
}
