import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArchiveExplorer } from '@/editable/components/EditableArchiveExplorer'
import type { ArchiveItem } from '@/editable/cards/ArchiveCards'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { playColor } from '@/editable/layouts/design-contract'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  // Same de-duplication as the detail pages: the API repeats one asset across
  // media/images/image/logo, which otherwise fills a card gallery with copies.
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
// Reduce any content payload — rich HTML, entity-encoded HTML, or plain text — to a clean
// plain-text card summary. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt; so category/archive cards never show raw markup.
const stripHtml = (value: string) => value
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
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

/** Flattens a post into the small serialisable model the cards render from. */
function toArchiveItem(post: SitePost, basePath: string, fallbackCategory: string): ArchiveItem {
  const images = getImages(post)
  const image = images[0] || placeholder
  return {
    id: post.id || post.slug || post.title,
    title: post.title || 'Untitled post',
    href: `${basePath}/${post.slug}`,
    image,
    hasImage: Boolean(images[0]),
    category: getCategory(post, fallbackCategory),
    summary: getSummary(post),
    images,
    location: getField(post, ['location', 'address', 'city']),
    phone: getField(post, ['phone', 'telephone', 'mobile']),
    email: getField(post, ['email']),
    website: getField(post, ['website', 'url', 'link']),
    price: getField(post, ['price', 'amount', 'budget']),
    condition: getField(post, ['condition', 'type', 'availability']),
    role: getField(post, ['role', 'designation', 'company']),
  }
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const items = posts.map((post) => toArchiveItem(post, basePath, label))
  const otherSections = getBrowsableTasks().filter((item) => item.key !== task)

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* ---------------------------------------------------------- header */}
        <header className="relative overflow-hidden pt-10 sm:pt-14">
          <span className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full opacity-70 blur-3xl" style={{ background: 'var(--tk-glow)' }} aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2.25rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 sm:p-10 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-accent)]">
                    <Sparkles className="h-3.5 w-3.5" /> {theme.kicker}
                  </span>
                  <h1 className="editable-display mt-6 max-w-2xl text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                    {voice?.headline || `Browse ${label}`}
                  </h1>
                  <p className="mt-6 max-w-xl text-[1.02rem] leading-[1.8] text-[var(--tk-muted)]">{voice?.description || theme.note}</p>
                  {voice?.chips?.length ? (
                    <div className="mt-7 flex flex-wrap gap-2">
                      {voice.chips.map((chip, index) => (
                        <span
                          key={chip}
                          className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
                          style={{ background: playColor(index).soft, color: '#2A2A16' }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 rounded-[1.75rem] bg-[var(--tk-raised)] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">This page</p>
                  <p className="editable-display mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.05em]">
                    {posts.length}
                  </p>
                  <p className="mt-2 text-sm text-[var(--tk-muted)]">
                    {posts.length === 1 ? 'post' : 'posts'} · {categoryLabel} · page {page} of {totalPages}
                  </p>

                  <form action={basePath} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                      <select
                        name="category"
                        defaultValue={category}
                        className="h-11 w-full appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                        aria-label={voice?.filterLabel || 'Filter category'}
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                    </div>
                    <button className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent)] px-6 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------- results */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <EditableArchiveExplorer
            task={task}
            items={items}
            emptyTitle={`No ${label.toLowerCase()} here yet`}
            emptyBody={`Try another category, or check back once new ${label.toLowerCase()} are published.`}
          />

          {/* ------------------------------------------------------ pagination */}
          {items.length > 0 && totalPages > 1 ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Link>
              ) : null}

              <div className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: totalPages })
                  .map((_, index) => index + 1)
                  .filter((number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1)
                  .map((number, index, list) => (
                    <span key={number} className="flex items-center gap-1.5">
                      {index > 0 && number - list[index - 1] > 1 ? (
                        <span className="px-1 text-sm text-[var(--tk-muted)]">…</span>
                      ) : null}
                      <Link
                        href={pageHref(basePath, category, number)}
                        aria-current={number === page ? 'page' : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                          number === page
                            ? 'bg-[var(--tk-accent)] text-[var(--tk-on-accent)]'
                            : 'border border-[var(--tk-line)] bg-[var(--tk-surface)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]'
                        }`}
                      >
                        {number}
                      </Link>
                    </span>
                  ))}
              </div>

              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>

        {/* ---------------------------------------------------- cross-section */}
        {otherSections.length ? (
          <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-[2.25rem] bg-[var(--iso-ink)] px-7 py-10 text-[var(--iso-cream)] sm:px-10 sm:py-12">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-md">
                  <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Keep exploring</h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Other sections of the site, each with its own layout and filters.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {otherSections.map((item) => (
                    <Link
                      key={item.key}
                      href={item.route}
                      className="group inline-flex items-center gap-3 rounded-full bg-white/10 py-2 pl-5 pr-2 text-sm font-semibold transition hover:bg-white/15"
                    >
                      {item.label}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </EditableSiteShell>
  )
}
