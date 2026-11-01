# DCB PayLess Platinum issuer-source review (27 Oct 2026)

Target: `data/cards/dcb/payless-platinum.yaml`.

## Issuer sources checked and archived

- DCB [September 2025 PayLess card MITC](https://www.dcbbank.com/api/dcb/assets/2025-09/DCB-PayLess-Credit-Card-MITC-Multilingual.pdf), retrieved 2026-10-27; local PDF and extracted text in this directory. The English text (first 12 pages) includes fees, cashback milestone, lounge and insurance terms.
- DCB [PayLess FAQ](https://www.dcbbank.com/api/dcb/assets/2024-12/DCB-Bank-Payless-Credit-Credit-Card-FAQs_0.pdf), retrieved 2026-10-27; local PDF and text. FAQ version marked Aug-2023; hosted in DCB's Dec-2024 asset directory.
- Current [PayLess Platinum page](https://www.dcb.bank.in/personal/cards/secured-card/dcb-payless-platinum-card), retrieved 2026-10-27; local capture `product-page-retrieved-2026-10-27.html`. The page is sparse and links to the card in the secured-card section, but has no detailed card terms. The prior www.dcbbank.com route redirects to this current domain.

## Verified corrections

- Fees in the MITC: nil joining, INR350 annual fee from the 13th month, annual fee waived at INR50,000 spend; 3% monthly finance (36% annual); ATM cash withdrawal 2.5% or INR250, whichever higher; forex markup 3.5%; GST applies. Late fee is nil up to INR100 due, INR100 for due >INR100 to INR1,000, and INR500 above INR1,000. Fuel surcharge waiver is 1% up to INR100 per statement cycle on fuel transaction value up to INR5,000. Card closure fee INR250 when closed within one year; this is retained in source notes because schema has no closure-fee field.
- Rewards are a conditional cashback milestone, not Reward Points: INR250 after INR50,000 qualifying spend in a quarter. Cashback is credited in the first month of the following quarter. Rent, wallet loading, online gaming, gambling, fuel and cash withdrawals are excluded. No base per-transaction earn or point-redemption ratio is stated.
- One complimentary domestic airport lounge visit per quarter (four/year), with no international entitlement in the Platinum row. Access is at participating RuPay lounges.
- Fuel surcharge: up to 1% waiver, capped INR100 per statement on eligible transaction amounts up to INR5,000. Current MITC does not state a minimum transaction amount; prior INR400 minimum was removed.
- Insurance terms state zero lost-card purchase liability except PIN-based ATM cash withdrawal, and fraudulent purchase protection up to 30 days before reporting subject to FIR and applicable policy conditions. Primary cardholder only; active account, nomination details and policy terms apply. Coverage amount is not published.
- FAQ eligibility: Indian resident, age 18–75, minimum DCB fixed deposit INR15,000. No income proof is required, but bank internal assessment applies. Eligible FD must be in one applicant's name; HUF, NRI, partnership/society/trust, minor, joint and tax-saver deposits are excluded. Up to 90% of deposit may determine the credit limit, subject to bank assessment. Credit-score cutoff is not published.

## Removed unsupported claims

Removed the previous 1 Reward Point/INR100 rate, INR0.25 catalog and INR0.20 statement-credit valuations, and old reward exclusions/MCC list. Current MITC publishes cashback milestones only. Corrected ATM minimum from INR300 to INR250, finance rate from 2.5% to 3%, fuel cap cycle from monthly to statement cycle, and clarified the INR5,000 transaction-value ceiling without a supported INR400 minimum. Launch date remains unknown; `2022-01-01` was unsupported. The annual fee and fee-waiver thresholds remain supported by the current hosted MITC/FAQ.

Validation results after correction are recorded in `docs/DATABASE_ACCURACY_OVERVIEW_2026-10-27.md` and the continuation checklist. Structural validation and evidence-path coverage are not factual-accuracy percentages.
