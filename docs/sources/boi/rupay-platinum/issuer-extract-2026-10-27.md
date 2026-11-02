# BOI RuPay Platinum Credit Card source comparison (2026-10-27)

## Sources reviewed

- [Current BOI RuPay Platinum credit card page](https://bankofindia.bank.in/credit-card/rupay-platinum-credit-card): RuPay Platinum credit; nil issuance and principal annual fee, ?200 add-on fee; 2X Rewardz points on POS/e-commerce; RuPay portal offers; 24?7 concierge; active savings account, age 21+, regular income, good credit history, Indian resident or NRI.
- [BOI Key Fact Statement / MITC](https://bankofindia.bank.in/documents/20121/27694131/KFS__MITC.pdf): nil issue/renewal fee for RuPay Platinum; unsecured revolving finance 2% monthly; cash withdrawal fees vary: BOI ATM 2% minimum ?50; other ATM 2.5% minimum ?75; overseas ATM 2.5% minimum ?125 plus currency conversion. Current KFS describes account-level applicability and card details.
- [BOI Star Rewards](https://bankofindia.bank.in/star-rewards): indexed current credit schedule (live 01-Sep-2025): standard category 2 points/?100 for transaction value ?100+; preferred category 3 points/?100; 10,000 points/month maximum per customer/CIF; POS/e-commerce exclusions removed from 01-Sep-2025; UPI credit transactions of ?2,000 or less earn no points. Direct page request returned 403; content was available in issuer-indexed extraction.

## Corrections

- Annual principal fee changed from ?350 to nil. Add-on fee ?200 is documented but not in the principal-card scalar. Removed unsupported ?50,000 fee-waiver condition.
- Monthly finance charge corrected from 2.5% to 2% for unsecured credit. Cash-advance charges vary by ATM, so the schema uses the common other-bank domestic ATM schedule (2.5%, minimum ?75) and documents BOI/overseas variation. Foreign-currency purchase markup was not established and is null.
- Reward base updated from 1 to 2 points/?100. Current Rewardz page adds a preferred 3-point tier (card-specific category list unavailable), a 10,000/month cap, and UPI transactions ??2,000 excluded; these are noted separately. Current point rupee value and detailed redemption rates are not published in accessible official terms, so unit value was cleared.
- Current RuPay Platinum credit page does not advertise lounge access or fuel-surcharge waiver. Previous lounge claim and ?100 monthly fuel waiver are cleared; do not conflate BOI RuPay Platinum debit card benefits with the credit card. Current credit page confirms 24?7 concierge.
- Cleared unsupported 2022 launch date. Applicant age 21+ and resident/NRI status confirmed; active BOI savings account, regular income and good credit history are stated, but income/score cutoffs are not.

## Open issues

The bank's card page says ?2X? POS/ECOM points while its current Star Rewards schedule gives standard 2 points/?100 and preferred 3 points/?100; the preferred-category list for this card is not accessible. Star Points rupee value varies/was not stated in the currently accessed issuer text. No current credit-card lounge or fuel waiver claim was found. Foreign-currency markup is not verified from the accessible card/KFS material.
