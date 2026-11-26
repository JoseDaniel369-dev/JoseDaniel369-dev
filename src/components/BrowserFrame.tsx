import type { ReactNode } from 'react'
import './BrowserFrame.css'

interface Props {
  children: ReactNode
  /**
   * Texto accesible de una maqueta dibujada en CSS: la ventana entera pasa a ser una imagen con este texto.
   * Si el contenido es una captura real (un <img> con su propio alt), no se pasa y la captura se lee sola.
   */
  label?: string
  /** Dirección que aparece en la barra. */
  url: string
}

/** Ventana de navegador hecha en CSS: hermana de Phone para enseñar webs de escritorio. */
export function BrowserFrame({ children, label, url }: Props) {
  return (
    <div className="browser" {...(label ? { role: 'img', 'aria-label': label } : {})}>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url">{url}</span>
      </div>
      <div className="browser__page" {...(label ? { 'aria-hidden': true } : {})}>
        {children}
      </div>
    </div>
  )
}
