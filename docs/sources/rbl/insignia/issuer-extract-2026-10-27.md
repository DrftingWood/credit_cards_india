# RBL Insignia Preferred Banking Credit Card issuer evidence (reviewed 2026-10-27)

Primary issuer sources reviewed:

- [Current Insignia product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/insignia-preferred-banking-credit-card)
- [Current card-specific Insignia T&Cs](https://webassets.rbl.bank.in/document/credit-cards/terms-conditions-insignia-credit-card.pdf)
- [Current Insignia KFS](https://webassets.rbl.bank.in/document/credit-cards/kfs/kfs-yf-generic-insignia.pdf)
- [RBL MITC/KFS](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf)
- [RBL Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf)
- [Network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide)
- [Current RBL Rewards terms](https://rblrewards.rbl.bank.in/tnc)
- [RBL Miles Transfer terms](https://webassets.rbl.bank.in/document/credit-cards/rbl-miles-transfer-programme.pdf)
- [Insignia milestone voucher guide](https://webassets.rbl.bank.in/document/credit-cards/insignia-milestone-benefits.pdf)

The dated PDF captures, Rewards terms HTML capture, and this claim comparison are archived in this folder.

| Field | Current encoding and source finding |
|---|---|
| Network and tier | Both Mastercard and Visa are listed; schema scalar network/tier left null. Mastercard-only golf benefit is explicitly variant-scoped. The product's World wording does not settle the issued Visa tier. |
| Launch date | Cleared; no date found in current primary sources. |
| Fees | INR7,000 first year and renewal, GST additional; renewal waiver at INR10 lakh eligible membership-year spend. Schedule also lists nil-fee Insignia Banking customer exception; welcome and spend waiver do not apply to that segment. Standard card values retained; segment exception in notes. |
| Standard finance charges | Up to 3.99% monthly; 2.5% cash advance, min INR500; 1.5% foreign currency markup for Insignia. |
| Rewards | 5 points/INR100 domestic, 10 points/INR100 international. Eligible settled retail transactions; points credit within 45 days. No fixed rupee value stated in current materials; portal value varies by product/category. |
| Miles transfer | 3 RBL reward points = 1 partner mile/point; active airline/hotel partners and availability vary. Primary cardmember only; multiples of 3, up to 50,000 points/request and two requests/month. |
| Points redemption | Current portal terms say no INR99+GST redemption fee for Insignia; standard reward points do not expire after 24 months for this card, but outstanding points lapse on account closure. |
| Welcome | 28,000 points; eligible retail purchase within 30 days and first annual fee paid by due date; credited within 60 days. Not applicable to nil-fee Insignia Banking customers. |
| Milestone | INR8,000 e-gift voucher at INR8 lakh eligible retail spend in a membership year; options include Amazon, Myntra, Croma, MakeMyTrip and Taj Experiences; credit within 45 days. Voucher redemption link expires 120 days after eligibility communication. |
| Domestic lounge | Two complimentary visits per calendar quarter. Up to INR25 validation authorization reversed same month. Guests are charged after cardmember complimentary visits are exhausted. |
| International lounge | Six complimentary visits per calendar year through Priority Pass/LoungeKey. Activate international online transactions. Up to USD1 validation authorization reversed; subsequent visits up to USD35. Each calendar month with INR1 lakh eligible spend adds a claimable LoungeKey voucher, over and above six; claim window and voucher validity apply. |
| Golf | Mastercard only: four complimentary rounds/year, one lesson/month, then 50% off green fee. No Visa variant complimentary quota stated. |
| Movies | Flat INR500 BookMyShow discount, twice per calendar month, primary card only. |
| Fuel surcharge | 1% reversal up to INR500/month on fuel transactions INR500–4,000 (transaction amount excluding surcharge); GST excluded; delinquent, over-limit and closed cards excluded. |
| Other current page benefits | EazyDiner Prime dining discounts/buffet/priority booking and property-dependent benefits at 2,400+ hotels; variable benefits not encoded as fixed numeric amounts. Concierge assistance is included. |
| Eligibility | Product is for Insignia Preferred Banking customers, but no card-specific age/income/credit-score/residency numeric cutoffs were found. |

## Open representation notes

- The database's scalar network fields cannot show Visa and Mastercard variants at once.
- A scalar annual fee cannot fully represent the separate nil-fee Insignia Banking customer segment. This record carries standard Preferred Banking fees and documents the separate segment exception.
- The schema has no partner-transfer ratio field; the 3:1 rate is retained in reward notes.
- Partner miles, lounge availability, EazyDiner benefits and hotel privileges depend on currently active partners/locations and their own conditions.
- No current launch date or numeric applicant eligibility thresholds were found.
