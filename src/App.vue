<template>
  <div class="jj-panel">
    <Card>
      <template #title>Janes Jeans — preview spike</template>
      <template #subtitle>Sorb × PrimeVue v4 (Aura preset)</template>
      <template #content>
        <div class="jj-field">
          <InputText v-model="name" placeholder="Style name" />
        </div>
        <div class="jj-tags">
          <Tag value="Indigo" severity="info" />
          <Tag value="Acid Wash" severity="success" />
        </div>
        <div class="jj-actions">
          <Button id="jj-primary-btn" label="Primary" />
          <Button label="Secondary" severity="secondary" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

const name = ref('')
</script>

<style scoped>
.jj-panel {
  max-width: 420px;
  margin: 3rem auto;
  font-family: system-ui, sans-serif;
}
.jj-field {
  margin-bottom: 1rem;
}
.jj-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.jj-actions {
  display: flex;
  gap: 0.75rem;
}
</style>
