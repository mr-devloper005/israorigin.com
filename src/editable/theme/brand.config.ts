import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#5CBF4E',
    surface: '#FFFFFF',
    canvas: '#F3EFE5',
    ink: '#17170F',
    play: ['#5CBF4E', '#F2DC3C', '#F4634E', '#2E7FF5', '#DDB8F7'],
  },
} as const
