# TODO — prioritized (post red-team, 2026-07-05)

See `docs/ENGINE_REVIEW.md` for the full red-team analysis behind P0. **The data is now sound
(~73 cards fixed, all audits clean); the engine is the weak link.**

## P0 — Engine correctness (the ₹5L answers are optimistic ceilings, not real returns)
- [ ] **Engine v2** — stop discarding fields the repo already stores:
  - [ ] R1 **Net portal markup** against reward (Diners "17.5%" → real ~7–12%). Reconcile with `holistic.py`.
  - [ ] R2 **Forex term**: subtract `forex_markup_pct × 1.18 × intl_spend`; split the verdict into **domestic vs international** (they invert — Atlas loses to Scapia on ₹5L international).
  - [ ] R3 **Accelerator MCC/channel scoping** — apply the boosted rate only to the eligible channel/MCC fraction, not all ₹5L (Atlas 5x is portal/direct-only and *not abroad*; MMT 6% is MMT-only).
  - [ ] R4 **Use the `locked` flag** (currently computed, never used); model `cap_per_cycle`+`cycle` against a **monthly** spend profile, not the annual total (lumpy travel → most spend earns base).
  - [ ] R5 **Rank on one basis** (realized); present floor→ceiling as an explicit range, not face-vs-realized mixed.
  - [ ] R6 **Realistic spend mix** (fuel/rent/utilities/insurance are excluded from accelerators) instead of 100% pure travel.
- [ ] R7 **DATA fix:** split HDFC Diners Black accelerator — **flights 5X (16.5%), hotels 10X (33%)** (currently lumped as "10X flights+hotels"). Re-check Infinia/DCB SmartBuy the same way.
- [ ] Persist the engine into the repo (`scripts/` or `analysis/`) with unit tests, once v2 is built.
- [ ] **Re-run & rewrite the ₹5L verdict** (separate domestic + international) with corrected engine + values.

## P1 — Dataset structural
- [ ] Build `loyalty_programs/*.yaml` partner files — **OPEN DECISION:** reusable entity files vs inline notes.
- [ ] Regenerate `dist/` (`prebuild`); confirm the site renders the new realized/face values correctly.

## P2 — Booking model (side project, `booking-savings/`)
- [ ] `MARKUPS.md` provenance — write up the now-researched portal/OTA markups per cell + confidence (domestic-flight cell stays low-confidence, ~0–3%).
- [ ] Interactive HTML calculator (enter real quotes → live ranked net cost).
- [ ] Model the award-booking path (transfer miles → book a partner award).
- [ ] Add explicit **forex + cancellation/refund + convenience-fee** cost terms (shares R2 with the engine).
- [ ] Reconcile `holistic.py` and engine v2 on shared markup/forex assumptions (single source of truth).

## Deferred / watch
- [ ] Equitas PowerMiles — revisit ~Sept 2026 when its 1:1 transfers go live.

## Done this session (2026-07-05 — 36 commits, all validate OK, unpushed on `todo-board-2026-07`)
- Floor audit of all 319 cards; 4 Category-B outliers fixed; 22 missing `realized` populated.
- EDGE Miles + Reward Points reconciled (uniform ₹0.18 floor); stragglers swept.
- Nominal-inflation class fixed: **Uni Coins 100×**, Scapia 5×, ixigo/cheq/kosmo/paytm, Adani, Apollo, SC Beyond.
- **Systematic co-brand-airline undervaluation fixed** (KrisFlyer/Emirates/Etihad ~₹0.2 → ₹0.6–1.1); IndiGo BluChip 1.0→0.45.
- SC 360 lineup reconciled; SC Rewards earn-rate fixed; obscure bank-RP overvaluations fixed.
- Defunct cards discontinued (Vistara ×5, InterMiles ×4). IRCTC family verified (BOB genuinely ₹0.25).
- Red-team: 4 streams; 7/8 values held, **KrisFlyer ₹0.85→₹1.0** corrected.
- Scenarios A–I all clean (floor, nominal, internal, cross-card, sibling, transfer-ratio, provenance, earn-rate).
