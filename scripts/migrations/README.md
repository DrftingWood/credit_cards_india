# One-shot data migrations

A migration rewrites existing files under `data/` once (a backfill, a rename, a
reshape after a schema change). It is not a recurring check, so it does not belong
next to `validate.py` and the other tools in `scripts/`.

## Convention

From now on every one-shot data migration goes in this folder and:

- is named `YYYY-MM-DD-slug.py` (the date it was written, a short kebab-case slug);
- is **idempotent**: a second run changes nothing;
- takes a **dry-run flag** (`--dry-run`, or the script defaults to dry-run and takes `--apply`) and prints what it would change before writing anything;
- preserves comments, key order and formatting of the YAML it edits (the existing scripts use text-level insertion or ruamel for this);
- is logged in `docs/SCHEMA_CHANGELOG.md` when it goes with a schema change, and in `docs/DECISIONS.md` or the PR when it does not;
- ships with a test next to the other `scripts/test_*.py` files (CI runs every one), using fixtures and never writing to the real `data/`.

A migration PR is a data PR: it is reviewed as one and is not mixed with tooling changes
(rule PR-1 in `docs/CODING_STANDARDS.md`).

## Existing one-shot scripts (candidates to move later)

These predate the convention. They stay in `scripts/` for now and have not been moved
with `git mv`, because the data-quality review in the owner's other checkout runs them
by path, and CI and their own tests import them from `scripts/`.

| Script | What it did | Why it was not moved now |
| --- | --- | --- |
| `scripts/backfill_source_confidence.py` | Copied the per-card PROVENANCE header into `source.confidence` | Imported by `scripts/test_backfill_source_confidence.py`; run by path in the data review |
| `scripts/backfill_local_evidence.py` | Wrote `source.local_refs` and `fields_verified` from the audit docs | Imported by `scripts/test_backfill_local_evidence.py`; run by path in the data review |
| `scripts/backfill_source_type.py` | Set `source.type` from the cited URL host | Run by path in the data review |
| `scripts/tag_canonical_categories.py` | Tags accelerators with `canonical_categories` (`--apply`) | Not purely one-shot: `validate.py` tells authors to run it, and the message names this path |

`scripts/audit_stamps.py` and `scripts/audit_uncapped.py` are read-only reports, not
migrations, and stay where they are.

Moving them is a small follow-up once the data review lands: `git mv` into this
folder with a date prefix, update the imports in the tests, the path in the
`validate.py` message and any CI reference in the same PR.
