/**
 * Opiniones de clientes. Mientras la lista esté vacía, no se muestra ningún bloque de testimonios:
 * no se publica nada que la persona no haya aprobado. Para añadir uno:
 *
 *   { quote: { es: '...', en: '...' }, name: 'Nombre Apellido', role: 'Cargo, Negocio', project: 'se7en' }
 */
export interface Testimonial {
  quote: { es: string; en: string }
  name: string
  role: string
  /** id del proyecto de projects.ts al que se refiere. */
  project?: string
}

export const testimonials: Testimonial[] = []
