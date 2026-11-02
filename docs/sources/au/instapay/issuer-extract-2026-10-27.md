# AU InstaPay RuPay Credit Card — issuer comparison (27 Oct 2026)

## Official sources checked

- [Current InstaPay product page and FAQs](https://www.au.bank.in/personal-banking/credit-cards/instapay-credit-card), retrieved 27 Oct 2026.
- [AU Credit Card Key Fact Statement v1.9, dated 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), retrieved 27 Oct 2026.

## Field comparison and disposition

- **Identity/network:** Product title and page identify the AU InstaPay RuPay Credit Card. Keep `network: rupay`. No network tier is published; clear `network_tier`. Current source does not establish a first-launch date; clear the placeholder `2024-01-01`.
- **Fees:** Product page calls the card lifetime free. KFS v1.9 shows 3.75% monthly for all AU retail cards; the separate exceptions are AU CA/AU CS (2.99%) and Zenith+ (1.99%). It gives 3.49% as the general foreign-currency markup, with 1.99% AU CA/AU CS, 0.99% ixigo and 0% for Zenith+/NOMO/Traverse. InstaPay is not among those exceptions, so retain 3.49%. General late-payment charge is 15% of total amount due, min ₹10/max ₹1,300. InstaPay-specific cash advance availability/limit and fee are not established by the product page or clearly resolved by the generic KFS; existing `cash_advance_fee: null` is appropriate, and notes now mark this unresolved.
- **Cashback:** Product page confirms 1% on UPI transactions at departmental stores, dining, pharmacy, grocery and supermarkets. Its FAQ specifies eligible MCCs, a transaction minimum of ₹200, and a ₹100 cap per statement cycle. The bank does not publish the exact MCC list in this FAQ; keep that limitation explicit. This is cashback on UPI purchases, not a general card-spend reward.
- **Fuel:** Product page confirms 1% waiver for ₹400–₹5,000 fuel transactions. KFS indicates ₹100 maximum per statement month for InstaPay. Retain values; note GST on the surcharge is not reversed.
- **Eligibility and operation:** Page limits the card to selected existing AU credit-card holders. FAQ confirms virtual-only issuance, shared limit with the primary card, separate statement and bill payment, and domestic UPI transactions. Numeric age, income, and score thresholds are not published for InstaPay. Do not infer residency or approval criteria from general application rules.
- **Unknowns:** Exact first-launch date, tier, numeric eligibility thresholds, exact cashback MCC list, and InstaPay-specific cash-advance treatment remain unpublished or unconfirmed. No measured accuracy percentage can be assigned from this single-record review.

## Outcome

Refreshed verification/retrieval dates to 27 Oct 2026, retained source-supported 3.49% forex and 3.75% monthly finance charges, removed unsupported launch date and network tier, and documented card-specific source gaps. Source comparison is card-level evidence, not a claim of database-wide factual accuracy.
