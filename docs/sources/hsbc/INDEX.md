# HSBC source verification ? 2026-10-26





Reviewed the live [RuPay Cashback product page](https://www.hsbc.bank.in/credit-cards/products/rupay-cashback-credit-card/), its [card MITC](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-cashback/hsbc-rupay-most-important-tncs.pdf), [card Services Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-cashback/rupay-cashback-credit-card-services-guide.pdf), the [0% forex offer terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/forex-terms-and-conditions.pdf), the current [INR500 welcome offer terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-cashback-welcome-offer.pdf), and the [EazyDiner offer terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-eazydiner-tnc.pdf). Current PDFs are archived locally in `rupay-cashback/` (gitignored by project policy).





## Corrections and findings





- Removed the unsupported 2024-01-01 launch date and Platinum network-tier assertion. The card appears to have launched in July 2025 per secondary coverage, but no primary issuer launch announcement was located; `launched_on` remains unknown. RuPay is the domestic network; the issuer says international acceptance is powered by JCB, but the schema supports one scalar network.


- Current fees: INR499 joining and annual; annual fee reversed in full if eligible spend across primary and add-on cards exceeds INR200,000 in the anniversary year. Cash advance costs 2.5%, minimum INR500. Finance charge is 3.75% monthly (45% annual).


- MITC standard forex conversion markup is 3.5%; separate HSBC offer provides 0% on eligible foreign-currency transactions from 15-Jul-2025 through 31-Dec-2026. The card data snapshot represents the current 0% offer and notes the base markup/expiry.


- Service Guide and product page confirm 10% dining/food delivery/groceries and 1% other eligible spend, combined cashback cap INR400 per billing cycle. Extensive MCC/category exclusions are documented in notes; eligible UPI card transactions do not have a separate accelerator. Cashback is statement credit.


- Current product page advertises two local lounge visits per quarter and two international visits per year, while the older Service Guide summary says four complimentary visits, one per quarter. YAML follows current product page and records the conflict; issuer lounge list/operational conditions should be confirmed before use.


- Current offers documented: INR500 after INR10,000 eligible spend within 30 days of issuance (apply by 31-Dec-2026); INR250 Amazon voucher for online application/VKYC/issuance through 31-Oct-2026; two months EazyDiner Prime on activation through 31-Dec-2026. Offer expiry means these need a fresh update after the applicable end date.


- Removed unsupported fuel surcharge waiver. Eligibility page publishes salaried age 18?65 and INR600,000 annual income, self-employed age 25?65 and INR1,200,000 annual income, Indian residency and city restrictions. Numeric credit-score cutoff is unpublished.


- No official launch date or credit-score cutoff was established. HSBC's page's transient offer text varies by crawl; archived official forex T&C sets the offer end date to 31-Dec-2026, which is used here.





Previous HSBC source audit notes follow in repository history; this index refreshes only the RuPay Cashback review.






## HSBC TravelOne (reviewed 2026-10-26)



Reviewed the current [TravelOne product page](https://www.hsbc.bank.in/credit-cards/products/travelone/), [rewards page](https://www.hsbc.bank.in/credit-cards/products/travelone/rewards/), [MITC](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/most-important-terms-and-conditions.pdf), [Service Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/aw-travel-one-sevice-guide-11-12-2025.pdf), [KFS](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-card-key-fact-statement.pdf), [Rewards Programme T&C](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/hsbc-rewards-tcs.pdf), [introductory offer T&C](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/introductory-benefits-tnc.pdf) and [milestone offer T&C](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/milestone-benefits-2-tnc.pdf). The six issuer PDFs were downloaded and verified as PDF files under `travelone/`; archive files are gitignored by project policy.



### Corrections



- Cleared unsupported launch date; retained Mastercard World based on current Mastercard World Platform product-page language.

- Fees: INR4,999 joining and annual, annual fee fully reversed when eligible spend across primary/add-on cards exceeds INR800,000 during card anniversary year; 3.5% forex; 3.75% monthly finance; cash advance 2.5%/INR500 minimum. Add-on card fees are NIL.

- Rewards: 2 points/INR100 base; 4 points/INR100 on eligible airline/travel-aggregator and non-DCC foreign-currency transactions; cap 50,000 accelerated points per calendar month, then base rate. INR50-level transaction remainder carries forward. DCC foreign-currency accelerator is excluded; airline/OTA spend in foreign currency earns one additional point/INR50.

- Replaced the stale 50,000 annual cap with the current monthly cap. Removed unsupported fixed INR valuations for all partner programs; retained the 20 issuer-published transfer partners and ratios. The issuer says catalogue redemption value varies by card/category (general HSBC page range INR0.25?1.00); no TravelOne-specific fixed value or cash conversion is claimed.

- Replaced the partial MCC exclusion list with the complete 12 MCC groups published in the TravelOne Rewards T&C, and documented non-MCC exclusions (cash advances, fees/charges, disputed transactions and IEMI).

- Welcome offer: apply 1-Jul-2026 through 31-Dec-2026, use the mobile app and spend INR25,000 within first 30 days for INR1,000 cashback, INR3,000 Postcard voucher and 3 months EazyDiner Prime. An online/VKYC/issuance Amazon INR250 offer is valid through 31-Oct-2026. The milestone offer is documented as 10,000 points on INR1,200,000 net eligible anniversary-year spend; product-page wording says ?more than? INR1,200,000, while the PDF says INR1,200,000, so this threshold wording conflict is retained in the record.

- Current product page confirms 6 local and 4 international lounge visits per year, purchase protection up to USD20,000/year and current travel, dining, events, movies, duty-free and StayVista offers. Removed the unsupported fuel surcharge waiver.

- Eligibility page publishes salaried age 18?65/income INR600,000 yearly, self-employed age 25?65/income INR1,200,000 yearly, resident Indian status, and a list of eligible cities. No numeric score cutoff is published.

- Current HSBC [reward redemption guidance](https://www.hsbc.bank.in/credit-cards/how-to-redeem-credit-card-reward-points/) says values vary by card and redemption category and points are not exchangeable for cash or credit.



## HSBC Taj Credit Card (reviewed 2026-10-26)



Reviewed the current [Taj product page](https://www.hsbc.bank.in/credit-cards/products/taj/), [rewards page](https://www.hsbc.bank.in/credit-cards/products/taj/rewards/), Taj [Important Terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/taj/hsbc-taj-important-terms-and-conditions.pdf), [Service Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/taj/hsbc-taj-service-guide.pdf), current shared [Key Fact Statement](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-card-key-fact-statement.pdf), [offer terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/taj/hsbc-taj-offer-tnc.pdf), [airport lounge T&Cs](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/taj/taj-airport-lounge-tnc.pdf), and [EazyDiner offer T&Cs](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/taj/eazydiner-taj-tnc-new.pdf). Six issuer PDFs were downloaded to `docs/sources/hsbc/taj/`, with the shared KFS at `docs/sources/hsbc/_shared/`.



### Corrections and open conflicts



- Corrected network from Mastercard World Elite to Visa Infinite. Used issuer launch announcement dated 2024-12-17 as launch date evidence.

- Corrected fees to INR110,000 joining/annual; forex markup 1.99%; finance charges 3.75% monthly; cash advance 2.5%, minimum INR300.

- Replaced 5 points/INR100 flat rate with 1.5 points/INR100 standard and 5 points/INR100 at Taj, SeleQtions, Gateway, Vivanta and am� Stays & Trails. Corrected redemption from statement credit to the closed-loop HSBC Taj Wallet at INR1 per 1.5 points. The issuer says points post monthly and wallet use is restricted to participating IHCL stays, food and spa.

- Rebuilt airport lounge access as unlimited domestic Visa and unlimited international Priority Pass for the primary cardholder; airport lounge access has no guest count in the card-specific lounge terms. Kept hotel Chambers Lounge separately as a hotel benefit for cardholder plus guest, up to 12/year.

- Removed unsupported INR40,000 welcome valuation. Added activation/renewal vouchers and current dining, golf, pool, spa, transfer, duty-free, entertainment, Starbucks and other offers with terms/validity caveats.

- Current product page eligibility states age 25-75, salaried income INR36 lakh, self-employed INR45 lakh, and resident Indians or NRIs with an HSBC India bank account. Card-specific Important Terms conflict: INR40 lakh/INR60 lakh, resident-only and invite basis, with a narrower city list. Structured data follows the currently presented product page; conflict is retained in the card record. No numeric credit-score cutoff was found.

- The current page states 12 golf games and lessons/year but does not make clear whether this is one shared count or two separate counts. The record carries only the published headline count and documents the ambiguity.



## HSBC Live+ (reviewed 2026-10-27)



Compared HSBC's [current Live+ product page](https://www.hsbc.bank.in/credit-cards/products/live-plus/), the linked current [Live+ Service Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/live-plus-credit-card-services-guide.pdf), current [Important Terms and Conditions](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/visa-cashback/terms-and-condition.pdf), [Key Fact Statement](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-card-key-fact-statement.pdf), [welcome cashback T&Cs](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/live-plus-welcome-cashback.pdf), and [fuel contactless offer T&Cs](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/offers/visa-platinum-and-liveplus-fuel-contactless-offer-tncs.pdf). Seven issuer PDFs (including Visa campaign terms) are archived in `live-plus/` with retrieval date 2026-10-27.



The record was updated to Visa Infinite; current fees (INR999 joining/annual, annual fee reversed after eligible spend exceeds INR200,000, 3.75% monthly finance, 1.99% forex and 2.5%/INR500 cash advance); current cashback of 10% on eligible dining, food delivery, grocery, shopping and utility MCCs with a combined INR1,200 monthly cap plus 1.5% on most other eligible domestic spend; fuel/international/category exclusions; 2 domestic and 1 international lounge visits; active INR1,000 welcome offer (not stackable with competing welcome offers), alternative Visa Infinite INR750 voucher offer, INR250 quarterly contactless-fuel offer, and card-specific published eligibility. Unverified launch date was cleared. Detailed MCC categories are in the archived Service Guide and encoded in the YAML.



Open conflicts: older general Service Guide and FAQ passages differ from the updated Live+ summary/product page on international cashback and lounge count; issuer terms do not state whether 10% category transactions earn 1.5% after the monthly accelerator cap. Current Live+ specific summary/product claims were applied and the older text is documented as stale/conflicting.





## HSBC Premier Credit Card (reviewed 2026-10-27)

Reviewed the current [Premier product page](https://www.hsbc.bank.in/credit-cards/products/premier/), [Premier rewards page](https://www.hsbc.bank.in/credit-cards/products/premier/rewards/), [Premier fees](https://www.hsbc.bank.in/premier/fees-and-charges/), card-specific [Important Terms and Conditions](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/premier_cc_tariff_mitc.pdf), [introductory offer terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/introductory-offers-tc-premier-credit-card.pdf), current [HSBC Rewards Terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/hsbc-rewards-tcs.pdf), current [Travel with Points offer](https://www.hsbc.bank.in/premier/offers/special-offers/travel-with-points-most-rewarding-travel-companion-in-partnership-with-hoppers-31-12-2026/), and [personal travel insurance terms](https://www.hsbc.bank.in/premier/features/mastercard/travel-insurance-terms-and-conditions/). Three issuer PDFs are archived in `premier/` with retrieval date 2026-10-27.

Corrected the unsupported INR16 lakh card-spend annual-fee waiver (the issuer waives renewal for qualified Premier customers), 2.99% monthly finance charge, and 2.5% cash-advance fee with INR300 minimum. Updated rewards to 3 points/INR100 and removed unsupported INR-per-point estimates for transfer partners. Current transfer ratios are retained; point value is redemption-specific, with INR1/point advertised for Apple. Archived reward terms document the full MCC exclusion list. Current travel offer page says 6X flights and 12X hotels through 2026-12-31. The product page?s car-rental 12X claim conflicts with the offer page?s generic 2X car-rental wording, so no car-rental multiplier is encoded. Added the current 20,000-point welcome offer with its offer period and 30-day first-transaction condition. Removed unsupported launch date and Mastercard World Elite tier, unsubstantiated golf quota, and numeric insurance limits.

Open issues: exact launch date and Mastercard scheme tier are not confirmed on current issuer card pages; insurance terms page does not publish coverage limits; the relationship TRB threshold differs for Premier accounts opened before 2026-01-01; and travel accelerator conditions may change after 2026-12-31.


## HSBC RuPay Platinum Credit Card (reviewed 2026-10-27)

Compared the current [product page](https://www.hsbc.bank.in/credit-cards/products/rupay-platinum-credit-card/), [rewards page](https://www.hsbc.bank.in/credit-cards/products/rupay-platinum-credit-card/rewards/), card-specific [MITC](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-platinum/hsbc-rupay-most-important-tncs.pdf), [Service Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-platinum/hsbc-service-guide.pdf), current [Key Fact Statement](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-card-key-fact-statement.pdf), [welcome cashback terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/platinum-welcome-offer-terms-and-conditions.pdf), and [EazyDiner terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/credit-cards/rupay-eazydiner-tnc.pdf). Five issuer PDFs with extracted text are archived in `rupay-platinum/` (retrieved 2026-10-27). The existing shared HSBC Rewards Terms PDF in `premier/` was also checked for RuPay Platinum partner ratios, exclusions and travel accelerator rules.

Corrected the unsupported 2024-01-01 launch date, updated monthly finance charge to 3.75%, and replaced speculative rupee valuations with current card-specific partner transfer ratios and redemption caveats. The current travel portal terms state up to 6X on qualifying travel bookings, capped at 18,000 accelerated points per calendar month; point expiry is three years for Platinum. Updated the welcome offer to INR500 cashback for app download/login and INR5,000 eligible spend within 30 days, plus the INR250 Amazon voucher (online + VKYC offer through 2026-10-31) and two-month EazyDiner Prime membership. Corrected eligibility to the current age/income/residency/city criteria, and encoded 1% fuel waiver for INR400-INR4,000 fuel transactions with the issuer?s advertised annual savings up to INR3,000.

The issuer identifies RuPay for domestic/UPI use and JCB for international acceptance, so both networks cannot be represented in the single `network` scalar. Current card page does not advertise airport lounge access. Offer pages are time-limited and will require future refresh.


## HSBC Visa Platinum Credit Card (reviewed 2026-10-27)

Reviewed the current [Visa Platinum product page](https://www.hsbc.bank.in/credit-cards/products/visa-platinum/), current [rewards page](https://www.hsbc.bank.in/credit-cards/products/visa-platinum/rewards/), [card-specific MITC](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/platinum_mostimp_tnc.pdf), [Platinum Service Guide](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/platinum-ser-guide.pdf), current KFS, [welcome points terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/offers/visa-platinum-introductory-offer-terms-and-conditions.pdf), [EazyDiner offer](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/offers/visa-platinum-eazydiner-welcome-offer.pdf), [fuel contactless cashback terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/offers/visa-platinum-fuel-contactless-offer-terms-and-conditions.pdf) and [District by Zomato terms](https://www.hsbc.bank.in/content/dam/hsbc/in/documents/offers/district-by-zomato-offer-on-hsbc-credit-cards.pdf). Seven PDFs and a live-page extract are in `visa-platinum/` with retrieval date 2026-10-27. The current shared HSBC Rewards Terms archived in `premier/` were also checked for partner ratios, MCC exclusions and accelerated travel cap.

Corrected unsupported launch date; kept zero joining/annual fees; corrected finance charge to 3.75% per month; reviewed current cash-advance fee 2.5%/INR500 minimum and FX 3.5%. Updated reward earn, Travel with Points and Apple Unicorn accelerators, published partner transfer ratios, three-year point validity, exclusions and redemption limitations; removed unsupported partner point-INR estimates. Updated welcome points and current voucher/membership offers, fuel surcharge waiver and contactless fuel offer, District terms, Visa Signature privileges, lost-card cover and current card-page eligibility.

Issuer conflict: the current card page states salaried minimum annual income INR600,000, self-employed INR1,200,000 and 22 eligible cities, while the separate current Visa Platinum eligibility page states salaried INR400,000 and only eight cities, with no self-employed figure. Structured data follows the card product page; conflict is preserved in the YAML/extract. Visa Signature privileges are advertised, but exact issued Visa network tier is not explicitly given, so the network tier is null. No lounge access is listed on the current card page.
