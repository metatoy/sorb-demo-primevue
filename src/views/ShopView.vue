<template>
  <div class="jj-shop">
    <h1>{{ copy.shop.title }}</h1>
    <div class="jj-shop-layout">
      <aside class="jj-filters">
        <h3>{{ copy.shop.filterHeading }}</h3>
        <div class="jj-filter-group">
          <span class="jj-filter-label">Fit</span>
          <div v-for="fit in fits" :key="fit" class="jj-checkbox-row">
            <Checkbox v-model="selectedFits" :inputId="`fit-${fit}`" :value="fit" />
            <label :for="`fit-${fit}`">{{ fit }}</label>
          </div>
        </div>
        <div class="jj-filter-group">
          <span class="jj-filter-label">Max price: {{ formatPrice(priceMax * 100) }}</span>
          <Slider v-model="priceMax" :min="minPrice" :max="maxPrice" />
        </div>
      </aside>

      <section class="jj-results">
        <div class="jj-toolbar">
          <span>{{ filteredSorted.length }} items</span>
          <div class="jj-sort">
            <label for="sort">{{ copy.shop.sortLabel }}</label>
            <Select id="sort" v-model="sort" :options="copy.shop.sortOptions" />
          </div>
        </div>

        <div v-if="paged.length" class="jj-grid">
          <ProductCard v-for="p in paged" :key="p.id" :product="p" />
        </div>
        <p v-else class="jj-empty">{{ copy.shop.emptyState }}</p>

        <Paginator
          v-if="filteredSorted.length > pageSize"
          :rows="pageSize"
          :totalRecords="filteredSorted.length"
          v-model:first="first"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import Select from 'primevue/select'
import Paginator from 'primevue/paginator'
import ProductCard from '../components/ProductCard.vue'
import { products, copy, formatPrice } from '../data/kit.js'

const fits = [...new Set(products.map((p) => p.fit))].sort()
const minPrice = Math.floor(Math.min(...products.map((p) => p.priceCents)) / 100)
const maxPrice = Math.ceil(Math.max(...products.map((p) => p.priceCents)) / 100)

const selectedFits = ref([])
const priceMax = ref(maxPrice)
const sort = ref(copy.shop.sortOptions[0])
const first = ref(0)
const pageSize = 8

const filteredSorted = computed(() => {
  let list = products.filter((p) => p.priceCents / 100 <= priceMax.value)
  if (selectedFits.value.length) {
    list = list.filter((p) => selectedFits.value.includes(p.fit))
  }
  list = [...list]
  if (sort.value === 'Price: Low to High') list.sort((a, b) => a.priceCents - b.priceCents)
  else if (sort.value === 'Price: High to Low') list.sort((a, b) => b.priceCents - a.priceCents)
  else if (sort.value === 'Bestselling') list.sort((a, b) => (b.badge === 'bestseller' ? 1 : 0) - (a.badge === 'bestseller' ? 1 : 0))
  return list
})

const paged = computed(() => filteredSorted.value.slice(first.value, first.value + pageSize))
</script>

<style scoped>
.jj-shop {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
}
.jj-shop-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-800);
  margin-top: var(--space-600);
}
.jj-filters {
  border-right: 1px solid #e5dbcb; /* PRE-SORB: hardcoded, not swappable at runtime */
  padding-right: var(--space-600);
}
.jj-filter-group {
  margin-bottom: var(--space-600);
}
.jj-filter-label {
  display: block;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-200);
  font-size: var(--typography-caption-font-size);
  color: var(--color-ink-muted);
}
.jj-checkbox-row {
  display: flex;
  align-items: center;
  gap: var(--space-200);
  margin-bottom: var(--space-200);
}
.jj-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-400);
  color: var(--color-ink-muted);
}
.jj-sort {
  display: flex;
  align-items: center;
  gap: var(--space-200);
}
.jj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-400);
}
.jj-empty {
  color: var(--color-ink-muted);
  text-align: center;
  padding: var(--space-1200) 0;
}
</style>
