import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Israorigin task surfaces.

  Every task shares the same "Warm Studio" identity — cream canvas, white pill
  surfaces, generous radii, geometric display type — but each one carries its
  own colour from the play palette so sections never feel interchangeable.
  Tokens are delivered as CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif"
const BODY = "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#F3EFE5',
  surface: '#FFFFFF',
  raised: '#EFE9DB',
  text: '#17170F',
  muted: '#5B5A50',
  line: '#E4DECE',
  onAccent: '#FFFFFF',
  radius: '1.75rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note' | 'accent' | 'accentSoft' | 'glow'>

const green = { accent: '#3E9C33', accentSoft: '#E4F4DF', glow: 'rgba(92,191,78,0.16)' }
const blue = { accent: '#2E7FF5', accentSoft: '#DEEAFE', glow: 'rgba(46,127,245,0.14)' }
const coral = { accent: '#E04A34', accentSoft: '#FDE3DE', glow: 'rgba(244,99,78,0.16)' }
const violet = { accent: '#8A4FC0', accentSoft: '#F3E7FC', glow: 'rgba(221,184,247,0.24)' }
const amber = { accent: '#A97C05', accentSoft: '#FBF3C6', glow: 'rgba(242,220,60,0.24)' }

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, ...coral, kicker: 'Reading', note: 'Long reads, guides and perspective worth your time.' },
  listing: { ...base, ...green, kicker: 'Directory', note: 'Find, compare and connect with the right people.' },
  classified: { ...base, ...amber, kicker: 'Marketplace', note: 'Fresh offers and notices, ready to act on.' },
  image: { ...base, ...blue, kicker: 'Gallery', note: 'A visual feed of standout images and collections.' },
  sbm: { ...base, ...violet, kicker: 'Saved', note: 'Curated links and references worth keeping.' },
  pdf: { ...base, ...coral, kicker: 'Library', note: 'Downloadable guides, reports and references.' },
  profile: { ...base, ...green, kicker: 'People', note: 'Meet the makers, owners and independents behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
