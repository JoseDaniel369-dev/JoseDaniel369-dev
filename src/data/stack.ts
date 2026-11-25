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
  siNpm,
  siRender,
  type SimpleIcon,
} from 'simple-icons'

export interface StackApp {
  id: string
  icon: SimpleIcon
  /** Color de fondo de la ficha; por defecto el color oficial de la marca. */
  color?: string
}

// Las 4 primeras van al dock; las otras 8 llenan la pantalla de inicio en dos filas de 4.
export const stackApps: StackApp[] = [
  { id: 'typescript', icon: siTypescript },
  { id: 'reactnative', icon: siReact, color: '20232A' },
  { id: 'node', icon: siNodedotjs },
  { id: 'expo', icon: siExpo },
  { id: 'fastify', icon: siFastify },
  { id: 'zod', icon: siZod },
  { id: 'sqlite', icon: siSqlite },
  { id: 'gemini', icon: siGooglegemini },
  { id: 'npm', icon: siNpm },
  { id: 'render', icon: siRender, color: '46E3B7' },
  { id: 'actions', icon: siGithubactions },
  { id: 'vite', icon: siVite },
]

export const dockIds = ['typescript', 'reactnative', 'node', 'expo']

/** Elige texto claro u oscuro según la luminosidad del fondo. */
export function inkFor(hex: string): string {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#0b1220' : '#ffffff'
}
