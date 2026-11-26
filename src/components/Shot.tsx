import { BASE } from '../routes'
import './Shot.css'

type Kind = 'desktop' | 'mobile'

// Cada captura existe en dos tamaños (scripts/capture-se7en.mjs). Las medidas del <img> son las del tamaño
// grande, para que el navegador reserve el hueco antes de cargar y no haya saltos de maquetación.
const sizes: Record<Kind, { widths: [number, number]; w: number; h: number }> = {
  desktop: { widths: [640, 1280], w: 1280, h: 800 },
  mobile: { widths: [390, 780], w: 390, h: 844 },
}

interface Props {
  project: 'se7en'
  /** Nombre de la captura: home, horarios, clase… */
  name: string
  kind: Kind
  /** Texto alternativo: describe qué se ve. */
  alt: string
  /**
   * Ancho que ocupa en pantalla, para que el navegador elija el archivo adecuado. En móvil se pide a propósito
   * el tamaño pequeño de las capturas de escritorio: son miniaturas de una web de 1280 px y no se leen igual.
   */
  sizes: string
  /** Solo para la imagen que se ve al cargar la página: el resto va en carga diferida. */
  priority?: boolean
}

/** Captura real de un proyecto, con srcset, medidas y carga diferida. */
export function Shot({ project, name, kind, alt, sizes: sizesAttr, priority = false }: Props) {
  const s = sizes[kind]
  const url = (w: number) => `${BASE}shots/${project}/${name}-${kind}-${w}.webp`
  return (
    <img
      className={`shot shot--${kind}`}
      src={url(s.widths[1])}
      srcSet={s.widths.map((w) => `${url(w)} ${w}w`).join(', ')}
      sizes={sizesAttr}
      width={s.w}
      height={s.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      // Las capturas ilustran, no son lo primero que se lee: que no compitan con el JavaScript ni las fuentes.
      fetchPriority={priority ? 'high' : 'low'}
      decoding="async"
    />
  )
}
