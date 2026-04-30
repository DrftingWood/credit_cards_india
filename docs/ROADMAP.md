# Roadmap and open work

Concrete deferred items, in rough priority order. When an item lands, move
it to [`DECISIONS.md`](DECISIONS.md) if it represents a durable design
choice; otherwise just delete it from this file.

For the design rationale that motivated this list, see
[`DECISIONS.md`](DECISIONS.md).

---

## ⚠ Provisional realized unit values — must be sourced

**Status as of 2026-04-30** (continuously revised as audit progresses):

Still PROVISIONAL (realized number is an unsourced midpoint):
- `air-india-flying-returns` realized 0.5 — Red baseline 6/100 and
  Silver 8/100 sourced. Gold/Platinum slabs and the blend of optimal
  vs typical redemption value remain best-effort estimates within a
  documented band.
- ~50 cards on second-tier issuers (IDFC FIRST, IndusInd, Kotak, RBL,
  BoB, Yes, AU, HSBC, KVB, Federal, BoI, IDBI, PNB, Union, South
  Indian, Canara, Standard Chartered) carry per-issuer-haircut realized
  values that haven't been individually verified against issuer
  redemption T&Cs. Haircuts sit within community-cited bands but no
  per-card number is sourced.

Confirmed (sourced or near-primary):
- `tata-neu-points`, `irctc-loyalty`, `indigo-bluchip` — full earn
  structure and realized value sourced.
- `marriott-bonvoy` — earn structure (10/$, tier bonuses) and realized
  0.55 sourced (TPG values at 0.7 ¢/pt USD ≈ ₹0.59 at 85 INR/USD).
- HDFC Reward Points realized values for Infinia / Diners Black (0.7),
  Diners Privilege / Regalia Gold (0.4) — sourced.
- Amex MR per-card realized values (MRCC 0.25, Plat Travel 0.30, Plat
  Reserve / Plat Charge / Centurion 0.40) — sourced.
- Axis EDGE Miles realized 0.50 across Atlas / Horizon / Olympus —
  post-Marriott-removal benchmark, April 2026.
- ICICI / SBI Reward Points face confirmed at ₹0.25 across Coral,
  Rubyx, Sapphiro, Emeralde, Elite, Prime, Aurum, SimplyClick,
  SimplySave, Pulse, BPCL Octane, Reliance Prime, etc.

The card-level `card_attributable_rate` numbers on co-brand cards are
estimates from product-page narratives, not issuer-confirmed slabs.
Verified to reconcile with the new programme model:
- IndiGo cards: visible 19/21/22 = programme max 16 + card 3/5/6 ✓.

**To unblock production trust on remaining unsourced realized numbers**:
1. For each second-tier-issuer card, pull the issuer's reward
   redemption T&Cs PDF and replace the haircut with a sourced number.
2. Refine `air-india-flying-returns` realized once a basket of
   representative redemptions is benchmarked.

Until then, treat ranked output as "directionally correct, magnitudes
approximate."

---

## Card data migration

The schema/calculator/recommender redesign (D-8 through D-12) ships
back-compat: cards that haven't been migrated keep working via the legacy
`effective_rate` path. Each row below is a plain data PR — no code change.

| Wave | Programme / pattern | Status |
|------|---------------------|--------|
| 1 | indigo-bluchip co-brands (axis ×2, hdfc/6e-rewards, idfc-first, kotak ×2, sbi ×2) | Done. hdfc/6e-rewards-xl skipped (discontinued). |
| 2 | tata-neu-points (hdfc/tata-neu-plus, hdfc/tata-neu-infinity) | Done |
| 3 | marriott-bonvoy (hdfc/marriott-bonvoy) | Done |
| 4 | irctc-loyalty (hdfc/irctc-hdfc, rbl/irctc, sbi/irctc-premier) | Done |
| 5 | air-india-flying-returns (sbi/air-india-platinum) | Done. Future Air India Vistara cards will reference the same programme. |
| 6 | Channel-only on flagship cards (atlas, magnus, infinia, diners-black, diners-privilege, amazon-pay, horizon, olympus, adani-one-signature, myntra-kaching) | Done |
| 7 | `unit_value_inr_realized` on every points/miles card | Done across all 86 points/miles cards. Per-issuer haircut numbers are sourced for HDFC, Axis, Amex, ICICI, SBI; haircut-derived for second-tier issuers (see "Provisional" section above). |

## Per-card audit on `card_attributable_rate`

The IndiGo wave-1 numbers (`card_attributable_rate: 3` on sbi/indigo,
`5` on kotak/indigo, `6` on idfc-first/indigo, etc.) are conservative
estimates from product-page notes, not issuer-confirmed slabs. A research
pass should:

1. Pull the official rate-card PDF or product-page T&Cs for each card.
2. Identify the card-side, channel-bonus, programme-baseline, and tier
   components separately.
3. Update `card_attributable_rate`, `stacks_with_program`, and
   `earn_components[]` if a richer decomposition is warranted.
4. Add `realized_source.references[]` entries to the parent loyalty
   programme YAML for traceability.

## Validator promotions

Currently warnings — promote to errors once offender count is zero per rule:

| Rule | Status |
|------|--------|
| Accelerator `category` matches a known regex but lacks `canonical_categories` | Warning. Run `scripts/tag_canonical_categories.py --apply` to bulk-tag, then promote. |
| Card has `co_brand.partner` matching a known programme partner but no `loyalty_program` ref | Not yet implemented. Add once Wave 1+ migration is settled. |
| Accelerator `effective_rate > 5` and `card_attributable_rate` is unset (likely a stacking rate that wasn't decomposed) | Not yet implemented. Add after Wave 7. |

## Recommender follow-ups

- **Issuer-portal opt-in toggle.** Adding "I'm willing to book travel via
  my bank's portal (SmartBuy / Travel EDGE / iShop)" to step 5 (lifestyle)
  would let power users unlock issuer-portal accelerators that today are
  filtered out for casual users. Currently those tokens are intentionally
  not in `BRAND_PREF_TO_CHANNELS`.
- **Backwards-look results pagination.** Top 5 today; consider top 10 with
  expand-to-show controls if the breakdown UI proves cramped.
- **Calculator parity disclaimer.** Add a one-line tooltip on `/calculator`
  explaining that its numbers are upper-bounds and `/recommend` may show
  lower realised values for the same card.

## Tooling follow-ups

- **`channel.required: false` semantics.** Today the flag is supported in
  the schema but no calculator code path treats it differently from
  "absent channel". If we ever need informational-only channels, wire
  this in.
- **Co-brand inference.** When a new card is created with `co_brand.partner`
  matching a known programme, suggest `rewards[].loyalty_program` in
  `scripts/new_card.py`.
- **Effective-dating for loyalty programmes** (D-11). Reconsider when /
  if historical valuations become a customer-facing concern.
