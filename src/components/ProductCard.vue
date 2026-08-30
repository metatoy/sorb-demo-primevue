<template>
  <Card class="jj-product-card">
    <template #header>
      <div class="jj-product-media">
        <img :src="assetUrl(product.imageRef)" :alt="product.name" />
        <span v-if="product.badge" class="jj-badge" :data-badge="badgeVariant">
          {{ product.badge }}
        </span>
      </div>
    </template>
    <template #title>{{ product.name }}</template>
    <template #subtitle>{{ product.fit }} · {{ product.wash }}</template>
    <template #content>
      <p class="jj-price">{{ formatPrice(product.priceCents) }}</p>
    </template>
    <template #footer>
      <RouterLink :to="`/product/${product.id}`" custom v-slot="{ href, navigate }">
        <Button :href="href" @click="navigate" as="a" label="View" size="small" class="jj-view-btn" />
      </RouterLink>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { assetUrl, formatPrice } from '../data/kit.js'

const props = defineProps({ product: { type: Object, required: true } })

// Badge variant is DATA-driven (which product.badge string is present), not
// a global theme concern — bound per-instance to the kit's badge.bg/fg.{variant}
// component tokens via the [data-badge] attribute selector in <style scoped>
// below, rather than forced through PrimeVue's unrelated Tag "severity" enum.
const badgeVariant = computed(() => {
  if (props.product.badge === 'new wash') return 'new'
  if (props.product.badge === 'sale') return 'sale'
  return 'default'
})
</script>

<style scoped>
.jj-product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.jj-product-media {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--color-surface-raised);
  border-top-left-radius: var(--card-radius);
  border-top-right-radius: var(--card-radius);
}
.jj-product-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.jj-badge {
  position: absolute;
  top: var(--space-200);
  left: var(--space-200);
  padding: var(--space-100) var(--space-300);
  border-radius: var(--badge-radius);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: var(--badge-bg-default);
  color: var(--badge-fg-default);
}
.jj-badge[data-badge='new'] {
  background: var(--badge-bg-new);
  color: var(--badge-fg-new);
}
.jj-badge[data-badge='sale'] {
  background: var(--badge-bg-sale);
  color: var(--badge-fg-sale);
}
.jj-price {
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
.jj-view-btn {
  width: 100%;
}
</style>
