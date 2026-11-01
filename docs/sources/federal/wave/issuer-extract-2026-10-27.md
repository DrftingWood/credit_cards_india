# Federal Bank RuPay Wave review — 27 Oct 2026

## Summary

Reviewed Wave against its current product page, KFS, Wave MITC, Wave-specific terms, general T&C, Jan-2026 APR revision, rewards terms and launch release. Corrected the APR tiers, launch date, residency and unsupported network-tier claim. Preserved explicit fee conflicts rather than inventing a single settled value.

## Field decisions and evidence

- **Launch date:** Set 19 Jun 2024, the dated Federal Bank [launch announcement](https://www.federal.bank.in/documents/10180/791490051/Federal%20Bank%20Unveils%20UPI-Enabled%20RuPay%20Wave%20Credit%20Card%20via%20a%20Simplified%202-click%20onboarding%20journey).
- **Network tier:** Cleared `network_tier: classic`, tagged `network-tier-unverified`. The [current product page](https://www.federal.bank.in/rupay-wave-credit-card) confirms RuPay but no tier; it says displayed network options are illustrative. No official card-specific RuPay tier found.
- **APR:** Replaced incomplete/outdated bands with 3.75% / 45% below INR 50,000 AMB; 2.69% / 32.28% for INR 50,000–300,000; 1.99% / 23.88% for INR 300,001–1,000,000; and 0.69% / 8.28% above INR 1,000,000. Federal Bank's [APR revision notice](https://www.federal.bank.in/revised-credit-card-charges) applies to Wave and states rates effective 10 Jan 2026, updated quarterly based on prior-quarter operative-account AMB. Wave KFS and MITC APR schedule still show older rates, so the revision notice is used for current APR.
- **Fees:** [Wave KFS](https://www.federal.bank.in/rupay-wave-credit-card-kfs) says Wave joining and annual fees are NIL. [Wave MITC](https://www.federal.bank.in/rupay-wave-credit-card-mitc) schedule says joining NIL for virtual / INR 199 for physical, annual INR 199, but its annual-waiver cell reads NIL. Wave-specific [terms](https://www.federal.bank.in/rupay-wave-credit-card-terms-and-conditions) allow virtual or physical form by customer choice and say physical issuance/maintenance may have applicable fees. Retained current KFS nil joining/annual values and documented conflicts. KFS says cash advance fee not applicable; MITC table says 2.5% or INR 500 minimum, while MITC narrative explicitly says cash-advance fee is not applicable for Wave. Left `cash_advance_fee` null due to irreconcilable official wording. Forex 3.5% confirmed in Wave MITC/KFS.
- **Rewards:** [Wave product page](https://www.federal.bank.in/rupay-wave-credit-card) and Wave MITC confirm 1 point per INR 200; current MITC gives INR 0.25 catalog face value, INR 0.10 statement credit and INR 99 redemption fee. Current restricted categories and insurance cap retained. Wave points are separate from primary-card points.
- **Welcome cashback:** Product page and general T&C say 10% cashback on one UPI transaction of at least INR 150 in first 30 days, up to INR 100, effective 1 Sep 2026. General FAQ still says first five UPI transactions, and older 2024 launch/terms describe first five transactions and an INR 200 cap. Current dated general T&C explicitly says the one-transaction INR 100 offer applies from 1 Sep 2026; updated record to that current rule and noted FAQ conflict.
- **Milestone:** Product headline says INR 50,000 per quarter for 1,000 bonus points; current general T&C narrows this to INR 50,000 in the first quarter after issuance, one time. Retained one-time treatment and first-quarter condition.
- **Eligibility / floater:** Wave-specific terms restrict primary card to Visa or Mastercard (RuPay-primary ineligible), share the primary credit limit and permit separate statements/reward balances. General FAQ allows Indian residents and NRIs; set residency to `either`. Age, income and bureau requirements remain unpublished for this add-on product.
- **Benefits:** No lounge or fuel waiver is advertised. Physical/virtual options are supported; removed the `virtual` tag because the current Wave-specific terms allow either option.

## Limits / open points

- Current KFS/MITC conflict on Wave joining/annual fees and cash-advance fee; retain null for disputed cash-advance fee and preserve fee note.
- Card product page and terms don't provide a RuPay tier; `network_tier` remains null.
- Current FAQ language for welcome cashback is stale relative to the explicitly effective 1 Sep 2026 T&C.
- A single record review is not a database-wide factual-accuracy percentage.
