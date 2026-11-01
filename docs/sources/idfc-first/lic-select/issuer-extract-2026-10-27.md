# LIC IDFC FIRST Select: issuer comparison (27 Oct 2026)

## Sources reviewed

- [Current LIC Select page](https://www.idfcfirst.bank.in/credit-card/lic-credit-card), archived as `lic-select-product-page-retrieved-2026-10-27.html`.
- [LIC Select Travel & Shop terms, effective 18 Jun 2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/LIC-Select-TnC-Travel-and-Shop.pdf).
- [LIC Select welcome offers, dated 9 Mar 2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/LIC-Joining-Offers-01.pdf).
- [LIC Select privileges](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Privileges-Document-LIC-Select-11-08-25-Link.pdf), [current airport lounge list](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/LIC-Select-Lounge-List.pdf), LIC Select Product Usage Guide, current customer MITC, and [17-Sep-2026 zero-forex notice](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf) are archived in this folder.

## Field decisions

| Record area | Issuer evidence and saved value |
| --- | --- |
| Network and launch | Current product guide cover visibly depicts Mastercard. The current card page and linked guide do not publish a Mastercard tier; set network to Mastercard, clear Visa Signature and leave `network_tier` null. No official launch date was found. |
| Fees and forex | Current product page states zero joining/annual fees for life, INR199 cash-advance fee, up to 45 interest-free days, and dynamic purchase APR (8.5%–46.2% p.a.); no fixed monthly APR is asserted. Zero forex follows the dedicated product page and 17-Sep-2026 policy. |
| Base and accelerated rewards | Current page says 1X is 1 point/INR125, worth INR0.25, valid three years; 5X on other eligible spend and 5X on essential categories subject to a shared 600-point monthly cap. The first five LIC premium payments per statement cycle earn 10X only when paid through LIC's official website. Fuel, rent, non-LIC insurance, EMI and cash withdrawals are excluded. Rewards post only when MAD is paid by the due date. |
| Travel bookings and redemption | Current detailed Travel & Shop T&C (effective 18-Jun-2026) specifies 20% bonus points on hotels and 8% on flights, with an 8,000 bonus-point monthly cap; bonus posts after completed travel/check-in, and cash-plus-points or EMI transactions do not qualify. Redemption is INR0.25/point, up to 70% of a booking, capped at 100,000 points/month and 200,000/year. The live product page also says “up to 40%” and displays 45 bonus points/INR125 on hotels and 20/INR125 on flights; those figures do not reconcile with the detailed 20%/8% T&C. The model retains the detailed T&C rates only in notes and does not add an accelerated travel rate. |
| Welcome benefits | Product page says 2,000 points after INR10,000 spend within 30 days; its linked 9-Mar-2026 welcome PDF states 2,500 points and “more than INR10,000”. Both require the primary card and offer fulfilment within 45 days after card generation. The conflict is preserved without choosing an amount or threshold. The first qualifying EMI within 30 days earns 5% cashback up to INR1,000; EMI tenure must be at least six months, and EMI processing fees apply separately. |
| Airport lounge | Current product page and privileges terms support two domestic airport visits per quarter. The privileges PDF requires INR20,000 eligible spend during a calendar month to unlock visits the following month; access is shared with add-on cards through DreamFolks. Updated the record from a visa route to DreamFolks and encoded the spend gate. |
| Railway lounge | Privileges PDF states four visits per calendar quarter, shared with add-on cards; one guest may use the cardholder's quota, and a valid train ticket is required. |
| Fuel and roadside | Current page supports 1% fuel surcharge waiver on transactions INR200–5,000 up to INR300/month. Roadside assistance is stated as worth INR1,399, up to four uses/year, subject to service terms. |
| Insurance | Current product page supports INR1 crore air-accident, INR5 lakh personal-accident, INR50,000 lost-card, INR25,000 purchase protection and INR25,000 credit-shield benefits, plus INR4,000 each for baggage loss, baggage delay, flight delay and travel-document loss. Reclassified checked-baggage delay as trip delay. The linked privileges PDF has a poorly aligned sum-insured table; policy wording and insurer schedule remain controlling for claims. |
| Other offers and eligibility | Added the current page's “merchant offers worth INR1,500+” as a non-guaranteed, variable offer because merchants/validity are not specified in the dataset. The current LIC Select page does not state age, income, credit-score or residency cutoffs, so these remain unknown. |

## Unresolved/model limits

- Welcome offer amount and spend threshold conflict between the current product page and linked offer PDF.
- The current product page's travel booking points/percentages conflict internally and with the June 2026 card-specific T&C; the detailed T&C figures are retained as notes, not scored accelerator rates.
- Network tier, launch date, and card-specific underwriting cutoffs are unpublished in the current issuer source set.
- Insurance values are summarized on the live page, while portions of the linked policy table extract ambiguously; the applicable insurer schedule governs claims.

This comparison records issuer evidence and open conflicts as of the review date; terms can change later.
