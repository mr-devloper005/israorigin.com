'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Ink footer: a deep charcoal slab that closes the cream page, opening with a
  scrolling marquee, then a large wordmark, colour-coded link columns and a
  quiet legal bar.
*/
export function EditableFooter() {
  const taskLinks = getBrowsableTasks()
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const marquee = ['Curated profiles', 'Visual stories', 'Independent makers', 'Fresh every week', 'Built for discovery']

  return (
    <footer className="mt-auto bg-[var(--slot4-page-bg)] pt-8">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-3 pb-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.25rem] bg-[var(--iso-ink)] text-[var(--iso-cream)]">
          {/* marquee band */}
          <div className="iso-marquee overflow-hidden border-b border-white/10 bg-[var(--iso-green)] py-3">
            <div className="iso-marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-8 pr-8 text-[#12210E]">
                  {marquee.map((item) => (
                    <span key={`${copy}-${item}`} className="editable-display flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em]">
                      {item}
                      <span className="h-1.5 w-1.5 rounded-full bg-[#12210E]/60" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8 lg:py-16">
            <div className="min-w-0">
              <Link href="/" className="group inline-flex items-center gap-3">
                <img
                  src="/favicon.png?v=20260413"
                  alt={SITE_CONFIG.name}
                  className="h-11 w-auto max-w-[140px] shrink-0 object-contain transition duration-500 group-hover:scale-105"
                />
                <span className="editable-display text-2xl font-semibold tracking-[-0.04em]">{SITE_CONFIG.name}</span>
              </Link>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-7 text-white/60">
                {globalContent.footer?.description || SITE_CONFIG.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/70">
                  <MapPin className="h-3.5 w-3.5 text-[var(--iso-green)]" /> Worldwide
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:border-[var(--iso-green)] hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--iso-green)]" /> Say hello
                </Link>
              </div>
            </div>

            <FooterColumn title="Browse" dot="var(--iso-green)">
              {taskLinks.map((task) => (
                <FooterLink key={task.key} href={task.route}>
                  {task.label}
                </FooterLink>
              ))}
              <FooterLink href="/search">Search</FooterLink>
            </FooterColumn>

            <FooterColumn title="Site" dot="var(--iso-yellow)">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/comments">Comments</FooterLink>
            </FooterColumn>

            <FooterColumn title="Account" dot="var(--iso-coral)">
              {session ? (
                <>
                  <FooterLink href="/create">Create a post</FooterLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="group flex w-fit items-center gap-1.5 text-left text-[0.95rem] text-white/60 transition hover:text-white"
                  >
                    Log out
                    <ArrowUpRight className="iso-arrow h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </button>
                </>
              ) : (
                <>
                  <FooterLink href="/login">Log in</FooterLink>
                  <FooterLink href="/signup">Sign up</FooterLink>
                </>
              )}
            </FooterColumn>
          </div>

          {/* oversized wordmark */}
          <div className="px-6 sm:px-10">
            <p className="editable-display select-none truncate pb-2 text-[16vw] font-semibold leading-[0.82] tracking-[-0.06em] text-white/[0.07] lg:text-[11rem]">
              {SITE_CONFIG.name}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
            <p>{globalContent.footer?.bottomNote || 'Made for clear, connected discovery.'}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, dot, children }: { title: string; dot: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
        {title}
      </h3>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex w-fit items-center gap-1.5 text-[0.95rem] text-white/60 transition hover:text-white">
      {children}
      <ArrowUpRight className="iso-arrow h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
    </Link>
  )
}
