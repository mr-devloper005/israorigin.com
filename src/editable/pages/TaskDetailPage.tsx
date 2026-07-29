import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink,
  FileText, Globe2, Mail, MapPin, Phone, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableGalleryLightbox } from '@/editable/components/EditableGalleryLightbox'
import { EditableReadingProgress } from '@/editable/components/EditableMotion'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { playColor } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------------------------------------- data helpers */

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  // De-duplicate: the API ships the same asset in several of these fields, so a
  // plain concat renders one picture as a gallery of identical copies (and, on
  // profiles, the logo repeated down the page).
  return dedupeUrls([...media, ...images, ...singleImages]).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
// Compare on letters/digits only, so punctuation, casing or a stray keyword
// paragraph appended by the generator cannot defeat the duplicate check.
const comparable = (value: string) => stripHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
// Plain-text lead intro, but only when it isn't already part of the body. The
// API commonly returns identical text in `description` and `body`; rendering
// both is what showed the summary twice on listing and profile pages.
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  if (!lead) return ''
  const leadKey = comparable(lead)
  return leadKey && comparable(getBody(post)).includes(leadKey) ? '' : lead
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* ---------------------------------------------------------------- entry view */

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------------------------------------ shared chrome */

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] py-2 pl-3 pr-4 text-sm font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tk-raised)]">
        <ArrowLeft className="h-3.5 w-3.5" />
      </span>
      {taskConfig?.label || 'Back'}
    </Link>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-current opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function MetaRow({ items, center = false }: { items: string[]; center?: boolean }) {
  const visible = items.filter(Boolean)
  if (!visible.length) return null
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-2 ${center ? 'justify-center' : ''}`}>
      {visible.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: playColor(index).soft, color: '#2A2A16' }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function Divider() {
  return <div className="my-10 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[0.95rem] leading-7' : 'text-[1.05rem] leading-[1.85]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon], index) => (
        <div key={label} className="rounded-[1.15rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: playColor(index).soft }}>
              <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
            </span>
            {label}
          </div>
          <p className="mt-2.5 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <Link
          href={website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
        >
          Website <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]">
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]">
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Get in touch</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full bg-[var(--tk-raised)] px-4 py-2.5 text-sm">
      <span className="font-medium uppercase tracking-[0.1em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

/* --------------------------------------------------------------- 1. article */

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <EditableReadingProgress />
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <BackLink task="article" />
        <div className="mt-9">
          <Kicker task="article">{categoryOf(post, 'Article')}</Kicker>
        </div>
        <h1 className="editable-display mt-6 text-balance text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--tk-muted)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <FileText className="h-4 w-4" />
          </span>
          {SITE_CONFIG.name}
        </div>
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        {images.length > 1 ? <EditableGalleryLightbox images={images.slice(1)} label="More from this post" variant="strip" /> : null}
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* --------------------------------------------------------------- 2. profile */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company'])
  const location = getField(post, ['location', 'city', 'address'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])

  return (
    <>
      <section className={`${shell} py-10 sm:py-14`}>
        <BackLink task="profile" />

        {/* identity banner */}
        <div className="mt-7 overflow-hidden rounded-[2.25rem] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="iso-grain relative h-32 bg-[var(--iso-green-panel)] sm:h-40">
            <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-4 right-8 h-10 w-10 rounded-[0.8rem] bg-[var(--iso-yellow)]" aria-hidden="true" />
          </div>
          <div className="px-6 pb-8 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[6px] border-[var(--tk-surface)] bg-[var(--tk-raised)] shadow-[0_16px_36px_rgba(23,23,15,0.16)] sm:h-32 sm:w-32">
                  {images[0] ? (
                    <img src={images[0]} alt={post.title} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-12 w-12 text-[var(--tk-muted)]" />
                  )}
                </div>
                <h1 className="editable-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[2.75rem]">
                  {post.title}
                </h1>
                {role ? <p className="mt-2 text-base font-medium text-[var(--tk-accent)]">{role}</p> : null}
                <MetaRow items={[location, categoryOf(post, ''), website ? 'Online' : ''].filter(Boolean)} />
              </div>
              <div className="shrink-0 pb-1">
                <ContactAction website={website} phone={phone} email={email} bare />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:p-9">
            <h2 className="editable-display text-xl font-semibold tracking-[-0.03em]">About</h2>
            {leadText(post) ? <p className="mt-4 text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} />
            {images.length > 1 ? <EditableGalleryLightbox images={images.slice(1)} label="Gallery" variant="grid" /> : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Details</p>
              <div className="mt-4 grid gap-2.5">
                {role ? <BadgeLine label="Role" value={role} /> : null}
                {location ? <BadgeLine label="Based in" value={location} /> : null}
                {categoryOf(post, '') ? <BadgeLine label="Category" value={categoryOf(post, '')} /> : null}
              </div>
            </div>
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="profile" related={related} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ----------------------------------------------------------------- 3. image */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  const category = categoryOf(post, 'Gallery')

  return (
    <>
      <section className={`${shell} py-10 sm:py-14`}>
        <BackLink task="image" />

        {/* cover */}
        <div className="mt-7 overflow-hidden rounded-[2.25rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
            <img src={gallery[0]} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,15,0)_40%,rgba(23,23,15,0.88)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-text)]">
                <Camera className="h-3.5 w-3.5" /> {category}
              </span>
              <h1 className="editable-display mt-4 max-w-3xl text-balance text-[2rem] font-semibold leading-[1.06] tracking-[-0.035em] text-white sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-3 text-sm text-white/70">
                {gallery.length} {gallery.length === 1 ? 'image' : 'images'} in this collection
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]">
          <div className="min-w-0">
            <EditableGalleryLightbox images={gallery} label="Full collection" variant="masonry" />
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:p-7">
              <h2 className="editable-display text-xl font-semibold tracking-[-0.03em]">About this collection</h2>
              {leadText(post) ? <p className="mt-4 text-[0.98rem] leading-7 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
              <BodyContent post={post} compact />
            </div>
            <div className="mt-6">
              <RelatedPanel task="image" related={related} />
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* --------------------------------------------------------------- 4. listing */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className={`${shell} py-10 sm:py-14`}>
      <BackLink task="listing" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">{categoryOf(post, 'Listing')}</Kicker>
              <h1 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[2.75rem]">{post.title}</h1>
              <MetaRow items={[address, phone ? 'Phone listed' : '', website ? 'Website' : ''].filter(Boolean)} />
            </div>
          </div>
          {leadText(post) ? <p className="mt-7 max-w-2xl text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          {images.length > 1 ? <EditableGalleryLightbox images={images.slice(1)} label="Showcase" variant="strip" /> : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 5. classified */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${shell} grid gap-10 py-10 sm:py-14 lg:grid-cols-[360px_minmax(0,1fr)]`}>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_20px_50px_rgba(23,23,15,0.08)]">
            <Kicker task="classified">{categoryOf(post, 'Offer')}</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em]">{post.title}</h1>
            <p className="editable-display mt-6 text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[var(--tk-accent)]">
              {price || 'Open offer'}
            </p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? (
                <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                  <Phone className="h-4 w-4" /> Call now
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]">
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? <EditableGalleryLightbox images={images} label="Offer images" variant="grid" /> : null}
          <BodyContent post={post} />
          <div className="mt-8">
            <ContactAction website={website} phone={phone} email={email} />
          </div>
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* -------------------------------------------------------------- 6. bookmark */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <BackLink task="sbm" />
        <div className="mt-9 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="mt-6">
          <Kicker task="sbm">{categoryOf(post, 'Resource')}</Kicker>
        </div>
        <h1 className="editable-display mt-5 text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-[1.75] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--tk-accent)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:-translate-y-0.5"
          >
            Open resource
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
              <ExternalLink className="h-4 w-4" />
            </span>
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ------------------------------------------------------------------ 7. pdf */

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className={`${shell} py-10 sm:py-14`}>
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <FileText className="h-9 w-9" />
            </div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-semibold">Document preview</span>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
                >
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
              {/* min-height as well as the viewport height: a collapsed parent
                  must never be able to squash the embed to 0px, which is how the
                  document silently disappeared while the link still worked. */}
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] min-h-[520px] w-full bg-[var(--tk-raised)]" />
              <div className="border-t border-[var(--tk-line)] p-4 text-sm text-[var(--tk-muted)]">
                Can&apos;t see the document?{' '}
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--tk-accent)] underline">Open it in a new tab</Link>.
              </div>
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-sm font-semibold">Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
              >
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- related */

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-lg font-semibold tracking-[-0.03em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">View all</Link>
          </div>
          <div className="mt-4 grid gap-1.5">
            {related.map((item, index) => <RelatedCard key={item.id || item.slug} task={task} post={item} index={index} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${shell} py-14 sm:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            More {(taskConfig?.label || 'posts').toLowerCase()}
          </h2>
          <Link
            href={taskConfig?.route || '/'}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] py-2 pl-5 pr-2 text-sm font-semibold transition hover:-translate-y-0.5"
          >
            View all
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <ArrowUpRight className="iso-arrow h-4 w-4" />
            </span>
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => <RelatedCard key={item.id || item.slug} task={task} post={item} index={index} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, index = 0, grid = false }: { task: TaskKey; post: SitePost; index?: number; grid?: boolean }) {
  const image = getImages(post)[0]
  // Build the detail URL from the task route (e.g. /listing/<slug>) — the same
  // base the archive cards use. buildPostUrl() can fall back to /posts when the
  // task isn't in the enabled taskViews map, which 404s.
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="iso-card group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(23,23,15,0.14)]">
        <div className="p-2.5">
          <div className="iso-card-media relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-[var(--tk-raised)]">
            {image ? (
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></span>
            )}
          </div>
        </div>
        <div className="px-5 pb-6 pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="editable-display mt-2 line-clamp-2 text-base font-semibold leading-snug tracking-[-0.02em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-[1.15rem] p-2 transition hover:bg-[var(--tk-raised)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-14 w-14 shrink-0 rounded-[0.9rem] object-cover" loading="lazy" />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.9rem] bg-[var(--tk-raised)]">
          <FileText className="h-5 w-5 text-[var(--tk-muted)]" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="editable-display block line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.02em]">{post.title}</span>
        <span className="mt-1 block line-clamp-1 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</span>
      </span>
      <ArrowUpRight className="iso-arrow h-4 w-4 shrink-0 text-[var(--tk-muted)]" />
    </Link>
  )
}
