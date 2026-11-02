# Design instructions

Written 2026-11-01 (standards plan, Task 8). The visual system of the site: what it is made of, and which numbers are fixed. Behaviour, flows and accessibility are in `docs/UI_UX_STANDARDS.md`; colour rationale and contrast pairs are in `docs/design/TOKENS.md`. Rule IDs are `DI-n`.

**Scope.** These rules apply to new and changed UI. They do not licence a redesign: the palette, dark mode, accent and the existing semantic Tailwind names are fixed. This is a consumer tool for comparing credit cards in India; a user scans rupee amounts and fee lines, mostly on a phone, and has to trust what they read.

**Enforcement key.** `test` = Vitest (`site/lib/design-tokens.test.ts`, `site/lib/design-standards.test.ts`). `lint` = `npm run lint`. `measure` = numbers taken in a real browser (rule DI-22). `Q` = a reviewer question.

## Summary

| ID | Rule | Enforcement |
|---|---|---|
| DI-1 | Colour comes only from the semantic Tailwind names (`bg-surface`, `text-fg-muted`, `border-line`). No raw hex, no palette names (`slate-500`). | Q; `test` (every token exists) |
| DI-2 | Every text and background pair is held to WCAG 2.2 AA (4.5:1 text, 3:1 non-text). Change a token only with the contrast test green. | `test` (design-tokens) |
| DI-3 | Light and dark palettes define the same tokens, and the media-query and manual dark blocks stay identical. | `test` |
| DI-4 | Colour is never the only signal: a status colour also carries a word or icon. | Q |
| DI-5 | The sans face is Inter, self-hosted by `next/font`, with `display: "swap"`, variable weight, assigned to `--font-sans` with the system stack as fallback. | `test` (layout) |
| DI-6 | Inter is loaded for `latin` and `latin-ext`. The rupee sign U+20B9 is only in latin-ext; dropping it makes every rupee amount fall back to another font. | `test`; `measure` |
| DI-7 | Type sizes come from the scale (`text-xs` to `text-4xl`). No new arbitrary pixel sizes; existing `text-[10px]`-style sizes are not copied. | Q |
| DI-8 | Body text is 16 px; table cells and controls 14 px; captions 12 px. Never below 12 px for anything a user must read. | Q; `measure` |
| DI-9 | One page width: `--container-page` (72rem), used as `max-w-page`. Header, banner, main and footer share it. | `test`; `measure` |
| DI-10 | Long prose uses `--container-prose` (65ch), as `max-w-prose`. | `test`; Q |
| DI-11 | One letter-spacing per label role: `tracking-label` (0.025em) for uppercase micro-labels and row heads, `tracking-heading` (-0.025em) for headings and the brand. No other tracking on UI text. | `test` (tokens); `measure` |
| DI-12 | Numbers compared in a column use `.num` (tabular figures) and are right-aligned. | `test` (`.num`); Q |
| DI-13 | A single hero number read on its own uses `.num-prop` (proportional figures) or nothing. Never tabular for display sizes. | `test` (`.num-prop`); Q |
| DI-14 | Rupee amounts go through `formatInr` / `formatFeeInr`; never hand-built strings with `Rs` or `INR`. | Q |
| DI-15 | The page reserves the scrollbar track: `html { scrollbar-gutter: stable }`. The left edge does not move between short and long pages. | `test`; `measure` |
| DI-16 | Spacing sits on the 4 px grid and uses the semantic aliases (`gap-inline`, `gap-stack`, `p-card`, `space-section`) where one fits. | Q |
| DI-17 | Radius and elevation come from the token scales; a card uses one elevation only. | Q |
| DI-18 | Row height in dense tables and lists is 34 px on desktop and 44 px on touch. A table keeps one row height. | `measure`; Q |
| DI-19 | Issuer and network logos sit on `.logo-plate` in dark mode; logos are never recoloured. | Q |
| DI-20 | Motion is 200 ms or less, fades and small translates only, and is switched off under `prefers-reduced-motion`. | Q |
| DI-21 | Icons are Phosphor, through the one barrel file (`components/icons`, imported from `@phosphor-icons/react/dist/ssr`, v2.1.10). A label always comes first; an icon supports it. No decorative emoji. | ESLint ban + `components/no-emoji.test.tsx` |
| DI-22 | Before a UI change is called done, measure it in a browser at 1280, 1920 and 390 and report the numbers (left edge, width, column x positions, computed font and tracking). | Review; PR template |

## Rules, with reason

**DI-1 to DI-4, colour.** The palette is the product's trust cue: calm, low-chroma, one accent. Semantic names let dark mode switch in CSS only, so components never need `dark:`. The contrast pairs are in `site/lib/design-tokens.ts`; add a pair there when you add a token. Reason: a fee printed in grey at 3:1 is a fee a user misreads.

**DI-5 and DI-6, Inter and the rupee sign.** Inter has tall, open numerals that stay legible at 12 to 14 px, the size most fee lines are read at. The rupee sign is not in the `latin` subset Google serves (U+0000 to U+00FF plus a few punctuation marks); it is in `latin-ext` (U+20AD to U+20C4). Both subsets are listed in `app/layout.tsx`, and the browser fetches each file by `unicode-range`. Measured 2026-11-01: Chrome's `CSS.getPlatformFontsForNode` reports 21 of 21 glyphs of `₹12,345 Rs 0123456789` drawn by Inter. `next/font/google` downloads the files at build time and serves them from our own origin; there is no request to Google at runtime. Inter is licensed under the SIL Open Font License 1.1.

**DI-7 and DI-8, type.** The scale is the modular one in `tokens.css` (12, 14, 16, 18, 20, 24, 30, 36 px). Existing `text-[10px]` and `text-[11px]` micro-labels are tolerated, not extended.

**DI-9 and DI-10, containers.** One width means every page lines up with the header. `--container-page` replaces the scattered `max-w-6xl`. `--container-prose` is the reading measure for long text; short intro lines under a page title keep `max-w-2xl`, and the About page keeps its current `max-w-2xl` until a design decision moves it to 65ch.

**DI-11, tracking.** Before this change the site used four Tailwind tracking classes: `tight` (-0.025em, the brand and headings), `wide` (0.025em, most label sites), `wider` (0.05em, one calculator label and two card-art captions) and `widest` (0.1em, the printed number on a card image). The first two became the roles `tracking-heading` and `tracking-label` with identical values, so nothing moved. `wider` and `widest` are left alone: folding them would change what users see, so they wait for a design decision.

**DI-12 and DI-13, numerals.** Tabular figures give every digit the same width, so a column of fees lines up by place value. Proportional figures look better for a single large number. `.prose-card-value` already sets tabular figures.

**DI-15, scrollbar.** Without the gutter, a page that grows past the viewport shifts everything left by the scrollbar width (about 15 px on Windows). With it, the container's left edge is identical on every page. Overlay scrollbars (phones, macOS default) reserve nothing, so there is no cost there.

**DI-18, row height.** 34 px desktop and 44 px touch are the targets for new rows and any row you touch. The compare table's `p-3` cells are taller than 34 px and are not rewritten here.

## Where the numbers live

| Thing | File |
|---|---|
| Themed tokens (colour channels `--rgb-*`, spacing aliases, elevation) | `site/styles/tokens.css` |
| Literal tokens (type scale, radius, container, tracking, fonts) and the Tailwind 4 mapping of every token (`@theme`; replaces `tailwind.config.ts`) | `site/styles/theme.css` |
| `.num`, `.num-prop`, `html` rules, components | `site/styles/globals.css` |
| Font loading | `site/app/layout.tsx` |
| Contrast pairs and tests | `site/lib/design-tokens.ts`, `site/lib/design-tokens.test.ts`, `site/lib/design-standards.test.ts` |
