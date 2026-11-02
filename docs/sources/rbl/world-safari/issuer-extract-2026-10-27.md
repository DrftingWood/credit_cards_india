# RBL World Safari Credit Card issuer evidence (reviewed 2026-10-27)

Primary issuer sources checked:

- [Current World Safari product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/world-safari-credit-card), retrieved 2026-10-27.
- [World Safari product terms](https://webassets.rbl.bank.in/document/pdfs/terms-world-safari-card.pdf), retrieved 2026-10-27; archived local PDF.
- [Current RBL network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide), retrieved 2026-10-27.
- Current RBL MITC and Schedule of Charges in `docs/sources/rbl/_shared/`.

The existing `terms-world-safari-card.pdf` was preserved. New retrievals are saved beside it, with the product page and network guide archived as HTML.

## Field comparison

| Field | Previous YAML | Current issuer evidence / updated interpretation |
|---|---|---|
| Network and tier | Mastercard / World | Current issuer network guide and Nov-2025 application form support Mastercard and Visa variants. Scalar network and tier cleared to null; Mastercard-only golf concierge remains variant-dependent. |
| Launch date | 2018-01-01 | No current primary source establishing this date was found; cleared. |
| Fees | INR3,000 joining and annual, INR5L waiver | Product page states INR3,000 annual fee and no waiver. Kept fee waiver null. Zero forex markup is exclusive of taxes. Central MITC supports 3.99% monthly maximum finance charge and 2.5%, minimum INR500, cash advance fee. |
| Rewards | 2/INR100 base, fabricated fixed values, incomplete exclusions | 2 points/INR100 eligible domestic retail and 5/INR100 eligible travel spend; points credited within 45 days. Removed fixed point-to-INR redemption values not supported by current issuer source. Added MCC exclusions from product page. No monthly/transaction cap shown. |
| International travel rewards conflict | YAML notes said no international rewards | Product page says no points on international purchases (product page lines 77-80); card-specific terms §3.4(c) say international travel spend earns 5/INR100. Data note preserves this conflict; public page's broad exclusion and terms' travel exception cannot be reconciled from available issuer text. |
| Welcome | Joining fee paid; 90 days | INR3,000 MakeMyTrip voucher requires eligible retail transaction within 30 days of issuance and first-year fee paid by due date; issuer says voucher delivery within 60 days and link validity 120 days from eligibility communication. |
| Milestones | INR5L for INR3,000 travel voucher | 10,000 points at INR2.5L, additional 15,000 at INR5L, INR10,000 brand voucher at INR7.5L during membership year. |
| Domestic lounge | 8/year with Mastercard/DreamFolks | 2/quarter, primary cardmember, conditional on INR35,000 spend in previous calendar quarter effective 01-Jul-2025. No add-on access. |
| International lounge | 8/year | 2 complimentary calendar-year Priority Pass visits plus one additional LoungeKey voucher visit each calendar quarter after INR50,000 spend in that quarter. Subsequent visits charged up to USD35; primary cardmember. |
| Insurance | INR5,000,000 medical and INR100,000 baggage | Current page lists covered types but current terms were not verified for these limits; removed unsupported numeric amounts. |
| Fuel | 1%, INR400-4,000, cap INR500/month | Current page says 1%, transaction INR500-4,000, cap INR250/month. |
| Concierge and golf | Concierge false; golf missing | Current page offers 24x7 referral/reservation concierge. Four complimentary green-fee rounds/year, one lesson/month, then 50% discounted green fee; golf concierge only Mastercard. |
| Eligibility | Resident Indian; numeric thresholds unknown | No card-specific numeric age/income/score criteria found. Residency retained as broad India issuance status; numeric unknowns remain explicit. |

## Remaining limitations

- Product page and card terms conflict on international travel reward points; preserve both claims until RBL clarifies.
- Insurance policy limits were not established from the currently linked terms in this review.
- Network and tier are variant-specific, while the YAML stores scalar fields.
- No issuer-published launch date or card-specific numeric eligibility threshold was located.
- Lounge cap structure is represented in the existing schema as a basic quota; quarterly spend gates and variant-specific details stay in source notes / issuer evidence.
