import {
  siTypescript,
  siReact,
  siNodedotjs,
  siAstro,
  siExpo,
  siFastify,
  siZod,
  siSqlite,
  siGooglegemini,
  siGithubactions,
  siVite,
  siNpm,
  siRender,
  siTailwindcss,
  siGsap,
  siCloudflare,
  siGooglesearchconsole,
  siGooglemaps,
  siPlausibleanalytics,
  siInstagram,
  type SimpleIcon,
} from 'simple-icons'

export type StackPage = 'apps' | 'web'

export interface StackApp {
  id: string
  icon: SimpleIcon
  /** Color de fondo de la ficha; por defecto el color oficial de la marca. */
  color?: string
  /** Página de la pantalla de inicio. Sin página = va al dock, común a las dos. */
  page?: StackPage
}

export const stackPages: StackPage[] = ['apps', 'web']

// El dock (4 fichas) es común. Cada página llena la pantalla de inicio con 2 filas de 4.
export const stackApps: StackApp[] = [
  // Dock
  { id: 'typescript', icon: siTypescript },
  { id: 'reactnative', icon: siReact, color: '20232A' },
  { id: 'astro', icon: siAstro },
  { id: 'node', icon: siNodedotjs },
  // Página «Apps»
  { id: 'expo', icon: siExpo, page: 'apps' },
  { id: 'fastify', icon: siFastify, page: 'apps' },
  { id: 'zod', icon: siZod, page: 'apps' },
  { id: 'sqlite', icon: siSqlite, page: 'apps' },
  { id: 'gemini', icon: siGooglegemini, page: 'apps' },
  { id: 'npm', icon: siNpm, page: 'apps' },
  { id: 'render', icon: siRender, color: '46E3B7', page: 'apps' },
  { id: 'actions', icon: siGithubactions, page: 'apps' },
  // Página «Web y marketing»
  { id: 'tailwind', icon: siTailwindcss, page: 'web' },
  { id: 'gsap', icon: siGsap, page: 'web' },
  { id: 'vite', icon: siVite, page: 'web' },
  { id: 'cloudflare', icon: siCloudflare, page: 'web' },
  { id: 'searchconsole', icon: siGooglesearchconsole, page: 'web' },
  { id: 'googlemaps', icon: siGooglemaps, page: 'web' },
  { id: 'plausible', icon: siPlausibleanalytics, page: 'web' },
  { id: 'instagram', icon: siInstagram, page: 'web' },
]

export const dockIds = ['typescript', 'reactnative', 'astro', 'node']

/** Elige texto claro u oscuro según la luminosidad del fondo. */
export function inkFor(hex: string): string {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#0b1220' : '#ffffff'
}
