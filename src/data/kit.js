// Thin re-export layer over @metatoy/janes-jeans's fixtures + assets — the
// kit ships no build step (plain JSON/SVG), so this is the ONE place the app
// touches its on-disk shape. No CMS, no backend (client-state mocks only —
// see spec/sorb/demo-sites-multistack.md Non-goals).
import productsData from '@metatoy/janes-jeans/fixtures/products.json'
import navData from '@metatoy/janes-jeans/fixtures/nav.json'
import copyData from '@metatoy/janes-jeans/fixtures/copy.json'

export const products = productsData.products
export const nav = navData
export const copy = copyData

// Vite asset glob over the kit's SVGs — keyed by filename so ProductCard/PDP
// can resolve `product.imageRef` -> a served URL without hardcoding paths.
const assetModules = import.meta.glob('/node_modules/@metatoy/janes-jeans/assets/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})
const assetsByFile = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split('/').pop(), url]),
)

/** @param {string} imageRef e.g. "high-rise-straight-indigo.svg" */
export const assetUrl = (imageRef) => assetsByFile[imageRef] ?? assetsByFile['logo.svg']

export const logoUrl = assetsByFile['logo.svg']

export const findProduct = (idOrSlug) =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)

export const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`
