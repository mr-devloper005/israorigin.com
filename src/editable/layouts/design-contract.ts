import type { CSSProperties } from 'react'

/*
  Israorigin visual system — "Warm Studio".

  A cream canvas, chunky white pill surfaces, oversized display type and a
  four-colour play palette (green / yellow / coral / blue) with a lilac accent
  used for underlines and highlights. Everything is driven by CSS variables so
  a single edit here re-skins the whole site.
*/

export const editableRootStyle = {
  /* ---- core canvas ---- */
  '--slot4-page-bg': '#F3EFE5',
  '--slot4-page-text': '#17170F',
  '--slot4-panel-bg': '#FFFFFF',
  '--slot4-surface-bg': '#FFFFFF',
  '--slot4-muted-text': '#5B5A50',
  '--slot4-soft-muted-text': '#8C8A7E',

  /* ---- accent (leaf green) ---- */
  '--slot4-accent': '#3E9C33',
  '--slot4-accent-fill': '#5CBF4E',
  '--slot4-accent-soft': '#E4F4DF',
  '--slot4-on-accent': '#12210E',

  /* ---- ink / media ---- */
  '--slot4-dark-bg': '#17170F',
  '--slot4-dark-text': '#F5F1E6',
  '--slot4-media-bg': '#E8E2D4',
  '--slot4-cream': '#F3EFE5',
  '--slot4-warm': '#EFE9DB',
  '--slot4-lavender': '#F3E7FC',
  '--slot4-gray': '#EFE9DB',
  '--slot4-body-gradient': 'none',

  /* ---- play palette ---- */
  '--iso-green': '#5CBF4E',
  '--iso-green-deep': '#3E9C33',
  '--iso-green-panel': '#7BC765',
  '--iso-green-soft': '#E4F4DF',
  '--iso-yellow': '#F2DC3C',
  '--iso-yellow-soft': '#FBF3C6',
  '--iso-coral': '#F4634E',
  '--iso-coral-soft': '#FDE3DE',
  '--iso-blue': '#2E7FF5',
  '--iso-blue-soft': '#DEEAFE',
  '--iso-lilac': '#DDB8F7',
  '--iso-lilac-soft': '#F3E7FC',
  '--iso-ink': '#17170F',
  '--iso-cream': '#F3EFE5',

  /* ---- shell ---- */
  '--editable-page-bg': '#F3EFE5',
  '--editable-page-text': '#17170F',
  '--editable-container': '1280px',
  '--editable-border': '#E4DECE',
  '--editable-nav-bg': '#FFFFFF',
  '--editable-nav-text': '#17170F',
  '--editable-nav-active': '#5CBF4E',
  '--editable-nav-active-text': '#12210E',
  '--editable-cta-bg': '#5CBF4E',
  '--editable-cta-text': '#12210E',
  '--editable-search-bg': '#FFFFFF',
  '--editable-footer-bg': '#17170F',
  '--editable-footer-text': '#F5F1E6',

  /* ---- shape ---- */
  '--iso-radius-xl': '2.25rem',
  '--iso-radius-lg': '1.75rem',
  '--iso-radius-md': '1.15rem',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_2px_10px_rgba(23,23,15,0.05)]',
  shadowStrong: 'shadow-[0_22px_60px_rgba(23,23,15,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(23,23,15,0)_35%,rgba(23,23,15,0.82)_100%)]',
} as const

/** The four rotating play colours, used to keep cards and tiles visually varied. */
export const isoPlayColors = [
  { key: 'green', fill: 'var(--iso-green)', soft: 'var(--iso-green-soft)', on: '#12210E' },
  { key: 'yellow', fill: 'var(--iso-yellow)', soft: 'var(--iso-yellow-soft)', on: '#221F05' },
  { key: 'coral', fill: 'var(--iso-coral)', soft: 'var(--iso-coral-soft)', on: '#2A0C06' },
  { key: 'blue', fill: 'var(--iso-blue)', soft: 'var(--iso-blue-soft)', on: '#FFFFFF' },
] as const

export function playColor(index: number) {
  return isoPlayColors[Math.abs(index) % isoPlayColors.length]
}

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[260px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]',
    sectionTitle: 'editable-display text-3xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]',
    body: 'text-base leading-[1.75]',
  },
  surface: {
    card: `rounded-[var(--iso-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[var(--iso-radius-lg)] border ${editablePalette.border} ${editablePalette.warmBg}`,
    dark: `rounded-[var(--iso-radius-xl)] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    pill: 'rounded-full border border-[var(--editable-border)] bg-white',
  },
  button: {
    primary:
      'group inline-flex items-center gap-3 rounded-full bg-[var(--slot4-dark-bg)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--slot4-dark-text)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(23,23,15,0.28)] active:translate-y-0',
    secondary:
      'group inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-6 pr-2 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--iso-green)] hover:shadow-[0_14px_34px_rgba(23,23,15,0.12)]',
    accent:
      'group inline-flex items-center gap-3 rounded-full bg-[var(--iso-yellow)] py-2 pl-6 pr-2 text-sm font-semibold text-[#221F05] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(242,220,60,0.45)]',
    quiet:
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--iso-radius-md)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(23,23,15,0.14)]',
    fade: 'transition duration-300 hover:opacity-80',
    press: 'transition duration-200 active:scale-[0.98]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site colour palette in editableRootStyle first; every section consumes those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Rotate the play palette (playColor) across tiles and cards so no two neighbouring blocks feel identical.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
