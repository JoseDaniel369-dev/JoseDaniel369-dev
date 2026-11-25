import { ArrowUpRight, Download } from 'lucide-react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { GithubIcon } from './BrandIcons'
import './Projects.css'

/** Anillo decorativo del proyecto destacado (evoca el contador de calorías de JfooD). */
function RingArt() {
  const r = 70
  return (
    <div className="ring-art" aria-hidden="true">
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
        <g transform="rotate(-90 90 90)">
          <motion.circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="14"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.84 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </g>
      </svg>
      <span>
        <strong>1.840</strong>
        kcal
      </span>
    </div>
  )
}

export function Projects() {
  const { t } = useI18n()
  const p = t.projects

  return (
    <section className="section" id="proyectos" aria-labelledby="projects-title">
      <div className="wrap">
        <h2 id="projects-title" className="section__title">
          {p.title}
        </h2>
        <p className="section__lead">{p.lead}</p>

        <ul className="projects">
          {projects.map((pr) => {
            const info = p.items[pr.id]
            return (
              <li key={pr.id} className={`project${pr.featured ? ' project--featured' : ''}`}>
                <article className="project__card card spot">
                  <div className="project__text">
                    <span className="chip">{info.kind}</span>
                    <h3>{info.name}</h3>
                    <p>{info.summary}</p>
                    <ul className="project__tech" aria-label={p.techLabel}>
                      {pr.tech.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <div className="project__cta">
                      {pr.caseStudy && (
                        <a className="btn btn--primary" href={pr.caseStudy}>
                          {p.caseStudy}
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                      )}
                      {pr.repo && (
                        <a className="btn btn--outline" href={pr.repo} target="_blank" rel="noreferrer">
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
                  {pr.featured && <RingArt />}
                </article>
              </li>
            )
          })}

          <li className="project project--next">
            <article className="project__card project__card--next">
              <h3>{p.nextTitle}</h3>
              <p>{p.nextText}</p>
              <a className="btn btn--outline" href={profile.github} target="_blank" rel="noreferrer">
                <GithubIcon size={18} />
                {p.nextCta}
              </a>
            </article>
          </li>
        </ul>
      </div>
    </section>
  )
}
