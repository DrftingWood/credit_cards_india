# CSB Bank Edge+ RuPay Credit Card — issuer evidence extract (27 Oct 2026)

Compared CSB Bank's current [card page](https://csb.bank.in/csb-bank-edge-credit-card), [MITC](https://www.csb.bank.in/pdf/edge-csb-bank-ruPay-credit-card-mitc_2025.pdf), [Key Fact Statement](https://csb.bank.in/pdf/key_fact_statement_edge_csb_bank_credit_card_2025.pdf), [card Terms and Conditions](https://csb.bank.in/pdf/edge_csb_bank_credit_card_terms_and_conditions_2025.pdf), Jupiter's current [Edge+ product page](https://jupiter.money/edge-plus-upi-rupay-credit-card/) and detailed [co-brand card terms](https://jupiter.money/edge-csb-terms-conditions/). The three issuer PDFs and retrieved co-brand terms page are archived in `docs/sources/csb/jupiter-edge/`.

## Fees and availability

The CSB MITC, updated 29 Aug 2026, lists Edge+ joining fee INR999, annual membership fee nil, forex markup 3.5% and monthly purchase finance charge 3.75% (45% annual). The associated KFS states revised charges apply from 6 Dec 2025. ATM cash advances are unavailable; the old 2.5%/INR500 cash-advance charge was removed. GST applies to fees, interest and surcharges.

Joining-fee marketing differs by channel: CSB's product page advertises INR499, while Jupiter advertises a limited-period INR0 joining offer with INR999 as its regular fee. The standard MITC charge is kept as INR999 and the promotional conflict is recorded in the YAML source note; eligibility for a campaign cannot be inferred from the generic record. The prior exact launch date (2023-06-01) was unsupported and cleared. The product remains listed with an active apply form.

## Rewards

The CSB-hosted MITC (updated 29 Aug 2026) says the schedule change is effective 5 Oct 2026 and lists no numeric Jupiter Flights cap. The current detailed co-brand terms say the revised schedule applies from 10 Oct and set the flight cap at 5,000 Jewels per statement cycle. The detailed terms state they prevail over inconsistent MITC terms, so the record follows that schedule and cap; the conflict is retained here for review.

The current co-brand terms state an updated Edge+ reward schedule applicable from 10 Oct 2026. Eligible "Others" spends earn 5 Jewels per INR100. Eligible shopping at Amazon, Flipkart, Myntra, Tata Cliq, Ajio, Nykaa, Croma, Reliance Digital, Trent/Tata Retail and Reliance Retail earns 5 Jewels per INR100 immediately; the additional 45 Jewels per INR100 posts at cycle end only when total qualified statement-cycle spend is **greater than INR15,000**. At INR15,000 or below, the extra 45 is cancelled. Caps are 10,000 Jewels per category/cycle, 3,000 per merchant and 1,000 per transaction. Shopping exclusions include gift cards, utilities, subscriptions, insurance and similar non-retail transactions; merchant/network MCC classification determines the category.

Jupiter Flights earns 25 Jewels per INR100, capped at 5,000 per statement cycle in the current detailed co-brand terms. The CSB-hosted MITC updated 29 Aug 2026 says the change is effective 5 Oct and lists no numeric flight cap; the current full terms hosted by Jupiter say 10 Oct and 5,000 Jewels. Those terms state that the full terms prevail over inconsistent MITC provisions, so the record follows the detailed co-brand T&C and documents the conflict. Current card terms give 5 Jewels per INR100 for other eligible transactions. The previous 1 Jewel/INR100 base and 10x/UPI schedules are not current terms for this Edge+ card.

Jewels redemption varies by category: INR0.14 per Jewel for statement credit, bill payments and cash-equivalent withdrawal; INR0.20 for Jupiter Flights/Store, vouchers and digital gold. In-app conversion thresholds/rates may vary and should be checked before redemption. This means the same earn rate has different realized values: 5 Jewels/INR100 is INR0.70/INR100 at cash value; 50 Jewels/INR100 is INR7 at cash value or INR10 at INR0.20 redemptions.

Reward exclusions include fuel, government, rent, utilities, wallet/gift/prepaid loads, cash advances, card fees/balance payments and EMI. The card record includes the MCC exclusions listed in the linked CSB-hosted terms. Because the project schema cannot model the conditional 45-Jewel tranche gated by total qualified cycle spend, the machine-readable shopping rate records the guaranteed 5-Jewel/INR100 instant earn; the conditional additional 45 and spend gate are documented in the accelerator and capping notes. This avoids treating the full 50-Jewel rate as unconditional.

## Benefits and eligibility

Terms state a fuel surcharge waiver of 1% on fuel transactions INR400-INR3,000, capped at INR100 per month. The Edge+ terms state 24/7 concierge and personal-accident/total-permanent-disability cover up to INR2 lakh, limited to the Platinum variant BIN 653038. The record is a RuPay Platinum variant; exact individual BIN was not present in the card dataset. No complimentary airport lounge entitlement was found in the current card terms.

Jupiter's current co-brand page states Indian residency and age 23-60, with steady monthly income and a healthy credit score subject to issuer criteria. No numeric income minimum or bureau-score threshold is published. These requirements are sourced from the co-brand partner page, not the CSB fee documents.

## Validation outcome

Cleared the unsupported launch date and old reward/fee claims; corrected the APR, cash-advance facility, rewards and caps, redemption values, fuel waiver, conditional Platinum benefits, eligibility and application URL. The remaining limitations are the joining-fee campaign variation, conflicting effective dates/cap statements between CSB MITC and current co-brand terms, conditional BIN-specific benefits, and the schema's limited representation of the shopping-spend gate.
