// P4 live-swap verification — FULL storefront (not just one Button, per the
// P4a spike). Pushes the kit's own second committed theme
// (@metatoy/janes-jeans/tokens/variants/acid-wash.json — "Indigo Classic" →
// "Acid Wash") through the juice bridge and confirms it reaches rendered
// PrimeVue elements on BOTH home and the PDP, via computed style, not just a
// screenshot eyeball.
//
// Assumes `npm run tokens`, `npx sorb dev --port 7784`, and `npx vite` are
// already running (see CLAUDE.md).
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import acidWash from '../node_modules/@metatoy/janes-jeans/tokens/variants/acid-wash.json' with { type: 'json' }

const APP_URL = 'http://127.0.0.1:5173'
const BRIDGE_URL = 'http://127.0.0.1:7784'
const SHOT_DIR = new URL('../screenshots/live-swap/', import.meta.url)

// DTCG dot-path -> the bare kebab id sorbInit/applyTokens expects (matches
// the `css` transformGroup's naming: `color.surface` -> cssVar
// `--color-surface` -> bare token id `color-surface`). Only pushing the
// SEMANTIC-tier color + shadow ids the acid-wash variant actually overrides
// (typography/radius are unchanged in that variant, per the kit's
// tokens/variants/README.md — the variant replaces the semantic tier's
// color+shadow values only).
function flattenVariantTokens(variant) {
  const out = {}
  for (const [key, node] of Object.entries(variant.color)) {
    out[`color-${key}`] = node.$value
  }
  for (const [key, node] of Object.entries(variant.shadow)) {
    out[`shadow-${key}`] = node.$value
  }
  return out
}

const acidWashTokens = flattenVariantTokens(acidWash)

async function createPreview(tokens) {
  const res = await fetch(`${BRIDGE_URL}/preview`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(tokens),
  })
  if (!res.ok) throw new Error(`POST /preview failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const consoleLines = []
  page.on('console', (msg) => consoleLines.push(msg.text()))

  // --- BEFORE: committed tokens ("Indigo Classic"), no preview ---
  await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle' })
  const readPrimaryBtnBg = () =>
    page.$eval('.jj-hero-ctas .p-button:not(.p-button-secondary)', (el) => getComputedStyle(el).backgroundColor)
  const readCardBg = () => page.$eval('.p-card', (el) => getComputedStyle(el).backgroundColor)

  const beforeHomeBtnBg = await readPrimaryBtnBg()
  const beforeCardBg = await readCardBg()
  await page.screenshot({ path: new URL('home-before.png', SHOT_DIR).pathname, fullPage: true })

  await page.goto(`${APP_URL}/product/jj-001`, { waitUntil: 'networkidle' })
  const readAddToCartBg = () => page.$eval('button:has-text("Add to cart")', (el) => getComputedStyle(el).backgroundColor)
  const readBadgeBg = () => page.$eval('.jj-badge', (el) => getComputedStyle(el).backgroundColor)
  const beforePdpBtnBg = await readAddToCartBg()
  const beforeBadgeBg = await readBadgeBg()
  await page.screenshot({ path: new URL('pdp-before.png', SHOT_DIR).pathname, fullPage: true })

  // --- Push "Acid Wash" as a live preview (preview-id-first flow: mint the
  //     id, THEN load the app at ?preview=<id> — sorbInit only enters preview
  //     mode for a page that has that query param at boot; see the P4a
  //     report / sorbConfig.js's gotcha comment) ---
  const { id } = await createPreview(acidWashTokens)

  await page.goto(`${APP_URL}/?preview=${id}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const afterHomeBtnBg = await readPrimaryBtnBg()
  const afterCardBg = await readCardBg()
  const homeState = await page.evaluate(() => window.__sorb?.getState())
  await page.screenshot({ path: new URL('home-after.png', SHOT_DIR).pathname, fullPage: true })

  await page.goto(`${APP_URL}/product/jj-001?preview=${id}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const afterPdpBtnBg = await readAddToCartBg()
  const afterBadgeBg = await readBadgeBg()
  const pdpState = await page.evaluate(() => window.__sorb?.getState())
  await page.screenshot({ path: new URL('pdp-after.png', SHOT_DIR).pathname, fullPage: true })

  await browser.close()

  const result = {
    previewId: id,
    home: {
      primaryButtonBg: { before: beforeHomeBtnBg, after: afterHomeBtnBg, changed: beforeHomeBtnBg !== afterHomeBtnBg },
      cardBg: { before: beforeCardBg, after: afterCardBg, changed: beforeCardBg !== afterCardBg },
      previewMismatch: homeState?.previewMismatch,
    },
    pdp: {
      addToCartBg: { before: beforePdpBtnBg, after: afterPdpBtnBg, changed: beforePdpBtnBg !== afterPdpBtnBg },
      badgeBg: { before: beforeBadgeBg, after: afterBadgeBg, changed: beforeBadgeBg !== afterBadgeBg },
      previewMismatch: pdpState?.previewMismatch,
    },
  }
  console.log(JSON.stringify(result, null, 2))

  const allChanged =
    result.home.primaryButtonBg.changed &&
    result.home.cardBg.changed &&
    result.pdp.addToCartBg.changed &&
    !result.home.previewMismatch &&
    !result.pdp.previewMismatch

  // The PDP badge is intentionally NOT expected to change: the kit's acid-wash
  // variant overlays the SEMANTIC tier only (color.brand, color.surface, …);
  // badge.bg.new/sale reference PRIMITIVE stitch/red scales directly, which
  // the variant does not touch (see tokens/variants/README.md). Documented
  // here so an unchanged badge reads as "working as designed," not a miss.
  console.log(
    `\nNote: PDP badge background is expected to stay the same (${result.pdp.badgeBg.before}) — ` +
      `acid-wash overlays the semantic tier only, and badge colors reference primitives directly.`,
  )

  if (!allChanged) {
    console.error('\nNO-GO: one or more themed surfaces did not re-theme on the full storefront.')
    process.exit(1)
  }
  console.log('\nGO: full-storefront live preview swap confirmed on home + PDP (button + card backgrounds).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
