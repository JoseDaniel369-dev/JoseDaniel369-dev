import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

interface NetworkValue {
  /** Modo avión simulado: la web entera se comporta como si no hubiera red. */
  offline: boolean
  toggle: () => void
}

const NetworkContext = createContext<NetworkValue | null>(null)

export function NetworkProvider({ children }: { children: ReactNode }) {
  // Empieza siempre en línea (también en el servidor) y ?offline=1 se aplica tras hidratar.
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(location.search).get('offline') === '1') setOffline(true)
  }, [])

  const first = useRef(true)
  useEffect(() => {
    // El script de index.html ya pone data-offline antes de pintar: el primer montaje no lo pisa.
    if (first.current) {
      first.current = false
      return
    }
    document.documentElement.dataset.offline = offline ? 'true' : 'false'
  }, [offline])

  const toggle = useCallback(() => setOffline((o) => !o), [])
  const value = useMemo(() => ({ offline, toggle }), [offline, toggle])

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export function useNetwork(): NetworkValue {
  const ctx = useContext(NetworkContext)
  if (!ctx) throw new Error('useNetwork debe usarse dentro de NetworkProvider')
  return ctx
}
