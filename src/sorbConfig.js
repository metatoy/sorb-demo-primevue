// P4a spike — non-React sorbConfig, same SorbConfig contract as sorb-demo's
// (React) src/sorbConfig.js, minus the Vite env-driven hosted-bridge fields
// (this spike only proves the local `sorb dev` bridge path per the skeleton's
// §2.4 note: "adapt the shape, not the literal import.meta.env syntax" — but
// for a one-page local spike there is no hosted deploy to drive that from).
//
// `tokens` here is the COMMITTED set sorbInit applies on load — same six
// vars as variables.css, expressed as a flat map (sorbInit's expected shape).
// GOTCHA (leaf 0.3.0, applies to SorbProvider too): token keys here — and in
// any preview body POSTed/PUT to the bridge — are BARE ids, no leading `--`.
// `applyTokens` (sorb-leaf/src/apply.js) does `root.style.setProperty(`--${key}`, ...)`
// itself; a key already carrying `--` becomes a literal `----jj-brand` custom
// property that never matches anything your CSS reads. Same bare-id
// convention `expectPrefixes` matches against (see previewVocab.js).
export const sorbConfig = {
  namespace: 'jj-primevue',
  tokens: {
    'jj-brand': '#2f6f4f',
    'jj-brand-hover': '#285f43',
    'jj-brand-active': '#224f38',
    'jj-surface': '#f5f2ec',
    'jj-surface-alt': '#ece7dd',
    'jj-radius': '6px',
  },
  preview: {
    enabled: true,
    origin: 'http://localhost:7784',
    pollInterval: 1000,
    // Vocabulary guard: this store only re-themes from jj-* custom
    // properties — a preview push with no jj-* keys should light the
    // mismatch flag rather than silently no-op.
    expectPrefixes: ['jj-'],
  },
}
