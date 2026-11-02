# Equitas Selfe source verification ? 2026-10-26

Reviewed the live [Selfe product page](https://equitas.bank.in/personal-banking/pay/credit-cards/selfe-credit-card/), linked FAQ, official [MITC v1.2](https://equitas.bank.in/strapi-dev/uploads/MITC_V1_2_Track_change_8ed95eca57.pdf), [credit-card pricing form](https://equitas.bank.in/strapi-dev/uploads/Elite_Artha_Credit_Card_2_f1e79a9024.pdf), and [application form](https://equitas.bank.in/strapi-dev/uploads/Elite_Artha_Card_2ad825fc9a.pdf). The issuer-hosted PDFs returned HTTP 503 during attempted direct retrieval, so no local PDF copies were created; source URLs and search-indexed issuer text are retained here.

## Verified corrections

- Removed unsupported 2025-01-01 launch date; no exact launch date established. Equitas's FY2024-25 annual report says the bank launched its credit-card portfolio in March 2025, but does not establish the Selfe card's exact launch date.
- Cleared Visa/Platinum scalars because applicants may choose Visa or RuPay and the product does not establish a single network tier.
- Fees: standard INR1,000 joining and annual membership; current product page advertises limited-period FYF excluding GST. Renewal fee waived at INR240,000 eligible anniversary spend. Paid joining fee may be reversed after INR60,000 spend within 90 days; this does not apply to FYF/LTF. Forex 3.5%, monthly finance 3.75%, and cash advance 2.5% or INR250 minimum. Metal design adds a one-time INR3,500 charge.
- Rewards: 2 points per INR100 base; 5X (10 points/INR100) in two of Apparel, Dining, Grocery, Utility and Taxi selected during onboarding. Issuer FAQ states redemption value INR0.35 for travel/vouchers/catalogue and INR0.15 for cashback/instant redemption; cashback minimum 500 points, fee INR99 per redemption, points expire after 24 months. Current FAQ exclusions: fuel, rent, wallet loads, government payments, cash advances and EMI conversions.
- Benefits: one domestic lounge visit per calendar quarter; 1% fuel surcharge waiver on INR500-INR3,000 fuel transactions, capped at INR250 per statement cycle. Select two memberships from Amazon Prime, JioHotstar, SonyLIV and Zee5; claim within 90 days of issuance. MITC membership milestones: INR60,000 in first three months for first-year membership, then INR240,000 annually from year two; FYF/LTF membership conditions differ. Plastic/green designs have no additional charge; metal design costs INR3,500.
- Application declaration accepts Resident Indian or foreign national working in India and says a change to NRI status may result in blocking. No numeric age, income or bureau-score cutoff found.

## Unresolved / modeling limits

- Exact Selfe launch date and age, income and credit-score thresholds remain unknown.
- Schema has no separate field for current FYF joining promotion versus standard joining fee and its conditional reversal; conditions are recorded in fee notes. It has no field to model two distinct redemption values cleanly in calculator assumptions; both catalog and statement-credit rates are recorded.
- Current product page FAQ says memberships are available T+1 in one section and T+3 working days in another; data records activation and 90-day claim window but not the exact posting interval.

- **PowerMiles (2026-11-01, insurance-policy supplement):** reviewed the issuer benefit summary, linked Royal Sundaram policy wording and current Cardmember Agreement. Added death-only air-accident scope and claims timing; individual insurance certificates and exact schedule limits remain unavailable. See [powermiles-insurance-conditions-2026-11-01.md](powermiles-insurance-conditions-2026-11-01.md).
- **PowerMiles (2026-11-01, issuer-term follow-up):** read current MITC v1.2, Jan-2026 Product & Pricing MID and the 28-Nov-2025 Cardmember Agreement. Corrected the unsupported insurance exclusion, added issuer-stated fuel waiver, and cleared unsubstantiated absolute earn rate, lounge quotas, named memberships, launch date and residency. See [powermiles-issuer-extract-2026-11-01.md](powermiles-issuer-extract-2026-11-01.md); the live product page and insurance certificate remain unavailable.
