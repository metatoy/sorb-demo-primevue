<template>
  <div class="jj-checkout">
    <h1>{{ copy.checkout.title }}</h1>

    <Stepper v-model:value="step" linear class="jj-stepper">
      <StepList>
        <Step value="1">{{ copy.checkout.steps[0] }}</Step>
        <Step value="2">{{ copy.checkout.steps[1] }}</Step>
        <Step value="3">{{ copy.checkout.steps[2] }}</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <h2>{{ copy.checkout.shippingHeading }}</h2>
          <div class="jj-form-grid">
            <div class="jj-field">
              <label for="name">Full name</label>
              <InputText id="name" v-model="form.name" :invalid="submitted && !form.name" />
              <small v-if="submitted && !form.name" class="jj-error">Name is required.</small>
            </div>
            <div class="jj-field">
              <label for="address">Street address</label>
              <InputText id="address" v-model="form.address" :invalid="submitted && !form.address" />
              <small v-if="submitted && !form.address" class="jj-error">Address is required.</small>
            </div>
            <div class="jj-field">
              <label for="region">{{ copy.checkout.regionLabel }}</label>
              <Select id="region" v-model="form.region" :options="regions" placeholder="Select a region" />
            </div>
            <div class="jj-field">
              <span>{{ copy.checkout.shippingMethodLabel }}</span>
              <div v-for="opt in shippingMethods" :key="opt" class="jj-radio-row">
                <RadioButton v-model="form.shippingMethod" :inputId="`ship-${opt}`" :value="opt" />
                <label :for="`ship-${opt}`">{{ opt }}</label>
              </div>
            </div>
          </div>
          <div class="jj-step-actions">
            <Button label="Continue" @click="tryAdvance('2')" />
          </div>
        </StepPanel>

        <StepPanel value="2">
          <h2>{{ copy.checkout.paymentHeading }}</h2>
          <div class="jj-form-grid">
            <div class="jj-field">
              <label for="card">Card number (demo — not collected)</label>
              <InputText id="card" v-model="form.card" placeholder="•••• •••• •••• ••••" />
            </div>
          </div>
          <div class="jj-step-actions">
            <Button label="Back" severity="secondary" @click="step = '1'" />
            <Button label="Continue" @click="step = '3'" />
          </div>
        </StepPanel>

        <StepPanel value="3">
          <h2>{{ copy.checkout.reviewHeading }}</h2>
          <ul class="jj-review-list">
            <li><strong>Name:</strong> {{ form.name || '—' }}</li>
            <li><strong>Address:</strong> {{ form.address || '—' }}</li>
            <li><strong>Region:</strong> {{ form.region || '—' }}</li>
            <li><strong>Shipping:</strong> {{ form.shippingMethod }}</li>
            <li><strong>Subtotal:</strong> {{ formatPrice(subtotalCents) }}</li>
          </ul>
          <div class="jj-step-actions">
            <Button label="Back" severity="secondary" @click="step = '2'" />
            <Button :label="copy.checkout.placeOrderCta" @click="confirmVisible = true" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>

    <Dialog v-model:visible="confirmVisible" modal :header="copy.checkout.confirmDialogTitle" class="jj-confirm-dialog">
      <p>{{ copy.checkout.confirmDialogBody }}</p>
      <template #footer>
        <Button label="Cancel" severity="secondary" text @click="confirmVisible = false" />
        <Button label="Confirm" @click="placeOrder" />
      </template>
    </Dialog>

    <Dialog v-model:visible="confirmedVisible" modal :header="copy.checkout.orderConfirmedTitle" class="jj-confirm-dialog">
      <p>{{ copy.checkout.orderConfirmedBody }}</p>
      <template #footer>
        <RouterLink to="/" custom v-slot="{ href, navigate }">
          <Button :href="href" @click="navigate(); confirmedVisible = false" as="a" label="Back to home" />
        </RouterLink>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { copy, formatPrice } from '../data/kit.js'
import { cartSubtotalCents, clearCart } from '../store/cart.js'

const subtotalCents = cartSubtotalCents

const step = ref('1')
const submitted = ref(false)
const confirmVisible = ref(false)
const confirmedVisible = ref(false)

const regions = ['Minnesota', 'California', 'New York', 'Texas', 'Other US', 'International']
const shippingMethods = ['Standard (5-7 days)', 'Express (2-3 days)']

const form = reactive({
  name: '',
  address: '',
  region: null,
  shippingMethod: shippingMethods[0],
  card: '',
})

function tryAdvance(next) {
  submitted.value = true
  if (!form.name || !form.address) return
  step.value = next
}

function placeOrder() {
  confirmVisible.value = false
  confirmedVisible.value = true
  clearCart()
}
</script>

<style scoped>
.jj-checkout {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-800) var(--space-600);
}
.jj-stepper {
  margin-top: var(--space-600);
}
.jj-form-grid {
  display: grid;
  gap: var(--space-400);
  margin: var(--space-400) 0;
}
.jj-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
}
.jj-field label,
.jj-field > span {
  font-weight: var(--font-weight-medium);
}
.jj-error {
  color: var(--color-danger);
}
.jj-radio-row {
  display: flex;
  align-items: center;
  gap: var(--space-200);
  margin-top: var(--space-100);
}
.jj-step-actions {
  display: flex;
  gap: var(--space-300);
  margin-top: var(--space-600);
}
.jj-review-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
}
</style>
