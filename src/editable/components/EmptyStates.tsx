import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'New posts appear on this page automatically as soon as they are published.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[2.25rem] border border-dashed border-[var(--editable-border)] bg-white px-8 py-14 text-center',
        className,
      )}
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--iso-green-soft)]" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[var(--iso-lilac-soft)]" aria-hidden="true" />

      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--iso-yellow)] text-[#221F05]">
          <SearchX className="h-7 w-7" />
        </span>
        <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{description}</p>
        <Link
          href={actionHref}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--iso-ink)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5"
        >
          {actionLabel}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
            <ArrowUpRight className="iso-arrow h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will show up here automatically. The page stays ready even while the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out — your message is on its way and someone will get back to you."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
