import { ArrowUpRight, Check, Download } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { profile } from '../data/profile'
import { projectById } from '../data/projects'
import { AirplaneSwitch } from '../components/AirplaneSwitch'
import { ArchitectureFlow } from '../components/ArchitectureFlow'
import { CaseCta } from '../components/CaseCta'
import { CaseHeader } from '../components/CaseHeader'
import { JfoodNumbers } from '../components/JfoodNumbers'
import { JfoodStory } from '../components/JfoodStory'
import { LivePanel } from '../components/LivePanel'
import '../components/Case.css'

/** Caso de estudio de JfooD: demuestra ingeniería, arquitectura, móvil, datos e integración con IA. */
export function JfoodPage() {
  const { t } = useI18n()
  const { offline } = useNetwork()
  const p = t.project
  const tech = projectById('jfood')?.tech ?? []

  return (
    <>
      <section className="section case" id="jfood" aria-labelledby="project-title">
        <div className="wrap">
          <CaseHeader
            id="project-title"
            chip={p.caseStudyChip}
            title={p.title}
            tagline={p.tagline}
            body={p.body}
            facts={[
              { label: p.facts.type, value: p.typeValue },
              { label: p.facts.role, value: p.roleValue },
              { label: p.facts.status, value: p.statusValue },
              {
                label: p.facts.stack,
                value: (
                  <ul className="project__tech" aria-label={p.facts.stack}>
                    {tech.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
            actions={
              <>
                <a className="btn btn--ink" href={profile.jfood.repoUrl} target="_blank" rel="noreferrer">
                  {p.repo}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a className="btn btn--outline" href={profile.jfood.releaseUrl} target="_blank" rel="noreferrer">
                  <Download size={18} aria-hidden="true" />
                  {p.download}
                </a>
              </>
            }
          />

          <div className="cs__block">
            <h2 className="cs__h">{t.numbers.label}</h2>
            <JfoodNumbers />
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{p.stepsLabel}</h2>
            <JfoodStory />
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{p.decisionsTitle}</h2>
            <p className="cs__lead">{p.decisionsLead}</p>
            <ul className="cs__grid">
              {p.decisions.map((d) => (
                <li key={d.t} className="card">
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                </li>
              ))}
            </ul>
          </div>

          <ArchitectureFlow />

          <div className="cs__block">
            <h2 className="cs__h">{p.valueTitle}</h2>
            <ul className="value">
              {p.value.map((v) => (
                <li key={v}>
                  <Check size={18} aria-hidden="true" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cs__block">
            <h2 className="cs__h">{p.demoTitle}</h2>
            <div className="demo card">
              <p aria-live="polite">{offline ? p.demoOn : p.demoLead}</p>
              <AirplaneSwitch />
            </div>
          </div>

          <LivePanel />
        </div>
      </section>

      <CaseCta preset={{ type: 'software' }} next="se7en" />
    </>
  )
}
