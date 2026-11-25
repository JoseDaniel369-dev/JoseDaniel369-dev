import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface NetworkValue {
  /** Modo avión simulado: la web entera se comporta como si no hubiera red. */
  offline: boolean
  toggle: () => void
}

const NetworkContext = createContext<NetworkValue | null>(null)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(() => new URLSearchParams(location.search).get('offline') === '1')

  useEffect(() => {
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
