// P4a spike verification — headless proof that a token pushed through the
// juice bridge reaches a real PrimeVue-styled element, not just the CSS var
// definition. Assumes `npm run sorb` (bridge, port 7784) and `npm run dev`
// (Vite, port 5173) are already running.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const APP_URL = 'http://127.0.0.1:5173'
const BRIDGE_URL = 'http://127.0.0.1:7784'
const SHOT_DIR = new URL('../screenshots/', import.meta.url)

const ACID_GREEN = '#7fb069'

async function createPreview(tokens) {
  const res = await fetch(`${BRIDGE_URL}/preview`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(tokens),
  })
  if (!res.ok) throw new Error(`POST /preview failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function updatePreview(id, tokens) {
  const res = await fetch(`${BRIDGE_URL}/preview/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(tokens),
  })
  if (!res.ok) throw new Error(`PUT /preview/${id} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } })

  const consoleLines = []
  page.on('console', (msg) => consoleLines.push(msg.text()))

  const readButtonBg = () =>
    page.$eval('#jj-primary-btn', (el) => getComputedStyle(el).backgroundColor)
  const readJjBrandVar = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--jj-brand').trim())

  // GOTCHA (P4/P5/P6 note): sorbInit/SorbProvider only enter preview mode for
  // a page loaded with `?preview=<id>` in the URL (previewGuard.js + core.js
  // `init()` read `location.search` ONCE at boot) — there is no "subscribe to
  // whatever is currently live" broadcast to an already-open tab. The
  // Figma-plugin UX mints the id first (POST /preview) and hands the designer
  // a link to open; a page that's already open with no `?preview=` stays on
  // committed tokens no matter what gets POSTed to the bridge. So: create the
  // preview FIRST, THEN load the app at the preview URL — matching how a real
  // reviewer would open the plugin's "preview link".
  const { id } = await createPreview({ 'jj-brand': '#3355ff' }) // distinct from committed, proves preview-mode entry (bare key — see sorbConfig.js note)
  await page.goto(`${APP_URL}/?preview=${id}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#jj-primary-btn')

  const beforeBg = await readButtonBg()
  const beforeVar = await readJjBrandVar()
  const beforeState = await page.evaluate(() => window.__sorb?.getState())
  await page.screenshot({ path: new URL('before.png', SHOT_DIR).pathname })

  // Now the LIVE swap: PUT an update to the SAME active preview id, changing
  // ONLY --jj-brand to an obviously different color, and confirm it reaches
  // the rendered Button (not just the var) WITHOUT a page reload — leaf's
  // poll (sorbConfig.preview.pollInterval = 1000ms) picks it up.
  await updatePreview(id, { 'jj-brand': ACID_GREEN })
  await page.waitForTimeout(1600)

  const afterBg = await readButtonBg()
  const afterVar = await readJjBrandVar()
  await page.screenshot({ path: new URL('after.png', SHOT_DIR).pathname })

  const sorbState = await page.evaluate(() => window.__sorb?.getState())

  await browser.close()

  const changed = beforeBg !== afterBg
  const acidRgb = 'rgb(127, 176, 105)' // #7fb069 in rgb()

  const result = {
    previewId: id,
    beforeVar,
    afterVar,
    beforeButtonBg: beforeBg,
    afterButtonBg: afterBg,
    matchesPushedColor: afterBg === acidRgb,
    changed,
    beforeState,
    sorbState,
  }

  console.log(JSON.stringify(result, null, 2))
  console.log('\n--- console log tail ---')
  console.log(consoleLines.slice(-10).join('\n'))

  if (!changed || afterBg !== acidRgb) {
    console.error('\nNO-GO: rendered Button background did not update to the pushed color.')
    process.exit(1)
  }
  console.log('\nGO: live preview swap reached the PrimeVue-styled Button element.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
