import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Profiles, galleries and everything worth a closer look',
      description:
        'Browse people, work and visual collections in one place. Clear pages, real detail, and a layout built for finding what you need quickly.',
      openGraphTitle: 'Profiles, galleries and everything worth a closer look',
      openGraphDescription:
        'A calm, visual way to explore people, work and collections — with clear pages and easy browsing.',
      keywords: ['profiles', 'galleries', 'visual discovery', 'creative directory', 'browse collections'],
    },
    hero: {
      badge: 'Fresh posts every week',
      title: ['A clearer way to find the people,', 'work and visuals worth your time.'],
      description:
        'Every profile and gallery here gets its own page — real images, real detail, and none of the noise. Browse by section, search by keyword, or just follow what catches your eye.',
      primaryCta: { label: 'Browse the galleries', href: '/image' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search profiles, galleries, topics…',
      focusLabel: 'Focus',
      featureCardBadge: 'live from the feed',
      featureCardTitle: 'The newest posts set the tone of the homepage.',
      featureCardDescription:
        'Recent images and profiles stay front and centre, so the page reflects what is actually being published.',
    },
    intro: {
      badge: 'One place, everything connected',
      title: 'One place. Every post, properly presented.',
      paragraphs: [
        'Profiles, galleries and collections all live under one roof, with the same clean structure and the same easy navigation — so moving between them never feels like starting over.',
        'Each post keeps its own page with full media, context and details, and related posts stay one click away.',
        'Whether you arrive from a search, a link or the homepage, you can keep exploring without losing your place.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A visual homepage that leads with the newest posts.',
        'Dedicated sections for people and for image collections.',
        'Filters, search and categories that actually narrow things down.',
        'Light, fast pages that stay readable on any screen.',
      ],
      primaryLink: { label: 'Browse galleries', href: '/image' },
      secondaryLink: { label: 'About this site', href: '/about' },
    },
    cta: {
      badge: 'Jump in',
      title: 'Ready when you are.',
      description:
        'Explore the newest profiles and galleries, or get in touch if you would like your work featured here.',
      primaryCta: { label: 'Browse everything', href: '/image' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About us',
    title: 'A calmer way to browse people, work and visuals.',
    description: `${slot4BrandConfig.siteName} brings profiles, galleries and collections together so discovery feels like one continuous experience instead of a dozen disconnected pages.`,
    paragraphs: [
      'The idea is simple: give every post a proper page, keep the structure predictable, and let the images and details do the talking.',
      'Whether you start with a profile, a gallery or a search result, you can keep going without hitting a dead end.',
      'The layout is built to stay quick and readable — on a laptop at a desk or a phone on the move.',
    ],
    values: [
      {
        title: 'Built for browsing',
        description: 'Clear hierarchy, generous spacing and layouts that make scanning a long list genuinely pleasant.',
      },
      {
        title: 'Everything connected',
        description: 'Profiles, galleries and collections share one navigation, so related posts are always a click away.',
      },
      {
        title: 'Straightforward by design',
        description: 'No clutter, no dark patterns — just clean pages, honest detail and fast access to what you came for.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you need — we will point you the right way.',
    description:
      'Whether you want your work featured, have a question about a post, or need a hand finding something, send a note and we will get back to you.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search profiles, galleries, categories and posts across the site.',
    },
    hero: {
      badge: 'Search',
      title: 'Find it in a couple of keystrokes.',
      description: 'Search by keyword, narrow by category, or filter to a single section — results update as you refine them.',
      placeholder: 'Try a name, a topic or a category',
    },
    resultsTitle: 'Latest across the site',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Members only',
      title: 'Log in to start a new post.',
      description: 'Sign in to open the publishing workspace and prepare a post for any active section of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Put together a new post.',
      description: 'Pick the section, add the details, and set up a clean post with images, links, a summary and full content.',
    },
    formTitle: 'Post details',
    submitLabel: 'Save post',
    successTitle: 'Post saved.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Welcome back',
      title: 'Pick up right where you left off.',
      description: 'Log in to keep browsing, manage what you have submitted, and start new posts from your account.',
      formTitle: 'Log in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then log in.',
      success: 'Logged in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Join in',
      title: 'Create an account and start posting.',
      description: 'An account gives you the publishing workspace, saved details, and a place to manage everything you submit.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Log in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reads',
      fallbackTitle: 'Post details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'More galleries',
      fallbackTitle: 'Gallery details',
    },
    profile: {
      relatedTitle: 'More profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
