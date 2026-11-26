import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { QuoteLink } from '../components/QuoteLink'
import { SectionHead } from '../components/SectionHead'
import './NotFoundPage.css'

/** 404: la sirve el hosting en cualquier ruta desconocida. Lleva a la portada y al contacto. */
export function NotFoundPage() {
  const { t, href } = useI18n()
  const n = t.notFound

  return (
    <section className="section notfound" aria-labelledby="notfound-title">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="404" title={n.title} lead={n.text} id="notfound-title" />
        <div className="notfound__btns">
          <a className="btn btn--primary btn--lg" href={href('home')}>
            {n.home}
          </a>
          <QuoteLink className="btn btn--outline btn--lg">
            {n.talk}
            <ArrowUpRight size={18} aria-hidden="true" />
          </QuoteLink>
        </div>
      </div>
    </section>
  )
}
