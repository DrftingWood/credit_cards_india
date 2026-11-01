# Schema changelog

Changes to the dataset schema (`schema/*.schema.json`). The current version is in
`schema/VERSION`, is copied into `dist/index.json` as `schema_version` by
`site/scripts/build.mjs`, and `python scripts/validate.py` errors if the top entry
below does not match it. No card, issuer, network or loyalty-programme YAML carries
the version.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html) applied to the data contract.

- **Major** (`2.0.0`): a breaking change. A field is removed or renamed, a type or enum value is narrowed, or a required field is added. Consumers must change.
- **Minor** (`1.1.0`): an additive change. A new optional field, a new enum value, or a new optional file kind. Existing consumers keep working.
- **Patch** (`1.0.1`): descriptions, docs and examples only. No change to what validates.

A schema change updates `schema/VERSION` and adds an entry here in the same PR. A change
that rewrites existing data adds a script to `scripts/migrations/` and is linked from
its entry.

## [Unreleased]

## [1.0.0] - 2026-11-01

Baseline. Versioning starts here; the schema as it stood on this date is described
field by field in `docs/SCHEMA.md`.

### Added

- `schema/card.schema.json`: one file per card with effective-dated `fees`, `rewards` and `benefits` arrays, each record carrying a `source` (`url`, `retrieved_on`, plus `type`, `confidence`, `local_refs`, `fields_verified`), and `metadata.last_verified_on`.
- `schema/issuer.schema.json`, `schema/network.schema.json` (with `tiers`) and `schema/loyalty_program.schema.json` (referenced from `rewards[].loyalty_program`).
- Cross-file rules enforced by `scripts/validate.py` rather than by the schemas: id and folder match filename, references resolve, dated arrays do not overlap, channel tokens exist in `data/channels/known.yaml`.
