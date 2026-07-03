# HDFC Bank — data audit (2026-07-03)

Audit of the HDFC catalogue in this dataset against HDFC's **live** website
(`https://www.hdfc.bank.in/credit-cards`), performed 2026-07-03.

## Method

A headless Playwright crawl fetched HDFC's retail credit-card listing page and
the detail page of every consumer card (24 live retail cards). Extracted fee,
reward-rate, lounge, eligibility and welcome/milestone text was diffed
field-by-field against the YAML in `data/cards/hdfc/`. Business and commercial
cards (BizBlack, GIGA, Corporate, Fleet, Purchase, …) are out of scope for this
consumer-focused dataset — noted here so their absence is a decision, not a gap.

## 1. Corrections applied to existing cards

All values below were changed to match the live HDFC pages. Sources migrated to
the canonical `hdfc.bank.in` domain; `retrieved_on` / `last_verified_on` set to
2026-07-03.

| Card | Field | Was | Now (live) |
| --- | --- | --- | --- |
| **diners-privilege** | membership fee | ₹2,500 | **₹1,000** |
| | forex markup | 2.0% | **3.5%** |
| | base rate | 4 / ₹150 | **4 / ₹200** |
| | Swiggy/Zomato earn | *absent* | **5× (20/₹200, 2.5k/mo cap)** added |
| | intl lounge | 8/yr | **1/qtr, ₹60k-gated** |
| | domestic lounge | 8/yr | **2/qtr, ₹60k-gated** |
| | welcome | 2,500 RP | **Swiggy One + Times Prime** |
| | milestone | *absent* | **₹1,500 voucher / ₹1.5L quarterly** added |
| | income (salaried) | ₹12L | **₹4.2L** |
| **regalia-gold** | base rate | 4 / ₹150 | **5 / ₹200** |
| | redemption | SmartBuy 0.5 | **Gold catalogue ₹0.65 + flights ₹0.5 (70% cap)** |
| | statement cap | *absent* | **50,000 RP / cycle** added |
| | domestic lounge | 12/yr flat | **3/qtr, ₹60k-gated** |
| | welcome | ₹2,500 voucher | **+ Swiggy One + MMT Black Gold + Boarding Edge** |
| **regalia** | base rate | 4 / ₹150 | **4 / ₹200** |
| | SmartBuy 5× | *absent* | added |
| | domestic lounge | 12/yr flat | **2/qtr, ₹1L-gated** (+ 4-swipe Priority Pass unlock) |
| | insurance | air only | **+ travel-medical + credit-shield** |
| **diners-black** | income (salaried) | ₹21L | **₹30L** (₹2.5L/mo) |
| | welcome | 10,000 RP | **Club Marriott + Amazon Prime + Swiggy One** |
| | milestone | mixed/old | **₹4L/qtr → 10,000 RP** |
| | golf cycle | monthly | **quarterly** (was wrong) |
| | weekend-dining 2× | *absent* | added |
| | insurance | air + medical | **+ credit-shield ₹9L** |
| **infinia** | (values already correct) | | + renewal-benefit 12,500 RP, ITC buffet, provenance refresh |
| **moneyback-plus** | base rate | 2 / ₹150 | **2 / ₹200** |
| **freedom** | base rate | 1 / ₹150 | **2 / ₹200** |
| | accelerator | 5× dining/ent/grocery | **10× BigBasket/BookMyShow/OYO/Swiggy/Uber** |

## 2. Systematic findings

1. **`per_inr: 150` vs `200`.** The reward denominator was wrong on every
   mid/entry card that earns per ₹200 — regalia-gold, regalia, diners-privilege,
   moneyback-plus, freedom (5 cards). The ₹150 figure is correct only for the
   super-premium travel-points cards (infinia, diners-black) and marriott-bonvoy.
   Pattern is consistent with ₹150 being copied across the family. This silently
   corrupts `headline_rate_pct`, the calculator, and any rate-based ranking.
2. **Spend-gated lounge access.** HDFC moved domestic lounge to "N visits/quarter,
   conditional on ₹60k–₹1L prior-quarter spend." Modelled via
   `LoungeDetails.spend_threshold_inr` + `spend_threshold_cycle` (previously only
   used on the international branch). Presenting these as unconditional annual
   counts overstates the benefit.
3. **Provenance drift.** `retrieved_on: 2026-04-15` did not reflect the live
   values — the stamp was newer than the data. Fixed for the audited cards; the
   fix at the root is an automated crawl-diff (see §5).
4. **Domain migration.** HDFC's canonical domain is now `hdfc.bank.in`
   (`hdfcbank.com` redirects). `scripts/validate.py` `ISSUER_ALLOWED_DOMAINS`
   was missing HDFC's `.bank.in` variant (axis/icici/idfc-first already had
   theirs); added.

## 3. Catalogue reconciliation

**Added — 9 cards** that are live on HDFC but were missing (all scaffolded from
crawled data, schema-valid, with `# TODO verify` on fields HDFC doesn't publish
on the product page):

| Card | Network | Tier | Status | Notes |
| --- | --- | --- | --- | --- |
| phonepe-uno | rupay† | entry | active | fees not published; many TODOs |
| phonepe-ultimo | rupay† | mid | active | 10% PhonePe cats / 5% online; fees not published |
| pixel-go | rupay | entry | active | digital; 5% SmartBuy / 1% UPI |
| upi-rupay | rupay | entry | active | 2% utilities / 1% other |
| swiggy-ornge | mastercard | mid | active | 5% Swiggy + online |
| swiggy-blck | mastercard | premium | active | 10% Swiggy; ITR ₹12L |
| pine-labs-pro | visa† | mid | **on-hold** | page: "sourcing stopped, existing customers retained" |
| shoppers-stop | visa† | entry | active | 3% at Shoppers Stop |
| shoppers-stop-black | visa† | premium | active | 7% at Shoppers Stop; ₹3cr air cover |

† network defaulted where the product page didn't state it — flagged `# TODO verify`.

**Discontinued:** `6e-rewards` (IndiGo) — was `active`, HDFC page now 404s and it
is off the live catalogue; marked `discontinued` (`discontinued_on: 2026-07-03`,
the observation date; exact sunset unknown). `6e-rewards-xl` was already
discontinued (2025-11-01). `diners-rewardz` **remains active** — its page is live
(HTTP 200) though it is absent from the main listing grid; do **not** discontinue.

## 4. Remaining follow-ups

- **Verify network** on pine-labs-pro, shoppers-stop, shoppers-stop-black (product
  pages didn't name it; defaulted to `visa`).
- **PhonePe Uno/Ultimo fees** — not published on the product page; confirm from
  the MITC / fees-and-charges PDF.
- **indianoil** joining fee — dataset ₹500 vs live marketing "without any joining
  fee"; confirm whether it's an offer or permanent.
- Resolve the `# TODO verify` markers across the 9 new files (fee amounts,
  eligibility numbers, launch dates, exact reward caps).

## 5. Recommendation: automate the crawl-diff

The manual pass proved `retrieved_on` can't be trusted by itself. A repeatable
Playwright script that fetches each card's live page and diffs the key fields
(fee, base rate + denominator, forex, lounge counts, income) against the YAML,
emitting a drift report, would keep the dataset honest at scale and let
`last_verified_on` mean something. The crawl harness used for this audit is a
starting point.
