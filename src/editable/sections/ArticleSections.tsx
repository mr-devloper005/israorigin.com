import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, playColor } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

/**
 * Standalone article archive/detail shells kept available for routes that want
 * an article-only layout without the shared task machinery.
 */
export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16`}>
        <div className="rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-7 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
            {voice.eyebrow}
          </span>
          <h1 className={`${dc.type.heroTitle} mt-6 max-w-3xl text-balance`}>{voice.headline}</h1>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{voice.description}</p>

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

          <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              aria-label={voice.filterLabel}
              className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-medium outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-full bg-[var(--iso-ink)] px-6 py-3 text-sm font-semibold text-[var(--iso-cream)] transition hover:bg-[var(--iso-green)] hover:text-[#12210E]">
              Filter
            </button>
          </form>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * pagination.limit}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2.25rem] border border-dashed border-[var(--editable-border)] bg-white px-8 py-14 text-center">
            <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">Nothing here yet</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category, or come back once new posts land.</p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-2.5 text-sm font-semibold">
              Previous
            </Link>
          ) : null}
          <span className="rounded-full bg-[var(--iso-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--iso-cream)]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-2.5 text-sm font-semibold">
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <div className="grid gap-6 rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-semibold"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
              {voice.eyebrow}
            </span>
            <h1 className="editable-display mt-4 max-w-3xl text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl">
              {post?.title || pagesContent.detailPages.article.fallbackTitle}
            </h1>
          </div>
          <aside className="min-w-0 rounded-[1.75rem] bg-[var(--iso-ink)] p-6 text-[var(--iso-cream)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green)]">Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/65">{voice.secondaryNote}</p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-semibold text-[var(--slot4-page-text)]"
            >
              Contact
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                <ArrowUpRight className="iso-arrow h-4 w-4" />
              </span>
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 sm:p-9">
          <p className="text-[1.02rem] leading-[1.85] text-[var(--slot4-muted-text)]">
            {post?.summary || `Details for ${slug} will render through the shared detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}
