// Client-state-only cart (no backend, no persistence beyond sessionStorage —
// see spec/sorb/demo-sites-multistack.md Non-goals). A plain reactive
// singleton is enough for a demo this size; no Pinia dependency needed.
import { reactive, computed } from 'vue'
import { findProduct } from '../data/kit.js'

const STORAGE_KEY = 'jj-primevue-cart'

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    void e
    return []
  }
}

const state = reactive({
  // [{ productId, size, qty }]
  lines: load(),
})

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines))
  } catch (e) {
    void e
  }
}

export function addToCart(productId, size, qty = 1) {
  const existing = state.lines.find((l) => l.productId === productId && l.size === size)
  if (existing) {
    existing.qty += qty
  } else {
    state.lines.push({ productId, size, qty })
  }
  persist()
}

export function removeLine(productId, size) {
  const idx = state.lines.findIndex((l) => l.productId === productId && l.size === size)
  if (idx !== -1) state.lines.splice(idx, 1)
  persist()
}

export function setQty(productId, size, qty) {
  const line = state.lines.find((l) => l.productId === productId && l.size === size)
  if (line) line.qty = Math.max(1, qty)
  persist()
}

export function clearCart() {
  state.lines = []
  persist()
}

export const cartLines = computed(() =>
  state.lines
    .map((l) => ({ ...l, product: findProduct(l.productId) }))
    .filter((l) => l.product),
)

export const cartCount = computed(() => state.lines.reduce((n, l) => n + l.qty, 0))

export const cartSubtotalCents = computed(() =>
  cartLines.value.reduce((sum, l) => sum + l.product.priceCents * l.qty, 0),
)
