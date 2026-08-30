# CLAUDE.md — sorb-demo-primevue

`sorb-demo-primevue` — Janes Jeans on PrimeVue v4, a Sorb multi-stack demo storefront spike (P4a).

## Status: P4a spike, GO

One page (`src/App.vue`), a `sorbInit`-driven boot module (`src/main.js`, no
`SorbProvider`/React), and a PrimeVue Aura preset customization
(`src/jjPreset.js`) that maps semantic tokens to `var(--jj-*)` custom
properties. `scripts/verify-live-swap.mjs` proves a token pushed through the
`sorb-juice` bridge reaches the rendered PrimeVue `Button`'s computed
background — see `screenshots/before.png` / `after.png`.

This is a **spike**, not the full skeleton build (no janes-jeans kit, no
Style Dictionary pipeline, no Storybook, no capture/adapt, no Docker). It is
the seed for a future full `sorb-demo-primevue` build per
`spec/sorb/demo-repo-skeleton.md`.

## Hard rules (mirrors the studio-wide rule for this repo)

- **JavaScript only — never TypeScript.**
- **Standalone `npm install`** — this dir matches the umbrella
  `pnpm-workspace.yaml` `sorb-*` glob but is deliberately NOT part of it;
  `npm install` ignores `pnpm-workspace.yaml`. Never run `pnpm` here.
- Don't commit `node_modules/`, `dist/`, `.sorb/`.
- **Commit/push only when asked.**

## Run it

```
npm install
npx sorb dev --port 7784   # bridge, terminal 1
npx vite                    # app, terminal 2 (http://127.0.0.1:5173)
npm run verify              # Playwright live-swap proof, terminal 3
```
