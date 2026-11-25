import { useI18n } from '../i18n/I18nContext'
import './Footer.css'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <p className="wrap">
        {new Date().getFullYear()} Jose Daniel García León. {t.footer}
      </p>
    </footer>
  )
}
