# HDFC Bank Regalia: issuer field review (2026-10-27)

Reviewed the live [Regalia product page](https://www.hdfc.bank.in/credit-cards/regalia-credit-card), its linked [fees page](https://www.hdfc.bank.in/credit-cards/regalia-credit-card/fees-and-charges), current personal MITC v4.15 (shared archive), card-specific reward terms, Regalia May-2026 change notice, HDFC's archived launch release and the linked HDFC ERGO policy PDF.

## Corrected or retained fields

- Launch date: changed the unsupported 2009-01-01 to 2011-08-02, the dated HDFC announcement launching Regalia among its premium travel-card trio. This is the first issuer-confirmed launch date found.
- Network and network tier: cleared Visa / Signature. HDFC's live lounge information refers to Visa and Mastercard Regalia cards, and the launch announcement describes the Regalia range rather than a single network. The card record cannot encode network variants. The available primary sources do not establish one universal tier.
- Fees: retained INR 2,500 joining/renewal, INR 3 lakh annual waiver, 3.5% foreign-currency markup, 3.75% monthly finance, and cash advance 2.5% / INR 500. The current MITC and card page support these. DCC is 1.75%; the Regalia-specific PDF says effective 15-May-2026 while shared MITC v4.15 says 20-May-2026. DCC is not the same as foreign-currency markup and lacks a structured field.
- Rewards: retained 4 RP / INR 200 from 15-May-2026, up to 5X SmartBuy, grocery cap 2,000 RP/month, 50,000 RP statement-cycle overall cap, published redemptions and expiry/reversal rules. Removed the unsupported SmartBuy accrual cap of 4,000/month (and any 3,000 voucher sub-cap) from structured data; current linked Regalia terms do not state those caps. Kept insurance out of the exclusions because issuer terms explicitly allow insurance earn up to 2,000 RP/month.
- Lounge and card benefits: current page supports two domestic vouchers each quarter after INR 1 lakh spend in that calendar quarter, and up to six international Priority Pass visits/year outside India after four card transactions. Current page also advertises 7.5% Swiggy Dineout savings, welcome/renewal points and concierge. Dineout cap/expiry are not published.
- Eligibility: retained published income levels and overall ages 21-65, with an explanatory note distinguishing the salaried age ceiling of 60 from self-employed age 65. Cleared resident-only and minimum credit-score claims; the legacy page also mentions an NR Regalia autopay option and publishes no score floor.
- Application: left apply URL empty and retained active cardholder status. HDFC explicitly says sourcing has been discontinued, but provides no cessation date; existing cardholder benefits remain live. The schema requires a date for discontinued status and cannot encode discontinued sourcing while servicing legacy accounts.

## Unresolved evidence limits

- HDFC's linked HDFC ERGO policy file is valid 23-Jul-2025 through 22-Jul-2026, so it has expired. The live product page continues to advertise insurance, but the current policy wording and limits are not established by that expired PDF. Insurance coverage amounts have therefore been removed from structured data; refresh the policy evidence on a future review.
- Eligibility page is legacy (`v.hdfc.bank.in`) and returned 403 during this review; values are retained with lower confidence and linked as issuer source.
- The product page includes outdated historical FAQ entries alongside current content. Historical 2021 offers and stale terms were not treated as current conditions.

## Archived primary evidence

- `hdfc-regalia-launch-2011-08-02.pdf` — official HDFC release, 2-Aug-2011.
- `rp-regalia.pdf` — current linked Regalia reward terms; base accrual and redemption/caps.
- `t-c.pdf` — Regalia card terms.
- `hdfc-ergo-general-insurance-company-limited.pdf` — linked policy, expired 22-Jul-2026.
- `../_shared/mitc-in-english-v4.15-retrieved-2026-10-25.pdf` — current shared personal MITC.
- The issuer's May-2026 product-change notice is archived in the shared HDFC source directory.

