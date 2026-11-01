# MakeMyTrip ICICI Bank Credit Card issuer review (27 Oct 2026)

Primary ICICI product page: https://www.icici.bank.in/personal-banking/cards/credit-card/makemytrip/makemytrip-icici-bank-credit-card

Compared the current ICICI card page and FAQ, card-specific T&Cs linked from that page, current general MITC, official ICICI launch release, MakeMyTrip's current partner terms and offer page, and the current BookMyShow offer page. Retrieved card T&Cs and MITC PDFs/text are archived beside this extract and listed in `docs/sources/icici/_manifest.json`.

## Terms encoded as current on the verification date

- Product is active and available to apply. Official ICICI launch announcement is dated 2024-10-03 and says the product is issued as a dual Mastercard and RuPay offer. Since this record represents both issued variants, its single-network/network-tier scalars are cleared.
- Joining and annual fee: INR999 plus GST. From the second anniversary year, the next annual fee is reversed when prior anniversary-year spend is at least INR300,000; EMI transactions are excluded from the waiver calculation.
- Forex markup: 0.99% on the live ICICI product page. Monthly finance charge: 3.75%. Cash-advance transaction fee/minimum is omitted because the readable current MITC does not expose a card-specific amount.
- Rewards are myCash credited to the primary cardholder's MakeMyTrip account. ICICI and MMT describe INR1 myCash as INR1 of booking/voucher value. It is closed-loop: no bank encashment or transfer; only personal MMT accounts; ineligible on myPartner/myBiz, gift cards and foreign currency; eligible bookings include flights, hotels, holiday packages, trains, buses, cabs and visas; up to 100% of eligible booking value can be paid with myCash.
- Current earn rates: 6% on MMT hotel bookings; 3% on MMT flight, holiday, cab and bus bookings; 25 myCash per MMT train booking; 1% on other domestic spend (excluding rent and EMI); 1% on insurance spend capped at 1,000 myCash per anniversary year. The per-booking train amount is noted rather than forced into the schema's per-INR earn model. Current page says unlimited reward accumulation/no expiry; the linked card T&C specifies current pre-change balances do not expire. Terms round earned points down to the nearest integer and reversed purchases earn nothing.
- Generic earn exclusions include rent, cash advances, card fees/charges, joining/annual fees, EMI, balance transfers and personal loans on cards. No unsupported MCC exclusion list is retained.
- Lounge access: primary cardholder only; 2 domestic visits per quarter after at least INR75,000 spend in the preceding quarter, plus 1 international visit per calendar year using Priority Pass. Add-on cardholders are not eligible.
- Welcome/renewal: INR1,000 MMT voucher after joining fee payment, valid 12 months for eligible flight/hotel/holiday/bus/cab bookings; INR1,000 hotel voucher after annual fee payment, valid three months for hotels/homestays. Primary member receives 12-month MMTBLACK Gold membership on activation; ongoing tier status is governed by MMTBLACK programme criteria.
- BookMyShow: 25% off the second ticket up to INR150, once/month on each Mastercard and RuPay variant (2 variant offers/month), shared with add-on cards. Minimum two tickets; current product FAQ and BookMyShow page say INR25,000 or more preceding-quarter spend from 2026-04-01. The linked card-specific PDF says spend over INR25,000, so the threshold boundary is unresolved. Current BookMyShow page lists both MMT card variants and offer validity through 2027-03-31.
- INOX: ICICI's current product page separately advertises 25% off up to INR150 twice monthly. The linked card-specific terms do not clarify whether this quota is shared with BookMyShow, so it is recorded as a separate advertised offer with the interaction unresolved.
- Other current benefits: three-month no-cost EMI on eligible MMT transactions; 24x7 concierge assistance is advertised for the RuPay variant; Culinary Treats dining offers depend on participating outlets and live terms.
- Eligibility: Indian citizen over 21; salaried monthly income INR20,000 (normalized to INR240,000 annually); self-employed annual income at least INR240,000. Maximum age and credit-score minimum are not published on the current product page.

## Announced future terms and open conflicts

- The current card-specific ICICI T&C states that from 2026-11-10, international spend earns no myCash. New myCash credits from that date will expire after 24 months, while myCash credited before that date remains non-expiring. Those are not yet active on the 2026-10-27 snapshot; the card must be revisited on/after the effective date.
- MakeMyTrip's current partner page advertises zero forex markup valid from 2026-11-10, while ICICI's live issuer product page still states 0.99%. The YAML retains the issuer's currently listed 0.99% and records the coming partner-page claim for recheck rather than applying it early.
- Current ICICI and card-specific T&C agree on key reward rates, but the older archived local MMT PDF and prior YAML contained older/inaccurate values and are not used to override the current linked card-specific terms.
- Current MITC retrieval did not yield a legible card-specific cash-advance transaction fee/minimum; it is omitted pending clear current tariff evidence.

## Sources

- ICICI product page: https://www.icici.bank.in/personal-banking/cards/credit-card/makemytrip/makemytrip-icici-bank-credit-card
- ICICI card-specific T&C PDF: https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/makemytrip-icici-credit-card-terms-and-conditions.pdf
- ICICI current MITC PDF: https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/mitc_cc.pdf
- ICICI launch release (2024-10-03): https://www.icici.bank.in/about-us/article/icici-bank-and-makemytrip-launch-a-co-branded-credit-card-for-travel-enthusiasts
- MakeMyTrip card page and future forex notice: https://www.makemytrip.com/cards/makemytrip-icici-bank-credit-card
- MakeMyTrip current partner reward terms: https://promos.makemytrip.com/mmt-icici-rupay-card-terms.html
- BookMyShow current ICICI discount terms: https://in.bookmyshow.com/offers/icici-bank-25-discount-offer/ICICICC520
