# American Express India — source verification (2026-07-04)

Amex serves fees/rewards as HTML on americanexpress.com/in (Playwright reads it; WebFetch is blocked). No downloadable per-card PDFs.

## Verified
- **MRCC** (Membership Rewards Card): first-year fee Rs.1,000, second-year Rs.4,500 (waived/50% on Rs.1.5L spend), Welcome Gift 4,000 MR -- all match YAML.

Amex had a thorough audit (PR #43) with MR realized values sourced and slug/partner/fee corrections already applied; MRCC confirms the model. Note: card slug is membership-rewards-card (not ...-credit-card).
