<!-- Delete the section that does not apply. The owner merges; do not merge your own PR. -->

## What and why

<!-- One or two sentences. Link the TODO / decision / plan task. -->

## Data PR (changes under data/)

- [ ] `python scripts/validate.py` exits 0 (or the blocker is written below)
- [ ] `metadata.last_verified_on` bumped on every touched card
- [ ] `source.retrieved_on` is the date I loaded the source; `source.url` is the issuer page or PDF I read
- [ ] Exactly one open-ended (`effective_until: null`) record per `fees`, `rewards`, `benefits` array on active cards
- [ ] Changed values are new dated records, not in-place edits (docs/CONTRIBUTING.md)
- [ ] No local PDF under `docs/sources/**/*.pdf` deleted or moved

## Site PR (changes under site/ or booking-savings/)

From `site/`:

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Screenshots at 1280 and 390 attached (add 1920 for layout changes)
- [ ] Layout numbers measured in the browser and pasted (left edges, column positions, computed font size and tracking at 1280, 1920, 390)
- [ ] No decorative emoji; labels come first, icons support them

**Not verified:** <!-- say what you did not run or check, or write "nothing" -->

## Attribution

Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` when an agent wrote them.

Owner merges.
