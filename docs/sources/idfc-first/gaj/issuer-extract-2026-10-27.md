# IDFC FIRST Gaj: issuer comparison (2026-10-27)

Reviewed the current [Gaj product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/gaj), the issuer's 29-Dec-2025 launch release, current linked Gaj privileges and rewards terms, May-2026 cardmember update, product guide and customer MITC. Current dated page capture and downloaded issuer PDFs are listed in the IDFC FIRST source manifest.

## Field decisions

- The 29-Dec-2025 launch release confirms launch date, invite-only status for select Private Banking customers, metal construction, INR12,500 + GST joining/annual fees and INR10 lakh annual-fee waiver. Current page confirms annual fees begin from year two, joining fee payment is upfront, and ATM cash advances have a flat INR199 + GST fee, up to 45 interest-free days and INR10,000 transaction limit.
- Zero issuer forex markup applies to international card purchases, including international transactions in India. The linked Gaj terms warn merchant DCC may still add charges up to 5%; this is not bank forex markup.
- Rewards terms support 5 points/INR150 domestic, 3/INR150 international, and 1/INR150 on listed reduced-rate categories, with no rewards below INR150 or for listed excluded transactions. Points accrue only up to the credit limit per billing cycle effective 18-Jun-2026; minimum-due nonpayment reverses cycle points.
- The travel app awards 45 bonus hotel points and 20 bonus flight points per INR150 above the regular 5 points, with a shared 15,000 monthly bonus-point cap. Travel points redeem at INR1 each; other redemptions at INR0.25. Travel redemption is capped at 150,000 points per month and 300,000 per year, and points can cover up to 70% of eligible booking value.
- Lounge access is four Indian visits per quarter, including one guest visit within the overall quota, plus four global visits; INR20,000 eligible spend in the current calendar month unlocks following-month access. Railway lounge and hotel privileges are detailed in the linked card terms. The live page mentions movie tickets and 300+ brand offers without a card-specific partner or discount, so that benefit is listed without a numeric value.
- Golf terms allow up to 24 rounds or lessons per year: INR20,000 statement spend unlocks one; INR40,000 unlocks a second, each valid up to 60 days. The two visits are a shared pool, not two separate rounds plus two lessons, so YAML round/lesson counts are null.
- Insurance schedule in the current linked privileges PDF supports INR25,000 flight cancellation and separate INR25,000 hotel cancellation limits, shared across primary/add-on cardholders for at most two cancellations; INR1 crore air accident; INR10 lakh personal accident; INR50,000 card liability, credit shield and purchase protection; and USD500/300/100/300 travel cover. The card terms do not publish a CFAR policy period, so YAML does not invent an expiry date.
- Current terms provide 12,500 points on joining-fee payment for first application, plus a limited-period hotel voucher offer requiring INR1 lakh spend within 60 days. Paying annual fee when the INR10 lakh waiver is not reached also earns 12,500 points.
- Current card-specific public sources establish invitation-only Private Banking eligibility but do not publish residence, age, numeric income or bureau-score thresholds. Unsupported resident-only eligibility was removed.

## Open discrepancies and schema limits

- The current product page uses broad “unlimited” golf language; the linked detailed Gaj terms specify up to 24 shared rounds/lessons annually with spend gates. Structured counts follow the detailed terms.
- The schema has no way to encode the shared monthly golf pool or distinguish the 15,000 cap applying only to bonus points from a total earn cap; the YAML explains both limits in notes.
- Gaj terms advertise zero forex but identify possible merchant-imposed DCC of up to 5%.
- The current public card materials do not publish a card-specific revolving APR, exact age/income/credit-score threshold, residence condition, or CFAR policy end date.
- The initial welcome offer and annual fee payment benefit are separate 12,500-point events with different triggering conditions.

## Archived issuer evidence

- gaj-launch-2025-12-29.pdf
- gaj-privileges-retrieved-2026-10-27.pdf
- gaj-rewards-terms-retrieved-2026-10-27.pdf
- gaj-product-guide-2025-12-22.pdf
- gaj-may-2026-communication.pdf
- current-customer-mitc.pdf
- gaj-product-page-retrieved-2026-10-27.html
