# RBL Icon Credit Card issuer evidence (reviewed 2026-10-27)

Primary sources checked on 2026-10-27:

- [Current Icon product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/icon-credit-card)
- [Icon product terms and conditions, document dated 04-Aug-2026](https://webassets.rbl.bank.in/document/credit-cards/tnc-icon-credit-card.pdf)
- [Current RBL MITC/KFS](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf)
- [Current RBL Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf)
- [RBL network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide)

Archived issuer PDFs are stored in this directory. Product-terms SHA/retrieval captured locally; shared copies are retained and no prior files were moved or removed.

## Current record comparison

| Field | YAML value | Issuer evidence / interpretation |
|---|---|---|
| Issued network / tier | null / null | Issuer network guide lists both Mastercard and Visa. Product page does not establish a single network tier. Mastercard golf benefit is variant-only. |
| Launch date | null | No issuer launch date found in current product or terms. |
| Joining and annual fees | INR5,000 / INR5,000; no waiver published | Schedule of Charges lists INR5,000 for first and subsequent years. MITC lists add-on fee INR200. |
| Forex, finance, cash advance | 3.5%; 3.99% monthly maximum; 2.5%, min INR500 | Current MITC central charge table specifies these standard terms; Icon is not among the named lower forex exceptions. |
| Base rewards | 2 points/INR100 | Card T&C §3.3. Redeem at RBL Rewards; these terms do not set a fixed INR value. Previous YAML point values removed. |
| Accelerated rewards | 20/INR100 international and weekend dining; cap 2,000 points/category/billing cycle, then base rate | Card T&C §3.3 explains total enhanced rate and reversion to 2 points/INR100 after each cap. |
| Exclusions | railways, rental and miscellaneous; MCCs `0066`, `4011`, `4112`, `6513`, `5960` | Product page and card T&C. The issuer prints `0066`; kept as evidence despite the code formatting anomaly. EMI and cash withdrawals excluded from milestone qualifying spend. |
| Welcome | 20,000 points | Eligible retail transaction within 30 days of issuance plus first annual membership fee paid by due date; credited within 60 days of issuance. |
| Milestones | 10,000 at INR3L; additional 15,000 at INR5L; additional 20,000 at INR8L | Membership year, up to 45,000 points; primary and add-on settled spend counted; EMI, cash withdrawals, fees/charges/GST excluded; points credited within 45 days after crossing. |
| Domestic lounge | 2/quarter after INR35,000 previous calendar quarter | Primary cardmember only; excluded EMI/cash/fees/charges/GST; unused visits lapse; temporary INR25 validation authorization reversed in statement. |
| International lounge | No free quota encoded | 1,400+ lounges; each visit charged up to USD35/person; primary Icon card required. Schema cannot encode charged access without a complimentary quota, so this is stated in benefit notes. |
| Golf | Mastercard only: 4 rounds/year, 1 lesson/month, then 50% off green fee | Card T&C §3.7. No complimentary quota established for Visa. |
| BookMyShow | up to INR200/use, twice monthly | 2+ movie tickets; maximum INR400 discount/month; primary card only; cannot combine with other offers. |
| Fuel surcharge reversal | 1%, transaction INR500–4,000, max INR200/month | Card T&C §3.5; surcharge base excludes surcharge and GST; GST is not reversed; delinquent/closed cards excluded. |
| Concierge | Yes | Card-specific T&C lists concierge referral and reservation assistance across travel, dining and other services. |
| Eligibility thresholds | unknown | Current Icon-specific page and terms do not publish age, income, credit-score, or residency cutoffs; no numeric threshold carried forward. |

## Open limitations

- The product page, network guide and card terms support both network variants, while the card schema stores one scalar network and one tier; those fields remain null.
- Current sources do not establish a fixed point-to-INR conversion. The data does not use third-party calculator estimates as issuer facts.
- The schema cannot encode a chargeable international lounge visit without implying a visit quota. The cost/access terms are retained in free-text benefit notes.
- No issuer-published launch date or numeric eligibility criteria were found.
