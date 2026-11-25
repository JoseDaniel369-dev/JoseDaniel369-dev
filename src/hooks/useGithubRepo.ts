import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

export interface RepoLive {
  pushedAt: string | null
  stars: number | null
  release: string | null
  languages: { name: string; pct: number }[]
}

export interface RepoState {
  repo: RepoLive
  /** Momento (ms) en que se obtuvieron los datos; null si no hay ninguno. */
  at: number | null
  /** true si los datos se acaban de pedir a GitHub en esta visita. */
  live: boolean
}

const EMPTY: RepoLive = { pushedAt: null, stars: null, release: null, languages: [] }
const TTL = 10 * 60 * 1000
const KEY = 'jfood-live-v2'

function readCache(): { at: number; data: RepoLive } | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as { at: number; data: RepoLive }) : null
  } catch {
    return null
  }
}

function writeCache(data: RepoLive, at: number) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at, data }))
  } catch {
    /* ignorar */
  }
}

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json() as Promise<T>
}

/**
 * Datos públicos de JfooD. Con red los pide a GitHub; sin red (o si GitHub falla)
 * enseña la última copia guardada en el navegador.
 */
export function useGithubRepo(offline: boolean): RepoState {
  const [state, setState] = useState<RepoState>(() => {
    const c = readCache()
    return c ? { repo: c.data, at: c.at, live: false } : { repo: EMPTY, at: null, live: false }
  })

  useEffect(() => {
    if (offline) {
      setState((s) => ({ ...s, live: false }))
      return
    }
    const cached = readCache()
    if (cached && Date.now() - cached.at < TTL) {
      setState({ repo: cached.data, at: cached.at, live: true })
      return
    }
    const ctrl = new AbortController()
    const base = `https://api.github.com/repos/${profile.jfood.owner}/${profile.jfood.repo}`

    Promise.allSettled([
      getJson<{ pushed_at: string; stargazers_count: number }>(base, ctrl.signal),
      getJson<Record<string, number>>(`${base}/languages`, ctrl.signal),
      getJson<{ tag_name: string }>(`${base}/releases/latest`, ctrl.signal),
    ]).then(([repo, langs, rel]) => {
      if (ctrl.signal.aborted) return
      const total = langs.status === 'fulfilled' ? Object.values(langs.value).reduce((a, b) => a + b, 0) : 0
      const next: RepoLive = {
        pushedAt: repo.status === 'fulfilled' ? repo.value.pushed_at : null,
        stars: repo.status === 'fulfilled' ? repo.value.stargazers_count : null,
        release: rel.status === 'fulfilled' ? rel.value.tag_name : null,
        languages:
          langs.status === 'fulfilled' && total > 0
            ? Object.entries(langs.value)
                .map(([name, bytes]) => ({ name, pct: Math.round((bytes / total) * 100) }))
                .filter((l) => l.pct >= 1)
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 3)
            : [],
      }
      if (next.pushedAt || next.release || next.languages.length) {
        const at = Date.now()
        writeCache(next, at)
        setState({ repo: next, at, live: true })
      }
    })

    return () => ctrl.abort()
  }, [offline])

  return state
}

export function formatRelative(from: number | string | null, lang: string, unknown: string): string {
  if (from === null) return unknown
  const diffMs = new Date(from).getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const mins = Math.round(diffMs / 60000)
  if (Math.abs(mins) < 1) return rtf.format(0, 'minute')
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute')
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(days, 'day')
  return rtf.format(Math.round(days / 30), 'month')
}
