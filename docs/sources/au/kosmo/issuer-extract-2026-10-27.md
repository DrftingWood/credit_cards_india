# AU KOSMO (Kiwi) Credit Card ? source comparison (27 Oct 2026)

## Sources checked

- [AU KOSMO issuer product page and FAQ](https://www.au.bank.in/personal-banking/credit-cards/kosmo-credit-card), retrieved 27 Oct 2026.
- [AU KFS v1.9, 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf).
- [Kiwi terms index and AU KOSMO application T&Cs](https://www.gokiwi.in/terms-and-conditions/), current 27 Oct 2026.
- [Kiwi Rewards Policy v2](https://gokiwi.in/rewards-policy-v2/), retrieved 27 Oct 2026.
- [AU/ Kiwi KOSMO launch announcement (18 Sep 2025)](https://www.au.bank.in/pdfs/press-release/2025/au-small-finance-bank-partners-with-kiwi-for-credit-on-upi-launches-au-kosmo-credit-card---18th-september-2025.pdf).

## Field comparison and record changes

- **Identity:** Press release describes the card as RuPay-powered and names AU/ Kiwi partnership. Set `network: rupay`, co-brand Kiwi, and launch date 2025-09-18. No official source found for a RuPay tier; cleared `network_tier: platinum`.
- **Fees:** AU product page and FAQ state lifetime free/no joining or renewal fee. Current KFS gives general forex 3.49%, finance 3.75% monthly and cash advance 2.5%/?500 min; KOSMO is not among the variants receiving lower forex or finance rates. Retained these rates. KFS current fuel-waiver table lists KOSMO under the ?100/month cap; product page independently confirms 1% on ?400??5,000 transactions up to ?100.
- **Rewards?base:** AU issuer page states Kiwi rewards accrue on Scan & Pay in Kiwi, and Ecom/POS/contactless spend. Kiwi Rewards Policy, effective 1 Jun 2025, applies to cards issued through the Kiwi app since 4 Jul 2024. For non-Neon cardholders it specifies 0.5% on online transactions: 2 Kiwis per ?100, with earnings only on ?100 increments. Modeled that rate for `online` only. AU page lists POS/contactless as eligible, but current Kiwi policy does not clearly quantify their rate, so those transactions are documented but excluded from numeric modeling.
- **Rewards?UPI:** For the same post-4-Jul-2024 Kiwi-issued cohort, Kiwi terms state Scan & Pay earns 1.5% (6 Kiwis/?100) for non-Neon members. Modeled the Scan & Pay rate, restricted to a Kiwi-app channel token; the schema has no dedicated UPI-app channel, so `cobrand-merchant: kiwi-app` is an approximation and the rule is annotated. Do not confuse optional paid Kiwi Neon/Boost rates with the free standard card.
- **Cap/redemption/exclusions:** Current Kiwi policy values each Kiwi at ?0.25, caps monthly Kiwis at 1% of the assigned credit limit, pays Kiwis to the linked goaxb UPI ID, and requires at least 500 Kiwis with redemption in multiples of 500. The dynamic per-customer cap cannot be entered as a fixed numeric cap; it is documented in capping notes with status `unknown`. The policy publishes 81 excluded MCCs and specific merchant categories; these are now recorded. It also says EMI-on-UPI may earn rewards unless a particular offer excludes it; therefore blanket EMI exclusion was removed. Product/partner reward terms do not publish clear numeric earn rates for POS/contactless separately.
- **Fuel and other features:** Confirmed ?400??5,000 fuel transaction band, 1% waiver capped ?100/month. Added issuer-advertised contactless up to ?5,000, EMI-eligible transactions ?500+ with a total minimum ?2,000, and add-on card availability. No base-card lounge access is advertised; paid Kiwi Neon lounge passes are not represented as core benefits.
- **Eligibility:** Issuer page confirms resident Indian applicants; salaried 21?60, self-employed 25?65, add-on holders over 18. No numeric income or credit-score threshold is published.

## Known representation limits

- Kiwi?s issuer-partner policy states a dynamic cap based on each account?s credit limit; schema accepts only a fixed number or `unlimited` for cap value. We retain `cap_status: unknown` and the formula in capping notes.
- The calculator channel taxonomy has no native Kiwi-app UPI class. The added `kiwi-app` co-brand channel token is a traceable proxy; spending-category attribution for QR Scan & Pay can still be incomplete.
- Kiwi rewards policy gives POS/contactless eligibility in AU?s product description, but no exact rate in current public rate table; these categories are not assigned a numeric rate in the record.

This is a field-level source comparison for AU KOSMO, not a database-wide accuracy percentage.
