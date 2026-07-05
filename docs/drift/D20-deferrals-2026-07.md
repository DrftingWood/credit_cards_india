# D20 cap remediation — deferrals & rate flags (2026-07-05)

Items surfaced during the D20 top-10 cap pass that need dedicated follow-up
(logged here so they survive into Task 3 / a later rate audit).

## Deferred caps
- **sbi-landmark-prime** — research agent confirmed the *base* Landmark SBI Card
  booklet (10 RP/₹100, no cap) and the SELECT variant (15 RP/₹100), but the
  dataset has three variants (`landmark`, `landmark-prime`, `landmark-select`)
  and `landmark-prime` models **25 RP/₹100** at ₹0.25/RP. The 25-RP "prime" tier
  was **not** confirmed by the base booklet, so no cap/no-cap note was applied.
  → Needs the prime-variant's own T&C before capping or annotating. Rate itself
  (25 vs 10/15) is unverified for this variant — treat as a rate flag too.

## Rate flags (out of D20 cap scope — for a rate/rewards audit)
- **rbl-irctc** — modelled accelerated `irctc-rail-bookings` at effective_rate=25
  RP/₹100-equivalent giving ~10% value, but the reward record's own note and the
  research both indicate the regulated rail earn is 1 RP = ₹1 with a ₹200 minimum
  (agent found "5 RP per ₹200"). The 1,000-RP/month cap is applied and sourced;
  the underlying earn-rate model should be reconciled against the IRCTC FAQ/T&C.
- **indusind-pinnacle** — modelled `travel-dining` accelerator at effective_rate=5
  (~3.8%) is NOT supported by issuer evidence (2026-07-05 research). The Pinnacle
  Benefit Guide gives 2.5 RP/₹100 online, a **reduced** 1.5 RP/₹100 on travel &
  airlines, and 1 RP/₹100 POS — there is no 5-RP travel/dining accelerator. Likely
  a data error; no cap applied (can't cap a rate the issuer doesn't document).
  Needs a rewards remodel to the real 2.5/1.5/1 structure.
- **kotak-white-reserve** — modelled `international-spend` accelerator at
  effective_rate=6 (~3%) could not be confirmed: the KFS + product pages show
  rewards are milestone-based "White Pass" value (annual ₹2.5L program cap), not a
  per-transaction international accelerator. No per-txn international earn table
  exists in issuer docs. No cap applied; needs a rewards-model review.
- **indusind-eazydiner-platinum** — modelled `eazydiner-dining` accelerator at
  effective_rate=15 (~3%) is unsupported (2026-07-05 research): IndusInd's press
  release, product page and benefits leaflet describe "up to 2 reward points per
  ₹100" plus a separate 25%+20% dining DISCOUNT (not a points accelerator). No
  cap applied. Second IndusInd card (with `indusind-pinnacle`) whose modelled
  dining/travel accelerator overstates the issuer's real earn — worth a dedicated
  IndusInd rewards-model audit.

## Handled in the top-10 pass (for reference)
Numeric caps applied: idfc-first-gaj (15k RP/mo shared), kotak-solitaire (100k
miles/statement), rbl-irctc (1k RP/mo), axis-spicejet-voyage-black (₹1L spend/mo).
Documented no-cap (capping_rules note): sbi-irctc-platinum, sbi-irctc-premier,
sbi-air-india-signature, icici-adani-one-signature, icici-mmt.
