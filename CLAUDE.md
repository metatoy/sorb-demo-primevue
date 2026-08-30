# CLAUDE.md — sorb-demo-primevue

`sorb-demo-primevue` — Janes Jeans on PrimeVue v4, a Sorb multi-stack demo storefront (P4).

## Status: P4 full build, live-swap GO

Full six-route storefront (`/`, `/shop`, `/product/:id`, `/cart`, `/checkout`,
`/account`) on real PrimeVue v4 widgets, themed entirely through
`@metatoy/janes-jeans` kit tokens via `sorbInit` (`@sorb/leaf/core` — no
React). `scripts/verify-live-swap.mjs` pushes the kit's second committed
theme ("Acid Wash") through the local `sorb dev` bridge and confirms it
re-themes the running storefront's Button/Card backgrounds on both `/` and
`/product/:id`, via computed style — see `screenshots/live-swap/*.png`.

**Honest scope note:** this build was written directly against the kit-token
pipeline (jjPreset.js → `var(--kebab-token-id)` → `src/tokens/generated/`)
rather than staged as two genuine commits (hardcoded Aura defaults, tag
`pre-sorb`; then migrated, tag `sorb-migrated`). No `pre-sorb` tag exists in
this repo's history. The **mapping table below is the real migration
recipe** — the literal PrimeVue-default → JJ-token-id mapping this build
required — produced as documentation instead of via a git diff. If the
literal two-phase evidence (an actual hardcoded snapshot + before/after
diff) is needed for the marketing artifact, that's a follow-up pass, not
done here.

## Migration recipe — PrimeVue v4 Aura → Janes Jeans tokens

No `SORB_PRIMEVUE` Style Dictionary format exists (per
`spec/sorb/demo-repo-skeleton.md` §2.3 — PrimeVue's is listed "P4 ① — does
not exist"). The mapping lives at the **preset layer** (`src/jjPreset.js`),
not in a new SD emit format — a `definePreset` leaf value that is a literal
string (not one of PrimeVue's own `{a.b.c}` refs) is written verbatim as the
matching `--p-*` custom property's value, so `var(--card-bg)` makes
`--p-content-background` a pure indirection onto the kit's own CSS var.

Two tiers, cascading order matters — semantic first (free reach into most
components), component second (the few things PrimeVue reads straight off
its primitive palette):

| PrimeVue Aura default (literal/primitive-derived) | Overridden to (JJ kit token → cssVar) | Cascades to |
|---|---|---|
| `semantic.primary.color` = `light-dark({primary.500},{primary.400})` | `var(--button-primary-bg-default)` | Button (filled), Checkbox/RadioButton checked state, focus rings |
| `semantic.primary.hoverColor` / `.activeColor` | `var(--button-primary-bg-hover)` (both — kit has no separate active shade) | same |
| `semantic.primary.contrastColor` | `var(--button-primary-fg-default)` | Button label color |
| `semantic.text.color` / `.hoverColor` | `var(--color-ink)` | body text, Card/Menubar item text, DataTable cells |
| `semantic.text.mutedColor` / `.hoverMutedColor` | `var(--color-ink-muted)` | subtitles, help text, disabled-ish copy |
| `semantic.content.background` | `var(--card-bg)` | Card, Panel, Accordion panel, Tabs panel |
| `semantic.content.hoverBackground` | `var(--color-surface-raised)` | hover states on the above |
| `semantic.content.borderColor` | `var(--card-border)` | Card/Panel/Toast borders |
| `semantic.content.borderRadius` | `var(--card-radius)` | Card/Panel/Toast/Menubar corner radius |
| `semantic.formField.background/border/color/placeholder/…` | `var(--input-bg-default)` / `var(--input-border-default)` / `var(--input-fg)` / `var(--input-placeholder)` (+ hover/focus/invalid/disabled variants) | InputText, InputNumber, Select, Checkbox/RadioButton box, Textarea |
| `semantic.formField.borderRadius` | `var(--input-radius)` | same |
| `semantic.navigation.item.activeColor/.focusColor` | `var(--nav-link-active)` | active submenu/tab item state |
| `semantic.overlay.select/.popover/.modal.background/.borderColor/.color` | `var(--card-bg)` / `var(--card-border)` / `var(--color-ink)` | Select dropdown, Dialog/ConfirmDialog chrome |
| `semantic.colorScheme.light.surface.{50,100,200,300}` | `var(--color-surface-raised)` / `var(--color-surface-sunken)` / `var(--color-border)` | Button "secondary" severity, Tag "secondary", Chip |
| **Component:** `components.menubar.*.background/color` (Aura default: `{content.background}` — would have made the top bar white, not brand-colored) | `var(--nav-bg)` / `var(--nav-fg)` / `var(--nav-fg-muted)` / `var(--nav-link-active)` | Menubar root + items only — the ONE brand-saturated surface, deliberately NOT following the content/surface story used everywhere else |
| **Component:** `components.toast.{success,error,info}.background` (Aura default: `color-mix(in srgb, {green.50}, transparent 5%)` — primitive-derived, no semantic seam) | `var(--toast-bg-success)` / `var(--toast-bg-danger)` / `var(--toast-bg-info)` + `var(--toast-fg)` | Toast severity variants (no kit "warn" token — never triggered in this storefront) |
| Product badges ("new wash" / "sale" / bestseller ribbon) | **NOT a preset override** — bound per-instance via `[data-badge]` CSS attribute selector reading `var(--badge-bg-{default,new,sale})` directly | `ProductCard.vue`, `ProductView.vue` — badge variant is DATA-driven (`products.json`'s `badge` field), not a global theme concern, so it doesn't belong in the preset |

**One documented non-cascade (working as designed, not a gap):** the kit's
"Acid Wash" variant (`tokens/variants/acid-wash.json`) overlays the SEMANTIC
tier only. `badge.bg.new` / `badge.bg.sale` reference PRIMITIVE
`stitch`/`red` scales directly (not semantic colors), so a live Acid Wash
push does **not** recolor "new wash" ribbons — only `badge.bg.default`
(bestseller ribbon, which references semantic `color.accent`) does. This
matches `tokens/variants/README.md`'s stated contract; `verify-live-swap.mjs`
asserts the badge stays constant so this doesn't read as a bug in CI.

## Live-preview gotchas (carried from the P4a spike report — still true here)

1. **Token keys are bare ids, no leading `--`.** `applyTokens`
   (`sorb-leaf/src/apply.js`) prepends `--` itself.
2. **No auto-broadcast to an already-open tab.** `sorbInit` reads
   `?preview=<id>` from `location.search` ONCE at boot. Mint the preview
   FIRST (`POST /preview`), then load/reload the app at
   `<appUrl>/?preview=<id>` — only then does the poll pick up further
   `PUT /preview/:id` updates live.

## Hard rules (mirrors the studio-wide rule for this repo)

- **JavaScript only — never TypeScript.**
- **Standalone `npm install`** — this dir matches the umbrella
  `pnpm-workspace.yaml` `sorb-*` glob but is deliberately NOT part of it.
  Never run `pnpm` here.
- `@metatoy/janes-jeans` is a `file:../sorb-demo-kit` dependency in dev; swap
  to a pinned registry semver before any deploy (Dockerfile drops
  lockfiles + installs from the registry — a `file:` dep breaks that build).
- Don't commit `node_modules/`, `dist/`, `.sorb/`, `src/tokens/generated/`.
- **Commit/push only when asked.**

## Run it

```
npm install
npm run tokens               # kit tokens -> src/tokens/generated/ + .sorb/resolved.json
npx sorb dev --port 7784     # bridge, terminal 1
npx vite                     # app, terminal 2 (http://127.0.0.1:5173)
node scripts/smoke-routes.mjs      # fast render/console-error gate, all 6 routes
node scripts/verify-live-swap.mjs  # Acid Wash live-swap proof, home + PDP
```
