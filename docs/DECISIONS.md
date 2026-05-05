# Architectural decisions

A durable record of the design choices that shaped the recommender, the
loyalty/channel schema, and the build pipeline. Updated when a decision is
revised or superseded; not an event log.

For open work and migration backlog, see [`ROADMAP.md`](ROADMAP.md).
For schema field reference, see [`SCHEMA.md`](SCHEMA.md).

---

## Recommender

### D-1. Spend + brand prefs are the primary signal; goals frame the answer

When the three preference axes (`monthly_spend`, `brand_preferences`, `goals`)
disagree, rank by economic value computed from spend + brand prefs.
`goals` is a tie-breaker and a UX framing device, not a filter.

Exceptions:
- `goals: [lounge]` is a **hard filter** — drops cards with no lounge benefit.
- `goals: [premium]` up-weights qualitative extras (concierge, golf).

Why: spend is rupee-grounded; goals are self-reported abstractions. Ranking a
high-value points card below a poor cashback card just because the user
typed "cashback" is a disservice. See `recommend()` in
`site/lib/recommender.ts`.

### D-2. Recommender reuses `rankCards()` rather than a parallel scorer

A single source of truth for "what does this card earn on this spend"
guarantees `/calculator` and `/recommend` agree. The recommender is a thin
wrapper: pre-filter (income, lounge), call `scoreCard(card, spend, ctx)`,
post-augment with lounge / milestone / welcome valuations and forex cost.

### D-3. `/calculator` stays optimistic; `/recommend` filters by channel

The two pages have intentionally different stances:

- `/calculator` — "max possible if you book optimally". Channel-locked
  accelerators always fire. Useful as the upper-bound exploration tool.
- `/recommend` — "realistic rewards given how you actually spend". Honours
  the user's brand picks by filtering accelerators whose channel is unmet
  and showing both the channel-locked and the general-category value
  side-by-side.

Implementation: `ScoringContext.channelMix` in `site/lib/calculator.ts`.
`recommend()` runs both `ctx` (with mix) and `ctxGeneral` (empty mix); the
result UI surfaces both via `RecommendResult.per_category[].also_show`.

### D-4. Per-category transparency, no hidden mixing weights

Earlier proposal: blend channel-locked × 0.75 + general × 0.25. Rejected.

Today: rank uses channel-locked value when the user has a brand pick for
that category; general value otherwise. Both numbers are surfaced. Users
read both and judge against their own real mix. No magic constants for
"how much of your travel goes through IndiGo direct".

### D-5. Score composition

```
rank_total_inr =
  rewards_inr (channel-aware)
  + lounge_value_inr        (gated by lifestyle.lounge_pref)
  + milestones_value_inr    (cycle-aware; full credit if annual spend ≥ threshold)
  + welcome_value_inr       (amortised over WELCOME_AMORTIZATION_YEARS = 2)
  + premium_extras_inr      (only if goals.includes("premium"))
  − annual_fee_effective_inr
  − forex_cost_inr          (only if lifestyle.recurring includes "high-forex")
```

All authoring constants live in `site/lib/recommender-constants.ts`:
`LOUNGE_VALUE_DOMESTIC_INR = 1500`, `LOUNGE_VALUE_INTERNATIONAL_INR = 2500`,
`WELCOME_AMORTIZATION_YEARS = 2`, `PROXY_INTL_SPEND_INR_PER_MONTH = 15000`,
`INCOME_BAND_ANNUAL_INR` ceiling per band.

### D-6. Hard filters

Only the following drop a card from results:
- Inactive or invite-only.
- Stated minimum income exceeds the user's income-band ceiling.
- `goals: [lounge]` and the card has no lounge benefit.

`goals: [premium]` and `lifestyle.lounge_pref` are soft signals — they
shift the score, never filter.

### D-7. Loyalty-tier UX placement

Conditional step 4 ("Loyalty") in the wizard, between brand-fit and
lifestyle. Renders only when the user's brand picks imply tier-bearing
programmes. Defaults every program to "None"; always optional. See
`Step4Tiers` and `impliedProgramIds()` in
`site/app/recommend/recommend-client.tsx`.

---

## Schema

### D-8. Reward attribution is decomposed

`effective_rate` (the receipt-visible total) was conflating card +
channel-bonus + loyalty-baseline + tier earn into one number — for
co-brand cards this systematically overcredits the card by 4–5×.

New mandatory-when-applicable field: `card_attributable_rate`. This is the
math field. `effective_rate` stays as the documentary total (for marketing
copy, source verification, UI). Calculator prefers `card_attributable_rate`
when set; falls through to legacy paths otherwise — back-compat preserved.

`earn_components[]` exists as an optional richer form for accelerators
where per-source decomposition is naturally informative.

### D-9. Loyalty programs are a top-level entity, joined to cards by id

Third-party programmes (BluChip, Bonvoy, Flying Returns, NeuPass,
IRCTC Loyalty, ...) live under `data/loyalty_programs/<type>/<id>.yaml`.
Cards reference one via `rewards[].loyalty_program: <id>`.

The programme owns:
- `unit_value_inr.{face, realized}` — face is documentary, `realized` is
  the calculator's input. Single midpoint scalar; supporting band lives in
  `realized_source.range`.
- `earn.baseline` / `earn.channels[]` / `earn.tiers[]` — the parts not
  attributable to any specific card.

Cards opt into stacking via `accelerated[].stacks_with_program: true`.
When set, calculator adds programme baseline + matching channel bonus +
matching tier bonus to the card's slice.

### D-10. Internal card currencies stay inline

EDGE Miles, MR Points, HDFC RP, SBI cashback are not lifted out into
loyalty-program files. They are not third-party programmes you can join
without the card; they live and die with the issuer's catalogue. Lifting
them would be a fake denormalization.

### D-11. Loyalty program files are NOT effective-dated

Single record per file with `metadata.last_verified_on`. Programmes change
slowly and historical accuracy isn't a customer-facing decision. Promote
to dated arrays only when historical valuations become a real product
need (none currently).

### D-12. Channel taxonomy: closed `class` enum + open `merchants[]` index

Two-level structure:
- `channel.class`: closed enum used for math and UX grouping
  (`issuer-portal | cobrand-merchant | third-party-ota | food-delivery |
  quick-commerce | fuel-network | physical | utility-rail | online-any`).
- `channel.merchants[]`: open list of tokens, validated against
  `data/channels/known.yaml`. Adding a merchant is a one-line PR there;
  adding a class is a schema change.

`channel.required` defaults to `true` — when a channel object is present,
the rate fires only if the user transacts through one of those merchants.

### D-13. Co-brand category vs canonical_categories — both kept

`co_brand.category` is at the card root and means "what kind of
partnership" (`airline | hotel | retail | ...`).
`accelerated[].canonical_categories` is at the accelerator level and means
"what spend bucket this rate applies to". They overlap on co-brand cards
but mean different things.

---

## Build, types, and validation

### D-14. Types: hand-authored facade + generated reference

`site/lib/types.ts` is the consumer-facing facade — it owns the enriched/
computed types that aren't in any single JSON Schema (e.g. `EnrichedCard`,
`computed.headline_rate_pct`).

`site/lib/generated-types.ts` is auto-regenerated by
`site/scripts/gen-types.mjs` from every JSON Schema and lives in version
control. It's the drift-detection reference: when you add a schema field,
cross-check the regenerated file.

Why not pure-generated: too disruptive — generated types name things by
schema title (`CreditCardIndia`), and the consumer types add enrichment
that no schema captures.

### D-15. Single source of truth for canonical-category rules

`scripts/category_rules.yaml`. Read by:
- `scripts/validate.py` (warns on accelerators that match a rule but lack
  `canonical_categories`).
- `scripts/tag_canonical_categories.py` (one-shot bulk tagger).
- `site/lib/category-mapping.ts` via `dist/category_rules.json`
  (build-time bundling).

When you add a rule, edit one YAML file and rebuild; all three consumers
update.

### D-16. Validator new lints (errors, not warnings)

Added in this design cycle, all errors from day 1 because they only fire
when a card opts into the new schema:
- `rewards[].loyalty_program` must reference an id under
  `data/loyalty_programs/`.
- `accelerated[].channel.merchants[]` tokens must exist under the declared
  class in `data/channels/known.yaml`.
- `accelerated[].stacks_with_program: true` requires the parent rewards
  record to have `loyalty_program` set.

### D-16a. Promotion of canonical_categories and stacking-decomposition lints to errors

`accelerated[].canonical_categories` missing when `category` matches a
known regex was a warning while back-tagging was in progress; promoted to
error once `tag_canonical_categories.py --apply` reported zero changes
across all 127 cards. New cards are now expected to land tagged.

The same pass added an error for `accelerated[].effective_rate > 5` with
a `loyalty_program` set but no `card_attributable_rate`: such headline
rates almost always stack distinct sources and need decomposition (D-12)
to keep `/recommend` honest.

### D-16b. Co-brand ↔ loyalty programme alias lint (warning)

Loyalty programmes declare `co_brand_partner_aliases[]` — the substring
tokens that, when present in a card's `co_brand.partner`, mean the card
should reference the programme via `rewards[].loyalty_program`. The
validator emits a warning when a co-brand card matches but doesn't link.
Warning-tier (not error) because legitimate exceptions exist — e.g.
`hdfc/6e-rewards` earns a separate "6E Rewards" currency that
auto-converts to BluChip 1:1 at redemption rather than directly being
the BluChip programme. Discontinued cards are skipped.

### D-16c. Accelerator caps require a cycle

`accelerated[]` schema sets `dependentRequired: { cap_per_cycle:
[cycle] }`. A bare `cap_per_cycle` without `cycle` is ambiguous (`5000
points per what?`) and previously type-checked but was undefined for the
calculator. All 127 cards already comply; the dependency makes that
implicit invariant explicit.

### D-17. Build pipeline is pure Node

`site/scripts/prebuild.mjs` runs `gen-types.mjs` then `build.mjs`. No
Python required at deploy time. `scripts/validate.py` only runs in CI.

`site/scripts/build.mjs` emits five artefacts to `dist/`:
- `cards.json` — enriched cards
- `issuers.json`, `networks.json`
- `loyalty_programs.json`
- `index.json` — aggregate counts
- `category_rules.json` — surfaced from `scripts/category_rules.yaml`
