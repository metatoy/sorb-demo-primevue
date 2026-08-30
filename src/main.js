// P4 boot module — the non-React provider-mount pattern from
// spec/sorb/demo-repo-skeleton.md §2.5: a plain sorbInit() call, no
// SorbProvider/JSX, no React in the bundle.
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { sorbInit } from '@sorb/leaf/core'
import App from './App.vue'
import { router } from './router.js'
import { preset as JJPreset } from './tokens/generated/jjPreset.generated.js'
import { sorbConfig } from './sorbConfig.js'
import 'primeicons/primeicons.css'
import './tokens/generated/variables.css'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: JJPreset,
    options: { darkModeSelector: false },
  },
})
app.use(ToastService)
app.mount('#app')

// Framework-agnostic: sorbInit resolves the bridge, applies committed tokens
// immediately, and polls/subscribes for a live preview push. It writes
// straight to document.documentElement — Vue's reactivity system is never in
// the loop, which is the whole point of proving this outside React.
const sorb = sorbInit(sorbConfig)

// Expose the instance for the Playwright verification script + manual
// console poking (window.__sorb.getState()).
window.__sorb = sorb

sorb.subscribe((state) => {
  // eslint-disable-next-line no-console
  console.log('[jj-primevue] sorb state', {
    isPreview: state.isPreview,
    previewId: state.previewId,
    previewMismatch: state.previewMismatch,
  })
})
