# Recommendation engine — deep flaw audit (2026-07-04)

Empirical red-team of `site/lib/recommender.ts` (`recommend()`), run against the
live `dist/*.json`. ~13 personas + edge cases were scored and their full
`breakdown` interrogated. This documents **structural** flaws in the engine's
logic, not just data errors (data errors are D1–D16 in `TODO.md`).

**Headline:** the engine is neither personalized nor robust. Its one
personalized signal (co-brand/channel rates) is switched off by the applicability
default, and its rankings are dominated by **unbounded, un-sanity-checked benefit
proxies** (milestones/lounge/welcome) that routinely dwarf actual spend rewards —
which is exactly where the underlying data is least reliable.

## Severity 1 — personalization is inert or backwards

### F1. Brand preferences & channel selection have ZERO effect on rankings
Proven, not suspected:
- `S2a` (Amazon shopper, no brand) == `S2b` (+amazon): identical top-5, identical reward numbers.
- `S4a` (traveler, no airline) == `S4b` (+indigo): identical.
- `E2a` (fuel-only) == `E2b` (+bpcl): identical.
- `E3`: on a heavy-online profile, `shopping = amazon | flipkart | tata-neu | myntra` **each produce a top-10 identical to no-brand.**

Root cause: `recommend()` sets `applyApplicability: true`. A *narrow*
(merchant/co-brand/portal) accelerator with no authored `applicability_pct`
falls back to **base rate** (A2 / DECISIONS D-18), and **zero cards** author
`applicability_pct`. So every co-brand/portal rate collapses to base, and the
channel-aware `primary` score **always equals** the `general` score — `rwd == gen`
in every single row of every scenario. The wizard's entire "Brand fit" step
(Step 3) and the `channelMix` machinery are dead weight. The
`per_category[].also_show` UI ("general value if you don't book on your channel")
**never fires** (`also_show_buckets = 0` everywhere).

### F2. The applicability model rewards bad data modelling and punishes good modelling
- `sbi-phonepe-select-black` earns **10% on online, `channel: null`, `cap: None`** → credited in full → **#1** for online shoppers (₹48,000/yr on ₹40k/mo).
- `icici-amazon-pay` earns **5% on Amazon, `channel: cobrand-merchant`** → treated as narrow → **refused, dropped to base 1%** → not even top-5.

Because "narrow" = *has* a channel/merchant tag, an accelerator modelled **without**
a channel (sloppy, or a flat rate) is treated as category-wide and paid in full,
while a **correctly channel-gated** co-brand is zeroed. The engine systematically
prefers the worse-modelled card.

## Severity 1 — unbounded benefit proxies dominate and produce absurd numbers

### F3. Milestone valuation has no sanity ceiling → ₹1.44 lakh phantoms
- `S3` (foodie) **#1 = `amex-platinum-reserve`** with `mile = ₹1,44,000`. Mechanism: a milestone "spend ₹50k/mo → ₹12,000, `is_repeatable: true`, `rolling`" is multiplied ×12 = ₹144,000/yr — a **24% return on spend**, and it makes a super-premium charge card the top pick for a foodie.
- `E2` (fuel-only) **#3 = `kotak-pvr-inox`** — a *movie* card — with `rwd = 0` but `mile = ₹14,400`.

Root cause: `milestonesValue()` (A4) multiplies a repeatable monthly award ×12 and
trusts `value_inr` blindly. No ceiling relative to the triggering spend, no check
that the card is even relevant to the user's categories. One data error
(₹12,000 almost certainly should be *points*) becomes the dominant ranking signal.

### F4. Lounge valuation is unbounded and usage-blind → up to ₹96,000
- `S5` `hdfc-diners-black` `lounge = ₹96,000` (unlimited domestic+international → 24×₹1,500 + 24×₹2,500).
- `S6` (low-spend lounge seeker) **#1 = `axis-horizon`** purely on `lounge = ₹36,000` despite `rwd = ₹300`, and it carries a ₹3,000 fee.

`loungeValue()` caps "unlimited" at 24 visits × fixed ₹1,500/₹2,500 and credits it
in full regardless of whether the user takes 2 visits or 24. It dominates any
ranking where `lounge_pref` is set.

### F5. Welcome bonuses treated as recurring value; zero-spend users ranked by signup bonuses
- `E1` (**ZERO spend**, no goals): top picks are ranked entirely on welcome bonuses (`sbi-pulse` `welc = ₹4,000`) and a ₹0-threshold milestone (`axis-indigo-premium` `mile = ₹5,000` on zero spend).
- `S5` `standard-chartered-beyond` `welc = ₹30,000` (a ₹60k bonus ÷ 2) → #4.

`welcomeValue()` amortizes a one-time bonus over only 2 years and adds it straight
into `rank_total_inr`; `premiumExtrasValue()` adds flat ₹2,000/₹3,000. A card can
win on a one-time bonus it pays once.

## Severity 2 — robustness, model, hygiene

### F6. No robustness to a single mis-modelled card
`bob-scapia` (20% ungated travel, coins @ ₹1 — see D14) is **#1 across S4, S5, S8**
and top-5 in S1/S2/S3. One outlier corrupts many unrelated rankings; the engine
has no outlier bounds or plausibility flags.

### F7. Uncapped / "unlimited" high accelerators are credited in full — SYSTEMIC
`sbi-phonepe` 10% `cap: None`; `hsbc-rupay-cashback` 10% `cap: unlimited` → fake
₹48k–60k/yr. A ≥10% *uncapped* everyday rate is implausible and should be flagged;
the engine has no cap-sanity defence and no way to distinguish "genuinely uncapped"
from "cap forgotten in the data".

**Scale (measured):** 66 of 304 active cards (22%) carry an uncapped accelerator
≥3% effective — 10 at ≥10% (axis-airtel ~25%, bob-scapia ~20%, …). This is partly
missing caps and partly the D13 BluChip decomposition inflation. It corrupts
rankings across most spend profiles, so no ranking that trusts these rates is
reliable until the data is capped/decomposed (D20). The decoupled scorer flags
the worst (≥8%) but mid-rate offenders (5–8%, e.g. `au-cheq` ~6%) still slip
through — a lower flag threshold trades false positives for coverage.

### F8. `rank_total_inr` conflates incompatible quantities and time horizons
It sums: recurring rewards + annual lounge/milestone proxies + a one-time welcome
(÷2) + qualitative premium proxies − fee. There is no separation of **first-year**
vs **steady-state** value, so a user cannot tell whether a card wins on ongoing
earning or a one-off bonus.

### F9. The spend model can't express the information needed to value co-brands
5 coarse bands × 5 broad buckets. The exact input required to credit a co-brand
card ("how much of your online is Amazon") is inexpressible — so even with F1
fixed, the engine cannot properly value co-brand cards. Bands also snap ₹16,667 →
₹22,500 (a ~35% distortion).

### F10. Category relevance is ignored
The engine sums proxies without checking the card is good at the user's actual
spend categories. Result: a **movie card tops a fuel query** (F3), a **charge card
tops a foodie query** (F3). Recommendations are not category-matched.

### F11. Point-value inconsistency corrupts cross-card comparison (see D13)
`effective_rate` is card-side for some cards but the receipt-visible total for
others (IndiGo co-brands), inflating those cards' rewards 3–4×.

### F12. Weak income filter + near-duplicate variants
Income filter (measured over 287 active cards):
- **45 cards (16%) have no stated `income_inr_annual`** → they pass *every* band,
  including `lt-30k`; income never filters them.
- The filter tests `band_ceiling >= card_min_income`, i.e. against the **top** of
  the user's band. A user earning ₹20k/mo (in `lt-30k`, ceiling ₹3.6L) is shown
  cards requiring up to ₹3.6L income — **over-admission** for anyone below their
  band's top. (Upside: premium ≥₹5,000-fee cards do *not* leak into `lt-30k` — 0
  of them pass — so that part of the original concern was overstated.)

Near-identical variants occupy separate slots (`kotak-cashback-plus` + `-prime`,
`yes-paisabazaar` + `-rupay`, `sbi-pulse` + `-sprint`), halving effective diversity
in the top 5.

### F13. Goals barely matter (except the lounge hard-filter)
`cashback` / `travel` / `premium` don't change the ranking except that `premium`
adds flat proxies and `lounge` is a hard filter. The "primary goal" step is largely
cosmetic.

## Root-cause synthesis
The engine reduces every card to a single ₹ number by summing (a) spend-grounded
rewards and (b) a pile of **unbounded, un-sanity-checked** benefit/bonus proxies.
(b) routinely dwarfs (a), so rankings are driven by whichever card has the largest
milestone/lounge/welcome figure in the data — precisely where the data is least
trustworthy. Meanwhile the only spend-grounded *personalized* signal (co-brand /
channel rates) is switched off by the applicability default (F1). The result is a
recommender that is **neither personalized nor robust**.

## Suggested directions (not exhaustive; design-level)
1. **Decouple the score.** Rank on steady-state, spend-grounded net value. Present
   welcome / milestone / lounge as separate, clearly-labelled, **capped** line
   items — do not sum them into the rank.
2. **Bound every proxy.** Lounge value from a *usage* input (visits/yr the user
   actually takes), not 24. Milestone value clipped to a realistic % of the
   triggering spend. Welcome shown as a distinct one-time figure.
3. **Make brand selection real.** Either author `applicability_pct` on co-brand
   cards (D12) or collect merchant-level spend, so selecting "Amazon" actually
   credits the Amazon slice instead of nothing.
4. **Sanity guards.** Flag/clip accelerator rates > ~8% that are uncapped; flag
   milestone value > ~10% of trigger spend; bound any single card's proxy total.
5. **Category-match.** Down-weight cards whose rewards don't touch the user's top
   spend categories (kill the movie-card-for-fuel class of result).
6. **De-dup** near-identical variants in the output.
7. Fix the feeding data errors (D13/D14/F7 missing caps) — but note that even with
   perfect data, F1/F3/F4/F5/F8/F10 are *engine* flaws that data fixes won't cure.

## Prototype: decoupled scorer (`site/lib/scorer-decoupled.ts`)

A side-by-side prototype (does not touch `recommender.ts`; 4 tests in
`scorer-decoupled.test.ts`) demonstrates the fix direction **without inventing
any weighting constants**:

- **RANK = brand-aware spend rewards − annual fee**, using only card-data rates ×
  user-reported spend. A co-brand rate is credited **only when the user selects
  that brand** — so `icici-amazon-pay` earns base with no brand (`n/a` in
  results) and its **real uncapped 5%** with `+amazon` (₹24,000/yr on ₹40k/mo,
  scaling linearly — at ₹4L/mo it dominates). No applicability fraction (F1 fixed
  the honest way).
- **Welcome / milestones / lounge are decoupled** into separate informational
  line items — lounge as *factual visit counts* (not monetised), welcome/
  milestone at their data-stated ₹. They never enter the rank, so the ₹1.44L
  milestone and ₹96k lounge phantoms can no longer corrupt it (F3/F4/F5/F8).
- **Factual `flags[]`** mark implausible uncapped rates (via unit value, so it
  catches points cards too) and category mismatch — **warnings only, they never
  alter a number**. The top *unflagged* card is the trustworthy pick.

### Fix status vs the flaws
| Flaw | Prototype | Notes |
|---|---|---|
| F1 brand inert | **fixed** | brand selection now credits the real co-brand rate |
| F3 milestone phantom | **fixed** | decoupled out of the rank + implausibility flag |
| F4 lounge phantom | **fixed** | reported as visit counts, not a ₹ proxy |
| F5 welcome-as-recurring | **fixed** | one-time, separate line, never ranked |
| F8 conflation | **fixed** | rank is a single clean quantity (net rewards) |
| F7 uncapped rates | **flagged** | surfaced as warnings; real fix is the data |
| F10 category mismatch | **flagged** | warning when rewards miss the top bucket |
| F2/F6/F9/F11/F12/F13 | open | need data fixes (D13/D14), a spend-input redesign (F9), de-dup (F12) |

### Not yet addressed by the prototype
- **F9** (coarse bands): still uses the 5-band mapping; a merchant/amount-level
  spend input is the real fix.
- **Lounge for lounge-goal users**: ranked by rewards with visit counts shown;
  monetising lounge honestly needs a "visits you take per year" user input.
- **F6/F7 data outliers still rank high** (flagged, not demoted) — correct
  behaviour: the scorer reflects the data honestly; the cure is fixing the data.

### Data errors surfaced by the flag pass (filed as D-items)
The implausible-rate flag immediately exposed feeding data errors: `axis-airtel`
(~25% uncapped), `sbi-phonepe-select-black` / `hsbc-rupay-cashback` (uncapped
~10% — likely missing caps), and `sbi-flipkart` earning on *any* online spend
(accelerator not gated to Flipkart). See D20–D21 in `TODO.md`.

## Scenarios used (for reproduction)
S1 cashback/moderate-online · S2a/b Amazon shopper ±brand · S3 foodie(swiggy) ·
S4a/b IndiGo traveler ±airline · S5 premium high-spender · S6 low-spend lounge
seeker · S7 credit-builder(low income) · S8 rent+utilities · E1 zero-spend ·
E2a/b fuel-only ±bpcl · E3 brand-toggle sweep. (Harness was a throwaway vitest
that imports `recommend()` and dumps `breakdown`; not committed.)
