import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { QuoteLink } from './QuoteLink'
import './MobileCta.css'

/**
 * Botón fijo «Pedir presupuesto» para el móvil: aparece al salir de la cabecera y se esconde cuando
 * el formulario de contacto ya está a la vista (ahí sobra). Solo en las páginas que venden.
 */
export function MobileCta() {
  const { t, page } = useI18n()
  const [pastTop, setPastTop] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastTop(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = document.getElementById('contacto')
    if (!target) return
    const obs = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), { threshold: 0.15 })
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  if (page !== 'home' && page !== 'se7en' && page !== 'jfood') return null
  const on = pastTop && !atContact

  return (
    <div className="mcta" data-on={on}>
      <QuoteLink className="btn btn--primary btn--lg" aria-label={t.mobileCta.aria}>
        {t.mobileCta.label}
        <ArrowUpRight size={18} aria-hidden="true" />
      </QuoteLink>
    </div>
  )
}
