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

## Handled in the top-10 pass (for reference)
Numeric caps applied: idfc-first-gaj (15k RP/mo shared), kotak-solitaire (100k
miles/statement), rbl-irctc (1k RP/mo), axis-spicejet-voyage-black (₹1L spend/mo).
Documented no-cap (capping_rules note): sbi-irctc-platinum, sbi-irctc-premier,
sbi-air-india-signature, icici-adani-one-signature, icici-mmt.
