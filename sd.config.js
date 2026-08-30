// Janes Jeans / PrimeVue v4 — token pipeline. Same mechanics as sorb-demo's
// sd.config.js, pointed at the stack-neutral @metatoy/janes-jeans kit instead
// of an in-repo token tree. No PrimeVue-specific SD format exists yet (per
// spec/sorb/demo-repo-skeleton.md §2.3's per-target format table, PrimeVue's
// is "P4 ① — does not exist"); this repo builds that mapping at the PRESET
// layer instead (src/jjPreset.js maps PrimeVue semantic/component tokens to
// var(--<kebab-id>) refs against the generic css/variables output below) —
// see CLAUDE.md's migration recipe for why that's the right seam.
import StyleDictionary from 'style-dictionary'
import {
  SORB_RESOLVED,
  SORB_TOKENSET,
  SORB_VERSIONS,
  SORB_SET_META,
  sorbResolved,
  sorbTokenSet,
  sorbVersions,
  sorbSetMeta,
  SORB_PRIMEVUE_PRESET,
  sorbPrimevuePreset,
} from '@sorb/seed'

StyleDictionary.registerParser(sorbSetMeta)
StyleDictionary.registerFormat({ name: SORB_RESOLVED, format: sorbResolved })
StyleDictionary.registerFormat({ name: SORB_TOKENSET, format: sorbTokenSet })
StyleDictionary.registerFormat({ name: SORB_VERSIONS, format: sorbVersions })
// `sorb/primevue-preset` — PROMOTED to @sorb/seed 0.4.0 (T4). Generates the
// definePreset module that used to be hand-authored at src/jjPreset.js (T8
// retrofit — see sorb-seed/src/emit/sorbPrimevue.js for the format itself).
// Identity roleMap (this kit's ids ARE the role ids) + default basePreset
// 'Aura' reproduce jjPreset.js's structure exactly — see CLAUDE.md's
// migration recipe table for the literal mapping this format encodes.
StyleDictionary.registerFormat({ name: SORB_PRIMEVUE_PRESET, format: sorbPrimevuePreset })

const KIT = 'node_modules/@metatoy/janes-jeans/tokens'

/** @type {import('style-dictionary').Config} */
export default {
  // Three DTCG tiers from the kit, merged into one tree (refs resolve across
  // all three). Swap semantic.json → variants/acid-wash.json to build the
  // second committed theme (see tokens/variants/README.md in the kit).
  source: [`${KIT}/primitive.json`, `${KIT}/semantic.json`, `${KIT}/component.json`],
  parsers: [SORB_SET_META],
  platforms: {
    // CSS custom properties the preset + app read: --color-brand,
    // --button-primary-bg-default, etc.
    css: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'variables.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    // Flat TokenSet for @sorb/leaf's sorbInit (the committed token set).
    js: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'tokens.js', format: SORB_TOKENSET }],
    },
    // The Sorb resolved bindable map — { id, cssVar, value, tier, type }.
    sorb: {
      transformGroup: 'css',
      buildPath: '.sorb/',
      files: [
        { destination: 'resolved.json', format: SORB_RESOLVED },
        { destination: 'versions.json', format: SORB_VERSIONS },
      ],
    },
    // Generated PrimeVue definePreset module — replaces the hand-authored
    // src/jjPreset.js (see main.js's import + CLAUDE.md migration recipe).
    primevue: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'jjPreset.generated.js', format: SORB_PRIMEVUE_PRESET }],
    },
  },
}
