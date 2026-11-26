import { AnimatePresence, m } from 'motion/react'
import './Toast.css'

/** Aviso flotante de estado. `message` vacío = oculto. */
export function Toast({ message }: { message: string }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {message && (
          <m.p
            key={message}
            className="toast"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {message}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
