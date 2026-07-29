'use client'

import { useEffect, useState } from 'react'

/*
  Hero collage.

  A large rounded frame with two smaller frames floating over it. Each frame
  crossfades through the pool of the newest post images on a staggered timer,
  so the hero always shows live content without feeling busy. Server render is
  deterministic (tick = 0) → no hydration mismatch, and rotation is disabled
  for prefers-reduced-motion users.
*/
export function EditableHeroCollage({ images }: { images: string[] }) {
  const pool = images.length ? images : ['/placeholder.svg?height=900&width=1400']
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (pool.length <= 1) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((value) => value + 1), 4600)
    return () => clearInterval(id)
  }, [pool.length])

  const frame = (offset: number) => pool[(offset + tick) % pool.length]

  return (
    <div className="relative">
      {/* decorative shapes */}
      <span
        className="iso-float-slow pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[var(--iso-yellow)] opacity-90 sm:h-32 sm:w-32"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-4 bottom-16 h-16 w-16 rounded-[1.5rem] bg-[var(--iso-lilac)] sm:h-24 sm:w-24"
        aria-hidden="true"
      />

      {/* main frame */}
      <div className="relative overflow-hidden rounded-[2.25rem] border-4 border-white bg-[var(--slot4-media-bg)] shadow-[0_28px_70px_rgba(23,23,15,0.16)]">
        <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
          {pool.map((src, index) => (
            <img
              key={`main-${index}`}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                src === frame(0) ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              {...(index === 0 ? { fetchPriority: 'high' as const } : {})}
            />
          ))}
        </div>
      </div>

      {/* floating secondary frame */}
      <div className="iso-float absolute -bottom-8 -left-4 hidden w-[42%] overflow-hidden rounded-[1.5rem] border-4 border-white bg-[var(--slot4-media-bg)] shadow-[0_20px_46px_rgba(23,23,15,0.2)] sm:block">
        <div className="relative aspect-[4/3] w-full">
          {pool.map((src, index) => (
            <img
              key={`sub-${index}`}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                src === frame(1) ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* live badge */}
      <div className="absolute -right-2 -top-3 flex items-center gap-2 rounded-full bg-[var(--iso-green)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#12210E] shadow-[0_10px_26px_rgba(92,191,78,0.4)]">
        <span className="h-2 w-2 rounded-full bg-[#12210E]" />
        Fresh posts
      </div>
    </div>
  )
}
