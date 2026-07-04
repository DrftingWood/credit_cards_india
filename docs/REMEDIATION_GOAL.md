# Remediation goal prompt — credit_cards_india

A self-contained prompt for a fresh session/agent to systematically fix the known flaws in
this dataset. Paste it as the task. It assumes no prior conversation context.

---

## GOAL

You are working on `credit_cards_india`, an open, YAML-authored dataset of Indian credit cards
(319 cards under `data/cards/<issuer>/<slug>.yaml`), validated by `python scripts/validate.py`
(the CI gate) and compiled into a Next.js site under `site/`. Your goal is to **eliminate the
systemic valuation and transfer-partner flaws** below, leaving every touched value **sourced,
dated, confidence-tagged, and validating clean** — without fabricating data.

## THE CORE QUALITY PRINCIPLE (already applied to ~27 transferable-points cards; extend it)

Reward-point value is modelled with **full visibility, no blending**:

- `rewards[].base.unit_value_inr_realized` = the **guaranteed non-transfer floor** — the value a
  holder gets with zero effort and no airline preference (bank portal / SmartBuy / catalogue / cash).
- `rewards[].base.unit_value_inr` (face) = the **single best documented redemption** (ceiling).
- Every transfer partner is itemised in `redemption[].transfer_partners[]` with its own
  `transfer_ratio` (direction: **card-point : partner-unit**) and a `~Rs X/pt` note; conversions
  below the card's floor are flagged. No averaged/blended number anywhere.
- See `docs/TRANSFER_PARTNERS.md` for the verified matrix and the model in practice.

## KNOWN FLAWS TO FIX (priority order)

1. **Valuation-convention split (highest priority — introduced mid-fix).** ~27 transferable cards now
   use `realized = floor`; the other ~290 cards still use the schema's old "midpoint" convention.
   Decide and enforce ONE repo-wide rule (recommended: `realized = guaranteed floor` everywhere,
   `face = best redemption`), then audit ALL 319 cards. In particular, **flag/fix every card whose
   `realized` sits below its own guaranteed floor** (the exact bug found on Atlas ₹0.5-vs-₹1 and
   Infinia ₹0.7-vs-₹1). Update `docs/SCHEMA.md` to document the chosen convention.
2. **EDGE Reward Points inconsistency:** `axis/magnus` values them ₹0.18 but `axis/reserve` ₹0.35 —
   same currency. Reconcile (catalogue rate differs by card? or an error?).
3. **EDGE Miles stragglers:** `axis/olympus` (discontinued) and `axis/indianoil-premium` (catalogue-only)
   still carry the old inverted `2:1 / 0.5`. Sweep them onto the model.
4. **Partner values live in card notes, not entities.** Promote the ~28 airline/hotel partners into
   `data/loyalty_programs/<type>/<id>.yaml` (with `unit_value_inr.{face,realized}`) and reference them,
   so the ₹/point layer is data-driven and reused across HDFC/Axis/HSBC/Amex/IndusInd.
5. **Co-brand single-airline cards** (bob/etihad-*, icici/emirates-*, sbi/air-india-*, sbi/krisflyer-*,
   axis/vistara-*, kotak/air-*): they earn into ONE programme — set `unit_value` from that programme's
   real INR value, not a generic default.
6. **Verify low-confidence encodings:** `hdfc/regalia` (modelled on Regalia Gold), `icici/emeralde`
   (legacy 6:1). Upgrade to source-verified or mark clearly.
7. **Provenance completeness:** ensure every reward `source` has `url`, `retrieved_on`, `confidence`,
   and a `notes` line; flag values older than ~6 months for re-verification.
8. **Tooling:** persist the ₹5L "best card" calculator (currently scratchpad-only `engine15.py`) as a
   first-class script under `scripts/` or `analysis/`, with a couple of unit tests.

## METHODOLOGY

- **Research before writing.** For any ratio/value, cross-check **≥3 independent 2026 sources**
  (technofino, cardinsider, cardmaven, magnify, pointsmath, livefromalounge, issuer pages),
  adversarially verify, and record confidence. **Distinguish pre- vs post-April-2026 devaluation.**
  If you cannot verify, mark low-confidence or leave unchanged — **never fabricate a ratio.**
- **Edit safely at scale with ruamel.yaml round-trip** (not PyYAML dump — it destroys comments):
  `yaml.preserve_quotes=True`; register a None→`null` representer (else `null` renders blank);
  wrap every `transfer_ratio`/`ratio` value in `DoubleQuotedScalarString` — **unquoted `1:1` parses
  as the base-60 number 61** under `safe_load` and fails validation. Preserve hand-written comments.
- **Validate after every change:** `python scripts/validate.py` must print `OK` before you commit.
- **Commit in logical chunks** with the repo's trailer convention. Do **not** stage unrelated
  pre-existing working-tree changes (e.g. docs/ROADMAP, site/README). If on the default branch, branch first.

## HARD CONSTRAINTS

- Earn rates, caps, fees, and milestones are separate from valuation — do not change them while fixing values.
- Windows console is cp1252: run Python with `PYTHONIOENCODING=utf-8 PYTHONUTF8=1` when printing ₹.
- Keep `dist/` out of commits (gitignored); regenerate via `site` prebuild only to verify.

## DONE-CRITERIA

- [ ] `python scripts/validate.py` → `OK`.
- [ ] No card has `unit_value_inr_realized` below its own guaranteed floor.
- [ ] One documented valuation convention applied across all 319 cards.
- [ ] Every transferable currency has per-partner `transfer_partners` (+ ideally a `loyalty_program` ref).
- [ ] Every changed value carries `source.url` + `retrieved_on` + `confidence`.
- [ ] `docs/TRANSFER_PARTNERS.md` and `docs/SCHEMA.md` updated to match.
- [ ] Site prebuild succeeds with the new values.

## SIDE PROJECT (booking-savings/) — separate, lower priority

`booking-savings/holistic.py` models cheapest-total booking. Open items: add `MARKUPS.md` provenance
(per-cell markup + source + confidence; the domestic-flight cell is low-confidence and needs grounding);
model the award-booking path (transfer miles → book a partner award); add cancellation/refund friction
and convenience fees as explicit terms; optionally an interactive HTML calculator. Keep it independent
of the dataset pipeline.
