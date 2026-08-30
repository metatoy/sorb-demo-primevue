<template>
  <div class="jj-account">
    <div class="jj-account-header">
      <Avatar :label="initials" size="large" shape="circle" class="jj-avatar" />
      <div>
        <h1>{{ copy.account.title }}</h1>
        <Menu :model="menuItems" popup ref="menuRef" />
      </div>
    </div>

    <Tabs value="orders">
      <TabList>
        <Tab value="orders">{{ copy.account.tabs.orders }}</Tab>
        <Tab value="profile">{{ copy.account.tabs.profile }}</Tab>
        <Tab value="addresses">{{ copy.account.tabs.addresses }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="orders">
          <DataTable v-if="orders.length" :value="orders">
            <Column field="id" header="Order" />
            <Column field="date" header="Date" />
            <Column field="total" header="Total" />
            <Column field="status" header="Status" />
          </DataTable>
          <p v-else class="jj-empty">{{ copy.account.ordersEmpty }}</p>
        </TabPanel>

        <TabPanel value="profile">
          <h2>{{ copy.account.profileHeading }}</h2>
          <div class="jj-form-grid">
            <div class="jj-field">
              <label for="p-name">Full name</label>
              <InputText id="p-name" v-model="profile.name" />
            </div>
            <div class="jj-field">
              <label for="p-email">Email</label>
              <InputText id="p-email" v-model="profile.email" />
            </div>
          </div>
          <Button :label="copy.account.saveCta" @click="onSave" />
        </TabPanel>

        <TabPanel value="addresses">
          <p class="jj-empty">No saved addresses in this demo session.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { copy } from '../data/kit.js'

const toast = useToast()
const profile = reactive({ name: 'Jane Demo', email: 'jane@example.com' })
const initials = computed(() =>
  profile.name
    .split(' ')
    .map((p) => p[0])
    .join(''),
)
const orders = [] // client-state demo — never seeded, matches copy.account.ordersEmpty
const menuItems = ref([{ label: 'Sign out (demo)', icon: 'pi pi-sign-out' }])
const menuRef = ref(null)

function onSave() {
  toast.add({ severity: 'success', summary: 'Saved', detail: 'Profile updated (demo — not persisted).', life: 2500 })
}
</script>

<style scoped>
.jj-account {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
}
.jj-account-header {
  display: flex;
  align-items: center;
  gap: var(--space-400);
  margin-bottom: var(--space-600);
}
.jj-avatar {
  background: var(--button-primary-bg-default);
  color: var(--button-primary-fg-default);
}
.jj-form-grid {
  display: grid;
  gap: var(--space-400);
  max-width: 400px;
  margin: var(--space-400) 0;
}
.jj-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
}
.jj-empty {
  color: var(--color-ink-muted);
}
</style>
