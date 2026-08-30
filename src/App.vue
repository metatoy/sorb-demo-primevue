<template>
  <div class="jj-shell">
    <Menubar :model="menuItems" class="jj-menubar">
      <template #start>
        <RouterLink to="/" class="jj-brand" aria-label="Janes Jeans — home">
          <img :src="logoUrl" alt="Janes Jeans" class="jj-logo" />
        </RouterLink>
      </template>
      <template #item="{ item, props }">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-bind="props.action" :href="href" @click="navigate">{{ item.label }}</a>
        </RouterLink>
        <a v-else v-bind="props.action" :href="item.href">{{ item.label }}</a>
      </template>
      <template #end>
        <div class="jj-nav-end">
          <RouterLink to="/account" class="jj-icon-link" aria-label="Account">
            <i class="pi pi-user" />
          </RouterLink>
          <RouterLink to="/cart" class="jj-icon-link jj-cart-link" aria-label="Cart">
            <i class="pi pi-shopping-bag" />
            <Badge v-if="cartCount > 0" :value="cartCount" severity="danger" class="jj-cart-badge" />
          </RouterLink>
        </div>
      </template>
    </Menubar>

    <Toast />

    <main class="jj-main">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Menubar from 'primevue/menubar'
import Badge from 'primevue/badge'
import Toast from 'primevue/toast'
import { nav, logoUrl } from './data/kit.js'
import { cartCount } from './store/cart.js'
import AppFooter from './components/AppFooter.vue'

// nav.json -> PrimeVue Menubar `model` shape. Category pages don't exist in
// this client-state demo, so top-level items route to /shop (query params
// are cosmetic — no real filtering backend); children are informational.
const toMenuItem = (entry) => ({
  label: entry.label,
  route: entry.href.startsWith('/shop') ? '/shop' : undefined,
  href: entry.href,
  items: entry.children?.map((c) => ({ label: c.label, href: c.href })),
})

const menuItems = computed(() => nav.primary.map(toMenuItem))
</script>

<style>
/* Global (unscoped) — the shell reads Janes Jeans tokens directly, same as
   every PrimeVue component reads them indirectly through the generated
   sorb/primevue-preset module (src/tokens/generated/jjPreset.generated.js). */
:root {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
}
body {
  margin: 0;
  background: var(--color-surface);
  color: var(--color-ink);
}
</style>

<style scoped>
.jj-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.jj-menubar {
  border-radius: 0;
  padding-inline: var(--space-600);
}
.jj-brand {
  display: flex;
  align-items: center;
  gap: var(--space-200);
  text-decoration: none;
  color: var(--nav-fg);
  font-weight: var(--font-weight-semibold);
  margin-right: var(--space-600);
}
.jj-logo {
  height: 28px;
  filter: brightness(0) invert(1);
}
.jj-nav-end {
  display: flex;
  align-items: center;
  gap: var(--space-400);
}
.jj-icon-link {
  position: relative;
  color: var(--nav-fg);
  font-size: 1.1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.jj-cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
}
.jj-main {
  flex: 1;
}
</style>
