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
| `accelerated` | List of `{ category, multiplier, effective_rate, cap_per_cycle, cap_unit, cycle, canonical_categories, merchants, mcc_list }`. |
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
