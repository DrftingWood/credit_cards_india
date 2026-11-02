# ixigo AU Credit Card ? issuer comparison (27 Oct 2026)

## Official sources checked

- [Current ixigo AU product page and FAQ](https://www.au.bank.in/personal-banking/credit-cards/ixigo-au-credit-card), retrieved 27 Oct 2026.
- [AU KFS v1.9, dated 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf).
- [AU MITC v2.22, dated 30 Sep 2026](https://www.au.bank.in/credit-cards/mitc(with-schedule-of-charges).pdf).
- [ixigo lounge revision effective 13 Apr 2026](https://www.au.bank.in/pdfs/revision-of-ixigo-au-credit-card-usage-tnc_Lounge.pdf).
- [AU Priority Pass usage terms](https://www.au.bank.in/Priority%20Pass%20Lounges%20PDF-Priority%20Pass%20Lounges.pdf).
- [AU Card Member Agreement, dated 16 May 2026](https://www.au.bank.in/hi/credit-cards/credit-card-member-agreement.pdf).
- [ixigo train reward revision terms](https://www.au.bank.in/tnc/2025/ixigo-revision-of-ixigo-au-credit-card-usage-terms-condition.pdf), search result confirms train rewards revised to 10 points per ?200 effective 1 Apr 2025; this legacy URL redirects in current browser to AU LIT terms, so its live reachability/content must be checked through archive or PDF download.

## Field comparison and outcome

- **Identity, network, launch:** Current product page names ixigo AU but does not state network or network tier. Cleared previous `rupay`/`select` claims; set both to null. No primary issuer source found for a precise launch date, so cleared the placeholder date.
- **Fees:** Current product page advertises a lifetime-free card for a limited period and the fee FAQ repeats that offer. The 30 Sep 2026 standard KFS/MITC fee schedule lists ?999 annual fee and spend waiver conditions (?1,000 retail spend in first 30 days for first-year waiver; ?100,000 eligible annual retail spend for renewal waiver). The live limited-period offer does not state an end date or application eligibility. YAML models the current advertised zero annual fee and preserves the standard fee/waiver conflict in notes. General KFS rates: 0% forex for ixigo AU, 3.75% monthly retail finance, cash advance charge 2.5% or ?500 minimum, and late fee 15% of total amount due (?10 minimum/?1,300 maximum).
- **Rewards:** Current product page advertises ?2.5% rewards? on every ?200 and says rewards apply to online/offline spending, but does not provide an exact points earn table there. The existing modeled base remains 5 points per ?200 (2.5 per ?100) as the conservative lower ordinary rate; older issuer FAQ and reward terms have had different online/offline and ixigo-transaction descriptions. Train terms are 10 points per ?200 effective 1 Apr 2025 (down from 20). The 16 May 2026 member agreement sets a 10,000-point statement-cycle total cap. Model cap as statement cycle and retain unresolved current base-rate detail; legacy train PDF URL currently redirects, so archived evidence is desirable.
- **Redemption/expiry:** Product FAQ confirms minimum 200 points, ?99 + GST fee per successful redemption, and expiry two years from statement month. Existing redemption values vary by channel (ixigo Money ?0.50, other categories ?0.25, vouchers ?0.20) and remain represented separately; points/cash value depends on redemption method.
- **Welcome and offers:** Current product page advertises 1,000 reward points + 1,000 ixigo Money. Member agreement says 1,000 welcome points post on the first successful transaction within 30 days; FAQ says ixigo money voucher is added within 15 days after activation once spending conditions are met and remains valid 90 days from issue. 10% off flights/hotels/bus is ?up to? and offer-code dependent; no fixed cash valuation asserted.
- **Milestone:** 5,000 bonus points on ?75,000 or more per calendar quarter. Milestone condition is explicitly per calendar quarter. The schema does not support a calendar-quarter `trigger_window`; retained `rolling` as a structural approximation, while exact calendar quarter remains in the `cycle` and benefit text. Product page says points valid two years.
- **Lounges:** Current terms effective 13 Apr 2026 require ?50,000 net retail spend in a calendar quarter for two primary-cardholder domestic airport visits in the next quarter. International: one complimentary visit outside India per year; Priority Pass on request; use within India and guests are chargeable. Railway: two quarterly visits, including add-on users. Retained these conditions; cleared network `via` claims unsupported by product-specific network info.
- **Other benefits:** Product page supports 1% fuel waiver for ?400??5,000 transactions up to ?250, up to 10% ixigo travel booking discounts, PG fee waiver on eligible ixigo/ConfirmTkt train bookings, EMI conversion for eligible transactions above ?2,000, tap-to-pay up to ?5,000, and ?1.5 lakh credit-shield cover. Offers remain conditional; discount ceilings/claim terms are not represented as guaranteed values.
- **Eligibility:** Product page confirms salaried 21?60, self-employed 25?65, add-on over 18, resident Indian and ixigo platform registration. No card-specific income or credit-score floor is published.

## Remaining source limits

- Application-specific lifetime-free offer availability/end date versus standard ?999 schedule.
- Exact current base points table and network variant(s); issuer's current product page summary and older detailed reward terms do not fully align, and the legacy train PDF URL currently redirects.
- Exact redemption rate applicable to each live voucher/ixigo Money redemption path and current specific travel-discount codes.
- First launch date and network tier.

The record is now refreshed and the substantiated errors above corrected. This review is one card-level source comparison, not a database-wide accuracy percentage.

