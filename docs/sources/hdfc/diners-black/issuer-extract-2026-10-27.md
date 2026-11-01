# HDFC Diners Club Black Metal Edition ? issuer comparison (27 Oct 2026)

## Primary issuer material reviewed

- [Current product page](https://www.hdfc.bank.in/credit-cards/diners-club-black-metal-edition-credit-card)
- [Fees and charges](https://www.hdfc.bank.in/credit-cards/diners-club-black-metal-edition-credit-card/fees-and-charges)
- [Eligibility](https://www.hdfc.bank.in/credit-cards/diners-club-black-metal-edition-credit-card/eligibility)
- [HDFC insurance policy PDF](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-club-black-metal-edition-credit-card/insurance.pdf), policy 2999204800579204000, valid 23 Jul 2026?22 Jul 2027 (downloaded to `insurance.pdf`)
- [HDFC card-specific terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-club-black-metal-edition-credit-card/diners-club-metal-tandc.pdf), PDF created 1 Jun 2026
- [HDFC insurance-points notice](https://v.hdfc.bank.in/htdocs/common/sms-communication.html)
- Current personal-card MITC v4.15 (17 Oct 2026) archived at `docs/sources/hdfc/_shared/mitc-v4.15-retrieved-2026-10-27.pdf`; card-specific source manifest now links to this version.
- [Lounge terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-club-black-credit-card/pdfs/lounge-tnc.pdf) and [golf terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/diners-club-black-metal-edition-credit-card/diners-club-golf-t-and-c.pdf)

## Record updated

- Cleared the unsupported `launched_on: 2014-01-01`; exact Metal Edition launch date remains unknown from the reviewed issuer pages.
- Refreshed the fee, reward, benefit and eligibility source retrieval stamps to 27 Oct 2026. Current fees remain INR 10,000 joining/annual, renewal waiver at INR 8 lakh in the preceding 12 months, 2% forex markup, 1.99% monthly finance charge and 2.5% cash advance fee (minimum INR 500). The current personal MITC lists the Diners Black Metal Edition fuel surcharge waiver as not applicable; `fuel_surcharge_waiver` remains null.
- Updated active weekend dining to 2X total (10 points per INR 150) at standalone restaurant MCC 5812/5813/5814 on Saturday/Sunday, minimum INR 150 and direct card payment. The 1 Jun 2026 card terms state these conditions but no numerical cap, so the former 1,000/day and 2,000/month caps are not asserted for the current terms. The calculator cannot filter by weekend or merchant.
- Removed insurance from active reward exclusions and modeled up to 5,000 points per month across insurance MCCs 1411, 1235, 5960, 6300 and 6381. HDFC's current notice and MITC state the 5,000 monthly cap from 1 Jul 2025; the older 5,000 daily cap expired 30 Jun 2025. Kept the separate 75,000-point statement-cycle ceiling.
- Replaced the expired insurance policy with the policy effective 23 Jul 2026?22 Jul 2027. Updated air accident (USD 250,000 / issuer headline INR 2 crore), international emergency medical (USD 62,500 / issuer headline INR 50 lakh), lost-card liability (INR 900,000), baggage delay (USD 688), credit shield (INR 900,000), loss of personal documents (USD 688) and hijacking (USD 688 schedule; USD 75 per 6 hours after 12-hour deductible). Policy cover applies to the primary cardholder. Travel covers require qualifying international travel originating in India and card-purchased tickets; trip duration is limited to 30 days. The policy's detailed terms and exclusions govern.
- Kept product-published eligibility: Indian applicants, salaried ages 21?60 and net monthly income above INR 2.5 lakh; self-employed ages 21?65 and net annual ITR income above INR 30 lakh. Current product terms also support quarterly 10,000-point milestone at INR 4 lakh, welcome memberships after INR 1.5 lakh eligible retail spend within 90 days, unlimited primary/add-on lounge access and six golf games per quarter. Complimentary lounge guest access is not included; golf access and booking conditions apply.

## Unresolved or limited evidence

- The exact Metal Edition launch date is not established by the reviewed current issuer sources; `launched_on` is null.
- `fees[0].effective_from` and the historical rewards entry still carry 2014-01-01 from the legacy record. Current sources confirm current amounts/terms but do not establish that start date; it is a legacy chronology field, not verified effective-date evidence.
- Current issuer material confirms rewards transfer at up to 1 air mile per point but does not publish a current partner-by-partner ratio/value table on the reviewed card page. Partner-level ratios and illustrative transfer values in the record were last checked 5 Jul 2026 and were not refreshed here.
- The current product page confirms marketing-level lounge/golf benefits; supporting lounge and golf terms should be read for guest/booking limits. No precise age/income beyond the published eligibility thresholds or bureau score cutoff is stated.

## Verification results

- `python scripts/validate.py`: 370 cards, 917 reward rules, 810 strict-scope, 802/810 strict-ready; zero errors/warnings.
- `python scripts/audit_stamps.py`: zero source-stamp mismatches.
- Numeric evidence-path audit: fees 2,026/2,399 (84%), rewards 2,011/2,986 (67%), benefits 2,220/3,159 (70%), eligibility 790/868 (91%). These are provenance-path counts, not a factual-accuracy percentage.
