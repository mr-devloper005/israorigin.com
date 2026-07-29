import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, PenLine, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { playColor } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  const steps = ['Create your account', 'Choose a section', 'Publish your post']

  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <span className="pointer-events-none absolute -right-32 top-16 h-80 w-80 rounded-full bg-[var(--iso-yellow-soft)] blur-3xl" aria-hidden="true" />

        <section className="relative mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div className="order-2 min-w-0 rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_26px_60px_rgba(23,23,15,0.1)] sm:p-9 lg:order-1">
            <h1 className="editable-display text-2xl font-semibold tracking-[-0.03em]">{copy.formTitle}</h1>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">It takes less than a minute.</p>
            <EditableLocalSignupForm />
            <p className="mt-7 flex flex-wrap items-center gap-1.5 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?
              <Link href="/login" className="group inline-flex items-center gap-1 font-semibold text-[var(--slot4-accent)]">
                {copy.loginCta} <ArrowUpRight className="iso-arrow h-4 w-4" />
              </Link>
            </p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[var(--iso-green-deep)]" /> {copy.badge}
            </span>
            <h2 className="editable-display mt-6 max-w-xl text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{copy.description}</p>

            <ol className="mt-9 grid gap-3 sm:max-w-md">
              {steps.map((step, index) => {
                const color = playColor(index)
                return (
                  <li key={step} className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--editable-border)] bg-white px-4 py-3.5 text-sm font-medium">
                    <span
                      className="editable-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ background: color.fill, color: color.on }}
                    >
                      {index + 1}
                    </span>
                    {step}
                    {index === steps.length - 1 ? <PenLine className="ml-auto h-4 w-4 text-[var(--slot4-soft-muted-text)]" /> : null}
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
