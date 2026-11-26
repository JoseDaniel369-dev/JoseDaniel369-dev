import { useCallback, useEffect, useId, useMemo, useState, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowRight, Copy, Download, FileDown, Globe, Languages, Phone, Plane, Search, SunMoon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useNetwork } from '../context/NetworkContext'
import { toggleTheme } from '../hooks/useTheme'
import { profile } from '../data/profile'
import { whatsappHref } from '../lib/contact'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { Toast } from './Toast'
import './CommandPalette.css'

/** Evento que abre la paleta desde cualquier botón (p. ej. el de la barra) sin acoplar componentes. */
export const OPEN_PALETTE = 'open-palette'

type Group = 'go' | 'actions' | 'projects'

interface Item {
  id: string
  group: Group
  label: string
  /** Palabras extra para encontrarlo (sinónimos y términos en el otro idioma). */
  keywords: string
  icon: ReactNode
  hint?: string
  disabled?: boolean
  run: () => void
}

/** Minúsculas y sin acentos, para que "camara" encuentre "cámara". */
const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const ICON = 17

/**
 * Paleta de comandos estilo "Spotlight" de móvil: ⌘K / Ctrl+K o "/" para abrirla, saltar a una sección,
 * cambiar tema o idioma, activar el modo avión o contactar. Usa <dialog> nativo (foco atrapado y Esc gratis).
 */
export function CommandPalette() {
  const { t, otherHref } = useI18n()
  const { offline, toggle: toggleOffline } = useNetwork()
  const p = t.palette
  const c = t.contact
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)

  const close = useCallback(() => setOpen(false), [])

  // Abre y cierra el <dialog> nativo según el estado.
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      setQuery('')
      setActive(0)
      d.showModal()
      input.current?.focus()
    }
    if (!open && d.open) d.close()
  }, [open])

  // Atajos globales y evento de apertura desde la barra.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable]')
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setOpen(true)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE, onOpen)
      window.clearTimeout(toastTimer.current)
    }
  }, [])

  const items = useMemo<Item[]>(() => {
    const goTo = (hash: string) => () => {
      setOpen(false)
      // Tras cerrar el diálogo, para que el scroll suave no pelee con la restauración del foco.
      window.requestAnimationFrame(() => {
        location.hash = hash
      })
    }
    const openUrl = (url: string) => () => {
      setOpen(false)
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    const nav = (id: string, label: string, keywords: string): Item => ({
      id: `go-${id}`,
      group: 'go',
      label,
      keywords,
      icon: <ArrowRight size={ICON} aria-hidden="true" />,
      run: goTo(`#${id}`),
    })

    const list: Item[] = [
      nav('servicios', t.nav.services, 'servicios services web negocio seo'),
      nav('proyectos', t.nav.project, 'proyectos projects trabajos portfolio'),
      nav('se7en', p.goSe7en, 'se7en gimnasio gym web caso estudio case study'),
      nav('jfood', p.goJfood, 'jfood app nutricion nutrition android caso estudio case study'),
      nav('stack', t.nav.stack, 'stack tecnologias tools tecnologias'),
      nav('enfoque', t.nav.approach, 'sobre mi about como trabajo how i work principios'),
      nav('faq', p.goFaq, 'faq preguntas frecuentes presupuesto'),
      nav('contacto', t.nav.contact, 'contacto contact escribir hablar'),

      {
        id: 'theme',
        group: 'actions',
        label: p.theme,
        keywords: 'tema oscuro claro dark light theme',
        icon: <SunMoon size={ICON} aria-hidden="true" />,
        run: () => {
          setOpen(false)
          toggleTheme()
        },
      },
      {
        id: 'lang',
        group: 'actions',
        label: p.langTo,
        keywords: 'idioma language english ingles español spanish',
        icon: <Languages size={ICON} aria-hidden="true" />,
        run: () => {
          location.href = otherHref + location.hash
        },
      },
      {
        id: 'airplane',
        group: 'actions',
        label: offline ? p.airplaneOff : p.airplaneOn,
        keywords: 'modo avion airplane offline sin red conexion',
        icon: <Plane size={ICON} aria-hidden="true" />,
        run: () => {
          setOpen(false)
          toggleOffline()
        },
      },
      {
        id: 'copy-email',
        group: 'actions',
        label: c.copy,
        keywords: `email correo copiar copy mail ${profile.email}`,
        icon: <Copy size={ICON} aria-hidden="true" />,
        run: () => {
          setOpen(false)
          navigator.clipboard.writeText(profile.email).then(
            () => showToast(c.copied),
            () => showToast(c.copyFailed),
          )
        },
      },
      {
        id: 'whatsapp',
        group: 'actions',
        label: c.whatsapp,
        keywords: 'whatsapp mensaje escribir message chat',
        icon: <WhatsappIcon size={ICON} />,
        disabled: offline,
        hint: offline ? p.needsNetwork : undefined,
        run: openUrl(whatsappHref(c.whatsappText)),
      },
      {
        id: 'call',
        group: 'actions',
        label: `${p.call} · ${profile.phone}`,
        keywords: 'llamar telefono phone call movil',
        icon: <Phone size={ICON} aria-hidden="true" />,
        run: () => {
          location.href = profile.phoneHref
        },
      },
      ...(profile.cv
        ? [
            {
              id: 'cv',
              group: 'actions' as const,
              label: c.cv,
              keywords: 'cv curriculum resume descargar download pdf',
              icon: <FileDown size={ICON} aria-hidden="true" />,
              run: openUrl(profile.cv),
            },
          ]
        : []),
      {
        id: 'github',
        group: 'actions',
        label: 'GitHub',
        keywords: 'github codigo code repositorio repos',
        icon: <GithubIcon size={ICON} />,
        disabled: offline,
        hint: offline ? p.needsNetwork : undefined,
        run: openUrl(profile.github),
      },
      ...(profile.linkedin
        ? [
            {
              id: 'linkedin',
              group: 'actions' as const,
              label: 'LinkedIn',
              keywords: 'linkedin perfil profile',
              icon: <LinkedinIcon size={ICON} />,
              disabled: offline,
              hint: offline ? p.needsNetwork : undefined,
              run: openUrl(profile.linkedin),
            },
          ]
        : []),

      {
        id: 'open-se7en',
        group: 'projects',
        label: p.openSe7en,
        keywords: 'se7en gimnasio web sitio gym website',
        icon: <Globe size={ICON} aria-hidden="true" />,
        disabled: offline,
        hint: offline ? p.needsNetwork : undefined,
        run: openUrl(profile.se7en.siteUrl),
      },
      {
        id: 'jfood-code',
        group: 'projects',
        label: p.jfoodCode,
        keywords: 'jfood codigo code github repositorio',
        icon: <GithubIcon size={ICON} />,
        disabled: offline,
        hint: offline ? p.needsNetwork : undefined,
        run: openUrl(profile.jfood.repoUrl),
      },
      {
        id: 'jfood-apk',
        group: 'projects',
        label: p.jfoodApk,
        keywords: 'jfood apk descargar download android',
        icon: <Download size={ICON} aria-hidden="true" />,
        disabled: offline,
        hint: offline ? p.needsNetwork : undefined,
        run: openUrl(profile.jfood.releaseUrl),
      },
    ]
    return list
    // showToast es estable (solo usa estado y un ref).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, offline, otherHref])

  function showToast(message: string) {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3000)
  }

  const results = useMemo(() => {
    const tokens = norm(query).split(/\s+/).filter(Boolean)
    if (!tokens.length) return items
    return items.filter((it) => {
      const hay = norm(`${it.label} ${it.keywords}`)
      return tokens.every((tk) => hay.includes(tk))
    })
  }, [items, query])

  // Si el filtro deja menos resultados que la posición activa, vuelve al principio.
  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, listId, results])

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const n = results.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (n) setActive((a) => (a + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (n) setActive((a) => (a - 1 + n) % n)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(Math.max(0, n - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const it = results[active]
      if (it && !it.disabled) it.run()
    }
  }

  // Filas con encabezados de grupo, sin perder el índice plano que usa el teclado.
  const rows: ({ type: 'group'; key: string; label: string } | { type: 'item'; item: Item; index: number })[] = []
  let last: Group | null = null
  results.forEach((item, index) => {
    if (item.group !== last) {
      rows.push({ type: 'group', key: item.group, label: p.groups[item.group] })
      last = item.group
    }
    rows.push({ type: 'item', item, index })
  })

  return (
    <>
      <dialog
        ref={dialog}
        className="palette"
        aria-label={p.title}
        onClose={close}
        onClick={(e) => {
          // Un clic en el fondo (el propio <dialog>, fuera de la caja) cierra.
          if (e.target === dialog.current) close()
        }}
      >
        {open && (
          <div className="palette__box">
            <div className="palette__field">
              <Search size={18} aria-hidden="true" />
              <input
                ref={input}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                aria-autocomplete="list"
                aria-label={p.title}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={p.placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <kbd aria-hidden="true">Esc</kbd>
            </div>

            <ul id={listId} role="listbox" aria-label={p.title} className="palette__list">
              {rows.map((row) =>
                row.type === 'group' ? (
                  <li key={`g-${row.key}`} role="presentation" className="palette__group">
                    {row.label}
                  </li>
                ) : (
                  <li
                    key={row.item.id}
                    id={`${listId}-${row.index}`}
                    role="option"
                    aria-selected={row.index === active}
                    aria-disabled={row.item.disabled || undefined}
                    className={`palette__item${row.index === active ? ' is-active' : ''}`}
                    onMouseMove={() => setActive(row.index)}
                    onClick={() => !row.item.disabled && row.item.run()}
                  >
                    <span className="palette__icon">{row.item.icon}</span>
                    <span className="palette__label">{row.item.label}</span>
                    {row.item.hint && <span className="palette__hint">{row.item.hint}</span>}
                  </li>
                ),
              )}
            </ul>
            {!results.length && (
              <p className="palette__empty" role="status">
                {p.empty}
              </p>
            )}
            <p className="palette__foot">{p.hint}</p>
          </div>
        )}
      </dialog>
      <Toast message={toast} />
    </>
  )
}
