import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search, SearchX } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import { playColor } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  // compactRaw only trims — it does NOT strip HTML — so the raw payload could leak markup
  // into the card summary. Route every candidate through toPlainText so cards stay plain,
  // and fall back to the article body when there's no dedicated summary/description.
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const wide = index % 5 === 0
  const color = playColor(index)

  return (
    <Link
      href={href}
      className={`iso-card group block min-w-0 overflow-hidden rounded-[1.75rem] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_58px_rgba(23,23,15,0.12)] ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      {image ? (
        <div className="p-2.5">
          <div className={`iso-card-media relative overflow-hidden rounded-[1.15rem] bg-[var(--slot4-media-bg)] ${wide ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
              {taskLabel}
            </span>
          </div>
        </div>
      ) : null}
      <div className="px-6 pb-7 pt-4">
        {!image ? (
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ background: color.soft, color: '#2A2A16' }}
          >
            {taskLabel}
          </span>
        ) : null}
        <h2 className={`editable-display line-clamp-2 font-semibold leading-[1.14] tracking-[-0.035em] ${image ? 'mt-1' : 'mt-4'} ${wide ? 'text-3xl' : 'text-xl'}`}>
          {post.title}
        </h2>
        {summary ? <p className="mt-3 line-clamp-2 text-[0.92rem] leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="iso-arrow h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = getBrowsableTasks()
  const copy = pagesContent.search

  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <span className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[var(--iso-green-soft)] blur-3xl" aria-hidden="true" />

        <section className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
                  <Search className="h-3.5 w-3.5" /> {copy.hero.badge}
                </span>
                <h1 className="editable-display mt-6 text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-5 max-w-lg text-[0.98rem] leading-7 text-[var(--slot4-muted-text)]">{copy.hero.description}</p>
              </div>

              <form action="/search" className="min-w-0 rounded-[1.75rem] bg-[var(--slot4-page-bg)] p-4 sm:p-5">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-2.5 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3">
                  <Search className="h-[18px] w-[18px] shrink-0 text-[var(--slot4-soft-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={copy.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[0.95rem] font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3">
                    <Filter className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)]" />
                    <input
                      name="category"
                      defaultValue={category}
                      placeholder="Category"
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                    />
                  </label>
                  <select
                    name="task"
                    defaultValue={task}
                    aria-label="Content type"
                    className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-medium outline-none"
                  >
                    <option value="">All sections</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--iso-ink)] px-6 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:bg-[var(--iso-green)] hover:text-[#12210E]"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <h2 className="editable-display mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                {query ? `Results for “${query}”` : copy.resultsTitle}
              </h2>
            </div>
            {enabledTasks[0] ? (
              <Link
                href={enabledTasks[0].route}
                className="group inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-5 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
              >
                Browse latest
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                  <ArrowUpRight className="iso-arrow h-4 w-4" />
                </span>
              </Link>
            ) : null}
          </div>

          {results.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2.25rem] border border-dashed border-[var(--editable-border)] bg-white px-8 py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--iso-yellow)] text-[#221F05]">
                <SearchX className="h-7 w-7" />
              </span>
              <h3 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">No matches found</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
                Try a shorter keyword, a different section, or clear the category filter.
              </p>
              <Link
                href="/search"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[var(--iso-ink)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5"
              >
                Reset search
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                  <ArrowUpRight className="iso-arrow h-4 w-4" />
                </span>
              </Link>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
