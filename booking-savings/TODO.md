# TODO — prioritized (post red-team, 2026-07-05)

See `docs/REMEDIATION_2026-07.md` for the consolidated remediation record + red-team analysis behind
P0. **The data is now sound (~73 cards fixed, all audits clean); the engine is the weak link.**

## Architecture decision (2026-07-05) — TWO SEPARATE LAYERS, never blended
The engine shows **both** an **absolute** value (on-paper: face unit value, full accelerator eligibility,
caps enforced, no friction — the ceiling) **and** a **realistic** value (realized unit value + friction:
routability, portal markup, forex, channel-scoping — the floor), side by side. The friction model is a
distinct track (`eligibility_fraction()` + `PORTAL_MARKUP` + forex, gated behind `realistic=True`), NOT
folded into one number — combining them hides which cards are big-ceiling/thin-floor (e.g. IDFC Gaj:
25.2% absolute vs 6.1% realistic). Same "full visibility, no blending" rule as the value layer.

## P0 — Engine v2 (DONE — category-aware, cap-enforced, two-layer) ✅
- [x] **R4 cap enforcement** — per-cycle caps enforced against a monthly profile (kills the "crore" bug).
- [x] **R1 portal markup** — hotel-weighted 10–12% premium, realistic lens only (separate friction track).
- [x] **R2 forex** — FX-charged intl spend only, realistic lens only.
- [x] **R3/R4 routability + channel scoping** — `eligibility_fraction()` (portal 65% / co-brand 50% / broad 100%).
- [x] **R5** — ranked on the realistic floor; absolute ceiling shown as a distinct column (no basis-mixing).
- [x] Invite-only cards included (Infinia/Solitaire/Centurion were being dropped) — Infinia now #1 all-rounder.
- Remaining engine follow-ups (lower priority) kept below.

## P0-legacy — Engine correctness notes (superseded by the above; kept for provenance)
- [ ] **R4 (CRITICAL — the "₹3-crore reward" bug): the engine does not ENFORCE caps.** Even after the
  data now carries `cap_per_cycle`, the calculator applies accelerator rates to the full (and clearly
  unrealistic — crore-scale) spend with no monthly ceiling. It MUST cap accelerated earn per cycle
  AND use a realistic spend. Data caps are necessary but not sufficient — this is why the site shows crores.
- [ ] **Engine v2** — stop discarding fields the repo already stores:
  - [ ] R1 **Net portal markup** against reward (Diners "17.5%" → real ~7–12%). Reconcile with `holistic.py`.
  - [ ] R2 **Forex term (FX-charged spend only)**: forex applies ONLY to foreign-currency transactions (POS/ATM abroad, foreign OTA/hotel/airline sites) — NOT to international trips booked in INR via Indian aggregators/portals. Model 3 contexts: domestic-INR, international-booked-in-INR (no forex), foreign-currency (subtract `forex_markup_pct × 1.18` on the FX fraction; 0%-forex cards win here only).
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

## P1b — Data (surfaced by the uncapped-accelerator audit, 2026-07-05)
- [x] **Uncapped-accelerator sweep** — added verified monthly caps to 23 cards (SBI/YES/BOB/Amex/HDFC/Axis/RBL/Kotak); removed fabricated RBL World Safari "10x international"; left genuinely-uncapped cards (SC Ultimate, ICICI Amazon Pay/MMT, Kotak IndiGo, co-brand airline miles) correct.
- [ ] **Accelerator RATE overstatements** (found during the cap audit — separate from caps): IndusInd Pinnacle (~2.5 pts, dataset 5), IndusInd EazyDiner (2X EazyPoints, dataset "15 pts"), IDFC Mayura international (5X, dataset 10X), Axis Flipkart Super Elite (per-txn 300 SuperCoins + discontinued). Verify & correct rates.
- [ ] Verify remaining low-confidence "uncapped" flags against issuer T&C PDFs: SBI IRCTC/Landmark/Reliance, YES Wellness, BOB Snapdeal/Etihad, AU Xcite, Axis Horizon/ShopperStop/SpiceJet.
