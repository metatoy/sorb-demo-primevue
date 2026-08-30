<template>
  <footer class="jj-footer">
    <div class="jj-footer-cols">
      <div v-for="col in nav.footer.columns" :key="col.heading" class="jj-footer-col">
        <h4>{{ col.heading }}</h4>
        <ul>
          <li v-for="link in col.links" :key="link.href"><a :href="link.href">{{ link.label }}</a></li>
        </ul>
      </div>
      <div class="jj-footer-col">
        <h4>{{ copy.footer.newsletterHeading }}</h4>
        <div class="jj-newsletter">
          <InputText placeholder="you@example.com" size="small" />
          <Button :label="copy.footer.newsletterCta" size="small" severity="secondary" />
        </div>
      </div>
    </div>
    <div class="jj-footer-legal">
      <span v-for="link in nav.footer.legal" :key="link.href">{{ link.label }}</span>
    </div>
  </footer>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { nav, copy } from '../data/kit.js'
</script>

<style scoped>
.jj-footer {
  /* PRE-SORB: hardcoded — not swappable at runtime. */
  background: #f2ede3;
  border-top: 1px solid #e5dbcb;
  padding: var(--space-800) var(--space-600) var(--space-400);
  margin-top: var(--space-1200);
}
.jj-footer-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-600);
  max-width: 1100px;
  margin: 0 auto;
}
.jj-footer-col h4 {
  margin: 0 0 var(--space-300);
  font-size: var(--typography-caption-font-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
}
.jj-footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
}
.jj-footer-col a {
  color: var(--color-ink);
  text-decoration: none;
  font-size: var(--typography-body-font-size);
}
.jj-newsletter {
  display: flex;
  gap: var(--space-200);
}
.jj-footer-legal {
  max-width: 1100px;
  margin: var(--space-600) auto 0;
  display: flex;
  gap: var(--space-400);
  font-size: var(--typography-caption-font-size);
  color: var(--color-ink-muted);
}
</style>
