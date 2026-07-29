import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <span className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[var(--iso-green-soft)] blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[var(--iso-lilac-soft)] blur-3xl" aria-hidden="true" />

        <section className="relative mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[var(--iso-green-deep)]" /> {copy.badge}
            </span>
            <h1 className="editable-display mt-6 max-w-xl text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{copy.description}</p>

            <div className="mt-9 grid gap-3 sm:max-w-md">
              {[
                'Pick up browsing where you left off.',
                'Keep track of what you have submitted.',
                'Start a new post in a couple of clicks.',
              ].map((line) => (
                <div key={line} className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white px-4 py-3 text-sm">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--iso-green-deep)]" />
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_26px_60px_rgba(23,23,15,0.1)] sm:p-9">
            <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">{copy.formTitle}</h2>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Use the email and password you signed up with.</p>
            <EditableLocalLoginForm />
            <p className="mt-7 flex flex-wrap items-center gap-1.5 text-sm text-[var(--slot4-muted-text)]">
              New here?
              <Link href="/signup" className="group inline-flex items-center gap-1 font-semibold text-[var(--slot4-accent)]">
                {copy.createCta} <ArrowUpRight className="iso-arrow h-4 w-4" />
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
