# Pending items & TODO

Snapshot of open work across both projects (as of 2026-07-05).

## 🔴 Immediate / blocking
- [ ] Commit `credit_cards_india` changes and this `travel-booking-savings` project (in progress).
- [x] Run the 4 grounded route scenarios in `holistic.py` (domestic/intl × flight/hotel).
- [ ] `MARKUPS.md` provenance file — per-cell markup, confidence, sources (domestic-flight cell is low-confidence).

## 📦 Project 1 — credit_cards_india (dataset)
Done: 25 cards encoded with full-visibility `transfer_partners`; catalogue-only marks (IDFC/RBL/AU);
InterMiles ×4 discontinued; HSBC Platinum, ICICI, Kotak, YES; `docs/TRANSFER_PARTNERS.md`; validates OK.

Pending:
- [ ] Reconcile EDGE Reward Points value: Magnus ₹0.18 vs Reserve ₹0.35 (same currency).
- [ ] Sweep last EDGE Miles stragglers: `axis/olympus` (discontinued), `axis/indianoil-premium` (catalog-only) — still on old 2:1 / 0.5.
- [ ] Build `loyalty_programs/*.yaml` partner files — promote ~28 partner values out of card notes into reusable entities.
- [ ] Co-brand single-airline cards (bob/etihad, icici/emirates-*, sbi/*, axis/vistara*, kotak/air*) — set proper co-brand partner values.
- [ ] Verify low-confidence encodings: HDFC `regalia` (modeled on Regalia Gold), ICICI `emeralde` legacy 6:1.
- [ ] Decide whether to persist the ₹5L engine (`engine15.py`, currently scratchpad-only) into the repo.
- [ ] Regenerate `dist/` (prebuild) and confirm the site handles `realized=floor` values.
- [ ] Revisit Equitas PowerMiles ~Sept 2026 when 1:1 transfers go live.

## 🧮 Project 2 — travel-booking-savings (side project)
Done: `holistic.py` (route-profile model, grounded markups), `README.md`, `TODO.md`.

Pending:
- [ ] `MARKUPS.md` provenance (per-cell confidence + sources).
- [ ] Interactive HTML calculator (enter real quotes → live ranked net cost).
- [ ] Model the award-booking path (transfer miles → book a partner award).
- [ ] Add cancellation/refund friction + convenience fees as explicit cost terms.
- [ ] Better-ground the domestic-flight markup cell (treat as 0–3% low-confidence for now).

## 🤔 Open decisions
- [ ] `loyalty_programs/*.yaml` (reusable) vs partner values inline in card notes?
- [ ] HTML calculator for the side project — yes/no?
