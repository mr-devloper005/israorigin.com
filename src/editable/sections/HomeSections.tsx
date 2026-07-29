import Link from 'next/link'
import {
  ArrowUpRight, CheckCircle2, Globe2,
  Layers, Search, Sparkles,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getBrowsableTasks } from '@/editable/content/sections'
import {
  ArticleListCard, CompactIndexCard, EditorialFeatureCard, ImageFirstCard, PosterCard,
  RailPostCard, getEditableCategory, getEditablePostImage, hasEditableImage, postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { EditableCountUp, EditableReveal, EditableWordCycle } from '@/editable/components/EditableMotion'
import { editableDesignContract as dc, playColor } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

// Merge the primary feed with the time-window feeds so home always has content,
// even when one source comes back empty for this site.
function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

// Latest posts' real images (newest first, deduped, placeholders dropped).
function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function uniqueCategories(posts: SitePost[], max = 10) {
  const seen = new Set<string>()
  for (const post of posts) {
    const label = getEditableCategory(post)
    if (label && label !== 'Featured') seen.add(label)
    if (seen.size >= max) break
  }
  return Array.from(seen)
}

/** Rotates card styles so no two neighbouring cards look the same. */
function VariedCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const withImage = hasEditableImage(post)
  const shape = index % 6
  if (!withImage) return <PosterCard post={post} href={href} index={index} />
  if (shape === 0) return <ImageFirstCard post={post} href={href} tall />
  // A text-only break in the masonry wall keeps the column rhythm from
  // turning into a uniform wall of thumbnails.
  if (shape === 3) return <CompactIndexCard post={post} href={href} index={index} />
  if (shape === 4) return <ImageFirstCard post={post} href={href} />
  return <RailPostCard post={post} href={href} index={index} />
}

/* ================================================================== 1. HERO */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const hero = pagesContent.home.hero
  const heroTitle = hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`
  const sections = getBrowsableTasks()
  const chips = uniqueCategories(pool, 6)

  return (
    <section className="relative overflow-hidden pb-4 pt-10 sm:pt-14 lg:pt-20">
      {/* soft colour wash behind the hero */}
      <span className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[var(--iso-green-soft)] blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-[var(--iso-lilac-soft)] blur-3xl" aria-hidden="true" />

      <div className={`relative grid items-center gap-12 ${container} lg:grid-cols-[1.02fr_0.98fr] lg:gap-16`}>
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[0.8rem] font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-[var(--iso-green)]" />
            {hero.badge || 'Fresh this week'}
          </span>

          <h1 className={`${dc.type.heroTitle} mt-6 max-w-2xl text-balance`}>{heroTitle}</h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.8] text-[var(--slot4-muted-text)]">{hero.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={hero.primaryCta?.href || primaryRoute} className={dc.button.primary}>
              {hero.primaryCta?.label || `Browse ${taskLabel(primaryTask).toLowerCase()}`}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                <ArrowUpRight className="iso-arrow h-4 w-4" />
              </span>
            </Link>
            <Link href={hero.secondaryCta?.href || '/about'} className={dc.button.secondary}>
              {hero.secondaryCta?.label || 'How it works'}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                <ArrowUpRight className="iso-arrow h-4 w-4" />
              </span>
            </Link>
          </div>

          <form action="/search" className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white p-2 shadow-[0_10px_30px_rgba(23,23,15,0.07)]">
            <Search className="ml-3 h-5 w-5 shrink-0 text-[var(--slot4-soft-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder={hero.searchPlaceholder || 'Search posts, people, topics…'}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.95rem] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="shrink-0 rounded-full bg-[var(--iso-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--iso-cream)] transition hover:bg-[var(--iso-green)] hover:text-[#12210E]">
              Search
            </button>
          </form>

          {chips.length || sections.length ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Popular</span>
              {(chips.length ? chips : sections.map((task) => task.label)).slice(0, 5).map((chip, index) => (
                <Link
                  key={chip}
                  href={`/search?q=${encodeURIComponent(chip)}`}
                  className="rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition hover:-translate-y-0.5"
                  style={{ background: playColor(index).soft, color: '#2A2A16' }}
                >
                  {chip}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 lg:pl-6">
          <EditableHeroCollage images={heroImages} />
        </div>
      </div>

      {/* trust band */}
      <div className={`${container} mt-16 sm:mt-20`}>
        <div className="grid gap-px overflow-hidden rounded-[var(--iso-radius-lg)] border border-[var(--editable-border)] bg-[var(--editable-border)] sm:grid-cols-3">
          {[
            { icon: Sparkles, title: 'Updated constantly', body: 'New posts land the moment they are published.' },
            { icon: Globe2, title: 'Open to everyone', body: 'Browse freely, no account required to explore.' },
            { icon: CheckCircle2, title: 'Clear and organised', body: 'Every post keeps its own page, media and details.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 bg-white px-6 py-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--iso-green-soft)] text-[var(--slot4-accent)]">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.95rem] font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-[var(--slot4-muted-text)]">{item.body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================== 2. GREEN PANEL + CATEGORIES */

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const tiles = pool.filter(hasEditableImage).slice(0, 4)
  const intro = pagesContent.home.intro

  return (
    <section className="py-14 sm:py-20">
      <div className={container}>
        <EditableReveal>
          <div className="iso-grain relative overflow-hidden rounded-[2.25rem] bg-[var(--iso-green-panel)] p-4 sm:p-7 lg:p-10">
            <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-[#12210E]/5" aria-hidden="true" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
              <div className="rounded-[1.75rem] bg-white p-7 shadow-[0_20px_50px_rgba(23,23,15,0.12)] sm:p-9">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  {intro.badge || 'How it works'}
                </span>
                <h2 className={`${dc.type.sectionTitle} mt-4`}>{intro.title}</h2>
                <p className="mt-5 text-[0.98rem] leading-[1.8] text-[var(--slot4-muted-text)]">{intro.paragraphs?.[0]}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={intro.primaryLink?.href || primaryRoute} className={dc.button.accent}>
                    {intro.primaryLink?.label || 'Start browsing'}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#221F05] text-[var(--iso-yellow)]">
                      <ArrowUpRight className="iso-arrow h-4 w-4" />
                    </span>
                  </Link>
                  <Link href={intro.secondaryLink?.href || '/about'} className={dc.button.secondary}>
                    {intro.secondaryLink?.label || 'Learn more'}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                      <ArrowUpRight className="iso-arrow h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="min-w-0">
                {tiles.length ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {tiles.map((post, index) => (
                      <div key={post.id || post.slug} className={index % 2 === 1 ? 'sm:translate-y-6' : ''}>
                        <ImageFirstCard post={post} href={postHref(primaryTask, post, primaryRoute)} tall={index % 3 === 0} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 rounded-[1.75rem] border border-white/40 bg-white/25 p-8 text-[#12210E]">
                    <Layers className="h-8 w-8" />
                    <p className="editable-display text-2xl font-semibold tracking-[-0.03em]">Posts appear here as soon as they are published.</p>
                    <p className="text-sm leading-7 opacity-80">{intro.paragraphs?.[1]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </EditableReveal>

      </div>
    </section>
  )
}

/* ========================================================== 3. EDITORIAL SPLIT */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!pool.length) return null

  const feature = pool[0]
  const rows = pool.slice(1, 4)
  const index = pool.slice(4, 10)

  return (
    <section className="bg-[var(--slot4-warm)] py-16 sm:py-20 lg:py-24">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className={dc.type.eyebrow}>In focus</span>
            <h2 className={`${dc.type.sectionTitle} mt-3`}>
              What people are <span className="iso-squiggle">reading</span> right now
            </h2>
          </div>
          <Link href={primaryRoute} className={dc.button.secondary}>
            View all
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
              <ArrowUpRight className="iso-arrow h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <EditableReveal className="min-w-0">
            <EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label="Featured" />
          </EditableReveal>

          <div className="grid min-w-0 content-start gap-4">
            {rows.map((post, i) => (
              <EditableReveal key={post.id || post.slug} delay={i * 60} className="min-w-0">
                <ArticleListCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
              </EditableReveal>
            ))}
          </div>
        </div>

        {index.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {index.map((post, i) => (
              <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ============================================= 4. NUMBERS + TIME COLLECTIONS */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: 'Gaining traction', title: 'Popular this month' },
  index: { eyebrow: 'Still worth it', title: 'From the archive' },
}

function StatCard({
  value,
  suffix,
  label,
  body,
  background,
  color,
  icon: Icon,
  tilt,
}: {
  value: number
  suffix: string
  label: string
  body: string
  background: string
  color: string
  icon: typeof Globe2
  tilt: string
}) {
  return (
    <div
      className={`relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[var(--iso-radius-lg)] p-7 transition duration-500 hover:-translate-y-1.5 hover:rotate-0 sm:p-8 ${tilt}`}
      style={{ background, color }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--slot4-page-text)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="editable-display text-[3.25rem] font-semibold leading-none tracking-[-0.05em] sm:text-[4rem]">
          <EditableCountUp value={value} suffix={suffix} />
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] opacity-80">{label}</p>
        <p className="mt-2 max-w-xs text-sm leading-6 opacity-80">{body}</p>
      </div>
    </div>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const categoryCount = uniqueCategories(pool, 40).length
  const visualCount = pool.filter(hasEditableImage).length

  // Use the real time windows; fall back to slicing posts so the page stays full.
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)

  return (
    <>
      {/* --- numbers --- */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center`}>
          <div className="min-w-0">
            <h2 className="editable-display max-w-md text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[3.25rem]">
              A few numbers behind the <span className="iso-squiggle">content</span> we publish
            </h2>
            <p className="mt-8 max-w-sm text-[0.98rem] leading-[1.8] text-[var(--slot4-muted-text)]">
              These are more than milestones. They show how much there is to explore, how often it grows, and how easy it is to
              find something useful here.
            </p>
            <Link href={primaryRoute} className={`${dc.button.primary} mt-8`}>
              Start exploring
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                <ArrowUpRight className="iso-arrow h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <StatCard
              value={Math.max(pool.length, 12)}
              suffix="+"
              label="Posts live"
              body="Individual pages with their own media, details and context."
              background="var(--iso-blue)"
              color="#FFFFFF"
              icon={Globe2}
              tilt="sm:-rotate-1"
            />
            <StatCard
              value={Math.max(categoryCount, 6)}
              suffix="+"
              label="Topics covered"
              body="Categories spanning the people, work and ideas featured here."
              background="var(--iso-green-panel)"
              color="#12210E"
              icon={CheckCircle2}
              tilt="sm:rotate-1 sm:translate-y-6"
            />
            <StatCard
              value={Math.max(visualCount, 8)}
              suffix="+"
              label="Visual posts"
              body="Posts that lead with real photography, artwork and galleries."
              background="var(--iso-coral)"
              color="#FFFFFF"
              icon={Layers}
              tilt="sm:rotate-1"
            />
            <StatCard
              value={7}
              suffix=" days"
              label="Refresh window"
              body="New posts surface on the homepage within the same week."
              background="var(--iso-yellow)"
              color="#221F05"
              icon={Sparkles}
              tilt="sm:-rotate-1 sm:translate-y-6"
            />
          </div>
        </div>
      </section>

      {/* --- time windows, each with its own layout --- */}
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const items = section.posts.slice(0, 8)
        const dark = index === 1
        return (
          <section key={section.key} className={dark ? 'bg-[var(--iso-ink)] text-[var(--iso-cream)]' : ''}>
            <div className={`${container} ${dark ? 'py-16 sm:py-20' : 'py-14 sm:py-16'}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${dark ? 'text-[var(--iso-green)]' : 'text-[var(--slot4-accent)]'}`}>
                    {copy.eyebrow}
                  </span>
                  <h2 className={`${dc.type.sectionTitle} mt-3`}>{copy.title}</h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? 'text-[var(--iso-green)]' : 'text-[var(--slot4-accent)]'}`}
                >
                  See all <ArrowUpRight className="iso-arrow h-4 w-4" />
                </Link>
              </div>

              {index === 0 ? (
                /* masonry-ish gallery */
                <div className="mt-9 columns-1 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
                  {items.map((post, i) => (
                    <div key={post.id || post.slug} className="mb-5 break-inside-avoid">
                      <VariedCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                    </div>
                  ))}
                </div>
              ) : index === 1 ? (
                /* horizontal scroll rail on ink */
                <div className={`${dc.layout.rail} mt-9`}>
                  {items.map((post, i) => (
                    <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                  ))}
                </div>
              ) : (
                /* quiet editorial list */
                <div className="mt-9 grid gap-4 lg:grid-cols-2">
                  {items.map((post, i) => (
                    <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ================================================================== 5. CTA */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 px-3 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[var(--editable-container)]">
        <div className="iso-grain relative overflow-hidden rounded-[2.25rem] bg-[var(--iso-green-panel)] px-6 py-20 text-center sm:px-10 sm:py-28">
          {/* playful confetti */}
          <span className="pointer-events-none absolute left-[8%] top-12 h-16 w-16 rounded-full bg-[var(--iso-yellow)] opacity-90" aria-hidden="true" />
          <span className="pointer-events-none absolute right-[10%] top-20 h-10 w-10 rounded-[0.9rem] bg-[var(--iso-lilac)]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-14 left-[18%] h-8 w-8 rounded-full bg-[var(--iso-coral)]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-24 right-[16%] h-14 w-14 rounded-full border-8 border-white/50" aria-hidden="true" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[0.8rem] font-semibold text-[#12210E]">
              {cta.badge || 'Start exploring'}
            </span>
            <h2 className="editable-display mx-auto mt-8 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#12210E] sm:text-[4.5rem] lg:text-[5.75rem]">
              Ready when{' '}
              <EditableWordCycle words={['you are!', 'you begin.', 'you look.']} className="text-white" />
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-[1.05rem] leading-[1.8] text-[#12210E]/75">{cta.description}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href={cta.primaryCta?.href || '/create'}
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--iso-ink)] py-2 pl-6 pr-2 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(23,23,15,0.3)]"
              >
                {cta.primaryCta?.label || 'Browse posts'}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iso-green)] text-[#12210E]">
                  <ArrowUpRight className="iso-arrow h-4 w-4" />
                </span>
              </Link>
              <Link
                href={cta.secondaryCta?.href || '/contact'}
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(23,23,15,0.18)]"
              >
                {cta.secondaryCta?.label || 'Contact us'}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-warm)]">
                  <ArrowUpRight className="iso-arrow h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
