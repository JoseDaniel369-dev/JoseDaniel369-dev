import { profile } from './profile'

/**
 * Lista de proyectos del portfolio. Para añadir uno nuevo:
 *  1. Añade una entrada aquí (id único, tecnologías y enlaces).
 *  2. Añade su texto en `projects.items[id]` de src/i18n/es.ts y en.ts (name, kind, summary).
 * La tarjeta aparece sola en la sección Proyectos. Si quieres un caso de estudio propio,
 * crea su componente (como JfoodStory) y apunta `caseStudy` a su ancla.
 */
export interface Project {
  id: string
  /** Ocupa más espacio y lleva el arte decorativo. */
  featured?: boolean
  tech: string[]
  repo?: string
  release?: string
  /** Ancla de la página (p. ej. '#jfood') con el caso de estudio. */
  caseStudy?: string
}

export const projects: Project[] = [
  {
    id: 'jfood',
    featured: true,
    tech: ['React Native', 'Expo', 'TypeScript', 'Fastify', 'SQLite', 'Gemini'],
    repo: profile.jfood.repoUrl,
    release: profile.jfood.releaseUrl,
    caseStudy: '#jfood',
  },
]
