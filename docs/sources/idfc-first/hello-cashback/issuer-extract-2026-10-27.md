# IDFC FIRST Hello Cashback: issuer comparison (27 Oct 2026)

## Sources reviewed

- [Current Hello Cashback product page](https://www.idfcfirst.bank.in/credit-card/hello-cashback-credit-card), captured locally as `product-page-retrieved-2026-10-27.html`.
- [Hello Cashback Product Feature Document](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Hello-Cashback-Terms-and-Conditions.pdf), archived as `hello-cashback-product-feature-terms.pdf`.
- Hello Cashback Product Usage Guide, archived as `hello-cashback-product-guide.pdf`.
- Current customer MITC, archived as `current-customer-mitc.pdf`.
- [Bank-wide zero-forex notice, effective 17 Sep 2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf), archived as `zero-forex-announcement-2026-09-17.pdf`.

## Field decisions

| Record area | Issuer evidence and saved value |
| --- | --- |
| Network and launch | Current product page identifies the RuPay card. It does not identify a RuPay tier or launch date. The record keeps `network: rupay`, clears `network_tier`, and leaves `launched_on` null. |
| Joining and annual fees | Current product page advertises a limited-time INR 0 joining fee, with standard joining fee INR 1,000 + GST. The page FAQ has inconsistent offer end dates: one section says 30 Oct 2026 while another says 31 Oct 2026. The record follows the currently served 31 Oct date and retains the conflict in source notes. The offer start date is unpublished. Annual fee is INR 1,000 + GST from year two; 50% reversal at INR 1 lakh to below INR 2 lakh annual eligible purchases and 100% at INR 2 lakh. |
| Other fees | Current product page advertises INR 199 + GST cash withdrawal fee and up to 45 days at 0% interest. No card-specific revolving APR is published on the product page; the stale fixed 3.5% monthly assertion remains removed and the field is null. Zero forex markup follows the current page and 17 Sep bank-wide notice. A merchant/ATM may separately charge DCC if the cardholder chooses INR abroad. |
| Secured credit limit | Current page requires an initial FD of at least INR 10,000 and says the credit limit is 100% of FD value. It also says additional FDs from INR 5,000 can be linked to raise the limit. Corrected the record's inaccurate “single-held FD” description to allow multiple linked FDs. No stronger claim about FD renewal mode or lien wording is retained. |
| Cashback | Current product page and feature document agree: 3% on eligible online spend up to INR 10,000 per statement cycle, 5% on incremental eligible online spend above INR 10,000, and 1% on eligible in-store, IDFC FIRST app UPI and essential-category spend. App flight/hotel bookings receive an extra 1%, making 4%/6% before caps. Online cashback cap is INR 1,000 and total cashback cap INR 1,500 per statement cycle. Essential-category and fuel transactions do not count toward the INR 10,000 online threshold. Exclusions include fuel, ATM cash withdrawals, EMI and third-party UPI-app spend. Cashback posts PDD+1 when MAD is received by the due date; otherwise that cycle's cashback is forfeited. |
| Benefits | Product page and feature document support 1% fuel-surcharge waiver on transactions INR 200–5,000, capped INR 100 per statement cycle; roadside assistance up to four uses per year; INR 2 lakh personal accident, INR 25,000 lost-card liability, INR 50,000 credit shield, and INR 25,000 purchase protection. The saved model includes the policy active-card conditions and exclusions from the linked issuer terms. No airport lounge or trip-cancellation cover was found. |
| Eligibility | Product page states age 18–80, Indian resident citizen with current and permanent Indian residential addresses, minimum FD INR 10,000, and no income proof or credit history requirement. Bank retains approval discretion. The schema has residency but no citizenship field; the current `resident-indian` value does not encode citizenship separately. |

## Unresolved and model limits

- Joining offer end date conflicts within the live FAQ (30 vs 31 Oct 2026); the structured interval follows the page's 31 Oct statement. Confirm with issuer before relying on the offer after 30 Oct.
- No official launch date, RuPay tier or card-specific revolving APR was located.
- The cashback feature document does not establish the original effective date of the current earn/cap model. The record's date is the earliest review date in this audit trail, not a verified product effective date.
- Source terms do not provide a structured representation for all channel/category interactions or the DCC surcharge amount; explanatory notes preserve these details.

The current product page's cashback and FD statements were rechecked during this review. This field comparison supports the values listed above; it is not a guarantee against subsequent issuer changes.
