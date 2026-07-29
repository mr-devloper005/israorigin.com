import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'People, work and visual collections',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'People, work and visual collections',
    primaryLinks: [
      { label: 'Galleries', href: '/image' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get in touch', href: '/contact' },
      secondary: { label: 'Search', href: '/search' },
    },
  },
  footer: {
    tagline: 'People, work and visual collections',
    description:
      'A single place to browse profiles, galleries and collections — each with its own page, full media and the detail you actually need.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Galleries', href: '/image' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Made for clear, connected discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
