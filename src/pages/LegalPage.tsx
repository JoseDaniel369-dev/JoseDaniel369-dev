import { useI18n } from '../i18n/I18nContext'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import './LegalPage.css'

/** Aviso legal y política de privacidad. Los datos del titular salen de profile.ts. */
export function LegalPage() {
  const { t } = useI18n()
  const l = t.legal

  return (
    <section className="section legal" aria-labelledby="legal-title">
      <div className="wrap legal__wrap">
        <SectionHead as="h1" eyebrow={l.updated} title={l.title} id="legal-title" />

        {l.sections.map((s, i) => (
          <div className="legal__block" key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {i === 0 && profile.legal.nif && (
              <p>
                {l.nifLabel}: {profile.legal.nif}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
