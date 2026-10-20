# Source URL audit — 2026-10-20 (TODO D4)

Scope: every URL the dataset cites under `data/` (card `source.url` at any depth,
`application.apply_url`, issuer and network `website`, loyalty-programme
references). Method:

1. `python scripts/check_links.py` over all 379 distinct URLs (HEAD then GET,
   curl re-check for blocked / network errors). Result: **ok 333, redirect 25,
   not-found 8, blocked 9, network-error 4**.
2. A host tally of every cited URL, to find sources that are not the issuer
   (aggregators, press, blogs).
3. For each redirect, 404 and aggregator source: re-fetch the replacement on the
   issuer's own site (curl, HTTP 200, page title names the card) and read the
   text before swapping. Redirect targets that only moved host or path were
   swapped URL-only and keep their `retrieved_on` (a redirect is not a
   re-verification). Where values were re-read, `retrieved_on` and
   `metadata.last_verified_on` are 2026-10-20.

The earlier same-day pass (`claude/remediate-links`, merged) had already fixed
20 host moves and 6 per-card 404s; this pass covers what remained.

## Fixed

### Redirects → canonical issuer URL (URL-only)

| File | Field(s) | Old → new |
|---|---|---|
| axis/ace, airtel, my-zone, neo, reserve | `apply_url` | `axisbank.com/retail/cards/credit-card/*` → `axis.bank.in/cards/credit-card/*` (redirect targets, 200) |
| axis/burgundy-private | fees[0], benefits[0] source, `apply_url` | `axisbank.com/burgundyprivate/creditcard` → `axis.bank.in/burgundy-private/the-one-card` |
| sbi/reliance-prime, indigo, indigo-elite | `apply_url` | SBI Card `.page` → `.html` |
| south-indian/sib-platinum | all sources, `apply_url` | SBI Card `.page` → `.html` |
| issuers amex, networks amex | `website` | `americanexpress.com/in` → `americanexpress.com/en-in/` |
| issuers federal, kotak, standard-chartered, union | `website` | old domains → `federal.bank.in`, `kotak.bank.in`, `sc.bank.in`, `unionbankofindia.bank.in` |
| issuers kvb | `website` | `kvb.co.in` (DNS no longer resolves) → `kvb.bank.in` (200) |
| loyalty irctc-loyalty | valuation reference | CardMaven slug moved (`…-review/`) |

### Soft 404s → current card page (URL-only)

| File | Old → new | Evidence |
|---|---|---|
| indusind/pinnacle | `…/pinnacle-credit-card.html` (redirected to IndusInd's 404 page) → `…/pinnacle-world-credit-card.html` | 200; title "Pinnacle Credit Card - Check Benefits & Rewards Online"; Apply Now present |
| indusind/platinum (Mastercard) | `…/platinum-credit-card.html` (404 page) → `…/platinum-master-credit-card.html` | 200; title "Apply for Platinum Master Credit Card Online"; a Visa twin exists at `platinum-visa-credit-card.html` |

### Aggregator / press sources replaced with issuer sources (values re-read)

| File | Record | Was | Now | Value changes |
|---|---|---|---|---|
| hdfc/6e-rewards | rewards[0] | Paisabazaar | hdfc.bank.in product page | Dining/grocery/entertainment 2/₹100 is "capped at 100 RP monthly" (was uncapped). `discontinued_on` 2026-07-03 (date a 404 was observed) → **2025-11-01**, the issuer-stated end of benefits; records close 2025-10-31 |
| hdfc/tata-neu-infinity | benefits[1] | CardMaven | hdfc.bank.in product page | Fuel waiver cap ₹250 → **₹500** per statement cycle; domestic lounge via is a bank voucher (`issuer-direct`), not Priority Pass |
| sbi/aurum | fees[1] | CardInsider blog | SBI Card MITC page | none (3.75%/month and the 1% utility fee >₹50k confirmed) |
| sbi/aurum | rewards[1] | Business Standard | AURUM rewards T&C PDF | none (digital-gaming exclusion from 1-Dec-2024 confirmed) |

## Not fixed — needs a decision or a dedicated pass

| Card | Finding | Why not fixed here |
|---|---|---|
| **idfc-first/indigo** | Issuer page (`idfcfirst.bank.in/credit-card/indigo-credit-card`) now says **3 BluChips/₹100 on other spends**, 0.5 on UPI and on insurance/fuel/utility/rent/wallet/education/govt, and **zero forex markup with 1 BluChip on international spends**. The record (cited to Business Standard) has base 1/₹100 and a 3/₹100 dining-entertainment accelerator. | An earn-rate revision with no stated effective date. Needs a close-and-append with a sourced date, and the forex change in the fee record. Logged to TODO. |
| **yes/paisabazaar** (PaisaSave) | YES BANK's page (JS-rendered) now describes 6% on dining & travel (12 RP/₹200) and 1% on other spends (2 RP/₹200), not the 3% online / 1.5% offline the record has (cited to Paisabazaar). Caps not visible on the page; an MITC PDF is linked. | Rate revision without a date or caps; adding an uncapped 6% would distort rankings. Logged to TODO. |
| hdfc/6e-rewards-xl | Already `discontinued` (2025-11-01). Rewards/benefits still cite Paisabazaar. The issuer page's XL section says "2% on grocery, dining & entertainment, 1% on all other spends", which does not match the record (base 2/₹100, 3/₹100 accelerator) and may be a copy of the base card's text. | Conflicting issuer text on a discontinued card; left as is and logged. |
| axis/olympus | Old URL redirects to the Axis sitemap. `axis.bank.in/olympus` lands on a Citi-migration page offering Olympus to former Citi Prestige holders; no standalone product page. | Status (migration-only vs open) needs a decision; logged. |
| kotak/myntra-kaching | Card page 301s to the credit-card listing, which no longer mentions Myntra at all. Third-party reports say it was withdrawn around 10-Jul-2025. | No issuer notice found, so `status` is not changed. Logged. |
| icici/manchester-united-signature | `icici.bank.in` card pages redirect to the home page or listing; no notice. | Likely discontinued; no issuer statement. Dead URL kept as the historical citation (existing precedent). |
| amex/centurion, kotak/pvr-gold, rbl/zomato-edition, yes/premia, sbi/aurum (pre-Nov-2024 page), sbi/elite-business, sbi/prime-business | 404, unchanged from the first link check | Already annotated on main (discontinued / user decisions logged 2026-10-20). |
| boi/boi-select, issuers boi, federal/celesta, onecard/metal, south-indian website, networks mastercard / rupay | `blocked` (403 or bot wall) | Bank CDNs refuse non-browser clients; "blocked" means unverified, not broken. BOI's `website` stays on `.co.in`: both it and `bankofindia.bank.in` return 403, so the move can't be confirmed. |
| axis/magnus | web.archive.org returned 429 | Rate limit; the snapshot itself is fine. |
| loyalty airindia / goindigo / irctc | timeouts | Transient; re-check on the next run. |

## Aggregator and non-issuer sources still cited

After this pass, the remaining non-issuer citations are:

| Kind | Where | Assessment |
|---|---|---|
| Aggregator as the primary card source | hdfc/6e-rewards-xl (rewards, benefits), hdfc/6e-rewards (benefits), idfc-first/indigo (benefits; rewards cite Business Standard), yes/paisabazaar (rewards), hdfc/tata-neu-infinity rewards[1] (CardMaven), sbi/aurum benefits[0] (CardMaven) | The first four need the rate revisions above, not a URL swap. Tata Neu rewards[1]: the issuer page confirms 5% / 1.5% but not the 1,500 NeuCoins/month cap, so the source is kept. Aurum benefits: no single SBI page found that states all the recorded benefits. |
| Valuation references for loyalty programmes | air-india-flying-returns (The Points Guy, Paisabazaar), marriott-bonvoy (The Points Guy, Head for Points), indigo-bluchip (CardTrail, FlyerTalk, CardMaven), irctc-loyalty (CardMaven) | Expected. A points currency's realised ₹ value is a market estimate; programmes do not publish one. These sit under `unit_value_inr.realized_source.references`, not as rule sources. |

`validate.py --strict-provenance` counts 5 aggregator-sourced reward rules after
this pass.

## Re-running

```powershell
python scripts/check_links.py --out-dir dist   # writes dist/link-report.{json,md}
```
