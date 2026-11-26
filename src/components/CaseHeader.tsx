import type { ReactNode } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { SectionHead } from './SectionHead'
import './Case.css'

interface Props {
  id: string
  chip: string
  title: string
  tagline: string
  body: string
  /** Ficha del proyecto: tipo, mi papel, estado y tecnologías. */
  facts: { label: string; value: ReactNode }[]
  /** Etiqueta de estado opcional (p. ej. «Versión previa en línea»), junto a la insignia del caso. */
  status?: { text: string; live?: boolean }
  /** Botones de la cabecera: ver la web, ver el código… */
  actions: ReactNode
  note?: string
}

/** Cabecera común de los casos de estudio: migas, título, ficha del proyecto y enlaces. */
export function CaseHeader({ id, chip, title, tagline, body, facts, status, actions, note }: Props) {
  const { t, href, sec } = useI18n()

  return (
    <header className="case__head">
      <nav aria-label={t.caseCta.crumbProjects}>
        <ol className="crumbs">
          <li>
            <a href={href('home')}>{t.caseCta.crumbHome}</a>
          </li>
          <li>
            <a href={sec('proyectos')}>{t.caseCta.crumbProjects}</a>
          </li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <SectionHead as="h1" eyebrow={chip} title={title} lead={tagline} id={id} />

      {status && (
        <p className="case__chips">
          <span className={`chip ${status.live ? 'chip--mint' : 'chip--amber'}`}>{status.text}</span>
        </p>
      )}
      <p className="case__body">{body}</p>

      <dl className="case__facts">
        {facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="case__cta">{actions}</div>
      {note && <p className="case__note">{note}</p>}
    </header>
  )
}
