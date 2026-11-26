import { profile } from './profile'

/**
 * Lista de proyectos del portfolio. Para añadir uno nuevo:
 *  1. Añade una entrada aquí (id único, tecnologías y enlaces). El primero de la lista es el más reciente.
 *  2. Añade su texto en `projects.items[id]` de src/i18n/es.ts y en.ts (name, kind, summary).
 * La tarjeta aparece sola en la sección Proyectos. Si quieres un caso de estudio propio,
 * crea su componente (como JfoodStory o Se7enStory) y apunta `caseStudy` a su ancla.
 */
export interface Project {
  id: string
  /** Ocupa la fila entera y lleva el arte decorativo. */
  featured?: boolean
  /** Arte decorativo del destacado: anillo de calorías (JfooD) o puntuaciones Lighthouse (Se7en). */
  art?: 'ring' | 'scores'
  tech: string[]
  repo?: string
  release?: string
  /** Web publicada del proyecto. */
  site?: string
  /** Ancla de la página (p. ej. '#jfood') con el caso de estudio. */
  caseStudy?: string
}

export const projects: Project[] = [
  {
    id: 'se7en',
    featured: true,
    art: 'scores',
    tech: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Playwright', 'Cloudflare'],
    site: profile.se7en.siteUrl,
    caseStudy: '#se7en',
  },
  {
    id: 'jfood',
    featured: true,
    art: 'ring',
    tech: ['React Native', 'Expo', 'TypeScript', 'Fastify', 'SQLite', 'Gemini'],
    repo: profile.jfood.repoUrl,
    release: profile.jfood.releaseUrl,
    caseStudy: '#jfood',
  },
]
