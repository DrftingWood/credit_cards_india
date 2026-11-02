# IndianOil HDFC Bank Credit Card — issuer comparison (27 Oct 2026)

## Current primary sources

- [HDFC IndianOil card page](https://www.hdfc.bank.in/credit-cards/indianoil-hdfc-bank-credit-card): current earning, fee waiver, fuel waiver, fuel-point redemption, welcome voucher and card-page eligibility.
- [HDFC IndianOil fees and charges page](https://www.hdfc.bank.in/credit-cards/indianoil-hdfc-bank-credit-card/fees-and-charges): INR 500 joining/renewal fee, INR 100 reissue FAQ, 3.49% monthly overdue interest, 3.5% forex markup and other transaction fees.
- [HDFC IndianOil eligibility page](https://www.hdfc.bank.in/credit-cards/indianoil-hdfc-bank-credit-card/eligibility): age, income, nationality/residence and FAQ score threshold; it conflicts with parts of the product page.
- [Current card-specific Fuel Points terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/indian-oil-hdfc-bank-credit-card/T-and-C-Indian-Oil-Credit-Card.pdf): earn table, exclusions, redemption limits and terms; archived as `T-and-C-Indian-Oil-Credit-Card.pdf`.
- [HDFC tariff updated 14 Mar 2025](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/indian-oil-hdfc-bank-credit-card/fees-and-charges/fees-and-charges.pdf): archived as `fees-and-charges-updated-2025-03-14.pdf`.
- [HDFC May 2026 charge update](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/generic-mailer-tnc.pdf): 1.75% DCC and INR 199 reissue fee for non-metal variants; archived under `docs/sources/hdfc/_shared/`.
- [HDFC and IndianOil launch release](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/pdf/press-release/2019/q3-jul-sep/september/hdfcbankandindianoillaunchcobrandedfuelcreditcardfornonmetrocitiesandtowns.pdf): launch dated 25 Sep 2019; available on both RuPay and Visa. Archived as `launch-release-2019-09-25.pdf`.
- Current personal MITC v4.15, dated Oct 2026, archived under `docs/sources/hdfc/_shared/`.

## Record changes and confirmations

- Corrected launch date from the unsupported 1 Jan 2017 placeholder to 25 Sep 2019 from the joint issuer launch release.
- Cleared the single RuPay network and Platinum-tier claims. The launch release confirms both RuPay and Visa variants; no network-tier designation was found in current issuer sources. The shared record models network and tier as null.
- Retained INR 500 joining/renewal fee, INR 50,000 annual renewal-waiver threshold, 3.5% forex, 2.5%/INR 500 cash advance, 3.49% overdue interest from the current card fee FAQ, and current May-2026 DCC notes. Current personal MITC instead says 3.75% monthly finance charge, so both rates are recorded as conflicting issuer material.
- Recorded the reissue-fee conflict: current card-specific fee FAQ says INR 100; May-2026 generic HDFC notice says INR 199 for non-metal cards. The schema has no dedicated reissue or DCC fields.
- Confirmed 1 Fuel Point per INR 150 on other eligible spend, including RuPay UPI; 5 per INR 100 at authorized IOCL outlets; 5 per INR 100 in eligible grocery and utility/telecom bill categories; monthly caps 250 IOCL points for the first six months and 150 thereafter, 100 grocery, and 100 bill-payments points; minimum INR 150 transactions where the T&Cs state one.
- Retained MCC 5499 alone for modeled grocery accelerator because the issuer T&Cs list grocery MCCs 5411/5499/5921/5462 but also exclude supermarkets, package stores/liquor and bakeries. Broader grocery MCC eligibility is unresolved. Utility and telecom/bill-payment MCCs are 4812/4814/4900.
- Confirmed Fuel Point redemption value at IOCL as INR 0.96 (3 XRP per point), minimum 500 points in multiples of 500; cashback INR 0.20 per point, minimum 12,500 points and INR 50 fee; catalogue up to INR 0.20 with INR 99 + tax fee and selected items/vouchers up to 70%; SmartBuy travel INR 0.20 per point and at most 50% booking value / 50,000 points per month; AirMiles conversion 0.25 per Fuel Point. Points expire after two years.
- Confirmed INR 250 activation voucher after one transaction within 37 days, with no minimum transaction value; fuel surcharge waiver 1% on INR 400–5,000 fuel transactions, capped INR 250 per statement cycle; complimentary IXRP membership and 1% waiver benefits.
- Modeled main card page eligibility (salaried: age 21–60, net monthly income > INR 12,000; self-employed: age 21–65, ITR > INR 6 lakh). Documented conflicts: another product-page FAQ says salaried > INR 10,000; eligibility page says gross > INR 12,000 and its table says self-employed max age 60 while its FAQ says below 65. Eligibility FAQ says Indian resident and credit score above 750; the integer threshold is stored as 751.

## Schema / source limits

- Current fee/reward/benefit schedule start dates are not separately stated. Because the schema requires `effective_from`, the confirmed launch date is used as the row's lower-bound date and this limitation is recorded in the card notes.
- Reissue/DCC fees and the conditional first-six-month IOCL point cap cannot be fully represented by the current schema.
- Grocery MCC inclusions conflict with explicit exclusions for some merchant classes; MCC 5499 remains the conservative modeled scope.
- Issuer card-fee page and general MITC disagree on monthly interest (3.49% vs 3.75%); card-specific fee FAQ is modeled and both are retained in notes.
