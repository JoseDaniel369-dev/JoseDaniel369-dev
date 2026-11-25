import {
  siTypescript,
  siReact,
  siNodedotjs,
  siExpo,
  siFastify,
  siZod,
  siSqlite,
  siGooglegemini,
  siGithubactions,
  siVite,
  siPhp,
  siDocker,
  siFirebase,
  siJavascript,
  siHtml5,
  siCss,
  type SimpleIcon,
} from 'simple-icons'

export interface StackApp {
  id: string
  icon: SimpleIcon
  /** Color de fondo de la ficha; por defecto el color oficial de la marca. */
  color?: string
}

// Las 4 primeras van al dock.
export const stackApps: StackApp[] = [
  { id: 'typescript', icon: siTypescript },
  { id: 'reactnative', icon: siReact, color: '20232A' },
  { id: 'node', icon: siNodedotjs },
  { id: 'expo', icon: siExpo },
  { id: 'fastify', icon: siFastify },
  { id: 'zod', icon: siZod },
  { id: 'sqlite', icon: siSqlite },
  { id: 'gemini', icon: siGooglegemini },
  { id: 'actions', icon: siGithubactions },
  { id: 'vite', icon: siVite },
]

export const dockIds = ['typescript', 'reactnative', 'node', 'expo']

export const schoolApps: StackApp[] = [
  { id: 'php', icon: siPhp },
  { id: 'docker', icon: siDocker },
  { id: 'firebase', icon: siFirebase },
  { id: 'javascript', icon: siJavascript },
  { id: 'html', icon: siHtml5 },
  { id: 'css', icon: siCss },
]

/** Elige texto claro u oscuro según la luminosidad del fondo. */
export function inkFor(hex: string): string {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#0b1220' : '#ffffff'
}
