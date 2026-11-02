# RBL IRCTC Credit Card issuer evidence (reviewed 2026-10-27)

Sources checked: [current RBL product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/irctc-rbl-bank-credit-card), linked [card-specific product T&Cs](https://webassets.rbl.bank.in/document/credit-cards/tnc-irctc-rbl-bank-rupay-credit-card.pdf), linked [card FAQ](https://webassets.rbl.bank.in/document/credit-cards/irctc-rbl-bank-credit-card-faqs.pdf), current [MITC](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf), current [Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf), current [network guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide), and [train lounge terms](https://webassets.rbl.bank.in/document/credit-cards/irctc-cc-complimentary-railway-lounge-access.pdf). PDFs are archived under this directory.

| Field | Current issuer evidence and encoding |
|---|---|
| Network | Mastercard and RuPay both available; schema scalar cleared. RuPay-only NCMC/UPI perks described separately on product page. Tier not established. |
| Launch date | Cleared; current issuer sources do not establish a launch date. |
| Fees | INR500 joining and annual renewal fee + GST. Current schedule has no waiver. Central MITC states 2.5% cash advance/min INR500, up to 3.99% monthly finance, 3.5% forex. |
| Rewards | 1 point/INR200 general eligible spend; 5/INR200 on all-class IRCTC train bookings, max 1,000/billing cycle; 3/INR200 FASTag/RBL digital NCMC/UTS, max 1,000/cycle; 2/INR200 IRCTC flights/hotels, max 1,000/cycle. Product page rates confirm FAQ/card terms. |
| Point redemption | INR1/point only for IRCTC train ticket bookings via IRCTC/iPay. Do not treat this as universal cash value. |
| Exclusions | Fuel/auto, utilities, insurance, quasi-cash, rent, education, wallets/service providers, government, contracted services, cash, miscellaneous, Bills2Pay, EMI, fees/charges/GST. Card T&Cs list the MCCs in the product page capture and PDF. |
| Welcome | 500 points after eligible retail transaction above INR500 within 30 days of issuance and first membership fee paid by due date; within 60 days. FAQ says INR500 and above; T&C/product page uses above INR500, so structured condition follows the more specific card terms and open threshold edge documented. |
| Quarterly milestone | 500 points for INR75,000 eligible calendar-quarter spend. Primary/add-on eligible spend counted; excluded purchases, EMI, cash, charges and GST do not count. |
| Railway lounge | Two select IRCTC Executive Lounge visits per calendar quarter; primary only; valid card and train ticket required, availability applies. INR2 validation charge on RuPay and INR25 on Mastercard. |
| Train cancellation shield | Up to INR5,000, conditional third-party/ex-gratia reimbursement; domestic confirmed/RAC IRCTC booking/cardholder, eligible alternate rebooking, claim timing and frequency restrictions apply. Not unconditional cover. |
| IRCTC transaction-fee reversal | Waive 1% IRCTC charge for qualifying train ticket transactions up to INR5,000 transaction amount, maximum INR200/month. Refund may be reversed after ticket cancellation. |
| Eligibility | FAQ publishes age 21–70 subject to RBL internal policy. Numeric income, score and residency requirements not found. |

## Schema and source notes

- Mastercard + RuPay variants cannot both be encoded in the scalar network field; current value is null and variant-specific features are noted.
- `benefits.other` captures conditional train cancellation protection and IRCTC booking fee reversal. It has no dedicated typed field for the rules or claim limitations; descriptions carry the eligibility restrictions.
- The current card-specific PDF is titled RuPay, while product/network guide shows Mastercard and RuPay. Shared product benefits and central terms cover both where explicitly stated; validation authorization varies by network.
