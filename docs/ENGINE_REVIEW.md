# Engine review & red-team (2026-07-05)

Single consolidated view of: what the reward engine computes, where its answers are **wrong or
misleading** (red-team), the data-remediation done this session, and the roadmap. Supersedes the
scattered notes; detail lives in `FLOOR_AUDIT.md`, `TRANSFER_PARTNERS.md`, `REMEDIATION_LOG.md`.

---

## 1. What the engine computes

- **₹5L-travel calculator** (`engine15.py`, scratchpad): net return = travel-accelerator points +
  milestones − annual fee, points valued at each card's `unit_value_inr_realized` (floor) or
  `unit_value_inr` (face/ceiling), monthly caps applied. Produces the "best travel card" ranking.
- **Holistic booking model** (`booking-savings/holistic.py`): cheapest *total* cost of a booking,
  netting price + portal markup + bank discount + rewards + points opportunity cost.

## 2. Red-team findings — the engine's answers are systematically OPTIMISTIC

Four independent red-team streams (own analysis + 3 agents) converged. **The ₹5L numbers are
theoretical ceilings, not realistic net returns.** Ranked by severity:

| # | Flaw | Effect (quantified) | Fix |
|---|---|---|---|
| R1 | **Portal-markup blindness** — values points at ₹1 but never subtracts the SmartBuy/Travel-EDGE price premium the booking model proved exists | HDFC Diners "17.5%" → **real ~7–12%**; premium ~0–5% flights, **5–34% hotels**. Contradicts our own holistic model. | Net portal markup against reward; reconcile the two models |
| R2 | **Forex blindness** — no forex term at all | Atlas on ₹5L **international**: 5% earn − 4.13% (3.5%+GST) = **~0.87% net, or negative**. Ranks a 3.5% card above a 0% card → **full inversion vs Scapia** | Subtract `forex_markup_pct × 1.18 × intl_spend` |
| R3 | **Accelerator not MCC/channel-scoped** — applies the best travel rate to *all* ₹5L | Atlas 5x is gated to Travel EDGE portal/direct **and does NOT apply abroad** (base 2x). MMT 6% is MMT-only; Scapia 4% is app-only | Apply accelerator only to eligible channel/MCC fraction |
| R4 | **Channel-routing fantasy** — assumes 100% of spend routes through the best accelerator; the `locked` flag is computed but **never used** | Overstates every portal/co-brand card; lumpy travel + **monthly cap** means most spend earns base (Diners: only ~₹2.7L of ₹5L gets 10X even spread; less if lumpy) | Discount locked cards; model caps against monthly profile |
| R5 | **realized-vs-face asymmetry** — ranks a points card at face ₹2.2 against a cashback rupee at ₹1 | Systematically under-ranks cashback, over-ranks transfer-optimized points | Rank on ONE basis (realized); show floor→ceiling as a range |
| R6 | **"Pure travel" best-case** — real spend is mixed; accelerators exclude fuel/rent/utilities/insurance | Flatters travel cards vs all-rounders | Model a realistic spend mix, not 100% travel |
| R7 | **Data: Diners Black "10X flights+hotels"** — 10X (33%) is **hotels only; flights are 5X (16.5%)** | Overstates flight earn ~2× | Split the accelerator: flights 5X / hotels 10X |

**Root cause:** the calculator discards fields the repo already stores — `forex_markup_pct`,
`cap_per_cycle`+`cycle`, `channel.class`, `unit_value_inr_realized`, step-wise `milestones`. An
"engine v2" should consume them.

**What held up:** milestone step-function logic is correct (Amex Taj is at ₹7L post-9-Mar-2026,
dataset matches; engine credits only ≤₹5L tiers). The *data* is now trustworthy; the *engine* is the
weak link.

## 3. Data remediation done this session (data is now sound)

~73 cards corrected across **36 commits**, all `validate.py`-clean. Highlights:
- Floor outliers (OneCard ₹1→0.10, EazyDiner, SC EaseMyTrip, Times Black).
- Nominal inflation: **Uni Coins 100× error** (₹1→0.01), Scapia 5× (₹1→₹0.20/coin), ixigo/cheq/kosmo/paytm.
- **Systematic co-brand-airline undervaluation** fixed: KrisFlyer/Emirates/Etihad were ~₹0.2 → now ₹0.6–1.1.
- IndiGo BluChip overvaluation ₹1.0→0.45; SC 360 lineup; EDGE Miles/Reward-Points made uniform.
- Discontinued defunct cards (Vistara ×5, InterMiles ×4).
- All discovery scenarios (floor, nominal, internal, cross-card, sibling, ratio, provenance, earn-rate) now clean.

## 4. Value verification (adversarial)

7 of 8 top values survived refutation; **only KrisFlyer was wrong (₹0.85→₹1.0, fixed)**. Notable nuance:
Atlas's ₹2.2 face is now a KrisFlyer-transfer *best case*, not a guaranteed floor — the old ~₹2/mile
Accor hotel floor is **gone** (removed 2026-04-02). Atlas is effectively an airline-miles-only card now.

## 5. How to read the ₹5L verdict now

- The **realized** column ≈ a floor; the **theoretical** column ≈ a ceiling that assumes perfect
  optimization. Truth is between, minus the R1–R4 costs the engine omits.
- **Domestic vs international matters enormously** (forex) — the current verdict is implicitly domestic.
- Portal-locked leaders (Diners/SmartBuy, MMT, Ixigo) are the most overstated; flexible/low-forex
  cards (Atlas transfer, Scapia international) are understated.

## 6. Roadmap → see `booking-savings/TODO.md`
