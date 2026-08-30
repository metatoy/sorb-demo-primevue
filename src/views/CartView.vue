<template>
  <div class="jj-cart">
    <h1>{{ copy.cart.title }}</h1>

    <div v-if="lines.length === 0" class="jj-cart-empty">
      <Card>
        <template #title>{{ copy.cart.emptyTitle }}</template>
        <template #content>
          <p>{{ copy.cart.emptyBody }}</p>
          <RouterLink to="/shop" custom v-slot="{ href, navigate }">
            <Button :href="href" @click="navigate" as="a" :label="copy.cart.emptyCta" />
          </RouterLink>
        </template>
      </Card>
    </div>

    <div v-else class="jj-cart-layout">
      <DataTable :value="lines" class="jj-cart-table">
        <Column header="Item">
          <template #body="{ data }">
            <div class="jj-line-item">
              <img :src="assetUrl(data.product.imageRef)" :alt="data.product.name" />
              <div>
                <div class="jj-line-name">{{ data.product.name }}</div>
                <div class="jj-line-size">Size {{ data.size }}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column header="Quantity">
          <template #body="{ data }">
            <InputNumber
              :modelValue="data.qty"
              @update:modelValue="(v) => setQty(data.productId, data.size, v)"
              :min="1"
              :max="10"
              showButtons
              buttonLayout="horizontal"
              inputStyle="width: 3rem"
            />
          </template>
        </Column>
        <Column header="Price">
          <template #body="{ data }">{{ formatPrice(data.product.priceCents * data.qty) }}</template>
        </Column>
        <Column header="">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              severity="secondary"
              text
              :aria-label="copy.cart.removeLabel"
              @click="removeLine(data.productId, data.size)"
            />
          </template>
        </Column>
      </DataTable>

      <Card class="jj-summary">
        <template #title>{{ copy.cart.subtotalLabel }}</template>
        <template #content>
          <div class="jj-summary-row">
            <span>{{ copy.cart.subtotalLabel }}</span>
            <strong>{{ formatPrice(subtotalCents) }}</strong>
          </div>
          <p class="jj-shipping-note">{{ copy.cart.shippingNote }}</p>
          <RouterLink to="/checkout" custom v-slot="{ href, navigate }">
            <Button :href="href" @click="navigate" as="a" :label="copy.cart.checkoutCta" class="jj-checkout-btn" />
          </RouterLink>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import { copy, assetUrl, formatPrice } from '../data/kit.js'
import { cartLines, cartSubtotalCents, removeLine, setQty } from '../store/cart.js'

const lines = cartLines
const subtotalCents = cartSubtotalCents
</script>

<style scoped>
.jj-cart {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
}
.jj-cart-empty {
  max-width: 420px;
  margin: var(--space-1200) auto;
  text-align: center;
}
.jj-cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-800);
  align-items: start;
  margin-top: var(--space-600);
}
.jj-line-item {
  display: flex;
  align-items: center;
  gap: var(--space-300);
}
.jj-line-item img {
  width: 48px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.jj-line-name {
  font-weight: var(--font-weight-medium);
}
.jj-line-size {
  color: var(--color-ink-muted);
  font-size: var(--typography-caption-font-size);
}
.jj-summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-200);
}
.jj-shipping-note {
  color: var(--color-ink-muted);
  font-size: var(--typography-caption-font-size);
  margin-bottom: var(--space-400);
}
.jj-checkout-btn {
  width: 100%;
}
</style>
