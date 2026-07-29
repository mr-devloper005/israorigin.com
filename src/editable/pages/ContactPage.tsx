'use client'

import Link from 'next/link'
import { ArrowUpRight, Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { playColor } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Get listed', body: 'Add your business or studio, confirm the details, and go live on the directory.' },
      { icon: Phone, title: 'Partnerships', body: 'Talk through bulk publishing, local coverage and anything operational.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new area or category? Tell us and we will look at adding it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitch a piece', body: 'Share essays, columns and long-form ideas that would fit here.' },
      { icon: Mail, title: 'Collaborations', body: 'Coordinate features, cross-posts and joint projects.' },
      { icon: Sparkles, title: 'Contributor help', body: 'Questions about tone, formatting or the publishing flow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Feature your work', body: 'Discuss gallery launches, creator features and visual campaigns.' },
      { icon: Sparkles, title: 'Usage and rights', body: 'Ask about permissions, commercial use and image credits.' },
      { icon: Mail, title: 'Press and media', body: 'Request a media kit, editorial support or feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a resource', body: 'Send links, tools and references worth adding to the collections.' },
    { icon: Mail, title: 'Curation projects', body: 'Coordinate reference pages, shelves and shared collections.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need a hand organising a board or a set of saved links?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)
  const copy = pagesContent.contact

  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <span className="pointer-events-none absolute -left-32 top-8 h-80 w-80 rounded-full bg-[var(--iso-lilac-soft)] blur-3xl" aria-hidden="true" />

        <section className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold">
                <Mail className="h-3.5 w-3.5 text-[var(--iso-green-deep)]" /> {copy.eyebrow}
              </span>
              <h1 className="editable-display mt-7 max-w-xl text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{copy.description}</p>

              <div className="mt-9 grid gap-3">
                {lanes.map((lane, index) => {
                  const color = playColor(index)
                  return (
                    <div
                      key={lane.title}
                      className="flex items-start gap-4 rounded-[1.5rem] border border-[var(--editable-border)] bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(23,23,15,0.1)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: color.fill, color: color.on }}>
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="editable-display block text-lg font-semibold tracking-[-0.03em]">{lane.title}</span>
                        <span className="mt-1.5 block text-sm leading-6 text-[var(--slot4-muted-text)]">{lane.body}</span>
                      </span>
                    </div>
                  )
                })}
              </div>

              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white py-2 pl-6 pr-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
              >
                More about the site
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                  <ArrowUpRight className="iso-arrow h-4 w-4" />
                </span>
              </Link>
            </div>

            <div className="min-w-0 rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_60px_rgba(23,23,15,0.1)] sm:p-9">
              <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">{copy.formTitle}</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Fill in what you can — the more context, the faster the reply.</p>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
