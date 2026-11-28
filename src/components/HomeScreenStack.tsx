import { useState } from 'react'
import { AnimatePresence, m, type PanInfo } from 'motion/react'
import { useI18n } from '../i18n/I18nContext'
import { dockIds, inkFor, stackApps, stackPages, type StackApp, type StackPage } from '../data/stack'
import { SectionHead } from './SectionHead'
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
  const [page, setPage] = useState<StackPage>('web')
  const [selectedId, setSelectedId] = useState('astro')

  const selected = stackApps.find((a) => a.id === selectedId)!
  const info = s.items[selectedId]
  const dock = dockIds.map((id) => stackApps.find((a) => a.id === id)!)
  const grid = stackApps.filter((a) => a.page === page)

  /** Al cambiar de página se selecciona su primera ficha, para que el detalle no se quede en otra página. */
  function goTo(next: StackPage) {
    if (next === page) return
    setPage(next)
    setSelectedId(stackApps.find((a) => a.page === next)!.id)
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const i = stackPages.indexOf(page)
    if (info.offset.x < -50 && i < stackPages.length - 1) goTo(stackPages[i + 1])
    if (info.offset.x > 50 && i > 0) goTo(stackPages[i - 1])
  }

  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead n={7} eyebrow={s.eyebrow} title={s.title} lead={s.lead} id="stack-title" />

        <div className="home">
          <div className="home__screen" role="group" aria-label={s.homeLabel}>
            <m.div
              className="home__pages"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={onDragEnd}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={page}
                  className="home__grid"
                  initial={{ opacity: 0, x: page === 'web' ? 28 : -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: page === 'web' ? -28 : 28 }}
                  transition={{ duration: 0.18 }}
                >
                  {grid.map((a) => (
                    <AppIcon
                      key={a.id}
                      app={a}
                      label={s.items[a.id].name}
                      selected={selectedId === a.id}
                      onPick={() => setSelectedId(a.id)}
                    />
                  ))}
                </m.div>
              </AnimatePresence>
            </m.div>

            <div className="home__dots" role="group" aria-label={s.pagesLabel}>
              {stackPages.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={page === p}
                  aria-label={s.pages[p]}
                  title={s.pages[p]}
                  onClick={() => goTo(p)}
                />
              ))}
              <span className="home__page-name" aria-hidden="true">
                {s.pages[page]}
              </span>
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
          </div>

          <AnimatePresence mode="wait">
            <m.article
              key={selectedId}
              className="detail card spot"
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
            </m.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
