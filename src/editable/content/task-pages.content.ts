import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading',
    headline: 'Long reads, worth the time.',
    description: 'Essays, guides and explainers laid out for comfortable reading — generous type, clear structure, no clutter.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading pages get space, hierarchy and fewer distractions.',
    chips: ['Long reads', 'Guides', 'Explainers'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Offers and notices, easy to scan.',
    description: 'Quick to read, quick to act on. Prices, locations and contact details stay right where you expect them.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Short summaries, obvious next steps.',
    chips: ['Fresh offers', 'Local', 'Direct contact'],
  },
  sbm: {
    eyebrow: 'Saved',
    headline: 'A shelf of links worth keeping.',
    description: 'Handpicked resources, tools and references, grouped so you can find the useful one again later.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated links with calm, readable metadata.',
    chips: ['Collections', 'Resources', 'References'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The people and businesses behind the work.',
    description:
      'Profiles built around identity — a portrait, what they do, where to find them, and the work that speaks for itself.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Identity and credibility first, before the grid begins.',
    chips: ['Independents', 'Studios', 'Businesses'],
  },
  pdf: {
    eyebrow: 'Library',
    headline: 'Documents, ready to open.',
    description: 'Guides, reports and reference files presented as a proper library — preview in place or download in one tap.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Clear file context and an obvious download path.',
    chips: ['Guides', 'Reports', 'Downloads'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Listings built for comparing.',
    description: 'Locations, contact details and context sit side by side, so choosing between options takes seconds.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Comparison, location and a direct way to get in touch.',
    chips: ['Compare', 'Locations', 'Contact details'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Image-led posts, shown properly.',
    description: 'A gallery-first grid where the pictures lead — full-bleed cards, generous crops and a lightbox on every post.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Let the images carry the page before the text does.',
    chips: ['Galleries', 'Visual-first', 'Full collections'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
