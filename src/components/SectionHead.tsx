import type { ReactNode } from 'react'

interface Props {
  /** Número de la sección: «01 · Servicios». Es decorativo, por eso no lo lee el lector de pantalla. */
  n?: number
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  id?: string
  /** `h1` solo en el título principal de cada página. */
  as?: 'h1' | 'h2'
}

/** Cabecera común de sección: etiqueta numerada, título y entradilla. Da el mismo ritmo a todas las páginas. */
export function SectionHead({ n, eyebrow, title, lead, id, as: Tag = 'h2' }: Props) {
  return (
    <header className="shead">
      <p className="eyebrow">
        {n !== undefined && <span aria-hidden="true">{String(n).padStart(2, '0')}</span>}
        {eyebrow}
      </p>
      <Tag id={id} className="section__title">
        {title}
      </Tag>
      {lead && <p className="section__lead">{lead}</p>}
    </header>
  )
}
