# BPCL SBI Card OCTANE — issuer comparison (27 Oct 2026)

## Sources reviewed

- SBI Card [current OCTANE product page](https://www.sbicard.com/en/personal/credit-cards/bpcl-sbi-card-octane.html), saved as `product-page-current.html`.
- SBI Card [current OCTANE terms booklet](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/ekit-tncs/BPCLOctanetnc.pdf), saved as `bpcl-octane-terms-current.pdf` and text-extracted beside it.
- SBI Card [launch disclosure](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/disclosure-under-regulation-30-press-release-dec.pdf), saved as `launch-disclosure-dec-2020.pdf`.
- SBI Card [current MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page) and [cardholder agreement](https://www.sbicard.com/en/cardholder-agreement.page).

## Corrections and verified fields

- Set launch date to 15-Dec-2020 from the SBI launch disclosure. The prior 1-Apr-2021 date was unsupported.
- Cleared the single Visa Signature claim: SBI's page permits Visa and Mastercard. Network and tier are null; `multi-network` is tagged.
- Fees: current page lists INR1,499 joining/annual fees and reversal of renewal fee after INR2 lakh previous-year annual spend; MITC confirms finance, forex and cash-advance terms. Current page and MITC establish current terms but do not date the start of the fee record's 1-Apr-2021 effective period.
- Welcome: current product page requires payment of the annual fee for 6,000 points (INR1,500 stated value), credited within 30 days. The 2020 launch disclosure says joining fee, so the current trigger supersedes the launch wording for this live offer.
- Rewards: 25 points/INR100 at BPCL fuel/lubricants, max 2,500 points per billing cycle; 25/INR100 for Bharat Gas website/app LPG booking, max 500 per billing cycle; 10/INR100 on eligible dining, departmental stores, grocery and movies, max 7,500 per month; 1/INR100 on other retail. Four points equal INR1 for redemption. Merchant-ID recognition and transaction-channel conditions apply.
- The booklet also says points can be earned for a maximum spend of INR10,000/month but gives no scope for that statement; it is recorded as an unresolved issuer ambiguity and not modeled as a global earn cap. The booklet specifies the four 10-point categories by MCC: grocery 5411, departmental stores 5311, movies 7832/7922, and dining 5812/5813/5814.
- Retained MCC exclusions for rent (6513) and wallet (6540/6541); current terms also list fees, cash advance and EMI/disputed transaction exclusions. These are described in the reward notes where the schema has no structured field for each rule condition.
- Benefits: INR2,000 voucher at INR3 lakh annual spend; 4 domestic Visa lounge visits per calendar year, max one per quarter; 1% fuel surcharge waiver on BPCL purchases up to INR4,000 with INR100 statement-cycle cap. RuPay UPI BPCL transactions do not earn the fuel reward or surcharge waiver under the booklet.
- Added INR1 lakh fraud-liability cover and the booklet's 45-day reporting requirement, with claim conditions subject to insurer terms.
- Eligibility uses SBI's general policy age bands; no OCTANE-specific minimum income or credit-score cutoff was found. The policy source is dated 25-Oct-2026.

## Remaining source limitations

The current product page supports a Visa lounge entitlement while the product is offered through more than one network. The record models the Visa entitlement and makes the card's network unspecified. Historical effective dates for the current fee/reward/benefit schedules are not established by the current pages. OCTANE's exact issuer fields were checked against the current page and booklet; numeric evidence paths are recorded in YAML but do not themselves prove accuracy.
