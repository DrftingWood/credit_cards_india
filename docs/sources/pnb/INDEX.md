# PNB source verification ? 2026-10-26

Rechecked the active PNB RuPay Select card against the current [card detail page](https://creditcard.pnb.bank.in/types6.html), [PNB Rewardz program page](https://creditcard.pnb.bank.in/rewards.html), current [retail-card MITC](https://creditcard.pnb.bank.in/PDF/MITC.PDF), [Schedule of Fees and Charges](https://creditcard.pnb.bank.in/Documents/pnb_sofc.pdf), PNB's [RuPay Select benefit portal guide](https://www.pnb.bank.in/downloadprocess.aspx?fid=W84isAhMU3o3YepWesgT%2Bg%3D%3D), [general eligibility guide](https://creditcard.pnb.bank.in/Documents/HowToApplyNew.pdf), and the [card application form](https://creditcard.pnb.bank.in/Documents/PNB_Form_AIO.pdf). PDFs are archived under `rupay-select/`; a prior `MITC.pdf` is retained.

## Findings and corrections

- Product page confirms active PNB RuPay Select, INR500 joining fee, INR750 annual fee waived after at least one card use in each quarter of the preceding year, INR5 lakh annual income threshold, 2 points per INR150, card page's INR0.25 point value, 300 welcome points within 90 days, domestic 2/quarter and international 2/year lounge access, health checkup, golf/spa/gym, INR10 lakh personal accident cover and UPI compatibility. Application page gives UPI linkable apps; the RuPay portal guide says offer claims use the RuPay Select portal and a INR1 verification payment.
- Current MITC confirms 2.95% monthly finance (35.89% compounded annual), 3.5% forex, fuel waiver of 1% on transactions >INR400 and <INR4,000, maximum INR350 per billing cycle excluding taxes, and charge varies by cash ATM route. Cash advance scalar uses 2% / INR150 minimum at PNB ATMs; notes distinguish other domestic and overseas minimums.
- Annual waiver and fee figures are current; joining/annual add-on fees differ, with add-on joining INR500 and annual NIL. The current active fee structure is represented in the card record.
- PNB Rewardz portal identifies RuPay Select BIN 652859, 2 RP/INR150 and 300 points for first retail/online transaction within 90 days. Point-value conflict: card-specific page and MITC say INR0.25; generic Rewards page says INR0.50. Card-specific INR0.25 is retained and the conflict is explicit. Points expire after 3 years, minimum redemption 1,000; INR99 + GST fee per request is scheduled effective 2026-11-01. Prior unsupported exclusions and INR0.18 realized value were removed.
- Eligibility guide states primary applicants age 21-70 and INR500,000 for salaried/business/self-employed/professional applicants for RuPay Select; application form includes Resident Indian, NRI and PIO statuses. No universal minimum CIBIL score cutoff was established; pre-qualified channel score rules are not generalized.
- No primary issuer launch date was found; removed the unsupported 2022-01-01 date. Card-specific reward exclusions and detailed lounge-roster terms remain unpublished in the reviewed material.

PNB's 2026-07-04 prior audit (domain transition and seeded-field caveat) is superseded for this card by this review. Other PNB records are outside this card's scope.

# PNB LUXURA Metal Credit Card (RuPay) verification — 2026-10-26

Reviewed the [RuPay product page](https://creditcard.pnb.bank.in/types16.html), archived RuPay-specific [product sheet](luxura-rupay/luxura-rupay-product.pdf), combined network [LUXURA FAQ](luxura-rupay/luxura-card-faq.pdf), current [PNB retail MITC](https://creditcard.pnb.bank.in/PDF/MITC.PDF), and official [16-Jan-2026 PNB press release](luxura-rupay/pnb-luxura-launch-press-release.pdf). The three PDFs, including extracted text, are archived in `luxura-rupay/`.

- RuPay product sheet and FAQ confirm 40,000 welcome points after INR50,000 spend within 90 days; the current card HTML instead states 20,000. Retained the RuPay-specific 40,000 figure and documented the conflict.
- Corrected launch date to 2026-01-16; joining/annual fees INR9,000/7,500 + GST, waived at INR250,000 in first three billing cycles / INR800,000 annual spend. Base earn 4/INR100 (INR0.25 per point), 3X travel/dining with no published cap, milestones and RuPay Ekaa benefits confirmed in product sheet.
- FAQ states age 21–70; salaried gross income INR150,000/month, non-salaried INR1.8m/year; CIBIL 700+ salaried/pensioners and 750+ others. Fixed-deposit and staff exceptions apply.
- Removed unsupported realized point value INR0.18; corrected welcome reward; removed unsupported unlimited accelerated cap. Redemption fee of INR99 + GST becomes effective 2026-11-01 in PNB Rewardz terms; applicability to LUXURA requires a post-effective-date check.
- Fuel waiver has strict spend boundaries (>INR500 and <INR4,000), although the schema stores rounded limits; benefit description notes the issuer terms. Whether milestones stack is unspecified. Product HTML and product sheet conflict on welcome points.

# PNB RuPay Platinum verification — 2026-10-26

Rechecked the [current card detail page](https://creditcard.pnb.bank.in/types5.html), [PNB Rewardz program page](https://creditcard.pnb.bank.in/rewards.html), [How to Apply eligibility guide](https://creditcard.pnb.bank.in/Documents/HowToApplyNew.pdf), and current MITC. Existing PNB PDFs are archived under `rupay-select/`.

- Card page confirms NIL joining fee, INR500 annual fee waived when the card is used at least once in each quarter of the preceding year, 1 point/INR100, card-specific INR0.25 value, min redemption 1,000, 300 points on first use within 90 days, INR200,000 accident cover, domestic lounge 2/quarter and international 2/year, and UPI compatibility.
- PNB How to Apply guide states age 21-70 and INR250,000 annual income for Classic Visa/RuPay Platinum applicants. Current card page independently gives the same minimum income. No universal score threshold found.
- Removed unsupported 2022 launch date. No launch date established. PNB generic Rewardz page says INR0.50/point and three-year expiry, whereas card page and MITC say INR0.25; retained card-specific value. Generic Rewardz terms schedule INR99 + GST redemption from 2026-11-01; its application to this card remains to be confirmed.
- Fee effective date is not stated by issuer. Fuel waiver was not confirmed for this variant; the PNB KFS reviewed assigns it to RuPay Select, so not carried over.

# PNB LUXURA Metal Credit Card (Visa Infinite) verification — 2026-10-26

Reviewed the [Visa product page](https://creditcard.pnb.bank.in/types17.html), archived Visa-specific [product sheet](luxura-visa/luxura-visa-product.pdf), shared [LUXURA FAQ](luxura-rupay/luxura-card-faq.pdf), current [PNB retail MITC](https://creditcard.pnb.bank.in/PDF/MITC.PDF), and official [2-Feb-2026 Visa launch announcement](luxura-visa/luxura-visa-launch-press-release.pdf). Two PDFs and extracted text are under `luxura-visa/`.

- Confirmed Visa Infinite launch 2026-02-02, joining/annual fees INR4,999/1,999 + GST, INR150,000 joining-fee reimbursement threshold within three billing cycles, INR600,000 annual-fee waiver, nil forex, base 4/INR100 at INR0.25/point, 3X travel/dining, Visa-specific 20,000-point welcome, milestones and unlimited lounge claim.
- Updated age, income, CIBIL ranges and FD/staff exceptions from the shared FAQ. Added Visa Concierge and the current issuer-sheet Ixigo, BookMyShow and Visa Infinite offer descriptions. No card-specific insurance amounts were found in reviewed sheet/page.
- Removed unsupported realized INR0.18 point value and asserted unlimited accelerator cap. The record flags unpublished MCC exclusions, and the scheduled INR99 + GST redemption fee effective 2026-11-01 needs confirmation for LUXURA.
- Fuel waiver applies only to single transactions greater than INR500 and less than INR4,000; maximum INR350 per billing cycle excluding applicable taxes/charges. Milestone stacking and lounge program conditions remain unspecified.

LUXURA RuPay and Visa Infinite source maps are formalized at `luxura-rupay/issuer-review-2026-10-26.md` and `luxura-visa/issuer-review-2026-10-26.md`; underlying issuer checks fall within one month.
