import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className, rounded = 'rounded-[1.15rem]' }: { className?: string; rounded?: string }) {
  return <div className={cn('animate-pulse bg-[var(--slot4-media-bg)]', rounded, className)} />
}

function Dots({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold text-[var(--slot4-muted-text)]">
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--iso-green)]"
            style={{ animationDelay: `${dot * 150}ms` }}
          />
        ))}
      </span>
      {label}
    </p>
  )
}

export function PageLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <Dots label={label} />
      <PulseBlock className="mt-7 h-14 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" rounded="rounded-full" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-3">
            <PulseBlock className="h-48 w-full" />
            <PulseBlock className="mt-5 h-5 w-4/5" rounded="rounded-full" />
            <PulseBlock className="mt-3 h-4 w-3/5" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-3">
          <PulseBlock className="h-44 w-full" />
          <PulseBlock className="mt-5 h-5 w-5/6" rounded="rounded-full" />
          <PulseBlock className="mt-3 h-4 w-2/3" rounded="rounded-full" />
          <PulseBlock className="mt-6 h-10 w-32" rounded="rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading post', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <PulseBlock className="h-80 w-full" rounded="rounded-[2.25rem]" />
      <div>
        <Dots label={label} />
        <PulseBlock className="mt-6 h-14 w-4/5" />
        <PulseBlock className="mt-6 h-4 w-full" rounded="rounded-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" rounded="rounded-full" />
        <PulseBlock className="mt-3 h-4 w-2/3" rounded="rounded-full" />
      </div>
    </div>
  )
}
