# Roadmap

Last refreshed: 2026-07-04

The canonical work queue is `docs/TODO.md`. This file is only the thematic
roadmap so old phase plans do not compete with current agent tasks.

## Now

1. Make validation trustworthy locally and in CI.
2. Fix recommender/calculator overclaims:
   - no-channel channel-locked rewards,
   - merchant/MCC-specific rates applied to broad buckets,
   - lounge access valued without spend-threshold gating,
   - milestone valuation ignoring repeatability and trigger windows.
3. Normalize docs/source evidence enough that agents can pick up work without
   rereading every historical audit.

## Next

1. Add machine-readable evidence refs from YAML fields to local source files.
2. Normalize `docs/sources/*` manifests and indexes.
3. Refresh portfolio gaps against the 317-card dataset.
4. Decide network-variant modelling.
5. Replace stale or aggregator URLs with issuer-owned evidence where available.

## Later

1. Publish stable versioned data artifacts once validation and evidence mapping
   are strong enough for external consumers.
2. Keep `/calculator` as an optimistic upper-bound tool and `/recommend` as the
   realistic profile-based tool.
3. Move repeated prose knowledge from audit docs into structured schema fields
   or generated reports.

## Historical Plans

Preserved context:

- `AUDIT-2026-06.md`
- `verification-notes-2026-06.md`
- issuer `*-audit.md` files
- issuer `*-mcc-map.md` files

Before starting work from any historical file, promote the task into
`docs/TODO.md`.
