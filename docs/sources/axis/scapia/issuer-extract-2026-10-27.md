# Scapia Axis Bank Credit Card source comparison (2026-10-27)

## Sources reviewed

- [Axis Bank product page](https://www.axis.bank.in/cards/credit-card/scapia-axis-bank-credit-card): zero joining/annual fees, zero forex/DCC, monthly finance 3.75%, cash withdrawal fee 2.5% (minimum ?500), 1% fuel waiver through transactions up to ?5,000, fuel-surcharge GST not refunded. Rewards: Mastercard 10% in Scapia Coins on eligible online/offline spends; RuPay 5% on eligible UPI/online/offline transactions of ?500+, both uncapped. Scapia app bookings for flights, hotels, experiences and e-commerce earn 20%, uncapped. Domestic airport privileges unlock at ?20,000 monthly spend and include lounge access and up to ?1,000 airport dining/shopping/spa value. Age 18?70 and India residency are stated.
- [Scapia product page](https://www.scapia.cards/): 5 Scapia Coins = ?1; unlimited domestic lounge access after ?20,000 combined monthly spend; international terminal privileges up to ?2,000 after a qualifying ?50,000 international booking in-app (effective 27-Feb-2026).
- [Scapia Coins explainer](https://www.scapia.cards/product/blog/scapia-coins): explains 5 coins = ?1 and coin redemption options on the platform. It is partner material, not issuer card T&Cs, and cannot substantiate exclusions.

## Corrections made

- The product is issued as Mastercard and RuPay variants; cleared the scalar network and unsupported World tier. The schema cannot encode two different networks and rates in one record. Rewards use the lower RuPay rate (5%, 25 coins/?100, minimum ?500) as conservative base; Mastercard variant's 10% rate is documented. App travel/experience/e-commerce earn is 20% (100 coins/?100) and uncapped.
- Corrected the old coin math: five coins equal ?1, so 10 coins/?100 is 2%, not 10%; 20 coins/?100 is 4%, not 20%. Structured amounts now reflect the issuer's reward-value percentages and coin ratio.
- Domestic lounge access is unlimited after ?20,000 eligible spend in the previous monthly billing cycle, not ?10,000. Guest quota is unknown. Airport dining/shopping/spa is a separate Scapia Coins reimbursement benefit up to ?1,000 per eligible visit.
- Added international airport dining/shopping privilege up to ?2,000 after a ?50,000 in-app international flight booking, based on Scapia partner site terms effective 27-Feb-2026.
- Cleared unsupported Platinum/World tier and exact launch date; filled published age and residency. Removed unverified reward exclusion list and unsupported concierge=false.
- Fuel waiver amount ceiling is ?5,000 per transaction; no per-cycle cap was published in the current Axis product page. Existing ?500 cap was unsupported and removed.

## Open issues and schema limits

Axis current page differentiates Mastercard and RuPay reward percentages/minimums while the record schema stores one network and base rate. Conservative RuPay values are modeled and Mastercard terms documented. Current issuer page links an ineligible-transactions list, but the linked detailed schedule was not accessible in this pass; exclusions and MCCs remain unasserted. Airport lounge guest quota and product launch date remain unknown. The numeric lounge spend window is described as monthly; exact eligible-spend exclusions need the Scapia app terms.
