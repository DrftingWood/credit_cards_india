# Channel markups & instant discounts — sourced calibration (2026-07)

Provenance for the `PROFILES` numbers in `holistic.py`. Grounded in a 2026-07 web-research pass
(bank travel portals + aggregator/direct pricing + bank instant-discount offers). **Dynamic pricing
means any single booking varies** — these are central estimates with confidence flags, not guarantees.

## 1. Bank travel-portal price markup (over the cheapest aggregator/direct)

| Portal | Domestic flight | Intl flight | Domestic hotel | Intl hotel |
|---|---|---|---|---|
| **HDFC SmartBuy** | +2–5% `Med` | +3–8% `Low` | +5–12% `Med-Low` | +10–20% `Low` |
| **Axis Travel EDGE** | ~+5.4% `High` | +6–12% `Low-Med` | +25–40% `High` | +25–40% `Med-Low` |
| **ICICI iShop** | 0–5% `Low` | +3–8% `Low` | ~+10% `Low` | +15–25% `Low` |

Model uses: SmartBuy {3%, 8%, 10%, 20%}, EDGE {5.5%, 12%, 30%, 32%}. iShop not yet modelled (under-documented; seed near SmartBuy with low confidence if added).

## 2. The dominant hidden cost is NOT base markup — it's blocked coupons

SmartBuy and EDGE **do not let you stack bank instant-discount coupons/card offers** — you pay list price.
On a mainstream OTA you can often stack a **10–15% bank instant discount**. So a portal with even ~0% base
markup can be effectively 10–15% costlier *before* rewards. In `holistic.py` this is captured by giving the
portal methods a smaller discount cap (SmartBuy: 10%/₹500) than the OTA methods (bank: 10%/₹1,750 domestic).

Also real, not in the sticker: **thinner inventory** (portals show fewer hotels; the "same hotel" may be absent),
and **worse cancellations/rebooking** (SmartBuy point-refunds messy; EDGE intl date-change painful) — argue for a
small risk premium on portal + international + changeable bookings. Net effective SmartBuy reward is ~2–4%, not the
headline 5%, once price + lost discount are netted.

## 3. Aggregator vs direct, and convenience fees

- **Base fare is identical** across airline-direct and OTAs; the all-in differs on **convenience fee/pax/leg**:
  MakeMyTrip/Yatra ~₹700+ (dear end) · Cleartrip/ixigo/EaseMyTrip/Amazon ₹150–599 (cheap end) · **IndiGo direct is NOT free (~₹199–349)**; Air India/Akasa often lower.
  → On a ₹4–5k fare the OTA gap is ~7–15%; on ₹15k+ it shrinks to ~2–4%. `ota` in the model is a flat central estimate.
- **Hotels:** direct competes only for **large chains (₹8k+/night)** (price-match + perks); OTAs win mid/budget/OYO and international (Booking/Agoda). `direct=True` only for flights in the model — validated.

## 4. Bank instant-discount offers (the coupon that flips "cheapest")

| Card × OTA | Category | Disc | Cap ₹ | Min ₹ | Cadence |
|---|---|---|---|---|---|
| HDFC × MakeMyTrip | Dom flight | 10% | 2,000 | 7,500 | sale-only |
| **ICICI × ixigo** | Dom flight | 12% | 1,500 | 10,000 | **always-on, Wednesdays** |
| Axis × Cleartrip | Dom flight | 12% | 1,500 | 7,500 | sale-only |
| Axis × Cleartrip | Intl flight | 10% | 5,000 | 15,000 | sale-only |
| SBI × Yatra | Dom flight | ≤19% | 2,025 | — | sale-only |
| HDFC × MakeMyTrip | Intl hotel | 10% | 10,000 | 15,000 | sale-only |
| SBI × MakeMyTrip | Intl flight | 10% | 5,000 | — | sale-only |
| SBI × Yatra | Dom hotel | ≤55% | 5,000 | — | sale-only |

**Corrections applied to the model from this table:**
- **Intl-flight discount cap ₹10,000 → ₹5,000** (the ₹10,000 cap is intl *hotels*, not flights).
- Domestic-flight cap ₹1,500 → ₹1,750 (real band ₹1,500–2,025).
- Discount applies to **base fare only** (excludes convenience fee/ancillaries) — confirmed on ICICI/ixigo terms.
- **Cadence:** almost all are sale-only (a few days/month, usually once/card/category/month). The model implicitly assumes an active sale; without one, net savings are lower. Only ICICI×ixigo domestic flights is genuinely always-on (Wednesdays).

## 5. Confidence summary
- **High:** EDGE domestic flight ~5.4%; EDGE domestic hotel 25–40%.
- **Medium:** SmartBuy domestic flight base markup; SmartBuy domestic hotel; EDGE intl hotel; convenience-fee bands; instant-discount caps/cadence.
- **Low (flagged — not audited):** all SmartBuy intl cells; EDGE intl flight; every ICICI iShop cell; exact per-pax convenience fees (verify at checkout).

## 6. Sources
Bank/OTA promo pages: makemytrip.com/promos (HDFC/SBI CC terms), ixigo.com/offers/icici-credit-card-offer-dom,
cleartrip.com/all-offers/axis-bank-ct-cc-special-offer, yatra.com/offer SBI, icici.bank.in/ishop/faqs, goindigo.in fees.
Comparisons/anecdotes: TechnoFino community threads (SmartBuy vs direct flights; Travel Edge 5.44% premium; Magnus hotel
Travel Edge vs MMT 25–40%; EDGE intl rebooking), CardMaven SmartBuy guide, CardExpert iShop, Paisabazaar iShop-vs-SmartBuy,
happyfares/clansay (convenience fees, direct-vs-OTA hotels). Several TechnoFino `.in` pages 403'd on direct fetch — those
figures are from indexed snippets/mirror; treat exact %s as directional.
