# Standard Chartered — audit + verification (2026-07-03)

Review of the Standard Chartered India credit-card catalogue against the live
**sc.bank.in** site (Playwright + DOM extraction), 2026-07-03.

## Systematic findings

1. **Domain migration.** `sc.com/in` **redirects to `sc.bank.in`** — the 8th
   `.bank.in` migration found this audit run (after hdfc/axis/icici/idfcfirst/kotak/
   rbl/indusind/yes). Standard Chartered had **no** entry in the validator's
   `ISSUER_ALLOWED_DOMAINS` — added `standard-chartered` (sc.com + sc.bank.in).
   Existing card source URLs re-pointed to sc.bank.in with corrected live slugs
   (`ultimate` → `ultimate-card`, `rewards` → `rewards-credit-card`).
2. **Reward-value spread.** SC 360 Reward Points are worth ~₹1 on the premium cards
   (Ultimate, Beyond) but ~₹0.50 on the mid/entry cards (Rewards, EaseMyTrip, Super
   Value Titanium, Platinum Rewards, Manhattan, Priority) — captured per card.

## Catalogue reconciliation

**3 existing — all verified/corrected:**
- **Ultimate** — domestic lounge 1→**4/quarter**; added ₹6,000-RP joining benefit;
  fixed a misleading "forex 3.33%" accelerator (it is a flat 5 RP/₹150 = 3.33% plus
  duty-free cashback); international lounge requires ₹20k prior-month spend.
- **Rewards** — it is **first-year-free** (joining ₹1,000→0), renewal waiver
  ₹1.2L→₹1.5L; added the **+4X bonus tier** on monthly retail above ₹20,000 (8 RP/₹150,
  capped 20,000 RP/cycle); lounge 4/yr → 1/quarter.
- **EaseMyTrip** — restructured: the 20%/10% figures are **EaseMyTrip booking
  discounts** (moved to benefits), not reward rates; real rewards are 10 RP/₹100 on
  travel + 1 RP/₹100 base @ ₹0.50; fee waiver ₹1.2L→₹50k; **international lounge access
  discontinued w.e.f. 15-Oct-2024** (domestic only).

**7 new cards added:** beyond (super-premium flagship — unlimited lounge, 3%/2%
rewards, golf, 15% duty-free, EazyDiner), smart (2%/1% cashback, ₹18k/yr, 0.99% EMI),
super-value-titanium (5% fuel/phone/utility), platinum-rewards (5X dining/fuel),
manhattan (5% supermarket + 3X), priority-visa-infinite (Priority Banking
relationship-gated super-premium), digismart (₹49/mo subscription discount card).

**Excluded (out of scope):** EMI instruments — `loan-on-credit-card`, `balance-on-emi`
(BOE), `kuch-bhi-on-emi` (KBE) — these are transaction-conversion facilities, not
distinct cards.

## MCC pass
Universal rent (MCC 6513) exclusion on all SC cards. See
[`standard-chartered-mcc-map.md`](standard-chartered-mcc-map.md).

## Schema/tooling note
Visa `network_tier` accepts only classic/platinum/signature/infinite — the "Titanium"
in *Super Value Titanium* is the card name, mapped to Visa `platinum`.

## Follow-ups
Several new cards carry `# TODO verify` on exact fees, reward caps, network tier, and
income thresholds (SC PDPs are JS-heavy and the fee tables load dynamically) — close
from each card's MITC / tariff PDF in the final TODO-cleanup wave.
