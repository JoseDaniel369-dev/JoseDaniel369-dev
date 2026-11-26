import type { PointerEvent, ReactNode } from 'react'
import { m, useReducedMotion, useSpring } from 'motion/react'

/** El contenido se acerca ligeramente al cursor. Solo con ratón y sin "reduce motion". */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 16 })
  const y = useSpring(0, { stiffness: 220, damping: 16 })

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.span style={{ x, y, display: 'inline-flex' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  )
}
