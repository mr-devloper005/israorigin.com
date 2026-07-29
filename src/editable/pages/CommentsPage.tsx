'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageSquare, RefreshCw, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { playColor } from '@/editable/layouts/design-contract'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) => {
      return [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section className="rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
                <MessageSquare className="h-3.5 w-3.5" /> Saved on this device
              </span>
              <h1 className="editable-display mt-6 text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl">Comments</h1>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-[var(--slot4-muted-text)]">
                Everything you have written from a post page, gathered in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshComments}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-5 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
            >
              Refresh
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                <RefreshCw className="h-4 w-4" />
              </span>
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex w-full min-w-0 items-center gap-2.5 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-2.5 sm:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search comments…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </label>
            <p className="text-sm text-[var(--slot4-muted-text)]">
              {filtered.length} comment{filtered.length === 1 ? '' : 's'}
            </p>
          </div>
        </section>

        {visibleComments.length ? (
          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            {visibleComments.map((item, index) => {
              const color = playColor(index)
              return (
                <article
                  key={`${item.articleSlug}-${item.id}`}
                  className="rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(23,23,15,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="editable-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ background: color.fill, color: color.on }}
                      >
                        {(item.name.trim()[0] || 'G').toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--slot4-soft-muted-text)]">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {item.articleSlug ? (
                      <Link
                        href={`/article/${item.articleSlug}`}
                        className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--slot4-accent)]"
                      >
                        Open <ArrowUpRight className="iso-arrow h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? <p className="mt-4 text-sm font-semibold">{item.articleTitle}</p> : null}
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--slot4-muted-text)]">{item.comment}</p>
                </article>
              )
            })}
          </section>
        ) : (
          <section className="mt-8 rounded-[2.25rem] border border-dashed border-[var(--editable-border)] bg-white px-8 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--iso-yellow)] text-[#221F05]">
              <MessageSquare className="h-6 w-6" />
            </span>
            <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.03em]">
              {query ? 'Nothing matched that search' : 'No comments yet'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
              {query ? 'Try a different keyword.' : 'Leave a comment on any post page and it will show up here.'}
            </p>
          </section>
        )}

        {filtered.length > COMMENTS_PER_PAGE ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm text-[var(--slot4-muted-text)]">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-[var(--editable-border)] px-4 py-2 font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--iso-green)] disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--iso-ink)] px-4 py-2 font-semibold text-[var(--iso-cream)] transition hover:bg-[var(--iso-green)] hover:text-[#12210E] disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </EditableSiteShell>
  )
}
