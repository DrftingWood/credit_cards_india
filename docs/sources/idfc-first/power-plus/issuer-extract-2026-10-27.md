# IDFC FIRST Power+ HPCL Credit Card: issuer comparison (27 Oct 2026)

## Sources

- [Current Power/Power+ product page](https://www.idfcfirst.bank.in/credit-card/hpcl-power-fuel-credit-card), captured as `product-page-retrieved-2026-10-27.html`.
- [May-2026 Power+ communication](power-plus-communication-may-26.pdf), effective 18-Jun-2026.
- Current [Power+ privileges](power-plus-privileges.pdf), [Power+ reward schedule](savings-maximiser.pdf), and [Travel & Shop booking terms](power-plus-travel-shop-terms.pdf).
- [HPCL welcome offer terms](power-series-welcome-offer-terms.pdf), [Jan-2026 reward/eligibility update](power-plus-update-2026-01-18.pdf), customer MITC and [17-Sep zero-forex notice](zero-forex-notice-2026-09-17.pdf).

## Field decisions

- Retained RuPay, with no network tier. The issuer lists Power+ among RuPay cards and supports RuPay UPI transactions; the associated UPI card is a separate rail.
- Joining/annual fee INR499 + GST; annual fee waiver at INR150,000 previous-year spend. Forex is zero under the bank-wide policy. Dynamic APR is 8.5%–46.2% p.a.; cash advance fee is flat INR199 + GST per withdrawal. Over-limit and late fee details are in the record notes.
- Core earn: 3 points per INR150 on other retail and UPI; 30 points per INR150 on eligible HPCL fuel, grocery/utility and IDFC FIRST FASTag with distinct caps. The HPCL fuel cap is 2,400 points, grocery/utility share 400, and FASTag cap is 200. Happy Coins through HP Pay are a separate loyalty currency. Rewards are capped by available credit and MAD payment rules.
- Travel & Shop earns an additional bonus described in the 18-Jun update as 26.67% on hotels and 13.33% on flights; this is retained as percentages in notes because the schema's fixed points-per-spend field cannot represent the calculation safely. The booking terms also set an 8,000 monthly bonus-point cap and credit-after-travel rules.
- One airport lounge entry per quarter requires INR20,000 monthly spend, shared with add-ons. Movie discount is 25% up to INR100 monthly after prior-month card activity. Roadside assistance, personal accident and card-liability benefits are recorded from current privileges.
- Fuel surcharge waiver remains unmodeled: the current Power+ card page says the card has no surcharge waiver; the general MITC lists a 1% waiver for Power and Power+ with the cap shown as “Not Applicable.” No numeric cap is invented.
- HPCL welcome voucher is INR500 for a primary-card HPCL transaction of at least INR500 after joining fee payment. Dedicated terms set 60 days for cards set up from 10-Jun-2025; a product-page FAQ also says 30 days. The card-specific offer terms are followed and the FAQ conflict is noted. The first-EMI cashback remains as stated in the card page/offer information.
- Eligibility retains annual income INR300,000, resident status and salaried minimum age 21; the page specifies self-employed applicants minimum age 25, which the common schema cannot represent separately. No numeric bureau-score floor is asserted.

## Conflicts and model limits

Current product page says the fuel surcharge waiver is unavailable, while general MITC's combined Power/Power+ row lists 1% and “Not Applicable” as the cap. Welcome transaction window is 30 days in one FAQ and 60 days in the dedicated current terms. Travel bonus is expressed as percentages in the latest update while older terms specify point awards; both sources and the current monthly cap remain archived. The schema cannot express per-occupation age or the complete per-category travel bonus basis.
