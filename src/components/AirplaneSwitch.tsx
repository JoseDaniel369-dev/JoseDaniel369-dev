import { Plane } from 'lucide-react'
import { m } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import './AirplaneSwitch.css'

/** Interruptor del modo avión: desconecta la web entera para demostrar que es offline-first. */
export function AirplaneSwitch({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n()
  const { offline, toggle } = useNetwork()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={offline}
      aria-label={t.bar.airplane}
      className={`plane-switch${compact ? ' plane-switch--compact' : ''}`}
      onClick={toggle}
    >
      <m.span
        className="plane-switch__knob"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ justifySelf: offline ? 'end' : 'start' }}
      >
        <Plane size={compact ? 14 : 16} aria-hidden="true" />
      </m.span>
    </button>
  )
}
