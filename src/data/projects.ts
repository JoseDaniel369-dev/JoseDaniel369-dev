import { profile } from './profile'
import type { IndexablePage } from '../routes'

/**
 * Lista de proyectos de la portada. Para añadir uno nuevo:
 *  1. Añade una entrada aquí (id único, quién lo encargó, tecnologías y enlaces).
 *  2. Añade su texto en `projects.items[id]` de src/i18n/es.ts y en.ts (name, kind, summary, goal, role).
 * Si quieres un caso de estudio propio, crea su página en src/pages, regístrala en src/routes.ts
 * y apunta `casePage` a ella.
 */
export interface Project {
  id: string
  /** `client` = trabajo para un cliente; `own` = proyecto propio. Se distingue siempre en la tarjeta. */
  kind: 'client' | 'own'
  /** Código abierto (el repositorio es público). */
  oss?: boolean
  /** Es una versión previa, todavía sin lanzamiento. */
  preview?: boolean
  /** Ocupa la fila entera y lleva imagen. */
  featured?: boolean
  /** Imagen de la tarjeta: captura real de la web, o maqueta ilustrativa del móvil. */
  art?: 'shot' | 'phone'
  tech: string[]
  repo?: string
  release?: string
  /** Web publicada del proyecto. */
  site?: string
  /** Página interna con el caso de estudio. */
  casePage?: Extract<IndexablePage, 'se7en' | 'jfood'>
}

export const projects: Project[] = [
  {
    id: 'se7en',
    kind: 'client',
    preview: !profile.se7en.launched,
    featured: true,
    art: 'shot',
    tech: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Playwright', 'Cloudflare'],
    site: profile.se7en.siteUrl,
    casePage: 'se7en',
  },
  {
    id: 'jfood',
    kind: 'own',
    oss: true,
    featured: true,
    art: 'phone',
    tech: ['React Native', 'Expo', 'TypeScript', 'Fastify', 'SQLite', 'Gemini'],
    repo: profile.jfood.repoUrl,
    release: profile.jfood.releaseUrl,
    casePage: 'jfood',
  },
  {
    id: 'portfolio',
    kind: 'own',
    oss: true,
    tech: ['React', 'Vite', 'TypeScript', 'Playwright'],
    repo: profile.portfolio.repoUrl,
  },
]

export const projectById = (id: string) => projects.find((p) => p.id === id)
