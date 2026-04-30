# Session notes — recommender redesign and loyalty/channel schema

Date: 2026-04-30
Branch: `claude/fix-api-timeout-BnKqu`

This document captures the design decisions made in a single working session
that redesigned the `/recommend` flow, added a third-party loyalty program
schema, and split reward attribution between card-attributable rate and the
loyalty programme baseline/tier/channel earn that previously got conflated.

The implementation in this branch lands Phase 0 + Phase 1 + Phase 2 (schema,
dual-mode calculator, recommender module, wizard, one card migrated as
proof). Phases 3–5 (data migration waves, validator promotions to errors,
deprecation passes) follow in subsequent PRs.

---

## Q1 — Conflict resolution between the three preference axes

`monthly_spend` (rupee-grounded), `brand_preferences` (concrete), and `goals`
(abstract) routinely disagree.

**Decision:** spend + brand prefs are the primary signal; `goals` is a
tie-breaker and a UX/copy framing device, not a hard filter. Exception:
`goals: [lounge]` does act as a hard filter (drops cards with no lounge
benefit); `goals: [premium]` up-weights qualitative extras for the same
reason.

Implementation: see `recommend()` in `site/lib/recommender.ts`.

## Q2 — Recommender reuses `rankCards()` rather than a parallel scorer

A single source of truth for "what does this card earn on this spend"
guarantees `/calculator` and `/recommend` agree. Recommender is a thin
wrapper: pre-filters (income, lounge), calls `scoreCard(card, spend, ctx)`,
post-augments with lounge/milestone/welcome valuations and forex cost.

## Q3 — Channel-locked accelerators

`/calculator` stays optimistic (assumes you book on the right channel —
useful as the "max possible" exploration tool). `/recommend` honours the
user's stated brand prefs by filtering accelerators whose channel constraint
is unmet, and then transparently displays both the channel-locked and the
general-category value side-by-side. No within-category mixing weights.

Implementation: `ScoringContext.channelMix` in `site/lib/calculator.ts`;
`recommend()` runs both `ctx` (with mix) and `ctxGeneral` (empty mix) and
exposes both via `RecommendResult.per_category[].also_show`.

## Q4 — Reward attribution decomposition

The previous `effective_rate: 19` on IndiGo SBI conflated four sources: card,
channel bonus, BluChip baseline, tier. ~16 of those 19 are not
card-attributable.

**Decision:** add `card_attributable_rate` (+ `card_attributable_per_inr`)
as the math field; keep `effective_rate` as the documentary
receipt-visible total. Add `earn_components[]` as an optional richer form
for accelerators where the decomposition is naturally per-source.
Calculator prefers `card_attributable_rate` when set, falls through to
legacy paths otherwise — back-compat by construction.

Schema: `schema/card.schema.json` `AcceleratedReward.card_attributable_rate`,
`stacks_with_program`, `earn_components[]`.

## Q5 — Loyalty program schema (new top-level entity)

Loyalty programs are denormalized peers of cards/issuers/networks. Cards
reference a program by id; the program owns baseline/tier/channel earn and
the realized vs. face unit value. Calculator joins at compute time.

- `schema/loyalty_program.schema.json`
- `data/loyalty_programs/{airlines,hotels,retail,transit}/`
- Card-side reference: `RewardRecord.loyalty_program` (per-rewards record,
  not per-card root, so the link dates with the rest of the reward
  structure).
- Sub-decisions confirmed: per-`rewards[]` reference, `unit_value_inr.{face,realized}`
  split everywhere, `stacks_with_program` defaults to false.

Internal card currencies (EDGE Miles, MR Points, HDFC RP, SBI cashback)
**stay inline on the card** — no loyalty program file. The new schema is for
third-party programmes that exist independently of any single card.

## Q6 — Channel taxonomy (two-level)

A small closed `class` enum on `accelerated[].channel.class` for
math/UX grouping, plus an open `merchants[]` token list validated against
`data/channels/known.yaml`. Adding a merchant is a one-line PR; adding a
class is a schema change. Defaults: when `channel` object is present,
`required: true` is the default (the rate fires only if the user transacts
through one of those merchants).

`channel.class` enum:
`issuer-portal | cobrand-merchant | third-party-ota | food-delivery |
quick-commerce | fuel-network | physical | utility-rail | online-any`.

Issuer portals (smartbuy, edge-travel, ishop) are intentionally NOT mapped
from any `brand_preference` answer — those are user-behaviour toggles
deferred to a future expert-mode flag rather than a brand pick.

## Q7 — Loyalty tier UX placement

New conditional step 4 (Loyalty), inserted between the existing brand-fit
step (3) and lifestyle step (5). Renders only when the user's brand picks
imply tier-bearing programs. Defaults every program to "None"; a "skip"
affordance exists implicitly via the default. Step 4 is always optional.

Implementation: `Step4Tiers` and `impliedProgramIds()` in
`site/app/recommend/recommend-client.tsx`.

## Q8 — Internal card currencies stay inline

EDGE Miles, MR Points, HDFC Reward Points, SBI cashback are not extracted
into loyalty program files. They are not third-party programmes you can
join independent of holding the card; they live and die with the issuer's
own catalogue. Keeping them inline avoids a fake denormalization that adds
authoring overhead with no join-key benefit.

## Q9 — Migration plan

Phase 0+1+2 ship together (schema + dual-mode calculator + recommender +
one wave-1 card migrated as proof). Subsequent waves are data-only PRs:

| Wave | Program | Cards | Status |
|----|----|----|----|
| 1 | indigo-bluchip | 8 IndiGo co-brands (SBI, HDFC×2, Kotak×2, Axis×2, IDFC FIRST) | Done (axis×2, hdfc/6e-rewards, idfc-first, kotak×2, sbi×2). hdfc/6e-rewards-xl skipped (discontinued). |
| 2 | tata-neu-points | HDFC Tata Neu Plus + Infinity | Done |
| 3 | marriott-bonvoy | HDFC Marriott Bonvoy | Done |
| 4 | irctc-loyalty | HDFC + RBL + SBI IRCTC | Done |
| 5 | air-india-flying-returns | SBI Air India Platinum | Done. Future Air India Vistara cards will reference the same program. |
| 6 | Channel-only migrations | Atlas, Magnus, Infinia, Diners Black, Amazon Pay | Done for the listed cards (channel field on the channel-locked accelerator). Other SmartBuy/EDGE cards remain to migrate in subsequent PRs. |
| 7 | unit_value_inr_realized audit | All points/miles cards | Realized values are set on every migrated card via the `loyalty_program` join and on standalone cards via `base.unit_value_inr_realized`. Cards not yet touched (mostly internal-currency, e.g. EDGE Miles, MR Points, SBI cashback cards) keep the legacy single `unit_value_inr` until per-card audit. |

Validator promotions to errors (Phase 4) happen wave-by-wave once offender
count is zero per rule. The new validator additions in this PR (loyalty
ref existence, channel merchant token validity, stacks-with-program
coherence) are **errors from day 1** because they only fire when a card
opts into the new schema — back-compat preserved.

## Q10 — Score composition (recommender-only, not calculator)

Beyond ongoing rewards − fee, the recommender adds:

```
rank_total_inr =
  rewards_inr (channel-aware)
  + lounge_value
  + milestones_value
  + welcome_value (amortised over WELCOME_AMORTIZATION_YEARS)
  + premium_extras_value (only if goals.includes("premium"))
  − annual_fee_effective
  − forex_cost (only if lifestyle.recurring includes "high-forex")
```

All authoring constants live in `site/lib/recommender-constants.ts`:
- `LOUNGE_VALUE_DOMESTIC_INR = 1500`
- `LOUNGE_VALUE_INTERNATIONAL_INR = 2500`
- `WELCOME_AMORTIZATION_YEARS = 2`
- `PROXY_INTL_SPEND_INR_PER_MONTH = 15000`
- `INCOME_BAND_ANNUAL_INR` (band → ceiling)

## Q11 — Per-category transparency, no hidden mixing

(Revised from the initial 0.75/0.25 channel-mix proposal — rejected for
opacity.)

- For each category: compute `inr_used_for_rank` and (when channel-locked)
  also surface `general_value_inr`. Rendered side-by-side in the result UI.
- Rank uses channel-locked value when the user has a brand pick for that
  category; general value otherwise.
- `realized` unit value is a single midpoint scalar with a documented
  `realized_source.range` band. Math always uses one number.
- Eligibility: hard income filter; invite-only cards excluded; lounge goal
  is a hard filter; premium goal up-weights extras.
- Top 5 results, with `score_breakdown` exposed in the UI (`<details>`).

## Q12 — Tactical cleanup

| | |
|---|---|
| **12a** Type generation | Done in follow-up commit. `site/scripts/gen-types.mjs` rewritten to fan out across `card`/`issuer`/`network`/`loyalty_program` schemas; wired into `prebuild.mjs` so `site/lib/generated-types.ts` regenerates on every dev/build cycle. `types.ts` retains the consumer-facing facade (it still owns the enriched/computed shapes that aren't in any single schema) with a banner pointing at the generated file as a drift-detection reference. |
| **12b** Validator new lints | Done. Loyalty-ref existence, channel merchant token validity, stacks-with-program coherence — all hard errors when the new fields are used. Plus a category-rule warning: an accelerator whose `category` matches a known regex but lacks `canonical_categories` warns at PR time. |
| **12c** Tag canonical categories | Done in follow-up commit. `scripts/category_rules.yaml` is now the single source of truth; `scripts/tag_canonical_categories.py` and `scripts/validate.py` both read it. JS-side consolidation (have `site/lib/category-mapping.ts` read the same YAML at build time) remains a follow-up — it requires plumbing the YAML into the site bundle. |
| **12d** Loyalty program effective-dating | Deferred. Single record per file; `metadata.last_verified_on` is the freshness signal. Promote to dated arrays only when historical valuations become a real product need. |
| **12e** Co-brand vs canonical_categories | Both kept; they mean different things (partnership type vs. spend bucket). |
| **12f** /calculator UI | Unchanged. Stays at "ongoing rewards − fee" as the optimistic upper-bound. Numbers shift on migrated cards as `card_attributable_rate` and `unit_value_inr_realized` land; this is correct. |
| **12g** README docs | Done in follow-up commit. README's layout diagram lists `data/loyalty_programs/` and `data/channels/`; `prebuild.mjs` reference fixed (was `python scripts/build.py`); Vercel section notes the build pipeline is pure Node now; `docs/SCHEMA.md` has a new "Loyalty programs and channel taxonomy" section, and the validator-invariants list mentions the new lints. |

---

## What's in this PR

- `schema/card.schema.json` — new fields: `loyalty_program`,
  `unit_value_inr_realized`, `card_attributable_rate`,
  `card_attributable_per_inr`, `stacks_with_program`, `channel`,
  `earn_components`.
- `schema/loyalty_program.schema.json` — new file.
- `data/loyalty_programs/airlines/indigo-bluchip.yaml` — first program.
- `data/channels/known.yaml` — authoritative merchant token index.
- `data/cards/sbi/indigo.yaml` — migrated to new schema (proof case).
- `site/lib/types.ts` — extended (hand-authored).
- `site/lib/calculator.ts` — dual-mode reads (legacy `effective_rate` path
  preserved; new `card_attributable_rate` + program-stack path; channel
  filtering when `ctx.channelMix` is supplied).
- `site/lib/recommender.ts` + `recommender-constants.ts` — new modules.
- `site/lib/data.ts` — loads `dist/loyalty_programs.json`.
- `site/scripts/build.mjs` — emits `dist/loyalty_programs.json`.
- `site/app/recommend/page.tsx` + `recommend-client.tsx` — 5-step wizard,
  conditional Loyalty step, ranked results view with breakdowns.
- `scripts/validate.py` — loyalty schema validation, ref existence, channel
  token validity, stacks-with-program coherence.

`npm run build` succeeds; `npx tsc --noEmit` clean; `python3
scripts/validate.py` reports 0 errors / 2 pre-existing aggregator-source
warnings on the 127 cards.
