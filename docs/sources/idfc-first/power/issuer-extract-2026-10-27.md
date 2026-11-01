# IDFC FIRST Power HPCL Credit Card: issuer comparison (27 Oct 2026)

## Sources

- [Current Power/Power+ product page](https://www.idfcfirst.bank.in/credit-card/hpcl-power-fuel-credit-card), captured as `product-page-retrieved-2026-10-27.html`.
- [May-2026 FIRST Power communication](power-communication-may-26.pdf), effective 18-Jun-2026.
- [Power reward schedule](savings-maximiser.pdf), current [Power privileges](power-privileges.pdf), and [Travel & Shop terms](power-travel-shop-terms.pdf).
- [Power series welcome terms](power-series-welcome-offer-terms.pdf), current MITC and [17-Sep zero-forex notice](zero-forex-notice-2026-09-17.pdf).

## Field decisions

- Retained RuPay with no network tier, consistent with the issuer's UPI-enabled Power card and RuPay credit-card eligibility. Exact launch date remains unknown.
- Joining/annual fee INR199 + GST; annual fee waiver at INR50,000 previous-year spend. Forex is zero under the bank-wide policy. Dynamic APR is 8.5%–46.2% p.a.; fixed monthly finance rate remains unknown. Cash advance is INR199 + GST per transaction. The issuer's product page carries the current over-limit and late fee figures.
- Core earn: 2 points/INR150 on other retail and eligible UPI; 21 points/INR150 on eligible HPCL fuel capped at 700 points; 15 points/INR150 on eligible grocery/utility combined capped at 400 points; 15 points/INR150 on IDFC FIRST FASTag capped at 200 points. Happy Coins through HP Pay are a separate currency. Travel & Shop bonus is stated in the June update as 26.67% for hotel and 13.33% for flight bookings, with an 8,000 monthly bonus-point cap; percentage calculation is retained in notes rather than converted to fixed rate fields.
- HPCL welcome voucher is INR250 after a primary-card HPCL transaction of INR250+ and joining-fee payment. Current detailed terms give 60 days for cards set up from 10-Jun-2025; a product FAQ states 30 days. The detailed terms and dedicated 60-day product-page section are followed, with the FAQ conflict documented. First-EMI cashback is 5% up to INR1,000 within 30 days.
- Added the advertised merchant offers worth INR1,000+ without treating partner-dependent offers as cash value. Roadside assistance, personal accident and card-liability protection match current issuer benefits.
- Fuel surcharge waiver remains unmodeled because the product page says Power has no waiver, while the general MITC table includes Power/Power+ at 1% with the cap marked “Not Applicable.”
- Eligibility remains age 21+, annual income INR300,000, Indian resident, and no numeric credit-score floor. A separate current issuer eligibility FAQ says self-employed applicants must be 25; this occupation-specific distinction is retained in notes because the schema has only one minimum-age field.

## Conflicts and model limits

Issuer welcome sources conflict on the 30/60-day window. The Power product page's fuel-surcharge statement conflicts with the combined Power/Power+ MITC row. The latest travel notice uses percentages while older terms specify absolute point awards; the amount and monthly cap are preserved in notes. Age criteria differ by employment type, which the schema cannot represent in a single minimum-age field.
