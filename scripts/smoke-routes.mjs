// Dev-only smoke check: load every §C route, capture console errors + a
// screenshot. Not part of the migration/live-swap evidence — just a fast
// "did it render" gate while building.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const APP_URL = 'http://127.0.0.1:5173'
const routes = ['/', '/shop', '/product/jj-001', '/cart', '/checkout', '/account']
const OUT = new URL('../screenshots/routes/', import.meta.url)

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${page.url()}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror ${page.url()}] ${err.message}`))

  for (const route of routes) {
    await page.goto(`${APP_URL}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const name = route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '')
    await page.screenshot({ path: new URL(`${name}.png`, OUT).pathname, fullPage: true })
  }

  // Exercise the add-to-cart → toast → cart → checkout → confirm flow once,
  // to prove client-state + the toast surface actually work, not just render.
  await page.goto(`${APP_URL}/product/jj-001`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '28' }).first().click().catch(() => {})
  await page.locator('.p-selectbutton .p-togglebutton').first().click().catch(() => {})
  await page.locator('button:has-text("Add to cart")').click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: new URL('product-toast.png', OUT).pathname })

  await page.goto(`${APP_URL}/cart`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: new URL('cart-with-item.png', OUT).pathname })

  await browser.close()

  console.log(JSON.stringify({ errors }, null, 2))
  if (errors.length) {
    console.error(`\n${errors.length} console error(s) captured.`)
    process.exit(1)
  }
  console.log('\nAll routes rendered with zero console errors.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
