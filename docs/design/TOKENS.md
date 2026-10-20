# Design tokens

Source of truth: `site/styles/tokens.css`. Tailwind mapping:
`site/tailwind.config.ts`. Contrast test: `site/lib/design-tokens.test.ts`.
References: [REFERENCES.md](REFERENCES.md). Screenshots:
[screenshots/](screenshots/).

Figma was not available, so this pass was done in code. The tokens play the
role the Figma library would have (PROGRADE_DESIGN_WORKFLOW phases 3–4).

## How to use

Use semantic classes, never raw palette colours (`slate-500`, `blue-600`):

| Need | Class |
| --- | --- |
| Page background | `bg-canvas` (set on `body`) |
| Card / panel / input | `bg-surface` |
| Inset panel, table stripe | `bg-surface-subtle` |
| Pressed / track / neutral chip | `bg-surface-muted` |
| Primary text / headings | `text-fg` |
| Body copy in dense panels | `text-fg-secondary` |
| Captions, labels, meta | `text-fg-muted` |
| Disabled control text (WCAG-exempt) | `text-fg-disabled` |
| Input placeholder (set globally on `::placeholder`) | `text-fg-placeholder` / `placeholder:text-fg-placeholder` |
| Divider, card edge (decorative) | `border-line` |
| Input / control boundary (≥3:1) | `border-line-strong` |
| Primary button | `bg-accent hover:bg-accent-hover text-on-accent` |
| Disabled primary button | `disabled:bg-accent-disabled disabled:text-on-accent-disabled` (instead of `opacity-50`) |
| Link / accent text | `text-accent-fg` (hover `text-accent-strong`) |
| Selected chip / highlight | `bg-accent-subtle border-accent-line text-accent-strong` |
| Focus ring | `ring-focus` (or plain `ring`, which defaults to focus) |
| Status callout | `bg-{success,warn,danger}-subtle border-{…}-line text-{…}` |
| Feature band | `bg-inverse text-on-inverse` (+ `text-on-inverse-muted`, `text-on-inverse-accent`) |
| Chart series | `bg-chart-1` … `bg-chart-6` (≥3:1 on surface/canvas) |
| Issuer / network logo image | `logo-plate` (light plate in dark mode, no layout change) |

Opacity modifiers work (`bg-surface/90`, `border-accent/50`) because colours
are stored as `R G B` channels.

`fontSize`, `borderRadius` and `boxShadow` keep Tailwind's key names (`text-sm`,
`rounded-lg`, `shadow-md`) but read from the token variables. Existing classes
and `tailwind-merge` keep working, and a token change re-skins everything.
New semantic spacing aliases: `p-card`, `gap-stack`, `gap-inline`,
`space-y-section`.

### Type scale

| Key | Size / line | Use |
| --- | --- | --- |
| `text-xs` | 12 / 16 | captions, chips |
| `text-sm` | 14 / 20 | UI, table cells |
| `text-base` | 16 / 24 | body |
| `text-lg` | 18 / 28 | lead, card title |
| `text-xl` | 20 / 28 | section title |
| `text-2xl` | 24 / 32 | metric, mobile page title |
| `text-3xl` | 30 / 36 | page title |
| `text-4xl` | 36 / 40 | hero |

Values deliberately match the previous Tailwind defaults, so this pass changes
no layout. Changing the scale is now a one-file edit in `tokens.css`. The
system font stack is kept; see "Open decisions" for a webfont.

### Elevation

`shadow-sm` (1), `shadow` (2), `shadow-md` (3), `shadow-lg` (4). Light mode
uses slate-tinted, low-opacity shadows. Dark mode uses black at higher opacity,
and depth there comes mainly from the surface lightness steps
(canvas → surface → subtle → muted).

## Themes

- **Light** is the default (`:root`).
- **Dark** follows `prefers-color-scheme: dark` unless the user picked light.
- **Manual toggle** sits in the header (monitor/sun/moon icon) and cycles
  system → light → dark. The choice is stored in `localStorage["cci-theme"]`.
  Every storage access is in try/catch (`site/lib/theme.ts`). An inline head
  script applies it before first paint, so a manual choice never flashes the
  other theme.
- The dark palette is declared twice in `tokens.css` (media query and
  `[data-theme="dark"]`). The test asserts the two copies are identical.
- `color-scheme` is set per theme, so scrollbars and native controls follow.

## Contrast (WCAG 2.2)

Thresholds, checked against the W3C Understanding documents on 2026-10-20:

- **SC 1.4.3 Contrast (Minimum), AA:** text needs **4.5:1**. Large text
  (≥18pt / 24px, or ≥14pt / 18.66px bold) needs **3:1**. Thresholds are not
  rounded (4.499:1 fails). Text in inactive UI components, pure decoration and
  logotypes is exempt.
  <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html>
- **SC 1.4.11 Non-text Contrast, AA:** visual information needed to identify
  UI components and their states, and meaningful graphical objects, needs
  **3:1** against adjacent colours. Inactive components and decorative borders
  that are not needed to identify a control are exempt.
  <https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html>
- Relative luminance uses the sRGB linearisation threshold **0.04045**. The
  W3C notes the older 0.03928 makes no practical difference.

`lib/design-tokens.test.ts` computes the ratio for every pairing listed in
`PAIRS` (`lib/design-tokens.ts`), in both themes. It fails a body-text pair
below 4.5:1 and a large-text/UI pair below 3:1. The test is meant to be
extended: when a token goes on a new background, add the pair there.

**Placeholder text** is text, so SC 1.4.3 applies and `fg-placeholder` is held
to 4.5:1 on `surface` and `surface-subtle`. The W3C Understanding page for
1.4.3 says it "applies to text in the page, including placeholder text"
(checked 2026-10-20). The the global `::placeholder` rule pins
opacity to 1 because Firefox fades placeholders by default. **Disabled primary
buttons** are WCAG-exempt, but their label is still held to 4.5:1 on the
disabled fill, so they stay legible while reading as disabled.

**Exempt by design, so not in the test:** `fg-disabled` (inactive controls),
`line` (decorative dividers and card edges; controls use `line-strong`), and
the logos and white text on card art (`card-image.tsx`, issuer brand colours).

Result at commit time: **67 pairs × 2 themes = 134 checks, all pass.**
Tightest margins:

- Body text: light `fg-placeholder` on `surface-subtle` 4.58:1; dark `fg-placeholder` on
  `surface-subtle` 4.96:1.
- UI: light `line-strong` on `surface-subtle` 3.12:1; dark `line-strong` on `surface-subtle` 3.62:1.

Run `npx vitest run lib/design-tokens.test.ts --reporter=verbose` to see every
ratio.

<details>
<summary>Full table</summary>

| Foreground | Background | Kind | Min | Light | Dark |
| --- | --- | --- | --- | --- | --- |
| `fg` | `canvas` | body text | 4.5:1 | 17.23 | 16.16 |
| `fg` | `surface` | body text | 4.5:1 | 17.85 | 14.96 |
| `fg` | `surface-subtle` | body text | 4.5:1 | 16.49 | 13.90 |
| `fg` | `surface-muted` | body text | 4.5:1 | 15.18 | 11.96 |
| `fg-secondary` | `canvas` | body text | 4.5:1 | 9.99 | 12.22 |
| `fg-secondary` | `surface` | body text | 4.5:1 | 10.35 | 11.31 |
| `fg-secondary` | `surface-subtle` | body text | 4.5:1 | 9.56 | 10.51 |
| `fg-secondary` | `surface-muted` | body text | 4.5:1 | 8.81 | 9.04 |
| `fg-muted` | `canvas` | body text | 4.5:1 | 6.19 | 8.04 |
| `fg-muted` | `surface` | body text | 4.5:1 | 6.41 | 7.45 |
| `fg-muted` | `surface-subtle` | body text | 4.5:1 | 5.92 | 6.92 |
| `fg-muted` | `surface-muted` | body text | 4.5:1 | 5.45 | 5.95 |
| `accent-fg` | `canvas` | body text | 4.5:1 | 6.47 | 9.03 |
| `accent-fg` | `surface` | body text | 4.5:1 | 6.70 | 8.36 |
| `accent-fg` | `surface-subtle` | body text | 4.5:1 | 6.19 | 7.76 |
| `accent-fg` | `surface-muted` | body text | 4.5:1 | 5.70 | 6.68 |
| `on-accent` | `accent` | body text | 4.5:1 | 6.70 | 8.03 |
| `on-accent` | `accent-hover` | body text | 4.5:1 | 8.72 | 10.47 |
| `accent-fg` | `accent-subtle` | body text | 4.5:1 | 6.07 | 7.09 |
| `accent-strong` | `accent-subtle` | body text | 4.5:1 | 9.38 | 10.33 |
| `accent-strong` | `surface` | body text | 4.5:1 | 10.36 | 12.17 |
| `fg` | `accent-subtle` | body text | 4.5:1 | 16.17 | 12.70 |
| `fg-secondary` | `accent-subtle` | body text | 4.5:1 | 9.38 | 9.60 |
| `fg-muted` | `accent-subtle` | body text | 4.5:1 | 5.81 | 6.32 |
| `fg-placeholder` | `surface` | body text | 4.5:1 | 4.96 | 5.34 |
| `fg-placeholder` | `surface-subtle` | body text | 4.5:1 | 4.58 | 4.96 |
| `on-accent-disabled` | `accent-disabled` | body text | 4.5:1 | 5.20 | 5.09 |
| `on-inverse` | `inverse` | body text | 4.5:1 | 16.30 | 13.54 |
| `on-inverse-muted` | `inverse` | body text | 4.5:1 | 12.02 | 9.26 |
| `on-inverse-accent` | `inverse` | body text | 4.5:1 | 9.92 | 8.25 |
| `success` | `success-subtle` | body text | 4.5:1 | 5.21 | 9.42 |
| `success` | `surface` | body text | 4.5:1 | 5.48 | 10.68 |
| `success` | `surface-subtle` | body text | 4.5:1 | 5.07 | 9.92 |
| `fg` | `success-subtle` | body text | 4.5:1 | 16.95 | 13.19 |
| `fg-secondary` | `success-subtle` | body text | 4.5:1 | 9.83 | 9.97 |
| `warn` | `warn-subtle` | body text | 4.5:1 | 6.84 | 9.56 |
| `warn` | `surface` | body text | 4.5:1 | 7.09 | 10.84 |
| `warn` | `surface-subtle` | body text | 4.5:1 | 6.55 | 10.07 |
| `fg` | `warn-subtle` | body text | 4.5:1 | 17.22 | 13.20 |
| `fg-secondary` | `warn-subtle` | body text | 4.5:1 | 9.99 | 9.98 |
| `danger` | `danger-subtle` | body text | 4.5:1 | 5.72 | 7.56 |
| `danger` | `surface` | body text | 4.5:1 | 6.29 | 7.90 |
| `danger` | `surface-subtle` | body text | 4.5:1 | 5.81 | 7.34 |
| `fg` | `danger-subtle` | body text | 4.5:1 | 16.25 | 14.32 |
| `fg-secondary` | `danger-subtle` | body text | 4.5:1 | 9.43 | 10.83 |
| `line-strong` | `canvas` | large text / UI | 3:1 | 3.26 | 4.21 |
| `focus` | `canvas` | large text / UI | 3:1 | 4.99 | 8.03 |
| `accent` | `canvas` | large text / UI | 3:1 | 6.47 | 8.03 |
| `line-strong` | `surface` | large text / UI | 3:1 | 3.38 | 3.90 |
| `focus` | `surface` | large text / UI | 3:1 | 5.17 | 7.43 |
| `accent` | `surface` | large text / UI | 3:1 | 6.70 | 7.43 |
| `line-strong` | `surface-subtle` | large text / UI | 3:1 | 3.12 | 3.62 |
| `focus` | `surface-subtle` | large text / UI | 3:1 | 4.77 | 6.90 |
| `accent` | `surface-subtle` | large text / UI | 3:1 | 6.19 | 6.90 |
| `success` | `surface` | large text / UI | 3:1 | 5.48 | 10.68 |
| `chart-1` | `surface` | large text / UI | 3:1 | 5.17 | 7.43 |
| `chart-1` | `canvas` | large text / UI | 3:1 | 4.99 | 8.03 |
| `chart-2` | `surface` | large text / UI | 3:1 | 4.82 | 9.53 |
| `chart-2` | `canvas` | large text / UI | 3:1 | 4.65 | 10.29 |
| `chart-3` | `surface` | large text / UI | 3:1 | 5.02 | 9.52 |
| `chart-3` | `canvas` | large text / UI | 3:1 | 4.85 | 10.28 |
| `chart-4` | `surface` | large text / UI | 3:1 | 5.70 | 7.25 |
| `chart-4` | `canvas` | large text / UI | 3:1 | 5.50 | 7.83 |
| `chart-5` | `surface` | large text / UI | 3:1 | 6.29 | 7.90 |
| `chart-5` | `canvas` | large text / UI | 3:1 | 6.07 | 8.53 |
| `chart-6` | `surface` | large text / UI | 3:1 | 7.58 | 6.92 |
| `chart-6` | `canvas` | large text / UI | 3:1 | 7.31 | 7.47 |

</details>

## Mapping from the old classes (for reviewers)

| Old | New |
| --- | --- |
| `text-slate-900/800` | `text-fg` |
| `text-slate-700` | `text-fg-secondary` |
| `text-slate-600/500/400` | `text-fg-muted` (slate-400 failed 4.5:1 on white at 2.56:1) |
| `bg-white` / `bg-slate-50` / `bg-slate-100` | `bg-surface` / `bg-surface-subtle` / `bg-surface-muted` |
| `border-slate-100/200` / `border-slate-300/400` | `border-line` / `border-line-strong` |
| `brand-*` | `accent`, `accent-hover`, `accent-fg`, `accent-strong`, `accent-subtle`, `accent-line` |
| `amber-*` / `emerald-*` / `rose-*` | `warn-*` / `success-*` / `danger-*` |
| `bg-slate-900` + white text | `bg-inverse` + `text-on-inverse` |

The `brand` scale was removed from the Tailwind config. A leftover raw class
now produces no CSS instead of a silently mismatched colour.

## Open decisions

- **Dark-mode warn tint:** the "How we rank" band uses `warn-subtle` and reads
  quite brown in dark mode. This is a matter of taste; it passes contrast, so
  it was left alone. To warm it, change `--color-warn-subtle` and
  `--color-warn-line` in the dark blocks.

- **Webfont:** the system stack is kept, which means no network fetch at build
  and no layout shift. Inter or IBM Plex Sans through `next/font` would give
  consistent tabular figures across operating systems. To adopt one, change
  `--font-sans`.
- **Light canvas:** the page background moved from pure white to
  `rgb(250 251 252)` so white cards read as raised. Revert by setting
  `--color-canvas` to `255 255 255`.
- **Muted text:** `slate-500` and `slate-600` were merged into one
  `fg-muted`, giving a three-step text hierarchy. Split it again if a page
  needs four steps.
