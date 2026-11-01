# UI and UX standards

Written 2026-11-01 (standards plan, Task 8). Behaviour and interaction rules for every screen, fitted to this product: people scanning rupee amounts, dense comparison tables, phones first, and a need to trust what they read. The visual system is in `docs/DESIGN_INSTRUCTIONS.md`; accessibility mechanics from Task 7 are folded in here. Rule IDs are `UX-n`.

**Baseline.** WCAG 2.2 level AA (W3C Recommendation; WCAG 3.0 is still a draft and is not a target). These rules apply to new and changed UI, not to rewrites of working screens.

**Enforcement key.** `test` = Vitest. `axe:<rule>` = `npm run a11y` (`site/scripts/a11y-smoke.mjs`, report-only). `lint` = `npm run lint`. `measure` = browser numbers (UX-24). `Q` = a reviewer question. Automated checks catch only part of accessibility problems, so most rules keep a question.

## Summary

| ID | Rule | Enforcement |
|---|---|---|
| UX-1 | Amounts first. The figure a user came for (fee, reward rate, net value) is the most prominent element in its block; its label sits next to it. | Q |
| UX-2 | Labels first, icons second. Every icon has a text label or an accessible name. No decorative emoji. | Q; ESLint ban + `components/no-emoji.test.tsx` |
| UX-3 | Every number shows its unit and period: `₹1,000 / year`, `5%`, `per month`. | Q |
| UX-4 | Provenance is visible: a value links to its issuer source, shows its verification date, and marks estimates (`Est.`). The beta notice stays on every page. | Q |
| UX-5 | Rankings and calculator results say what they assume, in one line, and say they do not depend on commissions. | Q |
| UX-6 | Numbers compared across cards or rows use `.num` and are right-aligned in their column. | `test`; Q |
| UX-7 | Dense tables: 34 px rows on desktop, 44 px on touch; one row height per table; the row-head column is sticky on narrow screens. | `measure`; Q |
| UX-8 | A wide table sits in a region that scrolls sideways, is keyboard-focusable, and is named. The page itself never scrolls sideways. | `test` (focusable table); `axe:scrollable-region-focusable`; smoke `overflowX` |
| UX-9 | Long lists are paged (`/browse`: 24 per page, "N of total", state in the URL). | `test` (paginate, pager, card-table); `measure` |
| UX-10 | Filters are shareable: the URL carries them, and Back restores them. | Q |
| UX-11 | Mobile first: design at 390 px, then widen. Touch targets 44 px for primary controls, never under 24 px. | `axe:target-size`; smoke `targets` |
| UX-12 | One `<main id="main">`; header, nav and footer sit outside it; a skip link is the first focusable element and lands in it. | `test` (skip link); `axe:landmark-one-main` |
| UX-13 | Every route has its own `<title>`; one `h1` per page; heading levels do not skip. | `axe:document-title`, `page-has-heading-one`, `heading-order` |
| UX-14 | The current page is marked `aria-current="page"` in the nav, exactly once. | `test` (nav) |
| UX-15 | Focus is always visible. No `outline-none` without a full-strength `focus-visible` ring. | Q |
| UX-16 | Every field has a visible `<label>`; option groups sit in `fieldset` with `legend`. | `axe:label`, `select-name` |
| UX-17 | Field errors appear in text next to the field, linked by `aria-describedby`; never only in a toast; never only red. | Q |
| UX-18 | A control's accessible name contains its visible label and, in a list, says which row it acts on. | `axe:button-name`, `link-name`, `label-content-name-mismatch` |
| UX-19 | A link that opens a new tab says so (visually or in its name) and has `rel="noopener noreferrer"`. | Q |
| UX-20 | Every route has an error state and a loading state. A loading state keeps the page layout so nothing jumps. | `test` (error, loading) |
| UX-21 | Interactive controls are never nested (`<a><button>`). | smoke `nested`; `axe:nested-interactive` |
| UX-22 | Theme: light, dark and system; the choice persists and applies before first paint. Both themes pass contrast. | `test` (tokens) |
| UX-23 | Motion is short, never carries meaning alone, and stops under `prefers-reduced-motion`. | Q |
| UX-24 | Before a UI change is called done, measure it at 1280, 1920 and 390: left edge, container width, column x positions, computed font size and tracking. Report the numbers in the PR. | Review; PR template |
| UX-25 | Empty and zero states say why and offer one next step ("No cards match. Clear filters."). | Q |

## Rules, with reason

**UX-1 to UX-5, scanning and trust.** The job is "which card costs me less or pays me more". The amount must win the visual hierarchy, and every amount must be checkable. A value without a source, a date or an `Est.` mark invites the wrong decision. The footer holds a standing line that rankings do not depend on commissions; keep the wording true if affiliate links are added.

**UX-6 and UX-7, columns.** Tabular figures plus right alignment make a column comparable at a glance. Row height is a measured number, not a feel: 34 px on desktop fits about 25 rows in a 900 px viewport; 44 px on touch meets the touch-target guideline. Existing tables using `p-3` are taller; adjust them when you next touch them.

**UX-8 and UX-9, size.** The compare table is wider than a phone. It scrolls inside its own region, which therefore needs a name and keyboard focus. A grid of all 346 active cards is slow and hard to scan, so lists are paged.

**UX-11 to UX-14, structure.** These are the Task 7 basics: skip link, one main, a title per route, one `h1`, `aria-current`.

**UX-15 to UX-21, forms, focus and states.** The calculator and recommender inputs are the only forms and the most-used part of the site, so labels, errors and names matter more there than anywhere. A new-tab link without notice disorients keyboard and screen-reader users.

**UX-24, measure before done.** "Looks aligned" hides drift of a few pixels. Use Playwright (a dev dependency in `site/`) against `npm run build && npx next start`, and report: left edge and width of `main`, x of each table column, `getComputedStyle` font size, family and letter-spacing of label elements, and `document.documentElement.clientWidth` with and without a scrollbar. There is one container width (`--container-page`) and one tracking per label role, so the numbers should match on every page.

## Not covered

Palette, brand, illustration and copy tone are not covered. Contrast numbers live in `docs/design/TOKENS.md`. WCAG 2.2 criteria beyond those named (for example 2.5.7 dragging) are checked by the reviewer when a feature introduces the pattern.
