# Schema reference

Source of truth: `schema/*.schema.json`. This page is a narrative walkthrough.

## File layout

```
data/
  networks/<network>.yaml        # visa, mastercard, rupay, amex, diners
  issuers/<issuer>.yaml          # hdfc, icici, sbi, axis, ...
  cards/<issuer>/<slug>.yaml     # one file per card
```

Constraints enforced by `scripts/validate.py`:

- A card's `id` must equal `<issuer>-<slug>`.
- The file lives at `data/cards/<issuer>/<slug>.yaml`.
- `issuer` and `network` must reference existing files.
- `network_tier`, if set, must appear in that network's `tiers` list.

## Effective-dated arrays

`fees`, `rewards`, and `benefits` are **arrays of dated records**, not single objects. Every record has:

- `effective_from` (required, ISO date)
- `effective_until` (required, ISO date or `null`)
- `source.url` + `source.retrieved_on` (required)

For an `active` or `invite-only` card, exactly **one** record in each array must be open-ended (`effective_until: null`). Records must not overlap.

**Updating a value** (e.g. annual fee changed on 2025-03-01):

1. Set `effective_until: 2025-02-28` on the current open record.
2. Append a new record with `effective_from: 2025-03-01`, `effective_until: null`, and the new values.
3. Don't edit the old record's values — they're historical truth.

## Card sections at a glance

### Identity
| Field | Notes |
| --- | --- |
| `id` | `<issuer>-<slug>`, lowercase-kebab. |
| `name` | Official marketed name. |
| `issuer`, `network`, `network_tier` | Cross-referenced to seed files. |
| `tier` | `entry` / `mid` / `premium` / `super-premium` / `invite-only`. Market positioning. |
| `card_type` | `credit` (default), `charge` (e.g. Amex Platinum charge), `secured`. |
| `co_brand` | `null` or `{ partner, category, partner_website }`. |
| `status` | `active` / `invite-only` / `on-hold` / `discontinued`. |

### Fees (array of records)
Joining, annual, waiver rule, forex markup, finance charge, cash-advance, late-payment slabs, over-limit fee, GST applicability.

Late-payment slabs use `up_to_inr` (integer) or `"any"` for the top slab.

### Rewards (array of records)
| Field | Notes |
| --- | --- |
| `currency` | `points` / `cashback` / `miles`. |
| `base` | `{ rate, per_inr, unit_value_inr }` — `unit_value_inr` is best-case INR value of one unit, used for comparability. |
| `accelerated` | List of `{ category, multiplier, effective_rate, effective_per_inr, cap_per_cycle, cap_unit, cycle, canonical_categories, merchants, mcc_list }`. |
| `accelerated[].effective_rate` | **Units of the reward currency per `effective_per_inr` rupees** (default basis: the record's `base.per_inr`) — the receipt-visible total, e.g. `45` for "45 points per ₹200". **Not a percent.** Consumers convert to a value percentage via `pointsToPct(effective_rate, effective_per_inr ?? base.per_inr, unit_value)`. For cashback (1 unit = ₹1, basis ₹100) the number coincides with a percent. |
| `accelerated[].canonical_categories` | **Optional.** One or more of the canonical spend buckets (`online`, `groceries`, `dining`, `fuel`, `travel`, `utilities`, `rent`, `international`, `entertainment`, `government`, `insurance`, `education`, `wallet-loads`, `emi`, `other`). The reward calculator uses these to match against a user's spend profile. If omitted, the calculator falls back to heuristic substring matching on the freeform `category` string — prefer tagging new entries. |
| `exclusions` | Controlled list (fuel, rent, government, ...). |
| `capping_rules` | Freeform strings for caps not expressible structurally. |
| `redemption` | Options: statement-credit, catalog, airmiles, voucher, etc.; can include `transfer_partners[]` details for partner-level conversion rules. |
| `redemption_floor_value_inr` / `redemption_ceiling_value_inr` | Conservative vs best-case value range per reward unit. |

### Benefits (array of records)
Lounge access (domestic/international, with optional `spend_threshold_inr` + `spend_threshold_cycle` for cards that gate visits behind prior-cycle spend — common post-2024), golf, milestones, welcome, insurance, fuel-surcharge waiver, dining, movies, concierge, and an `other[]` escape hatch.

Milestones support both human-readable and structured payout metadata (`reward_kind`, `reward_units`, `trigger_window`, repeatability controls) so analytics consumers can compute milestone value without parsing prose.

### Eligibility, Application, Metadata
Age, income (salaried/self-employed separately), credit-score minimum, residency; apply/pre-approval URLs and `replaces_card` (for upgrade paths); `last_verified_on` + `maintainers` + `tags`.

## Loyalty programs and channel taxonomy

`schema/loyalty_program.schema.json` models third-party programmes (BluChip,
Bonvoy, Flying Returns, ...) as denormalised peers of cards. Files live
under `data/loyalty_programs/<type>/<id>.yaml` and carry:

- `unit_value_inr.face` and `unit_value_inr.realized`. Calculator math uses
  `realized` (a single midpoint scalar); `face` is documentary. The
  optional `realized_source` block captures method, observed range, and
  sources for review.
- `earn.baseline` / `earn.channels[]` / `earn.tiers[]` — what any member of
  the programme earns regardless of which credit card. Cards reference the
  programme via `rewards[].loyalty_program: <id>`.
- `co_brand_partner_aliases[]` — substring tokens (case-insensitive) that
  identify a co-brand card as belonging to this programme. The validator
  warns when a card with a matching `co_brand.partner` doesn't reference
  the programme via `rewards[].loyalty_program`.

A card-side accelerator can opt into stacking via:

```yaml
accelerated:
  - category: indigo-flights-direct
    canonical_categories: [travel]
    card_attributable_rate: 3       # the card's own contribution per ₹100
    card_attributable_per_inr: 100
    stacks_with_program: true       # add programme baseline+channel+tier on top
    channel:
      class: cobrand-merchant
      merchants: [indigo-app, indigo-web]
```

The legacy `effective_rate` field stays as the receipt-visible total (useful
for marketing copy and source verification). Calculator math prefers
`card_attributable_rate` when present, falling back to `effective_rate`
otherwise — so existing untagged cards keep working until migrated.

`channel.class` is a closed enum (issuer-portal, cobrand-merchant,
third-party-ota, food-delivery, quick-commerce, fuel-network, physical,
utility-rail, online-any). `channel.merchants[]` is an open list of tokens
that must exist under that class in `data/channels/known.yaml` — adding a
new merchant is a one-line PR there, not a schema change.

## Validator invariants

Run `python scripts/validate.py` locally; CI runs it on every PR.

- JSON Schema conformance for every file.
- `id` matches filename; file lives under the right issuer folder.
- `issuer` / `network` exist; `network_tier` is a declared tier.
- Dated arrays: sorted by `effective_from`, no overlapping ranges, exactly one open-ended record for active cards.
- `application.replaces_card` points to a known card id.
- `status: discontinued` ⇒ `discontinued_on` set.
- `metadata.last_verified_on` older than 180 days ⇒ warning (non-blocking).
- `metadata.last_verified_on` earlier than any nested `source.retrieved_on` ⇒ error.
- `application.apply_url` / `application.pre_approval_check_url` must use `http(s)`; off-allowlist domains warn.
- Optional URL checks (`python scripts/validate.py --check-urls`) perform best-effort reachability checks for `source.url` + application URLs.
- `rewards[].loyalty_program` must reference an id under `data/loyalty_programs/`.
- `accelerated[].channel.merchants[]` tokens must exist under the declared class in `data/channels/known.yaml`.
- `accelerated[].stacks_with_program: true` requires the parent rewards record to have `loyalty_program` set.
- An accelerator whose `category` matches a known regex in `scripts/category_rules.yaml` but lacks `canonical_categories` errors out (run `scripts/tag_canonical_categories.py --apply` to bulk-tag).
- An accelerator with `loyalty_program` set, `effective_rate > 5`, and no `card_attributable_rate` errors out — the headline rate almost certainly stacks distinct sources and needs decomposition.
- A card whose `co_brand.partner` matches a loyalty programme's `co_brand_partner_aliases[]` but doesn't reference that programme in any `rewards[].loyalty_program` warns. Discontinued cards are skipped.
- An `accelerated[]` entry with `cap_per_cycle` must also set `cycle` (schema-enforced via `dependentRequired`).
