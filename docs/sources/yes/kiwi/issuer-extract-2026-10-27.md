# YES Bank Kiwi RuPay Credit Card issuer/partner review (27 Oct 2026)

## Sources reviewed
- Kiwi YES Bank card page: https://www.gokiwi.in/cards/yesbank/
- Kiwi Rewards Policy (current; accessed 27 Oct 2026): https://gokiwi.in/rewards-policy-v2/
- Kiwi Neon terms (effective 01 Feb 2025): https://gokiwi.in/neon/neon2/
- Kiwi Boost terms (effective 29 Jun 2026): https://gokiwi.in/kiwi-boost-membership/
- YES BANK credit-card SOC/MITC (local current PDF): `docs/sources/yes/klick/yesbank-mitc-v18-current-2026-10-26.pdf`
- YES BANK June 2026 change notice: https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT8966189EF8734F58919CDA61BAFF0D96/native/communication_group_1_final_sms.pdf?download=false

## Reconciliation
- Removed unsupported 01-Jun-2024 effective date; Kiwi policy applies to Kiwi-issued cards since 04-Jul-2024. Kept lifetime-free fees and 3.99% monthly finance charge.
- Updated foreign-currency markup to 3.5% effective 15-Jun-2026; cash advance fee is nil for virtual RuPay/Klick; fuel waiver effective from 15-Jun-2026 is 1% on ₹500–₹3,000 transactions, capped at ₹250 per statement cycle.
- Standard Kiwi card rewards: 1.5% in Kiwis on eligible merchant Scan & Pay, 0.5% on eligible online transactions, with 4 Kiwis = ₹1. Rewards accrue only on whole ₹100 transaction increments and monthly earn is capped at 1% of assigned credit limit measured in Kiwis. Kiwis redeem to the linked goaxb UPI ID at 500-Kiwi minimum and in multiples of 500. Removed unsupported “instant bank cashback” wording and normalized the cap.
- Documented Kiwi's current exclusions and MCC schedule; direct school/college website or POS payments may earn where third-party-app education transactions are excluded.
- Corrected Kiwi Neon: optional ₹999 + tax annual membership for select users, 2% scan-and-pay plus 3%/4%/5% annual spend milestones at ₹50k/₹1L/₹1.5L, each with one lounge pass; milestone cashback is net of prior annual cashback and excluded from the monthly cashback cap. Added optional Kiwi Boost at ₹49 + tax for three months, which raises eligible Kiwi-app online payments from 0.5% to 1%.
- YES BANK Klick product pages also list YES Rewardz on UPI/non-UPI. Kiwi's issued-card rewards program publishes the Kiwis program with different channels/rates. This record follows the Kiwi-issued card program; attribution of bank Rewardz alongside Kiwi Kiwis remains unclear and should be checked against an issued card’s current account-specific reward ledger.

## Limits
The schema has one reward currency per record, so it does not encode Kiwi and YES Rewardz together if both post to the same Kiwi-issued account. Membership eligibility is selective/in-app. Recheck offer terms and fees at the next review.
