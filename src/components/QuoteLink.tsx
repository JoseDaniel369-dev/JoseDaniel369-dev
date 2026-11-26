import type { AnchorHTMLAttributes } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { briefUrl, presetBrief, type BriefPreset } from '../lib/brief'

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Qué rellenar en el formulario de contacto al llegar. */
  preset?: BriefPreset
}

/**
 * Enlace al formulario de contacto que además lo deja preparado (tipo de proyecto, intención).
 * En la portada salta con el ancla y avisa al formulario; desde otra página lleva a la portada con
 * `?tipo=…#contacto`, que el formulario lee al cargar.
 */
export function QuoteLink({ preset, onClick, children, ...rest }: Props) {
  const { page, href } = useI18n()
  const here = page === 'home'
  return (
    <a
      {...rest}
      href={here ? '#contacto' : briefUrl(href('home'), preset ?? {})}
      onClick={(e) => {
        if (here && preset) presetBrief(preset)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
