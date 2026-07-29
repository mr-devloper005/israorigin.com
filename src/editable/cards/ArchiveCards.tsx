import Link from 'next/link'
import {
  ArrowUpRight, Building2, Download, FileText, Globe, ImageIcon, Mail, MapPin, Phone, UserRound,
} from 'lucide-react'
import { playColor } from '@/editable/layouts/design-contract'

/*
  Archive card set.

  These render from a small, fully serialisable view model so both the server
  archive page and the client-side explorer can share exactly the same visuals.
  Every field is optional-safe: a missing image, summary or category simply
  drops out instead of leaving a hole in the layout.
*/

export type ArchiveItem = {
  id: string
  title: string
  href: string
  image: string
  hasImage: boolean
  category: string
  summary: string
  images: string[]
  location: string
  phone: string
  email: string
  website: string
  price: string
  condition: string
  role: string
}

export type ArchiveLayout = 'grid' | 'list'

const cardShell =
  'iso-card group block min-w-0 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(23,23,15,0.14)]'

function Fallback({ icon: Icon }: { icon: typeof ImageIcon }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--tk-raised)]">
      <Icon className="h-8 w-8 text-[var(--tk-muted)] opacity-60" />
    </div>
  )
}

function CategoryChip({ label, index = 0 }: { label: string; index?: number }) {
  if (!label) return null
  const color = playColor(index)
  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ background: color.soft, color: color.key === 'blue' ? '#12417F' : '#2A2A16' }}
    >
      {label}
    </span>
  )
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="iso-arrow h-4 w-4" />
    </span>
  )
}

/* ---------------------------------------------------------- gallery (image) */
export function ArchiveGalleryCard({ item, index }: { item: ArchiveItem; index: number }) {
  const tall = index % 3 === 0
  return (
    <Link href={item.href} className={`iso-card group relative block overflow-hidden rounded-[var(--tk-radius)] bg-[var(--tk-raised)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(23,23,15,0.16)]`}>
      <div className={`iso-card-media relative w-full ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        {item.hasImage ? (
          <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <Fallback icon={ImageIcon} />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,15,0)_42%,rgba(23,23,15,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {item.category ? (
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-text)]">
            {item.category}
          </span>
        ) : null}
        <h2 className="editable-display mt-3 line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.03em] text-white sm:text-xl">
          {item.title}
        </h2>
        {item.images.length > 1 ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/70">
            <ImageIcon className="h-3.5 w-3.5" /> {item.images.length} images
          </span>
        ) : null}
      </div>
      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 transition duration-500 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-text)]" />
      </span>
    </Link>
  )
}

/* ----------------------------------------------------------- person (profile) */
export function ArchivePersonCard({ item, index }: { item: ArchiveItem; index: number }) {
  const color = playColor(index)
  return (
    <Link href={item.href} className={`${cardShell} flex flex-col`}>
      <div className="relative h-24" style={{ background: color.soft }}>
        <span className="absolute -bottom-9 left-6 flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border-4 border-[var(--tk-surface)] bg-[var(--tk-raised)] shadow-sm">
          {item.hasImage ? (
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <UserRound className="h-8 w-8 text-[var(--tk-muted)]" />
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-12">
        <h2 className="editable-display line-clamp-1 text-xl font-semibold tracking-[-0.03em]">{item.title}</h2>
        {item.role || item.category ? (
          <p className="mt-1 line-clamp-1 text-sm font-medium text-[var(--tk-accent)]">{item.role || item.category}</p>
        ) : null}
        {item.summary ? <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{item.summary}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[var(--tk-muted)]">
          {item.location ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {item.location}
            </span>
          ) : null}
          {item.website ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website
            </span>
          ) : null}
          {item.email ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1.5">
              <Mail className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Email
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------ editorial card */
export function ArchiveEditorialCard({ item, index }: { item: ArchiveItem; index: number }) {
  return (
    <Link href={item.href} className={cardShell}>
      <div className="p-2.5">
        <div className="iso-card-media relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-[var(--tk-raised)]">
          {item.hasImage ? (
            <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ) : (
            <Fallback icon={FileText} />
          )}
        </div>
      </div>
      <div className="px-6 pb-7 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip label={item.category} index={index} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
            No. {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h2 className="editable-display mt-3 line-clamp-2 text-[1.4rem] font-semibold leading-[1.18] tracking-[-0.03em]">{item.title}</h2>
        {item.summary ? <p className="mt-3 line-clamp-2 text-[0.92rem] leading-6 text-[var(--tk-muted)]">{item.summary}</p> : null}
        <CardArrow label="Read post" />
      </div>
    </Link>
  )
}

/* --------------------------------------------------------------- list row */
export function ArchiveRowCard({ item, index }: { item: ArchiveItem; index: number }) {
  return (
    <Link
      href={item.href}
      className={`${cardShell} grid items-center gap-5 p-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:p-4`}
    >
      <div className="iso-card-media relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-[var(--tk-raised)] sm:aspect-[4/3]">
        {item.hasImage ? (
          <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <Fallback icon={ImageIcon} />
        )}
      </div>
      <div className="min-w-0 px-1 pb-3 sm:px-3 sm:py-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip label={item.category} index={index} />
          {item.location ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--tk-muted)]">
              <MapPin className="h-3.5 w-3.5" /> {item.location}
            </span>
          ) : null}
        </div>
        <h2 className="editable-display mt-3 line-clamp-2 text-2xl font-semibold leading-[1.15] tracking-[-0.035em]">{item.title}</h2>
        {item.summary ? <p className="mt-3 line-clamp-2 text-[0.95rem] leading-7 text-[var(--tk-muted)]">{item.summary}</p> : null}
        <CardArrow label="Open" />
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------ directory card */
export function ArchiveDirectoryCard({ item }: { item: ArchiveItem }) {
  return (
    <Link href={item.href} className={`${cardShell} flex items-center gap-5 p-5 sm:p-6`}>
      <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {item.hasImage ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Building2 className="h-8 w-8 text-[var(--tk-muted)]" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="editable-display block truncate text-lg font-semibold tracking-[-0.03em]">{item.title}</span>
        {item.summary ? <span className="mt-1.5 block line-clamp-1 text-sm leading-6 text-[var(--tk-muted)]">{item.summary}</span> : null}
        <span className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {item.location ? (
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {item.location}</span>
          ) : null}
          {item.phone ? (
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {item.phone}</span>
          ) : null}
          {item.website ? (
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span>
          ) : null}
        </span>
      </span>
      <ArrowUpRight className="iso-arrow h-5 w-5 shrink-0 text-[var(--tk-muted)]" />
    </Link>
  )
}

/* --------------------------------------------------------------- offer card */
export function ArchiveOfferCard({ item, index }: { item: ArchiveItem; index: number }) {
  const color = playColor(index)
  return (
    <Link href={item.href} className={`${cardShell} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-semibold tracking-[-0.04em] text-[var(--tk-accent)]">
          {item.price || 'Open offer'}
        </span>
        {item.condition ? (
          <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ background: color.soft, color: '#2A2A16' }}>
            {item.condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-5 line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.03em]">{item.title}</h2>
      {item.summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{item.summary}</p> : null}
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {item.location ? <><MapPin className="h-3.5 w-3.5" /> {item.location}</> : 'Details inside'}
        </span>
        <ArrowUpRight className="iso-arrow h-4 w-4 text-[var(--tk-accent)]" />
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------ document card */
export function ArchiveDocumentCard({ item }: { item: ArchiveItem }) {
  return (
    <Link href={item.href} className={`${cardShell} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <FileText className="h-5 w-5" />
        </span>
        {item.category ? (
          <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">
            {item.category}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-6 line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.03em]">{item.title}</h2>
      {item.summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{item.summary}</p> : null}
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--tk-accent)]">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* ---------------------------------------------------------------- link card */
export function ArchiveLinkCard({ item, index }: { item: ArchiveItem; index: number }) {
  const color = playColor(index)
  const domain = item.website ? item.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
  return (
    <Link href={item.href} className={`${cardShell} flex gap-4 p-6`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: color.soft }}>
        <Globe className="h-5 w-5 text-[var(--tk-accent)]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
          Saved · {String(index + 1).padStart(2, '0')}
        </span>
        <span className="editable-display mt-1.5 block line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.03em]">{item.title}</span>
        {item.summary ? <span className="mt-2 block line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{item.summary}</span> : null}
        {domain ? <span className="mt-3 block truncate text-xs font-semibold text-[var(--tk-accent)]">{domain}</span> : null}
      </span>
    </Link>
  )
}

/**
 * Picks a card style for a task. Within a task the shape still rotates on
 * index so a long grid never reads as one repeated template.
 */
export function renderArchiveCard(task: string, item: ArchiveItem, index: number, layout: ArchiveLayout = 'grid') {
  if (layout === 'list') return <ArchiveRowCard item={item} index={index} />
  if (task === 'image') return <ArchiveGalleryCard item={item} index={index} />
  if (task === 'profile') return index % 5 === 4 ? <ArchiveDirectoryCard item={item} /> : <ArchivePersonCard item={item} index={index} />
  if (task === 'listing') return <ArchiveDirectoryCard item={item} />
  if (task === 'classified') return <ArchiveOfferCard item={item} index={index} />
  if (task === 'pdf') return <ArchiveDocumentCard item={item} />
  if (task === 'sbm') return <ArchiveLinkCard item={item} index={index} />
  if (index % 7 === 3) return <ArchiveRowCard item={item} index={index} />
  return <ArchiveEditorialCard item={item} index={index} />
}

/** Grid classes that match the card style chosen for each task. */
export function archiveGridClass(task: string, layout: ArchiveLayout = 'grid') {
  if (layout === 'list') return 'grid gap-4'
  if (task === 'image') return 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3'
  if (task === 'profile') return 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
  if (task === 'listing') return 'grid gap-5 xl:grid-cols-2'
  return 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
}
