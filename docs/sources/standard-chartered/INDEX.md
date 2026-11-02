# Standard Chartered — source verification (2026-07-04)

## Smart Credit Card (reviewed 2026-10-26)

- Archived the current Smart product page, Smart FAQs, tariff page, Smart-specific T&Cs (version 30-Sep-2024), and general credit-card terms under `docs/sources/standard-chartered/smart/`.
- Product page confirms INR 499 joining/renewal fee, acquisition-only first-year fee waiver for new SCB cardholders, reversal of renewal fee after INR 120,000 preceding-year Smart spend, age 21–65, stable income and sourcing-city/policy requirements.
- The FAQ and Smart T&Cs supersede the product page's stale monthly cashback cap wording: online cashback is 2% capped INR 1,000 per statement cycle, other/offline is 1% capped INR 500 per statement cycle, consolidated across primary and supplementary cards at customer level. Fuel and cash advances are excluded. BillDesk/SC Bill Pay telecom and utility billers are eligible for online cashback.
- Redemption minimum is INR 2,500, subsequent amounts in INR 1,000 increments; cashback is INR 1 per unit and no INR 99 fee applies. Product page's INR 18,000 annual illustration is not represented as a formal annual cap because the current FAQ defines cycle caps.
- General current tariffs confirm 3.5% forex, 3.75% monthly finance, cash advance fee 3% (minimum INR 300), and 1% + tax rent processing fee. No Smart-specific fuel surcharge waiver was found, so it was removed.
- Smart T&Cs confirm eligible INR 2,000+ transactions can be converted into 3-month EMI at 0.99% monthly with nil processing fee, and an extended interest-free period during the first 90 days subject to first-three-statement minimum payments and fourth-statement full payment. Both are conditional offers.
- Exact launch date, network/variant and tier, numeric income/bureau cutoffs, and sourcing-city list remain unknown; unsupported Visa/Platinum and launch-date assertions were cleared.

SC publishes per-card T&C PDFs on `av.sc.com/in/content/docs/` (e.g.
`in-ultimate-credit-card-tnc.pdf`) + a general `in-credit-card-terms-and-condition.pdf`.
Read via pypdf.

## Verified
- **Ultimate** (11-pp T&C PDF): confirms **5% cashback on duty-free**, reward-points on
  joining-fee payment (the 6,000-RP welcome), and the lounge program — matching the
  audit corrections (lounge 4/quarter, 6k welcome, 2% forex). No corrections needed.

SC cards had a thorough audit (PR #47) with real corrections already applied (Ultimate
lounge, Rewards first-year-free + 4X bonus, EaseMyTrip discount-vs-reward split); the
Ultimate T&C PDF confirms the model.


## Standard Chartered DigiSmart (reviewed 2026-10-27)

Compared current product page, card-specific DigiSmart T&Cs and card tariffs. Corrected monthly membership fee and spend reversal, 3% cash advance (minimum INR300), zero spend-earned reward points, current Zomato/Blinkit/INOX/Yatra/Ola benefits, Visa network without unsupported tier, and published eligibility. Source comparison: `digismart/issuer-extract-2026-10-27.md`; monthly-fee field and zero-reward placeholder are schema limitations.


## Standard Chartered EaseMyTrip (reviewed 2026-10-27)

Compared current product page, EaseMyTrip card-specific terms, current MID and tariff schedule. Corrected 2-point base earn vs 10-point standalone travel earn, point value, merchant discount caps, two annual domestic lounges, cash-advance charges and eligibility; cleared unsupported network tier, launch date and fuel waiver. Evidence comparison: `easemytrip/issuer-extract-2026-10-27.md`.


## Standard Chartered Manhattan (reviewed 2026-10-27)

Compared current Manhattan page and SC tariff. Updated fees/waiver, joining points, base points, supermarket cashback, cash-advance charges and published eligibility; cleared unsupported tier, launch date and fuel waiver. The product page's linked T&Cs are for the different Rewards card and contradict Manhattan fee/reward terms. The INR500/month grocery cashback cap is only inferred from the value chart and marked medium confidence. Details: `manhattan/issuer-extract-2026-10-27.md`.


## Standard Chartered Platinum Rewards (reviewed 2026-10-27)

Compared current Platinum Rewards product page, scanned card-specific terms, PRCXC Most Important Document and current tariff. Corrected cash-advance fee, reward value, welcome benefit and published age/GMI eligibility; cleared unsupported launch date, network tier and fuel waiver. Standard tariff fees coexist with a conditional electronic-application fee offer. The issuer page says accelerated rewards are uncapped monthly while the card terms mention an unspecified card-level maximum; both that conflict and schema limitations are recorded. Evidence comparison: `platinum-rewards/issuer-extract-2026-10-27.md`.


## Standard Chartered Super Value Titanium (reviewed 2026-10-27)

Compared current product page, current tariffs, card-specific terms, product MID and cashback-redemption FAQ. Corrected network, cash-advance fee, cashback cycle caps/conditions, reward value, redemption threshold, eligibility, and removed unsupported fee waiver/launch date/fuel-surcharge waiver. The main product page and lead-generation page differ on annual-fee waiver; current page per-transaction cashback caps also differ from older linked T&Cs. Conditional Premium Banking lounge benefits are not applied to the standard product. Evidence comparison: `super-value-titanium/issuer-extract-2026-10-27.md`.


## Standard Chartered Beyond lounge clarification (2026-11-01)

Resolved the lounge quota conflict against current Beyond-specific issuer terms. Cardholder visits are unlimited in India and through Priority Pass outside India; annual guest quota is four per eligible cardholder, subject to FUM qualification. The product page's 8/6 visit figures are a savings-value summary, not the terms quota. See `beyond/lounge-clarification-2026-11-01.md`.


## Priority Banking Visa Infinite cash-advance fee clarification (2026-11-01)

Compared the current card-specific ATM statement-balance fee tiers with the current tariff's 3%/INR 300 minimum cash-advance fee. The issuer documents do not say whether one supersedes or supplements the other; the structured fee remains unknown. See `priority-visa-infinite/cash-advance-fee-clarification-2026-11-01.md`.


## Standard Chartered Rewards (review evidence dated 2026-10-25)

Checklist record created from the existing field-level issuer page/FAQ, tariff and MITC evidence in the card YAML; not rechecked within the one-month freshness window. Notes the monthly bonus threshold modeling limit. See `rewards/issuer-review-2026-10-25.md`.


## Standard Chartered Ultimate golf quota clarification (2026-11-01)

Live linked Ultimate terms section 11 sets one monthly game plus one monthly coaching session; twice-monthly story copy reflects these two session types, while four/year is from an illustrative value chart. See `ultimate/golf-quota-clarification-2026-11-01.md`.
