import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { dockIds, inkFor, schoolApps, stackApps, type StackApp } from '../data/stack'
import './HomeScreenStack.css'

function AppIcon({ app, selected, onPick, label }: { app: StackApp; selected: boolean; onPick: () => void; label: string }) {
  const bg = `#${app.color ?? app.icon.hex}`
  return (
    <button className={`app${selected ? ' is-selected' : ''}`} onClick={onPick} onMouseEnter={onPick} onFocus={onPick}>
      <span className="app__tile" style={{ background: bg, color: inkFor(app.color ?? app.icon.hex) }}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={app.icon.path} fill="currentColor" />
        </svg>
      </span>
      <span className="app__name">{label}</span>
    </button>
  )
}

export function HomeScreenStack() {
  const { t } = useI18n()
  const s = t.stack
  const [selectedId, setSelectedId] = useState('sqlite')
  const [folder, setFolder] = useState(false)

  const all = [...stackApps, ...schoolApps]
  const selected = all.find((a) => a.id === selectedId)!
  const info = s.items[selectedId]
  const dock = dockIds.map((id) => stackApps.find((a) => a.id === id)!)
  const grid = stackApps.filter((a) => !dockIds.includes(a.id))

  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <h2 id="stack-title" className="section__title">
          {s.title}
        </h2>
        <p className="section__lead">{s.lead}</p>

        <div className="home">
          <div className="home__screen" role="group" aria-label={s.homeLabel}>
            <div className="home__grid">
              {grid.map((a) => (
                <AppIcon
                  key={a.id}
                  app={a}
                  label={s.items[a.id].name}
                  selected={selectedId === a.id}
                  onPick={() => setSelectedId(a.id)}
                />
              ))}
              <button className="app" onClick={() => setFolder(true)} aria-haspopup="dialog">
                <span className="app__tile app__folder">
                  {schoolApps.slice(0, 4).map((a) => (
                    <svg key={a.id} viewBox="0 0 24 24" aria-hidden="true">
                      <path d={a.icon.path} fill={`#${a.icon.hex}`} />
                    </svg>
                  ))}
                </span>
                <span className="app__name">{s.folder}</span>
              </button>
            </div>

            <div className="home__dock">
              {dock.map((a) => (
                <AppIcon
                  key={a.id}
                  app={a}
                  label={s.items[a.id].name}
                  selected={selectedId === a.id}
                  onPick={() => setSelectedId(a.id)}
                />
              ))}
            </div>

            <AnimatePresence>
              {folder && (
                <motion.div
                  className="home__folder"
                  role="dialog"
                  aria-label={s.folder}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  <div className="folder__head">
                    <h3>{s.folder}</h3>
                    <button className="icon-btn" onClick={() => setFolder(false)} aria-label={s.close}>
                      <X size={18} />
                    </button>
                  </div>
                  <p>{s.folderNote}</p>
                  <div className="home__grid home__grid--folder">
                    {schoolApps.map((a) => (
                      <AppIcon
                        key={a.id}
                        app={a}
                        label={s.items[a.id].name}
                        selected={selectedId === a.id}
                        onPick={() => setSelectedId(a.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={selectedId}
              className="detail card"
              aria-live="polite"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="detail__tile"
                style={{ background: `#${selected.color ?? selected.icon.hex}`, color: inkFor(selected.color ?? selected.icon.hex) }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={selected.icon.path} fill="currentColor" />
                </svg>
              </span>
              <h3>{info.name}</h3>
              <p>{info.where}</p>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
