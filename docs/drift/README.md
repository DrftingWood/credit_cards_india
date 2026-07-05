# Drift detection (`docs/drift/`)

Reports and baselines from the dataset's drift-detection tooling. These are
**evidence artifacts**, not a task list — promote anything actionable into
`docs/TODO.md`.

## `scripts/crawl_diff.py` — crawl-diff (D29)

Presence-checks each active card's live source page against the card's own
literal YAML values. It does **not** scrape or parse the page into a schema — it
hunts the rendered page text for the numbers the YAML already claims (annual /
joining fee, base "X per ₹Y" rate, forex %, accelerator caps), exactly like the
manual issuer audits did by hand. Cheap, layout-robust, rate-limit friendly.

### Run

```powershell
$env:PYTHONIOENCODING='utf-8'; $env:PYTHONUTF8='1'
& C:\Python314\python.exe scripts/crawl_diff.py --issuer hsbc --date 2026-07-05
```

- One issuer per invocation (kind to issuer servers; `.bank.in` redirects are
  logged as drift).
- `--date` is required and passed explicitly — the script takes no wall clock so
  runs stay reproducible.
- Renders each page with Playwright (`domcontentloaded`, 15 s); most issuer pages
  are JS-only, so a plain fetch would miss everything.
- Writes `docs/drift/<issuer>-<date>.md`, one row per card per field.
- **Exit code:** `0` when every field is MATCHED / NOT-FOUND / SKIPPED / DRIFT;
  `1` only when at least one field is `CONFLICTING-NUMBER-NEARBY` (wire this into
  CI or a scheduled run to fail loudly on a real number change).

### Reading a report

| status | meaning |
| --- | --- |
| `MATCHED` | the YAML value's literal digits appear on the page (Indian-comma tolerant: `2999` matches `2,999`). |
| `NOT-FOUND` | neither the value nor a conflicting number near the field keyword — usually the page is JS-gated, expresses the value differently (e.g. cashback `%` vs `X per ₹Y`), or hides it behind a click. **Not** a failure. |
| `CONFLICTING-NUMBER-NEARBY` | the field's keyword (e.g. "annual fee") appears within 80 chars of a **different** number than the YAML claims → likely real drift, investigate. |
| `DRIFT` | the page redirected to a different host than `source.url` (e.g. a `.bank.in` migration). |
| `SKIPPED` | no `source.url`, or the render failed (network/timeout) — never crashes the run. |

Treat `NOT-FOUND` as "couldn't confirm from this page", not "wrong". Only
`CONFLICTING-NUMBER-NEARBY` and `DRIFT` rows warrant a data check.

### Tests

`scripts/test_crawl_diff.py` unit-tests the pure core (`expectations_for`,
`check_page`) with no network. Run: `python scripts/test_crawl_diff.py`.

## Other files here

- `uncapped-baseline-2026-07.txt` — `scripts/audit_uncapped.py` D20 baseline.
- `D20-deferrals-2026-07.md` — cap items needing dedicated follow-up.
- `<issuer>-<date>.md` — crawl-diff reports.
