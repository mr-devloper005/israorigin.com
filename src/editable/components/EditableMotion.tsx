'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUp } from 'lucide-react'

/*
  Small, dependency-free interaction primitives shared across the site.
  All of them degrade gracefully: the markup is always rendered, motion is the
  only thing that is progressively added (and a <noscript> rule in the shell
  restores full visibility when scripting is off).
*/

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Fades + rises its children the first time they scroll into view. */
export function EditableReveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref as never} className={`iso-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/** Counts up to `value` once the number scrolls into view. */
export function EditableCountUp({
  value,
  suffix = '',
  duration = 1400,
  className = '',
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || started) return
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setStarted(true)
        const startedAt = performance.now()
        const step = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setShown(Math.round(value * eased))
          if (progress < 1) requestAnimationFrame(step)
        }
        setShown(0)
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration, started])

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
      {suffix}
    </span>
  )
}

/** Cycles through a list of words in place. */
export function EditableWordCycle({ words, className = '' }: { words: string[]; className?: string }) {
  const list = words.filter(Boolean)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (list.length < 2 || prefersReducedMotion()) return
    const id = setInterval(() => setIndex((value) => (value + 1) % list.length), 2600)
    return () => clearInterval(id)
  }, [list.length])

  if (!list.length) return null
  return (
    <span className={`inline-block transition-opacity duration-500 ${className}`} key={index}>
      {list[index % list.length]}
    </span>
  )
}

/** Floating "return to top" pill, revealed after the first screen. */
export function EditableBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--iso-ink)] text-[var(--iso-cream)] shadow-[0_14px_34px_rgba(23,23,15,0.3)] transition duration-300 hover:bg-[var(--iso-green)] hover:text-[#12210E] ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

/** Reading-progress bar for long detail pages. */
export function EditableReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <div className="h-full bg-[var(--iso-green)] transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  )
}
