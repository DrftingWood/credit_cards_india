# Kotak Mahindra Bank — source verification (2026-07-04)

Kotak fee pages are mostly **HTML**, with downloadable card-specific KFS PDFs available for some cards. The central MITC/CA page links consolidated MITC PDFs; GSFC is at `/gsfc.html`. Reward and fee tables on product pages can be JS-rendered and partly resist text extraction.

## Correction found
- **League Platinum** — the card's own Fees & Charges page is titled *"No Joining &
  Annual Fees"* (Kotak League Platinum is lifetime-free). YAML had ₹499/₹499 → corrected
  to **₹0/₹0 (lifetime-free)**.

Reward structures for the Kotak cards were verified against the live pages during the
2026-07-03 audit (PR #42). The JS-rendered fee tables on the remaining cards could not be
fully machine-extracted on re-check; values are HTML-sourced.


## IndianOil Kotak Credit Card (reviewed 2026-10-26)

Reviewed the current [card page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indian-oil-credit-card.html), [rewards/redemption page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indian-oil-credit-card/rewards-redemption.html), [FAQs](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indian-oil-credit-card/faqs.html), [eligibility page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indian-oil-credit-card/eligibility-criteria.html), current Key Fact Statement and September 2026 consolidated MITC. Archived KFS and MITC PDFs under `indianoil-kotak/`.

Removed unsupported 2018-01-01 launch date and unsupported RuPay Platinum network tier. Fees remain INR449 joining/annual with INR50,000 previous anniversary-year waiver; updated finance charge to 3.75% monthly, forex 3.5%, and cash advance 2.5% (minimum INR500). Rewards are 24 points/INR150 at IndianOil (cap 1,200 per statement), 12/INR150 on selected grocery/dining MCCs (cap 800), and 3/INR150 elsewhere. Cashback redemption is 20 paise/point with a 2,000-point minimum; catalogue rate is 25 paise. Fuel surcharge waiver is 1% on INR100-INR5,000 at IndianOil only, capped at INR100 per statement. UPI earns only the base rate regardless of category; RuPay concierge is available on RuPay variants. Eligibility page gives primary applicant age 18-60 and resident India. Income cutoff and bureau score remain unknown.

## 811 #DreamDifferent Credit Card (reviewed 2026-10-26)

Reviewed the current issuer KFS (version KFSDD04062026), consolidated MITC/Reward Card Agreement, current card FAQ and general eligibility FAQ. Archived issuer PDFs in `811-dreamdifferent/`.

This card is distinct from Kotak 811 Credit Card. Kotak says Aqua Gold was rebranded to Kotak811 Dream Different effective 15-Jul-2020. Corrected the stale record name and launch date; retained Visa network based on issuer's Visa ATM FAQ but removed unsupported Classic tier.

Current terms: joining fee ₹424 effective 1-Sep-2026, with no joining waiver; annual fee NIL; finance charge 3.75% monthly; forex markup and DCC 2%; cash advance ₹100 per ATM withdrawal/fund transfer. KFS does not clarify whether the ₹424 is GST-inclusive. Dream Different Reward Points and the milestone program ended 1-Apr-2026; outstanding points had to be redeemed by 30-Sep-2026 and are now expired. Prior earn rates were 2 points per ₹100 online and 1 per ₹100 other eligible spends. Current fuel waiver is 1% on ₹500-₹4,000, capped ₹3,500 per anniversary year. Railway waiver is 1.8% online / 2.5% other booking, capped ₹500/year. The card remains FD-backed (minimum ₹10,000 deposit since 1-Apr-2025); limit may be up to 90% of the FD. Numeric income cutoff remains unpublished.

Important conflict resolved: older Kotak 811 web content showed benefits for a separate ₹500 annual-fee Kotak 811 Credit Card (including ₹75,000 PVR milestone and ₹50,000 annual waiver). Those terms were removed from Dream Different. Current Dream Different MITC has multiple historical milestone variants (card-number and design-specific) and confirms the program ended; no single current welcome or milestone offer is published.

## Kotak Air+ Prime Credit Card (reviewed 2026-10-26)

Reviewed current Air+ Prime features, fees/reward webpages, detailed card T&Cs, card-specific KFS and consolidated MITC. Archived these three PDFs in `air-plus-prime/`.

Corrected the 2025-01-01 placeholder launch date to unknown because no primary source date was found. Kept Visa network but cleared unsupported Visa Signature tier. Updated fees (INR3,000 + GST; annual waiver at INR4 lakh, exclusions apply), monthly interest, cash advance minimum and 2% forex; corrected rewards to 2 base / 5 on Kotak Unbox travel and selected auto MCCs, plus 2 on insurance MCC6300 up to INR25,000 statement spend. Added welcome/renewal miles, lounge, fuel waiver and expiries. Current detailed T&Cs say voucher redemptions are INR0.50 per mile, while the current product page says INR5; this tenfold issuer conflict is recorded as unresolved. Numeric income/credit-score thresholds and launch date remain unpublished.

## Kotak Air+ Credit Card (reviewed 2026-10-26)

Reviewed the current Kotak Air+ product/value page and card FAQs, the 12-Mar-2026 KFS, consolidated MITC and detailed card T&Cs; archived three issuer PDFs under `air-plus/`.

Corrected the unsupported 2025-01-01 launch date and Visa Signature tier. Updated the INR3,000 + GST fees, current waiver threshold in the KFS/MITC (INR4 lakh anniversary retail spend), 3.50% monthly interest, cash advance 2.5%/INR500 minimum, 2% forex and current rewards. Current earn: 2 Air Miles/INR100 base and 5/INR100 on Kotak Unbox flights/hotels, capped at 15,000 extra miles per statement cycle; base rate remains after cap. Added 2,500 welcome and renewal miles, four domestic/two international lounge visits, 1% fuel waiver on INR400-INR7,500 (INR4,500 anniversary cap), exclusions and 3-year expiry.

Source conflict: the current product FAQ says there is no annual-fee waiver, while the current KFS and consolidated MITC specify the INR4 lakh spend waiver. The KFS/MITC schedule is encoded and the FAQ conflict is recorded. No issuer launch date or card-specific income/bureau cutoff was found.

## Kotak Air Credit Card (reviewed 2026-10-26)

Reviewed the current [Air product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-air-credit-card.html), [card FAQ](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-air-credit-card/faqs.html), current [KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/Key-fact-statement-kfs-kotak-air-cc.pdf), and consolidated MITC. Archived the KFS and MITC under `air/`.

Corrected the unsupported launch date and Visa Signature tier. Current fee snapshot: INR999 + GST joining and annual fees, 3.75% monthly finance charge, 2.5% cash advance fee (INR500 minimum), and 3.5% foreign-currency markup. The annual waiver threshold is unresolved across current issuer sources: KFS/MITC says INR250,000 qualifying retail spend, the card FAQ says above INR200,000, and the product-fee page says waiver unavailable; the YAML represents the KFS/MITC value at medium confidence and records the conflict.

Current rewards are 1 Air Mile/INR100 on eligible purchases and 3/INR100 on Kotak Unbox flight/hotel bookings; the accelerator is limited to 5,000 incremental miles per statement cycle, after which base earn continues. Travel redemption is INR1/mile; instant voucher redemption is INR0.50/mile. Current FAQ/page also confirms the welcome and renewal bonuses, four domestic lounge visits (INR60,000 prior-quarter spend gate, two per quarter), fuel surcharge waiver, exclusions and three-year expiry. Product-specific numeric income and bureau cutoffs and launch date remain unpublished. The generic Kotak eligibility page supplies age 18 and Indian residency only.


## Kotak League Platinum Credit Card (reviewed 2026-10-26)

Reviewed the current [League card page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/league-platinum-card.html), [FAQ](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/league-platinum-card/league-platinum-card-faqs.html), [fees page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/league-platinum-card/fees-and-charges.html), [eligibility page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/league-platinum-card/eligibility.html), current [KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-league-platinum.pdf), and consolidated MITC. Archived the KFS under `league-platinum/`; current consolidated MITC PDF is already archived under `air/`.

Corrected the unsupported 2015 launch date and network tier. Current KFS states INR499 joining and annual fees, INR50,000 annual retail-spend fee waiver, 3.75% monthly finance charge, 3.5% forex and cash advance at 2.5% (INR500 minimum). Joining may be NIL through some acquisition variants. Current reward schedule is 4 points/INR150 base, 8/INR150 on specified special merchant categories, and displayed 8/INR150 on all eligible categories after INR200,000 anniversary-year spend; issuer does not explain whether the higher rate is retroactive. Catalog points are INR0.10; statement cashback is INR0.07. Fuel and multiple MCC groups are excluded; utilities earn only through INR35,000 per statement cycle. Welcome points apply only to the paid joining-fee variant. Milestone benefit is INR125,000 every six months for 4 PVR tickets or 10,000 points. Current FAQ says no complimentary lounge benefit.

Card-specific eligibility page says age 21-60, annual income INR500,000+, Indian residency and a limited serviceable-city list; the general Kotak FAQ gives League's upper age as 65, so the record follows the card-specific page and logs the conflict. The issuer does not divide the INR500,000 income threshold by salaried/self-employed type; those numeric schema fields remain null. No launch date or card-specific credit-score cutoff was found.


## PVR INOX Kotak Credit Card (reviewed 2026-10-26)

Reviewed Kotak's current [PVR INOX card page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/pvr-inox-kotak-credit-card.html), [card-specific KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-pvr-inox.pdf), current consolidated MITC/PVR-specific terms, [eligibility terms](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/pvr-inox-kotak-credit-card.html), and the current [PVR acquisition offer](https://www.kotak.bank.in/en/offers/offer-details-netbank/1234583111/pvr-inox.html). Archived the KFS under `pvr-inox/`; the current consolidated MITC is archived under `air/`. The linked acquisition-offer PDF returned HTTP 403 and was not archived; the live issuer offer page was reviewed.

Removed the unsupported 2024-01-01 launch date, Visa/Platinum scalar, airport lounge quota, generic fuel surcharge waiver and invented INR0.25 reward-point redemption rate. Current KFS version KFSPIO12032026 lists NIL joining fee, INR499 annual fee, INR299 add-on fee, no annual-fee waiver, 3.75% monthly finance, 3.5% forex/DCC and cash advances at 2.5% (INR500 minimum). The card has no general-purpose points model in current issuer material; it instead awards one INR300 PVR INOX M-Coupon per INR10,000 eligible billed spend per monthly cycle. Current terms allow claims within two billing cycles and coupon use within 60 days; the ticket-price excess, booking fees and taxes are paid by the cardholder. The issuer's table leaves exactly INR10,000 unspecified while its prose says a ticket for every INR10,000, so that boundary remains documented as ambiguous. The bank's general terms reserve a right to cap tickets, although the current product page advertises continued accrual. Current card page also lists 20% food/beverage and 5% ticket discounts and complimentary entry to in-cinema lounges; these are not airport lounge benefits.

A current offer through 31-Dec-2026 provides a PVR voucher worth INR400 for applicants who apply via the PVR app, are issued the card and make a transaction of INR500 within 30 days. It is represented as a channel/time-limited welcome promotion, not an unconditional core benefit. Card-specific eligibility page states age 21-60 and Indian residency; numeric income and bureau-score requirements, card launch date and network variant are not established by the current issuer material reviewed.


## Kotak UPI RuPay Credit Card (reviewed 2026-10-26)

Reviewed Kotak's current [UPI RuPay card page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-upi-rupay-credit-card.html), card-specific [KFSKUR12032026](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/KFS-Kotak-UPI-Rupay-CC.pdf), consolidated [MITC/RCAS](https://www.kotak.bank.in/content/dam/Kotak/files/english-rcas.pdf), and current Kotak Rewards notice. Archived the KFS in `upi-rupay/`; consolidated MITC is archived under `air/`.

Corrected the unsupported launch date (2023-01-01) and RuPay Platinum tier; the 2023 issuer release describes RuPay cards on UPI generally, not this product launch or tier. Updated finance charge to 3.75% monthly, retained 3.5% forex/DCC, removed the cash-advance fee because the facility is unavailable, and recorded no add-on card facility. Reward accrual is 3 points per INR100 on eligible UPI and regular card purchases, with utility earn capped at INR35,000 per statement cycle and points accruing only on completed INR100 increments. Current exclusions include fuel, railway, wallet loading, rent, insurance, government, online skill-based gaming, education, EMI and balance transfer. Catalog value is INR0.10/point; statement-credit value is INR0.07/point with a 2,000-point minimum.

Removed the unsupported fuel-surcharge waiver, age, income and credit-score assumptions. Current card-specific age/residency criteria were not found; product-page 18+ language applies to redemption by existing cardholders. Issuer conflict remains: KFS gives a INR35,000 utility-fee threshold while consolidated MITC lists INR50,000 for UPI RuPay. Product-page generic cash-redemption prose still states the older INR0.10 value/1,000-point minimum; current Kotak Rewards notice and consolidated MITC state INR0.07/2,000 and are modeled, with the discrepancy logged.


## Kotak Infinite Credit Card (reviewed 2026-10-26)

Reviewed Kotak's current [features page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/wealth-management-infinite-credit-card/features.html), [fees page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/wealth-management-infinite-credit-card/fees-and-charges.html), [eligibility page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/wealth-management-infinite-credit-card/eligibility.html), [reward-redemption page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/wealth-management-infinite-credit-card/reward-redemption.html), current consolidated MITC, card KFS, June 2025 change notice and issuer lounge list. Archived the KFS, June 2025 notice and lounge list under `infinite/`; consolidated MITC already exists under `air/`.

The live issuer product page says Wealth Infinite is discontinued for new sourcing and the page is for existing cardholders. Changed application status to `on-hold`, retained the existing-cardholder benefits, and removed unsupported 2018-01-01 launch date and Visa/Infinite network assignment. Current fee values: NIL joining/annual/add-on fees subject to continued banking-program eligibility, 2% foreign-currency/DCC markup, 3.5% monthly finance, and 2.5% cash advance with INR500 minimum. June 2025 notice and current fees page supersede older KFS/residual feature-page copy showing 3.1% monthly finance; fee ineligibility could make program-linked fees payable.

Corrected earning to 1 point per INR125, integer multiples only. Current MITC states cashback at INR0.70/point with 2,000-point minimum, two-year expiry, exclusions and a bank-reserved non-numeric points cap. The issuer still advertises 800 monthly bonus points as worth INR800; modeled their cashback realization at INR560 and documented the displayed-value discrepancy. Current benefits: 4 domestic lounge entries per quarter, two monthly golf rounds plus one quarterly guest round for two friends, concierge, fuel waiver 1% on INR400-INR7,500 transactions up to INR4,500/calendar year, and railway surcharge waiver up to INR500/calendar year.

Age maximum is unresolved because current card-specific pages show 65 and 60. India residency and Private Banking relationship are published; income/score cutoffs are not. Exact launch date and network variant are not established by current primary issuer sources.


## Kotak White Credit Card (reviewed 2026-10-26)

Reviewed the current [White product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-credit-card.html), [White Pass page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-credit-card/whitepass.html), [KFS version KFSWS12032026](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/KFS-White.pdf), current [consolidated MITC](https://www.kotak.bank.in/content/dam/Kotak/Customer-Service/others/mitc-wealth-and-white-reserve.pdf), [1-Apr-2026 change notice](https://images.kotak.bank.in/bank/mailers/2026/files/WhiteFees%26Charges.html), and current [lounge terms](https://www.kotak.bank.in/content/dam/Kotak/gsfcfiles/credit-cards/lounge-access-tnc.pdf). Archived the KFS and lounge/list documents plus the 2026 change notice under `white/`; all four PDFs have valid `%PDF-` signatures.

Removed unsupported Mastercard/World assignment and 2022-01-01 launch date. Corrected rewards to milestone-only White Pass: INR2k at INR2L, INR4k additional at INR4L, INR6k at INR6L, INR7k at INR9L and INR8k at INR12L settled anniversary-year spend, up to INR27k/year; catalog value INR1, cashback INR0.70, with 90 days after anniversary to claim. Education and transportation are excluded effective 1-Apr-2026. Updated fees (INR3,000 + GST; INR5L annual retail spend waiver), APR, forex and cash-advance fees. Added issuer-published primary age 28-60, annual income INR25L+, Indian residency and serviceable-city list. Current lounge notice requires INR1L calendar-quarter spend for 2 visits in the following quarter; international access is 4/year, subject to validation/guest charges. Documented the calendar-year versus anniversary-year surcharge-cap wording discrepancy and programme eligibility condition. Concierge, network variant, launch date, employment-type income split and bureau cutoff are not established.


## Kotak Cashback+ Prime Credit Card (reviewed 2026-10-27)

Compared the current [product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-cashback-plus-prime-credit-card.html), [card-specific reward terms](https://www.kotak.bank.in/content/dam/Kotak/files/t-and-c-cb-plus-prime.pdf) and [KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/kfs-cashback-plus-prime-credit-card.pdf). Corrected APR, fees, unavailable cash advance, accelerated shared cap, MCC exclusions, insurance base earn and fuel waiver. Removed unsupported network variant and launch date; unresolved variant and eligibility details are in `cashback-plus-prime/issuer-extract-2026-10-27.md`.


## Kotak Cashback+ Credit Card (reviewed 2026-10-27)

Compared current product/claim pages, card-specific Cashback+ terms and KCBKFS04062026. Corrected fee/APR/cash advance, reward cap and exclusions, RuPay variant treatment, current cashback redemption minimum and fuel waiver. Expired movie offer copy is not treated as current. Unresolved details are in `cashback-plus/issuer-extract-2026-10-27.md`.

## IndiGo Kotak Premium Credit Card (XL) — reviewed 2026-10-27

Reviewed current Kotak features/fees/value/offers pages, card-specific co-brand terms, KFSIKXL12032026, consolidated MITC, rewards MCC schedule, lounge list/terms and the 2025 relaunch announcement. Archived six card-specific PDFs and four page captures; consolidated MITC is already archived under `air/`.

Corrected fees (INR3,000 joining/annual, 3.5% forex, 3.75% monthly finance, 2.5% cash advance with INR500 minimum), BluChip rewards (2/INR100 base, 3 dining/entertainment, up to 21 on direct flights by member tier), milestones/welcome and lounge terms. Cleared unsupported network/tier, residency, general fuel exclusion, EMI exclusion, fuel-surcharge waiver and broad baggage assistance. Details and caveats: `indigo-xl/issuer-extract-2026-10-27.md`.

Open conflicts: limited joining-fee waiver offer versus generic no-welcome-if-waived terms; lounge list variant names do not exactly match current product name; BluChip value is dynamic. BluChip rupee estimates are project-level modeled estimates only.

## IndiGo Kotak Credit Card (base) — reviewed 2026-10-27

Reviewed Kotak's current product/benefits and fees pages, current retail MITC, co-brand terms and rewards MCC schedule, plus official relaunch notice. Archived product/fee captures and the current consolidated MITC; co-brand terms and MCC schedule were already archived under the adjacent IndiGo XL evidence directory after the issuer CDN returned HTTP 403 during the base-card download.

Corrected the flight decomposition (3 card BluChips per INR100, not copied XL rate 5), base and dining rates, base-card milestone thresholds and voucher amounts. Updated fees/APR/cash-advance minimum, network scalar (variants include RuPay), eligibility, and removed unsupported fuel waiver and lounge/priority claims. Legacy migrated fee variants and generic 6E Meals welcome-copy discrepancy remain documented. Claim-level evidence: `indigo/issuer-extract-2026-10-27.md`.

## Kotak Solitaire Credit Card — reviewed 2026-10-27

Reviewed current Solitaire product/rewards/fees pages, KFSKS04062026, shared retail MITC, detailed Solitaire T&Cs dated 7-Apr-2026, reward MCC schedule, lounge lists and current Visa/District offers. Archived three current page captures and the KFS; card-specific detailed T&Cs were readable via issuer PDF but direct download returned HTTP 403. See `solitaire/issuer-extract-2026-10-27.md`.

Corrected the unsupported launch date/network tier, program-linked annual fee, 3.5% monthly finance charge, travel earn/cap, redemption options and partner ratios, guest lounge limits and fuel-waiver cap. Removed unsupported golf and speculative partner INR values. Open differences include two versus three add-on cards across issuer page sections and conditional annual fee presentation between product page and KFS.

## Kotak Zen Credit Card — reviewed 2026-10-27

Reviewed product, fees, rewards redemption, milestone and eligibility pages, card-specific KFSZS12032026 and consolidated retail MITC. Corrected finance/cash advance terms, redemption values, lounge visit quotas, fuel waiver, milestone awards and published age/income/location criteria; removed unsupported launch date and Visa tier. Exact network tier, launch date, domestic lounge guest entitlement and separate income thresholds by employment type remain unpublished. Claim-level evidence: `zen-signature/issuer-extract-2026-10-27.md`.
