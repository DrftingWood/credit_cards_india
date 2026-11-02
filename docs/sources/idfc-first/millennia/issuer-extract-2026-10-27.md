# IDFC FIRST Millennia: issuer comparison (27 Oct 2026)

## Sources

- [Current Millennia product page](https://www.idfcfirst.bank.in/credit-card/millennia), captured as `product-page-retrieved-2026-10-27.html`.
- [May-2026 Millennia communication](millennia-communication-may-26.pdf), including the 18-Jun reward changes and subsequent card benefits.
- [Current Millennia privileges](millennia-privileges.pdf) and [product guide](millennia-product-guide.pdf). The guide shows Visa card artwork but dates to 2022; it supports network only, not current reward terms.
- Current [customer MITC](current-mitc.pdf), [zero-forex notice](zero-forex-notice-2026-09-17.pdf), [card-specific eligibility article](eligibility-guide-retrieved-2026-10-27.html), and [issuer card comparison](eligibility-comparison-retrieved-2026-10-27.html).

## Field decisions

- Retained Visa and unknown network tier: the issuer product guide shows Visa card artwork but does not state a tier. An optional FIRST Digital RuPay UPI card is a separate add-on and is described in the benefits/reward notes.
- Fees remain zero joining and annual; foreign markup is zero under the bank-wide policy effective 17-Sep-2026. Cash advance costs INR199 + GST per withdrawal with up to 45 interest-free days and a stated INR10,000 per-transaction ceiling. Issuer APR is a variable 8.5%–46.2% p.a.; no fixed monthly rate is asserted. Add-on/personalisation fees are in notes because the main fee schema cannot model them.
- Rewards remain 1 point/INR200 base, with 10X on eligible dining/travel before 26-Oct and 3X on other eligible categories; insurance, utilities, railways and FASTag earn 1X. International purchases stopped earning points effective 26-Oct-2026 per the current card page. Fuel, EMI and cash withdrawals are excluded. Points are worth INR0.25, expire 24 months after credit, and redemption is subject to INR99 + GST fee. App booking bonus is 20% on hotels and 10% on flights per the May-2026 update and current product page.
- Current welcome offers: INR500 voucher after INR5,000 spend within 30 days and 5% cashback on first eligible EMI within 30 days, capped at INR1,000. Current benefits include one monthly District movie discount (25%, up to INR100) after activity in the prior month, four railway lounge visits per quarter after INR20,000 prior-month spend, 1% fuel surcharge waiver capped at INR200/month, roadside assistance, and the listed card liability/personal accident/credit shield/purchase protection covers. The latest privileges document says travel insurance and personal air accident cover are not available.
- Income minimum remains INR300,000 annually. The issuer's Millennia eligibility article says age 21+, while the issuer's current lifetime-free-card comparison lists 18; the numeric minimum age is cleared pending resolution. The comparison says Indian resident; general issuer guidance also says NRIs may apply subject to card criteria, so residency remains based on the more specific card comparison with the conflict documented. No upper age or credit-score cutoff is published.

## Unresolved conflicts and model limits

Issuer age guidance conflicts (18 vs 21). Card comparison says Indian residents while general issuer wording allows NRI applications subject to card-specific requirements. Spend MCC ranges, the birthday date rule, UPI transaction-value tiers, high-use rail/FASTag surcharges, redemption expiry and fee are retained in notes where the YAML schema cannot represent the details directly. The record has separate reward periods to reflect the 26-Oct international-reward exclusion.
