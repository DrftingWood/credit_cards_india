# Documentation Index

This directory contains operating docs, historical audits, source evidence
indexes, and local-only PDF evidence. Use this file to decide what is current
and what is historical.

## Start Here

| File | Status | Purpose |
| --- | --- | --- |
| `TODO.md` | Current | Canonical agent task board. Pick work from here. |
| `ROADMAP.md` | Current | Short thematic roadmap. Not a task list. |
| `SCHEMA.md` | Current | Human-readable schema guide. JSON Schema files remain the source of truth. |
| `DECISIONS.md` | Current | Durable architecture decisions for schema, build, calculator, and recommender. |
| `PROVENANCE.md` | Current | Source-confidence matrix and caveats from the verification wave. |
| `LOCAL_DATA_PDF_REVIEW_2026-07-04.md` | Current review | Holistic local review of dataset, PDFs, manifests, and schema suitability. |
| `MAINTENANCE_HISTORY.md` | Current log | Durable record of merges, cleanup, branch pruning, and local maintenance. |
| `CONTRIBUTING.md` | Current | How to add or update card data. |
| `ASSETS.md` | Current | Asset and branding notes. |

## Agent Workflow

1. Open `TODO.md`.
2. Pick one task ID.
3. Read the task's listed files before editing.
4. Do not delete or move PDFs under `docs/sources/**/*.pdf`.
5. Run the task's validation commands.
6. Update `MAINTENANCE_HISTORY.md` for broad cleanup, evidence archive changes,
   branch/GitHub cleanup, or migrations.

## Historical Evidence

These files are retained as evidence and context. They are not current task
lists unless an item has been promoted into `TODO.md`.

### Broad Reviews

- `AUDIT-2026-06.md`
- `verification-notes-2026-06.md`
- `LOCAL_DATA_PDF_REVIEW_2026-07-04.md`

### Issuer Audits

- `amex-audit.md`
- `au-audit.md`
- `axis-audit.md`
- `bob-audit.md`
- `federal-audit.md`
- `hdfc-audit.md`
- `hsbc-audit.md`
- `icici-audit.md`
- `idfc-first-audit.md`
- `indusind-audit.md`
- `kotak-audit.md`
- `onecard-audit.md`
- `rbl-audit.md`
- `sbi-audit.md`
- `slice-audit.md`
- `standard-chartered-audit.md`
- `yes-audit.md`

### MCC Maps

MCC maps document issuer-specific reward interpretation and should generally be
preserved until their facts are migrated into structured data.

- `au-mcc-map.md`
- `axis-mcc-map.md`
- `bob-mcc-map.md`
- `federal-mcc-map.md`
- `hdfc-mcc-map.md`
- `hsbc-mcc-map.md`
- `icici-mcc-map.md`
- `idfc-first-mcc-map.md`
- `indusind-mcc-map.md`
- `kotak-mcc-map.md`
- `rbl-mcc-map.md`
- `sbi-mcc-map.md`
- `standard-chartered-mcc-map.md`
- `yes-mcc-map.md`

### Targeted Historical Notes

- `hdfc-pdf-verification.md`
- `PORTFOLIO-GAPS.md`

`PORTFOLIO-GAPS.md` predates the 317-card merge and must be refreshed before it
is used as current planning.

## Source Evidence

`docs/sources/` contains tracked `INDEX.md` and `_manifest.json` files plus
local-only PDFs that are ignored by git.

Rules:

- Do not delete PDFs during documentation cleanup.
- Keep source indexes and manifests in sync with any source refresh.
- Prefer structured evidence references over rewriting old audit prose.

Known cleanup targets are tracked in `TODO.md`, especially task `B2`.
