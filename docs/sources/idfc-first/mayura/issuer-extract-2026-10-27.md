# IDFC FIRST Mayura Credit Card: issuer comparison (27 Oct 2026)

## Current issuer evidence

- [Current product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/mayura), captured as `product-page-retrieved-2026-10-27.html`.
- [May-2026 card communication](Mayura-Credit-Card-Communication-May-26.pdf), effective 18-Jun-2026.
- [Mayura reward structure](Mayura-Rewards-Structure-TnC.pdf), issued 28-May-2025.
- [Launch release](launch-release-2024-09-19.pdf), which gives launch date 19-Sep-2024 and identifies Mastercard.
- [Bank-wide zero-forex notice](zero-forex-notice-2026-09-17.pdf), effective 17-Sep-2026.

## Field decisions

- Network corrected from Visa Infinite to Mastercard World. The launch release and issuer FAQ identify Mastercard/World privileges. Visa Infinite content embedded elsewhere on the current page is for the Visa platform and is not applicable; concierge left unknown.
- Launch date set to 19-Sep-2024. Current primary fees remain INR5,999 + GST joining and annual from year two; annual-fee spend milestones grant points and are not fee waivers. Forex is 0% from 17-Sep-2026. Cash advance is flat INR199 + GST; fixed monthly finance charge remains unknown because APR is account-specific.
- Core earn remains 5 points/INR150 up to INR20,000 and 10 points/INR150 on eligible incremental spend above the threshold. Category earn, threshold exclusions, credit-limit ceiling, payment condition and redemption values/caps are documented in the YAML.
- Travel bonus rate is unresolved: the 2025 reward T&C/current FAQ and current page say 30X hotel/15X flight bonus points, while the May-2026 update says 20% of applicable base points for hotels and 10% for flights. The model does not assert a fixed app-booking bonus. Redemption is INR0.50/point for app travel and INR0.25 otherwise.
- Lounge access is four domestic and four international visits per quarter; one domestic guest visit is included within the domestic quota. Current page requires INR20,000 calendar-month spend to unlock the next month. Railway lounge quota is four per quarter with the stated monthly spend gate.
- Golf includes four Mastercard rounds and 12 lessons per calendar year, plus separate spend-unlocked monthly rounds/lessons. The schema cannot represent the separate spend-triggered entitlement precisely.
- Corrected baggage-delay classification to trip delay; removed duplicated movie and trip-cancellation entries. Travel insurance amounts remain as displayed on the current page and subject to insurer policy terms. Trip cancellation is advertised up to INR50,000 twice per year; precise claim requirements depend on linked policy wording.
- Removed resident-only eligibility because the current Mayura page does not state a card-specific residency rule. Age, income, score and residency criteria remain unknown.

## Remaining source conflicts and model limits

The card page combines Mastercard World benefits with a Visa Infinite benefits section; only Mastercard-linked claims are retained. Current travel bonus descriptions conflict as above. The product page says trip-cancellation coverage is twice per year while the 2024 launch release says up to INR50,000 in a calendar year. The precise current insurer policy conditions were not established from the card page. Schema fields cannot express add-on-specific fee variants, the spend-gated lounge/golf rules completely, or travel bonuses stated as a percentage of variable base points.
