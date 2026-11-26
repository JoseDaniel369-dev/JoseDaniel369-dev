import {
  siTypescript,
  siJavascript,
  siReact,
  siNodedotjs,
  siAstro,
  siVite,
  siTailwindcss,
  siPhp,
  siMysql,
  siCloudflare,
  siGooglesearchconsole,
  siGooglemaps,
  siExpo,
  siFastify,
  siZod,
  siSqlite,
  siGooglegemini,
  siRender,
  siGithubactions,
  type SimpleIcon,
} from 'simple-icons'

export type StackPage = 'web' | 'apps'

export interface StackApp {
  id: string
  icon: SimpleIcon
  /** Color de fondo de la ficha; por defecto el color oficial de la marca. */
  color?: string
  /** Página de la pantalla de inicio. Sin página = va al dock, común a las dos. */
  page?: StackPage
}

export const stackPages: StackPage[] = ['web', 'apps']

// El dock (4 fichas) es común. Cada página llena la pantalla de inicio con 2 filas de 4.
export const stackApps: StackApp[] = [
  // Dock
  { id: 'typescript', icon: siTypescript },
  { id: 'javascript', icon: siJavascript },
  { id: 'react', icon: siReact, color: '20232A' },
  { id: 'node', icon: siNodedotjs },
  // Página «Web»
  { id: 'astro', icon: siAstro, page: 'web' },
  { id: 'vite', icon: siVite, page: 'web' },
  { id: 'tailwind', icon: siTailwindcss, page: 'web' },
  { id: 'php', icon: siPhp, page: 'web' },
  { id: 'mysql', icon: siMysql, page: 'web' },
  { id: 'cloudflare', icon: siCloudflare, page: 'web' },
  { id: 'searchconsole', icon: siGooglesearchconsole, page: 'web' },
  { id: 'googlemaps', icon: siGooglemaps, page: 'web' },
  // Página «Apps y backend»
  { id: 'reactnative', icon: siReact, color: '20232A', page: 'apps' },
  { id: 'expo', icon: siExpo, page: 'apps' },
  { id: 'fastify', icon: siFastify, page: 'apps' },
  { id: 'zod', icon: siZod, page: 'apps' },
  { id: 'sqlite', icon: siSqlite, page: 'apps' },
  { id: 'gemini', icon: siGooglegemini, page: 'apps' },
  { id: 'render', icon: siRender, color: '46E3B7', page: 'apps' },
  { id: 'actions', icon: siGithubactions, page: 'apps' },
]

export const dockIds = ['typescript', 'javascript', 'react', 'node']

/** Elige texto claro u oscuro según la luminosidad del fondo. */
export function inkFor(hex: string): string {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#0b1220' : '#ffffff'
}
