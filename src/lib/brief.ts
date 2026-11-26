// Datos del "brief" de contacto: qué tipo de proyecto, qué intención y qué presupuesto.
// Los textos que ve el visitante viven en el diccionario (contact.types, contact.intents, contact.budgets).

export const projectTypes = ['web', 'landing', 'app', 'software', 'automation', 'maintenance', 'collab'] as const
export type ProjectType = (typeof projectTypes)[number]

export const intents = ['quote', 'call'] as const
export type Intent = (typeof intents)[number]

export const budgetKeys = ['lt1k', 'b1to3k', 'b3to8k', 'gt8k', 'unknown'] as const
export type BudgetKey = (typeof budgetKeys)[number]

export interface BriefPreset {
  type?: ProjectType
  intent?: Intent
}

/** Evento que rellena el formulario desde cualquier botón de la misma página (como OPEN_PALETTE). */
export const PRESET_BRIEF = 'preset-brief'

export function presetBrief(detail: BriefPreset) {
  window.dispatchEvent(new CustomEvent<BriefPreset>(PRESET_BRIEF, { detail }))
}

const isType = (v: string | null): v is ProjectType => !!v && (projectTypes as readonly string[]).includes(v)
const isIntent = (v: string | null): v is Intent => !!v && (intents as readonly string[]).includes(v)

/** Entre páginas el preajuste viaja en la URL: `/?tipo=web&intencion=call#contacto`. */
export function briefUrl(home: string, preset: BriefPreset): string {
  const q = new URLSearchParams()
  if (preset.type) q.set('tipo', preset.type)
  if (preset.intent) q.set('intencion', preset.intent)
  const qs = q.toString()
  return `${home}${qs ? `?${qs}` : ''}#contacto`
}

export function presetFromSearch(search: string): BriefPreset {
  const q = new URLSearchParams(search)
  const type = q.get('tipo')
  const intent = q.get('intencion')
  return { ...(isType(type) && { type }), ...(isIntent(intent) && { intent }) }
}
