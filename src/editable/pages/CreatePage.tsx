'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getBrowsableTasks } from '@/editable/content/sections'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[1.25rem] border border-[var(--editable-border)] bg-white px-5 py-3.5 text-[0.95rem] font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--iso-green)] focus:ring-4 focus:ring-[var(--iso-green-soft)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => getBrowsableTasks(), [])
  // Only one browsable section is published, so the draft is filed against it
  // directly instead of asking for a choice that has no alternatives.
  const activeTask = enabledTasks[0]
  const task = (activeTask?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    const locked = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <section className="grid gap-8 overflow-hidden rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-4 md:grid-cols-[0.85fr_1.15fr] md:p-6">
            <div className="iso-grain relative flex min-h-72 items-center justify-center rounded-[1.75rem] bg-[var(--iso-green-panel)]">
              <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/25" aria-hidden="true" />
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/90 text-[#12210E]">
                <Lock className="h-10 w-10" />
              </span>
            </div>
            <div className="self-center p-4 sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
                {locked.badge}
              </span>
              <h1 className="editable-display mt-6 text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl">{locked.title}</h1>
              <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-[var(--slot4-muted-text)]">{locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 rounded-full bg-[var(--iso-ink)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5"
                >
                  Log in
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                    <ArrowUpRight className="iso-arrow h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-6 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                >
                  Sign up
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                    <ArrowUpRight className="iso-arrow h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero

  return (
    <EditableSiteShell>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8">
          <header className="min-w-0 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--iso-green-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--iso-green-deep)]">
              {hero.badge}
            </span>
            <h1 className="editable-display mt-6 text-balance text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-[3rem]">
              {hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-7 text-[var(--slot4-muted-text)]">{hero.description}</p>
          </header>

          <form onSubmit={submit} className="min-w-0 rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_60px_rgba(23,23,15,0.08)] sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
                  New {activeTask?.label || 'post'}
                </p>
                <h2 className="editable-display mt-1.5 text-2xl font-semibold tracking-[-0.035em]">{pagesContent.create.formTitle}</h2>
              </div>
              <span className="rounded-full bg-[var(--slot4-warm)] px-4 py-2 text-xs font-semibold">{session.name}</span>
            </div>

            <div className="mt-7 grid gap-4">
              <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
              </div>
              <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
              <textarea className={`${fieldClass} min-h-24 leading-7`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
              <textarea className={`${fieldClass} min-h-48 leading-7`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details or description" required />
            </div>

            {created ? (
              <div className="mt-5 flex items-start gap-3 rounded-[1.25rem] bg-[var(--iso-green-soft)] p-4 text-[var(--iso-green-deep)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                  <p className="mt-1 truncate text-sm opacity-80">{created.title}</p>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--iso-ink)] px-6 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--iso-green)] hover:text-[#12210E]"
            >
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </div>
      </main>
    </EditableSiteShell>
  )
}
