# American Express India — source verification (2026-07-04)

Amex serves fees/rewards as HTML on americanexpress.com/in (Playwright reads it; WebFetch is blocked). No downloadable per-card PDFs.

## Verified
- **MRCC** (Membership Rewards Card): first-year fee Rs.1,000, second-year Rs.4,500 (waived/50% on Rs.1.5L spend), Welcome Gift 4,000 MR -- all match YAML.

Amex had a thorough audit (PR #43) with MR realized values sourced and slug/partner/fee corrections already applied; MRCC confirms the model. Note: card slug is membership-rewards-card (not ...-credit-card).

## Current review

- **Centurion:** current MITC, RewardXcelerator, Membership Rewards, lounge terms, and Oct-2026 operational updates reviewed 2026-10-27. Reconciliation: `centurion/issuer-extract-2026-10-27.md`.

- **MRCC:** current card page, benefits/milestones, Gold Collection catalogue, official fee schedule, and October 2026 consumer updates reviewed 2026-10-27. Corrected unsupported launch date, detailed 50% waiver end date, added first-renewal 5,000-point bonus, and documented point exclusions, reward catalogue range, cash-withdrawal pause, application pause, and Nov-15 milestone processing change. Reconciliation: `mrcc/issuer-extract-2026-10-27.md`.

- **Platinum Charge:** current product and benefits pages, October 2026 consumer update, and issuer fee schedule/KFS reviewed 2026-10-27. Removed unsupported launch date; documented current application pause and future service/milestone changes. Reconciliation: `platinum-charge/issuer-extract-2026-10-27.md`.

- **Platinum Reserve:** current product/benefits, fee schedule, RewardXcelerator and October 2026 service updates reviewed 2026-10-27. Added the INR 10 lakh renewal waiver to fees; removed unsupported launch, wallet-load and blanket EMI assertions. Reconciliation: `platinum-reserve/issuer-extract-2026-10-27.md`.

- **Platinum Travel:** current product/benefits pages, fee schedule and October 2026 service updates reviewed 2026-10-27. Corrected unsupported launch/reward exclusions; documented current quarterly lounge gate, chargeable Priority Pass usage and future milestone posting rule. Reconciliation: `platinum-travel/issuer-extract-2026-10-27.md`.

- **SmartEarn:** current product/benefit/merchant pages, fee schedule and October 2026 service update reviewed 2026-10-27. Removed unsupported launch and reward exclusions; distinguished current card-specific rates from ended generic Reward Multiplier; documented late-fee update and temporary service pauses. Reconciliation: `smartearn/issuer-extract-2026-10-27.md`.

- **Platinum Reserve:** current product, benefits, fee schedule, RewardXcelerator and October 2026 service updates reviewed 2026-10-27. Added the INR 10 lakh renewal waiver to fees; removed unsupported launch, wallet-load and blanket EMI assertions; documented the Nov-15 milestone update and application pause. Reconciliation: `platinum-reserve/issuer-extract-2026-10-27.md`.

- **Platinum Travel:** current product/benefits pages, fee schedule and October 2026 service updates reviewed 2026-10-27. Removed unsupported launch date and overly broad reward exclusions; documented the staged 2026 lounge gate, chargeable Priority Pass usage, point expiry and upcoming milestone-processing change. Reconciliation: `platinum-travel/issuer-extract-2026-10-27.md`.

- **SmartEarn:** current card page, benefits/merchant pages, fee schedule, generic Reward Multiplier discontinuation notice and October 2026 Amex service update reviewed 2026-10-27. Removed unsupported launch date, wallet-load and blanket EMI exclusions; documented continued card-specific 10X/5X rates separately from ended generic Reward Multiplier, future late-fee slabs, current welcome/voucher thresholds and temporary application/EMI pauses. Reconciliation: `smartearn/issuer-extract-2026-10-27.md`.
