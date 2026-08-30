<template>
  <div class="jj-home">
    <section class="jj-hero">
      <p class="jj-hero-eyebrow">{{ copy.hero.eyebrow }}</p>
      <h1>{{ copy.hero.headline }}</h1>
      <p class="jj-hero-sub">{{ copy.hero.subhead }}</p>
      <div class="jj-hero-ctas">
        <RouterLink to="/shop" custom v-slot="{ href, navigate }">
          <Button :href="href" @click="navigate" as="a" :label="copy.hero.primaryCta" />
        </RouterLink>
        <RouterLink to="/shop" custom v-slot="{ href, navigate }">
          <Button :href="href" @click="navigate" as="a" :label="copy.hero.secondaryCta" severity="secondary" />
        </RouterLink>
      </div>
    </section>

    <section class="jj-section">
      <h2>{{ copy.sections.featuredTitle }}</h2>
      <div class="jj-grid">
        <ProductCard v-for="p in featured" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="jj-section">
      <h2>{{ copy.sections.newWashesTitle }}</h2>
      <div class="jj-grid">
        <ProductCard v-for="p in newWashes" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="jj-section jj-about">
      <Card>
        <template #title>{{ copy.sections.aboutTeaserTitle }}</template>
        <template #content>
          <p>{{ copy.sections.aboutTeaserBody }}</p>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProductCard from '../components/ProductCard.vue'
import { products, copy } from '../data/kit.js'

const featured = computed(() => products.slice(0, 4))
const newWashes = computed(() => products.filter((p) => p.badge === 'new wash'))
</script>

<style scoped>
.jj-home {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
}
.jj-hero {
  text-align: center;
  padding: var(--space-1200) var(--space-400);
  background: var(--color-surface-raised);
  border-radius: var(--card-radius);
  margin-bottom: var(--space-1200);
}
.jj-hero-eyebrow {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: var(--typography-caption-font-size);
}
.jj-hero h1 {
  font-size: var(--typography-display-font-size);
  font-weight: var(--typography-display-font-weight);
  line-height: var(--typography-display-line-height);
  margin: var(--space-200) 0;
  color: var(--color-ink);
}
.jj-hero-sub {
  max-width: 560px;
  margin: 0 auto var(--space-600);
  color: var(--color-ink-muted);
}
.jj-hero-ctas {
  display: flex;
  gap: var(--space-300);
  justify-content: center;
}
.jj-section {
  margin-bottom: var(--space-1200);
}
.jj-section h2 {
  color: var(--color-ink);
  margin-bottom: var(--space-400);
}
.jj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-400);
}
</style>
