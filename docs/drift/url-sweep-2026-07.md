# D4 — source/apply URL health sweep (2026-07-05)

`python scripts/validate.py --check-urls` over all 319 cards. Full raw output:
`docs/drift/url-health-2026-07.txt` (60 flagged URLs). Triaged below.

## Fixed this pass
- **Axis apply_urls (6)** — `aura`, `flipkart`, `horizon`, `indianoil-premium`,
  `indigo-premium`, `indigo` still pointed at the migrated
  `axisbank.com/retail/cards/...` (HTTP 404). Repointed to the verified
  `axis.bank.in/cards/credit-card/...` product pages (each returns 200; slugs
  taken from `docs/sources/axis/_manifest.json`). Their `source.url`s were
  already on `axis.bank.in` (healthy).

## Benign — no action needed
- **Transient server errors (pages exist):** `equitas-powermiles`,
  `equitas-selfe` (HTTP 503), `standard-chartered-beyond`,
  `standard-chartered-digismart` (URLError), `onecard-metal`,
  `indusind-intermiles-odyssey-visa` (403/503). These issuer pages are live —
  e.g. the Equitas PowerMiles page was read successfully during D20 research the
  same day; the errors are rate-limiting / bot-blocking / momentary 5xx, not dead
  links. Do NOT repoint.
- **Expected 404 on discontinued / withdrawn cards:** `rbl-zomato-edition`
  (status already discontinued), `icici-manchester-united-signature`,
  `kotak-myntra-kaching`, `kotak-pvr-gold`, `kotak-indigo-xl`. The product pages
  are gone because the cards are; the archived evidence + notes stand.
- **Non-issuer aggregator/archive sources (low priority):** business-standard
  (403) on `idfc-first-indigo`, `sbi-aurum`; `web.archive.org` (404) on
  `axis-magnus`. These are secondary corroboration, not the primary issuer source.

## Needs dedicated per-card research (issuer 404 on an active card)
Left for a follow-up per-issuer pass (each needs the current issuer URL
Playwright-verified before repointing):
- `idfc-first` — `power`, `power-plus`, `swyp`, `first-private` (idfcfirst.bank.in
  404; likely slug changes or invite-only gating).
- `axis-olympus` — both source + apply 404 (possible rename/withdrawal).
- `amex-centurion` — invite-only; public page 404 (may be intentional).
- `sbi-aurum` — `sbicard.com/...aurum.page` 404; the live microsite is
  `aurumcreditcard.com` (already the apply_url + allowlisted, D6). Repoint the
  source.url on the next SBI pass.
