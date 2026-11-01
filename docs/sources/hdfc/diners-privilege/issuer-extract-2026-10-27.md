# HDFC Diners Club Privilege — issuer comparison (27 Oct 2026)

## Primary HDFC sources reviewed

- [Current card page](https://www.hdfc.bank.in/credit-cards/diners-privilege-credit-card)
- [Fees and charges](https://www.hdfc.bank.in/credit-cards/diners-privilege-credit-card/fees-and-charges)
- [Eligibility page](https://www.hdfc.bank.in/credit-cards/diners-privilege-credit-card/eligibility)
- [June 2026 card-specific FAQs and terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-privilege-credit-card/pdf/diners-privilege-tnc-2026.pdf)
- [May 2026 product-change notice](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/pdf/common/Credit-Cards/Diners-Privilege-Product-Feature-Change.pdf)
- [July 2026 lounge voucher terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-privilege-credit-card/pdf/diners-privilege-update-faq-and-tnc.pdf)
- [Current insurance policy PDF](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-privilege-credit-card/pdf/diners_privilege_insurance_policy.pdf), policy 2999204800579204000, valid 23 Jul 2026–22 Jul 2027
- [Current HDFC personal MITC v4.15](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/personal-mitc/mitc-in-english.pdf), dated October 2026; archived under `docs/sources/hdfc/_shared/`
- HDFC insurance MCC notice: [SMS communication page](https://v.hdfc.bank.in/htdocs/common/sms-communication.html)

## Record changes

- Cleared the unsupported exact 2019 launch date; no primary HDFC launch announcement with an exact date was found. The `Privilege` network tier is retained because it exists in the project's Diners network tier list.
- Refreshed current issuer source stamps and archived the May product-change notice, July spend-based lounge voucher terms, October MITC and updated 2026–27 insurance policy. Preserved the expired 2025–26 policy under its dated filename.
- Current base earning is 4 Reward Points per INR 200 from 15 May 2026. Eligible online food orders from Swiggy/Zomato/Eternal earn 5X total (20 points per INR 200), including 4X incremental points capped at 2,500/month across the merchants. The June 2026 terms match the May notice/current product page; the old INR 150 earn basis belongs to superseded terms.
- Added current published caps: 50,000 points earned per statement cycle; insurance 2,000 points/month (MCCs 1411, 1235, 5960, 6300 and 6381); groceries 2,000/month; utility 2,000/month; telecom 2,000/month. Added two-year point expiry and the inactivity forfeiture rule after more than 365 days unused.
- Corrected cashback redemption minimum from 1,000 points to INR 500 / 2,500 points. Added INR 50 + GST cashback request fee, INR 99 + GST catalogue redemption fee, monthly 50,000-point cashback redemption cap, SmartBuy travel redemption limit of 50% of booking value and 70% limit for select products/vouchers. Added the published 0.50 RP values for select restaurant redemption.
- Updated lounge benefits to 2 domestic + 1 international voucher per quarter after INR 60,000 eligible spend in the preceding quarter, effective 1 July 2026. Only the primary cardholder may generate/use vouchers; generated vouchers are valid 180 days. Updated welcome and quarterly voucher wording and added the current 10% participating Dineout benefit.
- Replaced expired insurance values with the policy currently linked from HDFC's card page: USD 125,000 air accident, USD 31,250 emergency medical, INR 900,000 card liability, USD 625 baggage delay, INR 900,000 credit shield, USD 625 personal-document loss and USD 625 hijacking schedule. All listed covers are primary-cardholder only; international travel conditions and policy exclusions apply.
- Kept the fuel surcharge waiver null because the MITC says it is not applicable. This is separate from the current 1% fee on individual fuel transactions above INR 15,000.
- Cleared unsupported residence assertion: issuer page says Indian nationality but does not establish resident/NRI status, so residency is null. Preserved salaried annualized income field but documented the main card page's net-income wording versus the eligibility subpage's gross-income wording.

## Unresolved issuer discrepancies and schema limits

- The current fee FAQ says INR 100 for lost/damaged-card reissue, while the May 2026 card notice and current MITC say INR 199 + GST. The MITC dates the 1.75% DCC fee from 20 May; the card-specific change notice says 15 May. Both conflicts remain documented in `fees.notes`.
- `fees.effective_from` remains 15 May 2026 as the date of the card update; the issuer does not establish that all listed joining/renewal charges began then.
- Salaried income is variously described as gross monthly income above INR 35,000, net salary INR 35,000, and net income at least INR 35,000. The precise threshold basis is unresolved. The issuer publishes Indian nationality, not a residence-status condition or numeric credit-score floor.
- SmartBuy is advertised as “up to 10X”; current public material reviewed does not specify all qualifying portal categories or an accelerator cap. The rule is recorded as a maximum, not a guaranteed 10X rate on every SmartBuy transaction.
- HDFC MITC also publishes separate transaction charges for rent, wallet, utility, third-party education-app and fuel spends. The schema has no structured per-category transaction-fee fields; those charges are summarized in `fees.notes`.

## Verification results

- `python scripts/validate.py`: 370 cards, 917 reward rules, 810 strict-scope; 802/810 strict-ready; zero errors and warnings.
- `python scripts/audit_stamps.py`: zero source-date mismatches.
- Numeric evidence-path audit: fees 2,026/2,399 (84%), rewards 2,019/2,994 (67%), benefits 2,230/3,169 (70%), eligibility 790/868 (91%). These counts measure recorded evidence paths, not verified factual accuracy.
