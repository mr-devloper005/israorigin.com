import Link from 'next/link'
import { ArrowUpRight, ImageIcon, Quote, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal, playColor } from '@/editable/layouts/design-contract'

// The posting API repeats the same asset across `media[]`, `content.images[]`,
// `content.image`, `content.featuredImage` and `content.logo`. Any surface that
// collects several of those fields must de-duplicate, otherwise one picture is
// rendered as a gallery of identical copies (profile logos shown five times,
// image posts shown four times).
export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    ),
  )
}

export const EDITABLE_PLACEHOLDER = '/placeholder.svg?height=900&width=1400'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || EDITABLE_PLACEHOLDER
}

/** True when the post ships a real asset (not the shared placeholder). */
export function hasEditableImage(post?: SitePost | null) {
  const image = getEditablePostImage(post)
  return Boolean(image) && !image.includes('placeholder')
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or already-plain text — to
// a clean plain-text card summary. Card excerpts must never show raw markup regardless of
// what the content API sends. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt;.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

/** Optional secondary line (role / location / company) used by people cards. */
export function getEditableMetaLine(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  for (const key of ['role', 'designation', 'company', 'location', 'city']) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function Chip({ label, index = 0 }: { label: string; index?: number }) {
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

/* ------------------------------------------------------------------ 1. Featured */
/** Large, image-led hero card. Used once per section at most. */
export function EditorialFeatureCard({ post, href, label = 'In focus' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditablePostImage(post)
  const excerpt = getEditableExcerpt(post, 180)
  return (
    <Link href={href} className={`iso-card group relative block min-w-0 overflow-hidden rounded-[var(--iso-radius-xl)] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className="iso-card-media absolute inset-0">
        <img src={image} alt={post.title || ''} className="h-full w-full object-cover" />
      </div>
      <div className={`absolute inset-0 ${pal.overlay}`} />
      <div className="relative flex min-h-[420px] flex-col justify-end p-6 sm:min-h-[520px] sm:p-9">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--iso-green)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#12210E]">
          {label}
        </span>
        <h3 className="editable-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[2.75rem]">
          {post.title || 'Untitled post'}
        </h3>
        {excerpt ? <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-white/75">{excerpt}</p> : null}
        <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-semibold text-[var(--slot4-page-text)]">
          Open post
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iso-ink)] text-white">
            <ArrowUpRight className="iso-arrow h-4 w-4" />
          </span>
        </span>
      </div>
    </Link>
  )
}

/* ---------------------------------------------------------------- 2. Image-first */
/** Portrait, gallery-style card built for rails and masonry columns. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 100)
  return (
    <Link href={href} className={`iso-card group block ${dc.layout.minRailCard} overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="p-2.5">
        <div className={`iso-card-media ${dc.media.frame} aspect-[4/5]`}>
          <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] shadow-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="px-5 pb-6 pt-2">
        <Chip label={getEditableCategory(post)} index={index} />
        <h3 className="editable-display mt-3 line-clamp-2 text-xl font-semibold leading-[1.2] tracking-[-0.03em]">{post.title || 'Untitled post'}</h3>
        {excerpt ? <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------- 3. Compact */
/** Text-only index row with a colour-coded counter. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const color = playColor(index)
  const excerpt = getEditableExcerpt(post, 92)
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-start gap-4 rounded-[var(--iso-radius-md)] border border-[var(--editable-border)] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_40px_rgba(23,23,15,0.12)] sm:p-5"
    >
      <span
        className="editable-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        style={{ background: color.fill, color: color.on }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[11px] font-semibold uppercase tracking-[0.18em] ${pal.softMutedText}`}>{getEditableCategory(post)}</span>
        <span className="editable-display mt-1.5 block line-clamp-2 text-lg font-semibold leading-[1.25] tracking-[-0.03em]">{post.title || 'Untitled post'}</span>
        {excerpt ? <span className={`mt-1.5 block line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{excerpt}</span> : null}
      </span>
      <ArrowUpRight className={`iso-arrow mt-1 h-4 w-4 shrink-0 ${pal.softMutedText}`} />
    </Link>
  )
}

/* ----------------------------------------------------------------- 4. Horizontal */
/** Editorial row: media on the left, generous copy on the right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 190)
  return (
    <Link
      href={href}
      className={`iso-card group grid min-w-0 items-center gap-5 overflow-hidden ${dc.surface.card} p-3 ${dc.motion.lift} sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:p-4`}
    >
      <div className={`iso-card-media ${dc.media.frame} aspect-[16/11] sm:aspect-[4/3]`}>
        <img src={getEditablePostImage(post)} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 px-1 pb-3 sm:px-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip label={getEditableCategory(post)} index={index} />
          <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${pal.softMutedText}`}>No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 line-clamp-2 text-2xl font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[1.75rem]">
          {post.title || 'Untitled post'}
        </h2>
        {excerpt ? <p className={`mt-3 line-clamp-2 text-[0.95rem] leading-7 ${pal.mutedText}`}>{excerpt}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Read more <ArrowUpRight className="iso-arrow h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------- 5. Gallery tile */
/** Media-dominant tile with the caption laid over the image. Masonry safe. */
export function ImageFirstCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  return (
    <Link href={href} className={`iso-card group relative block overflow-hidden rounded-[var(--iso-radius-lg)] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className={`iso-card-media relative w-full ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt={post.title || ''} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,15,0)_45%,rgba(23,23,15,0.85)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {category ? (
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
            {category}
          </span>
        ) : null}
        <h3 className="editable-display mt-3 line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.03em] text-white sm:text-xl">
          {post.title || 'Untitled post'}
        </h3>
      </div>
      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--slot4-page-text)] opacity-0 transition duration-500 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------- 6. People card */
/** Identity-first card: colour block, round portrait, role line. */
export function ProfileSpotlightCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const color = playColor(index)
  const image = getEditablePostImage(post)
  const showImage = hasEditableImage(post)
  const role = getEditableMetaLine(post) || getEditableCategory(post)
  const excerpt = getEditableExcerpt(post, 96)
  return (
    <Link
      href={href}
      className={`iso-card group flex min-w-0 flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
    >
      <div className="relative h-24" style={{ background: color.soft }}>
        <div className="absolute -bottom-9 left-6 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[var(--slot4-media-bg)] shadow-sm">
          {showImage ? (
            <img src={image} alt={post.title || ''} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <UserRound className="h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-12">
        <h3 className="editable-display line-clamp-1 text-xl font-semibold tracking-[-0.03em]">{post.title || 'Untitled profile'}</h3>
        {role ? <p className="mt-1 line-clamp-1 text-sm font-medium text-[var(--slot4-accent)]">{role}</p> : null}
        {excerpt ? <p className={`mt-3 line-clamp-2 flex-1 text-sm leading-6 ${pal.mutedText}`}>{excerpt}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
          View profile <ArrowUpRight className="iso-arrow h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------- 7. Poster card */
/** Solid colour block for posts without imagery — keeps grids from going flat. */
export function PosterCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const color = playColor(index + 1)
  const excerpt = getEditableExcerpt(post, 120)
  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-col justify-between overflow-hidden rounded-[var(--iso-radius-lg)] p-6 ${dc.motion.lift} sm:p-7`}
      style={{ background: color.fill, color: color.on }}
    >
      <Quote className="h-7 w-7 opacity-45" />
      <div className="mt-8">
        <h3 className="editable-display line-clamp-3 text-2xl font-semibold leading-[1.12] tracking-[-0.035em]">
          {post.title || 'Untitled post'}
        </h3>
        {excerpt ? <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-75">{excerpt}</p> : null}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          Open <ArrowUpRight className="iso-arrow h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* --------------------------------------------------------------- 8. Quiet row */
/** Minimal list line used inside sidebars and "more like this" panels. */
export function QuietIndexRow({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const showImage = hasEditableImage(post)
  return (
    <Link href={href} className="group flex min-w-0 items-center gap-3 rounded-[1.15rem] p-2 transition hover:bg-[var(--slot4-warm)]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] bg-[var(--slot4-media-bg)]">
        {showImage ? (
          <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <ImageIcon className="h-5 w-5 text-[var(--slot4-soft-muted-text)]" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[11px] font-semibold uppercase tracking-[0.16em] ${pal.softMutedText}`}>
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </span>
        <span className="editable-display mt-1 block line-clamp-2 text-[0.95rem] font-semibold leading-snug tracking-[-0.02em]">
          {post.title || 'Untitled post'}
        </span>
      </span>
      <ArrowUpRight className={`iso-arrow h-4 w-4 shrink-0 ${pal.softMutedText}`} />
    </Link>
  )
}
