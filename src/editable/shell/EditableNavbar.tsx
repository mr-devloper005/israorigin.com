'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, ChevronDown, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Floating pill navigation.

  A rounded white bar rides above the cream canvas with the wordmark on the
  left, a compact link set in the middle, and a separate action pill on the
  right. It tightens and deepens its shadow once the page scrolls.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const taskLinks = useMemo(
    () => getBrowsableTasks().map((task) => ({ label: task.label, href: task.route, description: task.description })),
    [],
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close every panel whenever the route changes.
  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const flatLinks = [
    { label: 'Home', href: '/' },
    ...taskLinks.map(({ label, href }) => ({ label, href })),
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'pt-2 sm:pt-3' : 'pt-3 sm:pt-6'}`}>
      <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <nav
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/95 px-2 py-2 backdrop-blur-xl transition-all duration-500 sm:gap-3 sm:px-3 ${
            scrolled ? 'shadow-[0_12px_34px_rgba(23,23,15,0.14)]' : 'shadow-[0_6px_20px_rgba(23,23,15,0.07)]'
          }`}
        >
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5 pl-2 pr-2 sm:gap-3">
            <img
              src="/favicon.png?v=20260413"
              alt={SITE_CONFIG.name}
              className="h-10 w-auto max-w-[132px] shrink-0 object-contain transition duration-500 group-hover:scale-105"
            />
            <span className="editable-display hidden max-w-[180px] truncate text-[1.35rem] font-semibold leading-none tracking-[-0.04em] sm:block">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
            {taskLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[0.9rem] font-medium transition duration-300 ${
                  isActive(item.href)
                    ? 'bg-[var(--iso-green-soft)] text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[0.9rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)]"
              >
                More <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-white p-2 shadow-[0_22px_50px_rgba(23,23,15,0.16)]">
                  {[
                    { label: 'About us', href: '/about', hint: 'What we do and why' },
                    { label: 'Contact', href: '/contact', hint: 'Start a conversation' },
                    { label: 'Search', href: '/search', hint: 'Find anything, fast' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[1.1rem] px-3.5 py-2.5 transition hover:bg-[var(--slot4-warm)]"
                    >
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-[var(--slot4-muted-text)]">{item.hint}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((value) => !value)
                setOpen(false)
              }}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition duration-300 ${
                searchOpen ? 'bg-[var(--iso-ink)] text-[var(--iso-cream)]' : 'bg-[var(--slot4-warm)] text-[var(--slot4-page-text)] hover:bg-[var(--iso-green-soft)]'
              }`}
            >
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen((value) => !value)
                setSearchOpen(false)
              }}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E] transition duration-300 hover:brightness-105 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Action pill, separated from the nav bar like a stamp. */}
        <div className="hidden shrink-0 items-center sm:flex">
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/create"
                className="group flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-5 pr-2 text-sm font-semibold shadow-[0_6px_20px_rgba(23,23,15,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,23,15,0.14)]"
              >
                Create
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                  <PlusCircle className="h-4 w-4" />
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] lg:block"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-5 pr-2 text-sm font-semibold shadow-[0_6px_20px_rgba(23,23,15,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,23,15,0.14)]"
            >
              {globalContent.nav?.actions?.primary?.label || 'Get in touch'}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-ink)] text-[var(--iso-cream)] transition duration-500 group-hover:bg-[var(--iso-green)] group-hover:text-[#12210E]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Search drawer */}
      {searchOpen ? (
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-3 sm:px-6 lg:px-8">
          <form
            action="/search"
            className="mt-2 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white p-2 shadow-[0_18px_44px_rgba(23,23,15,0.16)]"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              autoFocus
              type="search"
              placeholder="Search profiles, galleries, topics…"
              className="min-w-0 flex-1 bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="shrink-0 rounded-full bg-[var(--iso-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--iso-cream)] transition hover:bg-[var(--iso-green)] hover:text-[#12210E]">
              Search
            </button>
          </form>
        </div>
      ) : null}

      {/* Mobile menu */}
      {open ? (
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-3 sm:px-6 lg:hidden lg:px-8">
          <div className="mt-2 rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-3 shadow-[0_18px_44px_rgba(23,23,15,0.16)]">
            <div className="grid gap-1">
              {flatLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-[0.95rem] font-semibold transition ${
                    isActive(item.href) && item.href !== '/'
                      ? 'bg-[var(--iso-green-soft)] text-[var(--slot4-accent)]'
                      : 'hover:bg-[var(--slot4-warm)]'
                  }`}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
            </div>
            <div className="mt-2 grid gap-2 border-t border-[var(--editable-border)] pt-3 sm:grid-cols-2">
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-full bg-[var(--iso-green)] px-5 py-3 text-center text-sm font-semibold text-[#12210E]">
                    Create a post
                  </Link>
                  <button type="button" onClick={logout} className="rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold">
                    <LogIn className="h-4 w-4" /> Log in
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--iso-ink)] px-5 py-3 text-sm font-semibold text-[var(--iso-cream)]">
                    <UserPlus className="h-4 w-4" /> Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
