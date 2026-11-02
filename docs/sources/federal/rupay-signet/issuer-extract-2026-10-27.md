# Federal Bank RuPay Signet review — 27 Oct 2026

## Summary

Reviewed the RuPay Signet card record against current Federal Bank product, MITC, APR revision, lounge, welcome-benefit, general FAQ and launch sources. Corrected all four dynamic APR tiers, the launch date, residency eligibility, and the lounge add-on condition. Cleared an unsupported RuPay network tier.

## Field decisions and source evidence

- **Launch date:** Set to 27 Sep 2021. Federal Bank's [launch press release](https://www.federal.bank.in/documents/10180/17012/Federal%20Bank%20launches%20RuPay%20Signet%20Contactless%20Credit%20Card/aac9dcf2-ca9c-9db7-2d74-9f163f4852bc) explicitly dates the launch.
- **Network tier:** Set `network_tier` to null and tagged `network-tier-unverified`. The product page identifies RuPay but does not specify a RuPay tier; Visa Platinum Signet information cannot be transferred to the RuPay variant.
- **APR:** Replaced the incomplete schedule with 3.75% (45%) below INR 50,000 AMB; 2.69% (32.28%) for INR 50,000–300,000; 1.99% (23.88%) for INR 300,001–1,000,000; and 0.69% (8.28%) above INR 1,000,000. The [issuer revision page](https://www.federal.bank.in/revised-credit-card-charges) says these revised rates are effective 10 Jan 2026 and update quarterly based on prior-quarter average monthly balance in the operative account. The [current MITC](https://www.federal.bank.in/-/credit-card-tc-1) supplies Signet schedule fees, add-on maximum/fee, cash advance, forex and cohort fee-waiver details. Numeric boundaries follow the issuer's inclusive/exclusive schedule wording; the exact 1,000,000 boundary is assigned to the INR 300,001–1,000,000 band.
- **Fees:** Confirmed no joining or annual membership fee for cards onboarded from 3 Apr 2023; older Signet cohorts can retain fees and the INR 75,000 annual waiver. Add-on fee INR 100 per card, maximum four; cash advance 2.5%, minimum INR 500; forex markup 3.5%.
- **Rewards:** The [RuPay Signet product page](https://www.federal.bank.in/rupay-signet-credit-card) states 3x electronics/apparel, 2x entertainment and 1x other spends, and that the card can link to a UPI ID. It does not state accelerator caps or special UPI earning treatment. Existing reward values/exclusions were retained from the current MITC record; no separate claim about UPI earn was introduced.
- **Welcome benefit:** Current [welcome-benefit terms](https://www.federal.bank.in/credit-cards-cvp-terms-and-conditions) confirm INR 3,000 in first 30 days for INR 200 voucher, active card and offer-notification eligibility, once per customer lifetime, with communication within 90 days and 12-month voucher validity. Existing details retained.
- **Lounge:** Current [lounge program](https://www.federal.bank.in/federal-bank-debit-cards-credit-cards-airport-lounge-program) confirms Signet (Visa/Mastercard/RuPay) gets one domestic visit after INR 20,000 in preceding quarterly spend cycle. Primary cardholder only; add-on spend aggregates but add-on holders cannot enter. Cycle is 21st–20th; INR 2 validation may apply; cash withdrawals and transactions billed outside the cycle do not count. Updated record notes.
- **Eligibility:** Set residency to `either` based on issuer [general credit-card FAQ](https://www.federal.bank.in/credit-card-faq), which permits Indian residents and NRIs and sets minimum age 21 for unsecured credit cards. Card-specific secured status and age are not asserted; age remains null.
- **Product benefits:** Product page supports Amazon voucher, quarterly INOX BOGO, quarterly-spend Swiggy voucher, INR 2 lakh accident cover, concierge, and lounge headline benefits. Face value/expiry of Swiggy voucher and insurance policy details are unpublished on the reviewed page; left unknown/documented.

## Limits and open points

- The issuer card page says RuPay option details are illustrative and final network selection is made during application; this review concerns the named RuPay Signet product record.
- No RuPay tier, accelerator cap, Swiggy voucher face value, detailed accident policy terms, or UPI-specific reward treatment was established from current card-specific issuer evidence.
- Field verification is one reviewed record; this is not a database-wide factual accuracy percentage.
