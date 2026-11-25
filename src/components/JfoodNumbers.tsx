import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import './JfoodNumbers.css'

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  // Se renderiza el valor final (útil sin JS y para buscadores); solo se anima si el bloque aún no se ve.
  const [n, setN] = useState(to)

  useEffect(() => {
    if (reduce) return
    if (!inView) {
      if (ref.current && ref.current.getBoundingClientRect().top > window.innerHeight) setN(0)
      return
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  )
}

/** Bento con las cifras reales de JfooD (todas salen de su README). */
export function JfoodNumbers() {
  const { t } = useI18n()
  const n = t.numbers

  return (
    <section className="bento" aria-label={n.label}>
      <article className="tile tile--free card spot">
        <h3>{n.freeTitle}</h3>
        <ul>
          {[n.ads, n.accounts, n.subs].map((label) => (
            <li key={label}>
              <strong>0</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="tile card spot">
        <strong className="tile__big">
          <CountUp to={340} prefix="~" />
        </strong>
        <p>{n.foods}</p>
      </article>

      <article className="tile card spot">
        <strong className="tile__big">
          <CountUp to={100} suffix=" %" />
        </strong>
        <p>{n.local}</p>
      </article>

      <article className="tile tile--wide card spot">
        <strong className="tile__big">MIT</strong>
        <p>{n.license}</p>
      </article>
    </section>
  )
}
