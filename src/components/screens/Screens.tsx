import { m } from 'motion/react'
import { CloudOff, Download, Upload } from 'lucide-react'
import { useNetwork } from '../../context/NetworkContext'

export type ScreenId = 'diary' | 'ai' | 'scanner' | 'weight' | 'backup'

// La interfaz real de JfooD está en español, así que la maqueta no se traduce.
const MEALS = [
  { name: 'Desayuno', kcal: 420 },
  { name: 'Comida', kcal: 760 },
  { name: 'Merienda', kcal: 210 },
  { name: 'Cena', kcal: 450 },
]
const GOAL = 2200
const EATEN = MEALS.reduce((s, m) => s + m.kcal, 0)
const WEIGHTS = [74.2, 74.0, 73.8, 73.9, 73.4, 73.1, 72.8]
const BARCODE = [3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2]

const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

function Diary() {
  const r = 46
  return (
    <div className="scr">
      <p className="scr__h">Hoy</p>
      <div className="scr__ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e3e8f0" strokeWidth="11" />
          <g transform="rotate(-90 60 60)">
            <m.circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#2f6bff"
              strokeWidth="11"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: EATEN / GOAL }}
              transition={{ duration: 1.3, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }}
            />
          </g>
        </svg>
        <div>
          <strong>{thousands(EATEN)}</strong>
          <span>de {thousands(GOAL)} kcal</span>
        </div>
      </div>
      <div className="scr__macros">
        {[
          ['Proteína', 92, 0.72],
          ['Carbos', 210, 0.85],
          ['Grasas', 61, 0.6],
        ].map(([name, g, w]) => (
          <div className="scr__macro" key={String(name)}>
            <b>{name}</b>
            <div className="scr__bar">
              <i style={{ width: `${Number(w) * 100}%` }} />
            </div>
            {g} g
          </div>
        ))}
      </div>
      <ul className="scr__list">
        {MEALS.map((m) => (
          <li key={m.name}>
            <span>{m.name}</span>
            <b>{m.kcal} kcal</b>
          </li>
        ))}
      </ul>
      <span className="scr__pill" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
        Guardado en el móvil
      </span>
    </div>
  )
}

function Ai() {
  const { offline } = useNetwork()
  return (
    <div className="scr">
      <p className="scr__h">Reconocer plato</p>
      {offline ? (
        <div className="scr__offline">
          <CloudOff size={22} aria-hidden="true" />
          <strong>La IA necesita conexión.</strong>
          <span>Tu diario sigue funcionando: puedes añadir el plato a mano.</span>
        </div>
      ) : (
        <>
          <div className="scr__photo" aria-hidden="true" />
          <p className="scr__title">Tortilla de patatas</p>
          <p className="scr__muted">Unos 150 g, 320 kcal</p>
          <p className="scr__note">Revisa las cantidades antes de guardar.</p>
          <div className="scr__btns">
            <span>Editar</span>
            <span className="scr__btn--fill">Guardar</span>
          </div>
        </>
      )}
    </div>
  )
}

function Scanner() {
  const { offline } = useNetwork()
  return (
    <div className="scr">
      <p className="scr__h">Escáner</p>
      <div className="scr__scan" aria-hidden="true">
        <div className="scr__code">
          {BARCODE.map((w, i) => (
            <i key={i} style={{ width: w * 2 }} />
          ))}
        </div>
        <div className="scr__line" />
      </div>
      <div className="scr__result">
        <p className="scr__title">Yogur natural</p>
        <p className="scr__muted">62 kcal por 100 g</p>
        <span className="scr__pill" style={{ marginTop: '0.5rem' }}>
          Encontrado en el catálogo local
        </span>
      </div>
      {offline && <p className="scr__note">Sin red, solo se busca en el catálogo del móvil.</p>}
    </div>
  )
}

function Weight() {
  const min = Math.min(...WEIGHTS) - 0.4
  const max = Math.max(...WEIGHTS) + 0.4
  const pts = WEIGHTS.map((w, i) => [(i / (WEIGHTS.length - 1)) * 200 + 10, 110 - ((w - min) / (max - min)) * 100])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <div className="scr">
      <p className="scr__h">Peso</p>
      <p className="scr__big">
        {String(WEIGHTS[WEIGHTS.length - 1]).replace('.', ',')} <small>kg</small>
      </p>
      <svg viewBox="0 0 220 120" className="scr__chart" aria-hidden="true">
        <m.path
          d={d}
          fill="none"
          stroke="#2f6bff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? '#ff9f0a' : '#2f6bff'} />
        ))}
      </svg>
      <p className="scr__muted">Últimos 7 registros</p>
    </div>
  )
}

function Backup() {
  return (
    <div className="scr">
      <p className="scr__h">Tus datos</p>
      <div className="scr__row">
        <span>Copia de seguridad</span>
        <b>JSON</b>
      </div>
      <div className="scr__btns" style={{ margin: '0.3rem 0 0.8rem' }}>
        <span>
          <Download size={14} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden="true" /> Exportar
        </span>
        <span>
          <Upload size={14} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden="true" /> Restaurar
        </span>
      </div>
      {['Desayuno 09:00', 'Comida 14:00', 'Cena 21:00'].map((r) => (
        <div className="scr__row" key={r}>
          <span>{r}</span>
          <i className="scr__switch" />
        </div>
      ))}
      <span className="scr__pill" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
        Sin cuenta, sin nube
      </span>
    </div>
  )
}

export function Screen({ id }: { id: ScreenId }) {
  switch (id) {
    case 'diary':
      return <Diary />
    case 'ai':
      return <Ai />
    case 'scanner':
      return <Scanner />
    case 'weight':
      return <Weight />
    case 'backup':
      return <Backup />
  }
}
