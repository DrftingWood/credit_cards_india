# Engine deep-dive log (/cc-engine-dive)

One line per unit: `YYYY-MM-DD | E# or D-id | what changed / found | commit sha | LOGGED-TO-TODO | BLOCKED + why`

2026-07-05 | setup | branch engine-dive-2026-07 created; D27-D32 backlog rows committed | 55b6426
2026-07-05 | E6/D27 | category rules already single-sourced (build.mjs emits dist/category_rules.json since 90794bb) — D27 closed, stale YAML header comment fixed | 0bcd2c9
2026-07-05 | E2 | cross-engine cap audit: calculator granted caps per-bucket (double-count) and credited zero over-cap; engine_v2 ignores base/reward caps, missing cap_unit → uncapped, selection not cap-aware | audit; fixes below + LOGGED-TO-TODO (D33/D35)
2026-07-05 | E1 | unit-safety sweep: formatAcceleratedRate ad-hoc division (Infinity% on per_inr 0), ratesFlags inline pointsToPct clone, engine_v2 ignores effective_per_inr (2x on Magnus-shaped records) | fixes below + LOGGED-TO-TODO (D32/D33)
2026-07-05 | E2+E1 fix | calculator: shared cap pool across buckets + over-cap base fallback; formatAcceleratedRate + ratesFlags through pointsToPct; 4 new tests (RED→GREEN), points-cap expectation updated 3000→3900 for deliberate semantics change; 73/73 tests, typecheck, validate.py OK, prebuild OK | 241c414
2026-07-05 | E3 | D22 sweep: pattern is ~45 active cards not 15 (4 fixed, 3 partial, 8 untouched, 34 new incl. axis-samsung-signature 10% no-channel-no-cap, sbi-bpcl-octane 25% ungated); proposed channel blocks + missing known.yaml tokens captured | LOGGED-TO-TODO (D34)
2026-07-05 | D33 (partial) | engine_v2: accel_rate() honours effective_per_inr (2x fix), effective_rate:0 semantics, card_attributable_rate preferred (D-8), cap_unit defaults to points, base floor on selection; first test file (5 asserts, RED→GREEN); smoke run + validate.py + 73/73 site tests OK. Remaining: base/reward caps, mcc_exclusions, cap-aware selection | 7bc1617
