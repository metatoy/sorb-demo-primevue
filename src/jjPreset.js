// Janes Jeans PrimeVue v4 preset — P4a spike.
//
// THE MECHANISM (this is the thing P4a exists to prove): PrimeVue v4's
// `definePreset` token tree accepts a plain string as a leaf value. When that
// string is NOT one of PrimeVue's own `{a.b.c}` token references, PrimeVue's
// CSS generator writes it out verbatim as the value of the corresponding
// `--p-*` custom property — it does not parse/validate/color-math a literal
// string. That means a `var(--jj-brand)` string placed here becomes:
//
//   --p-primary-color: var(--jj-brand);
//
// in the generated stylesheet. Any component CSS that reads `var(--p-primary-color)`
// (e.g. Button's filled/primary background) therefore transitively reads
// `--jj-brand` — and a `<style>` override of `--jj-brand` written to
// `document.documentElement` by `sorbInit`'s preview injector re-themes the
// button with ZERO PrimeVue-side JS, zero re-render, because both `--p-*` and
// `--jj-*` are just CSS custom property indirection, resolved by the browser
// at paint time.
//
// This is "preset var() token values" (not "the CSS-var layer") — confirmed
// empirically by the Playwright swap in scripts/verify-live-swap.mjs.
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const JJPreset = definePreset(Aura, {
  semantic: {
    primary: {
      color: 'var(--jj-brand)',
      hoverColor: 'var(--jj-brand-hover)',
      activeColor: 'var(--jj-brand-active)',
      contrastColor: '#ffffff',
    },
    formField: {
      borderRadius: 'var(--jj-radius)',
    },
    colorScheme: {
      light: {
        surface: {
          50: 'var(--jj-surface)',
          100: 'var(--jj-surface)',
          200: 'var(--jj-surface-alt)',
        },
      },
    },
  },
})
