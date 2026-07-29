import Link from 'next/link'
import { ArrowUpRight, Compass, Layers, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/components/EditableMotion'
import { playColor } from '@/editable/layouts/design-contract'

const valueIcons = [Compass, Layers, Sparkles]

export default function AboutPage() {
  const copy = pagesContent.about
  const sections = getBrowsableTasks()

  return (
    <EditableSiteShell>
      <main>
        {/* intro */}
        <section className="relative overflow-hidden pt-12 sm:pt-16">
          <span className="pointer-events-none absolute -left-28 top-4 h-80 w-80 rounded-full bg-[var(--iso-green-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[var(--iso-green)]" /> {copy.badge}
            </span>
            <h1 className="editable-display mt-7 max-w-3xl text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[1.08rem] leading-[1.85] text-[var(--slot4-muted-text)]">{copy.description}</p>
          </div>
        </section>

        {/* story + values */}
        <section className="mx-auto mt-14 w-full max-w-[var(--editable-container)] px-4 sm:mt-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <EditableReveal className="min-w-0">
              <article className="h-full rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-8 sm:p-10">
                <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">
                  The <span className="iso-squiggle">short</span> version
                </h2>
                <div className="mt-7 space-y-5 text-[1.02rem] leading-[1.85] text-[var(--slot4-muted-text)]">
                  {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href={sections[0]?.route || '/'}
                    className="group inline-flex items-center gap-3 rounded-full bg-[var(--iso-ink)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5"
                  >
                    Start browsing
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                      <ArrowUpRight className="iso-arrow h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-6 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                  >
                    Get in touch
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                      <ArrowUpRight className="iso-arrow h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </article>
            </EditableReveal>

            <div className="grid min-w-0 content-start gap-4">
              {copy.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length]
                const color = playColor(index)
                return (
                  <EditableReveal key={value.title} delay={index * 70}>
                    <div className="rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(23,23,15,0.1)]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: color.fill, color: color.on }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="editable-display mt-5 text-xl font-semibold tracking-[-0.03em]">{value.title}</h3>
                      <p className="mt-3 text-[0.95rem] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* sections strip */}
        {sections.length ? (
          <section className="mx-auto mt-16 w-full max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="iso-grain relative overflow-hidden rounded-[2.25rem] bg-[var(--iso-green-panel)] px-7 py-12 sm:px-12 sm:py-14">
              <span className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/20" aria-hidden="true" />
              <div className="relative flex flex-wrap items-end justify-between gap-8">
                <div className="max-w-md">
                  <h2 className="editable-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#12210E] sm:text-[2.5rem]">
                    What you will find here
                  </h2>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[#12210E]/75">
                    Each section keeps its own layout, filters and detail pages — pick whichever suits what you are looking for.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sections.map((task) => (
                    <Link
                      key={task.key}
                      href={task.route}
                      className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                    >
                      {task.label}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iso-ink)] text-[var(--iso-cream)]">
                        <ArrowUpRight className="iso-arrow h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </EditableSiteShell>
  )
}
