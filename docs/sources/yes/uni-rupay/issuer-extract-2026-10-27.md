# YES BANK UNI RuPay Credit Card source comparison (2026-10-27)

## Sources reviewed

- [Current YES BANK credit-card catalogue](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards): lists UNI RuPay, joining and renewal fees ?0, and 1% cashback in Uni Coins on all transactions; advertises a 1% fuel surcharge waiver.
- [YES BANK Key Fact Statement](https://www.yes.bank.in/content/published/api/v1.1/assets/CONT07A77C257C7A4BDD85DB97E51D2B5B8F/native/yesbank_key_fact_statement.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false): finance charge 3.99% monthly, zero joining/renewal fees for UNI RuPay and cash advance fee not applicable to UNI RuPay. It is card-specific evidence for cash-advance exemption and finance rate; the document includes historical schedule text.
- [YES BANK consolidated MITC](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false): names UNI / UNI RuPay; 1% fuel surcharge reversal up to ?7,500 per transaction and cap ?500 per statement cycle. No minimum transaction amount stated. Taxes on fuel surcharge are not waived.
- [YES BANK indexed MITC copy](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTEF575C3B82F447DB91267802FF241884/native/ai_ybl_mitc_pdf.pdf?download=false): indexed as CMITC_V17_25022026. Used to corroborate the fuel schedule; it is older than the current consolidated schedule.
- [YES BANK homepage](https://www.yes.bank.in/): lists UNI RuPay among Virtual RuPay Cards. The catalogue supports RuPay UPI linking; this does not establish product-specific rewards on UPI.

## Field comparison and changes

- Current catalogue and KFS support active listing, RuPay variant, ?0 joining/annual fees, zero forex conversion and 3.99% monthly finance charge. Cleared unsupported Platinum tier, launch date, residency and direct-apply URL.
- Set cash-advance fee to null because card-specific KFS explicitly exempts UNI RuPay; the variant is virtual.
- Current catalogue says 1% cashback in Uni Coins on all transactions. Accessible current YES materials do not establish this product generation's coin denomination or redemption route. The old record's `100 coins = ?1` / digital-gold claim may have carried over from a different Uni product generation. Cleared the rupee unit value and unsupported exclusions. Structured 1 unit per ?100 carries the issuer's headline rate only; it does not establish realized value.
- Fuel waiver updated to 1%, transactions up to ?7,500, cap ?500 per statement cycle. Minimum transaction amount and other card-specific qualifying conditions were not established. Fuel surcharge taxes remain payable.
- Lounge, concierge, age/income/score/residency and launch date remain unverified and are left unknown. The bank lists the card among its virtual RuPay cards; RuPay cards can be linked to UPI.

## Limitations

Issuer catalogue and MITC support headline terms but do not provide a complete card-specific rewards schedule or coin redemption agreement. The card remains active because it is in the current catalogue. This single-record review does not establish broad database accuracy.
