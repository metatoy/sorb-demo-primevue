// Janes Jeans PrimeVue v4 preset — PRE-SORB (legacy) state.
//
// This is the storefront BEFORE Sorb: someone hand-picked the Janes Jeans
// brand colors and baked them into the PrimeVue preset as literal hex/px
// values. It looks identical to the migrated build at rest — that's the
// point of the migration narrative — but NONE of these values are
// swappable at runtime. A Sorb preview push has nothing to grab onto here;
// re-theming this branch would require editing this file and rebuilding.
//
// See the `sorb-migrated` tag / main branch's src/jjPreset.js for the
// post-migration version (every literal below replaced with a
// `var(--kebab-token-id)` reference into the kit's generated CSS vars) and
// CLAUDE.md's "Migration recipe" table for the literal → token mapping.
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const JJPreset = definePreset(Aura, {
  semantic: {
    primary: {
      color: '#24345C', // denim-700
      hoverColor: '#182440', // denim-800
      activeColor: '#182440',
      contrastColor: '#FFFFFF',
    },
    text: {
      color: '#182440', // denim-800
      hoverColor: '#182440',
      mutedColor: '#6E5D45', // warm-600
      hoverMutedColor: '#6E5D45',
    },
    content: {
      background: '#FFFFFF',
      hoverBackground: '#F2EDE3', // warm-100
      borderColor: '#E5DBCB', // warm-200
      color: '#182440',
      hoverColor: '#182440',
      borderRadius: '8px', // radius.lg, hand-copied
    },
    formField: {
      background: '#FFFFFF',
      disabledBackground: '#F2EDE3',
      filledBackground: '#FFFFFF',
      filledHoverBackground: '#FFFFFF',
      filledFocusBackground: '#FFFFFF',
      borderColor: '#D2C3A8', // warm-300
      hoverBorderColor: '#D2C3A8',
      focusBorderColor: '#E8632B', // stitch-500, hand-picked focus color
      invalidBorderColor: '#C23B2E', // red-500
      color: '#182440',
      disabledColor: '#6E5D45',
      placeholderColor: '#6E5D45',
      invalidPlaceholderColor: '#6E5D45',
      borderRadius: '4px', // radius.md, hand-copied
    },
    navigation: {
      item: {
        activeColor: '#E8632B', // stitch-500
        focusColor: '#E8632B',
      },
    },
    overlay: {
      select: { background: '#FFFFFF', borderColor: '#E5DBCB', color: '#182440' },
      popover: { background: '#FFFFFF', borderColor: '#E5DBCB', color: '#182440' },
      modal: { background: '#FFFFFF', borderColor: '#E5DBCB', color: '#182440' },
    },
    colorScheme: {
      light: {
        surface: {
          50: '#F2EDE3',
          100: '#F2EDE3',
          200: '#E5DBCB',
          300: '#D2C3A8',
        },
      },
    },
  },
  components: {
    // The brand-colored top bar — hardcoded to the same denim navy someone
    // eyeballed from the brand deck, independently of the `primary` tokens
    // above (which is exactly the kind of drift-risk duplication Sorb's
    // single-source token pipeline is meant to eliminate).
    menubar: {
      colorScheme: {
        light: {
          root: { background: '#24345C', borderColor: '#24345C', color: '#FFFFFF' },
          item: {
            color: '#FFFFFF',
            focusColor: '#E8632B',
            activeColor: '#E8632B',
            icon: { color: '#96A9D6', focusColor: '#E8632B', activeColor: '#E8632B' }, // denim-300
          },
        },
      },
    },
    // Toast severities — literal hex copy-pasted from a design mockup.
    toast: {
      colorScheme: {
        light: {
          success: { background: '#3E8E4F', color: '#FFFFFF', borderColor: '#3E8E4F' },
          error: { background: '#C23B2E', color: '#FFFFFF', borderColor: '#C23B2E' },
          info: { background: '#24345C', color: '#FFFFFF', borderColor: '#24345C' },
        },
      },
    },
  },
})
