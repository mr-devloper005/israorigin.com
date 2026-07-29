'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from 'lucide-react'
import { archiveGridClass, renderArchiveCard, type ArchiveItem, type ArchiveLayout } from '@/editable/cards/ArchiveCards'

/*
  Client-side explorer for archive pages.

  Server-side pagination, category filtering and routing are untouched — this
  only adds instant narrowing, sorting and a layout switch across the posts the
  server already delivered. Items are a plain serialisable view model, so the
  first render is identical on the server and in the browser.
*/

type Props = {
  task: string
  items: ArchiveItem[]
  emptyTitle?: string
  emptyBody?: string
}

const sorts = [
  { key: 'default', label: 'Latest' },
  { key: 'az', label: 'A–Z' },
  { key: 'za', label: 'Z–A' },
] as const

type SortKey = (typeof sorts)[number]['key']

export function EditableArchiveExplorer({ task, items, emptyTitle, emptyBody }: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('default')
  const [layout, setLayout] = useState<ArchiveLayout>('grid')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = term
      ? items.filter((item) =>
          [item.title, item.summary, item.category, item.location, item.role]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term)),
        )
      : items
    if (sort === 'az') return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'za') return [...filtered].sort((a, b) => b.title.localeCompare(a.title))
    return filtered
  }, [items, query, sort])

  const masonry = task === 'image' && layout === 'grid'

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-col gap-3 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full bg-[var(--tk-raised)] px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--tk-muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter these results…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--tk-muted)]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear filter" className="shrink-0 text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)] sm:inline-flex">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
          </span>
          <div className="flex rounded-full bg-[var(--tk-raised)] p-1">
            {sorts.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  sort === option.key ? 'bg-[var(--tk-surface)] text-[var(--tk-text)] shadow-sm' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-full bg-[var(--tk-raised)] p-1">
            {([
              { key: 'grid', icon: LayoutGrid, label: 'Grid view' },
              { key: 'list', icon: Rows3, label: 'List view' },
            ] as const).map((option) => (
              <button
                key={option.key}
                type="button"
                aria-label={option.label}
                aria-pressed={layout === option.key}
                onClick={() => setLayout(option.key)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  layout === option.key ? 'bg-[var(--tk-surface)] text-[var(--tk-text)] shadow-sm' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
                }`}
              >
                <option.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--tk-muted)]">
        Showing <span className="font-semibold text-[var(--tk-text)]">{visible.length}</span> of {items.length}
        {query ? <> for “{query}”</> : null}
      </p>

      {visible.length ? (
        <div className={`mt-6 ${archiveGridClass(task, layout)}`}>
          {visible.map((item, index) =>
            masonry ? (
              <div key={item.id} className="mb-5 break-inside-avoid">
                {renderArchiveCard(task, item, index, layout)}
              </div>
            ) : (
              <div key={item.id} className="min-w-0">{renderArchiveCard(task, item, index, layout)}</div>
            ),
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent-soft)]">
            <Search className="h-6 w-6 text-[var(--tk-accent)]" />
          </span>
          <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.03em]">
            {query ? 'Nothing matched that' : emptyTitle || 'Nothing here yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--tk-muted)]">
            {query
              ? 'Try a shorter keyword, or clear the filter to see everything on this page again.'
              : emptyBody || 'New posts will appear here automatically once they are published.'}
          </p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
            >
              Clear filter
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
