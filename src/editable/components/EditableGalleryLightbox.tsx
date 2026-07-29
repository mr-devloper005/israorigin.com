'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

/*
  Gallery with an in-page lightbox.

  Thumbnails are plain <img> tags so they still render (and stay indexable)
  before hydration; the overlay only appears once a viewer opts in.
*/
export function EditableGalleryLightbox({
  images,
  label,
  variant = 'grid',
}: {
  images: string[]
  label?: string
  variant?: 'grid' | 'masonry' | 'strip'
}) {
  const [active, setActive] = useState<number | null>(null)
  const total = images.length

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (direction: number) => setActive((current) => (current === null ? null : (current + direction + total) % total)),
    [total],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [active, close, step])

  if (!total) return null

  const wrapper =
    variant === 'masonry'
      ? 'columns-1 gap-4 [column-fill:_balance] sm:columns-2'
      : variant === 'strip'
      ? 'grid grid-cols-2 gap-3 sm:grid-cols-4'
      : 'grid gap-4 sm:grid-cols-2'

  return (
    <section className={label ? 'mt-10' : ''}>
      {label ? (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
          <p className="text-xs text-[var(--tk-muted)]">{total} {total === 1 ? 'image' : 'images'}</p>
        </div>
      ) : null}

      <div className={wrapper}>
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Open image ${index + 1}`}
            className={`group relative block w-full overflow-hidden rounded-[1.15rem] border border-[var(--tk-line)] bg-[var(--tk-raised)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(23,23,15,0.16)] ${
              variant === 'masonry' ? 'mb-4 break-inside-avoid' : ''
            }`}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className={`w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
                variant === 'masonry' ? '' : variant === 'strip' ? 'aspect-square' : 'aspect-[4/3]'
              }`}
            />
            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 transition group-hover:opacity-100">
              <Expand className="h-4 w-4 text-[var(--tk-text)]" />
            </span>
          </button>
        ))}
      </div>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(23,23,15,0.94)] p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation()
                  step(-1)
                }}
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation()
                  step(1)
                }}
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <img src={images[active]} alt="" className="mx-auto max-h-[80vh] w-auto max-w-full rounded-[1.5rem] object-contain" />
            <figcaption className="mt-4 text-center text-sm text-white/60">
              {active + 1} / {total}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  )
}
