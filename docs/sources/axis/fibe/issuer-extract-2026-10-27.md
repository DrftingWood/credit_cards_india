# Fibe Axis Bank Credit Card: issuer comparison (27 Oct 2026)

## Sources checked

- [Current Fibe Axis card page](https://www.axis.bank.in/cards/credit-card/fibe-axis-bank-credit-card), retrieved 2026-10-27; current fees, cashback headlines, lounge, fuel, Wednesday offers and eligibility.
- [Current Cashback on Fibe terms, version 7cc42032_3](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-cashback-on-fibe-axis-bank-credit-card.pdf?sfvrsn=7cc42032_3), linked from the card page; rates, MCCs, cap, transaction minimum, UPI limitations, reversals, EMI, rounding and posting.
- [Current Axis domestic lounge access program, version 843429b3_11](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf?sfvrsn=843429b3_11), linked from the card page; Fibe allowance, eligible lounges, spend gate, new-card waiver and validation swipe.
- [Axis credit-card protection plan](https://www.axis.bank.in/important-links/credit-card/card-protection), current issuer page identifies Fibe Axis RuPay Credit Card as Platinum variant. This supports the network tier recorded here.
- [Axis and Fibe launch announcement (10 Oct 2023)](https://www.axis.bank.in/about-us/press-releases/axis-bank-and-fibe-partner-to-launch-india-s-first-numberless-credit-card), primary source for launch date, RuPay network and lifetime-free issuance.
- [Axis bankwide T&C revision effective 28 Aug 2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), for the current DCC markup and late-fee update.

## Record comparison and changes

- Fees: confirmed zero joining/annual fee, 3.75% monthly finance charge, 2.5% cash withdrawal fee (minimum INR 500) and 3.5% foreign-currency markup. The generic revision sets DCC markup to 3.5%. The product page also lists threshold-based rent, wallet, fuel, utility, education and gaming service fees that are not separate structured fields in the card fee model.
- Rewards: 1% on other eligible spends and 3% on online food delivery, online entertainment and online local commute, scoped to MCCs 5499, 5812, 5814, 7841, 7829, 7832, 7922, 4121, 4131, 4111 and 7512. Total cap INR 1,500 per statement cycle. The data now encodes both MCC and online-channel restrictions.
- Cashback conditions: no cashback below INR 100; CC-on-UPI under INR 2,000 and CC-on-UPI at small merchants excluded. Same-period refunds lower spend, later reversals adjust later periods; EMI and post-facto EMI conversion earn no cashback. Cashback is rounded down per transaction and posted T+3 after statement generation. Repayments are excluded.
- Lounge: the current issuer lounge program specifies 1 domestic visit per quarter, behind INR 50,000 eligible settled spend over the previous three calendar months. New issuance waives the gate in the issuance month plus the following three months. This reconciles the product-page annual total of 4 visits and older launch announcement's quarterly count with the current specific access terms.
- Fuel: confirmed 1% surcharge waiver on INR 400?5,000 transactions, capped at INR 400 monthly; issuer notes some transactions may incur INR 10 plus GST rather than 1% plus GST, and GST on the surcharge is not refunded.
- Eligibility: current product page says age 18?70 and resident or non-resident Indian, sourced only to existing Fibe customers; income and credit-score floors are unpublished, and approval remains at Axis discretion.
- Other benefits: kept Wednesday Delight offers with merchant terms; added Dining Delights by program name and left the numeric discount unknown because the product page links only general EazyDiner eligibility/offer terms.
- Network and launch: confirmed RuPay and 10 Oct 2023 launch from Axis's official announcement; confirmed RuPay Platinum variant on Axis's current protection-plan eligibility page.
- Removed the unsupported standalone MCC 6513 exclusion. Current card terms exclude rent by category and do not publish the exact rent MCC.

## Remaining limits

- Cashback T&C linked from the live page does not state an effective date; the data's existing effective-from date is retained and documented as not restated by the linked PDF.
- Wednesday Delight campaigns and Dining Delights offers vary by merchant and current offer terms; the schema does not capture full booking-path rules.
- Product-page fee thresholds are documented but not fully modeled in the typed fee record.

## Validation evidence

After this update, rerun `python scripts/validate.py`, `python scripts/audit_stamps.py`, `python scripts/audit_numeric_evidence.py` and `python tmp/next_queue.py`. These establish structural validity, source-date consistency, traceability coverage and queue position; they do not prove every fact in unreviewed records.
