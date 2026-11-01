# Credit card database accuracy overview (27 Oct 2026)

## What these numbers establish

The database has no measured factual-accuracy percentage. Structural validation, provenance checks and explicit evidence-path coverage do not prove that cited issuer sources support every value or that the sources remain current. Field-level comparisons against primary issuer sources are required to establish factual accuracy.

## Validation guidance

The review separates accuracy (whether values match current issuer evidence) from validity (expected format/range), completeness, consistency, uniqueness and timeliness. This follows the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) and its [data quality action-plan guide](https://www.gov.uk/government/publications/implement-a-data-quality-action-plan/data-quality-action-plan-implementation-guide). These sources guide the review method; they are not issuer evidence for card values.

## Current live snapshot

- Checklist review: 88/370 records completed; 282 remain. This is a record count, not an accuracy percentage.
- 370 card records across 33 issuers, 5 networks and 5 loyalty programs.
- 923 reward rules; 812 active/invite-only strict-scope rules.
- 804/812 strict-ready (99%); 8 lack confidence metadata. All strict-scope rules have issuer-owned URLs, source dates and source types, and are within 180 days of source retrieval.
- `python scripts/validate.py`: zero errors and zero warnings.
- `python scripts/audit_stamps.py`: zero records where verification date is later than the newest nested source retrieval date.
- The oldest exact verification-date cohort is 35 active/invite-only records dated 2026-10-25; next by path is IRCTC SBI Card Premier (`data/cards/sbi/irctc-premier.yaml`). Google Pay Flex, both IndiGo SBI Cards, Flipkart SBI Card and IRCTC SBI Platinum are now reviewed. Queue derived with `python tmp/next_queue.py`.
- Numeric evidence-path audit: fees 2,073/2,386 (87%); rewards 2,133/2,980 (72%); benefits 2,379/3,162 (75%); eligibility 799/878 (91%). These are traceability coverage figures, not an accuracy score.
- Dataset-wide field-by-field validation goal remains active. This is a progress snapshot, not a completion report.

## Latest record-level review: IRCTC SBI Platinum Card (27 Oct 2026)

Compared SBI's current IRCTC Platinum product page and card-specific Visa/RuPay T&C with the current MITC, IRCTC FAQ and SBI rewards calculator. Removed the unsupported 2018 launch date, Visa-only/Platinum network metadata, aggregator-derived income statement, and dead product/application URLs; recorded network tier and card-specific income/score as unknown. Confirmed INR 500 joining/renewal fee, common MITC charges, closed-loop INR 1/point IRCTC redemption, 1 point/INR 125 non-fuel retail, seasonal rail value-back, and absence of a monthly/annual rail value-back cap. The schema cannot represent travel-date seasons, so the rule uses the lower 4% season and notes both 4% and 10% date ranges. Added detailed exclusions/MCCs, monthly transfers, IRCTC point expiry/inactivity/closure restrictions, 350-point activation offer, 500-point renewal reward, 4 annual railway lounge visits, fuel waiver and direct IRCTC booking transaction-charge waiver. Cleared the unsupported concierge claim. Source archive and field comparison are in `docs/sources/sbi/irctc-platinum/`; manifest/index updated. Validator: zero errors/warnings; source-stamp mismatches: zero. Numeric evidence paths: fees 2,073/2,385 (87%), rewards 2,133/2,973 (72%), benefits 2,379/3,156 (75%), eligibility 799/878 (91%). Checklist: 88/370; 282 remain; next queue item IRCTC SBI Card Premier. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: IndiGo SBI Card (27 Oct 2026)

Compared SBI's current base-card e-kit T&C and MITC with the issuer's 25-Sep-2025 launch filing/release and IndiGo's current BluChip earning rules. Corrected launch date and recorded Mastercard/RuPay variants with tier unknown; confirmed INR 1,499 annual/renewal fee without waiver and 3.5% forex markup. Corrected card earning to 3 BluChips/INR 100 on IndiGo app/web, 2/INR 100 on hotel/travel MCCs, and 1/INR 100 base. Removed unsupported fixed BluChip value and the universal 19-point flight total, which depends on separate loyalty-program base, channel and tier bonuses. Added all exclusions/MCCs, non-cash redemption, two-year activity expiry and voluntary closure rule. Confirmed 2,500 welcome BluChips after joining fee plus first transaction within 60 days; separate 2,500 renewal benefit; 2.5k milestones at INR 2/4/6 lakh; 4 domestic lounge visits with INR 50k prior-quarter spend; and 1% fuel waiver on INR 500-4,000 transactions up to INR 400 per statement. Removed dead product/application URL. Sources archived in `docs/sources/sbi/indigo/`; manifest/index updated. Validator: zero errors/warnings; stamp mismatches: zero. Numeric evidence paths: fees 2,073/2,385 (87%), rewards 2,133/2,973 (72%), benefits 2,379/3,156 (75%), eligibility 799/878 (91%). Checklist: 87/370; 283 remain; next queue item IRCTC SBI Platinum. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: IndiGo SBI Card ELITE (27 Oct 2026)

Compared the current SBI e-kit card T&C and MITC/KFS with SBI's 25-Sep-2025 launch filing and press release. Corrected launch date; recorded Mastercard/RuPay variants with network tier unknown; removed unsupported 1.99% forex markup because current KFS excludes this card from the listed 1.99% group. Corrected Hotel/Lodging & Travel earn to the card T&C's 3 BluChips/INR 200; noted the launch press release advertises 3% (unresolved issuer conflict). Added card T&C exclusions/MCCs, non-cash BluChip redemption/expiry and closure rules, welcome and renewal voucher triggers, INR 1 lakh / three-month Prime Pass threshold, milestones and fuel waiver per billing statement. Confirmed 8 domestic (2/quarter) and 6 international lounge visits from issuer launch release; current detailed qualification rules not established. Removed unsupported specific insurance coverage amounts and forex value. Sources archived at `docs/sources/sbi/indigo-elite/`; manifest and index updated. Validator: zero errors/warnings. Stamp mismatches: zero. Numeric evidence-path coverage: fees 2,073/2,385 (87%), rewards 2,133/2,976 (72%), benefits 2,379/3,162 (75%), eligibility 799/878 (91%). Checklist: 86/370; 284 remain; next queue item IndiGo SBI Card. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: Google Pay Flex SBI Card (27 Oct 2026)

Reviewed the active SBI card e-kit T&C booklet and current MITC, issuer-hosted launch coverage dated 29/30-Jul-2026, and live Pay-in-EMI terms. The linked SBI product-page URL returns 404. Corrected network to multi-network Visa/RuPay with tier unknown; corrected launch date to 29-Jul-2026 from issuer media coverage. Updated fees/waiver evidence, Pay-in-EMI minimum/tenures/processing fees, welcome offer (INR 500 Google Pay gift plus 500 Stars after joining-fee payment), 2X activation/spend-active rules, 1X/2X/4X/8X milestone thresholds, detailed exclusions and MCCs, 1,500-Star statement-cycle cap, INR 1 realized value and one-year expiry. The terms describe milestone rewards as an introductory Google Pay offer subject to change. The public 18,000/year headline is retained as a marketing figure, not substituted for the explicit per-cycle cap. Cleared unsupported fuel waiver and concierge claims; kept unsupported card-specific income/score unknown. Source PDF and extracted text: `docs/sources/sbi/google-pay-flex/`; manifest/index updated. Audits: validator zero errors/warnings; source-date mismatches zero; strict-ready 804/812. Numeric evidence paths: fees 2,073/2,386 (87%), rewards 2,133/2,976 (72%), benefits 2,379/3,162 (75%), eligibility 799/878 (91%). Checklist 85/370; 285 remain. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: Flipkart SBI Card (27 Oct 2026)

Compared SBI Card current Flipkart product page and card-specific terms booklet with its Aug-2025 issuer launch release, current KFS/MITC, issuance policy and Cleartrip offer T&Cs. Corrected unsupported Visa/Platinum metadata to multi-network Visa/Mastercard; confirmed launch date/fees/waiver; added Cleartrip 5% and Shopsy to the four capped cashback groups; restored named Zomato/Uber/Netmeds/PVR partners, quarterly caps, exclusions/MCCs, Rs.100 transaction minimum, rounding and credit timing. Corrected welcome vouchers to Rs.250 plus conditional Rs.500 Flipkart and Rs.500 Cleartrip vouchers. The product page still advertises 12% on Cleartrip, but the detailed offer T&Cs located expired 30-Jun-2026, so no active offer terms are claimed. Removed unsupported fuel minimum and left concierge unknown. Source comparison: `docs/sources/sbi/flipkart/issuer-extract-2026-10-27.md`. Audits: validator zero errors/warnings; source-date mismatches zero; strict-ready 804/812; evidence paths fees 2,073/2,386 (87%), rewards 2,133/2,980 (72%), benefits 2,379/3,162 (75%), eligibility 799/878 (91%). Checklist 84/370; 286 remain; oldest cohort 39, next Google Pay Flex SBI Card. Evidence-path coverage is traceability, not factual accuracy.

## Latest record-level review: Eternal SBI Card (27 Oct 2026)

Compared SBI Card current Eternal product page and card-specific T&C booklet with its official launch filing, current MITC/KFS and current credit-card issuance policy. Corrected the launch date to 15-Oct-2026; cleared unsupported single-network RuPay/Platinum metadata; separated 10%/5% Eternal-app instant discounts from cashback; split the ixigo 4% coupon discount from its 1% cashback; corrected the fuel waiver cap to INR200; and replaced incomplete reward exclusions/MCCs with the current booklet list. Flagged the fee-waiver conflict: current product page and MITC say INR2 lakh while the currently linked May-2026 KFS says INR1 lakh. The current card-specific product page/MITC value is retained pending issuer reconciliation. Removed unsupported welcome value/window and concierge assertion. Source archive and field comparison: docs/sources/sbi/eternal/issuer-extract-2026-10-27.md. Audits: validator zero errors/warnings; source-date mismatches zero; strict-ready 803/811; evidence paths fees 2,064/2,386 (87%), rewards 2,116/2,977 (71%), benefits 2,373/3,177 (75%), eligibility 799/878 (91%). Checklist 83/370; 287 remain; oldest cohort 40, next Flipkart SBI Card. Traceability coverage is not factual accuracy.

## Latest record-level review: Doctor’s SBI Card (IMA) (27 Oct 2026)

Compared SBI's current IMA-specific terms and brochure with the current MITC, cardholder agreement/reward cap policy, eligibility policy and launch archive. Confirmed current fees and waiver, separate Medical/Travel and International monthly reward caps, exclusions, vouchers, insurance, Priority Pass and surcharge waiver. Removed unsupported aggregator income threshold, repaired garbled age-range text, and documented network and redemption conflicts. Current audits: 370 cards / 922 reward rules; 811 strict-scope rules, 803/811 strict-ready; validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,050/2,385 (86%), rewards 2,087/2,982 (70%), benefits 2,333/3,179 (73%), eligibility 799/878 (91%). Checklist 78/370; 292 remain; oldest cohort 45, next Doctor's SBI Card. Field comparison: `docs/sources/sbi/doctors-ima/issuer-extract-2026-10-27.md`. Traceability coverage is not factual accuracy.

## Latest record-level review: SBI Card ELITE (27 Oct 2026)

Compared the current ELITE page with KFS/MITC, cardholder agreement/reward cap, lounge and Priority Pass materials, issuance policy and issuer-hosted 2016 launch article. Corrected launch date, network variants, 5X earn rate and 10,000-point monthly cap, statement-redemption fee/minimum, lounge quota, exclusions and eligibility. Removed the unsupported realized point value and catalog rate; added current movie, voucher, milestone, fuel, concierge and fraud-liability benefits. Archived source bundle and field comparison under `docs/sources/sbi/elite/`. Current audits: validator zero errors/warnings; source-date mismatches zero; 804/812 strict-ready. Numeric evidence paths: fees 2,055/2,386 (86%), rewards 2,104/2,980 (71%), benefits 2,367/3,179 (74%), eligibility 799/878 (91%). Checklist 82/370; 288 remain; oldest cohort 41, next Eternal SBI Card. Traceability coverage is not factual accuracy.

## Previous record-level review: SBI Card ELITE Business (27 Oct 2026)

Compared SBI’s current sitemap and MITC/KFS records with the 2019 card booklet and product URL. Current sitemap still lists ELITE Business, but its product link returns 404. Removed unsupported current Visa Signature/network, fees and waiver assumptions; kept finance rate null because secured/unsecured status is unknown; removed the dead application URL. Archived current MITC, historical card booklet and field comparison under `docs/sources/sbi/elite-business/`. Current audits: validator zero errors/warnings; stamp mismatches zero; 804/812 strict-ready. Numeric evidence paths: fees 2,049/2,384 (86%), rewards 2,097/2,981 (70%), benefits 2,343/3,179 (74%), eligibility 799/878 (91%). Checklist 81/370; 289 remain; oldest cohort 42, next SBI Card ELITE. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: SBI Card ELITE Advantage (27 Oct 2026)

Compared SBI?s current MITC/KFS, sitemap and product URL. Confirmed annual/renewal fees of INR4,999, INR10-lakh preceding-year waiver and INR500-minimum/2.5% cash-advance fee. The product link redirects to standard ELITE; removed the misleading apply URL and kept Advantage-specific joining fee, forex, rewards, benefits, eligibility, network/tier and launch date unknown where primary evidence was absent. Archived the KFS and redirect capture with comparison under `docs/sources/sbi/elite-advantage/`. Current audits: validator zero errors/warnings; stamp mismatches zero; 804/812 strict-ready. Numeric evidence paths: fees 2,050/2,385 (86%), rewards 2,097/2,981 (70%), benefits 2,343/3,179 (74%), eligibility 799/878 (91%). Checklist 80/370; 290 remain; oldest cohort 43, next SBI Card ELITE Business. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: Doctor?s SBI Card (27 Oct 2026)

Compared SBI’s current MITC/KFS, sitemap and product URL. Confirmed annual/renewal fees of INR4,999, INR10-lakh preceding-year waiver and INR500-minimum/2.5% cash-advance fee. The product link redirects to standard ELITE; removed the misleading apply URL and kept Advantage-specific joining fee, forex, rewards, benefits, eligibility, network/tier and launch date unknown where primary evidence was absent. Archived the KFS and redirect capture with comparison under `docs/sources/sbi/elite-advantage/`. Current audits at completion of that card: validator zero errors/warnings; stamp mismatches zero; 804/812 strict-ready. Numeric evidence paths at that point: fees 2,050/2,385 (86%), rewards 2,097/2,981 (70%), benefits 2,343/3,179 (74%), eligibility 799/878 (91%). Checklist 80/370; 290 remain; oldest cohort 43, next SBI Card ELITE Business. Evidence-path coverage is traceability, not factual accuracy.

## Previous record-level review: Doctor’s SBI Card (27 Oct 2026)

Compared SBI’s non-IMA terms and brochure with the current MITC, reward-cap policy, domestic lounge page and issuance policy. Confirmed reward caps/exclusions/expiry, vouchers, insurance, international lounge quota and fuel waiver; cleared unsupported Visa Signature single-network metadata and fixed point value. Documented brochure-versus-terms redemption language and the current domestic lounge-list inclusion with unpublished quota. Archived comparison and PDFs: `docs/sources/sbi/doctors/issuer-extract-2026-10-27.md`. Current audits: 370 cards / 923 reward rules; 812 strict-scope, 804/812 strict-ready; validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,050/2,385 (86%), rewards 2,097/2,981 (70%), benefits 2,343/3,179 (74%), eligibility 799/878 (91%). Checklist 79/370; 291 remain; oldest cohort 44, next SBI Card ELITE Advantage. Traceability coverage is not factual accuracy.

## Previous record-level review: Doctor’s SBI Card (IMA) (27 Oct 2026)

Compared the IMA-specific terms and brochure with current MITC, cardholder agreement/reward cap policy, eligibility policy and launch archive. Confirmed fees/waiver, separate Medical/Travel and International monthly reward caps, exclusions, vouchers, insurance, Priority Pass and surcharge waiver. Removed unsupported aggregator income threshold, repaired garbled age text, and documented network and redemption conflicts. Field comparison: `docs/sources/sbi/doctors-ima/issuer-extract-2026-10-27.md`.

## Previous record-level review: SBI Cashback Credit Card (27 Oct 2026)

Compared SBI Card's current product page/FAQ, cardholder terms, 25-Feb-2026 reward revision, current MITC, application flow and issuer launch records. Corrected the launch date to 1-Sep-2022, retained Visa as supported network and cleared the unsupported Visa Platinum tier. Confirmed the current INR999 joining/annual fees, INR2-lakh renewal waiver, 5% online and 1% offline cashback caps, Apr-2026 exclusions, per-transaction rounding, posting/settlement timing and fuel surcharge waiver. Replaced unsupported card-specific income note and recorded that the current FAQ/revision notice supersedes the older cap printed in the booklet. Field comparison and archived sources: `docs/sources/sbi/cashback/issuer-extract-2026-10-27.md`. Current audits: validator zero errors/warnings; stamp mismatches zero; 802/810 strict-ready. Numeric evidence paths: fees 2,046/2,385 (86%), rewards 2,077/2,983 (70%), benefits 2,323/3,179 (73%), eligibility 799/878 (91%). Checklist 77/370; 293 cards remain. Oldest cohort 46; next Doctor's SBI Card (IMA). Numeric evidence-path coverage is traceability, not an accuracy score.

## Latest record-level review: BPCL SBI Card (27 Oct 2026)

Compared SBI Card's current BPCL product page, card booklet, current MITC, the 1-May-2026 fee revision and BPCL's official launch record. Corrected launch date to 20-Dec-2017; cleared unsupported single Visa/Platinum network metadata; updated the annual-fee waiver to INR1 lakh from 1-May-2026; confirmed welcome points, fuel/category rates and caps, MCCs and surcharge waiver; removed unsupported statement-credit redemption and realized value. Documented ambiguous network branding and legacy booklet limits. Field comparison and archived sources: `docs/sources/sbi/bpcl-sbi-card/issuer-extract-2026-10-27.md`. Current audits: validator zero errors/warnings; stamp mismatches zero; 802/810 strict-ready. Numeric evidence paths: fees 2,046/2,385 (86%), rewards 2,077/2,983 (70%), benefits 2,323/3,179 (73%), eligibility 799/878 (91%). Checklist 76/370; 294 cards remain. Oldest cohort 47; next SBI Cashback Credit Card. Numeric evidence-path coverage is traceability, not an accuracy score.

## Latest record-level review: BPCL SBI Card OCTANE (27 Oct 2026)

Compared SBI Card's current OCTANE page, current card booklet, MITC, cardholder agreement and launch disclosure. Corrected the 15-Dec-2020 launch date and Visa/Mastercard network options; updated the current annual-fee welcome trigger, BPCL/Bharat Gas and other reward caps, redemption, INR3-lakh voucher, lounge access, BPCL fuel waiver and fraud-liability cover. Recorded the launch/current welcome-trigger difference, unknown historical effective dates and insurer claim conditions. Field comparison and archived sources: `docs/sources/sbi/bpcl-octane/issuer-extract-2026-10-27.md`. Current audits: validator zero errors/warnings; stamp mismatches zero; 802/810 strict-ready. Numeric evidence paths: fees 2,040/2,385 (86%), rewards 2,065/2,984 (69%), benefits 2,318/3,179 (73%), eligibility 799/878 (91%). Checklist 75/370; 295 cards remain. Oldest cohort 48, next BPCL SBI Card. Numeric evidence-path coverage is traceability, not an accuracy score.

## Latest record-level review: Apollo SBI Card SELECT (27 Oct 2026)

Compared the current product page, card FAQ and T&C booklet, dedicated health-check/FITPASS terms, launch filing and current MITC. Corrected launch date and network options; replaced inaccurate statement-credit/SBI-catalog redemptions with Apollo-only Health Credits; verified reward rates, caps, MCC eligibility/exclusions, points expiry, annual anniversary health-check offer/value, and card-specific fuel-waiver transaction band/cap. Field comparison and archived primary PDFs: `docs/sources/sbi/apollo-select/issuer-extract-2026-10-27.md` and adjacent source files. Current audits: validator zero errors/warnings; stamp mismatches zero; 801/809 strict-ready rules; numeric evidence paths fees 2,031/2,385, rewards 2,039/2,986, benefits 2,283/3,161, eligibility 799/878. Checklist 72/370. Oldest cohort 51, next Apollo SBI Card. Numeric evidence paths measure traceability, not factual accuracy.

## Latest record-level review: Apollo SBI Card (27 Oct 2026)

Compared SBI's current product page, digital membership-kit listing and linked Apollo e-kit with the current MITC and launch archive. Corrected unsupported Visa/Platinum network and 1-Sep-2018 date; recorded Mastercard/RuPay variants and 27-Sep-2018 launch. Replaced unsupported 0.25 INR catalogue/statement-credit redemption with Apollo-only OneApollo vouchers/services at INR1 per point, added exclusions including government MCCs, documented Silver/Gold membership wording conflict, and cleared the unsupported base-card fuel-waiver claim. Field comparison and sources: `docs/sources/sbi/apollo/issuer-extract-2026-10-27.md`. Current audits: validator zero errors/warnings; stamp mismatches zero; 801/809 strict-ready; numeric evidence paths fees 2,036/2,385, rewards 2,050/2,985, benefits 2,284/3,159, eligibility 799/878. Checklist 73/370. Oldest cohort 50, next Aurum SBI Card. Numeric evidence-path coverage measures traceability, not factual accuracy.

## Latest record-level review: AURUM SBI Card (27 Oct 2026)

Compared the current AURUM product and benefits pages with the reward portal terms, MITC, government exclusion list and launch disclosure. Corrected launch date and dual network; verified the INR0.25 portal reward value, reward exclusions, current welcome and milestone voucher conditions, lounge access, fuel waiver, membership perks and issuer-advertised coverage limits. Removed the unsupported statement-credit redemption/realized point value and income threshold; documented the unknown fee effective date and unpublished detailed insurance claim conditions. Comparison and archived sources: `docs/sources/sbi/aurum/issuer-extract-2026-10-27.md`. Current audits: validator zero errors/warnings; stamp mismatches zero; 801/809 strict-ready; numeric evidence paths fees 2,036/2,385, rewards 2,050/2,981, benefits 2,308/3,178, eligibility 799/878. Checklist 74/370. Oldest cohort 49, next BPCL SBI Card OCTANE. Evidence-path coverage measures traceability, not factual accuracy.


- **Federal Bank RuPay Signet:** filled all four Jan-2026 dynamic APR bands; set launch date to 27 Sep 2021; changed residency to resident or NRI; cleared unsupported network tier; clarified lounge access and add-on spend conditions. Validator reports zero errors/warnings; source-stamp mismatches remain zero. Fees numeric evidence-path coverage moved from 2,014/2,387 to 2,018/2,391 (84%); this remains a traceability measure only. Details: `docs/sources/federal/rupay-signet/issuer-extract-2026-10-27.md`.


- **Federal Bank Signet (Visa):** filled all four dynamic APR bands; set launch date to 3 Sep 2021; confirmed the issuer?s Visa Platinum designation; set residency to resident or NRI; and clarified lounge add-on conditions. Kept the INR 200 base welcome offer separate from a temporary INR 250 Visa campaign. Validator: zero errors/warnings; stamp mismatches: zero. Fee numeric evidence-path coverage moved from 2,018/2,391 to 2,022/2,395 (84%). Details: `docs/sources/federal/signet/issuer-extract-2026-10-27.md`.


- **Federal Bank RuPay Wave:** set launch date to 19 Jun 2024, populated all four Jan-2026 APR tiers, cleared unsupported network tier, and set eligibility to resident or NRI. Followed the card-specific Sep-2026 single-transaction cashback T&C and first-quarter milestone rule. Official KFS/MITC fee conflicts remain recorded (cash advance and physical/annual fees). Validator passed with zero errors/warnings; stamp mismatches remain zero. Fee numeric evidence-path coverage moved from 2,022/2,395 to 2,026/2,399 (84%). Details: `docs/sources/federal/wave/issuer-extract-2026-10-27.md`.

## Numeric-field evidence-path coverage

`python scripts/audit_numeric_evidence.py` measures whether numeric fields in active/invite-only records are listed in their record's `source.fields_verified` paths. It does not prove that the linked source supports each value.

| Area | Covered numeric fields | Total numeric fields | Coverage |
| --- | ---: | ---: | ---: |
| Fees | 2,026 | 2,385 | 85% |
| Rewards | 2,028 | 2,987 | 68% |
| Benefits | 2,271 | 3,157 | 72% |
| Eligibility | 799 | 878 | 91% |

Reward and benefit fields have the largest explicit evidence-path gaps. Coverage is a traceability measure, not a factual-accuracy score.

## Freshness and delivery

Fees, reward offers, lounges and eligibility can change between reviews. Source URL reachability, field-by-field support and currentness have not been exhaustively audited across the library. Hourly report delivery is not configured from this local workspace; this file is updated on demand.

## Latest record-level review: Air India SBI Signature Card (27 Oct 2026)

Compared SBI's issuance notice, combined card terms, separate Air India earn addendum, milestone revision, MITC, add-on and Priority Pass FAQs, lounge notice, Air India's current co-brand page, and the dated launch release. Marked issuance discontinued from 10-Oct-2024 and removed the apply URL; corrected ordinary earn to 4 Reward Points/INR100 and Air India earn to 10/INR100 with staged posting conditions; removed unsupported INR point values; confirmed 1:1 Maharaja conversion, annual milestone awards, 8 domestic lounges/year and paid Priority Pass visits; added INR100,000 lost-card cover and documented source disagreement on the reporting window. Cleared unsupported fuel-waiver numeric claims. Full comparison: `docs/sources/sbi/air-india-signature/issuer-extract-2026-10-27.md`.

Post-review: 370 cards / 920 reward rules; 809 strict-scope rules, 801/809 strict-ready; validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,026/2,385 (85%), rewards 2,028/2,987 (68%), benefits 2,271/3,157 (72%), eligibility 799/878 (91%). These are traceability counts, not a factual-accuracy score. Queue: 52 cards dated 2026-10-25; next Apollo SBI Card SELECT.

## Previous record-level review: Air India SBI Platinum Credit Card (27 Oct 2026)

Compared SBI's issuance discontinuation notice, current card-specific Air India reward addendum, legacy Air India card terms, current MITC, lounge quota revision and original launch release. Marked new issuance discontinued from 10-Oct-2024 while retaining legacy terms for existing accounts; verified the 16-Sep-2013 launch date; corrected Air India earn to 5 points/INR100 with delayed-credit and member/name matching rules; removed unsupported fixed INR point values; added supported exclusions; updated domestic lounge quota to 4/calendar year, max one per quarter, from 10-Jan-2026; and added the 2,000-point anniversary gift. Preserved the original 5,000/INR2-lakh and 10,000/INR3-lakh milestone thresholds while noting SBI's current page gives an ambiguous 15,000/INR3-lakh figure. Fuel-waiver range/cap remains a lower-confidence legacy claim, and card-specific income/score cutoffs are unpublished. Full comparison: `docs/sources/sbi/air-india-platinum/issuer-extract-2026-10-27.md`.

Post-review: 370 cards / 920 reward rules; 811 strict-scope rules, 803/811 strict-ready; validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,029/2,393 (85%), rewards 2,028/2,996 (68%), benefits 2,271/3,176 (72%), eligibility 805/884 (91%). These are traceability counts, not a factual-accuracy score. Queue: 53 cards dated 2026-10-25; next Air India SBI Signature.

## Previous record-level review: Tata Neu Infinity HDFC Bank Credit Card (Visa) (27 Oct 2026)

Compared HDFC's current product/fee/eligibility pages with current and 2024 card terms, card FAQ, Personal MITC v4.15, NeuPass terms, lounge and insurance materials, and the dated launch release. Corrected the historical app-only/online-only 5% partner earn, separated that earn from the NeuPass bonus, recorded merchant spend ceilings and staged partner additions, and added the structured current 5% rule for both network variants. Confirmed Indian-resident eligibility; removed unsupported Visa tier and duplicated RuPay artwork. Documented markup, historic fuel-cap, and insurance-policy conflicts and Visa Priority Pass conditions. Field comparison: `docs/sources/hdfc/tata-neu-infinity/issuer-extract-visa-2026-10-27.md`.

Post-review audit: 370 cards / 918 reward rules; 812 strict-scope rules, 804/812 strict-ready; validator zero errors/warnings; source-stamp mismatches zero. Numeric evidence-path coverage: fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,238/3,184 (70%), eligibility 811/890 (91%). Oldest cohort 66; next IDFC FIRST Ashva. These are structural and traceability checks, not a factual accuracy percentage. Dataset-wide factual review remains active.

## Latest record-level review: HDFC Diners Club Rewardz (27 Oct 2026)

Compared HDFC's current card and fee pages with the linked May-2026 change notice and archived card-specific tariff. Confirmed 3 Reward Points per INR 200, 15,000-point statement-cycle cap, INR 1,000 fee and INR 1 lakh annual waiver, SmartBuy/cashback/catalogue/AirMiles values, up-to-70% flight/hotel redemption, lounge and concierge claims, and the card's closed-to-new-applications status. Updated the live forex figure to 3% while documenting the older tariff's 3.5% conflict; recorded May-2026 DCC/reissue charges in notes because the schema has no dedicated fields. Cleared unsupported exact launch date and resident-only assertion. Field comparison: `docs/sources/hdfc/diners-rewardz/issuer-extract-2026-10-27.md`.

Post-review queue: 80 records dated 2026-10-25; next HDFC Bank Freedom. Validator passed with zero errors/warnings and the stamp audit found zero mismatches. Numeric evidence coverage is fees 2,026/2,399 (84%), rewards 2,019/2,994 (67%), benefits 2,230/3,169 (70%), eligibility 790/868 (91%). Coverage remains traceability, not a factual-accuracy score.

## Latest record-level review: HDFC Bank Freedom (27 Oct 2026)

Compared current Freedom product, fee and eligibility pages with the Freedom T&Cs dated 15-May-2026, current MITC v4.15 and HDFC's May-2026 changes notice. Corrected partner earning from the stale 10 CashPoints/INR 150 basis to 10/INR 200; added cashback minimum/fee and AirMiles conversion; recorded the current Swiggy Dineout offer while retaining its conflicting validity text. Cleared unsupported exact launch date, generic Visa/Classic claim and resident-only assertion. Preserved conflicting issuer thresholds (net vs gross monthly salary; self-employed ITR > INR 6 lakh vs > INR 2 lakh) and lower introductory rate applicability. Full field comparison: `docs/sources/hdfc/freedom/issuer-extract-2026-10-27.md`.

Post-review queue: 79 records dated 2026-10-25; next IndianOil HDFC Bank Credit Card. Validator: zero errors/warnings; stamp audit: zero mismatches. Numeric evidence coverage is fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,230/3,169 (70%), eligibility 790/868 (91%). Coverage is a traceability aid, not a factual-accuracy score.

## Latest record-level review: IndianOil HDFC Bank Credit Card (27 Oct 2026)

Compared current product, fee and eligibility pages with current card-specific terms, personal MITC v4.15, May-2026 fee notice and HDFC/IndianOil's 25-Sep-2019 launch release. Corrected the launch date and removed the unsupported single RuPay/Platinum claim because the launch release confirms Visa and RuPay variants. Confirmed Fuel Point accrual, caps, fuel surcharge waiver, activation voucher, redemption values/fees and IXRP terms. Recorded conflicts for monthly interest (3.49% card FAQ vs 3.75% personal MITC), lost/damaged reissue fee (INR 100 card FAQ vs INR 199 May notice), and age/income thresholds across card and eligibility pages. The conservative grocery MCC model remains because the issuer's included MCCs conflict with explicit supermarket/liquor/bakery exclusions. Full comparison: `docs/sources/hdfc/indianoil/issuer-extract-2026-10-27.md`.

Post-review queue: 78 records dated 2026-10-25; next IRCTC HDFC Bank Credit Card. Validator: zero errors/warnings; stamp audit: zero mismatches. Numeric evidence coverage is fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,230/3,169 (70%), eligibility 791/869 (91%). Coverage is a traceability aid, not an accuracy score.

## Latest record-level reviews (27 Oct 2026)

- **IndiGo Axis Bank:** reconciled current base-card T&Cs, campaign, lounge terms and launch release; cleared a single network claim, removed a fixed rent MCC, added telecom exclusion and shared UPI cap, and corrected BluChip vouchers from rupee values to points with variable/no fixed INR redemption value. Details: `docs/sources/axis/indigo/issuer-extract-2026-10-27.md`.

- **Axis Bank Horizon:** reconciled current Horizon terms and revision notice; cleared unsupported single-network/tier and lounge-operator claims, recorded Visa/Mastercard lounge quota difference, removed a fixed 1:1 partner transfer ratio and fixed rent MCC exclusion, added telecom exclusion, and downgraded illustrative mile value from guaranteed floor. Details and schema limits: `docs/sources/axis/horizon/issuer-extract-2026-10-27.md`. Validator passed with zero errors/warnings; stamp mismatches remain zero.

- **Axis Bank Atlas:** corrected lounge guest-count certainty and fuel waiver cycle; added supported telecom exclusion to the schema and record. Confirmed rates, fees, milestone/tier and lounge terms, eligibility, transfer caps and value. Current issuer lounge app is suspended but card swipe remains available. Details and model limitations are documented in `docs/sources/axis/atlas/issuer-extract-2026-10-27.md`.

- **Airtel Axis Bank:** reconciled current 2026 cashback and partner-wallet value back, corrected launch date, removed unsupported network claims, confirmed lounge discontinuation and current fee/eligibility terms. Axis page announces Aug 2026 term changes with an inaccessible linked PDF; unresolved details are documented in `docs/sources/axis/airtel/issuer-extract-2026-10-27.md`.

- **Axis Bank ACE:** corrected launch date, removed unsupported tier/operator/residency claims, corrected dining program label, and confirmed current fees, cashback, lounge and fuel details. Current criteria/schema limits are documented in `docs/sources/axis/ace/issuer-extract-2026-10-27.md`.

- **Flipkart Axis Bank Super Elite:** cleared unsupported network/tier claims; reconciled the strict greater-than-INR-200,000 annual-fee waiver, card-specific SuperCoins rates/caps/exclusions, current promotional benefits, fuel waiver and eligibility. Flipkart membership tier is not an input to the calculator, and SuperCoins have no established fixed INR value. Field comparison: `docs/sources/axis/flipkart-super-elite/issuer-extract-2026-10-27.md`.

- **Flipkart Axis Bank Credit Card:** corrected the contradictory exclusion of other eligible spend, fee-waiver timing/threshold, current eligibility and source paths; reconciled cashback caps/statement quarters, MID conditions, offers, fuel waiver and preferred partners after visual PDF review. Historic Mastercard launch is documented; current network/tier remain unknown. Field comparison: `docs/sources/axis/flipkart/issuer-extract-2026-10-27.md`.

- **Axis Bank FreeCharge Plus:** cleared unsupported RuPay/Platinum claims; removed the contradictory `other` exclusion; confirmed invite-only access, current fee/waiver, cashback rates and app/MID rules, exclusions, minimum transaction, rounding/posting and current offers. Archived current cashback PDF and field comparison under `docs/sources/axis/freecharge-plus/`.

- **Axis Bank FreeCharge:** confirmed Visa Platinum, invite-only access, regular point rate and monthly milestones; cleared unsupported demographic and third-party eligibility claims; documented the unpublished annual-fee waiver threshold, variable point value and current category exclusions. Field comparison: `docs/sources/axis/freecharge/issuer-extract-2026-10-27.md`.

- **AU Bank Altura:** confirmed fees/waiver, cashback and milestone, fuel waiver, railway lounges, fees/eligibility; removed unsupported network, tier and launch date; set unpublished cashback cap status rather than claiming unlimited. Added issuer-advertised device protection, card liability, contactless, Xpress EMI, and free add-on features with limits/coverage unknown as appropriate. Details: `docs/sources/au/altura/issuer-extract-2026-10-27.md`.
- **AU Bank Altura Plus:** compared current product page, KFS v1.9, MITC v2.22, member agreement (16 May 2026), and rewards FAQ. Corrected total online earn modeling and point expiry; removed unsupported launch date and single RuPay/Platinum network claims; confirmed current fee, rewards cap, lounge, milestone, fuel-cap, and eligibility details. Offline cashback cap and insurance coverage remain unquantified. Full field comparison: `docs/sources/au/altura-plus/issuer-extract-2026-10-27.md`.
- **AU Bank LIT:** compared live product/features pages, current card terms, Schedule of Charges/KFS, AU Rewardz FAQ and product guide. Cleared unsupported network/tier/launch date and wallet-load exclusion; reconciled paid feature rewards, category and milestone cashback, lounge/fuel options, total point cap, fees and eligibility. Exact 90-day modeling and feature pricing remain schema/calculator limitations. Full comparison: `docs/sources/au/lit/issuer-extract-2026-10-27.md`.
- **AU Bank Zenith+:** compared live product page, KFS v1.9 (30 Sep 2026), card member agreement dated 24 Mar 2026, reward FAQ and lounge terms. Corrected zero cash-advance fee and cleared unsupported variant, launch and exclusion claims. Current issuer reward documents conflict on special-category caps; base rate and milestone threshold remain unresolved. Full comparison: `docs/sources/au/zenith-plus/issuer-extract-2026-10-27.md`.

- HDFC BizBlack: corrected joining/renewal fee waiver, fuel surcharge waiver (not applicable), optional paid insurance, calendar-year milestone wording, All Accor+ welcome offer effective 15 Sep 2026, and current eligibility. The current issuer page says business ITR above Ã¢â€šÂ¹45 lakh plus a liability relationship while an older FAQ says Ã¢â€šÂ¹30 lakh; discrepancy is documented. Extract: `docs/sources/hdfc/biz-black/issuer-extract-2026-10-27.md`.
- Tata Neu Plus RuPay: refreshed fees, UPI split and cap, separate NeuPass 5% reward, post-Jun-2025 quarterly lounge voucher, current welcome benefit, and published eligibility.
- YES Bank Kiwi: corrected 2026 forex/fuel terms, virtual-card cash advance fee, Kiwis earn/redemption caps and optional Neon/Boost memberships. YES BANK Klick Rewardz versus Kiwi rewards coexistence remains unresolved. Extract: `docs/sources/yes/kiwi/issuer-extract-2026-10-27.md`.

Latest validation: 370 cards; 916 reward rules, 809 strict-scope, 801/809 strict-ready; validator zero errors/warnings; stamp audit zero mismatches. The exhaustive factual-accuracy percentage is still unknown.

## Latest record-level review: Axis Bank Privilege (27 Oct 2026)

Compared the current product page, current KFS/MITC, card-specific 2025 and 2026 revisions, activation and milestone terms, current general lounge program, linked legacy Mastercard lounge program, insurance terms and Amex-network offer terms. Removed unsupported Visa and Signature network-tier claims; retained standard fees with Priority and Amex limited-period exceptions documented. Updated current reward exclusions including telecom, milestone exclusions, lounge quota/spend gate and the future-effective District BOGO spend gate. Network-specific lounge terms remain variant-dependent; the linked Mastercard lounge PDF expired, while the current general Axis program lists Privilege under eligible standard network platforms. Field comparison: `docs/sources/axis/privilege/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,004/2,379 (84%), rewards 2,004/2,986 (67%), benefits 2,194/3,147 (70%), eligibility 786/867 (91%). Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 93 records last verified 2026-10-25; next is Axis Bank Reserve.

## Latest record-level review: Axis Bank Privilege Easy (27 Oct 2026)

Compared the current secured-card page, KFS/Schedule of Charges, MITC, Privilege Easy revision notice, linked milestone terms, insurance terms and general lounge program. Removed the unsupported Mastercard assertion and set minimum age to 18 from the explicit minor exclusion. Kept the product-page lounge quota without importing a threshold/provider because the current lounge list link is broken and the general roster omits Privilege Easy. Retained Easy-page welcome/milestone amounts but cleared milestone exclusions from a linked PDF that applies only to the unsecured Privilege card. Field comparison: `docs/sources/axis/privilege-easy/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,004/2,379 (84%), rewards 2,004/2,986 (67%), benefits 2,192/3,146 (70%), eligibility 786/867 (91%). Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 94 records last verified 2026-10-25; next is Axis Bank Privilege.

## Latest record-level review: Axis Bank Pride Signature (27 Oct 2026)

Compared the current Pride Signature page, KFS/Schedule of Charges, MITC, card-specific EDGE exclusions, domestic lounge program and 28-Aug-2026 revision notice. Removed the unsupported Visa network claim and marked the schema-constrained local `mid` tier as unverified. Confirmed the â‚¹40,000 annual-fee waiver, 8 EDGE points/â‚¹200, lounge quota/spend gate, dining discount, fuel waiver and published eligibility; added current generic gift-card and bridge/road/toll reward exclusions. Field comparison: `docs/sources/axis/pride-signature/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,004/2,379 (84%), rewards 2,004/2,986 (67%), benefits 2,192/3,146 (70%), eligibility 785/866 (91%). Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 95 records last verified 2026-10-25; next is Axis Bank Privilege Easy.

## Latest record-level review: Axis Bank Pride Platinum (27 Oct 2026)

Compared the current Pride Platinum page, KFS/Schedule of Charges, MITC, card-specific EDGE reward exclusions and the 28-Aug-2026 revision notice. Confirmed the reward rate, current reward exclusions, fuel waiver, current fees, advertised benefits and published eligibility. Cleared the structured annual-fee-waiver threshold because issuer page sections and the KFS/MITC conflict (â‚¹40,000 vs â‚¹20,000); the conflict and exclusions are documented in the record notes. Field comparison: `docs/sources/axis/pride-platinum/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,004/2,379 (84%), rewards 2,004/2,986 (67%), benefits 2,191/3,146 (70%), eligibility 785/866 (91%). Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 96 records last verified 2026-10-25; next is Axis Bank Pride Signature.
- Amex Membership Rewards: removed unsupported launch date; added first-renewal 5,000-point benefit; corrected exclusions and redemption catalogue range; documented the 15-Nov-2026 end of the 50% fee-waiver tier, application pause, and future milestone posting basis. Details: `docs/sources/amex/mrcc/issuer-extract-2026-10-27.md`.

- Amex Centurion: removed unsubstantiated launch date; refreshed fees, reward program/caps, lounge guest rules, and current temporary Amex service changes. Card-wide base earn remains unresolved because general Amex material and Centurion promotional examples differ. Details: `docs/sources/amex/centurion/issuer-extract-2026-10-27.md`.

- Amex Platinum Reserve: added the verified INR 10 lakh renewal waiver to the fee record; removed unsupported launch date, wallet-load exclusion and blanket EMI exclusion; noted that SafeKey and post-purchase EMI earn. Current milestone posting change, application pause and unpublished effective-date limitation are documented in `docs/sources/amex/platinum-reserve/issuer-extract-2026-10-27.md`.

- Amex Platinum Travel: removed unsupported launch date, wallet-load and blanket EMI exclusions; confirmed current EMI handling, point expiry, welcome and spend milestones, and staged lounge gate; documented chargeable Priority Pass usage and November posting-date change. Details: `docs/sources/amex/platinum-travel/issuer-extract-2026-10-27.md`.

## Latest record-level review: PNB EaseMyTrip (27 Oct 2026)

Compared PNB's current EMT-specific product page, current Schedule of Fees, MITC, generic Rewardz terms and EaseMyTrip launch release. Corrected the launch date, cash advance fee, fuel refund cap/cycle and eligibility threshold; added current EaseMyTrip booking discounts; removed unsupported reward exclusions and unsupported voucher allocation. Recorded source conflicts: EMT point value Ã¢â€šÂ¹0.25 versus generic Rewardz Ã¢â€šÂ¹0.50, and fuel minimum Ã¢â€šÂ¹400 in the schedule versus Ã¢â€šÂ¹500 on the generic Platinum fuel page. ATM cash fee minimums differ by channel. Details: `docs/sources/pnb/easemytrip/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings, stamp audit zero mismatches. Numeric evidence paths: fees 1,957/2,379 (82%), rewards 1,943/2,988 (65%), benefits 2,140/3,161 (68%), eligibility 768/847 (91%). These measure traceability, not factual accuracy. The dataset-wide validation goal remains active.

## Latest record-level review: PNB RuPay Millennial (27 Oct 2026)

Compared PNB's current Millennial card page, How to Apply guide, Schedule of Fees, MITC and generic Rewardz terms. Corrected cash advance fee, removed unsupported launch date, adjusted fuel cap, recorded age/income criteria and captured current health/fitness benefits. Preserved conflicts between the product page and MITC on annual waiver cycle, card-specific and generic points valuation, and card page/Rewardz on the 300-point transaction condition. Details: `docs/sources/pnb/rupay-millennial/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings, stamp audit zero mismatches. Numeric evidence paths: fees 1,964/2,379 (83%), rewards 1,948/2,988 (65%), benefits 2,149/3,161 (68%), eligibility 770/849 (91%). These measure traceability, not factual accuracy. Three oldest-cohort records remain.

## Latest record-level review: RBL Platinum Plus SuperCard (27 Oct 2026)

Compared RBL's current Platinum Plus product page, current MITC/KFS, SuperCard guide, SuperCard Additional Terms and current Rewardz terms. Removed lounge access because RBL states it was discontinued from 1 July 2025. Corrected the online reward cap, updated welcome terms and captured current BookMyShow/fuel benefits; removed unsupported fixed point value and the unsubstantiated launch date. The page itself contains both outdated lounge claims and a clear discontinuation notice, which is documented. Details: `docs/sources/rbl/bfl-platinum-plus/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings, stamp audit zero mismatches. Numeric evidence paths: fees 1,970/2,379 (83%), rewards 1,952/2,986 (65%), benefits 2,159/3,158 (68%), eligibility 770/849 (91%). Two oldest-cohort records remain.

## Latest record-level review: RBL IndianOil XTRA (27 Oct 2026)

Compared RBL's current XTRA card page, product terms, combined IndianOil FAQ, MITC/KFS and Rewardz terms. Confirmed fuel-point rates, monthly accelerator cap and Ã¢â€šÂ¹0.50 IndianOil redemption value; updated welcome/quarterly milestone and fuel-surcharge details; recorded general age eligibility and the RuPay small-merchant UPI exception. Removed unsupported launch date and corrected redemption from general statement credit to IndianOil fuel redemption. Details: `docs/sources/rbl/iocl-xtra/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings, stamp audit zero mismatches. Numeric evidence paths: fees 1,977/2,379 (83%), rewards 1,958/2,986 (66%), benefits 2,167/3,158 (69%), eligibility 772/851 (91%). One record remains in this oldest cohort.

## Latest record-level review: PNB Patanjali RuPay Select (27 Oct 2026)

Compared PNB's current product page, current Schedule of Fees, generic fuel waiver and Rewardz pages, and NPCI launch release. Corrected launch date, cash advance fee, eligibility threshold and fuel refund cap/cycle; removed an incorrectly encoded Ã¢â€šÂ¹250 monthly cashback cap and unsupported reward exclusions; added current Patanjali cashback and lifestyle benefits. Documented conflicts in point value (Ã¢â€šÂ¹0.25 product-specific vs Ã¢â€šÂ¹0.50 generic) and fuel lower transaction bound (Ã¢â€šÂ¹400 schedule vs Ã¢â€šÂ¹500 generic Select page). Review details: `docs/sources/pnb/patanjali-rupay-select/issuer-extract-2026-10-27.md`.

## Latest record-level review: IDBI Euphoria World (27 Oct 2026)

Compared current IDBI issuer-indexed product, FAQ, MITC and KFS extracts. Corrected fees, finance and cash advance rates, current reward earn and redemption (FAQ says 0.25 paisa per point), welcome and spend milestones, 12 annual domestic lounge visits, fuel waiver and liability insurance terms. Removed unsupported historical launch date, old 4,000-point welcome offer, fabricated/unverified reward exclusions, MCC and point valuation. Source documents were not directly retrievable (502/timeout), and the exact fee-waiver boundary and point conversion need confirmation. Review details: `docs/sources/idbi/euphoria-world/issuer-extract-2026-10-27.md`.

Post-review traceability: numeric evidence paths fees 1,944/2,379 (82%), rewards 1,933/2,967 (65%), benefits 2,122/3,156 (67%), eligibility 764/842 (91%). No database-wide factual accuracy percentage is available.

## Previous record-level review: IDBI Royale Signature (27 Oct 2026)

Compared current IDBI issuer-indexed product page and FAQ. Corrected annual fee (current page says nil joining, annual and renewal fees), finance interest (2.5% monthly), cash advance minimum, points conversion, welcome/milestone rewards, lounge access and insurance. Removed unsupported annual fee and historical launch date. Exact spend exclusions remain unresolved; direct page retrieval returned HTTP 502. See `docs/sources/idbi/royale-signature/issuer-extract-2026-10-27.md`.

## Previous record-level review: Indian Bank Bharat (27 Oct 2026)

Compared current Indian Bank MITC and issuer product feature sheet. Corrected annual fee to nil, purchase interest to 1.79% monthly, cash advance interest/fee to 1.99% monthly/Ã¢â€šÂ¹25, and foreign markup to not applicable. Removed fictitious Reward Points and fuel waiver; issuer feature sheet explicitly states no reward-points program. Launch date, age/income criteria and Bharat-specific insurance remain unknown. See `docs/sources/indian-bank/bharat/issuer-extract-2026-10-27.md`.

## Previous record-level review: Indian Bank RuPay Platinum (27 Oct 2026)

Compared the current issuer MITC, credit card feature sheet and RuPay insurance program validity. Corrected earn rate to 1 point/Ã¢â€šÂ¹100, AMC waiver details, purchase interest and cash advance charge. Removed unsubstantiated fuel waiver and Ã¢â€šÂ¹2 lakh insurance claim. Current credit card lounge quota and insurance cover remain unknown; a separate debit-card lounge discontinuation was not applied to the credit card. See `docs/sources/indian-bank/rupay-platinum/issuer-extract-2026-10-27.md`.

## Previous record-level review: Indian Bank RuPay Select (27 Oct 2026)

Compared current issuer MITC, credit card feature sheet and insurance validity. Corrected fees, purchase interest and cash advance charge; retained the issuer feature-sheet rate of 1 point/Ã¢â€šÂ¹100. Removed unsupported fuel waiver and personal accident amount. Current credit card lounge quota and insurance cover remain unknown. See `docs/sources/indian-bank/rupay-select/issuer-extract-2026-10-27.md`.

## Previous record-level review: IndusInd EazyDiner Signature (27 Oct 2026)

Compared current 13-Oct-2026 MITC, July-2025 card-specific change notice, rewards terms and program cap. Corrected fee provenance, reward rate/value/cap/expiry/redemption, PayEazy monthly dining gates and fuel terms. Removed discontinued BookMyShow and domestic lounge access claims. The current indexed product page still lists fee-paid Prime, bonus points, Postcard Hotel voucher and 1% fuel surcharge waiver; exact fuel limits and voucher details remain unresolved. See `docs/sources/indusind/eazydiner-signature/issuer-extract-2026-10-27.md`.

## Latest record-level review: IndusInd Platinum Aura Edge (27 Oct 2026)

Compared the 13-Oct-2026 MITC, 14-Jan-2026 benefit guide, current product page and rewards update. Replaced the unsupported single reward model with four mutually exclusive plans and corrected fees, points value/cash redemption cap, fuel waiver and travel/fraud cover. Exact fuel monthly cap, launch date, specific eligibility thresholds and Travel Plus insurer remain unresolved. Separate 2% DCC fee is captured in source notes. See `docs/sources/indusind/platinum-aura-edge/issuer-extract-2026-10-27.md`.

Post-review snapshot: validator reports 370 cards and 911 reward rules, 804 strict-scope, 796/804 strict-ready (99%), zero errors/warnings. Stamp mismatches zero. Numeric evidence paths: fees 1,944/2,379 (82%), rewards 1,933/2,989 (65%), benefits 2,122/3,160 (67%), eligibility 764/842 (91%). These coverage figures do not establish factual accuracy.

## Latest record-level review: J&K Bank Eminent (27 Oct 2026)

Compared J&K Bank's current card-suite page and terms/charges page. Updated 2026 fee, reward and benefit terms, including 1 point/Ã¢â€šÂ¹100 base and 3 points/Ã¢â€šÂ¹100 on online travel, apparel, dining and electronics; removed unsupported point INR value and redemption claims. Updated lounge access, vouchers, food delivery, movies and fuel waiver with ambiguities recorded. Product-specific eligibility and launch date remain unknown. Evidence: `docs/sources/jk-bank/eminent/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 911 reward rules, 804 strict-scope, 796/804 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 1,944/2,379 (82%), rewards 1,933/2,984 (65%), benefits 2,122/3,161 (67%), eligibility 764/842 (91%). These are traceability measures, not factual accuracy.

## Latest record-level review: J&K Bank RuPay Platinum (27 Oct 2026)

Compared J&K Bank's current card-suite page and current charges page. Corrected Platinum fees, waiver threshold, base and accelerated rewards, lounge count, welcome and milestone benefits, utility discount and fuel wording; removed point conversion rates and unsupported transaction ranges. Fuel cap interpretation, redemption value, network applicability for benefits and product-specific eligibility/launch date remain uncertain. See `docs/sources/jk-bank/rupay-platinum/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 912 reward rules, 805 strict-scope, 797/805 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 1,944/2,379 (82%), rewards 1,933/2,983 (65%), benefits 2,122/3,161 (67%), eligibility 764/842 (91%). These are traceability measures, not factual accuracy.

## Latest record-level review: Kotak 811 Super Money (27 Oct 2026)

Compared Kotak811 product page, card-specific cashback terms and 12-Mar-2026 KFS. Corrected conditional physical-card joining fee, FD-backed eligibility, finance/FX/cash-advance terms and current cashback routes/caps/redemption. Removed false general 1% base cashback, unsupported Myntra cap certainty and stale launch date; noted ambiguity in shared partner cap and current T&C omissions. Evidence: `docs/sources/kotak/811-super/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 914 reward rules, 807 strict-scope, 799/807 strict-ready (99%), validator zero errors/warnings after adding the official kotak811.bank.in domain to the Kotak issuer allowlist; stamp audit zero mismatches. Numeric evidence paths: fees 1,944/2,379 (82%), rewards 1,933/2,988 (65%), benefits 2,122/3,161 (67%), eligibility 764/843 (91%). These are traceability measures, not factual accuracy.

## Latest record-level review: KVB Platinum (legacy Dhanam record) (27 Oct 2026)

Compared KVB's current Platinum product page, current quick-glance charges, MITC and redemption page. Updated the name mapping, Ã¢â€šÂ¹599 annual fee/waiver, charges, base and accelerated earn, activation points, fuel waiver cap and redemption fee/minima. Removed unverified point value, old Ã¢â€šÂ¹100 fuel cap and unsupported exclusions. The issuer does not explicitly map legacy Ã¢â‚¬Å“DhanamÃ¢â‚¬Â to KVB Platinum; this residual identity uncertainty is documented. Evidence: `docs/sources/kvb/dhanam/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 1,944/2,379 (82%), rewards 1,933/2,991 (65%), benefits 2,122/3,161 (67%), eligibility 764/843 (91%). Coverage is traceability, not factual accuracy.

## Latest record-level review: DCB PayLess Select (27 Oct 2026)

Compared DCB?s September 2025 PayLess MITC, hosted FAQ and current secured-card page. Corrected fees and cash advance charges, reward model to INR1,000 cashback after INR100,000 quarterly spend, Select lounge access (two domestic/quarter plus one international/year), fuel waiver and FD eligibility. Removed false Reward Points/valuation, INR10 lakh personal accident amount and concierge. The FAQ states general DCB PayLess eligibility, including INR15,000 minimum DCB FD; it does not state a different minimum by variant, so prior INR25,000 claim was cleared. Exact launch date, insurance amount and minimum fuel transaction remain unknown. Shared source captures and comparison are under `docs/sources/dcb/payless-platinum/` and `docs/sources/dcb/payless-select/`.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,930/2,385 (81%), rewards 1,901/2,941 (65%), benefits 2,108/3,171 (66%), eligibility 758/832 (91%); stamp mismatches zero. These are traceability measures, not factual accuracy. Oldest active/invite-only cohort: 23 records last verified 2026-10-24; next is Equitas PowerMiles.

## Previous record-level review: DCB PayLess Platinum (27 Oct 2026)

Compared DCB?s 2025-09 PayLess MITC, 2024-12-hosted FAQ and current secured-card page; issuer sources are archived under `docs/sources/dcb/payless-platinum/`. Corrected fees (nil joining, INR350 annual, INR50,000 waiver, 3% monthly finance, ATM fee 2.5%/INR250 minimum and 3.5% forex), reward model (INR250 cashback after INR50,000 quarterly eligible spend), lounge (one domestic visit/quarter), fuel waiver (up to INR100/statement for eligible amounts to INR5,000) and published FD eligibility. Added MITC lost-card/fraud terms without inventing coverage amounts. Removed the false points model and unsupported point values/MCCs; exact launch date and minimum fuel transaction remain unknown.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,918/2,380 (81%), rewards 1,901/2,947 (65%), benefits 2,101/3,173 (66%), eligibility 756/830 (91%); stamp mismatches zero. Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 24 records last verified 2026-10-24; next is DCB PayLess Select.

## Previous record-level review: DBS SuperX (27 Oct 2026)

Compared DBS current consolidated MITC, Key Fact Document, April 2026 Schedule of Charges, DBS Delights terms and current card catalogue; archived issuer PDFs and the stale product-URL response under `docs/sources/dbs/superx/`. Confirmed zero joining fee, INR1,499 annual fee with no waiver, 3.5% forex, cash advance 2.5%/INR500 minimum and variable 3.5%-4% monthly finance charge. Cleared the old SuperCard-derived reward rate, INR0.25 point value, 5,000-point welcome, lounge, movie and fuel-waiver claims. DBS publishes SuperX platform eligibility but no product-specific earn or benefit rules in the sources reviewed; these remain unknown. SuperX remains active; current official migration notice concerns predecessor SuperCard and says 15-Dec-2026, conflicting with older notices. Evidence: `docs/sources/dbs/superx/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,906/2,375 (80%), rewards 1,901/2,953 (64%), benefits 2,095/3,169 (66%), eligibility 754/828 (91%); stamp mismatches zero. These measures do not establish factual accuracy. Oldest active/invite-only cohort: 25 records last verified 2026-10-24; next is DCB Payless Platinum.

## Previous record-level review: DBS BFL 5X (27 Oct 2026)

Compared current DBS 5X-specific terms, MITC, terms index and rewards FAQ. Marked discontinued effective 2026-08-01. Corrected current-published fees (including 2025 annual-waiver end), cash advance and forex charges, 5X milestone, separate Card+ app accelerator, welcome condition and fuel waiver. Removed unsupported launch date, Platinum tier, fixed point value, online accelerator, BookMyShow offer and lounge visit. Source pages conflict on discontinuation dates (current variant page/index: 2026-08-01; generic landing page: issuance ceased 2024-11-23; older MITC: 2025-12-01). Used the specific current notice; customer-specific historic charges and exact interest rate remain uncertain. Evidence: `docs/sources/dbs/bfl-5x/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 897 reward rules; 794 strict-scope, 786/794 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,901/2,377 (80%), rewards 1,901/2,962 (64%), benefits 2,095/3,180 (66%), eligibility 754/828 (91%); stamp mismatches zero. These are validation and traceability measures, not factual accuracy. Twenty-six oldest-cohort records remain; next is DBS SuperX.

## Previous record-level review: DBS BFL 10X (27 Oct 2026)

Compared DBS 10X Signature-specific terms, current discontinuation notice, rewards FAQ and lounge terms. Marked discontinued effective 2026-08-01; corrected fee, base and accelerated rewards, welcome condition, domestic lounge quota and fuel-waiver cap. Removed unsupported launch date, network/tier, fee waiver, old online accelerator/movie offer and fixed point value. Current sources do not establish exact legacy cardholder charges, APR, forex, cash-advance fee, launch date or point INR value. Evidence: `docs/sources/dbs/bfl-10x/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 rewards; 796 active/invite-only strict scope, 788/796 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,901/2,384 (80%), rewards 1,901/2,970 (64%), benefits 2,095/3,191 (66%), eligibility 754/828 (91%); stamp mismatches zero. These figures measure validation and traceability, not factual accuracy. The oldest active/invite-only cohort has 27 records last verified 2026-10-24; next is DBS BFL 5X.

## Previous record-level review: CBI RuPay Select (27 Oct 2026)

## Latest record-level review: CSB Jupiter Edge+ RuPay (27 Oct 2026)

Compared the current CSB MITC (updated 29 Aug 2026), KFS, card terms and Jupiter's product page. Corrected unsupported 2023 launch date; recorded standard joining fee INR999 with the current CSB INR499 marketing and Jupiter limited-period INR0 joining offers documented as campaign conflicts; annual fee is nil. Updated forex 3.5%, monthly finance charge 3.75%, and cash advance to unavailable. Replaced legacy reward rates, caps, exclusions and point values with the schedule in the current detailed co-brand terms, effective 10 Oct 2026: 5 Jewels/INR100 on other eligible spends; named shopping earns 5 Jewels instantly and the additional 45 only when qualified statement-cycle spend exceeds INR15,000, with 10,000 category, 3,000 merchant and 1,000 transaction caps; Jupiter Flights earns 25 Jewels/INR100, capped at 5,000 per cycle. The CSB-hosted MITC instead says 5 Oct and gives no numeric flight cap; the full co-brand terms say they prevail over conflicting MITC terms. Redemption value varies (INR0.14 cash/statement credit, INR0.20 vouchers/Jupiter/gold). Current terms state fuel waiver 1% on INR400-INR3,000, capped INR100/month, plus Platinum BIN-specific INR2 lakh accident/disability cover and 24/7 concierge. No lounge access was found. Jupiter states age 23-60 and Indian residency; numerical income/score cutoffs remain unknown. The new spend gate's exact cycle-wide qualification cannot be fully represented in the schema and is documented in the source extract.

Post-review validation: 370 records, 895 reward rules, 798 strict-scope, 790/798 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,901/2,391 (80%); rewards 1,901/2,978 (64%); benefits 2,095/3,204 (65%); eligibility 754/828 (91%); stamp mismatches zero. These measures do not represent dataset-wide factual accuracy. Next review: DBS BFL 10X.

## Latest record-level review: DCB PayLess Select (27 Oct 2026)

Compared DCB?s September 2025 PayLess MITC, hosted FAQ and current secured-card page. Corrected fees and cash advance charges, reward model to INR1,000 cashback after INR100,000 quarterly spend, Select lounge access (two domestic/quarter plus one international/year), fuel waiver and FD eligibility. Removed false Reward Points/valuation, INR10 lakh personal accident amount and concierge. The FAQ states general DCB PayLess eligibility, including INR15,000 minimum DCB FD; it does not state a different minimum by variant, so prior INR25,000 claim was cleared. Exact launch date, insurance amount and minimum fuel transaction remain unknown. Shared source captures and comparison are under `docs/sources/dcb/payless-platinum/` and `docs/sources/dcb/payless-select/`.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,930/2,385 (81%), rewards 1,901/2,941 (65%), benefits 2,108/3,171 (66%), eligibility 758/832 (91%); stamp mismatches zero. These are traceability measures, not factual accuracy. Oldest active/invite-only cohort: 23 records last verified 2026-10-24; next is Equitas PowerMiles.

## Previous record-level review: DCB PayLess Platinum (27 Oct 2026)

Compared DCB?s 2025-09 PayLess MITC, 2024-12-hosted FAQ and current secured-card page; issuer sources are archived under `docs/sources/dcb/payless-platinum/`. Corrected fees (nil joining, INR350 annual, INR50,000 waiver, 3% monthly finance, ATM fee 2.5%/INR250 minimum and 3.5% forex), reward model (INR250 cashback after INR50,000 quarterly eligible spend), lounge (one domestic visit/quarter), fuel waiver (up to INR100/statement for eligible amounts to INR5,000) and published FD eligibility. Added MITC lost-card/fraud terms without inventing coverage amounts. Removed the false points model and unsupported point values/MCCs; exact launch date and minimum fuel transaction remain unknown.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,918/2,380 (81%), rewards 1,901/2,947 (65%), benefits 2,101/3,173 (66%), eligibility 756/830 (91%); stamp mismatches zero. Coverage is traceability, not factual accuracy. Oldest active/invite-only cohort: 24 records last verified 2026-10-24; next is DCB PayLess Select.

## Previous record-level review: DBS SuperX (27 Oct 2026)

Compared DBS current consolidated MITC, Key Fact Document, April 2026 Schedule of Charges, DBS Delights terms and current card catalogue; archived issuer PDFs and the stale product-URL response under `docs/sources/dbs/superx/`. Confirmed zero joining fee, INR1,499 annual fee with no waiver, 3.5% forex, cash advance 2.5%/INR500 minimum and variable 3.5%-4% monthly finance charge. Cleared the old SuperCard-derived reward rate, INR0.25 point value, 5,000-point welcome, lounge, movie and fuel-waiver claims. DBS publishes SuperX platform eligibility but no product-specific earn or benefit rules in the sources reviewed; these remain unknown. SuperX remains active; current official migration notice concerns predecessor SuperCard and says 15-Dec-2026, conflicting with older notices. Evidence: `docs/sources/dbs/superx/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules; 793 strict-scope, 785/793 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,906/2,375 (80%), rewards 1,901/2,953 (64%), benefits 2,095/3,169 (66%), eligibility 754/828 (91%); stamp mismatches zero. These measures do not establish factual accuracy. Oldest active/invite-only cohort: 25 records last verified 2026-10-24; next is DCB Payless Platinum.

## Previous record-level review: DBS BFL 5X (27 Oct 2026)

Compared current DBS 5X-specific terms, MITC, terms index and rewards FAQ. Marked discontinued effective 2026-08-01. Corrected current-published fees (including 2025 annual-waiver end), cash advance and forex charges, 5X milestone, separate Card+ app accelerator, welcome condition and fuel waiver. Removed unsupported launch date, Platinum tier, fixed point value, online accelerator, BookMyShow offer and lounge visit. Source pages conflict on discontinuation dates (current variant page/index: 2026-08-01; generic landing page: issuance ceased 2024-11-23; older MITC: 2025-12-01). Used the specific current notice; customer-specific historic charges and exact interest rate remain uncertain. Evidence: `docs/sources/dbs/bfl-5x/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 897 reward rules; 794 strict-scope, 786/794 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,901/2,377 (80%), rewards 1,901/2,962 (64%), benefits 2,095/3,180 (66%), eligibility 754/828 (91%); stamp mismatches zero. These are validation and traceability measures, not factual accuracy. Twenty-six oldest-cohort records remain; next is DBS SuperX.

## Previous record-level review: DBS BFL 10X (27 Oct 2026)

Compared DBS 10X Signature-specific terms, current discontinuation notice, rewards FAQ and lounge terms. Marked discontinued effective 2026-08-01; corrected fee, base and accelerated rewards, welcome condition, domestic lounge quota and fuel-waiver cap. Removed unsupported launch date, network/tier, fee waiver, old online accelerator/movie offer and fixed point value. Current sources do not establish exact legacy cardholder charges, APR, forex, cash-advance fee, launch date or point INR value. Evidence: `docs/sources/dbs/bfl-10x/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 rewards; 796 active/invite-only strict scope, 788/796 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,901/2,384 (80%), rewards 1,901/2,970 (64%), benefits 2,095/3,191 (66%), eligibility 754/828 (91%); stamp mismatches zero. These figures measure validation and traceability, not factual accuracy. The oldest active/invite-only cohort has 27 records last verified 2026-10-24; next is DBS BFL 5X.

## Previous record-level review: CBI RuPay Select (27 Oct 2026)

Compared CBI's current credit-card page, FY2019-20 annual report, current credit/debit application directory and linked Central Platinum form. The credit-card page does not list RuPay Select; the current bank homepage and service-charge pages show RuPay Select debit-card services, not this credit product. The annual report says standalone issuance was discontinued as co-branded issuance began in October 2019. Cleared unsupported fees, APR, rewards, benefits, eligibility, launch date and application URL; set status to on-hold. No product-specific discontinuation date or existing-holder terms were found. Details: `docs/sources/cbi/rupay-select-issuer-extract-2026-10-27.md`.

Post-review validation: 370 records, 895 reward rules, 798 strict-scope, 790/798 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,897/2,393 (79%); rewards 1,888/2,976 (63%); benefits 2,090/3,203 (65%); eligibility 752/826 (91%); stamp mismatches zero. These do not measure database-wide factual accuracy. Next review: CSB Jupiter Edge.

## Previous record-level review: CBI RuPay Platinum (27 Oct 2026)

Compared CBI's current credit-card page, FY2019Ã¢â‚¬â€œ20 annual report, application-form directory and linked Central Platinum form. The annual report says standalone issuance was discontinued as co-branded issuance began in October 2019. The current Platinum application is for Visa, not this RuPay credit card; its terms were not transferred. Cleared unsupported fees, APR, rewards, benefits, eligibility, launch date and application URL; set status to on-hold. No product-specific discontinuation date or existing-holder terms were found. Details: `docs/sources/cbi/rupay-platinum-issuer-extract-2026-10-27.md`.

Post-review validation: 370 records, 895 reward rules, 799 strict-scope, 791/799 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,897/2,400 (79%); rewards 1,888/2,981 (63%); benefits 2,090/3,212 (65%); eligibility 752/826 (91%); stamp mismatches zero. These do not measure dataset-wide factual accuracy. Next review: CBI RuPay Select.

## Latest record-level review: Canara Visa Signature (27 Oct 2026)

Compared the current Canara Visa Signature product page and linked user manual. Corrected the unsupported launch date and INR2 lakh annual-fee waiver; current issuer terms instead list nil joining/annual fees and a separate INR1,000 inactivity fee below INR2 lakh year turnover. Corrected reward scope, unsupported exclusions/MCC, realized point value, international lounge claim, fuel waiver terms, income criterion and concierge flag. Current page states 2 points/INR100 POS/e-commerce, 3 domestic lounge visits/quarter, fuel reimbursement 1% capped INR100/month with INR2,500 purchase spend and INR400 minimum fuel ticket, INR5 lakh fraud cover, insurance and INR10 lakh independent gross income. Guest quota and international lounge access are unpublished; current Rewardz redemption is not accessible and realized point value remains unknown. Evidence extract: `docs/sources/canara/visa-signature-issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 895 reward rules, 800 strict-scope, 792/800 strict-ready (99%), zero errors/warnings. Numeric evidence paths: fees 1,897/2,406 (79%); rewards 1,888/2,986 (63%); benefits 2,090/3,218 (65%); eligibility 752/826 (91%); stamp mismatches zero. These are traceability measures, not factual accuracy. Next review: CBI RuPay Platinum.

## Latest record-level review: Canara Mastercard World (27 Oct 2026)

Compared the current Canara card page and linked issuer user manual; the linked MITC PDF returned 404. Corrected the unsupported launch date, reward scope, unsupported exclusions/MCC, realized point value, lounge guest quotas, fuel waiver terms, insurance, income criterion, residency assumption and concierge flag. Current issuer terms show nil joining/annual fees, up to 3% forex, 2.5% monthly finance, 3% cash advance (INR150 minimum), 2 points per INR100 on POS/e-commerce, domestic lounge 3 self + 2 guests per quarter and international 2 self + 2 guests per year, fuel reimbursement 1% capped INR100/month with a INR2,500 purchase-spend condition and INR400 minimum fuel ticket, plus INR10 lakh minimum independent gross income. The issuer manual gives INR0.25 nominal value per point, but current redemption was not accessible; realized value remains unknown. Detailed insurance terms and lounge access mechanism are not published. Evidence extract: `docs/sources/canara/mastercard-world-issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 895 reward rules, 800 strict-scope, 792/800 strict-ready (99%), zero errors/warnings. Numeric evidence paths: fees 1,891/2,407 (79%); rewards 1,885/2,987 (63%); benefits 2,081/3,218 (65%); eligibility 750/824 (91%); stamp mismatches zero. These are traceability measures, not factual accuracy. Next review: Canara Visa Signature.

Compared the current product page, scanned card-specific terms, PRCXC Most Important Document and current tariff. Corrected the cash-advance fee, cleared unsupported launch date/network tier and fuel-surcharge waiver, corrected catalogue point value, added the fee-paying-customer restaurant welcome cashback, and added published age/GMI eligibility. Standard tariff fees coexist with a conditional digital-channel fee offer. The product page says accelerated rewards have no monthly cap while the card-specific terms mention an unspecified card-level maximum; the conflict and source-specific limits are documented. Evidence comparison: `docs/sources/standard-chartered/platinum-rewards/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 893 reward rules, 801 strict-scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,845/2,419 (76%); rewards 1,865/3,005 (62%); benefits 2,045/3,228 (63%); eligibility 748/819 (91%). Stamp mismatches: zero. These are traceability measures, not a factual-accuracy percentage. Seven oldest-cohort records remain; next is YES BYOC.

## Latest record-level review: Standard Chartered Super Value Titanium (27 Oct 2026)

Compared current product page, tariff, card-specific T&Cs, product MID and current cashback-redemption FAQ. Corrected network, cash-advance fee, cashback caps/conditions, point value, redemption threshold and eligibility; cleared unsupported launch date, general fee waiver, fuel-surcharge waiver and unsupported reward exclusions. Current main product page and a separate lead form conflict on fee waiver; product page transaction caps differ from the older linked T&Cs. Conditional Premium Banking lounge benefits are documented but not applied to the standard card. Evidence comparison: `docs/sources/standard-chartered/super-value-titanium/issuer-extract-2026-10-27.md`.

Latest validation after this review: 370 cards, 893 rewards, 801 strict-scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,845/2,419 (76%); rewards 1,865/3,005 (62%); benefits 2,045/3,228 (63%); eligibility 748/819 (91%). Stamp mismatches: zero. Seven oldest-cohort records remain; next is YES BYOC. These figures do not measure database-wide factual accuracy.

## Latest record-level review: YES Prosperity Cashback (27 Oct 2026)

Compared current issuer card catalogue, MITC v18, the official shared utility-revision notice and YES BANK legacy Cashback template. Corrected cash advance, APR/forex, fuel waiver and welcome condition; cleared unsupported network/tier, date, residency, application, lounge and concierge values. Standard Cashback remains active because the current catalogue lists it; no discontinuation notice was located. Legacy issuer page fetch returned 503; cashback rates remain at medium confidence and exact current movie/grocery caps/threshold and utility AutoPay details remain unresolved. Evidence: `docs/sources/yes/prosperity-cashback/issuer-extract-2026-10-27.md`.

Post-review validation: 370 records, 896 reward rules, 801 strict-scope, 791/801 strict-ready (98%), zero errors/warnings; numeric evidence paths: fees 1,860/2,413 (77%), rewards 1,868/3,002 (62%), benefits 2,058/3,224 (64%), eligibility 748/819 (91%); stamp mismatches zero. Two oldest active/invite-only records remain; next is YES Uni RuPay. These measures do not establish database-wide factual accuracy.

## Previous record-level review: YES Prosperity Cashback Plus (27 Oct 2026)

Compared current issuer product page, MITC v18, the official cashback-revision notice and legacy issuer terms for offer detail. Marked the card on-hold because new issuance is discontinued. Corrected APR/cash-advance minimum, forex markup, cashback rates/caps/utility threshold, welcome-spend condition and fuel waiver. Cleared unsupported network/tier, launch date, residency assumption and apply URL. Exact reward rule interactions and card-specific eligibility details are documented in `docs/sources/yes/prosperity-cashback-plus/issuer-extract-2026-10-27.md`.

Post-review validation: 370 records, 895 reward rules, 800 strict-scope, 788/800 strict-ready (98%), zero errors/warnings; numeric evidence paths: fees 1,854/2,413 (77%), rewards 1,868/3,001 (62%), benefits 2,052/3,223 (64%), eligibility 748/819 (91%); stamp mismatches zero. Three oldest active/invite-only records remain; next is YES Prosperity Cashback. These are not a database-wide factual-accuracy score.

## Previous record-level review: YES Marquee (27 Oct 2026)

Compared current issuer card listing, consolidated MITC v18, Schedule of Charges, Marquee value chart and domestic lounge schedule. Corrected the annual renewal waiver to INR10 lakh, APR/cash advance fee, reward rates/caps, domestic lounge quota and spend gate, fuel waiver and fee-realization benefits. Current materials have guest-access wording conflict; guest-per-visit count is left unknown. Unsupported launch date/network tier, INR25 lakh waiver, unlimited domestic lounge visits, golf quotas and insurance sums were cleared. The issuer value chart labels reward rates illustrative; exact online and select-category MCCs remain unavailable. Evidence comparison: `docs/sources/yes/marquee/issuer-extract-2026-10-27.md`.

Post-review validation: 370 records, 894 reward rules, 802 strict-scope, 788/802 strict-ready (98%), zero errors/warnings; numeric evidence paths: fees 1,854/2,419 (77%), rewards 1,868/3,009 (62%), benefits 2,052/3,228 (64%), eligibility 748/819 (91%); stamp mismatches zero. Four oldest-cohort records remain; next is YES Prosperity Cashback Plus. These measures do not estimate database-wide factual accuracy.

## Previous record-level review: YES BYOC (27 Oct 2026)

Compared the live YES BANK card listing, consolidated MITC V18 dated 05-Oct-2026, indexed BYOC-specific issuer terms, and the current domestic lounge schedule. Updated the Cashback-module fees and terms, optional merchant subscription, cash advance, APR, forex markup, lounge spend gate and fuel waiver. The Rewards module is an alternative configuration and is documented separately because the schema models one reward currency per record; network/tier, launch date and numeric eligibility remain unknown. Some source PDFs were reviewed through issuer-rendered browser extraction but could not be downloaded locally; the limitation and comparison are recorded at `docs/sources/yes/byoc/byoc-rendered-extract-2026-10-27.md`.

Post-review validation: 370 cards, 893 reward rules, 801 strict-scope, 787/801 strict-ready (98%), zero errors/warnings; numeric evidence paths: fees 1,851/2,419 (77%), rewards 1,868/3,007 (62%), benefits 2,050/3,230 (63%), eligibility 748/819 (91%); stamp mismatches zero. Five oldest-cohort records remain; next is YES Marquee. These checks are not a database-wide factual-accuracy score.

## Latest record-level review: HDFC Tata Neu Plus (Visa)

Compared HDFC's current product and eligibility pages, card-specific terms and FAQ updated 24-Oct-2026, current partner-brand fair-use schedule, NeuPass terms updated 19-Sep-2026, personal MITC v4.15 updated 17-Oct-2026, and the 24-Aug-2022 launch announcement. Corrected the launch date, cleared the unsupported Visa network tier, changed NeuCoins from cashback to reward points, corrected redemption to eligible Tata Neu use, refreshed partner rates/caps and exclusions, fee terms, lounge and fuel benefits, and published eligibility. RuPay UPI rates were excluded from the Visa variant.

The issuer describes a separate additional 5% NeuPass/Tata Neu Rewards benefit on selected categories, with primary-cardholder matching and sometimes activation requirements; eligibility is dynamic and it is documented separately from the card-attributable earn. HDFC has also announced a manual in-app claiming process effective 25-Nov-2026. That change is future-dated relative to this review and is recorded without replacing the current automatic transfer and expiry terms.

Validation after the review: 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero validator errors/warnings. Numeric evidence-path coverage: fees 1,613/2,469 (65%); rewards 1,649/3,046 (54%); benefits 1,755/3,230 (54%); eligibility 703/759 (93%). Stamp mismatches: zero. These are validation/traceability measures, not a factual-accuracy rate. Source evidence and unresolved details are in `docs/sources/hdfc/tata-neu-plus/`.


## Latest record-level review: HDFC UPI RuPay

Compared HDFC's current product and fees pages, card-specific terms dated 27-Mar-2025, current personal MITC v4.15, and co-branded MITC v3.9. Corrected fees, renewal waiver, CashPoints value and earning terms, cleared unsupported network tier and launch date, refreshed exclusions and eligibility, and removed the unsupported fuel-surcharge waiver. The card-specific page says 3.6% monthly interest while both MITC schedules give 3.75% for other variants. The live page lists 500 points as the statement redemption minimum while card terms list 2,000. HDFC's separate fuel-charge wording also leaves its applicability unclear; all three conflicts are documented with issuer evidence in `docs/sources/hdfc/upi-rupay/`.

Validation after the review: 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero validator errors/warnings. Numeric evidence-path coverage: fees 1,619/2,469 (66%); rewards 1,658/3,046 (54%); benefits 1,756/3,229 (54%); eligibility 703/759 (93%). Stamp mismatches: zero. These measures indicate structural validity and traceability; they do not provide a factual-accuracy percentage.


## Latest record-level review: HSBC Live+

Compared HSBC's current card page, Live+ Service Guide, current Important Terms and Conditions and Key Fact Statement, plus the current welcome and fuel-contactless offer terms. Updated network tier, current fee and foreign-exchange schedule, accelerated cashback categories/cap/MCCs and exclusions, lounge access, current welcome and fuel offers, and published eligibility. Cleared the unsupported launch date. The 10% categories now cover dining, food delivery, grocery, shopping and utilities with one INR1,200 monthly cap; Amazon, Flipkart and Myntra shopping transactions instead receive 1.5%. An alternative Visa Infinite INR750 voucher offer through 31-Oct-2026 is recorded separately from HSBC?s INR1,000 welcome cashback because the HSBC terms prohibit combining welcome offers. The record encodes the issuer's current zero-cashback MCC list. One additional numeric field was added for the alternative Visa Infinite welcome voucher; numeric evidence-path coverage is updated in the table above.

Unresolved source conflicts are documented: the updated card-specific summary/product page gives no cashback for international transactions while an older general Service Guide passage says they are eligible; the Live+ specific guide/product page states two domestic plus one international lounge visits while a generic HSBC FAQ still lists four domestic visits. The review follows the current card-specific evidence.

Validation after review: 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero validator errors/warnings. Numeric evidence-path coverage: fees 1,626/2,469 (66%); rewards 1,665/3,045 (55%); benefits 1,761/3,226 (55%); eligibility 720/776 (93%). Stamp mismatches: zero. These checks do not measure factual accuracy across unreviewed records.


## Latest record-level review: HSBC Premier (27 Oct 2026)

Compared HSBC's current Premier product, rewards and fees pages, current card-specific MITC, introduction offer terms, HSBC Rewards terms, Travel with Points campaign page, and travel insurance terms. Corrected fee waiver (qualified Premier relationship, no card spend threshold), finance charge (2.99% monthly), cash advance minimum (INR300), reward partner transfer ratios and redemptions, published welcome offer, and source-backed lounge and insurance descriptions. Cleared the unsupported card launch date and Mastercard World Elite tier, removed unsupported golf quota and numeric insurance limits, and no longer invents rupee values for points transferred to partners. The current Travel with Points page supports 6X flights and 12X hotels through 2026-12-31; car-rental multiplier remains unresolved because issuer pages conflict.

Validation after review: 370 cards, 884 reward rules, 793 strict-scope, 754/793 strict-ready (95%), zero validator errors/warnings. Numeric evidence paths: fees 1,632/2,468 (66%); rewards 1,671/3,042 (55%); benefits 1,767/3,223 (55%); eligibility 720/776 (93%). Stamp mismatches: zero. These counts do not measure factual accuracy for unreviewed records. Details and unresolved fields are in `docs/sources/hsbc/premier/`.


## Latest record-level review: HSBC RuPay Platinum (27 Oct 2026)

Compared HSBC?s current RuPay Platinum product/rewards pages, card-specific MITC, Service Guide, KFS, welcome cashback terms and EazyDiner terms. Corrected the monthly interest rate to 3.75%; updated rewards to the published 2 points per INR150, up to 6X travel earn (with 18,000 accelerated points/month cap), current partner transfer ratios, MCC exclusions and three-year point validity; removed invented point-to-rupee values; refreshed the INR500 welcome cashback conditions, INR250 Amazon application offer, EazyDiner membership, fuel waiver and eligibility. Cleared the unsupported launch date. The issuer describes JCB international acceptance in addition to the RuPay network, which remains a single-network schema limitation. No lounge access is advertised on the current card page.

Validation after review: 370 cards, 885 reward rules, 794 strict-scope, 755/794 strict-ready (95%), zero validator errors/warnings. Numeric evidence paths: fees 1,638/2,468 (66%); rewards 1,676/3,041 (55%); benefits 1,775/3,224 (55%); eligibility 713/769 (93%). Stamp mismatches: zero. These are traceability and schema measures, not a factual-accuracy rate for unreviewed cards. Evidence and open issues are in `docs/sources/hsbc/rupay-platinum/`.


## Latest record-level review: HSBC Visa Platinum (27 Oct 2026)

Compared current HSBC Visa Platinum product and rewards pages, card-specific MITC, Service Guide, KFS, welcome-points terms, EazyDiner offer, fuel-contactless offer and District terms. Corrected the current 3.75% monthly finance rate and removed unsupported product launch date and fixed partner point-INR estimates. Updated rewards and partner ratios, Travel with Points/Apple accelerators, current 2,000-point welcome offer, Visa voucher, Amazon voucher, EazyDiner membership, monthly fuel surcharge cap and quarterly fuel contactless offer. Added issuer-described Visa Signature privileges and INR300,000 lost-card misuse cover. Recorded a conflict between HSBC's current card product page eligibility and the separate dedicated eligibility page; structured values follow the product page. Cleared the network tier because Visa Signature privileges are described but issued network tier is not specified.

Validation after review: 370 cards, 887 reward rules, 796 strict-scope, 756/795 strict-ready (95%), zero validator errors/warnings. Numeric evidence paths: fees 1,644/2,468 (67%); rewards 1,683/3,042 (55%); benefits 1,784/3,226 (55%); eligibility 719/775 (93%). Stamp mismatches: zero. These are traceability/schema measures, not a measured factual-accuracy rate. Sources and unresolved claims: `docs/sources/hsbc/visa-platinum/`.


## Latest record-level review: ICICI Emirates Emeralde (27 Oct 2026)

Compared the current ICICI product/FAQ, its linked card-specific T&C (last updated 30-Sep-2025), the current MITC (last updated 9-Oct-2026), the active INICI26 airfare campaign and ICICI's 15-Mar-2022 launch announcement. Updated fee, earn and exclusion evidence; removed unsupported mile INR estimates; refreshed welcome/renewal benefits, lounge access, BookMyShow gate, fuel waiver, Gold milestone, Emirates promo and eligibility. The salaried minimum is encoded as ?3,000,000 annualized from the published ?250,000 monthly. The self-employed threshold is left unknown because the same live product page says ?30 lakh in its visible paragraph and ?45 lakh in image text. Current card material does not reconfirm the network/tier; historical launch says Visa, so the current scalar fields are null. The card page advertises BookMyShow up to four uses/month and ?750 off; the ?25,000 prior-quarter spend gate applies from 1-Apr-2026, but linked generic offer terms do not explicitly name the Emirates Emeralde variant, so the exact variant entitlement remains unresolved.

After this review: 370 cards; 887 reward rules, 796 strict scope, 756/795 strict-ready (95%); validator 0 errors/warnings; numeric evidence coverage fees 1,665/2,468 (67%), rewards 1,685/3,039 (55%), benefits 1,791/3,225 (56%), eligibility 720/776 (93%); stamp mismatches 0. These remain structural and traceability measures, not a factual-accuracy percentage. Next queue: ICICI Emirates Rubyx; 33 records remain in the oldest cohort.


## Latest record-level review: ICICI Emirates Rubyx (27 Oct 2026)

Compared current ICICI product/FAQ, card-specific T&C dated 30-Sep-2025, current MITC dated 9-Oct-2026, linked BookMyShow offer terms, active INICI26 campaign and official 2022 launch announcement. Marked the card on-hold because the live page says applications are not currently accepted. Corrected the current card-specific earn rate to 1 mile/?100 (the general Emirates page still says 1.5); removed estimated mile INR values; updated exact reward exclusions, fees, one quarterly domestic lounge visit after ?75,000 prior-quarter spend and no international lounge; recorded BookMyShow's ?25,000 prior-quarter spend gate and separate INOX terms; refreshed fuel waiver and eligibility. The current card page gives ?75,000/month salaried and ?9 lakh/year self-employed thresholds. Visa is identified by 2022 launch materials, but current issuance and tier are unconfirmed, so the scalar fields are null.

After this review: 370 records; 887 reward rules, 795 active/invite-only strict scope, 756/795 strict-ready (95%); validator 0 errors/warnings; numeric evidence coverage fees 1,663/2,445 (68%), rewards 1,685/3,034 (56%), benefits 1,791/3,218 (56%), eligibility 720/776 (93%); stamp mismatches 0. These measures do not represent factual accuracy. Next queue: ICICI Emirates Sapphiro; 32 active/invite-only records remain in the oldest cohort.


## Latest record-level review: ICICI Emirates Sapphiro (27 Oct 2026)

Compared the current card product/FAQ, card-specific T&C dated 30-Sep-2025, current MITC dated 9-Oct-2026, linked BookMyShow terms, current INICI26 campaign and official launch announcement. Confirmed fees, 1.5 Skywards Miles/?100 eligible retail spend, reward exclusions, 5,000 joining and annual miles, Silver retention terms, 2 domestic visits/quarter after ?75,000 preceding-quarter spend and 2 international visits/year, ?25,000 BookMyShow threshold, fuel waiver and published eligibility. Removed unsupported INR mile estimates and MCC-only exclusion. Historical launch material names Visa, but current page does not establish current network/tier, so those scalar fields are null. The card page's rate table and T&C say 1.5 miles/?100, while its FAQ says ?up to 2? and the broader Emirates overview says 2; use the more specific rate table/T&C. The card-specific T&C's generic Gold-tier clause does not publish an Emirates Sapphiro qualifying spend threshold, and the current product page does not advertise Gold; this remains unencoded.

After this review: 370 records, 887 reward rules, 795 strict scope, 756/795 strict-ready (95%); validator 0 errors/warnings; numeric evidence coverage fees 1,684/2,445 (69%), rewards 1,687/3,031 (56%), benefits 1,804/3,220 (56%), eligibility 722/778 (93%); stamp mismatches 0. These metrics do not measure factual accuracy. Next queue: ICICI Parakram Select; 31 records remain in the oldest active/invite-only cohort.


## Latest record-level review: ICICI Parakram Select (27 Oct 2026)

Compared current ICICI card page and detailed FAQ with the card-specific T&C retrieved 27-Oct-2026, current MITC and ICICI Rewards FAQ. Cleared unsupported launch date, Visa network and Signature tier; refreshed fees, point rates and exclusions, catalogue redemption fee, lounge, golf, insurance, fuel and eligibility notes; removed the unsupported fixed INR values and MCC 6513-only exclusion.

The current page/FAQ says two international lounge visits per year while card-specific T&C says one; the live detailed golf FAQ says maximum one monthly round while T&C says four. Structured benefits follow the current product page/FAQ, with both conflicts retained in the issuer extract.

After review: 370 cards, 884 reward rules, 792 strict scope, 753/792 strict-ready (95%), zero validator errors/warnings; evidence paths fees 1,693/2,445 (69%), rewards 1,693/3,025 (56%), benefits 1,816/3,221 (56%), eligibility 724/780 (93%); stamp mismatches zero. These do not measure factual accuracy. Recount found 37 oldest-cohort active/invite-only records last verified 2026-07-05; next is ICICI Emeralde. Details: `docs/sources/icici/parakram-select/issuer-extract-2026-10-27.md`.


## Latest record-level review: ICICI Emeralde Private Metal (27 Oct 2026)

Compared the current ICICI product page/FAQ, card-specific T&C last updated 21-May-2026, current MITC, current iShop FAQ/cap PDF and ICICI Lombard group policy updated December 2025. Cleared unsupported launch date, network and tier; corrected fee, rewards, category exclusions/caps, redemption values, lounge and golf details, milestones, fuel cap and insurance coverage. Removed unsupported iShop exact multipliers and Air India transfer valuation. Corrected the INR5,000,000 medical-cover entry to INR50,000 for rail/road accident injury.

Unresolved: exact current issued network/tier and launch date; exact public card-specific iShop multipliers; card product page and T&C insurance reward-cap conflict; card FAQ's 60-day air-accident activity condition versus the linked general policy's 90-day active-card condition. Evidence and archived sources are in `docs/sources/icici/emeralde-private-metal/`.

After review: 370 cards, 884 reward rules, 792 strict scope, 753/792 strict-ready (95%), zero validator errors/warnings; evidence paths fees 1,693/2,445 (69%), rewards 1,693/3,025 (56%), benefits 1,816/3,221 (56%), eligibility 724/780 (93%); stamp mismatches zero. These figures do not measure factual accuracy. Recount found 37 oldest-cohort active/invite-only records last verified 2026-07-05; next is ICICI Emeralde (`data/cards/icici/emeralde.yaml`).


## Latest record-level review: ICICI Emeralde (27 Oct 2026)

Compared the current product page/FAQ, linked membership guide, current MITC and general terms, golf terms, group insurance policy and cancellation process. Corrected issuer-published fees/waiver, rewards, lounge access, golf eligibility, BookMyShow spend gate, fuel waiver, cancellation benefit and eligibility. Removed unsupported launch date/network tier, fixed point values and stale travel-medical cover. Documented unresolved current-source conflicts for birthday voucher variants and the 60-day card FAQ versus 90-day group-policy insurance activity rule. Cash-advance fee omitted because the current readable issuer tariff did not establish the card-specific amount.

Live validation after review: 370 cards; 881 reward rules, 789 strict scope, 750/789 strict-ready (95%), zero validator errors/warnings. Numeric evidence paths: fees 1,696/2,443 (69%), rewards 1,695/3,016 (56%), benefits 1,822/3,219 (57%), eligibility 728/784 (93%). Stamp mismatches: zero. These measures do not quantify factual accuracy across unreviewed records. Oldest cohort: 36 active/invite-only records at 2026-07-05; next by path order is ICICI MakeMyTrip (`data/cards/icici/mmt.yaml`). Source and unresolved-claim details: `docs/sources/icici/emeralde/issuer-extract-2026-10-27.md`.


## Latest record-level review: MakeMyTrip ICICI Bank Credit Card (27 Oct 2026)

Reviewed the current ICICI product page/FAQ, card-specific T&Cs, current MITC, official 2024 launch announcement, MakeMyTrip partner page and BookMyShow terms. Corrected dual Mastercard/RuPay representation, launch date, fee-waiver conditions, closed-loop myCash model and current earn rates, lounges, vouchers, membership and eligibility. Added the insurance earn cap and fixed per-train-booking myCash as a documented schema limitation. Removed unsupported MCC exclusions and unverified cash-advance fee values. Recorded future terms effective 2026-11-10 (no international myCash; new credits expire after 24 months, prior credits do not) and a partner-page zero-forex claim that conflicts with ICICI's current 0.99% listing. Also documented the BookMyShow spend-threshold boundary discrepancy and INOX quota uncertainty. Evidence and unresolved terms: `docs/sources/icici/mmt/issuer-extract-2026-10-27.md`.

Live validation after review: 370 cards; 882 reward rules, 790 strict scope, 754/790 strict-ready (95%), zero validator errors/warnings. Numeric evidence paths: fees 1,700/2,441 (70%), rewards 1,699/3,019 (56%), benefits 1,827/3,218 (57%), eligibility 731/787 (93%). Stamp mismatches: zero. These measures do not quantify factual accuracy across unreviewed records. Oldest cohort: 35 active/invite-only records at 2026-07-05; next by path order is ICICI Parakram (`data/cards/icici/parakram.yaml`).


## Latest record-level review: ICICI Parakram (27 Oct 2026)

Compared ICICI's current Parakram product page/FAQ, card-specific terms updated 25-May-2026, MITC updated 9-Oct-2026, and current card insurance policy. Cleared unsupported network, network tier and launch date; removed unsupported fixed point valuations and MCC 6513. Updated current fee schedule, point earning rates/exclusions, INR99+GST redemption handling charge, lounge spend gate (INR75,000 preceding-quarter eligible spend, primary cardholder), fuel waiver, insurance amounts and 30-day card-use condition, and eligibility. Omitted cash advance transaction fee because a current card-specific rate was not established. Evidence and policy details are in `docs/sources/icici/parakram/issuer-extract-2026-10-27.md`.

Validation after review: 370 cards, 882 reward rules, 790 strict-scope, 754/790 strict-ready (95%), zero validator errors/warnings. Numeric evidence-path coverage: fees 1,703/2,439 (70%); rewards 1,701/3,016 (56%); benefits 1,832/3,219 (57%); eligibility 731/788 (93%). Stamp mismatches: zero. These checks do not measure factual accuracy across unreviewed records.


## Latest record-level review: ICICI Rubyx (27 Oct 2026)

Compared current ICICI product/eligibility page and FAQ, card terms, MITC updated 9-Oct-2026, welcome voucher T&Cs updated 16-Apr-2026, September-2026 golf terms, December-2025 insurance policy and current iShop guidance/cap. Cleared unsupported single-network/tier and launch date, fixed point value, obsolete international lounge claim and unsupported MCC 6513. Updated fees, spend-linked annual waiver, reward schedule and exclusions, iShop rate/caps, primary-only domestic lounge gate, railway lounge, spend-linked golf, BMS/INOX terms, welcome vouchers, insurance variants, fuel waiver and published eligibility. Product FAQ's 60-day insurance activity statement conflicts with policy's 90-day active-card clause; preserved for recheck. Cash advance transaction fee not located in current readable issuer tariff. Evidence: `docs/sources/icici/rubyx/issuer-extract-2026-10-27.md`.

Validation after review: 370 cards; 882 reward rules; 790 strict scope; 759/790 strict-ready (96%); zero errors/warnings. Numeric evidence paths: fees 1,706/2,437 (70%); rewards 1,703/3,015 (56%); benefits 1,840/3,215 (57%); eligibility 731/792 (92%). Stamp mismatches: zero. Numeric evidence-path coverage is traceability, not a factual-accuracy rate.


## Latest record-level review: ICICI Sapphiro (27 Oct 2026)

Compared the current ICICI product/eligibility page and FAQ, current MITC and card terms, Sapphiro welcome terms, golf terms, current group insurance policy and iShop rules/cap. Cleared unsupported network/tier and launch-date claims, corrected reward currency, rates, point valuation and exclusions, iShop multipliers/caps, lounge thresholds, BMS gating, milestone schedule, welcome vouchers, fuel terms, and published eligibility. Air accident policy says active-card use within 90 days, while the current product FAQ says 60 days; left discrepancy explicit. Cash advance transaction fee not established. Evidence: `docs/sources/icici/sapphiro/issuer-extract-2026-10-27.md`.

Validation after review: 370 cards; 883 reward rules; 791 strict scope; 764/791 strict-ready (96%); zero errors/warnings. Numeric evidence paths: fees 1,709/2,435 (70%); rewards 1,705/3,016 (57%); benefits 1,848/3,215 (57%); eligibility 731/796 (92%). Stamp mismatches: zero. Numeric evidence-path coverage is traceability, not a factual-accuracy rate.


## Latest record-level review: IDFC FIRST WOW! (27 Oct 2026)

Compared the current FIRST WOW! product page and customer MITC with the May-2026 card update and earlier WOW update. Corrected the Visa Infinite platform and removed the unsupported launch date; replaced stale point base/rates/expiry and redemption claims; changed cash advance fee to the current flat INR199 + GST and removed the unsupported fixed monthly finance rate; removed standard-card lounge/welcome claims that belong to WOW Black; refreshed fuel waiver, roadside assistance and FD-based eligibility. Older personal-accident and lost-card claims are not reaffirmed by the latest notice and current product page, so they remain excluded pending confirmation. Source copies and claim-level details: `docs/sources/idfc-first/wow/issuer-extract-2026-10-27.md`.

Live validation after review: 370 cards; 884 reward rules, 792 strict-scope, 765/792 strict-ready (96%), zero validator errors/warnings. Numeric evidence paths: fees 1,713/2,433 (70%); rewards 1,714/3,018 (57%); benefits 1,851/3,209 (58%); eligibility 733/798 (92%). Stamp mismatches: zero. These checks do not quantify factual accuracy across unreviewed records. Oldest cohort: 31 active/invite-only records at 2026-07-05; next by path order is ICICI Times Black (`data/cards/icici/times-black.yaml`).


## Latest record-level review: ICICI Times Black (27 Oct 2026)

Compared the live ICICI Times Black product page and FAQ with its card-specific T&Cs (updated 02-May-2025), current MITC, December-2025 insurance policy and 2026 CFAR claim process. Cleared the unsupported 2024-03-01 launch date and Visa Infinite tier; corrected domestic/international lounge scope and guest treatment, rewards caps/values, ATM charge, fuel waiver and eligibility; refreshed current welcome/milestone and insurance benefits; removed unsupported unlimited golf and INR5,000,000 travel-medical coverage. The cash-advance row says ATM withdrawal is nil while finance charges can still apply; that distinction is documented. Evidence: `docs/sources/icici/times-black/issuer-extract-2026-10-27.md`.

Live validation after review: 370 cards; 885 reward rules, 793 strict-scope, 766/793 strict-ready (96%), zero validator errors/warnings. Numeric evidence paths: fees 1,717/2,432 (71%); rewards 1,727/3,024 (57%); benefits 1,878/3,220 (58%); eligibility 736/801 (92%). Stamp mismatches: zero. These checks do not quantify factual accuracy across unreviewed records. Oldest cohort: 30 active/invite-only records at 2026-07-05; next by path order is IndusInd Avios (`data/cards/indusind/avios.yaml`).

## Current snapshot after IndusInd Avios review (2026-10-27)

The card-level record was checked against current IndusInd issuer material and corrected; claim-level comparison and unresolved points are in `docs/sources/indusind/avios/issuer-extract-2026-10-27.md`. Database validation: 370 cards; 887 reward rules, 795 active/invite-only strict scope, 770/795 strict-ready (96%); zero schema errors or provenance warnings. Numeric evidence-path coverage: fees 1,722/2,431 (71%); rewards 1,735/3,028 (57%); benefits 1,889/3,228 (59%); eligibility 736/801 (92%). Stamp mismatches: zero.

These measures describe structural validity and traceability. They do not estimate factual accuracy across all records. One card has now been reviewed in this oldest cohort; 29 active/invite-only cards remain last verified 2026-07-05. Next by path is IndusInd Legend (`data/cards/indusind/legend.yaml`).


## Current snapshot after IndusInd Legend review (2026-10-27)

The Legend record was compared against current IndusInd issuer terms and corrected. Claim-level review and caveats: `docs/sources/indusind/legend/issuer-extract-2026-10-27.md`. Validation: 370 cards; 888 reward rules, 796 active/invite-only strict scope, 773/796 strict-ready (97%); zero errors/warnings. Numeric evidence paths: fees 1,728/2,431 (71%); rewards 1,742/3,030 (57%); benefits 1,894/3,225 (59%); eligibility 736/801 (92%). Stamp mismatches: zero.

These figures measure validation structure and evidence traceability; database-wide factual accuracy is still unmeasured. The oldest review cohort now has 28 active/invite-only records last verified 2026-07-05. Next by path is IndusInd Pinnacle (`data/cards/indusind/pinnacle.yaml`).


## Current snapshot after IndusInd Pinnacle review (2026-10-27)

Pinnacle was compared against current IndusInd issuer terms and corrected. Claim-level comparison: `docs/sources/indusind/pinnacle/issuer-extract-2026-10-27.md`. Validation: 370 cards; 890 reward rules, 798 active/invite-only strict scope, 777/798 strict-ready (97%); zero errors/warnings. Numeric evidence-path coverage: fees 1,734/2,431 (71%); rewards 1,750/3,036 (58%); benefits 1,908/3,229 (59%); eligibility 738/803 (92%). Stamp mismatches: zero.

These figures measure structure and traceability, not database-wide factual accuracy. The oldest verification cohort has 27 active/invite-only cards remaining at 2026-07-05. Next by path is Kotak Cashback+ Prime (`data/cards/kotak/cashback-plus-prime.yaml`).


## Historical snapshot after Kotak Cashback+ Prime review (27 Oct 2026)

The record was compared against Kotak's current product page, card-specific terms and KFS. Claim-level evidence and unresolved details: `docs/sources/kotak/cashback-plus-prime/issuer-extract-2026-10-27.md`. Validation: 370 cards; 890 reward rules, 798 active/invite-only strict scope, 777/798 strict-ready (97%); zero errors/warnings. Numeric evidence-path coverage: fees 1,739/2,429 (72%); rewards 1,757/3,033 (58%); benefits 1,912/3,229 (59%); eligibility 738/803 (92%). Stamp mismatches: zero.

These figures measure structure and traceability, not factual accuracy. The oldest cohort now has 23 active/invite-only records last verified 2026-07-05. Next by path is Kotak Cashback+ (`data/cards/kotak/cashback-plus.yaml`).


## Current snapshot after Kotak Cashback+ review (27 Oct 2026)

Kotak Cashback+ was reviewed against current issuer product/claim pages, card-specific terms and KCBKFS04062026. Claim evidence and open details: `docs/sources/kotak/cashback-plus/issuer-extract-2026-10-27.md`. The record updates fee/APR/cash advance, rewards and MCC exclusions, RuPay variant caveat, the current 500-point redemption minimum and fuel waiver. Validation: 370 cards, 890 reward rules, 798 strict scope, 777/798 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,744/2,427 (72%); rewards 1,760/3,031 (58%); benefits 1,916/3,229 (59%); eligibility 738/803 (92%). Stamp mismatches: zero.

These validation measures and evidence-path coverage do not measure factual accuracy across the database. The oldest cohort now contains 22 active/invite-only records last verified 2026-07-05; next by path is Kotak IndiGo XL (`data/cards/kotak/indigo-xl.yaml`).


## Latest record-level review: Kotak IndiGo XL (27 Oct 2026)

Compared current Kotak product, fee, value and offer pages; KFS, co-brand terms, consolidated MITC, MCC schedule, lounge documents and relaunch announcement. Corrected card fees, earning rates, exclusions, redemption limitations, lounge, welcome, renewal and milestone benefits. Removed unsupported network/tier, residency, fuel surcharge waiver and baggage claims. The acquisition joining-fee offer conflicts with generic welcome terms; the lounge list uses older variant names that do not exactly match the current card name. See `docs/sources/kotak/indigo-xl/issuer-extract-2026-10-27.md`.

After review: 370 cards, 890 reward rules, 798 active/invite-only strict-scope rules, 777/798 strict-ready (97%); validator zero errors/warnings. Numeric evidence paths: fees 1,750/2,427 (72%), rewards 1,768/3,031 (58%), benefits 1,926/3,223 (60%), eligibility 738/803 (92%); stamp mismatches zero. These are traceability/structural measures, not an accuracy rate. Next oldest-cohort record is Kotak IndiGo; 21 active/invite-only records remain last verified 2026-07-05.


## Latest record-level review: Kotak IndiGo base (27 Oct 2026)

Compared current issuer product/benefits and fees pages, retail MITC, co-brand terms, MCC schedule and relaunch announcement. Corrected fees, flight earn composition (3 card-side BluChips/INR100), base/dining rates, base-card milestones, welcome/renewal, and unsupported network/eligibility/lounges/fuel waiver. Documented migration fee differences, welcome meal-term ambiguity and the shared terms PDF CDN 403; the issuer PDF is archived in the adjacent XL folder. See `docs/sources/kotak/indigo/issuer-extract-2026-10-27.md`.

After review: validator passes for 370 cards and 890 rules (798 strict-scope; 777/798 strict-ready), zero errors/warnings. Numeric evidence-path coverage: fees 1,756/2,427 (72%), rewards 1,775/3,030 (59%), benefits 1,932/3,215 (60%), eligibility 738/803 (92%); stamp mismatches zero. These are traceability/structural measures, not a factual-accuracy score. Next oldest-cohort item is Kotak Solitaire; 20 active/invite-only cards remain last verified 2026-07-05.


## Latest record-level review: Kotak Solitaire (27 Oct 2026)

Compared Kotak's current card/rewards/fees pages, June 2026 Solitaire KFS, current retail MITC, detailed April terms, reward MCC schedule, lounge lists and current hotel/District privileges. Corrected conditional annual fee, APR, reward earn and cap, redemption/partner ratios, guest lounge quota and fuel waiver; removed unsupported network tier/launch date, golf and speculative partner valuations. KFS and product-page annual-fee formatting differs; the card page also states both 3 and 4 maximum add-on cards. Detailed T&Cs were browser-readable but direct download returned 403. See `docs/sources/kotak/solitaire/issuer-extract-2026-10-27.md`.

After review: 370 cards, 890 reward rules, 798 active/invite-only strict-scope rules, 777/798 strict-ready (97%); validator zero errors/warnings. Numeric evidence paths: fees 1,763/2,428 (73%), rewards 1,787/3,035 (59%), benefits 1,938/3,215 (60%), eligibility 738/803 (92%); stamp mismatches zero. These are structural/traceability measures, not a factual-accuracy percentage. Next oldest-cohort item is Kotak Zen Signature; 19 active/invite-only cards remain last verified 2026-07-05.


## Latest record-level review: Kotak Zen Signature (27 Oct 2026)

Compared Kotak's current card, fees, rewards redemption, milestone and eligibility pages, card-specific KFSZS12032026 and consolidated MITC. Corrected fees/APR/cash advance, redemption values, lounge quotas/spend gate, fuel waiver, milestone values and published eligibility; removed unsupported launch date and Visa tier. Exact launch date/network tier and some eligibility/lounge details are not published. Claim-level source comparison: `docs/sources/kotak/zen-signature/issuer-extract-2026-10-27.md`.

After review: 370 cards, 890 reward rules, 798 active/invite-only strict-scope rules, 777/798 strict-ready (97%); validator zero errors/warnings. Numeric evidence paths: fees 1,770/2,428 (73%), rewards 1,796/3,037 (59%), benefits 1,948/3,218 (61%), eligibility 740/805 (92%); stamp mismatches zero. These figures are structural/traceability measures, not an accuracy percentage. The oldest active/invite-only cohort contains 21 records verified 2026-07-05; next by path is KVB Honour (`data/cards/kvb/honour.yaml`). Dataset-wide factual accuracy remains unmeasured.


## Latest record-level review: KVB Honour Credit Card (27 Oct 2026)

Compared KVB's current Honour page, retail MITC v2.0 dated 04-Mar-2025, reward-redemption page and 29-May-2026 portfolio release. Corrected fee/waiver, APR/cash advance, rewards and redemption conditions, fuel surcharge waiver and lounge description; cleared unsupported launch date and point-to-rupee values. Travel multiplier calculation and lounge cadence remain unpublished. Field-level evidence: `docs/sources/kvb/honour/issuer-extract-2026-10-27.md`.

After review: 370 cards, 891 reward rules, 799 strict-scope rules, 778/799 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,777/2,428 (73%); rewards 1,801/3,038 (59%); benefits 1,952/3,215 (61%); eligibility 740/805 (92%). Stamp mismatches: zero. Traceability is not an accuracy percentage. Next oldest-cohort record is OneCard Metal; 20 active/invite-only records remain last verified 2026-07-05.


## Latest record-level review: OneCard Metal (27 Oct 2026)

Reviewed OneCard's current FAQ and fee pages plus BOBCARD, CSB, Federal and South Indian Bank OneCard terms. Corrected unsupported single-network/tier and launch date, reward conversion values, category assumptions and lounge benefit; refreshed fees, top-category rewards and fuel waiver. This is a multi-issuer, multi-network product, and issuer terms remain variant-dependent. SBM and Indian Bank terms were not reviewed. Details: `docs/sources/onecard/metal/issuer-extract-2026-10-27.md`.

After review: 370 cards, 891 reward rules, 799 strict-scope rules, 778/799 strict-ready (97%); zero validator errors/warnings. Numeric evidence paths: fees 1,780/2,425 (73%), rewards 1,804/3,033 (59%), benefits 1,954/3,211 (61%), eligibility 740/805 (92%); stamp mismatches zero. Traceability coverage is not an accuracy percentage. The oldest cohort has 19 active/invite-only records last verified 2026-07-05; next is RBL Icon (`data/cards/rbl/icon.yaml`). Dataset-wide factual accuracy remains unmeasured.

## Latest record-level review: RBL Icon (27 Oct 2026)

Compared RBL's current Icon product page, 04-Aug-2026 card-specific terms, current MITC/KFS, Schedule of Charges and network availability guide. Updated fee terms, dual Visa/Mastercard variants, 2 points/INR100 base, international and weekend-dining earn/caps, exclusions and point-posting terms. Replaced the stale milestone with 10k/15k/20k points at INR3L/INR5L/INR8L membership-year spend; corrected welcome, domestic lounge gate, chargeable international lounge visits, Mastercard-only golf, BookMyShow and fuel waiver. Removed unsupported launch date, single network/tier and fixed point conversion. Current issuer material does not establish card-specific numeric eligibility thresholds. Network, international-lounge pricing and missing fixed conversion are recorded with schema/source limitations in `docs/sources/rbl/icon/issuer-extract-2026-10-27.md`.

Validation after review: 370 cards, 892 reward rules, 800 strict scope, 781/800 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,784/2,425 (74%), rewards 1,812/3,033 (60%), benefits 1,974/3,217 (61%), eligibility 740/805 (92%). Stamp mismatches: zero. These measures do not imply factual accuracy for unreviewed cards. Next oldest cohort item: RBL Insignia; 18 records remain last verified 2026-07-05.

## Latest record-level review: RBL Insignia Preferred Banking (27 Oct 2026)

Compared current RBL product, card terms, KFS/MITC/schedule, network guide, rewards program, miles-transfer terms and milestone guide. Updated fee terms and customer segment exception; reward earning and transfer; welcome; lounge quotas and spend-triggered lounge vouchers; milestone voucher; Mastercard-only golf; BookMyShow; fuel surcharge reversal; point expiry and redemption-fee exemptions. Cleared unsupported launch date, fixed rupee point value and numeric insurance coverage. Documented dual-network/scalar-schema and other unresolved terms in `docs/sources/rbl/insignia/issuer-extract-2026-10-27.md`.

After review: 370 cards, 892 reward rules, 800 strict scope, 783/800 strict-ready (98%), zero validator errors/warnings; evidence paths fees 1,789/2,425 (74%), rewards 1,816/3,030 (60%), benefits 1,990/3,226 (62%), eligibility 740/805 (92%); stamp mismatches zero. Traceability is not an accuracy rate. Next oldest-cohort item: RBL IRCTC; 17 records remain dated 2026-07-05.

## Latest record-level review: RBL IRCTC (27 Oct 2026)

Compared current RBL card page, T&Cs and FAQ, central MITC/Schedule of Charges, network guide and lounge terms. Corrected Mastercard/RuPay network variants, fees, welcome, rewards/caps/exclusions, IRCTC rail redemption value, milestone, railway lounge access, train-cancellation shield, transaction-charge reversal and published age eligibility. Removed unsupported fuel waiver. Threshold wording and PDF/network variant ambiguity are documented at `docs/sources/rbl/irctc/issuer-extract-2026-10-27.md`.

After review: 370 cards, 893 reward rules, 801 strict scope, 784/801 strict-ready (98%), zero validator errors/warnings; numeric evidence paths fees 1,793/2,425 (74%), rewards 1,830/3,032 (60%), benefits 1,999/3,229 (62%), eligibility 740/807 (92%); stamp mismatches zero. These measures indicate traceability, not an accuracy rate. Next oldest-cohort item: RBL Play; 16 records remain last verified 2026-07-05.

## Latest record-level review: RBL Play (27 Oct 2026)

Compared current Play product page/T&Cs, BookMyShow guide, MITC/schedule, network guide and RuPay/NCMC FAQ. Removed unsupported points earning and lounge quota; corrected dual network variants, current BookMyShow welcome/monthly/F&B discounts, fuel waiver and annual fee waiver. RuPay-only features appear in the terms but not network guide; documented the current issuer conflict. Null reward earn values are used because no current point scheme is stated, while schema requires a reward record. Evidence and open issues: `docs/sources/rbl/play/issuer-extract-2026-10-27.md`.

After review: 370 cards, 892 reward rules, 800 strict scope, 783/800 strict-ready (98%), zero validator errors/warnings; numeric evidence paths fees 1,798/2,425 (74%), rewards 1,830/3,024 (61%), benefits 2,008/3,230 (62%), eligibility 740/807 (92%); stamp mismatches zero. Next oldest-cohort item: RBL Shoprite; 15 records remain last verified 2026-07-05.


## Latest record-level review: RBL ShopRite (27 Oct 2026)

Compared RBL's current ShopRite card page, card-specific T&Cs, MITC, Schedule of Charges, network availability guide and Rewards program terms. Corrected fees/waiver, reward rates and grocery cap, point value and exclusions, welcome points, BookMyShow discount and fuel waiver. Cleared unsupported network/tier and launch date. Issuer conflicts remain on reward posting (45 vs 60 days), the monthly cap cycle, and RuPay availability. Card-specific numeric eligibility and lounge entitlement were not found. Detailed claim-level source comparison: `docs/sources/rbl/shoprite/issuer-extract-2026-10-27.md`.

After review: 370 cards, 892 reward rules, 800 strict-scope, 783/800 strict-ready (97%), zero validator errors/warnings. Numeric evidence paths: fees 1,803/2,425 (74%), rewards 1,835/3,021 (61%), benefits 2,014/3,233 (62%), eligibility 740/807 (92%); stamp mismatches zero. These are structural and traceability measures, not a database-wide accuracy percentage. Fourteen active/invite-only records remain in the 2026-07-05 cohort.


## Latest record-level review: RBL ShopRite (27 Oct 2026)

Compared RBL's current ShopRite card page, card-specific T&Cs, MITC, Schedule of Charges, network availability guide and Rewards program terms. Corrected fees/waiver, reward rates and grocery cap, point value and exclusions, welcome points, BookMyShow discount and fuel waiver. Cleared unsupported network/tier and launch date. Issuer conflicts remain on reward posting (45 vs 60 days), the monthly cap cycle, and RuPay availability. Card-specific numeric eligibility and lounge entitlement were not found. Detailed claim-level source comparison: `docs/sources/rbl/shoprite/issuer-extract-2026-10-27.md`.

After review: 370 cards, 892 reward rules, 800 strict-scope, 783/800 strict-ready (97%), zero validator errors/warnings. Numeric evidence paths: fees 1,803/2,425 (74%), rewards 1,835/3,021 (61%), benefits 2,014/3,233 (62%), eligibility 740/807 (92%); stamp mismatches zero. These are structural and traceability measures, not a database-wide accuracy percentage. Fourteen active/invite-only records remain in the 2026-07-05 cohort.


## Latest record-level review: Axis Burgundy Private ? The One Card (27 Oct 2026)

Compared the current product/eligibility pages, MITC/KFS, August 2026 card update, current reward and Travel EDGE transfer terms, lounge access, BookMyShow/golf, insurance and membership documents. Cleared unsupported Visa Infinite tier and launch date; corrected the fee snapshot and added current rewards, transfer ratios, lounges, golf, movie, fuel, dining, memberships, airport assistance and FY2026-27 insurance. Unresolved issuer differences include the current joining fee (MITC vs notice/KFS), fuel-waiver cycle, lounge quotas, and The One Metal vs The One Card transfer-table label. Detailed source comparison: `docs/sources/axis/burgundy-private/issuer-extract-2026-10-27.md`.

After review: 370 cards, 892 reward rules, 800 strict-scope, 783/800 strict-ready (97%), zero validator errors/warnings. Numeric evidence coverage: fees 1,809/2,425 (75%), rewards 1,837/3,017 (61%), benefits 2,023/3,238 (62%), eligibility 740/807 (92%); source-date mismatches zero. Fourteen active/invite-only records remain in the oldest 2026-07-05 cohort; next by path is RBL World Safari.


## Latest record-level review: RBL World Safari (27 Oct 2026)

Compared current RBL product page, card terms, network guide, MITC and Schedule of Charges. Corrected network variants, fee snapshot, base/travel rewards and exclusions, welcome conditions, milestone ladder, lounge conditions, fuel waiver, insurance limits and concierge/golf fields. The product page conflicts with card-specific terms on rewards for international travel spend; see `docs/sources/rbl/world-safari/issuer-extract-2026-10-27.md`.

After RBL World Safari: 370 cards, 893 reward rules, 801 strict-scope, 785/801 strict-ready (98%), zero validator errors/warnings. Numeric evidence paths: fees 1,813/2,424 (75%), rewards 1,841/3,015 (61%), benefits 2,039/3,240 (63%), eligibility 740/807 (92%); stamp mismatches zero. This is traceability, not database-wide factual accuracy. Thirteen records remained in the oldest cohort; next was South Indian Bank Platinum.


## Latest record-level review: South Indian Bank SBI Platinum (27 Oct 2026)

Current SBI Card MITC confirms INR2,999 joining and renewal fees with no waiver. The live product page exposes no card-specific current benefit terms. Removed unsupported launch date, APR and fixed point values; corrected lounge/golf free quota assumptions; marked undated brochure-only reward and benefits as historical/unconfirmed. Details: `docs/sources/south-indian/sib-platinum/issuer-extract-2026-10-27.md`.

Validation after South Indian Bank SBI Platinum: 370 cards, 893 reward rules, 801 strict scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric paths: fees 1,815/2,423 (75%); rewards 1,841/3,012 (61%); benefits 2,039/3,240 (63%); eligibility 740/807 (92%); stamp mismatches zero. This is not an accuracy percentage. Twelve oldest-cohort records remained; next was Standard Chartered DigiSmart.


## Latest record-level review: Standard Chartered DigiSmart (27 Oct 2026)

Compared current DigiSmart product page, card-specific terms and tariff schedule. Corrected monthly fee/reversal, cash advance fee, no spend-earned points, Zomato/Blinkit/INOX/Yatra/Ola benefits, Visa network/tier and published age/income eligibility. Schema limitations detailed in `docs/sources/standard-chartered/digismart/issuer-extract-2026-10-27.md`.

After review: 370 cards, 893 reward rules, 801 strict scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,819/2,421 (75%); rewards 1,842/3,009 (61%); benefits 2,042/3,238 (63%); eligibility 740/811 (91%); stamp mismatches zero. These are structure/traceability measures, not factual accuracy. Eleven oldest-cohort records remain; next is Standard Chartered EaseMyTrip.


## Latest record-level review: Standard Chartered EaseMyTrip (27 Oct 2026)

Compared the current product page, EaseMyTrip card-specific terms, Most Important Document and tariff schedule. Corrected base and accelerated earn, redemption value, merchant discounts/caps, domestic lounge quota, cash advance fee and published eligibility; cleared unsupported tier, launch date and fuel waiver. Evidence comparison: `docs/sources/standard-chartered/easemytrip/issuer-extract-2026-10-27.md`.

After review: 370 cards, 893 reward rules, 801 strict scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,826/2,421 (75%), rewards 1,847/3,009 (61%), benefits 2,043/3,235 (63%), eligibility 742/813 (91%); timestamp mismatches zero. Traceability is not factual accuracy. Ten oldest-cohort records remain; next is Standard Chartered Manhattan.


## Latest record-level review: Standard Chartered Manhattan (27 Oct 2026)

Compared current product page, tariff schedule and product-page-linked T&C PDF. The linked PDF is for another SC rewards card and conflicts with Manhattan details, so it was not used to fill card-specific terms. Updated current fee/cash-advance, point, joining-reward and eligibility terms; cleared unsupported network tier, launch date and fuel waiver. Cashback cap INR500/month is inferred from the issuer value chart and is marked medium confidence. Evidence: `docs/sources/standard-chartered/manhattan/issuer-extract-2026-10-27.md`.

After review: 370 cards, 893 reward rules, 801 strict scope, 785/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,833/2,421 (76%), rewards 1,851/3,009 (62%), benefits 2,043/3,232 (63%), eligibility 744/815 (91%); stamp mismatches zero. These are traceability measures, not factual accuracy. Nine oldest-cohort records remain; next is Standard Chartered Platinum Rewards.


## Latest record-level review: YES Uni RuPay (27 Oct 2026)

Compared the current YES BANK catalogue, UNI/UNI RuPay Key Fact Statement, consolidated MITC and virtual RuPay listing. Corrected fees, cash-advance exemption and fuel surcharge waiver; cleared unsupported network tier, launch date, residency and application URL. The current catalogue confirms headline 1% Uni Coin cashback, but the accessible card-specific terms do not establish coin denomination/redemption or detailed exclusions. Fuel waiver: 1% up to INR7,500 per transaction, capped at INR500 per statement cycle; fuel surcharge taxes remain payable. Evidence and limitations: `docs/sources/yes/uni-rupay/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules, 801 strict-scope, 791/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,864/2,411 (77%); rewards 1,870/2,999 (62%); benefits 2,061/3,224 (64%); eligibility 748/819 (91%). Stamp mismatches: zero. These measures are not a database-wide factual-accuracy score. Two oldest-cohort records remain; next by path is YES Private.


## Latest record-level review: YES Private (27 Oct 2026)

Compared the current YES Private page/catalogue, Key Fact Statement, consolidated MITC, Private Usage Guide and Purchase Protection FAQ. Corrected finance charge, cash-advance fee, foreign-exchange markup, annual-fee waiver, reward earn, lounge guest allowance and fuel waiver; removed unsupported tier/date/residency/apply URL; added purchase protection. The current product page/catalogue conflict with the older Usage Guide on earn rates and welcome points; current statements are retained with medium confidence and the conflict documented. Evidence: `docs/sources/yes/private/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules, 801 strict-scope, 793/801 strict-ready (99%), zero errors/warnings; numeric evidence paths: fees 1,869/2,410 (78%), rewards 1,875/2,998 (63%), benefits 2,064/3,224 (64%), eligibility 748/819 (91%); stamp mismatches zero. These metrics do not estimate factual accuracy across unreviewed records. One oldest-cohort record remains: YES Uni.


## Latest record-level review: YES Uni (27 Oct 2026)

Compared YES BANK's current catalogue, UNI Key Fact Statement and co-brand MITC. Corrected renewal fee/waiver, APR, forex, cash-advance treatment and fuel surcharge waiver; cleared unsupported network, tier, launch date and residency. Current YES catalogue advertises 1% Uni Coin cashback, but the accessible YES terms do not establish coin issuance ratio, conversion value or redemption for this product; those numeric/redeeming fields remain unresolved. Evidence: `docs/sources/yes/uni/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules, 801 strict-scope, 793/801 strict-ready (99%), zero errors/warnings. Numeric evidence paths: fees 1,874/2,409 (78%); rewards 1,875/2,993 (63%); benefits 2,067/3,224 (64%); eligibility 748/819 (91%). Stamp mismatches: zero. These checks do not measure factual accuracy across unreviewed records. Earliest remaining cohort: 35 records last verified 2026-10-24; next by path is Axis Scapia.


## Latest record-level review: Axis Scapia (27 Oct 2026)

Compared current Axis Scapia product information with the co-brand partner's official coin and airport-privilege pages. Corrected reward coin math, Mastercard/RuPay variant rates and app earn, lounge spend threshold, fuel waiver, published applicant age/residency; cleared unsupported network tier/launch date. The record models the lower 5% RuPay rate because the schema lacks network variants; the Mastercard 10% rate is documented in the source extract. Evidence: `docs/sources/axis/scapia/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules, 801 strict-scope, 793/801 strict-ready (99%), zero errors/warnings. Numeric evidence paths: fees 1,880/2,409 (78%); rewards 1,880/2,993 (63%); benefits 2,070/3,221 (64%); eligibility 748/821 (91%). Stamp mismatches zero. These checks do not measure factual accuracy across unreviewed records. Oldest cohort: 34 records last verified 2026-10-24; next BOI RuPay Platinum.


## Latest record-level review: BOI RuPay Platinum (27 Oct 2026)

Compared BOI's current card page, 2025 KFS/MITC and Star Rewards schedule. Corrected annual fee, APR, reward earn, cash withdrawal schedule, concierge and eligibility; cleared unsupported waiver, launch date, credit-card lounge and fuel surcharge waiver. Current RuPay Platinum debit-card lounge information is excluded. Star Rewards preferred-category definition, points-to-INR value and purchase forex markup remain unresolved. Evidence: `docs/sources/boi/rupay-platinum/issuer-extract-2026-10-27.md`.

Post-review validation: 370 cards, 896 reward rules, 801 strict-scope, 793/801 strict-ready (99%), zero errors/warnings. Numeric evidence paths: fees 1,885/2,407 (78%); rewards 1,882/2,990 (63%); benefits 2,070/3,215 (64%); eligibility 748/822 (91%). Stamp mismatches: zero. These checks do not measure factual accuracy across unreviewed records. Oldest cohort 33 records last verified 2026-10-24; next is Canara Mastercard World.


## Latest field review (27 Oct 2026)

Equitas PowerMiles was updated from official Equitas search-index extracts: membership claims now reflect issuer fee/spend conditions, and insurer-listed cover limits and activation conditions were added. The direct product and PDF endpoints returned HTTP 503, so the full MITC, insurance policy wording, and current fee treatment remain unresolved. The source limitation is recorded at `docs/sources/equitas/powermiles-issuer-extract-2026-10-27.md`; this is a partial review, not a claim that the card is fully verified.

The validator remains at 370 cards, 896 reward rules, 793 strict-scope rules, and 785/793 strict-ready, with zero errors or warnings. Stamp audit reports zero mismatches. Numeric evidence-path coverage remains fees 1,930/2,385 (81%), rewards 1,901/2,941 (65%), benefits 2,108/3,171 (66%), and eligibility 758/832 (91%). These measures describe structure and traceability, not factual accuracy. The next oldest-cohort record is HDFC Biz Grow; 19 active/invite-only records remain dated 2026-10-24.


## Latest review (27 Oct 2026)

HDFC BizGrow and BizPower were checked against current issuer pages and reward notices. The reviews corrected accrual changes effective 15 May 2026, redemption values, reward caps/thresholds and benefit conditions. BizPower finance charge is 3.75% monthly. BizGrow fee-waiver wording differs between current page and FAQ at exactly INR 1 lakh; this remains documented. Equitas PowerMiles remains a partial review: direct Equitas PDF/page retrieval returned HTTP 503, and full membership/insurance terms still need checking.

Current validator: 370 cards, 900 reward rules, 793 strict-scope rules, 785/793 strict-ready (98%), zero errors/warnings. Stamp audit: zero mismatches. Numeric evidence-path coverage: fees 1,944/2,385 (82%), rewards 1,933/2,965 (65%), benefits 2,122/3,172 (67%), eligibility 764/838 (91%). These figures measure structural validity and traceability, not factual accuracy. Next oldest-cohort record: IDBI Euphoria World; 17 active/invite-only records remain dated 2026-10-24.



- Amex Platinum Charge: removed unsupported launch date; reconfirmed current fee/rewards/eligibility and documented application pause, November travel-booking disruption, and 15-Nov milestone posting change. Details: `docs/sources/amex/platinum-charge/issuer-extract-2026-10-27.md`.

- Amex SmartEarn: removed unsupported launch date, wallet-load and blanket EMI exclusions; confirmed card-specific 10X/5X merchant caps, Ã¢â€šÂ¹40,000 waiver threshold, welcome and voucher milestones; separated these from the generic Reward Multiplier program that ended 30-Sep-2026. Documented announced late-fee change and temporary pauses in `docs/sources/amex/smartearn/issuer-extract-2026-10-27.md`.


## Latest record-level review: AU Bank InstaPay (27 Oct 2026)

Compared AU InstaPay's current product page/FAQ and KFS v1.9. Confirmed RuPay, LTF, 1% cashback on selected UPI MCCs (minimum INR 200, INR 100 statement-cycle cap), fuel waiver, and eligibility restriction to selected AU cardholders. Retained the general KFS forex rate of 3.49% and monthly retail finance charge of 3.75%; cleared unsupported launch date, network tier, and residency claim. Exact MCCs and InstaPay cash-advance handling remain unresolved. Extract: docs/sources/au/instapay/issuer-extract-2026-10-27.md.




## Latest record-level review: ixigo AU (27 Oct 2026)

Compared the current product page/FAQ, KFS v1.9, MITC v2.22, revised lounge terms effective 13 Apr 2026, Priority Pass terms and 16 May 2026 member agreement. The active product page advertises a limited-period LTF offer while standard KFS/MITC list â‚¹999 annual fee and spend waivers; this is documented as a conflict. Cleared unsupported network/tier/launch date, corrected train earn effective date to 1 Apr 2025 and total reward cap to 10,000 points per statement cycle, and recorded exact spend-gated airport/lounge and eligibility terms. Exact base reward points remain unclear; train reward legacy PDF redirects and the schema cannot express calendar-quarter trigger directly. Extract: docs/sources/au/ixigo/issuer-extract-2026-10-27.md.



## Latest record-level review: AU KOSMO (27 Oct 2026)

Compared AU issuer product/KFS sources with the current Kiwi Rewards Policy and AU/ Kiwi launch announcement. Set launch date to 18 Sep 2025 and cleared unsupported RuPay tier. Added Kiwi-issued card rewards from current partner terms (0.5% online; 1.5% Kiwi-app Scan & Pay; â‚¹0.25/Kiwi; 500-Kiwi redemption floor; eligible MCC exclusions and dynamic monthly cap of 1% of credit limit), plus fuel, EMI/contactless details and published eligibility. POS/contactless rate and schema representation of dynamic cap/UPI channel remain limitations. Record comparison: docs/sources/au/kosmo/issuer-extract-2026-10-27.md.




## Latest record-level review: Axis Bank Cashback Credit Card (27 Oct 2026)

Compared the current product page, Cashback-specific Member Terms version d015df26_5, and the generic Axis revision effective 28 Aug 2026. Confirmed fees and fee waiver, cashback slabs/caps and reversal behavior, utility MCC treatment, welcome points, Dining Delights program name and eligibility. Cleared unsupported Visa/Signature and MCC 6513 claims; corrected stale source dates and removed an inaccurate claim that the schema cannot encode rising cashback slabs. Offline POS base cashback remains underrepresented in calculator results because transaction channel is not a model dimension; per-transaction rounding and reversal timing are also not modeled. Exact excluded-category MCCs, income/score cutoffs, a specific network variant and Cashback-specific dining discount remain unpublished/unverified. Full comparison: `docs/sources/axis/cashback/issuer-extract-2026-10-27.md`.

Post-review live snapshot: 370 cards; 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Evidence-path coverage above was rerun after this edit. These checks do not provide a factual-accuracy percentage.


## Latest record-level review: Fibe Axis Bank Credit Card (27 Oct 2026)

Compared the current card page, current cashback T&C, current domestic lounge program, generic card fee revision, Axis card-protection page and launch release. Added explicit channel/MCC restrictions to accelerated cashback, structured the INR 50,000 lounge spend gate, and recorded Dining Delights with an unknown fixed discount. Removed the unsupported rent MCC 6513 and Dreamfolks operator claims; confirmed RuPay, Platinum tier and 10 Oct 2023 launch. Remaining limits include cashback T&C effective date, offer-specific Wednesday/Dining conditions and threshold service fees absent from the typed card-fee model. Full comparison: `docs/sources/axis/fibe/issuer-extract-2026-10-27.md`.

Post-review live snapshot: 370 cards; 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence-path coverage above was rerun; figures are traceability measures, not factual accuracy. The 107-record oldest cohort now starts with Flipkart Axis Super Elite.

## Latest record-level review: Axis Bank Horizon (27 Oct 2026)

Compared the live product page, Horizon card-specific T&Cs effective 1 Sep 2026, revision notice, shared MITC and current Travel EDGE transfer terms. Cleared unsupported Visa-only network/tier and lounge-operator claims; recorded both Visa Signature and Mastercard World lounge variants (6 visits encoded as the common minimum; Visa gets 8); removed unsupported guests-per-visit count, fixed 1:1 transfer ratio and rent MCC exclusion; added telecom exclusion; downgraded illustrative INR 1/mile to an estimate. Burgundy relationship-based LTF eligibility, variant-specific lounge quota and dynamic partner transfers remain documented schema limits. Full field comparison: `docs/sources/axis/horizon/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards; 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,002/2,380 (84%), rewards 2,004/2,987 (67%), benefits 2,192/3,148 (70%), eligibility 784/865 (91%). Oldest cohort: 102 records dated 2026-10-25; next is IndiGo Axis Bank. These are validity and traceability measures, not factual accuracy.


## Recent record-level reviews (27 Oct 2026)

Compared the live product page, current base-card terms, co-brand launch release and current lounge-program terms. Recorded Visa/RuPay variant ambiguity, the Sep?Oct 2026 LTF activation voucher, 750-chip shared UPI cap, MCC/category earning rules, spend-gated lounge benefit and new-card spend-gate waiver. Cleared the unsupported rent MCC 6513 and rupee-valuations of 1,200-BluChip vouchers; the current BluChip program does not assign a fixed cash value. Full comparison: `docs/sources/axis/indigo/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards; 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp mismatches zero. Numeric evidence paths: fees 2,002/2,380 (84%), rewards 2,004/2,986 (67%), benefits 2,188/3,143 (70%), eligibility 784/865 (91%). Oldest cohort: 101 records dated 2026-10-25; next is Axis Bank Kwik. These are validity and traceability measures, not factual accuracy.


- **Axis Bank Kwik:** reconciled current product page, Oct 2026 KFS and Axis launch release; confirmed RuPay and launch date, removed unsupported Platinum network tier, refreshed current fees, reward exclusions/posting and fuel waiver. Unknown point value, MCC scope, age/income/score criteria and exactly-INR-500 late-fee boundary remain explicit. Details: `docs/sources/axis/kwik/issuer-extract-2026-10-27.md`.

Latest snapshot after Kwik: validator passed (370 cards; zero errors/warnings); source-stamp audit found zero mismatches. Numeric evidence-path coverage remains fees 2,002/2,380 (84%), rewards 2,004/2,986 (67%), benefits 2,188/3,143 (70%), eligibility 784/865 (91%). Oldest active/invite-only cohort: 100 cards dated 2026-10-25; next is Axis Bank My Zone Easy. The factual-accuracy percentage remains unmeasured; coverage is traceability only.


- **Axis Bank My Zone Easy:** compared current card page, Oct 2026 KFS, current MITC and Axis comparison tile. Confirmed standard INR 500/INR 500 fees while recording the unexplained NIL tile conflict; recorded current DCC 3.5% vs stale 1.5% product table conflict, secured FD requirements, domestic points and movie/fuel terms. Cleared unsupported Visa-tier implication; left tier, launch date, residency and point value unknown where not established. Details and archived issuer documents: `docs/sources/axis/my-zone-easy/issuer-extract-2026-10-27.md`.

Latest snapshot after My Zone Easy: validator passed (370 cards; zero errors/warnings); source-stamp audit found zero mismatches. Numeric evidence-path coverage: fees 2,002/2,380 (84%), rewards 2,004/2,986 (67%), benefits 2,188/3,143 (70%), eligibility 785/866 (91%). Oldest active/invite-only cohort: 99 records dated 2026-10-25; next is Axis Bank MY ZONE. Factual-accuracy percentage remains unmeasured; evidence-path coverage is traceability only.


- **Axis Bank MY ZONE:** reconciled current My Zone issuer page, October KFS, current MITC, My Zone revision notice, domestic lounge schedule and network-choice announcement. Cleared unsupported Mastercard-only claim; refreshed current reward exclusions, fee schedule, 1/quarter lounge and 50k prior-three-month gate, milestone, SonyLIV, movie, Swiggy, Cleartrip, fuel and eligibility details. Details and archived issuer sources: `docs/sources/axis/my-zone/issuer-extract-2026-10-27.md`.

Latest snapshot after MY ZONE: validator passed (370 cards; zero errors/warnings); source-stamp audit found zero mismatches. Numeric evidence-path coverage: fees 2,005/2,380 (84%), rewards 2,004/2,986 (67%), benefits 2,191/3,146 (70%), eligibility 785/866 (91%). Oldest active/invite-only cohort: 98 records dated 2026-10-25; next is Axis Bank NEO. Overall factual-accuracy percentage remains unmeasured; evidence-path coverage is traceability only.


## Latest record-level review: Axis Bank Reserve (27 Oct 2026)

Compared the current Reserve issuer page, Reserve-specific 20-Jun-2025 rewards revision, 28-Aug-2026 terms update, current KFS/MITC, card terms, Priority Pass terms and golf terms. Corrected the international 2x cap representation and current reward exclusions; verified guest pools of 12/year for both lounge programs and 50 golf rounds/year. Added current lounge access method, posting schedule, EMI-points treatment, membership renewal consent date and currently expired benefits. The schema cannot represent credit-limit-based international spend caps or annual guest pools; numeric eligibility, BookMyShow quota and EazyDiner tenure remain unverified. Source comparison and archived issuer documents: `docs/sources/axis/reserve/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,005/2,379 (84%), rewards 2,004/2,986 (67%), benefits 2,195/3,148 (70%), eligibility 786/867 (91%). Oldest cohort: 92 records dated 2026-10-25; next is Axis Bank Select. These are validity/traceability measures, not a factual-accuracy percentage.

## Latest record-level review: BOBCARD Cashback (27 Oct 2026)

Compared the current BOBCARD Cashback page, April 2026 feature terms, January 2026 MITC and April 2026 tariff revision notice. Cleared the unsupported Mastercard tier; refreshed current fees/rewards and added statement reversal, forfeiture, smart EMI and add-on details. Documented that the issuer's 5%-up-to-INR-1,500 marketing line does not clarify whether INR 1,500 caps total or accelerated cashback; detailed terms specify an accelerated-cashback cap. The schema cannot represent the choice between INR 49 monthly and INR 499 annual fees or the new transaction-specific processing fees. Issuer-page income text is truncated, so income minima, score floor and exact launch date remain unknown. Field comparison: `docs/sources/bob/cashback/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,005/2,379 (84%), rewards 2,009/2,983 (67%), benefits 2,212/3,153 (70%), eligibility 790/868 (91%). Oldest cohort: 90 records dated 2026-10-25; next by path was BOBCARD Prime.

## Latest record-level review: BOBCARD Prime (27 Oct 2026)

Compared the current Prime issuer page, April 2026 feature terms, issuer FAQ, Jan 2026 MITC, current application criteria, issuer network/insurance schedule and July 2026 revision. Added the currently advertised Smart EMI benefit and documented sub-INR 100/UPI reward restrictions; confirmed the product-level Mastercard designation but left network tier null. Retained the current product page's INR 30,000 FD amount while documenting an older issuer blog's INR 15,000 figure. Marked Prime accidental-death cover discontinued effective 25-Aug-2026, and recorded that April tariff transaction fees cannot be expressed in the schema. Income minima, score floor, exact reward start date and launch date remain unknown. Field comparison: `docs/sources/bob/prime/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,005/2,379 (84%), rewards 2,009/2,983 (67%), benefits 2,212/3,153 (70%), eligibility 790/868 (91%). Oldest cohort: 89 records dated 2026-10-25; next by path is Snapdeal BOBCARD. These measures are validity/traceability, not a factual-accuracy percentage.

- **Snapdeal BOBCARD:** verified current fees, reward earn rates and caps, UPI treatment, fuel waiver, welcome offer, redemption, eligibility and RuPay co-branding. Removed unsupported RuPay tier and unsupported EMI reward exclusion; added transaction fee caveat and Smart EMI. Snapdeal-specific 20 points/₹100 versus the general capped online bucket remains an issuer-documentation ambiguity. Field comparison: docs/sources/bob/snapdeal/issuer-extract-2026-10-27.md.



## Latest record-level review: Federal Bank Celesta (27 Oct 2026)

Follow-up checked Federal Bank's dedicated 10-Jan-2026 APR revision page. It supplies all four APR rates previously missing from the MITC rendering. Celesta now records 3.75%, 2.69%, 1.99% and 0.69% monthly across the published AMB bands; one FAQ example assigns 0.69% at exactly INR 10 lakh despite the table placing that boundary in the 1.99% band. The record follows the rate schedule and documents the boundary conflict. Field comparison: `docs/sources/federal/celesta/issuer-extract-2026-10-27.md`.


## Latest record-level review: Federal Bank Imperio (27 Oct 2026)

Compared current Imperio product page, MITC, APR revision schedule, Amazon and BigBasket voucher terms, lounge rules, Visa tier offer and Federal Bank FAQ. Filled all four AMB-linked APR tiers, corrected band maximum to INR 10 lakh and changed the Visa network tier from Signature to Platinum. Corrected BigBasket voucher limit to once per financial year and residency to resident or NRI; schema cannot encode that annual award cap on a quarterly threshold. Age, income, bureau cutoffs and voucher face value remain unpublished. Field comparison: `docs/sources/federal/imperio/issuer-extract-2026-10-27.md`.

Current snapshot after Imperio: 370 cards, 916 reward rules; 809 strict-scope, 801/809 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,014/2,387 (84%), rewards 2,009/2,983 (67%), benefits 2,212/3,153 (70%), eligibility 790/868 (91%). Oldest cohort: 86 active/invite-only cards dated 2026-10-25; next is Federal Bank RuPay Signet. The factual-accuracy percentage remains unmeasured; coverage is traceability only.


## Latest record-level review: HDFC Diners Club Black Metal Edition (27 Oct 2026)

Compared HDFC's current product, fee and eligibility pages, MITC v4.15, 1-Jun-2026 card terms, lounge/golf terms and the current insurance policy (23-Jul-2026 to 22-Jul-2027). Cleared the unsupported exact launch date; updated current weekend dining and the 5,000-point monthly insurance cap/MCCs; replaced the expired insurance schedule and added credit shield, personal-document loss and hijacking covers. Preserved current 75,000-point statement ceiling and confirmed the MITC says fuel surcharge waiver is not applicable. The legacy 2014 fee/reward effective dates and partner transfer ratios remain unverified and are explicitly documented. Details: `docs/sources/hdfc/diners-black/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,011/2,986 (67%), benefits 2,220/3,159 (70%), eligibility 790/868 (91%). Oldest cohort: 82 records dated 2026-10-25; next is HDFC Diners Club Privilege. Numeric evidence-path coverage remains a traceability measure, not a factual-accuracy percentage.


## Latest record-level review: IRCTC HDFC Bank Credit Card (27 Oct 2026)

Compared the live HDFC product, fee, eligibility and redemption pages with the linked card terms, MITC v4.15, October 2025 product terms and HDFC's dated launch release. Corrected the launch date to 1-Mar-2023, cleared the unsupported RuPay Select tier, corrected the milestone timing to calendar-quarter periods effective 1-Jan-2026, and removed the blanket insurance/EMI exclusions because insurance earns under caps and merchant EMI principal earns. Kept issuer conflicts visible: salary INR 12,000/month on the card page versus gross income > INR 25,000 on the dedicated eligibility page; monthly vs daily insurance points cap; expiry from last eligible transaction vs two years from earning; welcome voucher cohort; and INR 100 vs INR 199 card reissue charge. Detailed field comparison: `docs/sources/hdfc/irctc-hdfc/issuer-extract-2026-10-27.md`.

Post-review queue: 77 records dated 2026-10-25; next Marriott Bonvoy HDFC Bank Credit Card. Validator: zero errors/warnings; source-stamp audit: zero mismatches. Numeric evidence-path coverage remains fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,230/3,169 (70%), eligibility 791/869 (91%). These figures describe traceability only, not factual accuracy.


## Latest record-level review: Marriott Bonvoy HDFC Bank Credit Card (27 Oct 2026)

Compared current HDFC product, fee and eligibility pages with the 19-Oct-2026 card terms, lounge/golf terms, current insurance cover summary, co-branded MITC and Diners Club launch announcement. Corrected launch date to 24-Aug-2023 and cleared unsupported Diners Club Privilege network tier. Refreshed reward, welcome, anniversary and benefit terms, and clarified EMI down-payment earning. Corrected the stale insurance expiry: the live issuer summary states validity through 22-Jul-2027; current cover amounts and primary-only, activation and travel requirements are captured in structured fields. The full card-specific policy limitations remain outside the accessible summary. FNA INR values are model estimates from the separate Marriott point valuation, not guaranteed rupee amounts. Detailed comparison: `docs/sources/hdfc/marriott-bonvoy/issuer-extract-2026-10-27.md`.

Post-review queue: 76 records dated 2026-10-25; next HDFC Bank Millennia Credit Card. Validator: zero errors/warnings; source-stamp audit: zero mismatches. Numeric evidence-path coverage: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,233/3,176 (70%), eligibility 791/869 (91%). These figures measure traceability only, not factual accuracy.


## Latest record-level review: HDFC Bank Millennia Credit Card (27 Oct 2026)

Compared current HDFC product, fee and eligibility pages with the linked card terms (cover dated 20-Jul-2026; detailed terms pages retain Apr-2025 publication footers), current personal MITC, FAQ, lounge/milestone terms and HDFC launch release. Corrected launch date to 22-Aug-2019, cleared unsupported Platinum network tier, removed the over-cap base-earn assertion and MCC 6540 blanket exclusion, and removed an unsupported 90-day welcome window. Confirmed current 5% partner and 1% base cashback caps, rates, exclusions, redemption terms, quarterly milestone and HOI lounge-voucher choice, welcome CashPoints and fuel waiver. Preserved internal conflicts for gift/prepaid/voucher earning and MCC 6540, lack of stated fallback above the partner cap, 3.6% card-page vs 3.75% shared-MITC finance rate, and product-vs-eligibility-page criteria. Details: `docs/sources/hdfc/millennia/issuer-extract-2026-10-27.md`.

Post-review queue: 75 records dated 2026-10-25; next HDFC Bank MoneyBack+ Credit Card. Validator passed for 370 cards/917 reward rules with zero errors/warnings; source-stamp audit found zero mismatches. Numeric evidence-path coverage: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,233/3,175 (70%), eligibility 791/869 (91%). These figures describe traceability only. Database-wide factual accuracy remains unmeasured.


## Latest record-level review: HDFC Bank MoneyBack+ Credit Card (27 Oct 2026)

Compared current card, fee and eligibility pages with the linked 15-May-2026 card terms, HDFC personal MITC, current FAQ, May-2026 charges notice, and Sep-2021 relaunch release. Cleared unsupported launch date and network/tier; retained null because 2021 source is a relaunch and current sources do not establish one network variant. Corrected the monthly statement-cashback redemption cap to 50,000 points according to the latest linked terms; current product page still says 3,000. Documented the salaried net-vs-gross eligibility wording conflict and the fee FAQ's 3.6% monthly rate versus 3.75% personal MITC. Confirmed 20/INR 200 partner earn at five merchants, 2/INR 200 base earning, merchant cap, points limits/redemption, fee waiver, quarterly voucher, welcome/renewal points and fuel waiver. Record comparison: `docs/sources/hdfc/moneyback-plus/issuer-extract-2026-10-27.md`.

At the MoneyBack+ review, the queue had 74 records dated 2026-10-25; next was HDFC Bank PIXEL Go Credit Card. Full validator: zero errors/warnings; source-stamp audit: zero mismatches. Numeric evidence-path coverage: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,233/3,175 (70%), eligibility 791/869 (91%). These are traceability figures, not a factual-accuracy score; database-wide accuracy remains unmeasured.


## Latest record-level review: HDFC Bank PIXEL Go Credit Card (27 Oct 2026)

Compared the current HDFC product, fee and eligibility pages with the October-2026 PIXEL MITC, PIXEL Go-specific terms, FAQ and HDFC's dated 14-May-2024 PIXEL launch release. Corrected the launch date and cleared the unsupported single RuPay/Platinum designation because standard issuance is both RuPay and Visa with cardholder network selection. Modeled the current MITC's INR 15,000/month cap on the feature called 1% unlimited despite the live page and older product terms saying unlimited; documented that conflict. Preserved the insurance cap discrepancy, Dineout savings/validity discrepancy and self-employed age discrepancy; cleared residency because Indian applicant status does not establish a residence requirement. Details: `docs/sources/hdfc/pixel-go/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; source-stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,233/3,175 (70%), eligibility 791/869 (91%). Oldest cohort: 73 records dated 2026-10-25; next HDFC Bank Pixel Play Credit Card. Evidence-path figures measure traceability, not factual accuracy.



## Latest record-level review: HDFC Bank PIXEL Play Credit Card (27 Oct 2026)

Compared the current HDFC PIXEL Play product and fees pages, October-2026 pricing MID, 30-Jul-2026 specific terms, current PIXEL MITC updated 15-Oct-2026 and dated 14-May-2024 PIXEL range launch release. Corrected the launch-date proxy, cleared unsupported single RuPay/Select designation because standard issuance is both RuPay and Visa, cleared residency, and modeled distinct salaried/self-employed age ranges. Corrected the 5% pack and 3% ecommerce over-cap treatment to no CashPoints (the prior record incorrectly said these fell back to 1%); confirmed the current 15,000/month base cap. Documented HDFC's lifetime-free offer through 31-Oct-2026 separately from its standard INR 500 fee and the stale expired Dineout terms versus current page offer. Details: `docs/sources/hdfc/pixel-play/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; source-stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,234/3,176 (70%), eligibility 795/873 (91%). Oldest cohort: 72 records dated 2026-10-25; next HDFC Bank Regalia Gold. Evidence-path figures measure traceability, not factual accuracy.


## Latest record-level review: HDFC Bank Regalia Gold Credit Card (27 Oct 2026)

Compared current HDFC product, fee and eligibility pages with the current reward/milestone terms, travel/lounges terms, personal MITC v4.15, co-branded MITC v3.9 and HDFC's dated 23-Mar-2023 launch announcement. Cleared Visa Signature network/tier because card-specific terms recognize Mastercard/Visa franchise conversion and do not establish a single network/tier for new approvals; cleared residency because Indian nationality is not a residence requirement. Added employment-specific age ranges, no-free-guest lounge limits, Boarding Edge's primary-cardholder-only condition, and current up-to-10% Swiggy Dineout benefit. Preserved disagreements over 0.15/0.20 statement cashback, 150/200 minimum transaction, 100/199 reissue fee, 5L/7.5L annual milestone, salaried net/gross threshold and stale lounge/fuel wording. Detailed comparison: `docs/sources/hdfc/regalia-gold/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; source-stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,021/2,996 (67%), benefits 2,237/3,179 (70%), eligibility 799/877 (91%). Oldest cohort: 71 records dated 2026-10-25; next HDFC Bank Regalia. Evidence-path figures measure traceability, not factual accuracy.


## Latest record-level review: HDFC Bank Regalia Credit Card (27 Oct 2026)

Compared HDFC's current product/fees pages, linked card and reward terms, May-2026 change notice, Personal MITC v4.15, legacy eligibility page and dated 2-Aug-2011 launch release. Corrected the launch date, cleared unsupported single-network/tier and residency, removed the unsupported SmartBuy accrual cap and erroneous insurance reward exclusion, and retained insurance earning under its 2,000 RP/month cap. HDFC says sourcing is discontinued; existing cardholder records remain active because no cessation date is published and benefits continue. The linked HDFC ERGO policy expired 22-Jul-2026, so its cover amounts were removed pending current policy wording. Details: `docs/sources/hdfc/regalia/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; source-stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,021/2,995 (67%), benefits 2,234/3,176 (70%), eligibility 798/877 (91%). Oldest cohort: 70 records dated 2026-10-25; next Swiggy BLCK HDFC Bank Credit Card. Evidence-path figures measure traceability, not factual accuracy.


## Latest record-level review: Swiggy BLCK HDFC Bank Credit Card (27 Oct 2026)

Compared HDFC's live product/eligibility page, both 15-Oct-2026 linked BLCK terms, current Personal MITC v4.15, co-branded MITC v3.9, the Mastercard World golf program and Swiggy/HDFC's dated 12-Mar-2026 launch announcement. Added the launch date, confirmed Mastercard World, current cashback rates/caps and the 3-month activation/claim welcome terms; cleared resident-only eligibility because the issuer specifies nationality, not residence. Documented the gaming MCC 5816/7995 discrepancy, non-dated Cleartrip/Nykaa promotions and incomplete merchant-ID list. Details: `docs/sources/hdfc/swiggy-blck/issuer-extract-2026-10-27.md`.

Post-review snapshot: 370 cards, 917 reward rules; 810 strict-scope, 802/810 strict-ready (99%); validator zero errors/warnings; source-stamp audit zero mismatches. Numeric evidence paths: fees 2,026/2,399 (84%), rewards 2,021/2,995 (67%), benefits 2,234/3,176 (70%), eligibility 798/877 (91%). Oldest cohort: 69 records dated 2026-10-25; next Swiggy HDFC Bank Credit Card. Evidence-path figures measure traceability, not factual accuracy.


## Latest field review (27 Oct 2026)

Swiggy HDFC Bank Credit Card was compared with current HDFC product/fees/eligibility pages, 18-Sep-2026 product terms, current MITCs and the 26-Jul-2023 launch release. Corrections include launch date, cashback scope/settlement/currency, the ?3,500 statement cap, birthday and Swiggy One offers, and removal of unsupported resident-only eligibility. Open source conflicts: welcome activation 30 vs 37 days and DCC fee 3.5% vs 1.75%. Review details: `docs/sources/hdfc/swiggy-hdfc/issuer-extract-2026-10-27.md`. Validator and source-stamp audit pass; oldest review cohort is 68 records, next Tata Neu Infinity RuPay.


## Latest field review (27 Oct 2026)

Tata Neu Infinity HDFC Bank Credit Card (RuPay) was compared with HDFC current product/eligibility page, card terms updated 24-Oct-2026, NeuPass terms, current lounge list, linked insurance policy, Personal MITC v4.15 and launch release. The record now uses exact 24-Aug-2022 launch date; NeuCoins as points; correct Tata Pay monthly spend ceiling; explicit current age/income thresholds; and current lounge and insurance details. The additional variable NeuPass bonus is documented but not included in modeled earn; residency was cleared because nationality alone does not establish residence. Preserved future 25-Nov-2026 coin claim/expiry change and the linked insurance PDF's conflicting expiry text. Review detail: `docs/sources/hdfc/tata-neu-infinity/issuer-extract-2026-10-27.md`. Oldest cohort: 67 records, next Tata Neu Infinity HDFC Visa variant.

- **IDFC FIRST Ashva:** corrected launch and network tier, spend-tiered rewards, eligibility age, current fees and benefits. Archived 13 PDFs and two page captures; documented conflicts for the overseas ATM fee, app travel bonus, international threshold, and shared golf entitlement. Updated the schema to allow unknown round/lesson split. Validator: zero errors/warnings; source-stamp mismatches: zero. Full decisions: `docs/sources/idfc-first/ashva/issuer-extract-2026-10-27.md`.

- **IDFC FIRST Classic:** reinstated international rewards using the revised 13-Sep-2026 issuer notice; removed the unsupported international-travel insurance entry; refreshed Classic fees, rewards, benefits and eligibility evidence. The revised notice supersedes a withdrawn 1-Sep proposal, though one page variant retains its stale footnote. Travel-booking bonus rates and the age FAQ remain conflicting. Validator errors/warnings: 0; source-stamp mismatches: 0. Details: `docs/sources/idfc-first/classic/issuer-extract-2026-10-27.md`.

## Latest record-level review: IDFC FIRST Diamond Reserve (27 Oct 2026)

Compared current Diamond Reserve product and general eligibility pages with the Jan-2026 launch release, June privileges, May communication, current MITC, Aug-2026 shared insurance schedule, international-rewards notices and zero-forex announcement. Corrected fee effective date to card launch, removed an unsupported residence claim, cited age 21 guidance, and added INR50,000 credit-shield cover. Used the later insurer schedule's INR5 lakh personal-accident amount over the launch release's INR10 lakh. Preserved the international-rewards and app travel-bonus conflicts. The issuer still advertises INR25,000 CFAR, but the linked policy ended 7-May-2026 and replacement coverage was not established, so active CFAR remains unconfirmed. Full comparison: `docs/sources/idfc-first/diamond-reserve/issuer-extract-2026-10-27.md`.

Current audits: validator zero errors/warnings; stamp mismatches zero. Numeric evidence coverage: fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,239/3,185 (70%), eligibility 812/891 (91%). Oldest review cohort: 63 records dated 2026-10-25; next IDFC FIRST Private. Checklist: 61/370 records completed. Numeric evidence-path coverage is traceability, not factual accuracy.

## Latest record-level review: IDFC FIRST Private (27 Oct 2026)

Checked the live FIRST Private page, 17-Jul-2026 consolidated terms and general insurance overview. Confirmed the new-issue fee cohort, 10/5/1 points per INR150, credit-limit reward cap, unlimited lounges, lifestyle offers and active CFAR through 7-May-2027. The separate linked one-page CFAR PDF is stale, ending 7-May-2025; the newer consolidated terms govern. Added the insurance overview's INR25 lakh personal-accident amount and documented its INR5 lakh lost-card figure against the card-specific page's INR50,000. Full comparison: `docs/sources/idfc-first/first-private/issuer-extract-2026-10-27.md`.

Current audits: validator zero errors/warnings; stamp mismatches zero. Numeric evidence coverage: fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,241/3,187 (70%), eligibility 812/891 (91%). Oldest review cohort: 62 records dated 2026-10-25; next IDFC FIRST Gaj. Checklist: 62/370 records completed. Numeric evidence-path coverage is traceability, not factual accuracy.

## Latest record-level review: IDFC FIRST Gaj (27 Oct 2026)

Compared the current Gaj page, launch release, linked privileges and rewards terms, May-2026 notice and current customer MITC. Corrected the golf entitlement from two rounds plus two lessons to an unknown split in a two-visit shared pool. Added the missed credit-shield cover and annual-fee payment points; corrected cancellation and baggage-delay classifications; removed unsupported resident-only eligibility; and recorded DCC as a separate merchant charge alongside zero bank forex. Full comparison: `docs/sources/idfc-first/gaj/issuer-extract-2026-10-27.md`.

Current audits: validator zero errors/warnings; stamp mismatches zero. Numeric evidence coverage: fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,241/3,187 (70%), eligibility 812/891 (91%). Oldest review cohort: 61 records dated 2026-10-25; next IDFC FIRST Hello Cashback. Checklist: 63/370 records completed. Numeric evidence-path coverage is traceability, not factual accuracy.

## Latest record-level review: IDFC FIRST Hello Cashback (27 Oct 2026)

Compared the live Hello Cashback product page and archived capture with card feature terms, product guide, current customer MITC and the bank-wide zero-forex notice. Confirmed cashback tiers/caps, annual fee reversal, fuel waiver, insurance and roadside benefits, fees, zero forex and FD-backed eligibility. Corrected the unsupported RuPay tier and single-held FD description after the issuer page confirmed additional FDs can be linked from INR5,000 to raise the limit. Documented the current-page FAQ conflict on the joining offer end date (30 vs 31 Oct); left card-specific APR and launch date unpublished. Full comparison: `docs/sources/idfc-first/hello-cashback/issuer-extract-2026-10-27.md`.

Current audits: `python scripts/validate.py` checked 370 cards and 920 reward rules with zero errors/warnings; stamp mismatches zero. Numeric evidence coverage remains fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,241/3,187 (70%), eligibility 812/891 (91%). Oldest review cohort: 60 records dated 2026-10-25; next IndiGo IDFC FIRST Dual. Checklist: 64/370 records completed. Numeric evidence-path coverage is traceability, not factual accuracy.

## Latest record-level review: IndiGo IDFC FIRST Dual (27 Oct 2026)

Compared the live product page and October offer terms with the launch release, May-2026 communication, current guide/privileges, MITC and zero-forex notice. Corrected checked-baggage delay and trip-cancellation classifications; followed the detailed golf FAQ's 12-round entitlement while documenting the conflicting guide/graphic figure of four; and added the EazyDiner Prime and Postcard Hotels one-time offers. Documented current issuer conflicts for the FD minimum (INR50,000 vs INR1 lakh), forex markup (0% vs stale 1.49% on the same page), and trip-cancellation policy end date. Full comparison: `docs/sources/idfc-first/indigo/issuer-extract-2026-10-27.md`.

Current audits: validator checked 370 cards and 920 reward rules with zero errors/warnings; source-stamp mismatches zero. Numeric evidence coverage: fees 2,032/2,399 (85%), rewards 2,023/3,003 (67%), benefits 2,246/3,187 (70%), eligibility 812/891 (91%). Oldest review cohort: 59 records dated 2026-10-25; next LIC IDFC FIRST Select. Checklist: 65/370 records completed. Numeric evidence-path coverage is traceability, not factual accuracy.


## Latest record-level review: IDFC FIRST Mayura Credit Card (27 Oct 2026)

Compared the current issuer page with May-2026 update, reward structure, launch release and zero-forex notice. Corrected network to Mastercard World and launch date to 19-Sep-2024; removed duplicate movie/trip-cancellation entries, corrected baggage-delay classification and cleared unsupported Visa Infinite and resident-only claims. Preserved the issuer conflict between 30X/15X travel bonus point claims and May-2026 20%/10% bonus wording, plus the cancellation period discrepancy. Field comparison: `docs/sources/idfc-first/mayura/issuer-extract-2026-10-27.md`.

Post-review audits: validator zero errors/warnings; source-stamp mismatches zero; numeric evidence paths fees 2,032/2,399 (85%), rewards 2,024/3,003 (67%), benefits 2,263/3,188 (71%), eligibility 812/891 (91%). Oldest cohort 57; next IDFC FIRST Millennia. Evidence-path figures are traceability only; no database-wide factual accuracy percentage is yet supported.


## Latest record-level review: IDFC FIRST Millennia Credit Card (27 Oct 2026)

Compared the current card page and 26-Oct reward change with May-2026 communication, current privileges, product guide, MITC, zero-forex notice and issuer eligibility pages. Confirmed two reward periods and the international-reward cutoff; reviewed fees/APR, UPI, redemption/travel bonuses, welcome offers, movies, fuel/rail benefits, insurance and eligibility. Cleared minimum age because issuer sources conflict between 18 and 21; documented resident vs NRI wording and retained Visa with network tier unknown. Field comparison: `docs/sources/idfc-first/millennia/issuer-extract-2026-10-27.md`.

Post-review audits: validator zero errors/warnings; source-stamp mismatches zero. Numeric evidence paths: fees 2,032/2,399 (85%), rewards 2,026/3,003 (67%), benefits 2,266/3,188 (71%), eligibility 811/890 (91%). Oldest cohort 56; next IDFC FIRST Power+. Evidence-path coverage is traceability, not factual accuracy; dataset-wide factual accuracy remains unmeasured.


## Latest record-level review: IDFC FIRST Power+ HPCL Credit Card (27 Oct 2026)

Compared the current card page with May-2026 communication, privileges, reward schedule, travel booking terms, HPCL welcome offer terms, MITC and zero-forex notice. Confirmed current fees, reward categories and statement caps, travel bonus, lounge/movie benefits, RSA, insurance and eligibility. Preserved the fuel-surcharge conflict between the card page and combined MITC row, and the 30-day vs 60-day HPCL welcome window; travel bonus percentages remain in notes because the schema cannot represent their points basis. Full field comparison: `docs/sources/idfc-first/power-plus/issuer-extract-2026-10-27.md`.

Post-review audits: validator zero errors/warnings; source-stamp mismatches zero; numeric evidence paths fees 2,032/2,399 (85%), rewards 2,027/3,003 (67%), benefits 2,269/3,188 (71%), eligibility 811/890 (91%). Oldest cohort 55; next IDFC FIRST Power. Evidence-path figures are traceability only and not an accuracy score.


## Latest record-level review: IDFC FIRST Power HPCL Credit Card (27 Oct 2026)

Compared the current product page with May-2026 Power communication, current privileges, reward schedule, Travel & Shop terms, HPCL welcome terms, current MITC and zero-forex notice. Confirmed fees, category rates/caps, travel bonus, HP Pay Happy Coins, welcome terms, insurance and eligibility; added current issuer-advertised merchant offers without assigning cash value. Preserved the 30/60-day welcome window, fuel surcharge conflict and occupation-specific age criteria. Full field comparison: `docs/sources/idfc-first/power/issuer-extract-2026-10-27.md`.

Post-review audits: validator zero errors/warnings; source-stamp mismatches zero; numeric evidence paths fees 2,032/2,399 (85%), rewards 2,028/3,003 (68%), benefits 2,271/3,188 (71%), eligibility 811/890 (91%). Oldest cohort 54; next Air India SBI Platinum. Evidence-path figures measure traceability, not factual accuracy.
