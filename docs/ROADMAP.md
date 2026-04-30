# Roadmap and open work

Concrete deferred items, in rough priority order. When an item lands, move
it to [`DECISIONS.md`](DECISIONS.md) if it represents a durable design
choice; otherwise just delete it from this file.

For the design rationale that motivated this list, see
[`DECISIONS.md`](DECISIONS.md).

---

## ⚠ Provisional realized unit values — must be sourced

Every `unit_value_inr_realized` in the dataset today is a **placeholder**,
not a researched value:

- The five `data/loyalty_programs/*/*.yaml` files (BluChip, Bonvoy,
  Tata Neu, IRCTC, Flying Returns) carry `realized` numbers and
  `realized_source.notes` blocks marked `PROVISIONAL`. The earn baseline
  / channel / tier rates inside `earn:` are equally provisional.
- The 17 wave-7 cards that got inline `unit_value_inr_realized` (see
  the Wave 7 row below) used per-issuer haircuts of 30-60% off face. The
  haircuts are within community-cited bands but no individual number
  is sourced.
- The card-level `card_attributable_rate` numbers on co-brand cards
  (the IndiGo-on-Kotak/IDFC/SBI splits in particular) are conservative
  estimates from product-page narratives, not issuer-confirmed slabs.

**Practical impact**: relative ordering across cards is probably roughly
right (issuer-relative haircuts move together); absolute ₹/yr figures
in `/recommend` will be off — possibly meaningfully. The schema and
calculator are sound; the numbers feeding them are not.

**To unblock production trust**, an audit pass needs to:
1. Fetch the primary product page or T&Cs PDF for each loyalty programme
   and each migrated card.
2. Replace each `realized` number with a sourced value, populate
   `realized_source.references[]` on the programme YAML.
3. Verify `card_attributable_rate` decomposition against issuer slab
   tables; switch to `earn_components[]` where the per-source breakdown
   matters.

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
| 7 | `unit_value_inr_realized` on every points/miles card not yet touched | Open. Cards using internal currencies (EDGE Miles, MR Points, HDFC Reward Points, SBI Reward Points) still carry only the legacy `unit_value_inr`. Each needs a one-line edit informed by issuer redemption rate or community valuation source. |

### Wave 7 candidates (not exhaustive)

Run this to find offenders:

```sh
grep -rL "unit_value_inr_realized" data/cards/ | \
  xargs grep -l "currency: \(points\|miles\)"
```

Realized-value research notes (move to per-programme YAMLs once authored):
- HDFC Reward Points (Regalia/Regalia Gold): face ₹0.5, realized ~₹0.30–0.35
  for SmartBuy redemptions; lower for catalog.
- Axis EDGE Miles (Atlas/Magnus): face ₹1.0 on EDGE portal; realized
  ~₹0.50–0.60 after 2:1 transfer to airline partners and award-fare friction.
- Amex MR Points: face ~₹0.5, realized varies wildly by redemption type
  (₹0.30 for vouchers up to ₹0.80 for MR-to-Marriott transfers).

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
