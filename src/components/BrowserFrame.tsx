import type { ReactNode } from 'react'
import './BrowserFrame.css'

interface Props {
  children: ReactNode
  /** Texto accesible de la maqueta (la ventana es decorativa). */
  label: string
  /** Dirección que aparece en la barra. */
  url: string
}

/** Ventana de navegador hecha en CSS: hermana de Phone para enseñar webs de escritorio. */
export function BrowserFrame({ children, label, url }: Props) {
  return (
    <div className="browser" role="img" aria-label={label}>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url">{url}</span>
      </div>
      <div className="browser__page" aria-hidden="true">
        {children}
      </div>
    </div>
  )
}
