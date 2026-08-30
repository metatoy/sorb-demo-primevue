<template>
  <div v-if="product" class="jj-pdp">
    <div class="jj-pdp-gallery">
      <img :src="mainImage" :alt="product.name" class="jj-pdp-main-img" />
      <div class="jj-pdp-thumbs">
        <button
          v-for="(t, i) in thumbs"
          :key="i"
          class="jj-thumb"
          :class="{ active: i === activeThumb }"
          @click="activeThumb = i"
        >
          <img :src="t" :alt="`${product.name} view ${i + 1}`" />
        </button>
      </div>
    </div>

    <div class="jj-pdp-info">
      <span v-if="product.badge" class="jj-badge" :data-badge="badgeVariant">{{ product.badge }}</span>
      <h1>{{ product.name }}</h1>
      <p class="jj-pdp-meta">{{ product.fit }} · {{ product.wash }}</p>
      <p class="jj-pdp-price">{{ formatPrice(product.priceCents) }}</p>

      <div class="jj-field">
        <span class="jj-field-label">{{ copy.product.sizeLabel }}</span>
        <SelectButton v-model="size" :options="product.sizes" />
        <p class="jj-size-help">{{ copy.product.sizeHelp }}</p>
      </div>

      <div class="jj-field jj-qty-row">
        <span class="jj-field-label">{{ copy.product.quantityLabel }}</span>
        <InputNumber v-model="qty" :min="1" :max="10" showButtons buttonLayout="horizontal" />
      </div>

      <div class="jj-pdp-actions">
        <Button :label="copy.product.addToCart" :disabled="!size" @click="onAddToCart" />
        <Button :label="copy.product.buyNow" severity="secondary" :disabled="!size" @click="onBuyNow" />
      </div>

      <Tabs value="details" class="jj-pdp-tabs">
        <TabList>
          <Tab value="details">{{ copy.product.tabs.details }}</Tab>
          <Tab value="care">{{ copy.product.tabs.care }}</Tab>
          <Tab value="reviews">{{ copy.product.tabs.reviews }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="details">
            <Accordion value="0">
              <AccordionPanel value="0">
                <AccordionHeader>Fit &amp; fabric</AccordionHeader>
                <AccordionContent>
                  <p>{{ product.fit }} fit, {{ product.wash }} wash. True to size — see the size help note above.</p>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>Shipping</AccordionHeader>
                <AccordionContent>
                  <p>{{ shippingCopy.shippingNote }}</p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </TabPanel>
          <TabPanel value="care">
            <p>{{ copy.product.careBody }}</p>
          </TabPanel>
          <TabPanel value="reviews">
            <p class="jj-empty-reviews">No reviews yet in this demo session.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
  <div v-else class="jj-pdp-missing">
    <p>Product not found in this demo catalog.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import InputNumber from 'primevue/inputnumber'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { findProduct, assetUrl, formatPrice, copy } from '../data/kit.js'
import { addToCart } from '../store/cart.js'

const route = useRoute()
const toast = useToast()

const product = computed(() => findProduct(route.params.id))
const shippingCopy = copy.cart

const mainImageSrc = computed(() => (product.value ? assetUrl(product.value.imageRef) : ''))
const activeThumb = ref(0)
// This demo catalog has one owned image per SKU; the gallery repeats it —
// a real storefront would have N shots per product from the kit/CMS.
const thumbs = computed(() => Array(3).fill(mainImageSrc.value))
const mainImage = computed(() => thumbs.value[activeThumb.value] ?? mainImageSrc.value)

const badgeVariant = computed(() => {
  if (!product.value?.badge) return 'default'
  if (product.value.badge === 'new wash') return 'new'
  if (product.value.badge === 'sale') return 'sale'
  return 'default'
})

const size = ref(null)
const qty = ref(1)

function onAddToCart() {
  addToCart(product.value.id, size.value, qty.value)
  toast.add({ severity: 'success', summary: copy.product.addToCartAdded, detail: copy.product.toastAdded, life: 3000 })
}

function onBuyNow() {
  addToCart(product.value.id, size.value, qty.value)
  toast.add({ severity: 'info', summary: copy.product.buyNow, detail: copy.product.toastAdded, life: 2500 })
}
</script>

<style scoped>
.jj-pdp {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1200);
}
.jj-pdp-main-img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--card-radius);
  background: var(--color-surface-raised);
}
.jj-pdp-thumbs {
  display: flex;
  gap: var(--space-200);
  margin-top: var(--space-200);
}
.jj-thumb {
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  padding: 0;
  cursor: pointer;
  background: none;
  overflow: hidden;
  width: 64px;
  height: 80px;
}
.jj-thumb.active {
  border-color: var(--color-brand);
}
.jj-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.jj-badge {
  display: inline-block;
  padding: var(--space-100) var(--space-300);
  border-radius: var(--badge-radius);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: var(--badge-bg-default);
  color: var(--badge-fg-default);
  margin-bottom: var(--space-200);
}
.jj-badge[data-badge='new'] {
  background: var(--badge-bg-new);
  color: var(--badge-fg-new);
}
.jj-badge[data-badge='sale'] {
  background: var(--badge-bg-sale);
  color: var(--badge-fg-sale);
}
.jj-pdp-meta {
  color: var(--color-ink-muted);
  margin: 0 0 var(--space-200);
}
.jj-pdp-price {
  font-size: var(--typography-heading-font-size);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-600);
}
.jj-field {
  margin-bottom: var(--space-400);
}
.jj-field-label {
  display: block;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-200);
}
.jj-size-help {
  color: var(--color-ink-muted);
  font-size: var(--typography-caption-font-size);
  margin: var(--space-100) 0 0;
}
.jj-pdp-actions {
  display: flex;
  gap: var(--space-300);
  margin: var(--space-600) 0;
}
.jj-pdp-tabs {
  margin-top: var(--space-800);
}
.jj-empty-reviews {
  color: var(--color-ink-muted);
}
</style>
