import { useEffect, useRef, type ReactNode } from 'react'
import { m, useReducedMotion, useSpring } from 'motion/react'
import { Plane } from 'lucide-react'
import { useNetwork } from '../context/NetworkContext'
import './Phone.css'

interface Props {
  children: ReactNode
  label: string
  /** Si es true, el teléfono se inclina siguiendo el puntero (solo con ratón). */
  tilt?: boolean
}

export function Phone({ children, label, tilt = false }: Props) {
  const { offline } = useNetwork()
  const reduce = useReducedMotion()
  const stage = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 110, damping: 14 })
  const rotateY = useSpring(0, { stiffness: 110, damping: 14 })

  useEffect(() => {
    if (!tilt || reduce || !window.matchMedia('(hover: hover)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = stage.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      rotateY.set(dx * 30)
      rotateX.set(-dy * 24)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [tilt, reduce, rotateX, rotateY])

  return (
    <div className="phone-stage" ref={stage}>
      <m.div className="phone" style={{ rotateX, rotateY }} role="img" aria-label={label}>
        <div className="phone__island" aria-hidden="true" />
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          {offline && <Plane size={12} />}
        </div>
        <div className="phone__screen">{children}</div>
        <div className="phone__home" aria-hidden="true" />
      </m.div>
    </div>
  )
}
