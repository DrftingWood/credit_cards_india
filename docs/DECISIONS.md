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
matching tier bonus to the card's slice. Since 2026-10-21 this happens only
on `/recommend`. Card pages and `/calculator` use programme unit values without
stacking (D-27).

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

### D-16d. `effective_rate` is receipt-visible units, never a percent

The 2026-06 audit (docs/AUDIT-2026-06.md §A1) found the three site
consumers treating `effective_rate` as an absolute percent while the
schema, this document (D-8 "documentary total"), the validator's
`effective_rate > 5` rule, and all 127 data files author it as **units of
the reward currency per ₹N** — Axis Reserve's `45` means "45 points per
₹200", not 45 %. The percent reading mis-scored 127 of 158 open
accelerators on 86 cards by 4–20×.

Decision: the data semantics win. `effective_rate` is units per
`effective_per_inr` rupees, defaulting to the record's `base.per_inr`
(`effective_per_inr` exists for the rare "35 per ₹200 on a per-₹100 card"
case). Every consumer converts through
`pointsToPct(effective_rate, effective_per_inr ?? base.per_inr,
unit_value)`; cashback unit value defaults to 1 (₹1 per unit by
definition). Cashback rates on a ₹100 basis coincide with percent — which
is why the regression survived a cashback-only test suite; the suite now
carries points-card fixtures that fail under a percent reading.

### D-18. Merchant/MCC/co-brand applicability is authored, never invented (A2)

Broad wizard buckets (online, dining, travel, …) must not earn a narrow
merchant/MCC/co-brand accelerator's rate across the *whole* bucket — a user's
"online shopping" is not all Amazon. But the dataset holds no per-merchant spend
distribution, so there is no honest way to *derive* what fraction of a bucket
routes through a given accelerator.

Decision: applicability is **author-supplied or absent — we never fabricate a
fraction.**

- The schema carries an optional `accelerated[].applicability_pct` (0–100). When
  authored from evidence, the recommender applies the elevated rate to that
  share of the bucket and the base rate to the remainder.
- A **category-wide** accelerator (no `merchants`/`mcc_list`, or a channel of
  class `online-any`/`physical`) covers the whole bucket — that is the
  accelerator's own definition, not a guess.
- A **narrow** accelerator (specific `merchants`, `mcc_list`, or a merchant-class
  channel) with no authored `applicability_pct` is **ranked at the base rate
  only** and flagged (`CardScore.merchant_rates_uncounted`, plus a user-facing
  caveat). We do not credit a narrow rate across a broad bucket on a made-up
  share.
- The optimistic `/calculator` (no `applyApplicability` in context) still treats
  the whole bucket as eligible — it answers "best case if all this spend
  qualifies"; `/recommend` sets `applyApplicability: true` for realism.

Rejected alternative: a per-channel-class table of default fractions (cobrand
0.4, portal 0.5, fuel 0.85, …). Those numbers had no evidentiary basis; a table
of six fabricated constants is worse than one honest "unknown → base only".
`applicability_pct` is the migration path to replace "unknown" with sourced
values per card.

### D-19. `mcc_exclusions` reduce score, not just disclaimers (A2)

When a card excludes an MCC family that *defines* a whole calculator bucket, the
bucket earns zero — not merely a footnote. The mapping uses standard ISO 18245
codes already present in the data's `mcc_exclusions`: `5541`/`5542`/`5983`/`5172`
→ fuel, `6513` → rent, `4900` → utilities. Multi-MCC buckets (online, dining,
travel) are *not* zeroed by a single excluded code, since one excluded MCC does
not cover the bucket.

### D-23. Value components are separate line items, valued only from data or the user (CALC-2)

Welcome benefits, spend milestones and lounge access are shown beside the
steady-state rewards, never summed into a rank (`site/lib/value-components.ts`).

- **Three totals, all labelled.** Year 1 = rewards − joining fee + welcome +
  every reached milestone + lounge. Year 2 onward = rewards − waiver-aware annual
  fee + recurring milestones + lounge. Tenure average spreads year 1 over a
  user-chosen 1–10 years (default 3 — a UI default the user changes, not a
  dataset value).
- **Welcome** counts only if its condition's explicit ₹ spend (parsed from the
  text; never guessed) is met by the user's spend over `window_days` (a year when
  no window is stated). A condition with no ₹ amount is assumed met and shown.
- **Milestones** count only when per-cycle spend reaches the trigger; multiples
  only from `max_awards_per_cycle`. A milestone that is the renewal-fee waiver
  (`reward_kind: fee-waiver`, or same spend as `fee_waiver_spend_inr` with
  "waive" in the text) adds ₹0 — the waiver-aware fee already nets it.
  Implausible awards (> 15% of trigger) are flagged, not clipped (D19).
- **Lounge** is valued only as `min(visits the user would use, allowance) ×
  ₹ a visit is worth to the user`, both user inputs that default to 0, and only
  when the card's spend threshold is cleared. The removed ₹1,500/₹2,500 per-visit
  proxies stay removed.
- All milestone/threshold checks assume all of the user's entered spend counts
  toward the trigger; issuer-specific trigger exclusions are not modelled.
- **Every rupee is itemised (added 2026-10-20, `calc/phase-2`).** Each total
  carries a `ledger`: labelled, signed, whole-rupee lines (spend rewards, fee,
  welcome, milestones, lounge) that sum exactly to the displayed total. Lines are
  rounded by largest remainder, so a ledger total equals the rounded engine total
  and no line moves by ₹1 or more. Rewards and fee lines always show; zero-valued
  optional lines are omitted. A renewal fee cleared by spend reads "waived at your
  spend", not a bare ₹0. Later phases (forex, redemption fees) add ledger lines
  rather than adjusting a total silently.

### D-24. A user's own merchant share is authored applicability (CALC-3)

D-18 refuses to invent the share of a broad bucket that goes through a narrow
(merchant / co-brand / portal) accelerator. The person whose spend it is can
state it, and that is evidence, not invention.

- `ScoringContext.merchantShares` maps a merchant token to the user's share
  (0–1). With `applyApplicability`, a narrow accelerator listing that token earns
  its rate on the share and base on the rest. Precedence: user share >
  authored `applicability_pct` > category-wide 1 > narrow-unknown → base.
- Alias tokens of one merchant (`amazon` / `amazon-pay`) take the **max** share,
  never the sum. A partner-list accelerator (Swiggy + Zomato) also takes the max,
  which can undercount a user who splits between partners. That is the
  conservative choice.
- No share is ever defaulted. An undeclared merchant stays at base.
- `/calculator` stays channel-optimistic by default (D-3). Gating on declared
  shares is an explicit opt-in (`UsageProfile.gate_calculator`). Ecosystem ticks
  are shared with the card pages' Realistic layer.
- **Loyalty tiers (added 2026-10-20, `calc/phase-3-tiers`).** The tier a user
  holds is stored as `UsageProfile.loyalty_tiers` in the same usage store. Per
  D-9 a tier bonus is programme earn, not card earn, so it is never added to
  spend rewards or the rank (`annual_net_inr`). It is a separate value-components
  line (`loyalty_tier`, ledger key `tier`) in Year 1, Year 2+ and the average.
  It is earned only on spend through the card's `stacks_with_program`
  accelerators and valued at the layer's own unit value. It is shown in every
  layer except Absolute. Programme records reach it through the narrow
  `ScoringContext.tierPrograms`, which never changes rates or unit values.
  *Updated 2026-10-21 (D-27):* the card page and `/calculator` now get the full
  `programs` map for unit values, with `stackProgramEarn: false`, and the
  declared tier travels as `ScoringContext.tierLine`, so it stays a separate
  line. Only `/recommend` puts tiers in `tierMap`, where they are stacked into
  the rate and no separate line is added.

### D-25. Authored `applicability_pct` = published market share, as a floor (D12)

D-18 allows an authored `applicability_pct` only "from evidence". The method:

1. **Evidence is a published market share** of the accelerator's merchant,
   from a company filing, regulator data or a named research firm (press
   reports of a named brokerage are acceptable; unsourced blogs are not).
2. **Within the bucket the accelerator sits in.** If the share is of a
   narrower market than the bucket (food delivery vs all dining), multiply by
   that market's published share of the bucket. If either factor is missing,
   leave the field unset (base rate + caveat, as D-18).
3. **Take the lowest current figure, rounded down** to a whole percent, and
   record source, period and denominator in a comment beside the value.
4. **It is a floor, not an estimate of the user.** A market share is a
   population average, and /recommend only counts the accelerator for users
   who picked the brand, who will usually route more than average through it.
   A user-declared share (D-24) always wins.

Applied 2026-10-20:

| Card / accelerator | Bucket | Value | Derivation |
|---|---|---|---|
| `icici-amazon-pay` Amazon.in Prime 5% and non-Prime 3% | online | 25 | Amazon India 25-30% of e-commerce GMV (ICICI Securities, FY25 market; Entrackr, 14-May-2026), lower bound |
| `hdfc-swiggy-hdfc` Swiggy ecosystem 10% | dining | 3 | Swiggy 42% of food-delivery GOV (Motilal Oswal Q1 FY25 via Inc42, 20-Nov-2024; Bernstein Jan-2025) x online delivery ~8% of food services (Bernstein Jan-2025; Swiggy-Bain's 12% not used) = 3.4% |

Left unset, with reasons:

- `icici-amazon-pay` Amazon Pay partners 2%: no share data for the partner set.
- Tata Neu cards (HDFC and SBI Infinity/Plus), partner-brand accelerators in
  the online bucket: no 2024-26 published share for Tata Neu, Tata CLiQ,
  Croma or IHCL; BigBasket (2022) and 1mg (2023) figures are stale; Air
  India's DGCA domestic share (23.9-26.7%, Jun-Aug 2026) is a travel-market
  figure and the accelerator sits in online.
- Swiggy HDFC 5% online-MCC accelerator: an MCC accelerator, not a co-brand
  merchant; out of D12's scope.

Sources: https://entrackr.com/report/flipkart-leads-gmv-maus-as-india-e-comm-market-may-hit-214-bn-by-fy30-icici-securities-11833061 ;
https://inc42.com/?p=487118 ;
https://ts.yourstory.com/2025/01/swiggy-food-delivery-quick-commerce-market-share-bernstein-brokerage ;
https://cwv.yourstory.com/2024/07/online-food-delivery-make-up-one-fifth-food-services-market-fy31-study .
Re-check yearly; food-delivery and e-commerce shares move a few points a year.

### D-26. Forex markup is a cost that lowers the rank (CALC-4 B1)

Accepted by the owner on 2026-10-21. A card's `forex_markup_pct` is charged on
the user's international spend and **subtracted from the ranking total**, not
just shown beside it. Unlike a welcome bonus or a milestone, the markup is a
recurring cost that grows with spend. Before this, a 3.5%-markup card could
outrank a 0%-markup card for someone who spends heavily abroad.

- **Formula.** `international monthly spend × 12 × forex_markup_pct / 100 ×
  (1 + GST)`. It is `annual_forex_inr` on `scoreCard` and `explainCard`.
  `annual_net_inr` (the /calculator rank, and the /recommend rank via
  `scorer-decoupled`) is now rewards − effective annual fee − forex.
- **GST is an assumption, not yet verified.** The GST rate on the markup is
  one named constant, `GST_ON_FOREX_MARKUP = 0.18` in `site/lib/calculator.ts`.
  It assumes the usual 18% GST on card fees and charges. The rate and the
  practice of charging GST on the markup amount still need checking against an
  issuer MITC or a CBIC source before this ships. GST is added only when the
  fee record's `gst_applicable` is not `false`. No active card sets it to
  `false` today.
- **Every rupee is on the ledger.** The Year 1, Year 2+ and tenure-average
  totals each get a negative `forex` line, labelled "Forex markup on
  international spend (x% + 18% GST, assumed)". It appears only when the cost is
  non-zero, so a 0%-markup card or a user with no international spend sees no
  line.
- **Missing data stays at ₹0 and is labelled.** A card with no stated markup
  (one active card, `equitas-selfe`) is charged ₹0. When the user has
  international spend, the card gets the disclaimer "Forex markup not stated,
  counted as ₹0". No markup is guessed.
- **Not covered yet.** The `/recommend` wizard sends no international spend
  unless an exact spend is passed, so its rank only moves when that happens.
  The portfolio optimiser (`site/lib/portfolio.ts`) still nets only rewards
  and fees. Cross-currency or DCC surcharges are not modelled.

### D-27. Card pages and /calculator use programme unit values, not programme earn

Accepted by the owner on 2026-10-21, after the review of the 19 co-brand cards
in `docs/PROGRAMME-VALUES-REVIEW-2026-10-21.md`. The card page and `/calculator`
now receive the full loyalty-programme records (`ScoringContext.programs`), as
`/recommend` already did. A co-brand card's points are valued at the
programme's `unit_value_inr` (D-9), so one programme file sets the value for
every card linked to it.

- **Programme data was corrected first.** Four programme files were stale or
  broke the closed-loop rule. Each fix cites its source beside the value:
  - IndiGo BluChip: 0.45 realized / 0.60 face.
  - Air India Maharaja: 0.55 / 0.70.
  - IRCTC and Tata NeuCoins: realized 1.0.

  After the fixes, the realized value of all 19 linked cards is unchanged.
  Marriott Bonvoy's face value goes from 0.80 to 0.85, which affects only the
  Absolute layer.
- **A card can opt out of programme unit values.** The rewards field
  `unit_value_from_program: false` is for a card that earns its own currency and
  converts it into the programme's at a ratio other than 1:1. `bob-irctc` (4
  BOBCARD points = 1 IRCTC point) is the only card that sets it. Before this,
  `/recommend` valued its points at ₹0.95 instead of ₹0.18.
- **Programme earn stays out of the rank on these pages.** They pass
  `stackProgramEarn: false`, so D-9 stacking (programme baseline + channel +
  tier earn on `stacks_with_program` accelerators) is not added. That earn comes
  with programme membership whichever card pays, so crediting it to the co-brand
  card brings back the overcredit D-8 removed. Stacking would have moved
  `kotak-indigo` on /calculator from ₹3,900 to ₹16,860 (rank 169 to 36). This
  also matches D-24's rule for tiers. A declared tier is still its own ledger
  line, now carried in `ScoringContext.tierLine`. `tierMap` (stacked into the
  rate) is used only by the `/recommend` wizard.
- **Open question for the owner.** `/recommend` still stacks programme earn
  (D-9). On a ₹20k online + ₹20k travel profile, `kotak-indigo` nets ₹15,780 on
  /recommend and ₹3,900 on /calculator. Decide whether /recommend should also set
  `stackProgramEarn: false`, which would retire D-9 stacking in the rank, or
  keep it on as the wizard's "everything you'd receive" view.
- `site/lib/program-values.test.ts` pins the 19 cards' values on live data.
  Linking a new card to a programme, or changing a programme value, means
  updating that test and the review doc.

### D-17. Build pipeline is pure Node

`site/scripts/prebuild.mjs` runs `gen-types.mjs` then `build.mjs`. No
Python required at deploy time. `scripts/validate.py` only runs in CI.

`site/scripts/build.mjs` emits five artefacts to `dist/`:
- `cards.json` — enriched cards
- `issuers.json`, `networks.json`
- `loyalty_programs.json`
- `index.json` — aggregate counts
- `category_rules.json` — surfaced from `scripts/category_rules.yaml`

## Schema

### D-20. Network variants: one file per *materially different* variant

A card issued on more than one network (Visa/Mastercard/RuPay/Amex/Diners) is
common in India. The schema is one-product-per-file with a single `network` +
optional `network_tier`. Decision on when a second network becomes a second file:

- **Default — one file.** If the alternate network does not change any *scored*
  term (earn rate, caps, fees, forex, lounge/benefit mechanics), keep a single
  file keyed by the primary network and note the alternate in `notes`. Most
  Visa↔Mastercard pairs fall here.
- **Split into a separate file** when the alternate network materially changes a
  scored term. The archetype is a **RuPay-UPI variant** — extra earn on UPI
  spend, different caps — which is effectively a different product. The variant
  gets its own `id`/slug with a network suffix (`<base>-rupay`, `<base>-amex`)
  and reuses every existing mechanism (dated records, applicability, caps); the
  base file's `notes` point at it. This matches what the data already does (e.g.
  `data/cards/hdfc/tata-neu-infinity.yaml` notes "the RuPay variant is tracked as
  a separate card if added").
- **No `variants[]` schema array.** A nested variant array would complicate the
  effective-dated model, the calculator, and the site for a handful of cards. The
  split-on-material-difference rule is strictly simpler and needs no schema churn.

Rejected: (a) always-separate — explodes the catalogue with near-duplicate
Visa/Mastercard files; (b) a `variants[]` field — schema/calculator/site churn
for little gain.

Follow-up migrations (tracked in `docs/PORTFOLIO-GAPS.md`):
- **Open** — HDFC Tata Neu Infinity/Plus RuPay-UPI variants: materially different
  earn → candidates for `-rupay` files (currently noted in the Visa files).
- **Open** — ICICI Coral/Rubyx/Sapphiro Amex variants: verify whether lounge/MCC
  terms differ materially; split only if they do.
- **Closed** — cards that merely note an alternate network with identical scored
  terms stay single-file (the default above).

### D-21. Reward-rule provenance: inherit by default, grade always, enforce on opt-in

Every reward *rule* (a record's `base`, and each `accelerated[]` entry) must be
traceable to a source URL and the date it was read. Reward records already
require `source.url` + `source.retrieved_on`, so the schema change is small:

- `accelerated[].source` is an **optional** `Source`. When absent the rule
  **inherits** the parent record's `source`; set it only when the rule was
  verified against a different document or on a different date.
- `Source` gains optional `verified_by` (who) and `method`
  (`manual-read | pdf-extract | rendered-page | crawl-diff | secondary`, how).
- `base` gets no own `source`: the record's source *is* the base rule's source.

`scripts/provenance.py` grades each rule's effective source on every
`validate.py` run and prints a coverage block. Gaps are split in two tiers:

- **Hard** (broken or contradicted: no url/date, non-http, bare-homepage URL,
  or an inherited source whose `fields_verified` lists reward paths that do not
  cover the rule) — **warning** by default, one line per card.
- **Soft** (thin: no `type`, no `confidence`, `retrieved_on` older than 180 days,
  aggregator host) — counted in the coverage block only.

`--strict-provenance` (or `STRICT_PROVENANCE=1`) makes every gap on an open
record of an active/invite-only card an **error**. Strict mode is opt-in until
coverage is high enough to promote it, following the warn → error promotion
pattern of D-16a/D-16b. Inheritance is computed, not materialised: copying the
record source onto ~400 accelerators would add no information and would make the
copies look independently verified.

Rejected: a new `verified_on` key (it would duplicate `retrieved_on`, whose
meaning — the date the source was read — is already documented); a required
per-rule source (would fail all 320 cards today).

---

## Site

### D-28. /browse renders per request so page N can carry its own canonical

`/browse` pages the filtered list at 24 per page (`?page=N`, `view=table` for the
opt-in dense table). Page 2+ should be indexable with a self-referencing
canonical, and a canonical in the initial HTML needs `generateMetadata` to read
`searchParams`. Reading `searchParams` makes the route dynamic: the build shows
`ƒ` instead of `○`. Canonicals: unfiltered `?page=N` is its own canonical
(clamped to the last page); page 1, any filtered URL and any `view` URL
canonicalise to `/browse`. `?page=` URLs are not in the sitemap.

Cost accepted:

- No CDN caching by default (each request renders).
- Paging is client-side over the filtered list. The DOM drops from about 8,847
  nodes to about 1,060 (346 tiles to 24), but the RSC payload does not shrink:
  the full card list is still shipped to the client.

Follow-ups considered, not done: a CDN `s-maxage` on the response, or a
path-based `/browse/page/[n]` with `generateStaticParams` (static again, but
filters would need a different URL story). The owner can revisit.

### D-29. TypeScript 5.9 -> 6.0.3, not 7 (2026-11-01, Task 11a)

Change: `site/package.json` `typescript` `^5.6.3` -> `~6.0.3` (installed 5.9.3 -> 6.0.3;
6.0.3 published 2026-04-16 per the npm registry). `site/tsconfig.json` gains
`"noUncheckedSideEffectImports": false`: TS 6.0 defaults it to true, which made
`import '../styles/globals.css'` in `app/layout.tsx` fail (TS2882, the only new
error, no source changes). Task 4 strictness flags are untouched.

Why 6.0, not 7: TypeScript 7.0.2 (native port, released 2026-07-08) is `latest`,
but `@typescript-eslint/*` 8.59.0 (pulled in by `eslint-config-next` 15.5.15)
declares `typescript >=4.8.4 <6.1.0`, and `json-schema-to-typescript` 15 the same
range. 7 would break type-aware lint and force `--legacy-peer-deps`. Compatible
with 6.0: Next 15.5.15 (no TS peer), `eslint-config-next` (`>=3.3.1`), vitest 4.1.7,
`@types/node` 22. Revisit when typescript-eslint supports 7 (keep `~6.0` until then).

Rollback: `git revert <11a commit sha>` (restores `package.json`, the lockfile and
`tsconfig.json` together), then `npm ci` in `site/`.
Next TS step: TypeScript 7 once typescript-eslint and json-schema-to-typescript
declare support. Next in the order of Task 11: Tailwind 4.

### D-30. Tailwind CSS 3.4 -> 4.3.3, config moved into CSS (2026-11-01, Task 11b)

Change: `tailwindcss` `^3.4.15` -> `4.3.3` (published 2026-07-16, still `latest` and
more than two weeks old on 2026-11-01; `npm view tailwindcss dist-tags time`),
new `@tailwindcss/postcss` `4.3.3` (same date), `tailwind-merge` `^2.5.4` -> `3.7.0`
(2026-09-12, the line that understands Tailwind 4 class names). Removed
`autoprefixer` and the explicit `postcss` devDependency (Tailwind 4 prefixes
itself and brings `postcss`). Versions are pinned exactly. Sources: the official
guide https://tailwindcss.com/docs/upgrade-guide (renamed utilities, ring width,
default border colour, button cursor, space-/divide- selectors, hover media
query, `@import "tailwindcss"`); the owner's debate_cv repo for the Tailwind 4 setup.

Shape: `tailwind.config.ts` is gone. `styles/globals.css` imports Tailwind with
`source(none)` plus three `@source` lines that equal the old `content` globs, and
declares `@custom-variant dark` for `[data-theme="dark"]`. New `styles/theme.css`
holds every mapping: colours, spacing aliases and the elevation scale in
`@theme inline`, the literal tokens (fonts, tracking roles, `--container-page` /
`--container-prose`, type scale with line heights, radius) in `@theme static`.
`postcss.config.js` uses `@tailwindcss/postcss`.

Deviations from "just run the upgrade tool" (all chosen to keep rendering identical):
1. Colour channels in `tokens.css` renamed `--color-*` -> `--rgb-*`. Tailwind 4
   turns a theme variable named `--color-canvas` into `bg-canvas`, so the channel
   variable and the theme variable cannot share a name (a self-reference, which
   Tailwind emitted as a cycle). Values are unchanged; theme.css wraps them as
   `rgb(var(--rgb-x))`, so `bg-surface/90` still works (Tailwind 4 applies the
   alpha with `color-mix()`). The same collision moved the type, radius,
   container, tracking and font tokens out of `tokens.css` `:root` into theme.css.
2. Our scale names are kept, not renamed to Tailwind 4's: `shadow-sm`/`shadow`/
   `shadow-md`/`shadow-lg` still mean elevation 1-4, `rounded-sm` is still 2px and
   bare `rounded` 4px. Only `outline-none` -> `outline-hidden` (9 sites) and
   `drop-shadow-sm` -> `drop-shadow-xs` (1 site) are renames. Re-declared v3
   values that v4 changed: `drop-shadow-md`, and the 11 palette shades the code
   uses (v4 ships oklch), so the amber card art does not shift.
3. Compat rules in `globals.css`: pointer cursor on enabled buttons, 1px `td/th`
   padding (preflight 4 zeroes it; cells with only some padding sides relied on it),
   and link hover colour (v3's `a:hover` outranked plain `text-*` utilities by
   specificity; v4's cascade layers would drop that).
4. Class changes forced by v4 semantics: `bg-gradient-to-br` -> `bg-linear-to-br/srgb`
   (v4 interpolates gradients in oklab by default); `md:leading-9` on the card h1 and
   `sm:leading-5` on the card-art name (v4 `leading-*` now beats a later
   `text-*` line-height); `info-grid` and `pros-cons` separators written out per
   cell instead of `divide-*` (selector and specificity changed); the JSON-LD
   `<script>` moved to be the first child of the card `<article>` (`space-y-*` now
   puts the gap below every child but the last, so a trailing hidden element added
   20px).
5. `cn()` uses `extendTailwindMerge` with `tracking-label`, `tracking-heading`,
   `max-w-page` and the `p-card`-style spacing aliases (deferred review finding;
   before, `cn("tracking-wide","tracking-label")` kept both). Covered by tests in
   `lib/utils.test.ts`; keep that list in step with theme.css.
6. One intended visual change: input placeholder text. The `::placeholder`
   rule in globals.css pins the 4.5:1 token `--rgb-fg-placeholder`, but under v3
   preflight's `input::placeholder { color: #9ca3af }` (higher specificity) won, so
   the token never rendered on inputs. Under v4 it does (darker, passes SC 1.4.3).
   About 330 px per search box. Revert by deleting the rule if the owner prefers the
   old grey (not recommended; it fails contrast).
7. Latent v3 quirk preserved on purpose: in the card page info grid, `md:divide-y-0`
   outranked `md:border-b`, so only the first cell ever got a bottom rule at md and up.
   The classes now say that explicitly. The evident intent (a rule under every
   row but the last) is a one-line change for the owner to decide.

Rollback: revert the single 11b commit (subject "chore(site): upgrade Tailwind CSS to 4.3.3,
config in CSS (D-30)"), then `npm ci` in `site/`. It restores `package.json`, the lockfile,
`tailwind.config.ts`, `postcss.config.js` and the CSS together.


### D-31. Next.js 15.5.15 -> 16.4.2, React 19.3.1, flat ESLint (2026-11-01, Task 11c)

Change (all pinned exactly): `next` `^15.1.0` -> `16.4.2` (installed 15.5.15), `eslint-config-next`
`^15.1.0` -> `16.4.2` (same version as next), `react` and `react-dom` `^19.0.0` -> `19.3.1`
(installed 19.2.5), `@types/react` `19.3.0`, `@types/react-dom` `19.3.0` (were `^19.0.0`).
Removed the `@eslint/eslintrc` devDependency (it existed only for FlatCompat).

Version choice (registry `npm view next time`, GitHub releases and advisories, read 2026-11-01):
16.4.1 (2026-10-14) is the security release (GHSA-2464-fhr4-w9xw image optimisation RCE with SVG,
GHSA-673q-mjm6-r5xr `use cache` RCE, GHSA-p3m5-59mp-jv5r Server Actions DoS); 16.4.2 (2026-10-15,
17 days old) is bug-fix backports on top and includes those fixes; 16.4.3 (2026-10-23, 9 days old) is
bug-fix backports only (no advisory; the list at
https://github.com/vercel/next.js/security/advisories has none fixed in 16.4.3), so by the two-week rule
it waits. The 16.4.3 Google-font fix (extensionless font URLs, #100277) is not hit: `next/font/google` builds
and the rupee glyph renders on 16.4.2. Bump to 16.4.3 (or later) once it is 14 days old, 2026-11-06.
Release notes: https://github.com/vercel/next.js/releases/tag/v16.4.2 and `v16.4.3`.
React 19.3.1 (2026-10-14, same-day security release as Next 16.4.1) is within `next`'s
peer range `^19.0.0`; the App Router runs on the React copy Next bundles either way.
Upgrade guide followed: https://nextjs.org/docs/app/guides/upgrading/version-16 (last updated 2026-10-15).

Checked against this repo (guide section: result): async request APIs: `params` and `searchParams` were
already `Promise` props awaited (`card/[issuer]/[slug]/page.tsx`, `browse/page.tsx`), no
cookies/headers/draftMode use; the `upgrade` codemod (`npx @next/codemod@canary upgrade 16.4.2`,
run in a copy outside the repo) changed no source except inserting `export const instant = false`
Cache Components opt-outs in 9 pages and bumping versions plus `overrides`; none applied, since
`cacheComponents` is not enabled. No `middleware.ts` (proxy rename n/a), no parallel routes, no AMP,
no `next/legacy/image`, no `images` config (the three `next/image` uses are local static files,
default `qualities` [75] and `minimumCacheTTL` do not matter), no `experimental.*`, no
`scroll-behavior` CSS, no `revalidate`/tag caching, `next lint` already replaced by `eslint .`. Node 24 and
TypeScript 6.0.3 satisfy the minimums (20.9, 5.1).

Changes forced by Next 16:
1. Turbopack is the default for `dev` and `build`. `lib/data.ts` imports `../../dist/*.json`, which
   prebuild writes at the repo root, above `site/`. Turbopack rejects imports outside its root (Module not
   found), so `next.config.mjs` sets `turbopack.root` and `outputFileTracingRoot` to the repo root. No
   `--webpack` fallback was needed.
2. `tsconfig.json`: `jsx` `preserve` -> `react-jsx` and `.next/dev/types/**/*.ts` added to `include`; Next
   makes both edits itself on every build, so they are committed in compact form to keep the tree clean.
3. `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` and `/typescript` (native flat arrays)
   instead of FlatCompat. The five size/complexity rules, `_` unused-vars patterns, phosphor
   `no-restricted-imports` and icons override, and ignores are unchanged; `lintWarnings` stays 116.
   `knip.json` no longer needs `ignoreDependencies: eslint-config-next` (imported directly now).

Deferred owner decision: eslint-config-next 16 adds react-hooks 7 rules. One fires,
`react-hooks/set-state-in-effect` (4 sites: `app/browse/browse-client.tsx:49`,
`app/compare/compare-client.tsx:34`, `components/beta-banner.tsx:18`, `components/theme-toggle.tsx:25`; each
sets state in an effect after hydration on purpose). It is set to `warn` with a comment in
`eslint.config.mjs`, not rewritten, to keep the upgrade behaviour-neutral. The ratchet counts only the five
size rules, so these 4 warnings are not baselined; fixing means `useSyncExternalStore` or derived state.

Behaviour verified (built server, base e9afdea vs this change): `/browse?page=2` canonical `.../browse?page=2`,
`?page=999` -> `?page=15`, `/browse` bare, unchanged; `/browse` still `ƒ` (dynamic per request, D-28), other
routes `○`/`●` as before (card page still 365+3 paths); JSON-LD still in card HTML (2 script tags);
sitemap.xml (353 `<loc>`), robots.txt, og.png (200) unchanged; Inter and the rupee glyph render. Playwright
a11y smoke: identical (`/` 1, `/browse` 1, `/compare` 1, `/calculator` 3 violations). 64 screenshots
(8 pages x 4 widths x light/dark): 0 pixel differences. Two non-visual differences: on `/browse`, `<title>`,
`<meta>` and canonical `<link>` are now in `<head>` (Next 15 streamed them in `<body>` for this dynamic
route; better for crawlers), and Chromium serialises gradient stops as `0%` instead of `0px` (same rendering).
The build summary no longer prints Size or First Load JS (removed by Next 16), and counts 380 prerendered
pages against 381 before (the old count included one internal page); the route set is the same.

Rollback: revert the single 11c commit (subject "chore(site): upgrade Next.js to 16.4.2 and React to
19.3.1, native flat ESLint (D-31)"), then `npm ci` in `site/`. It restores `package.json`, the lockfile,
`next.config.mjs`, `eslint.config.mjs`, `knip.json`, `tsconfig.json` and the doc mentions together.
