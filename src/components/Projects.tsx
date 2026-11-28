import { ArrowUpRight, Download, Globe } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import { projects, type Project } from '../data/projects'
import { BrowserFrame } from './BrowserFrame'
import { GithubIcon } from './BrandIcons'
import { Phone } from './Phone'
import { QuoteLink } from './QuoteLink'
import { SectionHead } from './SectionHead'
import { Shot } from './Shot'
import { Screen } from './screens/Screens'
import './Projects.css'

/** Imagen de una tarjeta destacada: captura real de la web de un cliente, o maqueta ilustrativa de la app. */
function Visual({ project }: { project: Project }) {
  const { t } = useI18n()

  if (project.art === 'shot') {
    return (
      <div className="project__visual">
        <BrowserFrame url={new URL(profile.se7en.siteUrl).host}>
          <Shot
            project="se7en"
            name="home"
            kind="desktop"
            alt={t.projects.shotAlt}
            sizes="(min-width: 1200px) 560px, (min-width: 900px) 46vw, 60vw"
          />
        </BrowserFrame>
        <ul className="project__scores" aria-label={`${t.se7en.lighthouseTitle}: ${t.se7en.lighthouseNote}`}>
          {[
            [96, t.se7en.perf],
            [100, t.se7en.a11y],
            [100, t.se7en.bp],
          ].map(([v, label]) => (
            <li key={label}>
              <b>{v}</b> {label}
            </li>
          ))}
        </ul>
        <p className="project__caption">{t.hero.captionReal}</p>
      </div>
    )
  }

  return (
    <div className="project__visual project__visual--phone">
      <Phone label={t.projects.mockLabel}>
        <Screen id="diary" />
      </Phone>
      <p className="project__caption">{t.project.mockCaption}</p>
    </div>
  )
}

export function Projects() {
  const { t, href } = useI18n()
  const p = t.projects

  return (
    <section className="section" id="proyectos" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead n={4} eyebrow={p.eyebrow} title={p.title} lead={p.lead} id="projects-title" />

        <ul className="projects">
          {projects.map((pr, i) => {
            const info = p.items[pr.id]
            return (
              <li key={pr.id} className={`project${pr.featured ? ' project--featured' : ''}${i % 2 ? ' project--flip' : ''}`}>
                <article className="project__card card">
                  {pr.featured && <Visual project={pr} />}

                  <div className="project__text">
                    <div className="project__badges">
                      <span className={`chip ${pr.kind === 'client' ? 'chip--solid' : 'chip--outline'}`}>
                        {pr.kind === 'client' ? p.badges.client : p.badges.own}
                      </span>
                      <span className="chip">{info.kind}</span>
                      {pr.oss && <span className="chip chip--mint">{p.badges.oss}</span>}
                      {pr.preview && <span className="chip chip--amber">{p.badges.preview}</span>}
                    </div>

                    <h3>{info.name}</h3>
                    <p className="project__summary">{info.summary}</p>

                    <dl className="project__facts">
                      <div>
                        <dt>{p.goalLabel}</dt>
                        <dd>{info.goal}</dd>
                      </div>
                      <div>
                        <dt>{p.roleLabel}</dt>
                        <dd>{info.role}</dd>
                      </div>
                    </dl>

                    <ul className="project__tech" aria-label={p.techLabel}>
                      {pr.tech.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>

                    <div className="project__cta">
                      {pr.casePage && (
                        <a className="btn btn--primary" href={href(pr.casePage)}>
                          {p.caseStudy}
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                      )}
                      {pr.site && (
                        <a className="btn btn--outline" href={pr.site} target="_blank" rel="noreferrer">
                          <Globe size={18} aria-hidden="true" />
                          {p.site}
                        </a>
                      )}
                      {pr.repo && (
                        <a className="btn btn--outline" href={pr.repo} target="_blank" rel="noreferrer">
                          <GithubIcon size={18} />
                          {p.code}
                        </a>
                      )}
                      {pr.release && (
                        <a className="btn btn--outline" href={pr.release} target="_blank" rel="noreferrer">
                          <Download size={18} aria-hidden="true" />
                          {p.download}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}

          <li className="project project--next">
            <article className="project__card project__card--next">
              <h3>{p.nextTitle}</h3>
              <p>{p.nextText}</p>
              <QuoteLink className="btn btn--primary">
                {p.nextCta}
                <ArrowUpRight size={18} aria-hidden="true" />
              </QuoteLink>
            </article>
          </li>
        </ul>
      </div>
    </section>
  )
}
