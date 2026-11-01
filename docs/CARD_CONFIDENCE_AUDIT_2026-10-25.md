# Card confidence audit ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 2026-10-25

## Purpose

Establish a measurable baseline for whether the site has enough current,
field-level evidence to present every card confidently. This is a coverage and
risk audit, not a claim that every listed value has been re-read against its
source.

## Card-by-card review notes

Reviewed current issuer product, benefits, eligibility, lounge, and charge-card
fee material on 2026-10-25. Corrected the annual vs joining fee, cash-advance
minimum, removed charge-card finance interest and unsupported late-fee slabs,
updated self-employed income eligibility, corrected travel/purchase insurance
amounts, and removed unsupported lounge guest counts and generic unlimited golf
counts. Reward-transfer valuations without current issuer evidence were removed;
the current voucher example is explicitly labeled as catalog-dependent. The
USD medical limit and seven-day duration are now represented without currency
conversion. Field-level verification paths were added for the supported numeric
claims. `scripts/validate.py` passes after the edits.

Open for this record: effective dates for most current terms are not established; the 4-point/INR100 fuel bonus with a 5,000 bonus-point monthly cap is noted but omitted from calculator value because the cap applies to the bonus component only; point redemption values vary by option, so the model uses the currently advertised 0.5 INR/point Taj voucher as a nominal face-value proxy and leaves statement-credit value unknown; lounge access/guest rules differ by network and location; golf availability depends on current slots and booking conditions; and the page's temporary pause on new applications needs a dated status model. The numeric-coverage audit now has exact field paths for the current supported numeric claims on this record. Do not count this single-record remediation as completion of the full 368-card numeric evidence review.

On 2026-10-25, the current issuer page was reread: it confirms the 1 point/INR40 regular rate, 3X overseas, 50% maximum EazyDiner offer, 44,300 INR-stated Fine Hotels + Resorts value, and current eligibility/welcome conditions. The official benefits page also shows the Taj 10,000 INR voucher for 20,000 points; reward terms expose the fuel 1+4 point split and 5,000 monthly bonus cap. The record now models overseas 3X, the uncapped fuel floor, and the source-bounded voucher value while preserving the component-cap limitation. The stale 25% dining value and unsupported fixed welcome voucher value were corrected; current maximum welcome value is separately supported by the issuer charge-card overview.

### American Express Platinum Reserve

Reviewed current issuer product, benefit, and fee schedule pages on 2026-10-25.
Corrected domestic lounge quota to 12/calendar year capped at 3/quarter and
international Priority Pass to 2 free visits/year; added the INR 50,000 monthly
voucher milestone and INR 10 lakh annual fee waiver; corrected golf to a
spend-gated 2-round monthly benefit; corrected the welcome trigger and air
accident cover; removed unsupported travel-medical cover, point valuations,
transfer ratios, credit-score floor, and complimentary golf lessons. Late fee is
recorded in notes (30% of minimum due, INR 500?1,000) because the current schema
cannot represent its percentage/minimum/maximum formula. The product page says
new India applications are temporarily paused, but the dataset has no dated
application-availability field. Validation passes after the record edits.

Rechecked the current product and benefits pages. Corrected the base earn to 1
point per INR 50 (the record had 1 per INR 40) and updated dining from a fixed
25% to the EazyDiner Prime maximum of 50%, with the published 25%-50% range and
venue variation kept in the notes. Added field paths for dining, welcome terms
and the numeric details in benefit descriptions. Current terms also reconfirm
12 domestic visits/year (3 per quarter), 2 international Priority Pass visits,
the monthly voucher, 10 lakh fee waiver, two-month-prior golf gate, fuel offer,
11,000-point welcome trigger, air cover, 3.5% forex markup, and eligibility.

Open: purchase-protection limits per claim/year are not published on the card
page; promotional benefit face values and variable partner redemption values
should not be presented as cash-equivalent; Reward Multiplier / RewardXcelerator
merchant eligibility and the two-month-prior golf spend gate need schema-aware
modeling. Product terms are captured as observed on 2026-10-25; their original
effective dates are not fully established. The issuer currently pauses new
applications, but the dataset has no dated application-availability field.

### American Express Platinum Travel

Reviewed the live issuer card page and benefits page on 2026-10-25. Replaced
outdated lounge rules with the 1 October 2026 spend-gated rule (2 domestic visits
per quarter; INR 70,000 preceding-quarter spend for Q4 2026, then INR 1 lakh per
quarter from Q1 2027). Removed the obsolete 8-visit annual claim, unsupported
international free visits, travel-medical cover, point value estimates and
transfer ratios. The current product page lists the INR 4 lakh/10,000-point and
INR 7 lakh/INR 20,000 Taj gift card milestones; the detailed benefits page still
shows the former INR 1.9/4/7 lakh ladder and INR 10,000 Taj voucher, so the card
page's current dated terms were used and the conflict is noted for follow-up.
Updated welcome spend, current fee schedule, reward exclusions, and eligibility;
application acceptance is temporarily paused. Validation passes.

Open: fee schedule late-payment percentage/minimum/maximum is not representable
as slabs; lounge quarter transitions and Reward Multiplier merchant eligibility
need richer calculator modeling; current FX markup needs a fresh source check;
point values vary by Platinum Travel Collection option and are not a universal
rate. The card's effective dates are observation dates pending a historic terms
source.

### American Express SmartEarn

Reviewed the live issuer product, reward calculator, fee schedule and eligibility
page on 2026-10-25. Corrected merchant-specific 10X/5X rates and separate monthly
caps (500-point caps for the two 10X groups and 250 for Amazon), rather than
applying a combined uncapped rule broadly. The general 1 point/INR 50 base and
exclusions are recorded; unsupported point-value assumptions were removed.
The live page clarifies 10X means 1 regular plus 9 additional points per INR 50,
and 5X means 1 regular plus 4 additional points. Explicit source paths now cover
the multiplier and effective-rate fields as well as cap values. Partner lists
can change, so merchant eligibility remains a source-maintenance risk.
Added the INR 40,000 renewal fee-waiver threshold, INR 500 welcome cashback
condition, and each separate INR 500 annual voucher milestone. Eligibility now
uses issuer thresholds (INR 4.5 lakh salaried, INR 6 lakh self-employed) and no
unsupported score floor. HPCL fee rules and current temporary pause on new
applications are called out. Validation passes.

Open: issuer reward merchant lists/caps can change and require richer merchant
applicability in the calculator; fee schedule delinquency formula is kept in
notes because the schema only supports slabs; present reward-catalogue point
values vary. The source currently says new India applications are paused, but
status has no temporary application-pause field.

### American Express Centurion

Reviewed the current issuer Centurion MITC and current Membership Rewards / lounge
terms on 2026-10-25. Fees remain INR 7 lakh joining (effective 19 January 2021)
and INR 2.75 lakh annual; cash advance is 3.5% with INR 250 minimum. Charge-card
finance interest is not applicable. Corrected delinquency terms to the MITC's
2.5% of unpaid balance with INR 500 minimum (notes, because the schema cannot
represent it). Replaced unsupported insurance figures with current MITC amounts:
INR 10 crore primary air-accident cover, USD 250,000 overseas medical, INR 1 lakh
baggage/passport limits, INR 50,000 missed flight, and INR 1 lakh delayed baggage.
Removed unverified transfer ratios, point values, guest counts and golf quotas.

Open: issuer materials conflict on base earn (general FAQ implies 1 point/INR 50
for cards other than Platinum/Gold; RewardXcelerator uses 6 standard points per
INR 200 for Centurion). Removed the provisional INR 50 rate from scoring and
made base rate and denominator nullable; until Centurion-specific earn terms are
available, the estimate excludes base rewards and flags the missing rate.
Centurion-specific current fuel fees/waiver, golf access, and
hotel/status partner bundle need primary cardmember terms; lounge guests vary by
provider. Numeric review for this card is not complete until those are resolved.

### AU Bank Ananta

Rechecked the current card page, Key Fact Statement, member agreement, welcome
terms, and Ananta lounge terms on 2026-10-25. Corrected the forex markup to
3.49%, monthly finance charge to 3.75%, and cash advance minimum to INR 500;
recorded the published late-fee and fair-use fee formulae in notes because the
schema cannot represent them. Renewal fee waiver is INR 3 lakh eligible retail
spend in the card anniversary year; joining fee is not waived. Updated earn
rates and separate 5,000 accelerated / 25,000 total statement caps. Point value
remains unknown: the Ananta milestone table implies INR 0.25 per point while
the generic AU FAQ lists INR 0.0025 per point for catalogue and INR 0.002 for
vouchers, a 100x discrepancy. The four anniversary milestones preserve their
explicit INR values without applying a generic valuation.

Recorded four quarterly domestic lounge visits with the INR 5,000 AU Rewardz
flight-booking gate, primary-cardholder and QR rules, and no complimentary
guest assumption. Added the 8,000-point welcome trigger/window, partner discount
and travel EMI conditions, fuel-waiver terms, and salaried/self-employed age
ranges. The issuer lists protection types, but Ananta-specific limits remain
unverified. Network-variant partner offers are noted. `scripts/validate.py`
passes. Numeric evidence audit after this record: fees 424/2,401 (18%), rewards
347/3,011 (12%), benefits 212/3,074 (7%), eligibility 313/313 (100%); these
figures measure explicit source paths, not factual correctness.

### AU Bank CA Metal

Rechecked the current AU CA product page, 6 Mar 2026 card-specific rewards MCC
PDF, 30 Sep 2026 Key Fact Statement and current AU card insurance terms on
2026-10-25. The card is now recorded as lifetime free; the current KFS gives
2.99% monthly finance, INR 500 minimum cash advance, 3.49% forex markup, and
the current late-payment formula. The product page still advertises 1.99% forex,
so the 3.49% KFS figure is used with this unresolved discrepancy called out.
Corrected the welcome's implied catalogue value from INR 500 to INR 5 using AU's
literal 0.25-paise FAQ valuation; e-voucher value is lower at 0.20 paise, so
actual realized value depends on redemption.

The reward terms specify a 5,000 statement cap on the accelerated MCC group,
100 utility/telecom points per transaction, no transportation rewards since
1 Apr 2026, and an overall 25,000-point statement cap. MCC 9311 is explicitly
listed under both eligible tax and excluded government/education MCCs, so the
calculator must preserve that ambiguity. OTA accelerated rewards are limited to
airline and hotel bookings. Lounge access changed from unconditional quarterly
access: effective 1 Oct 2026 it requires INR 50,000 spend in the prior calendar
quarter and an active card. Added the published CA-specific age ranges (including
self-employed upper age 75) and primary-cardholder insurance nuances. Validation
passes. Numeric source-path coverage now reads fees 424/2,401, rewards 347/3,011,
benefits 212/3,074, and eligibility 313/313.

### AU Bank CheQ AU

Refreshed CheQ AU using AU's current product page and current KFS, AU/CheQ's
card-specific reward PDF, AU's card-member agreement, and CheQ's program terms.
Corrected standard Visa and RuPay variants to lifetime-free, with an optional
Visa LED issuance fee of INR 999 plus GST. Rewards are now represented as CheQ
points rather than rupee cashback: the base earns 2 points per INR 200; 12%
marketing earn is 24 points per INR 200 (12 points/INR100), worth at most 6% at
the INR 0.50 travel/gift-card redemption path; the 5% tier is worth at most
2.5%, 2.5% UPI is worth 1.25%, and base 1% points earn is worth 0.5% at that
same best-value path. Bill-payment redemption is half that rate (INR 0.25 per
point). The 12% and 5% categories share a 12,000-point statement cap; base and
2.5% UPI rates are uncapped. Points require transactions of at least INR 200
and accrue in INR 200 increments, expire after two years, and are locked to
CheQ redemption. CheQ-specific terms waive redemption fees, though generic AU
documents list a redemption fee.

Split Visa and RuPay into separate card records under decision D-20 because
their scored earn mechanics differ. One application issues both, and both must
be closed together. Visa 12% spend is partner-MID based; RuPay earns 12% on
partner purchases only through CheQ UPI, while other-TPAP RuPay UPI earns zero.
RuPay 5% MCC earning also requires CheQ UPI; RuPay POS/ECOM on these MCCs falls
to the 1% base rate. The exact partner MID list is mutable, and the schema
cannot channel-scope all RuPay base exclusions, so estimates may overstate that
route. Recorded eligible MCCs/exclusions, fuel waiver, welcome EazyDiner Prime
voucher gates, card fee, age criteria, and general credit-charge nuances.
CheQ's landing page advertises INR 25,000 monthly income and 750 credit score,
but the issuer page does not publish those as binding underwriting floors;
they remain notes, not eligibility facts. Numeric audit after these changes:
fees 424/2,401, rewards 347/3,011, benefits 212/3,074, eligibility 313/313.

### AU Bank InstaPay

Rechecked AU's current InstaPay page and current KFS/MITC. Corrected cashback
scope from a broad 1% base plus an uncapped accelerator to 1% cashback only on
domestic RuPay UPI transactions at departmental stores, dining, pharmacy and
grocery/supermarkets, with a minimum INR 200 transaction and shared INR 100
statement cap. The issuer does not publish the exact InstaPay MCC list, so the
calculator's broad spend buckets can overstate eligible UPI spend. Corrected
fuel surcharge waiver to INR 100 per statement month on INR 400-INR 5,000 fuel
transactions. The card is virtual-only, offered only to selected existing AU
primary cardholders, shares the primary card's credit limit, and has its own
statement and payment. Cash advance is not applicable. AU's generic KFS terms
include 3.75% monthly finance and 3.49% forex; late-fee formula and fuel GST
nuances are retained in notes. Numeric evidence totals currently remain fees
424/2,401, rewards 347/3,011, benefits 212/3,074, eligibility 313/313.

### IndiGo Axis Bank Credit Card (2026-10-25)

Rechecked the current Axis product page, linked card T&Cs, launch release, and domestic lounge program. Standard joining/annual fees remain INR 799 plus GST in the card T&Cs, while the live page advertises a limited-period NIL/Lifetime Free offer. The current campaign terms cover applications from 1-Sep through 31-Oct-2026 and grant a separate 1,200-BluChip activation voucher after more than INR 1,500 eligible spend in the first 30 days; voucher issuance is within 90 days after the offer period. Standard fee-paid welcome, renewal, milestone and earn benefits do not apply to lifetime-free/first-year-free accounts. This limitation is documented because it materially changes the advertised value for current applicants.

Confirmed base earn of 1 BluChip/INR 100, grocery/dining 2/INR 100 on the listed MCCs, and IndiGo channel 3/INR 100 (MCC 4511 and merchant name IndiGo/Interglobe). RuPay UPI earns share a 750 BluChip statement-month cap across base and accelerated earning, excluding IndiGo-channel spend; capped UPI earns do not count toward milestones. Added currently stated reward exclusions (government, insurance, utilities/telecom, rent, wallet, fuel, jewellery, EMI, gift cards, bridge/road fees and tolls). Removed the separate UPI earn tier because the current T&Cs apply the cap across existing earn categories, so a separate 1X tier would double-count points. Standard welcome voucher is fee-paid and the fee must be paid within 120 days; current lifetime-free campaign has its own activation voucher.

Confirmed domestic lounge access at one visit/quarter after INR 50,000 eligible spend in the preceding three calendar months. Eligibility is issuer-listed age 18-70 and resident India; income and score thresholds are unpublished. The card is launched on both Visa and RuPay, but the schema models a single network; this record represents RuPay/UPI use and does not separately model the Visa variant. Fuel surcharge waiver is left null because neither current card page nor card T&Cs publish a card-specific waiver. IndiGo controls BluChip redemption value; the existing INR 0.60 is an estimate, not a guaranteed Axis value. Primary sources: [Axis IndiGo product page](https://www.axis.bank.in/cards/credit-card/indigo-axis-bank-credit-card), [current card terms and campaign terms](https://www.axis.bank.in/docs/default-source/default-document-library/final_indigo-base_customer-tnc.pdf?sfvrsn=797c78d0_5), [Axis launch release](https://www.axis.bank.in/about-us/press-releases/unlock-more-with-every-swipe-axis-bank-and-indigo-unveil-co-branded-credit-cards-to-redefine-travel-and-lifestyle-experiences), and [Axis domestic lounge terms](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf?sfvrsn=843429b3_11).

### Axis Bank Atlas Credit Card (2026-10-25)

Rechecked the live Atlas product, reward/benefit, tier and privilege pages and current feature T&Cs. Confirmed INR 5,000 joining/annual fees, monthly finance 3.75%, cash advance 2.5% (minimum INR 500), forex 3.5%, and DCC markup 3.5% effective 21-Aug-2026. Current page lists a INR 99 fee per EDGE Miles redemption and INR 199 per transfer to a partner; these are now recorded on the redemption routes.

Corrected reward classification: Atlas earns 2 EDGE Miles/INR 100 on other eligible spend; the separate Ã¢â‚¬Å“international spendÃ¢â‚¬Â 2-mile rule was removed to prevent it appearing as an additional accelerator. Travel earns 5/INR 100 on Travel EDGE MID VERNMAKRUPCYB21, airline MCCs 3000-3350 and 4511, and hotel MCCs 3501-3838 and 7011, up to INR 200,000 cumulative qualifying spend/month; spend beyond that earns 2/INR 100. Added issuer-published exclusion MCCs for jewellery, rent, wallet, government, insurance, fuel and utilities, and documented EMI point reversal. Miles transfer ratios vary by partner; the current Atlas annual transfer cap remains 150,000 miles, split 30,000 Group A/120,000 Group B. Atlas feature terms and current transfer-program material support these figures, but partner roster and ratios are subject to change. Miles are worth INR 1 for Travel EDGE redemption; they are not cashable.

Confirmed Silver lounge access at 8 domestic and 4 international visits/year, upgrading to Gold at INR 7.5 lakh (12/6 visits) and Platinum above INR 15 lakh (18/12 visits), plus current milestone and fee-paid annual-mile conditions. Welcome benefit is 2,500 miles after a transaction within 37 days for cards sourced from 20-Apr-2024. Issuer criteria publish age 18-70, resident India, net annual income INR 12 lakh salaried/INR 15 lakh self-employed; criteria are indicative and no credit-score floor is published. Removed the unsupported launch date; an exact primary-source launch date was not located. The schema requires an effective date for each fee/reward/benefit record, so the older record-effective date remains provisional pending primary launch/effective-date evidence. Sources: [Atlas product and fee page](https://www.axis.bank.in/cards/credit-card/axis-bank-atlas-credit-card), [current earn terms](https://www.axis.bank.in/cards/credit-card/axis-bank-atlas-credit-card/rewards-benefits), [tier benefits](https://www.axis.bank.in/cards/credit-card/axis-bank-atlas-credit-card/tiered-benefits), [feature T&Cs](https://www.axis.bank.in/docs/default-source/atlas-credit-card/terms-and-conditions-of-features-of-axis-bank-atlas-credit-card.pdf?sfvrsn=755e5a56_24), and [Axis miles transfer program](https://www.axis.bank.in/miles-transfer).

### Axis Bank Horizon Credit Card (2026-10-25)

Rechecked the live product page, current Horizon card T&Cs, and Axis Miles Transfer terms. Corrected the monthly finance charge to 3.75%, removed the unsupported INR 10 lakh annual-fee waiver and launch date, and recorded the current INR 3,000 joining/annual fee. The page advertises a limited Burgundy Savings Account NIL-fee offer for accounts opened on/after 1-Jul-2026, subject to one LTF card per customer, exclusions for existing LTF Select/Magnus/Horizon holders, relationship maintenance, and bank discretion. Recorded DCC markup 3.5% plus taxes, and conditional 1% rent/wallet/fuel/education/utility/gaming fees in fee notes because the schema has no structured field for these transaction charges. Removed the separate international-spend 2-mile earn rule because the 2/INR 100 base rate already covers other eligible spend. The 5/INR 100 accelerator applies to Travel EDGE and direct airline channels; travel agents and OTAs earn base.

Corrected lounge terms: Visa Signature domestic access is 8 visits/quarter and international access is 2/quarter; the current T&Cs do not impose the former INR 50,000 quarterly lounge threshold. The USD 1 international authorization is reversed after approval. Added the INR 10 lakh lost-card liability benefit with the issuer's key exclusions. Transfer partner ratios and roster are dynamic; current terms specify a 500,000-mile annual transfer cap per Customer ID (100,000 Group A + 400,000 Group B) and minimum 500-mile transfer. EDGE Miles are valued at INR 1 for Travel EDGE booking; transfer value is left unknown. Eligibility is issuer-listed resident India, age 18-70; card-specific income and score cutoffs are unpublished. Current T&Cs and live feature terms may have different dates; the record effective dates remain a schema-required approximation to the card issue scope from 1-Jul-2024. Sources: [Horizon product/fees/benefits](https://www.axis.bank.in/cards/credit-card/axis-horizon-credit-card), [Horizon T&Cs](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-for-horizon-credit-card.pdf), [Miles Transfer terms](https://traveledge.axis.bank.in/travel/common/termsandcondition).

### BOBCARD Eterna (2026-10-25)

Rechecked BOBCARD's live Eterna page, current feature-revision notices, reward terms, and current FAQ. Updated the card to NIL joining/first-year fee from 1-Sep-2026, INR 2,499 annual fee thereafter, waived at INR 250,000 eligible spend in the preceding anniversary year for non-delinquent accounts. Finance charge is 3.75% monthly effective 15-Jul-2026 (older file value 3.49% was stale); forex 2%, cash advance 2.5% with INR 500 minimum, and fuel waiver 1% on INR 400-5,000 fuel purchases capped at INR 250 remain supported.

The latest lounge notice raises the domestic unlimited-access gate from INR 40,000 to INR 75,000 spend in the preceding calendar quarter, effective 15-Jul-2026. Reward earn remains 3 points/INR 100 base and 15/INR 100 on dining, travel, online and international spend, capped at 5,000 accelerated points per statement cycle; current cashback/statement credit is INR 0.25/point and the issuer FAQ says Eterna points do not expire. Added the 12-month FITPASS PRO offer (INR 10,000 spend in 30 days; cards issued from 1-Aug-2026). Removed air/non-air accident cover because BOBCARD discontinued it for Eterna effective 25-Aug-2026. Eligibility is resident India, age 25-55, net annual income greater than INR 12 lakh (salaried or self-employed); no score floor is published. Eterna's exact launch date remains unknown. Sources: [Eterna current product page](https://www.bobcard.co.in/credit-card-types/eterna), [15-Jul-2026 feature revision](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf), [31-Oct-2025 reward terms](https://media.bobcard.co.in/media/0h5cim12/features-and-rewards-important-terms-conditions-31102025.pdf), and [BOBCARD FAQ](https://www.bobcard.co.in/faqs).

### BOBCARD Cashback (2026-10-25)

Rechecked the live card page and current BOBCARD MITC/feature terms. The fee plan is either INR 49 monthly or INR 499 joining/annual, with no spend-based waiver; the customer may change plans once during the card's lifetime. Updated finance charges from 3.49% to 3.75% monthly based on the 15-Jan-2026 MITC. The issuer page also confirms forex 3.5%, cash advance 2.5% (minimum INR 500), 1% fuel surcharge waiver on INR 400-5,000 purchases capped at INR 250 per statement, and no cashback on fuel.

Confirmed 1% base cashback on domestic POS and international transactions, plus 4% additional cashback on domestic e-commerce for a 5% total; the additional 4% is capped at INR 1,500 per statement. At least four transactions in the statement cycle are required for the accelerated component; transactions below INR 100, fuel, ATM cash, quasi-cash and issuer-listed MCCs are excluded. Added the full Annexure 1 MCC list from the BOBCARD Features & Rewards T&Cs (local Apr-2026 copy). Cashback is posted automatically in the subsequent statement and reversed for returns/cancellations. The data model stores a 5% rate with one cap, so the calculation may understate the 1% base continuing after the 4% accelerator cap is exhausted; the source caveat is recorded in YAML.

The issuer page lists resident India and age 25-55, with discretion to relax age limits. Its current accessible text truncates the income criteria, so salaried/self-employed thresholds and credit-score minimum remain unknown instead of copying third-party estimates. The exact launch/effective dates are not published in the sources located; date fields use the earliest available issuer term/version dates as schema-required record dates and remain provisional. Sources: [BOBCARD Cashback product page](https://www.bobcard.co.in/credit-card-types/bobcard-cashback), [15-Jan-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [feature terms (issuer page links to current editions; local Apr-2026 copy used for MCC annexure)](https://www.bobcard.co.in/most-important-terms-and-condition).

### BOBCARD Premier (2026-10-25)

Rechecked the current Premier page, feature/reward terms and lounge eligibility notice. Set joining/first-year fee to NIL from 1-Sep-2026, with the INR 1,000 renewal fee waived from year two after INR 120,000 eligible spend in the preceding anniversary year for non-delinquent accounts. Corrected monthly finance charge from 3.49% to 3.75%; forex 3.5% and cash advance 2.5% (minimum INR 500) remain listed. Confirmed core earn 2 points/INR 100 and 10 points/INR 100 on travel (MCC 4722), dining (MCC 5812) and international-flag transactions, capped at 2,000 points/statement; qualified spend after the accelerator cap returns to core earn. Updated realized point value to INR 0.25 for cashback redemption and recorded the general BOBCARD Annexure 1 MCC exclusions for both core and accelerated rewards. Premier points expire after 24 months under BOBCARD's general rules.

The current lounge benefit is one domestic visit per quarter after INR 20,000 net eligible settled spend in the preceding calendar quarter; fresh cards receive an issuance-quarter exemption (and next-quarter exemption if issued in the last month), not available on upgrades. Eligibility is resident India, age 25-55 (limits may be relaxed at issuer discretion), net annual income greater than INR 7.2 lakh for salaried/self-employed; no score floor is published. Removed unsupported 2020 launch date. The card page's exact feature start dates are not fully published; reward record uses the earliest located current issuer feature-terms version as a provisional schema-required date. Sources: [BOBCARD Premier page](https://www.bobcard.co.in/credit-card-types/premier), [BOBCARD feature/reward terms](https://www.bobcard.co.in/most-important-terms-and-condition), [1-Jan-2025 lounge eligibility notice](https://media.bobcard.co.in/media/y2gkeyrl/bobcard-soc-benefit-changes-wef-1st-jan-2025.pdf), and [Jan-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf).

### BOBCARD Select

Rechecked the live Select page, the Jan-2026 BOBCARD MITC, the issuer's Select leaflet, and the April-2026 issuer reward-terms archive. Removed the unsupported 2021 launch date. The current product page advertises a limited-period INR 0 joining/first-year fee effective 1-Sep-2026, an INR 750 annual fee, and an INR 70,000 preceding-anniversary-year waiver for non-delinquent accounts. The Jan-2026 MITC instead lists a standard INR 700 joining fee (waived at INR 7,500 in the first 60 days) and INR 700 annual fee at the same renewal waiver threshold. The fee mismatch and unpublished offer expiry remain explicit; current product-page annual value is modeled, and the standard joining offer is described in the fee condition.

Corrected finance charges to 3.75% monthly using the Jan-2026 MITC, corrected realized point value to INR 0.20 based on current cashback redemption, and retained 1 point/INR100 core and 5 points/INR100 online/dining subject to 1,000 accelerated points per statement then core earn. Replaced the lone rent MCC with the full Annexure 1 MCC exclusion list; these categories do not earn core or accelerated points. Fuel earns no points. Corrected fuel surcharge waiver cycle to statement and recorded current age 25Ã¢â‚¬â€œ55/resident India, discretionary age exceptions, three lifetime-free add-ons, immediate loss reporting for zero liability, and the product FAQ's INR15 lakh air / INR5 lakh non-air accident cover. Minimum income, credit-score floor, exact feature effective dates and the full insurance-policy conditions are unpublished or unresolved; exact launch date remains unknown. Current Select page and Jan-2026 MITC conflict on fees as noted above.

Sources: [BOBCARD Select product page](https://www.bobcard.co.in/credit-card-types/select), [Jan-2026 BOBCARD MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [Select leaflet](https://media.bobcard.co.in/media/sckh2bbp/bobcard-select-leaflet-a5_web.pdf), and local archived issuer terms `docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf`.

### Snapdeal BOBCARD

Reviewed the current Snapdeal product page, Jan-2026 MITC, and archived April-2026 reward terms. Removed the unsupported 2021 launch placeholder. Current issuer page lists INR 249 joining and annual fees with no waiver, salaried eligibility ages 21â€“60 and self-employed ages 24â€“65, and Indian residency. The schema permits only one age range, so 21â€“65 is stored with the occupation-specific ranges explained in notes; minimum income and score floor remain unpublished. Finance charges are corrected from 3.49% to 3.75% monthly per the Jan-2026 MITC. Current generic MITC supports 3.5% forex and 2.5% / INR 500 cash-advance fee.

Corrected Snapdeal website/app earn to 20 points per INR100 (5% at INR0.25/point) without an issuer-published cap. The 10-point online/departmental-store earn alone has a 2,000-point statement cap, after which eligible spend earns the 4-point core rate. Corrected realized point value from INR0.18 to INR0.25, fuel-surcharge waiver cap cycle from monthly to statement, and added the complete Annexure 1 MCC exclusions. Captured the up-to-INR500 Snapdeal voucher for card usage within 30 days (only where joining fee is paid), 500-point welcome award after INR5,000 eligible spend within 60 days, UPI exclusion from joining benefits/accelerated earn, 24-month point expiry, manual redemption requirement since 1-Jul-2025, 1,000-point statement-credit minimum, and 3 lifetime-free add-ons. Exact current reward schedule effective date and full policy terms for voucher/insurance-type protections are not published; the card's precise launch date remains unknown.

Sources: [Snapdeal BOBCARD page](https://www.bobcard.co.in/credit-card-types/snapdeal-bobcard), [current BOBCARD terms page](https://www.bobcard.co.in/most-important-terms-and-condition), [Jan-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [April-2026 archived reward terms](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), and [July-2025 Snapdeal feature revision](https://media.bobcard.co.in/media/lmod15z0/revision-in-product-features-charges_010725-final.pdf).

### BOBCARD Prime

Rechecked the live Prime product page, Jan-2026 generic MITC, April-2026 reward terms, BOBCARD's 15-Jul-2026 insurance revision and current general eligibility guidance. Removed the unsupported 2021 launch date and corrected monthly finance charge from 3.49% to 3.75%. Current page confirms zero joining/annual fees, a secured card against an FD of INR 30,000 or more, no income proof, core earn of 2 points/INR100, cashback value INR0.20 per point, 500-point welcome offer after INR5,000 eligible spend in 60 days, 18â€“85 age range, 1% fuel waiver up to INR250 per statement, and zero liability after immediate lost-card reporting. An older issuer blog advertises an INR15,000 FD minimum; the current product-page INR30,000 minimum is modeled and the conflict is recorded. Guaranteed issuance has an explicit exception for CIBIL-delinquent applicants.

Corrected realized point value from INR0.18 to INR0.20; removed unsupported catalog redemption valuation; added the shared Annexure 1 MCC exclusions and the issuer's INR100 minimum transaction for earning core points. Corrected fuel waiver cycle from monthly to statement. Updated the network from unsupported Visa Classic to Mastercard, supported by the issuer's â€œMaster Primeâ€ designation in its network insurance schedule; the network tier remains unpublished. Added the July-2026 discontinuation of Prime accidental cover effective 25-Aug-2026 so prior accident cover should not be treated as current. Point expiry is 24 months; the product-specific earn schedule's exact effective date and insurance claim conditions remain unpublished. FD minimum conflicts between the current product page (INR30,000) and older issuer blog (INR15,000); live product page value is modeled.

Sources: [BOBCARD Prime page](https://www.bobcard.co.in/credit-card-types/prime), [generic Jan-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD reward terms](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [July-2026 insurance revision](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf), [network insurance schedule identifying Master Prime](https://media.bobcard.co.in/media/x3uohjku/rfp-for-insurnace-covers-relating-to-credit-cards-pa-pi-clwi-on-duty-coverage.pdf), [older issuer blog stating INR15,000 FD](https://www.bobcard.co.in/blogs/minimum-cibil-score-required-for-credit-card), and [general eligibility guidance](https://www.bobcard.co.in/apply-for-credit-card-online).

### BOBCARD One (2026-10-26)

Rechecked the live product page, current One-specific MITC and co-branded reward terms. Corrected the base earn from 1 point/INR100 to 1 point/INR50, removed the unsupported universal unlimited 5X cap, and documented the 3-category / INR750 monthly qualification for the top-two 5X categories, bonus posting on the 10th of the following month, and scoped 25,000-point education/bills/insurance bonus ceiling. Removed unsupported insurance and EMI exclusions; added cash advance to the listed reward exclusions. Redemption remains modeled at INR0.10/point, supported by OneCard's own cashback example. Added the 1% fuel waiver capped at INR400/calendar month, corrected finance charges to 3.75% monthly, and documented the One-specific fee schedule including metal-card issuance/cancellation/replacement, rent, wallet-transfer, overlimit and late-payment charges.

Age is recorded as 18+ from the card-specific declaration, but BOBCARD's generic eligibility page says primary applicants are 21â€“65; this conflict is unresolved. Residency is resident Indian; income and score remain unpublished. Network tier was cleared because card-specific terms allow Visa or RuPay variants. The record retains Visa as its single network value; a RuPay variant and its UPI-only core-point rule are not modeled separately. The live product page advertises up to 50 interest-free days while the One-specific MITC says up to 48; the card-specific MITC value is recorded and discrepancy noted. Reward points have lifetime validity except issuer-stated lapse cases (including 365 days without use, account closure, NPA, delinquency, settlement, fraud or death). Effective dates for rewards are not fully established. Dynamic category qualification and scoped bonus cap exceed calculator modeling precision.

Sources: [BOBCARD One page](https://www.bobcard.co.in/credit-card-types/bobcard-one), [BOBCARD One MITC](https://media.bobcard.co.in/media/4qfbv2ka/bobcard-one-mitc-2.pdf), [BOBCARD One terms and conditions](https://media.bobcard.co.in/media/v2hi0wl0/bobcard-one-tcs-2.pdf), and [OneCard reward-value example](https://www.getonecard.app/blog/how-to-maximise-your-one-credit-card-for-hotels/).

### CMA One BOBCARD (RuPay variant, 2026-10-26)

Rechecked the current CMA One page and BOBCARD feature/reward terms. Corrected the base reward value to INR0.25 per point and retained 1 point per INR100 core earn. Added the 1,000-point accelerated reward ceiling per statement, UPI/core-only treatment, INR100 transaction minimum, MCC-specific accelerator scope (online flag, dining MCC5812, utilities MCC4812/4899; MCC4900 is not accelerated), and the Annexure 1 MCC exclusions. Removed the unsupported EMI exclusion, corrected the fuel cap cycle to statement, added the INR40,000 prior-calendar-quarter lounge gate, and captured the lounge and quarterly milestone conditions, insurance amounts/Professional Indemnity eligibility, and FITPASS PRO 12-month benefit for primary cards issued from 1-Aug-2026. Corrected finance charge to 3.75% monthly per current generic MITC; product-specific joining/annual/forex remain INR1/zero/2%. The generic MITC supplies the 2.5%/INR500 cash-advance fee.

Removed unsupported 2022 launch date, Visa network and Visa Signature tier. The card was originally launched as RuPay; BOBCARD application materials also list Mastercard CMA One. This entry now represents RuPay and does not separately model the Mastercard variant. The issuer page's minimum-income FAQ says INR3 lakh for salaried and self-employed applicants; a minimum bureau score remains unpublished. The milestone threshold depends on the assigned credit limit and exceeds the higher of INR1 lakh or that limit; the fixed threshold in the schema can overstate eligibility when the limit exceeds INR1 lakh. SmartDeal extra earn, use-specific insurance claim rules and current lounge participating list are source-dependent details not fully represented in the record.

Sources: [CMA One product page](https://www.bobcard.co.in/credit-card-types/cma-one), [shared Apr-2026 reward terms (local issuer PDF)](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [July-2026 generic MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [application form listing CMA One network variants](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [issuer insurance schedule listing RuPay CMA One](https://media.bobcard.co.in/media/x3uohjku/rfp-for-insurnace-covers-relating-to-credit-cards-pa-pi-clwi-on-duty-coverage.pdf).

### BOBCARD Easy (2026-10-26)

Rechecked the active Easy product page, BOBCARD's 1-Apr-2026 reward-terms PDF, the current generic MITC and the 2024 issuer application form. Updated current joining fee to â‚¹0 from 1-Sep-2026 under a limited-period first-year-fee offer with no published end date; annual fee remains â‚¹500 from year two and is waived on â‚¹35,000 eligible spend in the preceding anniversary year for non-delinquent accounts. The generic MITC still lists the standard â‚¹500 joining fee waived at â‚¹6,000 spend within 60 days. Corrected monthly finance charge from 3.49% to 3.75%; confirmed cash advance at 2.5% / â‚¹500 minimum, forex at 3.5%, and fuel waiver at 1% on â‚¹400â€“â‚¹5,000 transactions up to â‚¹250 per statement cycle.

Confirmed 1 point/â‚¹100 core earn, 5 points/â‚¹100 on departmental-store MCC 5311 and cinema MCC 7832, capped at 1,000 accelerated points per statement cycle; spends past the cap earn core rate. Transactions below â‚¹100 and fuel earn no points, UPI gets core points only, and reward eligibility follows the issuer's MCC/acquirer flags. Added all Annexure 1 exclusions (including MCCs) and marked the issuer-stated â‚¹0.20 cashback point value. Removed the unsupported catalog redemption valuation and corrected realized value from â‚¹0.18 to â‚¹0.20. Documented two-year expiry, 1,000-point statement-redemption minimum, and SmartDeal extras (4 points/â‚¹100 flights; 10 points/â‚¹100 hotels booked in the logged-in app/portal). Updated the product's welcome reward, fuel waiver cycle, add-on card terms, Smart EMI, lost-card and contactless claims.

Issuer eligibility lists Indian residency and age 25â€“55, with discretion to consider ages outside that band; numeric income and score cutoffs are not published in reviewed materials. The application form offers Easy on Visa, Mastercard and RuPay. The single-network schema retains Visa as the represented network, but the tier is unknown and other variants (including RuPay-specific UPI treatment) are not separately modeled. Launch date remains unknown. Sources: [Easy product page](https://www.bobcard.co.in/credit-card-types/easy), [BOBCARD Apr-2026 product features and reward terms (local issuer PDF)](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [generic Jan-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), and [issuer application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf).

### BOBCARD Select (2026-10-26)

Rechecked the active Select product page, 1-Apr-2026 reward terms and issuer application form. Confirmed the current limited-period â‚¹0 joining/first-year fee from 1-Sep-2026 (end date unpublished), â‚¹750 annual fee from year two with â‚¹70,000 preceding-anniversary-year waiver for non-delinquent accounts, 3.5% forex fee, 3.75% monthly finance charge and 2.5% / â‚¹500 minimum cash advance fee. The generic Jan-2026 MITC instead lists a â‚¹700 annual fee (with the same waiver threshold); current product-page value is represented, and the discrepancy is documented. Fuel waiver is 1% on â‚¹400â€“â‚¹5,000 transactions, capped at â‚¹250 per statement cycle.

Confirmed 1 point/â‚¹100 core earn; 5 points/â‚¹100 on eligible online-flag transactions and dining MCC 5812, capped at 1,000 accelerated points per statement cycle. Corrected unsupported EMI rewards exclusion and removed catalog redemption value because the reviewed product page only verifies cashback at â‚¹0.20/point. Preserved the issuer's April-2026 Annexure 1 excluded MCC list. Recorded no-points transactions below â‚¹100 and fuel, core-only UPI, two-year point expiry, 1,000-point statement-redemption minimum, and SmartDeal additions of 4 points/â‚¹100 on flights and 10 points/â‚¹100 on hotels through the logged-in BOBCARD app/portal. Updated benefits with Smart EMI, contactless, welcome points, add-on, lost-card and issuer-listed accident cover.

Eligibility is Indian resident, age 25â€“55 (with issuer discretion outside this range); numeric income and score cutoffs are unpublished. The application form lists both Visa and Mastercard Select variants. The single-network model retains Visa and clears the unsupported Platinum tier; Mastercard is not separately modeled. The welcome text's encoding corruption was repaired. Sources: [Select product page](https://www.bobcard.co.in/credit-card-types/select), [Apr-2026 product feature/reward terms (local issuer PDF)](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [Jan-2026 generic MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), and [issuer application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf).

### BOBCARD Premier (2026-10-26)

Rechecked the current Premier page, 1-Apr-2026 BOBCARD reward terms, lounge program terms and issuer application form. Verified current â‚¹0 joining/first-year fee from 1-Sep-2026, â‚¹1,000 annual fee with â‚¹1.2 lakh prior-anniversary-year waiver, 3.5% forex, 3.75% monthly finance charge and 2.5% / â‚¹500-minimum cash advance fee. The live page states core 2 points/â‚¹100 and 10 points/â‚¹100 on eligible travel, international and dining transactions (dining MCC 5812, travel MCC 4722 / international acquirer flag) with 2,000 accelerated points per statement cap. Preserved the complete issuer Annexure 1 MCC exclusions, â‚¹0.25 cashback value, two-year point validity, no points below â‚¹100 or on fuel, and core-only UPI treatment. Removed unsubstantiated catalog redemption value and EMI reward exclusion.

Confirmed one domestic lounge visit per quarter after â‚¹20,000 net eligible spend in the previous calendar quarter; fresh cardholders have a temporary issuance-quarter waiver (and next quarter if issued in the last month), while upgrades do not qualify. Recorded 500 welcome points after â‚¹5,000 eligible spend in 60 days, fuel-waiver range/cap, add-on cards, SmartDeal extra travel points, Smart EMI, contactless and lost-card claims. Eligibility is Indian resident, age 25â€“55 at issuer discretion, and net annual income greater than â‚¹7.2 lakh for salaried and self-employed applicants; numeric credit-score threshold is unpublished. Issuer application materials offer Visa and RuPay Premier; this record represents Visa only, and the tier is unset because it is not supported in the reviewed sources. Sources: [Premier product page](https://www.bobcard.co.in/credit-card-types/premier), [Apr-2026 product features and reward terms (local issuer PDF)](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [BOBCARD lounge program terms](https://media.bobcard.co.in/media/1funxwuy/airpor-lounge-benefit-tc.pdf), and [issuer application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf).

### BOBCARD Eterna follow-up (2026-10-26)

Rechecked the current Eterna product page, Apr-2026 issuer rewards PDF, Jan-2026 generic MITC, July-2026 feature-revision notice, lounge terms, milestone PDF, and application form. Retained the live â‚¹0 joining/first-year offer from 1-Sep-2026 and â‚¹2,499 annual fee thereafter with â‚¹250,000 prior-anniversary-year waiver; documented the standard â‚¹2,499 joining fee/â‚¹25,000 first-60-day waiver as applicable where the offer is unavailable. Confirmed 2% forex, 3.75% monthly finance charge effective 15-Jul-2026, and cash advance at 2.5% / â‚¹500 minimum.

Confirmed 3 points/â‚¹100 core earn and 15/â‚¹100 on eligible e-commerce online-flag, international-flag, dining MCC 5812 and travel MCC 4722 transactions, capped at 5,000 accelerated points per statement cycle. Removed unsupported EMI rewards exclusion and fixed the excluded MCC list to the full Annexure 1 list; MCC 4900 earns core points but is not accelerated, UPI gets core points only, and transactions below â‚¹100 and fuel earn no points. Kept â‚¹0.25 only for cashback/statement redemption, removed a catalog value, documented the 1,000-point statement-redemption floor and the evergreen expiry/forfeiture exceptions, and corrected statement-credit valuation evidence.

Updated fuel waiver cadence to statement cycle. Preserved unlimited domestic lounge access after â‚¹75,000 net eligible spend in the preceding calendar quarter effective 15-Jul-2026; new-card exceptions apply, while upgrades are excluded. Set guest entitlement unknown because reviewed issuer sources do not establish it. Added SmartDeal extra earn (12 points/â‚¹100 flights and 30 points/â‚¹100 hotels), Smart EMI, contactless and lost-card claims; accident cover is not applicable to new Eterna cards after 25-Aug-2026. Eligibility remains resident India, age 25â€“55 at issuer discretion, and net income greater than â‚¹12 lakh for salaried/self-employed applicants; score minimum is unpublished. The application form offers Visa, Mastercard and RuPay; the record represents Visa, while network tier and other network variants remain unmodeled. The current page does not advertise concierge service, and the schema's boolean false cannot distinguish unknown from confirmed absence, so that flag remains an unresolved limitation. Exact overall launch date remains unknown.

Sources: [Eterna product page](https://www.bobcard.co.in/credit-card-types/eterna), [Apr-2026 reward terms (local issuer PDF)](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [July-2026 product revision](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf), [Jan-2026 generic MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [lounge terms](https://media.bobcard.co.in/media/1funxwuy/airpor-lounge-benefit-tc.pdf), [milestone terms (local issuer PDF)](docs/sources/bob/eterna/eterna-milestone-rewards-know-more.pdf), and [issuer application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf).

## Dataset and checks

**Latest recheck after BOBCARD Eterna follow-up (2026-10-26):** `python scripts/validate.py` passes for 369 cards, 33 issuers and 843 reward rules (768 strict-scope; 661/768 strict-ready, 86%). `python scripts/audit_numeric_evidence.py` reports fees 953/2,457 (39%), rewards 923/3,035 (30%), benefits 847/3,061 (28%), and eligibility 524/531 (99%). These are source-path coverage counts, not accuracy rates; evidence review across the library remains open.

- The working dataset contains **369 cards across 33 issuers**; **347** have an
  active or invite-only status and an open fees, rewards, and benefits record.
- `python scripts/validate.py` passes its default schema and cross-file checks.
- `python scripts/validate.py --strict-provenance` currently reports **128 reward-rule provenance findings** across 753 rules in scope. **625/753 (83%)** are strict-ready; findings include 128 missing confidence grades and 3 stale rules (some may overlap). The
  original record-level table below is the 2026-10-25 pre-remediation snapshot;
  the per-record scan has not yet been rerun after the YES, Bandhan, EazyDiner,
  and White Reserve updates. The scope fell from 751 to 748 after three
  unsupported EazyDiner reward rules were removed. Two rules were added for
  separately capped Air and e-catering rewards on IRCTC Premier.
- A record-level scan of the 346 active/invite-only cards found a source URL,
  retrieval date, and source type on every open fee, reward, and benefit record.
  Explicit confidence grades are missing from:

  | Open record type | Records | Missing confidence | Stale >180 days | Aggregator source |
  | --- | ---: | ---: | ---: | ---: |
  | Fees | 346 | 67 | 2 | 0 |
  | Rewards | 346 | 75 | 1 | 3 |
  | Benefits | 346 | 190 | 2 | 2 |

  Counts are per record; the same card can appear in multiple rows. A present
  URL/date/type does not prove that the cited page actually states every field
  used by the calculator.
- `python scripts/audit_stamps.py` flags **68 cards** whose
  `metadata.last_verified_on` is later than the newest nested source retrieval
  date. This is a triage signal: a later card-level stamp may be legitimate,
  but it must not imply source re-reading that did not happen.
- `python scripts/audit_uncapped.py` currently finds **38 uncapped accelerators
  worth at least 3%** at their modeled effective value. All 38 now carry a
  structured `capping_rules` note. That does not mean every rule has been
  independently re-read; the note must be checked against issuer terms before
  treating an uncapped rate as confirmed.
- `python scripts/audit_numeric_evidence.py` counts numeric leaves that have an
  explicit matching `source.fields_verified` path. It currently covers **653/2,437 fee values (27%)**, **513/2,926 reward values (18%)**, **419/2,974 benefit values (14%)**, and **373/373 eligibility values (100%)**. This is a documentation-coverage
  measure only; it does not prove cited evidence supports a value, and an
  uncovered path does not prove the value is wrong. It gives us a reproducible
  queue for the requested number-by-number review.
- SBI's issuer policy was checked for **44 active/invite-only cards**. Occupation-
  specific ages are now sourced (21ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“65 salaried, 25ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“70 self-employed), with the
  schema's broad 21ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“70 bounds plus explicit `age_ranges`. Unsupported
  aggregator/tier income minimums and score floors were cleared to unknown;
  SBI says the income minimum varies by card and application approval depends
  on underwriting. The five secured-card variants were reviewed; unsupported age, income, and score thresholds were removed. Public issuer sources confirm secured-card/FD-lien status for some variants, but do not establish all card-specific minimum deposits or applicant age rules.
  high-impact claims that need evidence or a sourced no-cap explanation. Three
  correspond to existing D20 deferrals; `bandhan-lumina` is not currently
  documented in that deferral note.
- `docs/PROVENANCE.md` still describes the July dataset as 317 cards across 24
  issuers, so the human-facing provenance summary is out of date.

## Confirmed high-priority source conflicts

### IDFC FIRST IndiGo

The record says **1.49% forex markup** (source retrieved 2026-07-03), a 1 BluChip
base rate, and a 3 BluChip dining/entertainment accelerator. The live issuer
page now states 0% forex, 3 BluChips per ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 on other spends, 0.5 on UPI and
specified MCC groups, 6 card-attributable BluChips per ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 on IndiGo bookings,
and 1 per ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 on international purchases effective **2026-10-26**. The May
issuer notice still documents 1.49% forex and confirms the 22 July restricted
category changes. The official source pages establish the current terms, but
the exact effective date of the zero-forex change was not present in the
primary material found, and the data model cannot safely score the UPI rail or
0.5-rate MCC exceptions. P8 remains open for a dated fee-history correction
and a model that does not inflate restricted spend. Sources: [current IDFC
FIRST card page](https://www.idfcfirst.bank.in/credit-card/indigo-credit-card)
and [IDFC FIRST May 2026 update PDF](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/IndiGo-IDFC-FIRST-Credit-Card-Communication-May-26.pdf).

### YES Bank PaisaSave

PaisaSave's reward record now cites the live YES Bank product page, verified
2026-10-25. It directly states 6% on 24 listed dining/travel MCCs, 1% on other
spends, a ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹3,000 statement-cycle cap, the exclusions, and 1 RP = ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1 statement
credit. The YAML now records this as issuer evidence with high field-level
confidence; dining remains omitted from broad calculator scoring because the
model cannot target the allowlisted MCCs and customer reports conflict with
the marketing label. The page does not state the effective date, so P9 remains
open for reward history and dating. The older issuer benefit snapshot and
Paisabazaar material should not override the current issuer page for today's
terms.

### Bandhan Bank Lumina

The Lumina record was inconsistent with Bandhan's September 2026 card launch
and current issuer terms. Its fees, reward earn and cap, welcome condition,
monthly milestone, lounges, golf, fuel waiver, and insurance were reconciled
against Bandhan's current product page and August 2026 MITC. The record now
uses the ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹12 lakh renewal waiver and no cash-advance fee from the MITC, plus
the product page's 16 points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹200 base earn, 5,000 monthly bonus-point cap,
ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1 lakh monthly milestone, and current listed benefits. The live value chart
and MITC disagree on the fuel-waiver cap (ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1,000 vs ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹500 per statement cycle);
the record retains the dated MITC value and flags the conflict. The product
page's value chart also does not establish a consistent guaranteed point value,
so ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹0.25 remains provisional. The exact network tier and the page's income
threshold basis (period and gross/net) also need stronger evidence before they
are treated as certain. P12 tracks those remaining items and review of sibling
Bandhan cards. Sources: [Bandhan Lumina product page](https://creditcards.bandhan.bank.in/card-details/Lumina/), [Bandhan August 2026 MITC](https://creditcards.bandhan.bank.in/landing/uploads/Credit_Card_MITC_English_19082026_2b514a85e4.pdf).

### IndusInd EazyDiner Platinum and Kotak White Reserve

The EazyDiner Platinum issuer page currently describes the card as lifetime
free, states 2 Reward Points per ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 and ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹0.20 per point, and separately
advertises 2X EazyPoints without publishing a conversion rate on the page. The
record's ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1,500 fee and 15%/10% dining accelerators were not supported by the
current issuer page; the fee is now zero and those fabricated earn rates were
removed. The issuer page does not date the current fee or reward terms, and its
other benefits still need a complete refresh. [IndusInd EazyDiner Platinum
page](https://www.indusind.bank.in/in/en/personal/cards/credit-card/eazydiner-platinum-credit-card.html).

Kotak White Reserve was modeled with a 3-per-ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹200 base rate and 2X
international rate, but Kotak's current White Pass page describes only
anniversary-year spend milestones. Those flat earning rules were removed and
the published incremental milestone ladder was entered. The current KFS also
shows ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹12,500 joining/annual fees, an annual ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹10 lakh fee-waiver threshold, and
2% forex markup; the fee schedule's effective date is not established here.
The current page values White Pass at ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1 for catalogue redemptions and ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹0.70
for cashback. Other benefit claims (welcome points, lounge, golf, insurance,
and concierge) remain due for a source refresh. Sources: [Kotak White Reserve
White Pass page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/whitepass.html), [Kotak White Reserve KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-white-reserve.pdf).

SBI Landmark Rewards Prime's 25 Reward Points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 Landmark rate had no
structured cap note. Its card-specific booklet clause 11.4 states the earn
rates and gives no per-cycle cap, while clause 11.5 documents conversion only
to Landmark Rewards at 4 points = ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1 and a ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹99 + GST fee below 1,000 points.
The record now captures this as no published cap and removes an unsupported
statement-credit redemption. [SBI Landmark Rewards Prime page](https://www.sbicard.com/en/personal/credit-cards/landmark-sbi-card-prime.html) and [card-specific booklet](https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/value-savings/landmark/landmark-product-page/landmark-tncs/Landmark-PRIME-Booklet.pdf).

### SBI IRCTC Platinum

The issuer's terms and live reward calculator specify two travel-date rates:
4 points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 for most of the year and 10 points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 for 15 JanuaryÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“31 March
and 15 JulyÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“15 September. The record's previous flat 10-point rule overstated
most rail bookings. It now uses 4 points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹100 throughout as a conservative
calculator floor; the seasonal ceiling and required AC-class IRCTC booking are
kept in the notes. The same issuer terms explicitly state no monthly or annual
cap on the travel value-back. Exact calendar-season scoring remains a model gap
tracked by P16. Sources: [SBI IRCTC Platinum terms](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/IRCTC-VISA-HandShak-TnC.pdf), [SBI IRCTC rewards calculator](https://www.sbicard.com/en/calculator/irctc/irctc-calculator.page).

### SBI IRCTC Premier

The current issuer booklet confirms 10% on eligible AC railway base fare, no
monthly or annual rail value-back cap, 5 Reward Points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹125 on IRCTC Air and
e-catering bookings, a 750-point monthly cap for Air bookings, 3 points/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹125
on dining and standing-instruction utilities, and 1 point/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹125 on other
eligible retail. Rent rewards stopped on 15 April 2024 and government rewards
stopped on 15 July 2024. The record now includes the Air cap and e-catering
rule, marks standing-instruction utilities in notes without scoring all
utility spend, and adds government exclusions. Source: [IRCTC Premier booklet](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/ekit-tncs/IRCTCPremiertnc.pdf).


### American Express Membership Rewards and Centurion

The Membership Rewards Credit Card's current issuer page (retrieved 2026-10-25) confirms 1 point per INR 50, exclusions, INR 1,000 first-year / INR 4,500 renewal fees, the INR 150,000 full-waiver threshold and INR 90,000?149,999 half-waiver tier (ending 15 Nov 2026), 4,000 welcome points after INR 15,000 spend in 90 days, and two monthly 1,000-point triggers. The stale INR 900,000 annual milestone and fixed 15% dining figure were removed; dining now records the issuer's ?up to 20%? select-restaurant offer. The 18,000/24,000-point voucher values are represented as a range-derived catalogue estimate (INR 0.3333?0.5833 per point), not as guaranteed cash. Fuel is not a general surcharge waiver: the issuer describes a specific HPCL convenience-fee treatment. The issuer currently says new applications are temporarily paused. The renewal bonus (5,000 points) and fee-convenience behavior need fuller schema support. [Current MRCC issuer page](https://www.americanexpress.com/in/credit-cards/membership-rewards-card/)

Centurion's issuer MITC (updated 11 Aug 2025) corrects the joining fee to INR 700,000, annual fee to INR 275,000, and cash-advance fee to 3.5% with INR 250 minimum. The prior INR 200,000/INR 200,000 fee pair and INR 500 cash minimum were wrong; the unsupported 800 score floor was removed and generic age guidance is cited. The existing Centurion reward valuations and benefit amounts/access counts still lack card-specific India evidence and remain open; current confidence should not be inferred from the corrected fee record alone. [Centurion MITC](https://www.americanexpress.com/content/dam/amex/in/legal/mitc/Centurion_MITC.pdf)

### American Express foreign-currency markup

The current Amex India help-centre FAQ states a 3.5% markup on foreign-currency transactions. Added that explicit issuer value and field provenance to Platinum Charge, Platinum Reserve, Platinum Travel, SmartEarn, and Centurion. This closes the previously noted forex evidence gap for these five records; applicable taxes remain separate. [Amex foreign-currency FAQ](https://www.americanexpress.com/in/customer-service/faq.can-i-use-my-card-abroard.html)

### IDFC FIRST IndiGo Dual Credit Card

Re-read the live issuer product page, the card Product Guide, the 12 Dec 2025 privileges document, the May 2026 cardholder notice, and the bank's 17 Sep 2026 zero-FX announcement. The 1.49% foreign markup is now explicitly closed as historical: zero markup applies automatically to existing and new IDFC FIRST cards from 17 Sep 2026. The official card page states that 1 BluChip/?100 on international purchases begins 26 Oct 2026, so the data has separate current and next-day earn records. The current page states 3/?100 on other eligible spend and 0.5/?100 on UPI plus named reduced-rate categories; the May notice separately makes 0.5/?100 effective 22 Jul 2026 for FASTag MCC 4784, rail 4111/4112, Government MCC 9000?9999, and listed education MCCs. Because the current page's broad list and older targeted MCC notice are not fully aligned, both are documented and category/MCC handling remains conservative.

Replaced the old 3,000-point quarterly milestone with the current cumulative anniversary ladder: ?2L/?5L/?8L/?10L/?12L each earn an incremental 5,000-chip voucher. Removed lounge counts and the fuel waiver that were backed only by an aggregator; added issuer-published 4 annual golf rounds and 12 lessons, plus published insurance limits and conditions. Eligibility is now age 18+ / resident, with unpublished income and score cutoffs left unknown. The issuer product page conflicts on the FD threshold: its headline and FAQ say ?50,000 while a separate application workflow says ?1,00,000; that discrepancy is visible in the record. The dual Mastercard+RuPay structure has one shared limit and reward pool, while the current schema still stores only one network.

Open: the calculator cannot split UPI rail from merchant spend, apply the source's transaction-MCC-specific low rates, or scope BluChip earning to spend up to the customer's actual credit limit; direct IndiGo bookings can add up to 16 programme chips only for eligible loyalty tiers. The card-page number range of 0.45 INR per chip remains a secondary programme estimate, not a fixed issuer redemption value. The privileges PDF's trip-cancellation policy-period dates conflict, and current insurance policy duration needs confirmation. The numeric rate facts are source-backed, but rank-driving coverage waits on these model and source gaps.

### HDFC 6E Rewards XL (discontinued)

The current issuer product page states 2% equivalent earning on eligible grocery, dining and entertainment spend and 1% on other eligible spend. The stored record instead had a 2% base plus a 3% category accelerator, overstating the issuer-published rate. Corrected those numbers to 1% base and 2% eligible-category rate; marked only those values as issuer-verified. Removed the direct IndiGo booking multiplier because its numeric value lacked card-specific primary evidence. The card is discontinued, and the record's effective end date remains 31 Oct 2025. The actual 6E redemption value is not established by the issuer evidence reviewed; the previous ?1/unit value is now null and must not be presented as guaranteed.

### YES Bank eligibility evidence

The YES issuer provenance review records card pages as the source of current product terms but explicitly flags card income bands and minimum credit scores as tier-derived defaults rather than individually verified thresholds. Removed those unsupported annual-income and credit-score numbers from all 29 YES card records and retained them as unknown with a note explaining why. Age and residency values were not changed in this pass; they still require source-by-source verification. This is a confidence correction, not proof that YES has no underwriting threshold.

### HDFC eligibility evidence

The HDFC per-card provenance headers also explicitly classify income floors and minimum credit scores as tier-derived defaults that were not individually source-verified. Cleared those figures from all 32 HDFC records and annotated the fields as unknown. This prevents the recommender from rejecting customers based on invented cutoffs; it does not mean HDFC has no underwriting criteria. Age and residency figures remain to be source-checked individually.

### Corpus eligibility evidence sweep

A corpus-wide check now preserves numeric annual-income and bureau-score cutoffs only when the eligibility source lists the exact field path. Broad minimum/maximum age values are preserved only when individually source-verified or exactly derivable from a source-verified occupation-specific age range. This removed 111 unsupported credit-score floors, 222 income thresholds, and 611 broad age bounds across 311 cards; sourced Amex income cutoffs and sourced SBI age ranges were retained. Null means unknown, not ineligible or unrestricted. The numeric-evidence script now reports 287/287 remaining eligibility numbers with explicit paths (100% path coverage). This is traceability evidence only: each source still needs factual re-reading, and the much larger fee/reward/benefit audit remains incomplete.

### SBI eligibility ranges

SBI's policy gives distinct age ranges by employment type: 21ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“65 for salaried
and 25ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“70 for self-employed applicants. The earlier SBI card records often
used tier-estimated income floors and credit-score cutoffs without issuer
evidence. Those numeric cutoffs are now unknown on 44 active/invite-only cards;
the policy says minimum income varies by card and that bureau history informs
approval without a fixed score threshold. The five FD-backed variants still
need a product-specific review. [SBI issuance policy](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/policy-for-the-issuance-and-conduct-of-credit-cards-2023.pdf).

### AU Bank Altura

Rechecked the current product page, 30 Sep 2026 Key Fact Statement and current issuer MITC on 2026-10-25. Corrected monthly finance charge from 3.49% to 3.75%, cash-advance minimum from INR 300 to INR 500, and the fuel-waiver transaction ceiling from INR 4,000 to INR 5,000. Confirmed the current INR 199 fee, INR 40,000 renewal waiver, 3.49% forex markup, 2.5% cash-advance fee, and 1% fuel-waiver rate up to INR 100/month. Added the first-year waiver condition (INR 10,000 eligible retail spend in 90 days) in notes because schema supports only one fee-waiver threshold. Current late-payment terms are 15% of total amount due, minimum INR 10 / maximum INR 1,300; changed the misleading empty slab list to null and preserved the formula in notes. Recorded the issuer-published cash-advance limit of up to 40% of credit limit in notes.

Current cashback terms are 2% on groceries, departmental stores and utility bills, 1% on other retail; the additional INR 50 milestone requires INR 10,000 retail spend in each statement cycle. The calculator has no separate departmental-store input, so that part of the 2% category remains unscored. Confirmed 8 annual railway lounge visits (not airport lounge visits) and the INR 400-INR 5,000 fuel transaction range. Guest allowance was set to unknown because the issuer page does not state it. Added the current salaried (21-60) and self-employed (25-65) age ranges; income and score cutoffs remain unknown. Current observed terms are dated 25 Oct 2026 rather than implying these rates were effective since the card's launch.

### AU Bank Altura Plus

Reviewed the issuer product page, current Rates at a Glance, card MITC, and AU Reward Points FAQ on 2026-10-25. Removed the unsupported INR 3 lakh income thresholds and 700 score floor; eligibility now uses published employment-specific age ranges and resident status. Current issuer Key Fact Statement (30 Sep 2026) confirms 3.75% monthly finance charge, 2.5% cash advance fee with INR 500 minimum, 15% late-payment charge with INR 10 minimum/INR 1,300 maximum, and 3.49% forex markup. The late-payment formula is retained in notes and its empty structured slab was changed to null. Current card terms show INR 499 annual fee, INR 20,000 first-year spend waiver within 90 days, and INR 80,000 renewal waiver.

Separated AU Reward Points from offline cashback. Online earns 2 points/INR 100; utilities/telecom and insurance earn 1/INR 100, subject to issuer exclusions, 100-point-per-transaction utility/telecom cap and a 25,000-point statement cap. Reward accrual on transportation MCCs ended 1 Apr 2026; the calculator cannot isolate those MCCs, though travel is outside this card's base earn scope. The issuer's published value is 0.25 paise/point for catalogue and 0.20 paise for eligible vouchers, correcting the previous 500 monthly points = INR 125 claim to an unpriced 500-point bonus. Minimum redemption is 200 points and the fee is INR 99 plus GST. Offline cashback is 1.5%, but the issuer page does not quantify its maximum cashback limit; it is shown as a benefit and excluded from calculator scoring. Since POS points begin only after that limit is reached, offline points are also withheld pending cap-switch modeling. Current pages support 8 railway lounge visits/year and the fuel surcharge waiver cap of INR 100/statement from 1 Oct 2026 (replacing the older INR 150 cap). Validation passes.

Open: numeric offline cashback cap and reset behavior; utility point cap and BBPS/quasi-cash exclusions are preserved in notes; device-protection/liability cover has no quantified terms in reviewed evidence. The product page does not publish income or score floors. Current-term dates reflect observation, because historical effective dates were not established.

### Measured coverage snapshot ? 2026-10-25

Latest snapshot (2026-10-25): after the Amex, AU Altura and Altura Plus, IDFC IndiGo, HDFC 6E Rewards XL, Axis Atlas, Axis ACE, Airtel Axis and corpus-wide eligibility work, numeric-evidence path coverage is fees 505/2,400 (21%), rewards 409/2,985 (14%), benefits 297/3,054 (10%), and eligibility 367/367 (100%). These are explicit path-coverage counts, not proof that each field was accurately transcribed. Centurion's conflicting base earn is now null and no longer counted as a numeric claim; calculator estimates flag and omit unverified base rewards. Standard schema validation passes for 369 cards; `npm.cmd run typecheck` passed after the recent code changes. Strict provenance currently reports 627/762 reward rules ready (82%), with 132 confidence gaps, 3 stale sources and 3 aggregator sources. The historical per-card baseline above remains a snapshot of the original audit, not a claim that the full corpus has been remediated.

## Calculator and customer-view implications

- The calculator starts with a saved or sample **ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹50,000/month** spend profile.
  It immediately ranks cards, including products whose eligibility may not fit
  the customer; there is no profile step to apply income, relationship, or
  existing-card constraints.
- Channel-locked earn is optimistic when no channel is selected. The copy says
  so, but the calculator has no simple channel-selection step.
- The introductory text says computation ignores welcome and milestone value,
  while result rows display those values separately. The rank excludes them;
  the page does not explain that distinction clearly.
- The beta banner says every value links to an issuer page, while some live
  rules use aggregator sources.
- Portfolio mode can recommend a six-card stack on the default sample profile.
  The customer sees a larger net total, but the result does not first establish
  whether each card is available or desirable for them.

The product should use customer-provided details to form distinct views for
single-card choice, existing-wallet optimization, and card comparison. Useful
inputs include category spend, existing cards, eligibility/relationship,
merchant and booking habits, reward preferences, and fee comfort. Weak or
stale card evidence should be visible as such and should not be silently
presented as a certain estimate.

## Proposed completion standard

For every active or invite-only card, inventory and source the fields that can
change its personalized view or rank: current status, fee and waiver, earn rate,
currency value, category/MCC/channel applicability, caps, exclusions, forex,
redemption constraints, and eligibility. Record the source, retrieval date,
effective date, and confidence for each record; distinguish issuer evidence
from secondary evidence and model assumptions. When the issuer does not publish
a term, preserve the gap as unknown instead of filling it with a guess.

Work through the known conflicting values first (including P8 and P9 in
`docs/TODO.md`), then use the per-card audit to resolve missing confidence and
stale-source findings issuer by issuer. A passing schema validator is necessary
but does not close this audit.

### Axis Atlas (2026-10-25)

Rechecked the issuer Atlas product, rewards, benefits and current Miles Transfer terms. EDGE Mile face value is Ã¢â€šÂ¹1; unsupported fixed rupee valuations for partner awards were removed. Added the annual-fee miles benefit (none at Silver, 2,500 at Gold, 5,000 at Platinum), conditional on paying Ã¢â€šÂ¹5,000 + GST. The issuer lists domestic lounge access of 8/12/18 and international access of 4/6/12 by tier; visits include guests. Published indicative eligibility is ages 18Ã¢â‚¬â€œ70, salaried net annual income Ã¢â€šÂ¹12 lakh+, and self-employed net annual income Ã¢â€šÂ¹15 lakh+. Current transfer program terms specify 1.5 lakh annual cap, split into 30k Group A and 1.2 lakh Group B. Transfer ratios vary by partner. The calculator cannot represent tier-gated annual-fee miles, so reward units remain null in that generic milestone record.

### Axis ACE (2026-10-25)

Rechecked the current ACE issuer product page, cashback T&C, domestic lounge program and linked dining offer. Corrected finance charge to 3.75% monthly. The 5% Google Pay and 4% Swiggy/Zomato/Ola cashback categories share one Ã¢â€šÂ¹500 per statement cap; the 1.5% base remains unlimited only on eligible non-preferred transactions. Added a shared-cap group to the reward schema/calculator so these two rates consume the same cap, and a base-exclusion rule so utility transactions earn only through the eligible Google Pay channel. Current terms also exclude telecom, gift cards, bridge fees, road fees and tolls. Added the Ã¢â€šÂ¹50,000 previous-three-calendar-month lounge gate (waived during issuance month and next three months) and detailed the conditional joining-fee reversal, annual-fee waiver, fuel waiver and dining offer. The fee waiver source says eligible spend must exceed Ã¢â€šÂ¹2 lakh; schema/calculator currently model the threshold as a numeric cut-off, so the strict greater-than boundary remains noted as a modeling nuance.

### Airtel Axis (2026-10-25)

Rechecked the current Axis product page, cashback/value-back terms effective 2026-04-12, and lounge program update. Replaced the stale 2021 reward model with the current 1% uncapped base, 25% Airtel Thanks telecom and 10% Thanks utility cashback. Both app categories are capped relative to same-statement base cashback (2x and 1x respectively); they do not earn when base cashback is zero. Added calculator support for these relative caps and a separate telecom spend bucket. Split Zomato, Blinkit and District into individual 10% partner-wallet value-back offers, each capped at Rs 200/month; their value is restricted to the corresponding partner wallet and UPI is excluded. Corrected finance charge to 3.75%, documented exact cashback exclusions, transaction round-down, delayed credit timing, eligibility age/residency and welcome/fuel conditions. Airtel Axis is no longer in the complimentary domestic lounge program from 2026-04-12. Annual fee waiver remains strictly greater than Rs 200,000, while the fee threshold model has no strict-boundary flag. The calculator currently has no dedicated entertainment spend input, so the District Movies accelerator is not yet surfaced in customer calculations; add this with the broader spend-profile view work. Validation and typecheck pass.


### AU ixigo (2026-10-25)

Rechecked the current AU product page, ixigo support FAQ, ixigo offer terms and AU?s ixigo usage revision. Removed the unsupported 6-point/?100 blanket ixigo OTA earn assumption; the source material instead shows ordinary 5 points/?200 and a distinct train-booking rate of 10 points/?200 from 1 April 2026 (down from 20). The overall cap is 10,000 points/month. AU's current fee schedule lists a ?999 annual fee with a ?1,000 first-year spend waiver and ?1 lakh annual renewal waiver, 3.75% monthly finance, and cash advance at 2.5% or ?500 minimum; the card-specific page simultaneously advertises a limited-period lifetime-free offer, so fee applicability remains offer-dependent and is flagged. The FAQ describes reward values of ?0.50/point as ixigo Money, ?0.25 for other redemption categories, and ?0.20 for e-vouchers, with ?99 + GST per successful redemption; its ?2.5%? marketing phrasing is not a cash-back valuation. Updated the ?75,000 milestone to 5,000 points per calendar quarter and corrected its illustrative value to ?2,500 at the ixigo Money rate. Updated lounge benefits to 2 domestic airport visits/quarter gated on ?50,000 spend in the previous calendar quarter, 2 railway lounge visits/quarter, and 1 international visit/year. Recorded salaried (21?60) and self-employed (25?65) eligibility ages and ixigo registration requirement. The public FAQ has older and partially inconsistent channel details for online/UPI earn; ordinary rate stays at the conservative product-page rate while those variant-specific rates are not encoded. The schema also cannot attach the overall monthly cap to all earn categories without misapplying it, so that limitation is documented. Validator passes.


### AU Prathama, Kosmo and Paytm (2026-10-25)

Prathama?s current issuer FAQ corrected joining/annual fees to ?100 + GST, renewal waiver threshold to ?75,000 per card anniversary year, base earn to 1 point/?100, contactless to 2/?100, fuel waiver to 1% up to ?100/monthly statement cycle, and described a 500-point Standing Instruction bonus once per merchant for life (not a recurring monthly milestone). Its 5,000-spend threshold reward and 2/?100 contactless may overlap; the exact stacking rule is not stated, so that threshold is noted without assigning an estimated value. AU?s 16 May 2026 agreement caps Prathama at 1,000 points/statement despite a broader 25,000 cap table.

Kosmo issuer terms confirm lifetime-free fees and reward-earning channels but publish neither Kiwi earn rate nor point conversion; those unsupported rates and values are now null so the calculator does not price them. Paytm AU?s current page confirms lifetime-free fees, 5% Paytm app rewards, up to 2% Paytm UPI rewards, and redemption at ?1/point on Paytm Gold or ?0.50 elsewhere. Its ordinary earn rate, exact qualifying Paytm app transaction list, any cap, and lounge visit count remain unknown; prior modeled base rate and lounge count were removed. AU common revolving-interest and cash-advance fee terms were refreshed to 3.75% monthly and 2.5%/?500 minimum where the current issuer schedule applies. Validation passes.


### AU Tejas and AU Rewardz valuation (2026-10-25)

Tejas issuer FAQ corrects the renewal waiver from ?1 lakh to ?1.5 lakh anniversary-year retail spend; joining fee remains ?500 + GST and is not waived. Base earn is 1 point/?100; 5/?100 applies only through the AU Rewardz portal. Added the 25,000-point statement cap, 500-point milestone after five transactions of ?500+ in one statement cycle, and choice of 2,000 points or ?500 voucher on activation plus first transaction within 30 days. Added the five separate monthly cashback offers (10%, ?150 minimum, ?50 maximum per category) and current ?400??5,000 fuel transaction band with ?100 statement cap. Corrected the generic AU Rewardz point conversion: issuer states 0.25 paise = ?0.0025 per point for ordinary catalog redemptions and 0.20 paise = ?0.002 for e-vouchers (?99 + GST successful redemption fee, 200-point minimum). Fractional-rupee milestone display is not representable by the integer `value_inr` schema and remains null. Prathama uses the same AU Rewardz conversion; its threshold rate still has unresolved stacking semantics.


### AU Laksya (2026-10-25)

Current issuer FAQ changes joining/annual fees from ?499 to ?1,000 + GST, with no joining waiver and a ?2 lakh anniversary-year renewal waiver. Updated base to 2 RP/?100; grocery/departmental earn 5 RP/?100 with a 1,000-point statement cap; contactless 5 RP/?100 uncapped; insurance/utility/telecom earn 1 RP/?100 capped at 100 per transaction. Added 25,000-point overall statement cap, welcome choice (4,000 points or ?1,000 voucher) after activation and first transaction within 30 days, and 2 domestic lounge visits each quarter after ?50,000 previous-quarter spend. Fuel waiver is 1% for ?400??5,000 transactions, max ?150 per statement. Partner offers: 15% at Amazon Fresh/Amazon Now and Zomato (?500 minimum, ?250 monthly cap each), plus District BOGO (?250 minimum, ?250 monthly cap). Applied AU Rewardz conversion of 0.25 paise/point outside e-vouchers and 0.20 paise/e-voucher. The calculator cannot isolate contactless spend or model the per-transaction cap on utility/insurance/telecom; these terms are documented, but not overlaid as generic category accelerators. Product-specific forex markup remains unknown.


### AU SPONT (2026-10-25)

Current issuer page confirms ?299 + taxes joining/annual fees, 1% cashback on e-commerce/POS/contactless/UPI, separate non-expiring coins on UPI through AU 0101 only, 2 airport visits/quarter after ?50,000 spend in the same calendar quarter, 2 railway visits/quarter and 1% fuel waiver on ?400??5,000 transactions capped at ?100 per statement. Corrected generic AU finance to 3.75% monthly, cash advance to 2.5%/?500 minimum, and forex to 3.49%. Coin earn and conversion value remain unknown; issuer says select exclusions exist but does not enumerate them on the current page. The 1% cashback claim is represented as the advertised rate, with exclusion/cap detail explicitly marked incomplete.

2026-10-26 follow-up: Rechecked `data/cards/au/spont.yaml` against the [current SPONT page](https://www.au.bank.in/personal-banking/credit-cards/au-spont-credit-card), the [current credit-card overview and MITC/fees FAQ](https://www.au.bank.in/personal-banking/credit-cards), the [30-Sep-2026 KFS](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), and the [23-Apr-2024 launch release](https://www.au.bank.in/content/dam/aubank/in/en/pdfs/press-release/2024/au-small-finance-bank-launches-atm-insurance-au-spont-rupay--secured-credit-card-nomo-au-0101-business-app-and-au0101-version-20---april-23-2024.pdf). Corrected the launch placeholder to 23-Apr-2024 and removed the unsupported RuPay Platinum tier. Current fee provenance now covers the INR 299 joining/annual fee, 3.49% forex, 3.75% monthly finance and 2.5% cash advance/minimum INR 500; effective dates remain observation dates because the issuer does not date the full schedule. Filled explicit provenance for 1% cashback conversion and the INR 50,000 same-calendar-quarter airport-lounge gate; fuel is 1% on INR 400-5,000, capped INR 100 per statement cycle, and railway access is 2/quarter. Coins remain non-expiring but their earn/value are unpublished. The AU launch release says select cashback exclusions apply, but does not name them; the current product page's accessible copy does not show an amount cap. A generic AU cashback FAQ says cashback applies to POS/online and excludes cash/fuel, while SPONT-specific terms explicitly include UPI through any UPI channel. Kept the special UPI claim and documented that broader exclusion/cap scope remains unresolved rather than guessing; removed the prior unsupported detailed exclusion list. The AU card overview advertises milestone benefits without publishing SPONT award conditions or amounts; captured as unquantified only. Exact network tier, lounge guest rules and railway guest/add-on terms are unpublished.
### AU Bank Xcite and Xcite Ace (2026-10-25)

Rechecked the current product pages, AU Rewardz FAQ and May 2026 cardmember agreement. For Xcite, the public page confirms a Ã¢â€šÂ¹249 annual membership fee, renewal waiver after Ã¢â€šÂ¹1 lakh retail spend in the previous card-anniversary year, 2X points during days 1Ã¢â‚¬â€œ5 each month, railway lounge access of 8/year (maximum 2/calendar quarter), and fuel waiver of 1% for Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000 transactions capped at Ã¢â€šÂ¹100/statement. It does not publish Xcite's base or selected-category earn rates in text, so those calculator rates are now unknown; the former 15X/2X claims should be checked against the linked artwork or card-specific KFS before restoring them. Corrected AU Rewardz value from Ã¢â€šÂ¹0.25 to Ã¢â€šÂ¹0.0025/point (0.25 paise); e-voucher value is lower at Ã¢â€šÂ¹0.002/point. Removed the false airport-lounge count: the current Xcite page lists railway lounges only. Current public annual-fee block does not separately state joining fee, though the schema requires a numeric joining fee; current Ã¢â€šÂ¹249 field remains pending KFS confirmation. Product page provides salaried age 21Ã¢â‚¬â€œ60 and self-employed age 25Ã¢â‚¬â€œ65.

For Xcite Ace, the current page confirms Ã¢â€šÂ¹749 annual membership, Ã¢â€šÂ¹2 lakh renewal waiver spend, up to 3% cashback through monthly milestones, 2 domestic airport visits/quarter after Ã¢â€šÂ¹50,000 previous-quarter spend, 8 railway visits/year (maximum 2/quarter), Ã¢â€šÂ¹50 lakh air-accident cover and fuel waiver capped at Ã¢â€šÂ¹100/statement. Exact milestone tiers are not given in the public text, so base cashback rate is now unknown. Corrected monthly finance charge to 3.75% and cash-advance minimum to Ã¢â€šÂ¹500, consistent with AU's current general fee page. Public annual-fee block does not separately identify joining fee; the required numeric field remains Ã¢â€šÂ¹749 pending KFS confirmation. Published eligibility ages are salaried 21Ã¢â‚¬â€œ60 and self-employed 25Ã¢â‚¬â€œ65.


### AU Bank Xcite family follow-up (2026-10-25)

Rechecked Xcite and Xcite Ace against their current product pages and the 30 Sep 2026 AU Key Fact Statement. The KFS confirms joining/annual fees of Ã¢â€šÂ¹249 for Xcite and Ã¢â€šÂ¹749 for Xcite Ace, 3.75% monthly finance charge, 2.5% cash-advance fee with Ã¢â€šÂ¹500 minimum, and 3.49% forex. Product pages confirm Ã¢â€šÂ¹1 lakh and Ã¢â€šÂ¹2 lakh renewal waiver thresholds respectively. Xcite's published fuel waiver is 1% on Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000 transactions capped at Ã¢â€šÂ¹100/statement (the earlier record's Ã¢â€šÂ¹150 cap was wrong). Xcite Ace shows separate access: 2 domestic airport visits/quarter after Ã¢â€šÂ¹50,000 previous-quarter spend, plus 8 railway visits/year capped at 2/quarter; its air-accident cover is Ã¢â€šÂ¹50 lakh. Its Ã¢â‚¬Å“up to 3%Ã¢â‚¬Â monthly cashback does not disclose milestone tiers in text, so no generic earn rate is modeled.

Xcite Ultra's current page confirms Ã¢â€šÂ¹749 joining/annual fees in the KFS, Ã¢â€šÂ¹2 lakh renewal waiver, 500 bonus points after Ã¢â€šÂ¹5,000 eligible retail spend during days 1Ã¢â‚¬â€œ5 monthly, 5,000 points after Ã¢â€šÂ¹2.5 lakh anniversary-year retail spend, 2 domestic airport visits/quarter, 8 railway visits/year capped at 2/quarter, Ã¢â€šÂ¹20 lakh air-accident cover, and a 1% fuel waiver capped at Ã¢â€šÂ¹100/statement. Both bonus-point values are now left unpriced because ordinary AU Rewardz points are worth Ã¢â€šÂ¹0.0025 and e-vouchers Ã¢â€šÂ¹0.002 each, producing fractional rupee amounts; prior modeled values of Ã¢â€šÂ¹125 and Ã¢â€šÂ¹250 materially overstated value. Xcite Ultra's base/category earn rate is not stated in the product page text and is now unknown. The 25,000-point statement cap is retained from AU's current cardmember agreement. Current published age ranges for all three Xcite variants are salaried 21Ã¢â‚¬â€œ60 and self-employed 25Ã¢â‚¬â€œ65.


### AU Bank Vetta (2026-10-25)

Rechecked the current Vetta page and Sep 2026 KFS/MITC. Corrected the international markup from 1.99% to 3.49%, finance charge from 3.49% to 3.75%, cash-advance minimum from Ã¢â€šÂ¹300 to Ã¢â€šÂ¹500, and fuel-waiver cap from Ã¢â€šÂ¹250 to Ã¢â€šÂ¹100 per statement. Current fee is Ã¢â€šÂ¹2,999, with Ã¢â€šÂ¹40,000 retail spend within 90 days for first-year waiver and Ã¢â€šÂ¹1.5 lakh retail spend in the prior anniversary year for renewal waiver. The current page confirms up to 4 Reward Points/Ã¢â€šÂ¹100, but does not provide its base/category table in text; removed the unsourced 2-point base and international multiplier from calculator data. Corrected ordinary AU Rewardz value to Ã¢â€šÂ¹0.0025/point. Birthday reward remains 1,000 points per retail transaction on the cardholder's birthday, with rupee value left unknown because the implied Ã¢â€šÂ¹2.50 is fractional and redemption value can vary by catalog. Replaced 4 domestic airport visits/quarter with 1 visit/quarter gated on Ã¢â€šÂ¹50,000 spend in the calendar quarter effective 10 Apr 2026; retained 4 international visits/year (one/quarter), noting Priority Pass use within India is chargeable. Added the separate 2 railway visits/quarter benefit and corrected eligibility ages. Removed the unsupported historical golf allowance. The product page still shows quarterly/yearly milestone promotions as artwork without text details; no numeric milestone thresholds are modeled until those terms are readable.

### AU Bank Zenith and Zenith+ (2026-10-25)

Rechecked both product pages, the Sep 2026 KFS/MITC, current AU Rewardz FAQ and cardmember agreement. Zenith fees are Ã¢â€šÂ¹7,999, with a published Ã¢â€šÂ¹1.25 lakh retail spend gate within 90 days for a first-year fee waiver and Ã¢â€šÂ¹5 lakh in the prior card-anniversary year for renewal; the public page does not clarify whether the first-year waiver affects joining fee, so the calculator's modeled gate remains the renewal threshold. Corrected forex to 3.49%, finance to 3.75% monthly, cash advance to 2.5%/Ã¢â€šÂ¹500, and fuel-waiver cap to Ã¢â€šÂ¹100/month. The current page lists a 1,000-point bonus at Ã¢â€šÂ¹50,000 statement-cycle retail spend, 2 domestic and 2 international airport visits per quarter, and domestic access gated on Ã¢â€šÂ¹50,000 preceding-calendar-quarter retail spend. International access requires a request-based Priority Pass and use within India is chargeable. The generic Rewardz point value is 0.25 paise, not Ã¢â€šÂ¹0.25; monthly bonus value is left unknown because the implied Ã¢â€šÂ¹2.50 is fractional. Birthday bonus quantity is not published in text, so it is unpriced. Removed the unsupported 2-point base/5X accelerator and unverified insured amounts; current page does not publish base/category earn-rate details in text. Added occupational age bands.

Zenith+ current page/KFS confirms Ã¢â€šÂ¹4,999 joining/annual fee, Ã¢â€šÂ¹8 lakh renewal waiver, 0.99% forex, 1.99% monthly finance charge, 2.5%/Ã¢â€šÂ¹500 cash advance, and Ã¢â€šÂ¹1,000 fuel-waiver cap. AU FAQ gives Zenith+ points a card-specific value of Ã¢â€šÂ¹1 each (the generic 0.25-paise valuation does not apply). Current earn page says up to 2 points/Ã¢â€šÂ¹100 on dining, travel and international spend but does not state base rate in text; it remains unknown. Current cardmember agreement caps earning at 25,000 points per statement cycle. Corrected lounge counts from unlimited to 4 domestic and 4 international visits per quarter (16/year each); Priority Pass use in India is chargeable. Added the 4/year Meet & Assist service. Removed unsupported unlimited golf and insurance limits, retaining the qualitative golf benefit. The product page describes monthly milestones but does not publish thresholds/rewards in text. Eligibility page states Ã¢â€šÂ¹2.5 lakh monthly net income and ages 21Ã¢â‚¬â€œ60 salaried / 25Ã¢â‚¬â€œ65 self-employed; monthly income is preserved in notes rather than annualized. The page has both Visa and RuPay offer sections while this record models Visa; network-specific card differences need a separate variant-level review.

### AU Bank LIT (2026-10-25)

Updated charges to current AU KFS/MITC: 3.49% forex, 3.75% monthly finance charge and 2.5%/Ã¢â€šÂ¹500 cash advance; base card remains lifetime-free. Current LIT terms confirm 1 Reward Point/Ã¢â€šÂ¹100 eligible retail spend, a 10,000-point statement-cycle cap, and conditional 5X/10X online/offline reward features. AU Rewardz catalogue value is 0.25 paise/point; the generic e-voucher value is lower (0.20 paise), so do not apply catalogue value to voucher redemptions. Corrected the old 0.99% forex, Ã¢â€šÂ¹300 cash minimum, and incorrect dining accelerator. Optional features generally run 90 days, charge in-app plus GST, and may auto-renew. Lounge access is up to 2 visits per 90-day feature period; it requires paid activation. The optional fuel feature waives 1% on Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000 transactions up to Ã¢â€šÂ¹1,500 per 90 days, while the KFS says LIT has no standard fuel waiver. Both remain conditional; calculator inputs do not capture feature selections, feature prices, or renewal. Documented optional cashback/milestone and membership spend conditions, but these cannot be calculated confidently until the UI asks which paid features are active. Eligibility ages are salaried 21Ã¢â‚¬â€œ60 and self-employed 25Ã¢â‚¬â€œ65; income/score thresholds are unknown.

### AU Bank NOMO (2026-10-25)

Corrected the one-time joining fee to Ã¢â€šÂ¹199 (annual fee Ã¢â€šÂ¹0 from year two), forex to 0.99%, monthly finance to 3.75%, and cash-advance minimum to Ã¢â€šÂ¹500. Updated eligible retail earn to 2 points/Ã¢â€šÂ¹100, utility/insurance to 1 point/Ã¢â€šÂ¹100, and the shared statement cap to 5,000 points. Point value remains unknown: the NOMO FAQ says Ã¢â€šÂ¹0.25 while AU Rewardz's current generic FAQ says 0.25 paise, a 100Ãƒâ€” conflict; both the INR conversion and welcome/milestone values are left unpriced pending AU clarification. Current page lists 500 welcome points and tiered quarterly milestones: 500 points at Ã¢â€šÂ¹25,000, doubling to 1,000 total at Ã¢â€šÂ¹50,000. The schema records one threshold so the tiers cannot be double-counted. Lounge access is now 2 visits per quarter after Ã¢â€šÂ¹50,000 net retail spend in the preceding calendar quarter, primary cardholder only; the spend threshold is structured for the calculator, though it uses the customer's provided spend as a proxy for the prior quarter. This supersedes old 1 visit/Ã¢â€šÂ¹20,000 same-quarter wording. Corrected fuel cap to Ã¢â€šÂ¹100/month, eligible Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000 transactions. Added 2 quarterly railway lounge visits and the secured-card FD minimum (Ã¢â€šÂ¹20,000), 100% lien, 24-month reinvestment description. Eligibility is resident Indian age 18Ã¢â‚¬â€œ99 with eligible sole-name FD; income and score thresholds unknown.

### AU Bank KOSMO (2026-10-25)

The current AU KFS explicitly lists KOSMO at 3.49% forex markup, 3.75% monthly finance, and 2.5%/Ã¢â€šÂ¹500 minimum cash advance; updated field-level source paths. Product page confirms zero joining and renewal fees, 1% fuel waiver on Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000 capped at Ã¢â€šÂ¹100, and eligibility age bands. Kiwi points are credited in the Kiwi app on eligible UPI Scan & Pay, e-commerce, POS and contactless spend, but the public AU page does not publish the KOSMO earn rate or unit value; both remain unknown and out of calculator estimates. KOSMO lounge access is not advertised on the current product page.

### AU Bank Laksya (2026-10-25)

Rechecked the current product page, Sep 2026 KFS and cardmember agreement. Confirmed forex 3.49%; updated fee evidence coverage for Ã¢â€šÂ¹1,000 joining/annual fee, Ã¢â€šÂ¹2 lakh renewal waiver, 3.75% monthly finance, and 2.5%/Ã¢â€šÂ¹500 cash advance. Added the agreement's 25,000-point statement-cycle card-wide cap. Structured the 8-per-year domestic lounge allowance and Ã¢â€šÂ¹50,000 prior-quarter gate; calculator uses declared average spend as a proxy for the prior quarter. Current page says 4,000 welcome points or Ã¢â€šÂ¹1,000 voucher within 30 days, but the option is customer-selected; benefit value is now null until the calculator asks which option was chosen. Current details also confirm 5 points/Ã¢â€šÂ¹100 on grocery/departmental and contactless, with 1,000-point statement cap for grocery/departmental but no cap for contactless. Contactless remains unmodeled because spend input cannot isolate it; utility/insurance/telecom remain conservatively omitted because their 100-point per-transaction cap cannot be represented from aggregate inputs. Lounge and fee terms do not publish income cutoffs; age bands remain salaried 21Ã¢â‚¬â€œ60 and self-employed 25Ã¢â‚¬â€œ65. Fuel waiver remains 1% on Ã¢â€šÂ¹400Ã¢â‚¬â€œÃ¢â€šÂ¹5,000, capped Ã¢â€šÂ¹150 per statement month.


### HDFC Diners Club Black Metal Edition (2026-10-25)

Current HDFC product/fees/eligibility pages and the current MITC confirm the INR 10,000 joining and renewal fee, INR 8 lakh renewal waiver, 2% forex, 1.99% monthly finance, and 2.5%/INR 500 cash advance. Current SmartBuy earn is 10X hotels and 5X flights, sharing a 7,500-point monthly cap; point value is set to INR 1 for SmartBuy travel. Removed the previous INR 1.10 general valuation and left transfer value explicitly variable by partner. Grocery, utility and telecom base points share a 2,000/month cap. Weekend dining's 2X condition applies only Saturday/Sunday at standalone restaurant MCCs 5812/5813/5814 with INR 150 minimum, so it is documented but not scored by the current inputs. Added the 75,000-point statement cap and redemption constraints. Insurance earn remains excluded because current HDFC guidance says 5,000/month, while older card-specific terms say 5,000/day. Removed an unsupported INR 4,000 welcome valuation and the fuel waiver (MITC says not applicable). Current product page lists unlimited lounge access for primary/add-on members, six golf rounds per quarter, and insurance covers; its archived insurance policy expired 22-Jul-2026, so coverage amounts need current policy confirmation. Eligibility ages and distinct net monthly/net annual income terms are captured without annualizing the monthly threshold.


### SBI Card ELITE Advantage (2026-10-25)

The official SBI sitemap lists ELITE Advantage, but its card link redirects to generic SBI Card ELITE. Consequently, removed unverified standard-ELITE rewards and benefit data from the Advantage record and left its earn/conversion terms unknown. Current May-2026 KFS confirms annual/renewal fees of INR 4,999 and an INR 10 lakh renewal waiver. The joining fee remains unknown because the INR 4,999 value comes from generic ELITE terms, not an Advantage-specific schedule. The current MITC cash-advance fee is 2.5%/INR 500 minimum. Finance rate is unknown because current evidence does not establish whether ELITE Advantage is secured or unsecured; removed the unsupported secured/FD-backed classification, 2.75% finance rate, synthetic 2016 launch date and FD-backed tag. Forex, add-on fee, collateral minimum and applicant thresholds also need Advantage-specific confirmation.

### SBI AURUM (2026-10-25)

Rechecked the live SBI AURUM benefits page, current product/MITC pages, and card-specific AURUM rewards T&C. Current terms support 4 Reward Points per INR 100, INR 0.25 per point, no expiry, and exclusions for fuel, rent, digital gaming MCCs and other listed transaction/MCC groups. Removed the unsupported 10-point dining/grocery/movie accelerator. Updated annual fee/renewal waiver, forex, finance and cash-advance terms from current MITC; the 2024-11-01 fee effective date remains unverified. Corrected international guest access to one complimentary guest visit per quarter, golf to four rounds per quarter plus 12 lessons/year, and welcome points to payment of joining fee. Added current airport spa, BookMyShow, Club Marriott, WSJ/Mint, IPV and District dining benefits. Removed old voucher milestones because the current issuer page does not confirm them; removed insurance amounts because current page does not publish policy terms. Fuel-waiver terms remain pending card-specific T&C confirmation. Validation passes; numeric-evidence coverage script refreshed to 534/2,399 fees, 431/2,960 rewards, 328/3,028 benefits and 373/373 eligibility fields.


### SBI Cashback (2026-10-25)

Rechecked SBI's current May-2026 KFS/MITC, Cashback FAQ, cardholder terms PDF and 25-Feb-2026 revision notice. Current rates are 5% on online transactions and 1% on offline transactions, with separate INR 2,000 statement-cycle caps and INR 4,000 combined cap effective 1-Apr-2026. Online classification uses card-network/acquirer indicators; all transactions not identified as online count as offline, and network/MCC recognition is best-effort. The model has no dependable channel split for all spend categories, so its current result can incorrectly award offline cashback on online-cap overflow; this remains tracked in E17. Terms also exclude transactions below INR 100 and round cashback down per individual transaction, which aggregate monthly spend cannot reproduce. Added the complete cardholder-term MCC exclusion list including the 2026 gaming, toll and government additions; cashback accrues by posting/settlement date, is reversed on returns/refunds/conversions, and is credited within two working days of statement generation. Current fee evidence confirms INR 999 joining and annual fees, INR 2 lakh renewal waiver, 3.5% forex, up to 3.75% monthly finance and 2.5%/INR 500 cash advance. Fuel waiver is 1% on INR 500?3,000 transactions, capped at INR 100 per statement cycle/account. SBI does not publish a card-specific income minimum or fixed score threshold; occupation-specific age bands are backed by SBI's issuance policy. Validation passes; numeric-evidence coverage is 538/2,399 fees, 437/2,960 rewards, 332/3,028 benefits and 373/373 eligibility fields.


### SBI Card PRIME (2026-10-25)

Rechecked the current PRIME cardholder booklet, live core SBI Card PRIME page, MITC and lounge terms. Fees are INR 2,999 joining/annual, with INR 3 lakh renewal waiver; forex is 3.5%, finance up to 3.75% monthly, and cash advance 2.5%/INR 500. Base earn is 2 points/INR 100; dining, departmental, grocery and movie MCCs earn 10 total points/INR 100, with a shared 7,500 accelerated-point calendar-month cap and base earn continuing after the cap. Birthday earn is excluded from estimates because the SBI Cardholder Agreement says 2,000 points/year but the current PRIME booklet says 1,800; customer birthday date is also not an input. Utility standing-instruction earn is limited to legacy registrations made by 31-Mar-2021 and is not modeled. Outstanding-bill redemption is 4 points/INR 1, with applicable INR 99 + tax fee; general points expire after 24 months. Confirmed 8 domestic and 4 international visits/year (maximum 2/quarter); Priority Pass is primary-cardholder only, and guests/over-limit visits can be chargeable. Captured quarterly INR 1,000 and annual INR 7,000 vouchers, INR 3 lakh renewal waiver, INR 3,000 welcome voucher, fuel waiver and one-year Club ITC Silver. The calculator lacks birthday-date and lounge-usage inputs, so reported value cannot fully personalize these benefits.


### SBI SimplyCLICK (2026-10-25)

Rechecked SBI's live SimplyCLICK page, eApply flow, card-specific Reward Point terms (including the partner table updated 20-Mar-2026), reward FAQ and current MITC. Current fees are INR 499 joining/annual, with renewal reversal at INR 1 lakh annual spend; forex is 3.5%, finance up to 3.75% monthly, and cash advance 2.5%/INR 500. Base earn is 1 point/INR 100; current page lists 10 points/INR 100 on eligible INR online partner spends and 5 points/INR 100 on other eligible online spends. The 5X stream is capped at 10,000 points/calendar month, then eligible spend earns base; an SBI notice effective 1-Oct-2020 states a 10,000-point monthly cap on the cumulative partner 10X stream; the current SimplyCLICK Reward Point T&C does not restate that cap while explicitly capping other online 5X at 10,000. The record conservatively retains the last explicit partner cap pending SBI clarification. Partner rewards depend on correct partner MIDs and network/acquirer online flags; Cleartrip/Yatra affiliate bookings are excluded and GyFTR voucher points require the cardholder to use the SimplyCLICK GyFTR portal. Added current exclusions: wallet MCCs 6540/6541, rent 6513, government 9311/9399, digital gaming 5816/7993/7994, cash advances, balance transfers, encash, Flexipay and offline fuel MCCs 5172/5541/5542/5983. SBI Card site/app utility bill payments do not receive 5X. Current milestones are separate INR 2,000 Cleartrip/Yatra vouchers at INR 1 lakh and INR 2 lakh annual online spend; the INR 500 welcome Amazon gift follows first-year fee payment, with good-standing and voucher-validity conditions. Fuel waiver is 1% for INR 500-INR 3,000 transactions, capped INR 100 per statement cycle/account. Removed the unsupported 0.22 realized point value; catalogue values vary and redemption net value is unknown because statement-credit fee/batch timing and customer redemption choice cannot be modeled from spend alone. Statement credit is 4 points/INR 1 before fees, requires 4,000-point increments and is capped at 60,000 points/month from 1-Apr-2026; general Reward Points expire after 24 months. Validation passes. Numeric evidence coverage is 546/2,399 fees, 449/2,955 rewards, 353/3,027 benefits and 373/373 eligibility fields.


### SBI SimplySAVE (2026-10-25)

Rechecked the current SimplySAVE page, card-specific membership kit, current MITC and general SBI reward rules. Current joining/annual fees are INR 499 with renewal reversal at INR 1 lakh annual spend; forex is 3.5%, finance up to 3.75% monthly, and cash advance 2.5%/INR 500. Base earn is 1 point/INR 150; dining MCCs 5812/5813/5814, grocery MCC 5411, departmental stores MCC 5311 and movie theatres MCC 7832 earn 10 total points/INR 150. Accelerated earn is capped at 5,000 points/calendar month, after which eligible spend earns the base 1 point/INR 150. The customer profile has no separate departmental-store bucket, so that category cannot be scored separately. Current offer gives 2,000 bonus points (issuer-stated INR 500 value) after at least INR 2,000 spend in the first 60 days; offer eligibility terms apply. Fuel waiver is 1% on INR 500-INR 3,000 transactions, capped INR 100 per statement cycle/account (taxes/other charges excluded). Removed unsupported INR 0.22 realized point value; catalogue conversion is item-dependent and unknown. Statement credit is INR 0.25 per point before fees, with a current INR 99 + tax redemption fee where applicable, 4,000-point increments and 60,000 points/month cap from 1-Apr-2026, and 24-month expiry. Redemption batching and net realized value cannot be calculated from the profile inputs.


### SBI SimplyCLICK Advantage (2026-10-25)

Reviewed the Advantage-specific cardholder T&C, current MITC/KFS and SBI reward guidance. Current annual/renewal fees are INR 499 with INR 1 lakh preceding-year renewal waiver; joining fee is INR 499 from the Advantage welcome terms. Forex is 3.5%; because Advantage is a secured card, current MITC finance charges are 2.75% monthly (corrected from the old unsecured 3.75%); cash advance is 2.5%/INR 500. Reward earn is 1 point/INR 100 base, 10X on eligible INR online partner transactions and 5X on other eligible online spend. A 2020 SBI notice states separate 10,000-point monthly caps for both accelerated streams, with base earn after the cap; newer Advantage T&C restates the 5X cap but omits the 10X partner cap, so the data conservatively retains the last explicit cap pending issuer clarification. Advantage-specific terms prohibit using Reward Points to pay the card balance; therefore removed statement-credit conversion and left point value/catalogue value unknown. Added the Advantage partner list and conditions: Cleartrip/Yatra affiliate exclusions, Amazon gift-card exclusion, GyFTR portal requirement, partner-MID and network/acquirer online-flag dependence. Captured wallet MCCs 6540/6541, rent 6513, government 9311/9399, gaming 5816/7993/7994, cash advance, balance transfer, Encash, Flexipay and offline fuel MCCs 5172/5541/5542/5983. Current benefits include two INR 2,000 annual-online-spend vouchers at INR 1 lakh and INR 2 lakh, INR 500 Amazon welcome voucher after first-year fee with good-standing and 30-day issuance/12-month redemption conditions, and 1% fuel waiver on INR 500-INR 3,000 transactions capped INR 100/month. The issuer labels it the secured SimplyCLICK variant but does not publish minimum deposit, exact collateral requirements or eligibility cutoffs; exact launch date is unset.

### SBI SimplySAVE Advantage

Reviewed the current Advantage-specific reward T&C, current MITC, general cardholder agreement/reward terms, current SBI notices and the Advantage membership kit page. Corrected monthly finance from 3.75% to the current 2.75% secured-card rate; joining/annual fee is INR 499, renewal reversal at INR 1 lakh annual spend, forex 3.5%, and cash advance fee 2.5%/INR 500. The current Advantage reward T&C specifies 1 point/INR 150 base and 10 total points/INR 150 on dining, movies, grocery and departmental-store MCCs, capped at 5,000 accelerated points per calendar month with base earn continuing after the cap. Replaced the unsupported unlimited cap; recorded qualifying MCCs and kept unit redemption values unknown because catalog value varies. General SBI terms allow statement-credit redemption; the 2026 issuer notice sets a 4,000-point increment and 60,000-point monthly cap, while INR 99+tax processing fee can apply per batch. Current terms support 24-month expiry and fuel waiver of 1% on INR 500?3,000 transactions, capped INR 100/month. Removed the stale 2,000-point welcome claim and synthetic 2016 launch date pending current variant-specific evidence. Public evidence does not establish fixed deposit minimum, exact collateral mechanics, or application thresholds. Validation pending after this data update.

### SBI Card PRIME Advantage follow-up

Rechecked the current SBI MITC/KFS and cardholder agreement alongside the PRIME Advantage public listing. Current MITC explicitly names PRIME Advantage at INR 2,999 annual/renewal fee with renewal waiver at INR 3 lakh; cash advance is 2.5%/INR 500 minimum. Finance rate is unknown because current evidence does not establish whether PRIME Advantage is secured or unsecured. Joining fee, forex markup, and add-on fee are unknown; annual fee nullability is supported in the schema/types. Public SBI PRIME reward and benefit terms do not clearly establish applicability to PRIME Advantage, so inherited base/accelerated points, caps, redemption rates, birthday/utility earn, lounges, milestones, welcome gift, fuel, golf and insurance quantities were removed from calculator data pending Advantage-specific evidence. Reward valuation, exact launch date, collateral backing/minimum, and applicant cutoffs remain unknown. Follow-up: removed the unsupported secured/FD-backed classification and tags; `card_type` now permits null when issuer evidence does not establish it.

### SBI Card PRIME Business

Checked the current SBI sitemap, followed its PRIME Business link, and checked current MITC. SBI still lists PRIME Business in the sitemap, but the linked product page returns 404; PRIME Business is not named in the current annual-fee table. Its 2019 card-specific booklet says joining and annual fees are charged at prevailing rates, but does not state the amounts. Removed copied INR 2,999 joining/annual/renewal fees and INR 3 lakh waiver; these are now unknown, and annual fee is nullable in the schema/types to avoid forcing an unsupported number. Current SBI MITC generally supports 3.5% forex for cards outside its explicit exception list, 3.75% monthly finance for unsecured cards, and 2.5%/INR 500 cash advance; these broad rules are retained with medium confidence because a current PRIME Business schedule is unavailable. Removed all copied reward rates, point values, caps, milestones, lounge counts, welcome amounts, fuel limits, golf/insurance quantities, and the unsupported approximately INR 12 lakh income claim. Historical card-specific rewards and benefits remain source notes only, not current calculator inputs. Synthetic 2018 launch date removed. SBI's published occupational age policy remains documented; no business-specific income or credit-score threshold found. Status remains active because the issuer sitemap still lists the card, despite the broken product link. Calculator follow-up: `effectiveAnnualFee()` currently defaults a null annual fee to zero; it must surface unknown fee costs instead of presenting a fee-free net estimate.

### SBI Card ELITE Business

Located SBI's card-specific ELITE Business booklet dated 2019-12-05 after confirming the current product URL returns 404. The historical booklet sets 2 RP/INR 100 base and total 10 RP/INR 100 for dining, office supplies and utilities (office supplies MCC 5111/5943; dining 5812/5813/5814); it says points have no monetary value and expire after 24 months. Current rates and caps remain unknown, so the calculator uses no rewards. Historical benefits include a INR 5,000 welcome voucher after fee payment, 6 international Priority Pass visits/year outside India (max 2/quarter, primary cardholder; India visits USD 27+tax), four anniversary-year milestone tiers (INR 3L/10k points; INR 4L/10k; INR 5L/15k; INR 8L/15k), BookMyShow discount of INR 500 or two tickets' price (max two tickets/month), and INR 1 crore air-accident cover. These benefits are not modeled as current. Removed copied 8 domestic lounge visits, standard ELITE reward categories/point valuations, and unverified fuel/milestone claims. The current product URL is broken and variant fee table absent. Removed copied INR 4,999 joining/annual/renewal fees and INR 10 lakh waiver; annual and renewal fees are null because the March 2019 card booklet says only "up to INR 4,999" and the current issuer fee table does not name ELITE Business. That older schedule recorded add-on nil, unsecured finance up to 3.35% monthly, domestic cash advance 2.5%/INR 300 minimum, international cash advance 3%/INR 300 minimum, and a 1.99% foreign-currency fee for ELITE cardholders; these are dated historical terms and are not copied into current fields. Current general SBI MITC supports 3.75% monthly finance for unsecured cards and 2.5%/INR 500 cash advance, retained with medium confidence; current forex stays unknown because ELITE Business is not named in the exception list. Removed synthetic launch date and aggregator-derived income claim; issuer-policy ages remain backed.

### Federal Bank Celesta (2026-10-25)

Rechecked the current Celesta product page, MITC, KFS, revised APR table, lounge programme, CVP terms and reward terms. Replaced the stale Ã¢â€šÂ¹3,000 fee/Ã¢â€šÂ¹5 lakh waiver in the current cohort record: customers onboarded from 3-Apr-2023 are advertised as having no joining or membership fee; older cardholders may retain prior terms, so onboarding cohort must be confirmed. Set launch date unknown because the prior 2022 date lacked a card-specific source. Corrected cash advance to 2.5%/Ã¢â€šÂ¹500 minimum, supplementary card Ã¢â€šÂ¹100 plus GST, and retained 2% forex. Finance rates are 3.75% monthly below Ã¢â€šÂ¹50,000 prior-quarter operative-account AMB and 1.99% for Ã¢â€šÂ¹3,00,001Ã¢â‚¬â€œÃ¢â€šÂ¹1 crore; issuer pages omit numeric revised APR cells for Ã¢â€šÂ¹50,000Ã¢â‚¬â€œÃ¢â€šÂ¹3 lakh and above Ã¢â€šÂ¹1 crore in their text extraction, so those tiers remain null rather than interpolated. Rates are reviewed quarterly.

Corrected rewards to 1 point/Ã¢â€šÂ¹100 base, 2X dining and 3X travel/international. The issuer does not state accelerator caps, so rates are marked `not-published`, not unlimited. Catalog face value is Ã¢â€šÂ¹0.25/point; statement credit is Ã¢â€šÂ¹0.10/point; practical realized value remains unknown and redemption fees vary (MITC Ã¢â€šÂ¹99/request; FAQ describes Ã¢â€šÂ¹99 as a minimum). Added the 250-point monthly insurance-MCC cap and issuer-listed exclusions. Replaced 8+8 annual lounge figures with 2 domestic visits/quarter after Ã¢â€šÂ¹60,000 previous-quarter spend and 2 international/year without a spend gate; captured primary/add-on restrictions, quarter windows and validation/reimbursement charges in notes. Restricted the Ã¢â€šÂ¹600 welcome voucher to notified eligible primary cardholders and captured its Ã¢â€šÂ¹10,000/30-day spend gate; added monthly INOX BOGO up to Ã¢â€šÂ¹100 and fuel-waiver cap Ã¢â€šÂ¹150/month. Removed unsupported golf and insurance covers. A targeted 10,000-point promotion is excluded from baseline because it applies only to individually notified customers.

Validation is clean. Numeric evidence coverage is now 587/2,395 fee fields (25%), 477/2,918 reward fields (16%), 385/2,970 benefit fields (13%), and 373/373 eligibility fields (100%). These corpus-wide coverage counts are audit aids, not proof that every numeric claim has been source-verified.

### Federal Bank Imperio (2026-10-25)

Checked the live Imperio product page, current KFS/MITC, revised APR page, lounge programme and current card benefit terms. The current no-joining/no-membership-fee offer applies to customers onboarded from 3-Apr-2023; preserved Ã¢â€šÂ¹1,500 as a legacy-cohort note and removed the unsupported Ã¢â€šÂ¹2 lakh fee waiver. Removed the unsupported 2022 launch date. Current KFS confirms 3.5% forex, Ã¢â€šÂ¹100 add-on card fee plus GST (maximum four), and 2.5%/Ã¢â€šÂ¹500 cash advance. APR tiers depend on prior-quarter operative-account AMB and are reviewed quarterly; no-account accounts are 3.75% monthly. Numeric APR cells for Ã¢â€šÂ¹50,000Ã¢â‚¬â€œÃ¢â€šÂ¹3 lakh and >Ã¢â€šÂ¹1 crore are absent from current text-rendered tables, so left those bands unknown rather than extrapolating.

Replaced the old 4/Ã¢â€šÂ¹150 base-rate model with MITC-confirmed 1 point/Ã¢â€šÂ¹150 and face value Ã¢â€šÂ¹0.25/point, statement credit Ã¢â€šÂ¹0.10/point. Corrected category accelerators to total 3X healthcare/grocery and 2X utilities; the previously listed dining accelerator was wrong. Accelerator caps are unpublished, so marked them not-published. Added 250 points/month total insurance-MCC cap and current exclusions. Corrected the welcome voucher to Ã¢â€šÂ¹400 after Ã¢â€šÂ¹5,000 in 30 days with notification, primary-holder, active/full-KYC, once-in-lifetime and issue/expiry caveats; added quarterly INOX BOGO up to Ã¢â€šÂ¹100 and retained the Ã¢â€šÂ¹50,000 quarterly BigBasket voucher milestone with value null because the issuer does not publish the voucher amount. Fuel waiver now has the Ã¢â€šÂ¹150 monthly cap; lounge access is 2 domestic visits in the next quarter after Ã¢â€šÂ¹40,000 in the immediately preceding quarter. Healthcare spend cannot be isolated in the current calculator profile, and BigBasket voucher value remains unknown.

Portfolio numeric evidence coverage after Celesta and Imperio: 604/2,406 fee fields (25%), 487/2,919 reward fields (17%), 397/2,973 benefit fields (13%), and 373/373 eligibility fields (100%). Coverage measures explicit source-path mapping, not factual correctness.

### Federal Bank Signet Visa and RuPay (2026-10-25)

Rechecked both live Signet product pages against the current KFS/MITC, revised APR rates, lounge eligibility, CVP offers and reward terms. Replaced the former Ã¢â€šÂ¹750/Ã¢â€šÂ¹999 fee entries with zero joining/membership fee for customers onboarded from 3-Apr-2023; legacy Signet fee is Ã¢â€šÂ¹750 with Ã¢â€šÂ¹75,000 annual waiver. Both Signet variants use 3.5% forex, Ã¢â€šÂ¹100 add-on fee plus GST (maximum four), Ã¢â€šÂ¹500 minimum cash advance fee and relationship-tiered APR. Null APR bands remain null where revised rates are absent in issuer table text; customers without a Federal operative account pay 3.75% monthly. Removed synthetic launch dates.

Corrected both reward records to 1 point/Ã¢â€šÂ¹200 base, 3X electronics/apparel, 2X entertainment, Ã¢â€šÂ¹0.25 face value and Ã¢â€šÂ¹0.10 statement credit. Removed Visa Signet international accelerator. Added current issuer exclusions and the 250-point monthly insurance-MCC cap, and marked accelerator caps unpublished. Spend buckets cannot isolate the named electronics/apparel merchant/MCC set, so calculator scoring is approximate. Both variants can link RuPay credit to UPI, but the issuer does not publish a separate UPI reward rate or scope.

Corrected Visa domestic lounge allowance to 1/quarter after Ã¢â€šÂ¹20,000 previous-quarter spend. RuPay Signet has the same threshold/count, plus advertised Ã¢â€šÂ¹2 lakh personal-accident cover and concierge; precise insurance policy conditions remain unverified. Both variants have a Ã¢â€šÂ¹3,000/30-day Amazon voucher welcome offer (Ã¢â€šÂ¹200, confirmed by CVP terms), quarterly INOX BOGO up to Ã¢â€šÂ¹100, and Ã¢â€šÂ¹20,000 quarterly spend voucher benefit. Voucher face value is not published, so removed unsupported Ã¢â€šÂ¹250 and left the Swiggy voucher unpriced. Removed unsupported fuel waivers for both Signet variants. Visa product page has conflicting embedded promotional content but CVP terms confirm the Ã¢â€šÂ¹200 welcome amount.

Portfolio numeric evidence coverage after Federal Celesta, Imperio and both Signet reviews: 638/2,428 fee fields (26%), 507/2,925 reward fields (17%), 414/2,974 benefit fields (14%), and 373/373 eligibility fields (100%). Coverage is an evidence-path audit aid only.

### Federal Bank RuPay Wave follow-up (2026-10-25)

Rechecked the current Wave product page, card-specific KFS and MITC, current
general MITC, and Wave-specific terms. The current general T&C says Wave is
virtual-only; therefore the current KFS's nil joining and annual fees apply,
and the older Wave MITC's physical-card option is stale. The Wave-specific
MITC still lists a Ã¢â€šÂ¹199 annual fee, so that conflict is retained in the fee
source notes. The current KFS says cash advance is not applicable and the
general MITC says its cash-advance fee is not applicable for Wave, while the
Wave-specific MITC table lists the standard 2.5%/Ã¢â€šÂ¹500 charge. Cash-advance
fee remains unknown pending issuer clarification. The general current MITC
confirms the 3.75% APR below Ã¢â€šÂ¹50,000 AMB and 1.99% for Ã¢â€šÂ¹3 lakhÃ¢â‚¬â€œÃ¢â€šÂ¹10 lakh;
the two omitted bands remain unknown. Product page and Wave terms confirm
1 point/Ã¢â€šÂ¹200, a Ã¢â€šÂ¹50,000 first-quarter spend trigger for 1,000 points, and
10% cashback on one Ã¢â€šÂ¹150+ UPI transaction in the first 30 days, capped at
Ã¢â€šÂ¹100. The record preserves the one-time milestone specified in T&C despite
the product page's generic Ã¢â‚¬Å“quarterlyÃ¢â‚¬Â wording. Rent and other listed
restricted categories remain non-earning. Eligibility is restricted to
existing Visa/Mastercard primary Federal cardholders; Wave shares their
credit limit and has a separate bill and reward account. Numeric source-path
coverage after this review: 653/2,437 fees, 513/2,926 rewards, 419/2,974 benefits, and 373/373 eligibility values. Coverage is traceability, not proof
that every claim has been independently established.

### Standard Chartered Beyond (2026-10-25)

Rechecked the live Beyond product page, card-specific terms, and June 2026
MITC. Corrected joining/renewal fees to INR 15,000/INR 25,000, 2% forex,
3.75% monthly finance, 3%/INR 300 cash advance, 5 RP/INR 150 base and 3
RP/INR 150 for issuer-listed essential categories. Catalogue value is INR 1
per point; redemption has an INR 99 handling/courier fee, so realized value
varies with redemption size and route. Fuel earns no points; duty-free MCC
5309 earns 15% cashback capped at INR 1,500 per statement cycle. Rent MCC
6513 has a 1% processing fee. Removed unsupported reward exclusions and
unsupported concierge claim.

Recorded current lounge summary values of 8 domestic and 6 international
visits/year conservatively, while flagging that the same issuer page headline
and detailed card terms say unlimited. Both sources describe four guest
entries per calendar year, which the per-visit guest schema cannot accurately
represent. The record captures 2 golf games/month, EazyDiner 25% up to INR
2,500 once/card/month, BookMyShow BOGO once/card/month up to INR 1,000, and
the fuel waiver and duty-free caps. Welcome vouchers are INR 15,000 after
joining-fee realization and timely minimum payment; a 60-day link period is
not treated as an eligibility/spend window. The product page advertises
60,000 reward points for INR 20 lakh annual spend, but detailed terms do not
specify qualifying-period mechanics or repeatability, so those are left
unasserted. Eligibility age 18Ã¢â‚¬â€œ70 is sourced; Priority/Private Banking and
INR 50 lakh FUM for two consecutive months are recorded as qualification
notes. FUM-based fee waiver is not expressible as spend-based waiver data.

Portfolio numeric evidence coverage after Beyond review: 658/2,439 fee
fields (27%), 520/2,926 reward fields (18%), 431/2,973 benefit fields (14%),
and 375/375 eligibility fields (100%). This measures explicit source-path
coverage, not factual correctness.

### Standard Chartered Ultimate (2026-10-25)

Rechecked the current Ultimate product page, tariff table, card-specific
terms/FAQ, and current general MITC. Corrected the record from cashback to
360 Reward Points: 5 RP/INR 150 on ordinary eligible spend, 3 RP/INR 150 on
utilities, supermarkets, insurance, property management, schools and
government, and 1 RP = INR 1 in the 360 Rewards catalogue. Card-specific
terms cap duty-free cashback at 5%, INR 1,000 per statement cycle, with no
points on those transactions; fuel earns no points and gets a 1% surcharge
waiver capped at INR 1,000 per statement cycle on MCCs 5172/5541/5542/5983.
Removed unsupported wallet, rent, EMI, insurance-premium and utility reward
exclusions; MCC 6513 rent is explicitly in the reduced-earn category. Fees
are INR 5,000 joining/renewal, nil supplementary, 2% forex, 3.75% monthly
finance and 3%/INR 300 cash advance. Added the INR 99 reward redemption
handling fee in notes.

Current terms state 4 domestic lounge visits/calendar quarter and one
Priority Pass visit/month outside India when previous-month spend exceeds INR
20,000. This conflicts with the product-page annual-value chart's 6 domestic
and 4 global visits/year; the record follows the detailed current access
terms and flags the chart discrepancy. Joining-fee payment earns 6,000
points, and renewal-fee payment earns 5,000 from year 2 (not when converted
to balance-on-EMI); the renewal reward is retained as descriptive benefit
because the milestone schema only supports spend triggers. The product page
lists four annual golf sessions, retained with a note that detailed booking
terms are not present. Captured primary-only air accident cover (INR 1 crore)
and overseas medical cover (USD 25,000, USD 100 deductible) with insurer
conditions noted. Current issuer eligibility page states age 21Ã¢â‚¬â€œ65, stable
monthly income, sourcing locations and policy checks; no numeric income or
score cutoff is published.

Portfolio numeric evidence coverage after Ultimate review: 666/2,441 fee
fields (27%), 531/2,929 reward fields (18%), 444/2,973 benefit fields (15%),
and 381/381 eligibility fields (100%). This measures explicit source-path
coverage, not factual correctness.

### Standard Chartered Priority Banking Visa Infinite (2026-10-25)

Rechecked the live Priority Visa Infinite page, consolidated card T&C and
current issuer tariff/MITC. Corrected the stale reward rates to 5 RP/INR 100
on overseas or retail-fashion spend and 2 RP/INR 100 elsewhere. Removed the
unsupported fixed INR 1 catalogue/INR 0.90 realized values, earn cap claim,
and unsubstantiated fuel/wallet/rent/insurance/EMI exclusions; current sources
reviewed do not establish a fixed redemption value or general exclusions.
Fee is complimentary for Priority Banking clients, with nil tariff joining,
annual and supplementary charges. Corrected forex to the general 3.5% rate
(tariff exception for 2% applies to Ultimate); monthly finance is 3.75%.
Cash-advance fee is left unmodeled because the live card page ATM charge
table uses outstanding-balance tiers while the general tariff states a
percentage/minimum charge.

Corrected domestic lounges to 4/quarter per eligible card. Priority Pass
benefit is 2 uses/month per card only with individual-account FUM of INR 30
lakh in the usage month and an active card; guests and additional visits are
chargeable. Current consolidated terms add 2 domestic golf games/month, one
guest game/month and one coaching session/month, subject to booking and
availability. Captured primary-only INR 1 crore overseas air-accident cover
and USD 25,000 emergency medical cover (USD 100 deductible) with conditions.
Removed unsupported fuel waiver and concierge claims. Applicant age is
21Ã¢â‚¬â€œ65; stable monthly income, Priority relationship, sourcing location and
bank policy checks apply; no numeric income or score threshold is published.

Portfolio numeric evidence coverage after Priority Visa Infinite review:
671/2,440 fee fields (28%), 536/2,927 reward fields (18%), 452/2,972 benefit
fields (15%), and 383/383 eligibility fields (100%). This measures explicit
source-path coverage, not factual correctness.

### Standard Chartered Rewards Credit Card (2026-10-25)

Rechecked the current Rewards product page and FAQ. Corrected the network to
Mastercard; joining fee is nil, renewal is INR 1,000 with reversal after INR
1.5 lakh previous-year spend, or 4,000 points awarded within 60 days of fee
realization when no waiver is received. Supplementary annual fee is INR
1,000 (tariff indicates year 2); the page does not establish a supplementary
joining fee. Current general charges are 3.5% forex, 3.75% monthly finance,
and 3%/INR 300 cash advance.

Corrected reward earn: 4 RP/INR 150 on retail, 1 RP/INR 150 on government
and insurance, no fuel points; catalogue point value INR 0.25 and statement
credit INR 0.20 with INR 99 redemption fee and 1,000-point minimum. The
additional 4 RP/INR 150 applies only to monthly retail spend above INR
20,000 and is capped at 2,000 bonus points. The current flat calculator
cannot reliably model the cumulative threshold, so this bonus is documented
but omitted from scored rates. Corrected domestic lounge to 1/quarter. Fuel
waiver is 1% for INR 400Ã¢â‚¬â€œ2,000 transactions, capped INR 400/month. Captured
age 18Ã¢â‚¬â€œ65 salaried and 18Ã¢â‚¬â€œ67 self-employed; no numeric income/score criterion
is published.

Numeric evidence coverage after Rewards review: 680/2,442 fee fields (28%),
545/2,924 reward fields (19%), 459/2,974 benefit fields (15%), and 389/389
eligibility fields (100%). Coverage measures explicit source-path mapping,
not factual correctness.

### HDFC Diners Club Privilege (2026-10-25)

Rechecked HDFC's current Diners Privilege product/fee pages, April/June 2026
card-specific terms, May 2026 feature-change notice and July 2026 lounge
voucher terms. Fees remain INR 1,000 joining/renewal with INR 3 lakh renewal
waiver and 3.5% forex. Added occupational eligibility ages (salaried 21Ã¢â‚¬â€œ60,
self-employed 21Ã¢â‚¬â€œ65), salaried net monthly income INR 35,000 and self-employed
ITR above INR 6 lakh; no score cutoff is published. Recorded the May 2026
1.75% DCC markup and INR 199 reissue fee in notes because current schema has
no dedicated fields for them.

Current product page says 4 RP/INR 200 generally, 5X Swiggy/Zomato and up to
10X SmartBuy. June card T&C says the Swiggy/Zomato rate is 20 points/INR 150
with 16 incremental points per INR 150 and a shared 2,500 monthly incremental
cap, conflicting with the page's 4/INR 200 base and May revision notice. The
record follows the current product page's 4/INR 200 basis, computes the 5X
increment proportionally (16/INR 200), and discloses the source conflict.
SmartBuy 10X is retained as an upper bound; no current numeric cap or full
eligible-category list was established, so it is flagged as unscored from
generic travel inputs. Updated route-specific point values (SmartBuy and
restaurants INR 0.50, catalogue up to INR 0.35, cashback up to INR 0.20).

From 1-Jul-2026, lounge benefit is 2 domestic + 1 international vouchers per
calendar quarter after INR 60,000 eligible spend in the preceding quarter.
Retained quarterly INR 1,500 voucher at INR 1.5 lakh spend and BMS weekend
BOGO terms. Welcome benefit is Swiggy One + Times Prime memberships after
INR 75,000 net retail spend within 90 days. Removed legacy insurance sums
pending current insurance-policy evidence and the unsupported current
airmiles-transfer claim. Numeric evidence coverage after this review:
687/2,443 fee fields (28%), 560/2,927 reward fields (19%), 468/2,968 benefit
fields (16%), and 397/397 eligibility fields (100%).

### HDFC Freedom (2026-10-25)

Rechecked HDFC's current Freedom page, 27-Feb-2026 Freedom reward T&C, and
15-May-2026 issuer-wide reward/fee update. Corrected base earn to 1 CashPoint
per INR 200 from 15-May-2026; the 2026 card-specific terms still state 10
CashPoints per INR 150 on BigBasket, BookMyShow, OYO, Swiggy and Uber, capped
at 2,500/month. The current Ã¢â‚¬Å“10XÃ¢â‚¬Â label is therefore not the same points per
rupee multiple as the post-change base rate; retained the absolute partner
earn and documented the discrepancy. Added the 15,000-point statement-cycle
cap, utility MCC 4900 and telecom/cable MCC 4812/4814/4899 caps of 2,000/month,
and the third-party-app education exclusion while preserving direct school/
college website/POS earn. Updated redemption routes and INR 0.15 point value.

Corrected welcome reward to 500 CashPoints only on joining-fee realization;
removed the unsupported renewal-fee point bonus. Current annual fee remains
INR 500 with INR 50,000 annual renewal waiver, and fuel waiver is 1% on INR
400Ã¢â‚¬â€œ5,000 transactions up to INR 250/statement. Added issuer-published ages
(salaried 21Ã¢â‚¬â€œ60, self-employed 21Ã¢â‚¬â€œ65) and income cutoffs (net monthly income
over INR 12,000; self-employed ITR over INR 6 lakh/year). DCC 1.75% and INR
199 reissue fee are preserved in fee notes because the schema lacks separate
fields. Portfolio numeric source-path coverage after Freedom: 694/2,444 fee
fields (28%), 566/2,928 reward fields (19%), 473/2,967 benefit fields (16%),
and 405/405 eligibility fields (100%).

### HDFC Diners Club Rewardz (2026-10-25)

Updated the reward rate effective 15-May-2026 to 3 points per INR 200 under
HDFC's issuer-wide change notice. Current card page states a 15,000-point
statement-cycle earn cap, 1,000 activation points and 1,000 renewal points;
removed the stale weekend dining accelerator. Set INR 0.30 SmartBuy travel,
up to INR 0.25 catalogue/vouchers and up to INR 0.15 cashback values, and
kept realized value unknown because routes vary. The page states up to 70% of
flight/hotel bookings may be paid with points and lists 0.30 AirMile per point.

The current product page quotes 3% forex while HDFC's card-specific June-2025
tariff lists 3.5%; the modeled fee follows the card-specific tariff and the
conflict is recorded in the card data. The tariff also gives 3.6% monthly
finance, 1% fuel waiver on INR 400-5,000 transactions capped at INR 499 per
billing cycle. The current product page states unlimited India lounge access
for primary and add-on members and 24x7 global concierge. HDFC currently says
it is not accepting new applications; the card remains active for existing
holders, while `apply_url` is cleared. Eligibility thresholds remain
unpublished. DCC 1.75% and INR 199 nonmetal reissue fee are noted because no
dedicated schema fields exist. Validation passes; source references point to
the archived card terms where available.

### HDFC Marriott Bonvoy (2026-10-25)

Rechecked the current product/eligibility pages, April-2026 co-branded MITC,
and the card-specific terms published 19-Oct-2026. Corrected forex from 2%
to 3.5% and finance from 3.75% to 3.6% monthly. Joining/annual fees are
INR 3,000 with no spend waiver; renewal triggers an FNA benefit, not a fee
waiver. The card-specific tariff says fuel surcharge waiver is not applicable,
so the prior INR 250 monthly waiver was removed.

Current terms confirm 2 points/INR 150 base; 8/150 at participating Marriott
properties up to INR 10 lakh spend/month, then base earn; 4/150 for travel,
dining and entertainment up to INR 5 lakh/month, then base; and grocery earn
of 2/150 only up to INR 1.5 lakh/month (2,000 points). Grocery earn stops
after that threshold, a behavior the current calculator cannot represent.
Updated exclusions to current terms, including online gaming and cash
advances; recorded primary-card crediting, integer rounding, and the 12
domestic plus 12 international annual lounge allowances for primary and
supplementary cards, with no guests. Corrected the FNA top-up to 15,000 points
(not 25,000), recorded 6/9/15 lakh anniversary milestones, renewal FNA and
10 Elite Night Credits, Silver status, quarterly golf, and concierge.

Captured HDFC's active anniversary campaign as a time-limited note: enrolled
primary cardmembers may choose 15,000 points at INR 1.5 lakh eligible spend or
30,000 points at INR 2.5 lakh from 1-Oct through 30-Nov-2026; enrollment ends
10-Nov, and later enrollees count spend from their enrollment date. The schema
does not encode campaign enrollment windows, so this offer is not treated as a
permanent reward rule. Marriott hotel-program points are not added in estimates
because spend inputs cannot isolate eligible hotel stays from Marriott-branded
retail purchases.

HDFC's current page lists insurance limits, but the linked policy expired
22-Jul-2026; those limits are retained as issuer-advertised information only,
with active coverage unresolved and no structured policy amounts. Eligibility
now records salaried ages 21-60 and net monthly income over INR 1 lakh, and
self-employed ages 21-65 and ITR over INR 15 lakh; score cutoff is unpublished.
Bonvoy point INR valuations remain sourced from the separate loyalty-program
record. Validation passes. Portfolio numeric source-path coverage is now
711/2,444 fees (29%), 602/2,940 rewards (20%), 498/2,962 benefits (17%) and
421/421 eligibility fields (100%); these are coverage aids, not factuality
scores.

### HDFC Millennia (2026-10-25)

Rechecked the current HDFC product, fees, eligibility, Millennia Cards, and
card-specific terms pages, plus the archived Millennia T&C and lounge voucher
terms. Fees remain INR 1,000 joining/renewal with waiver at INR 1 lakh in the
preceding year, 3.5% forex, and 2.5%/INR 500 cash advance. Finance rate is a
published conflict: the current Millennia Cards page lists 3.6% monthly, while
the card-specific Dec-2025 MITC lists 3.75%; the record follows the current
issuer page and preserves the conflict in its source note.

Current earn is 1% on other spend and 5% on the ten named partner merchants,
with separate INR 1,000 monthly cashback caps for base and partner spend.
Uber's 5% applies only for MCC 4121; its rule shares the partner cap. Removed
unsupported blanket insurance-premium and utility exclusions. Direct
school/college web and POS payments earn, while third-party education apps do
not; therefore education MCCs were removed from blanket exclusions. MCC 6540
remains conservatively excluded because the current product page says wallet
loads do not earn, while the 2025 detailed terms say wallet/prepaid/voucher
loads qualify as other spend at 1%. This wallet conflict remains unresolved.

Added current redemption constraints: statement cashback min 500 and max
3,000 points/month with INR 50 fee; SmartBuy travel at INR 0.30, max 50% of
booking and 50,000 points/month; catalog fee INR 99 plus tax, products/vouchers
up to 70%, and two-year expiry. Corrected milestone description to the
quarterly choice of INR 1,000 brand voucher or one HOI lounge voucher after
INR 1 lakh net spend; claim and validity windows are recorded. Direct lounge
swipes ended in 2023. Welcome 1,000 CashPoints are tied to joining fee paid;
this card-specific term conflicts with the broader product-page line promising
points equivalent to membership fee. Added Dineout coupon offer, kept variable
SmartBuy/PayZapp offers out of permanent card earn.

Whether capped partner spends resume at the base rate is not clear in current
issuer terms. The reward schema/calculator currently assumes base earn after
the accelerator cap; this assumption should be revisited if HDFC clarifies it.

Eligibility product page and FAQ say 21-40, salaried net monthly income over
INR 35,000, and self-employed ITR over INR 6 lakh. The current eligibility
page headline instead says salaried age up to 60 and gross monthly income over
INR 25,000, and self-employed age up to 65; its FAQ repeats the product-page
values. The card-page/FAQ figures are modeled and the discrepancy is explicit.
Minimum bureau score is not published. Validation passes. Numeric evidence
coverage after subsequent MoneyBack+ review is 717/2,444 fees (29%),
612/2,941 rewards (21%), 506/2,962 benefits (17%) and 429/429 eligibility
fields (100%); coverage is not a
factuality score.

### HDFC MoneyBack+ (2026-10-25)

Rechecked the current card and fees pages, the May-2026 MoneyBack+ T&C and FAQ,
the May-2026 issuer-wide rewards/charges notice, and the shared HDFC MITC. Fee
schedule remains INR 500 joining/renewal, INR 50,000 annual renewal waiver,
3.5% forex and 2.5%/INR 500 cash advance. Current shared MITC states 3.75%
monthly finance for all other variants. The MoneyBack+ fees page FAQ says 3.6%
but labels the product as MoneyBack; this page-label conflict is noted and the
shared card tariff is modeled. The May-2026 issuer notice also adds 1.75% DCC
and INR 199 non-metal reissue charges; these have no dedicated schema fields.

Updated current base earn to 2 CashPoints per INR 200. The May-2026 card terms
confirm 20 CashPoints per INR 200 at Amazon, BigBasket, Flipkart, Reliance
Smart SuperStore and Swiggy, limited to non-EMI transactions recognized by
partner merchant IDs and capped at 2,500/month. Terms say spend beyond the
partner cap does not earn CashPoints, so accelerator over-cap base earn is
disabled. Overall points are capped at 15,000 per statement cycle. Removed
unsupported utility/insurance exclusions and blanket education MCC exclusions;
direct school/college web/POS may earn while third-party app payments do not.
MCC 6540 wallet/gift/prepaid loads remain excluded. Grocery earn is capped at
1,000 points/month; how that interacts with partner earn is not clear.

Redemption records now distinguish statement cashback at INR 0.20/point from
catalogue/travel up to INR 0.25, plus the INR 50 cashback fee and INR 99 plus
tax catalogue fee. The product page says cashback redemption is capped at
3,000 points/month; May-2026 T&C says 50,000. The current product-page cap is
modeled conservatively with the contradiction recorded. Statement minimum is
2,000 points (the page also phrases this as INR 500 equivalent, though the
cashback value is INR 0.20/point). Travel redemption is limited to 50% of
booking and 50,000 points/month; selected products/vouchers allow up to 70%;
CashPoints expire after two years. Airmiles, SmartBuy routes and fees are
recorded.

Milestone is INR 50,000 net eligible spend per calendar quarter for one INR
500 Gyftr voucher, with a claim window of 120 days; the voucher validity is
vendor-specific. Welcome and renewal each award 500 CashPoints when the
respective fee is paid. Fuel waiver is 1% on INR 400-5,000 transactions, capped
at INR 250/statement. Added Swiggy Dineout coupon. Eligibility is salaried age
21-60 and net monthly income over INR 20,000; self-employed age 21-65 and ITR
over INR 6 lakh. Minimum credit score is unpublished. Validation passes.
Portfolio numeric source-path coverage is 717/2,444 fees (29%), 612/2,941
rewards (21%), 506/2,962 benefits (17%), and 429/429 eligibility fields
(100%); these are coverage aids, not factuality scores.

### HDFC IndianOil (2026-10-25)

Rechecked the current card and fees pages, current card-specific IndianOil T&C,
and shared HDFC MITC. Fees remain INR 500 joining/renewal, INR 50,000 annual
renewal waiver, 3.5% forex and 2.5%/INR 500 cash advance. Current card fee page
lists overdue interest up to 3.49% monthly, while shared MITC lists 3.75% for
all other variants; modeled the card-page maximum and documented the conflict.
HDFC's May-2026 general notice adds 1.75% DCC and INR 199 non-metal reissue
charges, which have no dedicated schema fields.

Rebuilt reward rules from the card terms: 1 Fuel Point per INR 150 on other
eligible transactions including RuPay UPI; 5 Fuel Points per INR 100 at
authorized IOCL POS, cap 250/month for the first six months then 150/month;
grocery and eligible utility/telecom bill earn 5 per INR 100 with 100/month
caps for each group. Minimum transaction is INR 150 for other and special
categories. After a category cap, further points do not post; IOCL fuel is
restricted to non-UPI card swipes and recognized IOCL TID/MIDs. Fuel at other
stations does not earn. Removed unsupported `closed-loop` classification and
modeled redemption routes: IXRP fuel at INR 0.96/FP (500-point multiples),
statement cashback at INR 0.20 with 12,500-point minimum and INR 50 fee,
catalogue at INR 0.20 with INR 99+tax fee, SmartBuy travel limits, AirMiles,
50,000 monthly redemption cap and two-year expiry.

The same T&C lists grocery MCCs 5411, 5499, 5921 and 5462, but its exclusions
section separately says supermarkets, package stores and bakeries do not earn.
Modeled MCC 5499 only pending clarification. T&C page prose also broadly
associates the 5% feature with IOCL fuel while the earn table separately
includes groceries and utility/telecom bill pay; those table rules are
retained. Added the INR 250 activation voucher for a transaction within 37
days, the complimentary automatic IXRP membership, the fuel surcharge waiver,
and occupation-specific eligibility. Current card page says salaried age
21-60 and net monthly income over INR 12,000; its FAQ says over INR 10,000.
Modeled the higher threshold and recorded the conflict. Self-employed age is
21-65 and ITR over INR 6 lakh; score floor is unpublished. Validation passes.
Portfolio numeric source-path coverage is 723/2,444 fees (30%), 633/2,953
rewards (21%), 512/2,964 benefits (17%), and 437/437 eligibility fields
(100%); coverage is not a factuality score.

### HDFC IRCTC (2026-10-25)

Reviewed the current HDFC IRCTC card page and fees page, the current product-specific terms PDF, and the shared HDFC MITC. Fees remain INR 500 joining/renewal with the INR 150,000 anniversary-year renewal waiver; the card's listed forex markup, shared-MITC finance rate, and cash advance fee/minimum were given explicit paths. Specific IRCTC fee-page interest is not published, so the shared MITC's 3.75% monthly value remains the modeled rate.

Corrected rail earn to 5X total (1X base + 4X additional) on IRCTC/Rail Connect and eligible SmartBuy IRCTC bookings with recognized IRCTC MID/TID, capped at 1,000 points/month and 12,000/year. Added issuer caps for grocery (1,000/month), UPI (500/month), insurance (2,000/month modeled), utilities and telecom (2,000/month each), and other spend (1,000/month); eligible spend ceilings are also captured in conditions. The product terms conflict on insurance points being capped per month or per day; modeled the cap-table monthly figure and left the conflict explicit. Added 5% SmartBuy IRCTC train cashback (INR 1,000/month and INR 12,000/year cap), the 1% railway transaction-charge reversal (INR 1,000/month cap), and its proportional cancellation reversal. Redemption is limited to SmartBuy train tickets, 1 point = INR 1, minimum 100 points, maximum 70% of fare, and INR 99 plus GST per successful redemption. Terms describe points expiring two years after the last eligible earn/use transaction while the live page says two years from earning; this discrepancy is recorded.

Added the INR 500 quarterly voucher at INR 30,000 eligible retail spend, now calendar-quarter based for all cardholders from 1-Jan-2026, and the advertised INR 500 welcome voucher after one transaction within 37 days. The October 2025 terms limit the specific welcome offer to LTF cards issued in Oct-Dec 2025 and exclude some earlier LTF/fee-reversal cohorts, while the live page and FAQ state the activation offer more broadly; applicability remains unresolved. Lounge access is eight select IRCTC Executive Lounge visits/year, max two/quarter; guest access is left unknown because the issuer does not publish a guest allowance. Eligibility now reflects the page's salaried age 21-60 and monthly INR 12,000, and self-employed age 21-65 and ITR above INR 6 lakh. The salaried page gives no comparator for INR 12,000, so its annualized schema value is noted; credit-score minimum is unpublished.

Validation passes for all 369 cards. After the subsequent PIXEL Go refresh, latest explicit numeric source-path coverage is fees 735/2,444 (30%), rewards 664/2,967 (22%), benefits 528/2,969 (18%), and eligibility 451/451 (100%). These coverage counts are traceability measures, not factuality scores. The broader card-by-card review remains incomplete.


### HDFC PIXEL Go (2026-10-25)

Reviewed the live PIXEL Go product page, its current product-specific CashPoints terms, and the PIXEL MITC updated 15-Oct-2026. Fees are INR 250 joining/renewal, with a joining-fee waiver at INR 10,000 eligible spend in 90 days and renewal-fee waiver at INR 50,000 in the preceding 12 months; forex is 3.5%, monthly finance rate 3.75%, and cash advance 2.5%/INR 500 minimum. The October MITC also lists a 1.75% DCC markup effective 20-May-2026, which has no dedicated schema field.

CashPoints earn is 1% on eligible purchases and redeem at INR 1 each into PayZapp CashPoints, minimum 500. Corrected the redemption type from statement credit to PayZapp wallet transfer. Added the current October MITC INR 15,000/month cap on the 1% all-other-spend feature, while recording that the live page and older feature T&C still call the earn unlimited. SmartBuy remains 5% up to 500 points/month on eligible full-payment SmartBuy categories and cannot be combined with 1% merchant cashback; spends beyond its cap do not earn. RuPay UPI earns 1% up to 500 points/month; issuer material does not say whether this stacks with the separate 1% all-spend feature. Current MITC insurance earn is capped at 2,000/month; older card-specific T&C says 2,000/day, so the current MITC value is modeled and the conflict is explicit. Added the INR 100 minimum transaction, round-down, two-year expiry, inactivity/nullification and reversal notes. Removed the incorrect blanket insurance exclusion.

Updated the expired Dineout claim (25%, INR 300/month, ended 31-Dec-2024) to the current page's up-to-10% Swiggy Dineout savings; no current cap/end date is published. Kept the fuel waiver at 1%, INR 400-5,000 transactions, INR 250/statement cap. Eligibility now records salaried age 21-60/monthly income INR 12,000 and self-employed age 21-65/ITR above INR 6 lakh. The salary comparator is unstated; a separate HDFC FAQ gives self-employed maximum age 60, in conflict with the current product page's 65. No credit-score floor is published. The record is scoped to the RuPay variant because UPI cashback is RuPay-only; HDFC's current page also describes combined Visa/RuPay issuance, a network-shape limitation of the current single-network card record.

Validation passes for 369 cards. Current portfolio numeric source-path coverage is fees 735/2,444 (30%), rewards 664/2,967 (22%), benefits 528/2,969 (18%), eligibility 451/451 (100%). These are coverage measures, not factuality scores; dataset-wide review remains open.


### HDFC PIXEL Play (2026-10-25)

Reviewed the live PIXEL Play product and fees pages, its product-specific terms updated 30-Jul-2026, and the shared PIXEL MITC updated 15-Oct-2026. Fees are INR 500 joining/renewal, with joining fee waived on INR 20,000 eligible spend within 90 days and renewal waiver at INR 100,000/year. Forex is 3.5%, monthly finance charge 3.75%, and cash advance 2.5%/INR 500 minimum. The MITC lists 1.75% dynamic currency conversion markup effective 20-May-2026; no schema field exists for this charge.

Corrected the reward packs to the issuer's fixed pairs: BookMyShow/Zomato, MakeMyTrip/Uber, Blinkit/Reliance Smart Bazaar, Croma/Reliance Digital, and Nykaa/Myntra. Cardholders choose two packs and may change them every three months. Each merchant must match issuer-supplied merchant IDs; Reliance Digital and Croma qualify only in physical stores, while Reliance Smart Bazaar and Blinkit have the documented channel constraints. Removed the misleading Amazon/Flipkart pack and the global Uber MCC gate. Each accelerator has a 500-CashPoint calendar-month cap. Selected-pack and chosen e-commerce spend falls back to 1% after their respective caps; SmartBuy and UPI earn nothing beyond their caps. The shared PIXEL MITC's 15,000/month limit on the base 1% feature supersedes the older PIXEL Play terms' "unlimited" label. SmartBuy 5% applies only to the named full-payment booking/voucher categories and cannot combine with merchant cashback. The chosen 3% platform is Amazon, Flipkart or PayZapp; UPI Scan & Pay/e-commerce does not qualify for that feature. Added the INR 100 transaction minimum, round-down, settlement/MID rules, exclusions, reversal/inactivity notes and current caps. Redemption is INR 1 per CashPoint into PayZapp CashPoints with a 1,000-point minimum, correcting statement-credit and the obsolete threshold.

Eligibility now reflects the live page: salaried age 21-60 and INR 25,000 monthly income (annualized to INR 300,000 in the schema; comparator not specified), self-employed age 21-65 and annual ITR above INR 600,000. No score floor is published. The page also advertises an FD-backed application route without income proof, whose qualifying criteria are not represented. Fuel waiver remains 1% on INR 400-5,000 transactions, capped at INR 250/statement. Updated issuance notes to capture Visa/RuPay selection and combined-card behavior; assigned `exclusive_group: hdfc-pixel`, since the MITC allows only one PIXEL variant per customer. Lounge and concierge claims remain unsupported by the reviewed issuer material. Validation passes for all 369 cards. Updated numeric source-path coverage is fees 741/2,444 (30%), rewards 679/2,969 (23%), benefits 532/2,969 (18%), and eligibility 455/455 (100%). These are traceability measures, not factuality scores; dataset-wide review remains open.


### HDFC Regalia (2026-10-25)

Checked the current HDFC Regalia page and eligibility/fee pages, Regalia reward terms, HDFC Personal MITC v4.15 (updated 17-Oct-2026), the May-2026 issuer change notice, and HDFC ERGO's active policy (23-Jul-2026 through 22-Jul-2027). Corrected foreign-currency markup from 2% to 3.5%; current MITC confirms INR 2,500 joining/renewal, INR 3 lakh annual renewal waiver, 3.75% monthly finance rate, and 2.5%/INR 500 cash-advance fee. Recorded the separate 1.75% DCC in notes because the schema has no DCC field. The Regalia-specific notice says effective 15-May-2026 while the latest shared MITC says 20-May-2026; the later shared MITC date is modeled and the discrepancy retained. Updated fuel waiver cap to INR 500/statement.

The base remains 4 RP/INR 200, confirmed effective 15-May-2026 (the previous threshold was INR 150); residual amounts below INR 200 do not earn. Corrected modeled point value to the issuer's guaranteed INR 0.50 SmartBuy travel value; airmile value is variable, not INR 0.55. Added grocery 2,000-point/month, utility and telecom 2,000-point/month each, and 50,000-point/statement-cycle caps, 2-year expiry, 365-day inactivity nullification, 2,000/month insurance cap, and reward exclusions including skill-based gaming. Redemption now distinguishes SmartBuy travel at INR 0.50 with 70% booking limit and 50,000/month cap, products/vouchers up to INR 0.35, and cashback at INR 0.15 with a 50,000/month cap. Airmiles are recorded without a fabricated rupee value.

Kept the existing SmartBuy 4,000/month aggregate and 3,000/month brand-voucher caps explicitly provisional: the current issuer-linked Regalia terms reviewed here do not confirm those cap figures or their interaction with the base 50,000 statement cap. Lounge access, concierge, 5L/8L annual-spend milestones, 2,500-point welcome and renewal rewards are documented from issuer material. Refreshed insurance against the active policy; USD-denominated limits and delay benefits are described in notes because the schema cannot represent them accurately as fixed INR amounts. Eligibility now reflects salaried age 21-60/net monthly income above INR 1 lakh and self-employed age 21-65/ITR above INR 12 lakh; score floor is unpublished. HDFC states new sourcing is discontinued; no cessation date is published, so the card remains active for existing holders and application link is nulled. Validation passes for all 369 cards.


After the Regalia review and follow-up source cross-checks, dataset numeric source-path coverage is fees 747/2,444 (31%), rewards 691/2,974 (23%), benefits 545/2,969 (18%), and eligibility 459/459 (100%). Validation passes for all 369 records. These remain coverage measures, not a factuality score; dataset-wide review continues.


### HDFC Regalia Gold (2026-10-25)

Rechecked the current HDFC Regalia Gold product, fees and eligibility pages; the current card-specific reward-points and milestone terms; the shared Personal MITC v4.15 updated 17-Oct-2026; the May-2026 product-change notice; and HDFC ERGO's active policy through 22-Jul-2027. Corrected the launch date to 23-Mar-2023 (the record's 2022 date was wrong) and set the marketed tier to super-premium. Current fees are INR 2,500 joining/renewal with a INR 400,000 retail spend waiver within 12 billing cycles; forex markup is 2%, monthly finance charge 3.75%, and cash advance fee 2.5%/INR 500. The May notice says card reissue is INR 199 while the live FAQ says INR 100; neither fee nor the INR 99 redemption fee has a dedicated schema field. DCC is 1.75% from 15-May-2026.

Updated base earn to 5 Reward Points/INR 200 from 15-May-2026. The four named 5X merchants are Myntra, Nykaa, Reliance Digital, and Marks & Spencer; current reward T&Cs set a 5,000-point calendar-month accelerator cap, base points continue beyond that cap, merchant TID/MID eligibility applies, and the transaction minimum is INR 200. An older linked milestone PDF still says INR 150, so that conflict is documented. Removed the false blanket insurance-earn exclusion and added the shared MITC caps: grocery 2,000/month, insurance 2,000/month, utilities 2,000/month, telecom 2,000/month, and 50,000 total points per statement cycle. Recorded two-year expiry, 365-day inactivity nullification, SmartEMI reversals, and reward exclusions.

Corrected redemption values to Gold catalogue INR 0.65, travel INR 0.50, products/vouchers up to INR 0.35, and statement credit INR 0.15. The product page's prominent summary says INR 0.20 for statement credit, but its detailed table and current MITC specify INR 0.15; the specific table/MITC rate is modeled. Travel redemptions are limited to 70% of booking value and 50,000 points/month. Removed 22 stale or unverified transfer-partner ratios and fabricated rupee valuations; current issuer pages give only up to 0.5 miles per point, while the transfer portal's current partner roster and individual ratios could not be verified. SmartBuy advertises 10X travel/brand promos, but current caps and interaction with base points could not be substantiated, so these are called out as unmodeled.

Updated domestic lounge access to three quarterly visits after INR 60,000 eligible spend in the preceding quarter, and international access to six Priority Pass visits/year. Corrected quarterly voucher choices to the current specific terms; the annual voucher remains modeled at INR 750,000 anniversary-year spend because the detailed milestone T&Cs specify one INR 5,000 flight ticket at that threshold, while the live product page advertises awards at both INR 500,000 and INR 750,000. Welcome benefits now reflect the paid-fee voucher and the INR 100,000 net retail spend/90-day membership trigger without an unsupported rupee valuation. Refreshed insurance from the active policy; removed the unsupported INR 250 fuel waiver claim. Guest counts remain unknown, and the exact network selected at application is not modeled (the issuer terms discuss Visa/Mastercard conversion). Eligibility now records the 21-year minimum, salaried maximum 60, self-employed maximum 65, lower government salaried threshold annualized to INR 1.2 million, and self-employed ITR threshold INR 1.8 million; the issuer page conflicts on gross versus net salary wording. No numerical score floor is published.

Primary sources: [Regalia Gold product page](https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card), [fees page](https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card/fees-and-charges), [eligibility page](https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card/eligibility), [card-specific reward terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/pdfs/regalia-gold-credit-card-reward-points-t-and-cs.pdf), [milestone terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/terms-and-conditions.pdf), [shared Personal MITC](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/personal-mitc/mitc-in-english.pdf), [May feature-change notice](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/pdf/common/Credit-Cards/Regalia-Gold-Product-feature-change.pdf), [active insurance policy](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-credit-card/pdfs/hdfc-ergo-general-insurance-company-limited.pdf), and [launch notice](https://www.hdfc.bank.in/press-release/2023/q1/hdfc-bank-launches-regalia-gold-credit-card-draft-v3-final).

After this pass, validation reports 369 cards with 0 errors and strict-ready provenance for 634/754 in-scope rewards (84%). Numeric source-path coverage is fees 753/2,444 (31%), rewards 706/2,976 (24%), benefits 557/2,965 (19%), and eligibility 463/463 (100%). Coverage is traceability, not factual accuracy; the library-wide review remains incomplete.


### HDFC Swiggy BLCK (2026-10-25)

Reviewed the live HDFC Swiggy BLCK product/eligibility page, the product-specific terms published 15-Oct-2026, the linked current 5%/1% cashback detail PDFs, the current shared Personal MITC v4.15, and the Mastercard World golf benefit listing. Corrected the Mastercard World network tier and removed the unverified 2024-01-01 launch date. Current status and application link remain active. Current fees are INR 1,000 joining/renewal; the joining fee is waived at INR 75,000 spend in the first 90 days (first year only), and renewal is waived at INR 200,000 annual spend before renewal, excluding Cash on Call, balance transfers and cash withdrawals. Shared MITC gives 3.75% monthly finance charge, 2.5%/INR 500 cash advance and 1.75% DCC effective 20-May-2026. The 3.5% foreign currency markup is retained at medium confidence from the shared schedule's standard FCC rate because it is not repeated on the BLCK row in the current card page.

Rebuilt cashback rules from the October specific terms: 10% Swiggy Food/Instamart/Dineout with INR 1,500 cycle cap and INR 249 minimum; 5% on eligible online merchant/MCC spends with INR 1,500 cap and INR 100 minimum; 1% other eligible spend with INR 1,000 cap and INR 100 minimum. The current shared MITC also caps total BLCK cashback at INR 4,000 per statement cycle. Cashback auto-credits against outstanding balance, excluding finance charges; merchant posting date, refunds and reversals affect the cycle calculation. Removed the inaccurate utility and insurance exclusions; added supported exclusions for gaming, education, gift cards, jewelry and cash advances, in addition to fuel, wallet, rent, government and EMI. Kept the published MCC exclusion set and noted that the T&C's 5% row includes an all-online-MCC catch-all while only selected merchant IDs qualify, so the static MCC list is not exhaustive. The October T&C says gaming MCC 5816; the issuer's separately linked 1% details PDF says 7995; both are excluded pending clarification. Automatic cashback fee treatment versus the shared MITC's generic INR 50 cashback redemption charge is not explicit, so no fee was encoded.

Corrected the three-month Swiggy BLCK welcome membership to require activation within 37 days and an in-app claim; no rupee value is published. Added Mastercard World benefits of four green-fee rounds and 12 lessons per year, plus the birthday-week Dineout offer (10% up to INR 500, INR 3,000 minimum, seven-day window, once per cardholder and after 30 days from activation). Current terms also show limited-time Cleartrip and Nykaa instant discounts without end dates; the transient offers are documented, not treated as evergreen cash value. Eligibility now records salaried age 21-60/net monthly income above INR 100,000 and self-employed age 21-65/ITR above INR 1,200,000; no numerical bureau-score floor is published.

Primary sources: [Swiggy BLCK product and eligibility page](https://www.hdfc.bank.in/credit-cards/swiggy-blck-hdfc-bank-credit-card), [current 15-Oct-2026 product T&Cs](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-blck-hdfc-bank-credit-card/pdf/tncs-swiggy-blck-hdfc-bank-credit-card-15102026.pdf), [5% eligible MCC list](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-blck-hdfc-bank-credit-card/pdf/5-percent-cashback-details-swiggy-black-credit-card.pdf), [1% cashback exclusions](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-blck-hdfc-bank-credit-card/pdf/1-percent-cashback-details-swiggy-blck-hdfc-credit-card.pdf), [shared Personal MITC](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/personal-mitc/mitc-in-english.pdf), and [Mastercard World golf listing](https://specials.priceless.com/en-in/offers/Mastercard_World_Card_India_Golf_Program?Oid=201902180041).

After this pass, validation reports 369 cards with 0 errors and strict-ready provenance for 634/754 in-scope rewards (84%). Numeric source-path coverage is fees 758/2,444 (31%), rewards 718/2,977 (24%), benefits 558/2,964 (19%), and eligibility 467/467 (100%). Coverage is traceability, not factual accuracy; dataset-wide review continues.


### HDFC Swiggy HDFC Bank Credit Card (2026-10-25)

Rechecked the live HDFC product, eligibility and fee pages and the card-specific cashback terms published 22-May-2026. Removed the unsupported 2023-09-01 launch date; current launch date remains unknown. Kept the Mastercard World network and current INR 500 joining/renewal fees. Renewal fee is waived at INR 200,000 annual spend before renewal, excluding Cash on Call, balance transfer and cash withdrawal. Current shared MITC supports 3.75% monthly finance charge, 2.5%/INR 500 cash advance, and 3.5% foreign currency markup; HDFC's fee FAQ also lists 3.5% dynamic currency conversion markup.

Confirmed cashback as 10% on Swiggy Food, Instamart, Genie and Dineout (INR 1,500/billing cycle; minimum INR 249), 5% on selected online merchants/MCCs (INR 1,500/cycle; minimum INR 100), and 1% on other eligible spends (INR 500/cycle; minimum INR 100). Cashback is statement credit, subject to merchant posting date and adjustments for refunds/reversals. Removed the unsupported utility and insurance exclusions; the current terms exclude fuel, rent, government, jewellery, gift cards, EMI, wallet/prepaid cards, cash advances, SmartPay/SmartBuy, foreign currency/fees, travellers' cheques, interest and penalties. Kept the exact current MCC list. Removed the erroneous 3% applicability value.

Updated the welcome benefit to three months of Swiggy One with activation within 37 days and an in-app claim; the existing Swiggy One membership extends by three months. The product-page summary states a 30-day activation window, while the detailed May terms specify 37 days; modeled the detailed card terms and retained the conflict in source notes. Added the four annual golf rounds and 12 annual lessons shown on HDFC's product page; Mastercard World lists a 50% green-fee rate for additional rounds. Eligibility now reflects salaried Indian applicants aged 21Ã¢â‚¬â€œ60 with monthly income of at least INR 15,000 and self-employed applicants aged 21Ã¢â‚¬â€œ65 with annual ITR above INR 600,000. No numeric bureau-score floor is published.

Primary sources: [HDFC product and eligibility page](https://www.hdfc.bank.in/credit-cards/swiggy-hdfc-bank-credit-card), [HDFC fees and charges](https://www.hdfc.bank.in/credit-cards/swiggy-hdfc-bank-credit-card/fees-and-charges), [card-specific cashback terms published 22-May-2026](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-hdfc-bank-credit-card/pdf/terms-and-conditions-swiggy-hdfc-bank-credit-card-26052026.pdf), [shared Personal MITC](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/personal-mitc/mitc-in-english.pdf), and [Mastercard World golf listing](https://specials.priceless.com/en-in/offers/Mastercard_World_Card_India_Golf_Program?Oid=201902180041).

After this pass, validation reports 369 cards with 0 errors and strict-ready provenance for 634/754 in-scope rewards (84%). Numeric source-path coverage is fees 758/2,444 (31%), rewards 720/2,976 (24%), benefits 561/2,965 (19%), and eligibility 475/475 (100%). Coverage is traceability, not factual accuracy; the library-wide review remains incomplete.


### Axis Bank Aura Credit Card (2026-10-25)

Rechecked Axis Bank's live Aura page, current shared MITC, card-specific EDGE exclusions, and linked welcome/Practo/Fitternity terms. Corrected launch date to 19-Jan-2021 from the issuer's launch press release. The current Aura page says the card is no longer available for new applicants but gives no withdrawal date; retained `on-hold` and a null discontinuation date rather than inventing one. It also does not identify the card network or tier. The legacy `visa` value remains unresolved because the schema requires a network; `network_tier` is now null.

Corrected fees to INR 749 joining and annual with no published annual fee waiver; confirmed 3.5% foreign-currency and DCC markups, 3.75% monthly finance rate, and cash withdrawal charge of 2.5%/INR 500. Added current late-payment bands (Nil below INR 500, INR 500 for INR 501Ã¢â‚¬â€œ5,000, INR 750 for INR 5,001Ã¢â‚¬â€œ10,000, INR 1,200 for INR 10,001Ã¢â‚¬â€œ50,000, and INR 1,300 above INR 50,000), plus 2.5%/INR 500 over-limit fee. The exact INR 500 late-payment boundary is not stated, so the structured slab records zero through INR 500 with that edge called out in source notes. The page also lists INR 175 cash-payment fee, nil replacement/add-on charges, a second-consecutive-cycle MAD fee of INR 100 per cycle until cured, and 1% transaction fees for rent, third-party education, wallet loads at INR 10,000/cycle, fuel at INR 50,000/cycle, utilities at INR 25,000/cycle, and online skill gaming at INR 10,000/cycle. These less central charges are documented in source notes because the fee schema cannot encode all of them.

Rebuilt rewards as 2 EDGE Reward Points per INR 200 and 5X points on eligible insurance spend (MCCs 6051, 6300, 6381, 5960 and 6012). Removed the false global insurance exclusion. Added explicit exclusions for fuel, wallet, rent, utilities, education, government, gift cards, bridge/road fees and tolls, cash advances, and the issuer-specified MCC exclusions. The issuer caps the insurance offer at a maximum transaction amount of INR 10,000 but does not say how amounts above that limit earn; this remains unresolved. Removed unsupported INR 0.20 and INR 0.18 point valuations because Axis publishes no single value across redemption options. The current EDGE fee schedule charges INR 99 plus GST per eligible redemption; partner transfers have a separate INR 199 plus GST fee where supported.

Corrected the welcome offer to a Decathlon OMNI gift card worth INR 750, valid 60 days from issuance. The current product page says Ã¢â‚¬Å“Decathlon & AmazonÃ¢â‚¬Â but the detailed welcome terms name Decathlon only, so Amazon eligibility remains unresolved. Confirmed four Practo video consultations/month shared across the cardholder and up to three family members (unused visits do not carry over), four Fitternity interactive sessions and 16 prerecorded sessions/month, health-checkup discount up to INR 500/year, and at least 30% off nutrition consultations and nutritional foods. Added the current Dining Delights terms: 15% off up to INR 500, INR 2,500 minimum order, once per card per month. Fuel waiver remains 1% on INR 400Ã¢â‚¬â€œ4,000 transactions at Indian fuel outlets, capped at INR 250 per statement cycle; surcharge GST is not refunded. Wednesday Delight offers are time-sensitive and were not modeled as evergreen.

Eligibility now reflects age 18Ã¢â‚¬â€œ70 and Resident Indian or NRI applicants; Axis publishes no numeric income or credit-score threshold. Lounge access remains null. The current card page documents the card is unavailable for new applications; legacy network `visa` is the only unresolved required core field.

Primary sources: [Axis Aura product, fees and eligibility page](https://www.axis.bank.in/cards/credit-card/axis-bank-aura-credit-card), [Aura EDGE exclusions PDF](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/aura-edge-rewards-mcc-exclusions.pdf), [current Axis MITC](https://www.axisbank.com/docs/default-source/default-document-library/mitc-credit-cards.pdf), [Axis Schedule of Charges](https://www.axis.bank.in/docs/default-source/default-document-library/sosc-credit-cards.pdf), [EDGE Rewards FAQ](https://edgerewards.axis.bank.in/lms/faqs), [Aura launch press release](https://www.axisbank.com/docs/default-source/press-releases/axis-bank-launches-aura-a-credit-card-exclusively-loaded-with-affordable-health-and-wellness-solutions.pdf), [Decathlon welcome terms](https://www.axisbank.com/docs/default-source/default-document-library/decathlon-tnc.pdf), [Practo terms](https://www.axis.bank.in/docs/default-source/default-document-library/video-consultation-practo-tnc.pdf), and [Fitternity terms](https://www.axisbank.com/docs/default-source/default-document-library/fitternity-tnc.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage remains fees 758/2,444 (31%), rewards 720/2,976 (24%), benefits 561/2,965 (19%), and eligibility 475/475 (100%); the scanner excludes on-hold cards such as Aura. These figures measure source-path traceability, not factual accuracy. Dataset-wide review remains incomplete.


### Axis Bank FreeCharge Credit Card (2026-10-25)

Reviewed the current issuer product page, fees, eligibility, rewards and milestone sections, plus the archived card-specific terms PDF. Corrected the network from RuPay to Visa Platinum. Removed the unsupported 2019-08-01 launch date. The issuer says applications are invite-only through eligible banners in the Freecharge app; no age, income or bureau score threshold is published.

Corrected monthly finance charge to 3.75%; confirmed joining fee INR 250, first-year annual fee nil and second-year INR 250. A spend-based annual-fee waiver is mentioned, but its threshold is not published; rent and wallet spends are excluded from qualifying spend. Kept the structured annual fee at INR 250 and documented the first-year waiver in notes. The product page also lists additional charges, all retained in notes because the fee schema cannot represent them (cash payment, rent, wallet, fuel, education, utility, skill gaming, redemption/transfer, DCC, late payment and other service charges). The page does not specify the late-fee amount at exactly INR 500 due.

Confirmed 1 EDGE REWARD Point per INR 200 and monthly milestones: 100 points at INR 2,000Ã¢â‚¬â€œ4,999, 350 total points at INR 5,000+. Card-specific terms exclude rent, wallet loads, gold/jewellery, fuel, financial institutions, cash advances and repayments. The schema has no repayment exclusion enum, so that exclusion remains documented here only. Removed the unsupported fixed INR 0.20 catalog value; the issuer offers 500+ changing redemption options and publishes no universal cash conversion. Wednesday Delight and other merchant promotions can change and are recorded as variable offers, not guaranteed fixed-value benefits.

Primary sources: [Axis FreeCharge product, rewards, fees and eligibility page](https://www.axis.bank.in/cards/credit-card/axis-bank-freecharge-credit-card) and archived [card-specific terms PDF](../sources/axis/freecharge/terms-and-conditions-freecharge-final.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 760/2,444 (31%), rewards 720/2,973 (24%), benefits 561/2,969 (19%), and eligibility 475/475 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Kwik Credit Card (2026-10-25)

Reviewed the current product page, linked Axis terms revision effective 28-Aug-2026, Axis credit card key fact sheet, network listing, general eligibility page and the bank's 2023 launch release. Corrected the launch date to 02-Aug-2023, finance charge to the issuer page's 3.7% per month (55.55% p.a.), and the current fees/effective date. Confirmed RuPay Platinum from Axis's own card protection listing. The card is lifetime-free. The bank publishes no card-specific minimum age, income or bureau score; resident Indians and NRIs are supported by the general Axis eligibility page.

Confirmed 2 EDGE Reward Points per INR 200, subject to exclusions for wallet loads, fuel, rent, cash withdrawals, insurance, repayments, jewellery, education, government services, EMI, and RuPay credit-card UPI transactions below INR 2,000. Axis's 28-Aug-2026 terms also exclude gift-card purchases and bridge/road fees/tolls. No card-specific MCC exclusion list or universal point value is published; removed the old MCC 6513 and fixed INR 0.20/0.18 values. UPI transactions can be made with the virtual card; the card page lists a 1% fuel surcharge waiver for INR 400Ã¢â‚¬â€œ4,000 transactions, capped at INR 150 per month (some transactions may instead incur INR 10 plus GST).

Documented the full current fee schedule in the fee notes where the schema cannot encode it, including INR 175 cash-payment charge, INR 99 EDGE redemption/INR 199 partner transfer fees, category fees and thresholds, 3.5% DCC, the late-payment bands, and additional INR 100 after two consecutive unpaid MAD cycles. The exact INR 500 late-payment boundary is unstated. The issuer page itself reports 3.7% monthly and 55.55% annual interest; the monthly field follows the stated monthly figure.

Primary sources: [Axis Kwik product, rewards and fee page](https://www.axis.bank.in/cards/credit-card/axis-bank-kwik-credit-card), [Axis terms revision effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), [Axis key fact sheet](https://www.axis.bank.in/docs/default-source/default-document-library/sosc-credit-cards.pdf), [Axis card protection network listing](https://www.axis.bank.in/important-links/credit-card/card-protection), [Axis general eligibility](https://www.axis.bank.in/cards/credit-card), and [Axis launch release, 02-Aug-2023](https://www.axis.bank.in/about-us/press-releases/axis-bank-partners-with-kiwi-to-bolster-credit-on-upi-accessibility-on-rupay-credit-cards).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 764/2,444 (31%), rewards 722/2,970 (24%), benefits 565/2,969 (19%), and eligibility 475/475 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Pride Signature Credit Card (2026-10-25)

Reviewed the current Axis product, fee and eligibility page; the August 2026 terms revision; the current domestic lounge access program PDF; the product-linked EDGE exclusions PDF archived locally; and the Axis key fact sheet. Corrected the base earn from 4 to 8 EDGE Reward Points per INR 200. Removed the unsupported point valuation and the unsupported MCC 6513 reward exclusion; the card-specific rewards PDF excludes utilities, education, insurance, government institutions, wallet loads, rent and fuel as categories, while MCC 6513 is specifically listed in annual fee waiver exclusions. Axis's current general terms also exclude gift cards and bridge/road fees/tolls from rewards. A universal redemption value and card-specific reward MCC list are not published.

Corrected fees: joining nil; first-year annual fee nil; then INR 500, waived at INR 40,000 eligible preceding-year spend. Current fee notes capture other issuer-listed charges, including 3.75% monthly finance charge, 3.5% foreign currency/DCC, cash advance 2.5%/INR 500, 1% category transaction charges, service fees and late-payment bands. Exact INR 500 late-fee boundary is unspecified, and the issuer gives no amount for the EDGE redemption fee on this page. Corrected lounge benefit to two domestic visits per calendar quarter subject to INR 50,000 eligible settled spend in the prior three calendar months; new-card issuance waives this threshold for the issuance month and following three months. Corrected dining to 15% off up to INR 500, minimum order INR 2,500, once per card per month. Fuel surcharge waiver is 1% on INR 400Ã¢â‚¬â€œ4,000 fuel transactions, capped at INR 400 per statement cycle; fuel earns no points and surcharge GST is not refunded. Added current Indian Defence eligibility and age 18Ã¢â‚¬â€œ70, Resident Indian or NRI; no numeric income or bureau-score minimum is published.

Removed the unsupported 01-Jan-2016 launch date. Axis's general network announcement says network choices can be selected on new applications or renewals, but the Pride Signature page does not identify a specific network or network tier. The existing isa network value remains flagged as unresolved because the schema requires a network; 
etwork_tier is null.

Primary sources: [Axis Pride Signature product, fees, rewards and eligibility page](https://www.axis.bank.in/cards/credit-card/pride-signature-credit-card), [Axis domestic lounge program](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf), archived [Pride Signature EDGE exclusions PDF](../sources/axis/pride-signature/pride-signature-edge-rewards-mcc-exclusions.pdf), [Axis terms revision effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), and [Axis credit-card network announcement](https://www.axis.bank.in/important-links/credit-card/important-announcement-on-credit-card).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 769/2,444 (31%), rewards 724/2,967 (24%), benefits 572/2,969 (19%), and eligibility 477/477 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Pride Platinum Credit Card (2026-10-25)

Reviewed the current Axis product, fees and eligibility page, the linked terms revision effective 28-Aug-2026, and the card-specific EDGE exclusions PDF archived locally and linked by the issuer page. Corrected the annual fee waiver threshold from INR 20,000 to INR 40,000. The card has no joining fee, the first-year annual fee is nil, and the annual fee is INR 250 from year two with the INR 40,000 waiver. MCC 6513 rent, MCC 6540 wallet, MCC 5947 gift cards and MCC 4784 toll/bridge transactions do not count toward the fee waiver. Corrected eligibility to Indian Defence Forces/Government of India employees, age 18Ã¢â‚¬â€œ70, resident Indian or NRI; no numerical income or bureau-score minimum is published. Removed the unsupported 01-Jan-2016 launch date.

Confirmed 4 EDGE Reward Points per INR 200. The card-specific exclusions PDF identifies utilities, educational services, insurance, government institutions, wallet loads, rent and fuel by category. Current Axis general terms also exclude gift cards and bridge/road fees/tolls. Removed the unsupported MCC 6513 reward exclusion because it is listed for fee-waiver spend only. No universal point value is published, so fixed INR 0.20/0.18 values were removed. The product fee table conflicts on redemption charges: it says EDGE redemption is free and also says a reward redemption fee applies without an amount; documented as unresolved.

Updated the current fee notes with the full published service and transaction fees, 3.75% monthly finance charge, 3.5% foreign currency/DCC, 2.5%/INR 500 cash withdrawal, late-payment bands and category transaction fees. Exact INR 500 overdue boundary is not specified. Fuel waiver is 1% for INR 400Ã¢â‚¬â€œ4,000 fuel transactions, capped at INR 250 per statement cycle; fuel earns no points and GST on the surcharge is non-refundable. Kept Dining Delights at 15% but noted that the issuer page does not specify current cap, minimum order or frequency for this card. Added time-sensitive Wednesday offers, tricolour card design, EMI conversion above INR 2,500, zero lost-card liability and free add-on cards.

The issuer product page does not identify a single network or network tier, and its general announcement says network choices can be selected. The legacy isa network is flagged unresolved because the schema requires a network; 
etwork_tier is null.

Primary sources: [Axis Pride Platinum product, rewards, fees and eligibility page](https://www.axis.bank.in/cards/credit-card/pride-platinum-credit-card), issuer-linked [Pride Platinum EDGE exclusions PDF](../sources/axis/pride-platinum/pride-platinum-edge-rewards-mcc-exclusions.pdf), [Axis terms revision effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), and [Axis credit-card network announcement](https://www.axis.bank.in/important-links/credit-card/important-announcement-on-credit-card).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 774/2,444 (32%), rewards 726/2,964 (24%), benefits 577/2,968 (19%), and eligibility 479/479 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Privilege Credit Card (2026-10-25)

Rechecked the current Axis Privilege page, its product-specific terms revisions effective 20-Jun-2025 and 28-Aug-2026, the linked Amex-network offer sheet, and the current issuer eligibility and fee disclosures. Removed the unsupported 01-Jan-2010 launch date. The page supports 10 EDGE Reward Points per INR 200 and current exclusions for utility/telecom, rent, wallet, government services, insurance, gold/jewellery, fuel and education; the Aug-2026 revision adds gift cards and bridge/road fees/tolls. Removed fixed INR 0.20/0.18 point valuations because the issuer publishes no universal conversion. EMI-converted purchases have points debited, and cancellation does not restore them.

Confirmed standard INR 1,500 joining and annual fees with annual reversal at INR 500,000 eligible anniversary-year spend. The live fee table separately lists limited-period nil joining and renewal fees for the American Express network; this is not applied to all network variants. Updated DCC to 3.5% plus taxes from 28-Aug-2026, retained 3.5% foreign-currency markup, 3.75% monthly finance charge and 2.5%/INR 500 cash withdrawal fee, and documented current late-fee slabs and the additional INR 100 MAD charge. The product page marks reward redemption fee as applicable without an amount. Annual fee waiver excludes utility/telecom, rent, wallet, government, insurance, gold/jewellery, fuel, education, gift cards and bridge/road fees/tolls.

Updated welcome benefit to 12,500 EDGE points stated as worth INR 2,500, requiring joining-fee levy and first transaction within 30 days; free, first-year-free and priority-segment cards are excluded. Confirmed the 10,000-point/INR 2,000 anniversary milestone at INR 250,000 spend; two domestic lounge visits per calendar quarter subject to INR 50,000 spend in the previous three months; fuel surcharge waiver of 1% on INR 400-4,000 fuel MCC transactions, capped at INR 400 per statement cycle; and the District movie discount up to INR 250 monthly. The 28-Aug-2026 revision adds a INR 25,000 preceding-three-month spend requirement for the District offer effective 01-Nov-2026, with an initial issuance-period waiver. The current issuer-linked lounge PDF says its program validity ended 31-Aug-2025, so lounge-provider details and the current lounge list remain unresolved despite the live product page continuing to advertise the benefit. Removed the unsupported four-per-year international lounge benefit. Eligibility is age 18-70 and Indian resident; no numerical income or bureau-score threshold is published.

Axis launched a separate Privilege card on the American Express network in Dec-2023, while Axis also permits card-network choices. The schema records a single network and does not model variants; the legacy Visa/Signature values are retained with `network-unverified`, and network-specific fee terms are called out. The activation voucher's exact voucher validity/redemption window was not recoverable from the linked detailed terms; no unsupported 90-day window is retained.

Primary sources: [Axis Privilege product, fee and eligibility page](https://www.axis.bank.in/cards/credit-card/privilege-credit-card-with-unlimited-benefits), [Privilege terms effective 20-Jun-2025](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-privilege-credit-card.pdf?sfvrsn=9606817f_5), [Privilege terms effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-privilege.pdf), [Axis Privilege on Amex launch announcement](https://www.axis.bank.in/about-us/press-releases/axis-bank-strengthens-partnership-with-american-express-with-the-launch-of-the-axis-bank-privilege-credit-card-on-american-express-network), [Amex network offers](https://www.axis.bank.in/docs/default-source/default-document-library/axis-privilege-amex-offers-and-tnc.pdf?sfvrsn=86e2f5f0_6), and [issuer-linked lounge program](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-mastercard-airport-lounge-access_program.pdf?sfvrsn=349636cd_1).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 779/2,444 (32%), rewards 728/2,961 (25%), benefits 582/2,966 (20%), and eligibility 481/481 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Privilege Easy Credit Card (2026-10-25)

Reviewed the live Privilege Easy product, fee, FD-eligibility and benefit disclosures; the linked card terms effective 28-Aug-2026; the card-specific milestone terms; and the current Axis key fact sheet. Removed the unsupported 01-Jan-2018 launch date and the unsupported Mastercard World tier. Mastercard remains the legacy network field but is marked unresolved because the current page does not identify the issued network unambiguously. The product is explicitly FD-backed and secured. Axis states an FD range of INR 65,000-INR 25,00,000; Tax Saver, Flexi/auto-sweep and entity-owned FDs are ineligible; minors cannot hold the card. No adult age band, numeric income or bureau-score minimum, or card-specific residency rule is published.

Confirmed INR 1,500 joining and annual fees, with the joining fee nil for Priority customers; the INR 5 lakh annual fee reversal; 3.4% monthly finance rate (49.36% p.a.); 3.5% foreign-currency markup; 3.5% DCC plus tax from 28-Aug-2026; and 2.5%/INR 500 cash withdrawal fee. Documented additional published charges and exclusions. The live fee page says EDGE redemption fee is waived. The exact INR 500 overdue-fee boundary is unstated. The pageÃ¢â‚¬â„¢s fee-waiver exclusions include utility/telecom, rent, wallet, government services, insurance, gold/jewellery, fuel, education, bridge/road fees and tolls; the Aug-2026 terms also exclude gift-card spend from fee-waiver calculations.

Confirmed 10 EDGE Reward Points per INR 200, 12,500 points stated as worth INR 2,500 on joining-fee levy and first transaction within 30 days (excluded for free, first-year-free and Priority customer cards), and the INR 250,000 anniversary milestone awarding 10,000 points stated as worth INR 2,000. Removed unsupported universal point redemption values, the unsupported MCC 6513 rewards exclusion, and category reward exclusions not corroborated in the current card-specific primary material. Retained only verified exclusions: fuel; gift cards; bridge fees; road fees and tolls. The milestone terms specify spend exclusions separately. Current page advertises two domestic lounge visits per calendar quarter, but its lounge-details link fails to resolve; current spend qualification and lounge list remain unresolved. No international lounge benefit was found for this secured card.

The fuel benefit is 1% for eligible fuel transactions, with a INR 400 monthly cap and surcharge tax non-refundable. The product benefit text says the transaction ceiling is INR 4,001, while its fee table says surcharge refund applies through INR 4,000; the structured maximum remains INR 4,000 and the discrepancy is recorded. Updated the movie benefit to up to INR 250 once monthly based on AxisÃ¢â‚¬â„¢s comparison page; from 01-Nov-2026 the issuer terms require INR 25,000 eligible settled spend in the previous three months, waived for the issuance month and following three calendar months for a newly issued card. Documented purchase/travel protections, EMI conversion, Dining Delights, Wednesday offers and Extraordinary Weekends without inventing monetary valuations.

Primary sources: [Axis Privilege Easy product, fees and eligibility page](https://www.axis.bank.in/cards/credit-card/privilege-easy-credit-card), [Privilege Easy terms effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-privilegeeasy.pdf), [Privilege Easy milestone terms](https://www.axis.bank.in/docs/default-source/default-document-library/privilege-easy-credit-card-milestone-benefit-tncs.pdf?sfvrsn=7be9c9c1_3), [Axis credit-card comparison page](https://www.axis.bank.in/cards/credit-card), and [Axis key fact sheet](https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/sosc-credit-cards.pdf?sfvrsn=e31b3c52_9).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 784/2,444 (32%), rewards 730/2,958 (25%), benefits 587/2,968 (20%), and eligibility 481/481 (100%). These figures measure traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Reserve Credit Card (2026-10-25)

Rechecked the current Reserve benefits page and linked insurance summary. Corrected the annual fee waiver from INR 25 lakh to INR 35 lakh; confirmed INR 50,000 joining/annual fees, 1.5% forex markup, 3% monthly APR and no cash withdrawal fee. Updated the reward exclusions: rent earns EDGE points up to INR 1 lakh per month, so the former blanket rent exclusion was removed. Confirmed the 15 points/INR 200 base rate and 2x international earn; removed stale point valuations and fixed transfer ratios because the current issuer now describes partner conversions as dynamic. The 15,000-point first-year activation benefit requires the first transaction within 30 days; renewal points were discontinued in 2024.

Corrected the stale Taj Epicure/50,000-point welcome claim and unsupported insurance limits. Current issuer summary lists INR 2 lakh purchase protection, USD 500 baggage/document cover and INR 5 lakh credit shield. Lounge access is advertised as unlimited domestically and internationally, with the physical card used for domestic lounge access and Priority Pass for international visits; guest quota remains unknown. Fuel surcharge waiver is 1% on INR 400-4,000 transactions, capped at INR 400/month. Retained complimentary memberships, airport concierge and other current listed benefits; documented that luxury airport transfers ended in 2024. No numeric golf quota was retained because the current issuer detail could not be verified. Launch date, network tier, eligibility thresholds, point redemption value, dynamic transfer partner ratios, and guest/golf rules remain unresolved.

Primary sources: [Axis Reserve benefits and rewards page](https://www.axis.bank.in/cards/credit-card/reserve-credit-card/beyond-expectations-always), [Axis Reserve lounge details](https://www.axis.bank.in/cards/credit-card/reserve-credit-card/limitless-comfort), [Axis Reserve insurance summary](https://www.axis.bank.in/docs/default-source/reserve-credit-card/rc_insurance_benefits.pdf?sfvrsn=c31c60d9_1), and [Axis Key Fact Sheet](https://www.axis.bank.in/docs/default-source/credit-cards/terms-and-conditions/sosc-credit-cards.pdf?sfvrsn=fdf65956_102).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 788/2,444 (32%), rewards 730/2,954 (25%), benefits 587/2,965 (20%), and eligibility 481/481 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank MY ZONE Credit Card (2026-10-25)

Rechecked the live issuer card page, My Zone-specific rewards revision, current lounge-program PDF, and Axis key fact sheet. Corrected the outdated INR 1 lakh fee-waiver threshold: the current fact sheet lists no annual-fee waiver, while joining and annual fees are INR 500 each. Current issuer terms state 4 EDGE Reward Points per INR 200, with categories including rent, utilities/telecom, wallet, government, insurance, gold/jewellery, fuel, cash advances and repayments excluded; fixed INR 0.20 point values and MCC 6513 were removed. The product page links to an Aug-2026 terms revision, but that linked page could not be fetched, so exclusions and some fee terms remain to be rechecked against it.

Updated the milestone to 1,000 points for INR 1.5 lakh eligible anniversary-year spend (effective 1-Apr-2026); SonyLIV renewal tied to that spend was discontinued from the same date. Current benefits include the first-year SonyLIV subscription (issuer value INR 1,499), District BOGO movie offer, Swiggy INR 120 discount, Cleartrip discounts, 1% fuel surcharge waiver and one quarterly domestic lounge visit. Axis' live lounge program applies spend-based access criteria; the exact My Zone threshold/window and guest entitlement are left unresolved. Eligibility is 18-70 and resident Indian or NRI. Historical launch date, network/tier, universal point valuation, and non-published income/score requirements remain unknown.

Primary sources: [Axis My Zone card page](https://www.axis.bank.in/cards/credit-card/axis-bank-my-zone-credit-card), [My Zone terms revision effective 1-Apr-2026](https://www.axis.bank.in/docs/default-source/default-document-library/terms-and-conditions-for-myzone-credit-card.pdf), [Axis domestic lounge program](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf?sfvrsn=843429b3_8), and [Axis Key Fact Sheet](https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/sosc-credit-cards.pdf?sfvrsn=e31b3c52_9).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 789/2,443 (32%), rewards 736/2,950 (25%), benefits 602/2,961 (20%), and eligibility 483/483 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank My Zone Easy Credit Card (2026-10-25)

Rechecked the current secured-card page and Axis' 28-Aug-2026 general terms revision. Corrected the record's lifetime-free claim: the current standard fee table lists INR 500 joining and annual fees. A comparison listing also advertises nil fees, but offer eligibility and duration are unspecified, so it is recorded as a conflict rather than applied to the standard record. Confirmed 3.4% monthly finance charge, 2.5% cash withdrawal fee (INR 500 minimum), 3.5% foreign-currency fee, and standard fee-page DCC markup; the Aug-2026 issuer revision supersedes the page's stale 1.5% DCC with 3.5% plus tax. Late-payment, overlimit and cheque/auto-debit reversal fees are preserved in notes because the schema cannot model their formulas and additional consecutive-MAD fee.

Confirmed 4 EDGE points per INR 200 on domestic spend, with no reward on movie or fuel transactions; universal point values and MCC 6513 were removed. Axis' Aug-2026 general revision additionally excludes gift cards and bridge/road fees/tolls. Current card page offers 25% cashback on movie tickets at MCC 7832/7922, capped at INR 1,000 per calendar year, and fuel surcharge waiver of 1% for INR 400-4,000 transactions capped at INR 400 per statement cycle. The fixed-deposit range is INR 15,000-INR 25 lakh; Tax Saver, Flexi/auto-sweep and entity-owned deposits are excluded; minors are ineligible. Current page also lists contactless payments up to INR 5,000, cash access up to 100% of limit, up to 50 days' interest-free purchases subject to full payment, and EMI conversion over INR 2,500. Network, card-tier, launch date, and full reward exclusions remain unresolved.

Primary sources: [Axis My Zone Easy page](https://www.axis.bank.in/cards/credit-card/my-zone-easy-credit-card), [Axis general credit-card terms revision effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), and [Axis network announcement](https://www.axis.bank.in/important-links/credit-card/important-announcement-on-credit-card).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 793/2,443 (32%), rewards 738/2,947 (25%), benefits 607/2,962 (20%), and eligibility 483/483 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank NEO Credit Card (2026-10-25)

Reviewed the current Neo product page, the current 20-Jun-2025 Neo-specific reward/benefit terms, offer PDFs linked by Axis, the latest Neo terms effective 28-Aug-2026, and Axis' current fee table. Corrected fees to standard INR 250 joining and second-year annual fees (first year annual fee nil); Axis labels select acquisition channels lifetime-free, so those conditional offers are noted rather than generalizing the card as free. Confirmed 3.75% monthly finance charge, cash advance 2.5%/INR 500 minimum, 3.5% forex, and 3.5% DCC plus tax. Captured current late-fee slabs and extra INR 100 consecutive-MAD charge in notes. Removed unsupported point valuations and MCC 6513; current base is 1 EDGE point per INR 200, with issuer-listed category exclusions and 28-Aug exclusions for gift cards and bridge/road fees/tolls. Schema has no `repayments` exclusion category.

Replaced broad offer prose with current limits: INR 120 Zomato discount twice monthly on minimum INR 499, 5% Paytm mobile/broadband/DTH discount once monthly capped INR 150 with INR 299 minimum, 10% Blinkit discount once monthly capped INR 250 with INR 750 minimum, and Cleartrip flight/hotel discounts. Activation benefit is 100% cashback up to INR 300 on the first utility bill payment in the first 30 days. BookMyShow gives 10% up to INR 100 monthly; effective 1-Nov-2026 it requires INR 25,000 settled spend in the previous three calendar months, waived for new cards for issuance month plus the following three calendar months. Removed Dining Delights, whose page expired 30-Jul-2026. Confirmed age 18-70 and resident Indian or NRI; no numeric income or score floor is published. Network/tier and launch date remain unresolved.

Primary sources: [Axis Neo page](https://www.axis.bank.in/cards/credit-card/axis-bank-neo-credit-card), [Neo-specific terms effective 20-Jun-2025](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-for-neo-credit-card.pdf?sfvrsn=754f8791_2), [Neo terms effective 28-Aug-2026](https://campaign.axis.bank.in/generic/terms-and-conditions-neo.pdf), [Neo EDGE reward exclusion PDF](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/neo-edge-rewards-mcc-exclusions.pdf?sfvrsn=afc8869e_2), [Zomato offer](https://www.axis.bank.in/docs/default-source/default-document-library/zomato-offer-neo-credit-card.pdf?sfvrsn=b70d682e_2), [Paytm offer](https://www.axis.bank.in/docs/default-source/default-document-library/paytm-offer-neo-credit-card.pdf?sfvrsn=af81c722_1), and [Power of 10 offer terms](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-neo-power-of-10.pdf?sfvrsn=1efafb6e_4).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 814 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage is fees 797/2,443 (33%), rewards 740/2,944 (25%), benefits 610/2,963 (21%), and eligibility 485/485 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### Axis Bank Olympus Credit Card (2026-10-25)

Rechecked Olympus against the Axis Key Fact Sheet updated 08-Oct-2026 and the product-specific terms updated 28-Aug-2026. Corrected the base earn rate from the unsupported 10 EDGE Miles/INR 100 to 1 domestic and 2 international; the schema supports only one base rate, so the international rate is documented in the source note. Removed the unsupported 3x Travel EDGE acceleration, fixed redemption ratios and fixed point values. The live terms describe dynamic partner ratios and catalogue/outlet/SMS redemption. Current Key Fact Sheet confirms INR 20,000 joining and annual fees with no waiver, 3% monthly APR, 2%/INR 300 minimum cash fee, 1.8% foreign-currency and DCC markups, waived over-limit fee and nil rent fee. It also specifies the 1% fuel surcharge refund on INR 400-5,000 transactions capped at INR 500 per statement cycle.

Replaced the unsupported 25,000-mile welcome reward with INR 10,000 Taj/ITC hotel vouchers for primary cards, conditioned on issue on/after 01-Jul-2024 and first transaction within 30 days; renewal vouchers apply after the anniversary while active. Confirmed unlimited select domestic lounge access with 10 guest visits/calendar year and unlimited international Priority Pass access with 10 guest visits/anniversary year; effective 28-Aug-2026 Priority Pass is not valid for domestic Indian lounges. Recorded primary-cardholder airport concierge (8/calendar year), airport transfers (2/year), Taj Epicure renewal and BookMyShow caps in notes. Removed unverified golf and insurance amounts.

Launch date remains unknown. The record's discontinued status and 03-Jul-2026 date are retained from existing metadata but not independently corroborated by the reviewed current issuer sources; Axis still publishes active cardholder terms and includes Olympus in its current KFS. Network and tier variants are unresolved. Card-specific age, income, score and residency criteria remain unpublished in reviewed sources. Fee-wavier absence confirmed in the KFS; dynamic partner ratios retained without inventing a single ratio.

Primary sources: [Axis Key Fact Sheet updated 08-Oct-2026](https://www.axis.bank.in/docs/default-source/credit-cards/terms-and-conditions/sosc-credit-cards.pdf?sfvrsn=fdf65956_102), [Axis Olympus terms updated 28-Aug-2026](https://www.axis.bank.in/docs/default-source/default-document-library/olympus-terms-and-conditions.pdf), and [Axis Travel EDGE transfer terms](https://traveledge.axis.bank.in/travel/common/termsandcondition).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 813 reward rules (754 in strict scope; 634/754 strict-ready, 84%). Numeric source-path coverage remains fees 797/2,443 (33%), rewards 740/2,944 (25%), benefits 610/2,963 (21%), and eligibility 485/485 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### IDFC FIRST Power+ Credit Card (2026-10-25)

Reviewed the current IDFC FIRST Power+ product page, 2026 Savings Maximiser, travel-booking terms effective 18-Jun-2026, privileges document, current lounge-access details and current MITC schedule. Rebuilt the record around 30 Reward Points per INR 150 on eligible HPCL fuel (2,400 points maximum/statement cycle; INR 12,000 eligible spend), grocery/utilities (400 points combined/statement cycle; INR 2,000 spend), and IDFC FIRST FASTag (200 points/statement cycle; INR 1,000 spend). Other retail and UPI earn 3 points per INR 150 without a stated cap. The point is valued at INR 0.25 in issuer travel-redemption terms. HP Pay adds six Happy Coins per INR 100 fuel spend, capped at 600 coins/month on INR 10,000 spend; these coins are a separate partner-wallet currency. Reward points are limited to spend within the credit limit, with cycle rewards withheld/reversed if the minimum due is unpaid. June 2026 travel terms give hotel and flight bonus rates and an 8,000-point monthly bonus ceiling; their rate basis is not encoded as absolute point earn because the issuer wording does not make a safe conversion to schema units.

Confirmed INR 499 joining/annual fees and INR 1.5 lakh annual fee reversal threshold. The product page advertises zero forex and dynamic APR from 0.71%-3.85% monthly; the current MITC still lists 3.5% as the general forex/DCC markup and does not list Power+ as an exception. The record follows the card-specific zero-forex page while marking the conflict. APR is recorded as variable/unknown instead of a false single rate. Updated ATM withdrawal fee to INR 199 flat/transaction and interest-free until due date; added a `flat_inr` cash-advance fee field to schema and TypeScript types so the charge is structured, not buried in prose. Captured 2.5%/INR 550 minimum over-limit fee and current late-fee terms in notes.

Updated quarterly domestic lounge access to require INR 20,000 spend in the preceding calendar month; revised movie discount to 25% up to INR 100 monthly with a prior-calendar-month transaction required since 18-Jun-2026. Added INR 500 HPCL gift voucher (primary card, joining fee paid, HPCL purchase threshold, within 60 days for current set-ups), first-EMI cashback up to INR 1,000, INR 2 lakh personal-accident cover, INR 25,000 lost-card liability, and up to four roadside-assistance services. The product page says no fuel-surcharge waiver, but MITC lists a 1% waiver on INR 200-5,000 fuel transactions with the Power+ cap marked Ã¢â‚¬Å“Not ApplicableÃ¢â‚¬Â; no waiver is asserted in structured data pending resolution. A generic FAQ says the welcome voucher window is 30 days, while the specific offer page and offer PDF give 60 days for cards set up from 10-Jun-2025; the detailed current offer terms are followed. Launch date and network tier remain unresolved; age and income are published, numeric score floor is not.

Primary sources: [IDFC FIRST Power+ product page](https://www.idfcfirst.bank.in/credit-card/hpcl-power-fuel-credit-card), [Power+ Savings Maximiser](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/Savings-Maximiser-FIRST-Power-plus.pdf), [Travel & Shop bonus terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/FIRST-Powerplus-TnC-Travel-Shop.pdf), [Power+ welcome offer terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/Power-Series-Welcome-Offer-Benefits.pdf), [Power+ privileges](https://www.idfcfirst.bank.in/content/dam/IDFCFirstBank/credit-cards/FIRSTPower/FIRST-Power-Plus-Privileges.pdf), and [current IDFC FIRST MITC](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf?77=).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 815 reward rules (756 in strict scope; 636/756 strict-ready, 84%). Numeric source-path coverage is fees 804/2,443 (33%), rewards 754/2,947 (26%), benefits 618/2,967 (21%), and eligibility 488/488 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### IDFC FIRST Power Credit Card (2026-10-25)

Rechecked the current IDFC FIRST Power page, Power Savings Maximiser, Travel & Shop bonus terms effective 18-Jun-2026, Power welcome offer terms, and current MITC charges. Replaced stale cashback-style rewards with 21 Reward Points per INR 150 on eligible HPCL fuel (700 points/INR 5,000 spend per statement cycle), 15 points per INR 150 on grocery and utility (400 points/INR 4,000 combined per statement cycle), 15 points per INR 150 on IDFC FIRST FASTag (200 points/INR 2,000 per statement cycle), and 2 points per INR 150 on other retail and eligible UPI spend. The issuer says each point is worth INR 0.25; the Savings Maximiser separately awards 6 HP Pay Happy Coins per INR 100 with a 600-coin monthly limit/INR 10,000 eligible spend. Travel terms offer hotel/flight bonuses with an 8,000 bonus-point monthly ceiling; the percentage basis isn't encoded as a guessed absolute point rate.

Confirmed INR 199 joining and annual fees, annual reversal at INR 50,000, and updated ATM withdrawal fee INR 199 flat with interest-free period until due date. The product page gives dynamic APR 0.71%-3.85% monthly, not the old fixed 3.5%. The current card-specific page advertises zero forex, while the MITC schedule gives the general 3.5% markup and has no explicit Power exception; this conflict is recorded. The issuer page states 2.5%/INR 550 minimum over-limit fee and late fee 15% of total due, INR 100 minimum/INR 1,300 maximum.

Updated welcome benefits to a INR 250 HPCL voucher (primary card, fee paid, eligible fuel transaction within 60 days for current setups) and first EMI cashback up to INR 1,000. Recorded personal accident cover INR 2 lakh, lost-card liability INR 25,000, and up to four RSA services annually. No lounge benefit appears on the current Power page. Fuel surcharge remains unresolved: product-page FAQ says no waiver, whereas the MITC table lists 1% waiver at INR 200-5,000 and places Power/Power+ in the Ã¢â‚¬Å“Not ApplicableÃ¢â‚¬Â cap row. No waiver is asserted in structured data. The product's legacy FAQ says 30 days for the welcome offer; its detailed offer section and dedicated terms say 60 days for cards set up from 10-Jun-2025. Launch date and network tier remain unverified. Issuer states age/income criteria; numeric score floor remains unpublished.

Primary sources: [IDFC FIRST Power page](https://www.idfcfirst.bank.in/credit-card/hpcl-power-fuel-credit-card), [Power Savings Maximiser](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/Savings-Maximiser-FIRST-Power.pdf), [Power Travel & Shop terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/FIRST-Power-TnC-Travel-Shop.pdf), [Power series welcome offer terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/cards/Power-Series-Welcome-Offer-Benefits.pdf), and [current IDFC FIRST MITC](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf?77=).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 817 reward rules (758 in strict scope; 638/758 strict-ready, 84%). Numeric source-path coverage is fees 811/2,443 (33%), rewards 768/2,951 (26%), benefits 623/2,970 (21%), and eligibility 491/491 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### IDFC FIRST Millennia Credit Card and bank-wide forex update (2026-10-25)

Rechecked Millennia against its current product page, May-2026 cardmember communication, June-2026 privileges/insurance PDF, card-specific eligibility page, and the bank's 17-Sep-2026 zero-forex announcement. Corrected the card to lifetime-free with zero forex markup; APR is variable at 8.5%-46.2% p.a., and ATM withdrawals cost INR 199 + GST per transaction with up to 45 interest-free days. Replaced the stale 3 points/INR 150 and incremental-spend tier with 1 point/INR 200 as the unit, 10X dining/travel/international/birthday, 3X general eligible spend, and 1X insurance/utilities/railway/FASTag from 18-Jun-2026. Added a separate 26-Oct-2026 reward record excluding international spend. Points are worth INR 0.25, expire after 24 months, and redemption costs INR 99 + GST. The model notes the UPI transaction-value split and the birthday/MCC detail because its rules cannot express those conditions completely.

Corrected railway lounge access to four visits per quarter after INR 20,000 spend in the preceding calendar month, movie benefit to 25% up to INR 100 once monthly with prior-month activity, and fuel surcharge waiver to 1% up to INR 200/month. Added the INR 500 welcome voucher and first-EMI 5% cashback up to INR 1,000, RSA (up to four services/year), published insurance limits, and eligibility (age 21+, annual income INR 3 lakh+). Upper age, separate employment-type income floors, credit-score floor, network tier, and launch date remain unpublished or unverified. Travel insurance and personal air-accident cover are marked unavailable in the privileges PDF.

The bank-wide announcement explicitly applies zero forex markup to every existing and new IDFC FIRST credit card. It supersedes the older 3.5% general MITC schedule; updated the dated forex fee records for Ashva, Classic, FIRST Private, Hello Cashback, LIC Select, Secured RuPay, Select, SWYP and Wealth, and removed the prior Power/Power+ forex conflict annotations. A broader review of each card's remaining terms is still needed.

Primary sources: [Millennia product page](https://www.idfcfirst.bank.in/credit-card/millennia), [May-2026 Millennia communication](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/FIRST-Millennia-Credit-Card-Communication-May-26.pdf), [Millennia privileges and insurance PDF](https://www.idfcfirst.bank.in/content/dam/IDFCFirstBank/credit-cards/FIRSTMillenniaCreditCard/FIRST-Millennia-Privileges.pdf), [Millennia eligibility page](https://www.idfcfirst.bank.in/finfirst-blogs/credit-card/eligibility-for-first-millennia-credit-card), and [17-Sep-2026 zero-forex announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 822 reward rules (759 in strict scope; 639/759 strict-ready, 84%). Numeric source-path coverage is fees 824/2,498 (33%), rewards 786/2,967 (26%), benefits 633/2,972 (21%), and eligibility 492/492 (100%). Coverage measures traceability, not factual accuracy; dataset-wide review remains incomplete.


### IDFC FIRST Classic Credit Card (2026-10-25)

Rechecked Classic against its current product and eligibility pages, January and May-2026 cardmember communications, current privileges/insurance terms, and the bank-wide 17-Sep-2026 zero-forex announcement. Corrected the card from stale 3.5% forex and fixed 3.5% monthly finance charges to zero forex effective 17-Sep-2026 and a variable APR range of 8.5%-46.2% p.a. Confirmed lifetime-free base-card pricing and INR 199 + GST domestic ATM withdrawal charge; international ATM charges are not quantified. The optional FIRST Digital RuPay add-on has separate INR 199 joining and renewal fees from year two.

Rebuilt rewards as three dated schedules: 18-Jan through 17-Jun-2026 (1 point/INR 200 base; 3X eligible monthly spend up to INR 20,000; 10X incremental spend above the threshold and birthday spend; 1X insurance/utilities/railway/FASTag), 18-Jun through 25-Oct-2026 (10X dining/travel/international/birthday; 3X other eligible spend; 1X insurance/utilities/railway/FASTag), and from 26-Oct-2026 (international spend excluded). Captured the INR 0.25 point value, 24-month expiry, INR 99 + GST redemption fee and reward-withholding condition. Birthday eligibility, threshold math, UPI transaction-size split and MCC windows are not fully expressible in the current rule schema and remain in notes.

Corrected lounge access to four quarterly railway-lounge visits after INR 20,000 eligible spend in the preceding calendar month; it is not airport lounge access. Updated the monthly movie offer, fuel waiver, INR 500 welcome voucher, first-EMI cashback, roadside assistance and available insurance cover from current issuer material. Railway lounge access remains in benefit notes because the structured lounge field only models airport lounges. Travel-insurance sublimits could not be confidently extracted from the issuer table and remain unresolved. Age/residency criteria and network/tier evidence are incomplete; the issuer publishes salaried annual income of INR 3 lakh, while self-employed threshold and a hard credit-score minimum are not published. Removed the unsupported launch date and network tier.

Primary sources: [Classic product and fee page](https://www.idfcfirst.bank.in/credit-card/classic), [January-2026 Classic update](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/FIRST-Classic-Credit-Card-Important-Update.pdf), [May-2026 Classic communication](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/FIRST-Classic-Credit-Card-Communication-May-26.pdf), [Classic privileges and insurance PDF](https://www.idfcfirst.bank.in/content/dam/IDFCFirstBank/credit-cards/FIRSTClassicCreditCard/FIRST-Classic-Privileges.pdf), [Classic eligibility information](https://www.idfcfirst.bank.in/finfirst-blogs/credit-card/first-classic-credit-card-eligibility), and [IDFC FIRST zero-forex announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 831 reward rules (760 in strict scope; 640/760 strict-ready, 84%). Numeric source-path coverage is fees 827/2,496 (33%), rewards 795/3,002 (26%), benefits 645/2,977 (22%), and eligibility 493/493 (100%). Coverage measures traceability, not factual accuracy; the dataset-wide audit remains incomplete.


### IDFC FIRST Ashva Credit Card (2026-10-25)

Rechecked Ashva against the current product page, 2025 reward-structure terms, May-2026 cardmember update, current joining-fee and annual-fee reward terms, current MITC, railway lounge terms, movie offer terms, insurance schedule and 2026 trip-cancellation policy. Replaced the stale 1% forex figure with zero forex effective 17-Sep-2026; corrected the ATM cash fee to INR 199 + GST flat per withdrawal, removed the unsupported 3.5% fixed monthly finance charge, and left the APR unknown pending a current Ashva-specific issuer rate. Kept the issuer's separate 1% markup note for overseas ATM cash withdrawals, which the card page treats apart from retail purchase forex markup. Captured add-on fees (INR 2,000 metal/INR 1,500 plastic joining, INR 1,000 renewal). Corrected the annual fee record: INR 8 lakh anniversary-year spend earns 7,500 points after the next annual fee is paid; the fee is not waived.

Replaced stale 3 points/INR 150 and weekend-dining/international 10-point claims with current reward terms: 1 point/INR 150 unit; 5 points/INR 150 on eligible monthly spend through INR 20,000; 10 points/INR 150 on eligible incremental spend above it; 5 points/INR 150 on international spend through 25-Oct-2026, then 2 points/INR 150 from 26-Oct-2026; 3 points/INR 150 on rent, education, government and wallet-load spend; and 1 point/INR 150 on insurance, utilities, railway and FASTag. The monthly threshold and UPI transaction-size rates are retained in notes because the schema cannot express them exactly. There is an issuer conflict on app-booking bonuses: the May-2026 cardmember notice says 20% of applicable points on hotels and 10% on flights, but the live product page and detailed reward T&Cs state fixed 30 bonus points/INR 150 on hotels and 15 on flights; the T&C example gives 10 points for flights, and the T&C shows a 15,000-point monthly bonus cap. No app bonus rate is scored pending clarification. The issuer's general reward page says Ashva birthday purchases earn 10X, but card-specific conditions are unpublished. Captured INR 0.40 per point on app flight/hotel bookings, INR 0.25 elsewhere, INR 99 + GST per redemption, travel redemption caps (100,000 points/month and 200,000/year), point validity while the card remains active, the credit-limit earning cap and minimum-due reversal rules.

Corrected airport lounge access to four domestic and two international visits per quarter, each unlocked by INR 20,000 spend in the current calendar month for next-month access. Captured the separate four-visit quarterly railway-lounge benefit and its same-month spend gate; corrected golf to one monthly round after INR 20,000 and one lesson after INR 40,000 in the previous statement cycle. Updated the movie offer to two monthly BOGO transactions capped at INR 400 each, with the June-2026 next-month spend gate; fuel waiver is 1% on INR 200-5,000 transactions, capped at INR 300 per statement cycle. Added the once-per-customer 7,500-point joining offer, annual 7,500-point reward, and trip-cancellation cover. Current insurance sources confirm INR 1 crore air-accident cover, INR 10 lakh personal-accident cover, INR 50,000 card-liability and purchase-protection cover, plus travel sublimits of USD 500 checked-baggage loss, USD 300 flight delay, USD 100 baggage delay and USD 300 passport/document loss; insurance requires recent card use and travel claims require an eligible international ticket bought on the card. The schema has no trip-cancellation insurance type, so its INR 25,000 cover is recorded as `other`. Card-specific age, income and bureau thresholds are not published. Visa Infinite is confirmed; launch date and a complete pre-June-2026 reward history remain unresolved.

Primary sources: [Ashva product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/ashva), [Ashva reward-structure terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva-CC-Rewards-Structure-TnC-28-05-25-copy.pdf), [bank reward program page](https://www.idfcfirst.bank.in/credit-card/benefits/rewards-points), [May-2026 Ashva cardmember update](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Ashva-Credit-Card-Communication-May-26.pdf), [joining-fee reward terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva-Joining-Fee-Payment-Benefit-T-C-29-08-25-2.pdf), [annual-fee reward terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva-Credit-Card-Annual-Fee-Payment-Benefit-Offer-29-08-25-02.pdf), [current trip-cancellation policy](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva/docs/CFAR.pdf), [issuer insurance schedule](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Insurance-Privileges-Documents-24-06-24-V2.pdf), [railway lounge terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva/docs/Railway-Lounge.pdf), and [Ashva movie-offer terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva/docs/Ashva-Movie-offer-Metal-Card-27-05-25.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 836 reward rules (761 in strict scope; 641/761 strict-ready, 84%). Numeric source-path coverage is fees 830/2,486 (33%), rewards 803/3,021 (27%), benefits 674/2,994 (23%), and eligibility 493/493 (100%). These figures measure explicit numeric traceability, not factual accuracy; the dataset-wide audit remains incomplete.


### IDFC FIRST Diamond Reserve Credit Card (2026-10-25)

Rebuilt Diamond Reserve from the current product page, its June-2026 privileges terms and cardmember update, the issuer launch announcement, and current issuer insurance schedule. Removed the placeholder launch date and unsupported Visa Signature tier. Current core fees are INR 3,000 + GST joining/annual, INR 6 lakh annual fee waiver, zero forex, and flat INR 199 + GST cash advance charge; issuer FAQ gives up to 45 interest-free days and INR 10,000 max per withdrawal. The APR is dynamic, currently 8.5%-42% p.a.; a fixed monthly rate is not asserted. Add-on, UPI and replacement fees are documented in notes because core fee schema does not model them.

Corrected rewards to 1-point unit at INR 0.25; 3 points/INR 150 on eligible spends up to INR 20,000 per statement cycle, 10 points/INR 150 on eligible incremental spends above that threshold, 3X rent/government/wallet/education, and 1X insurance/utilities/railway/FASTag. International, fuel, EMI, fee/tax, loan-on-card, balance-transfer and cash withdrawals are excluded, with no points below INR 150 and rewards capped at the assigned credit limit. Point expiry is not published (issuer FAQ says they do not expire). App-booking bonus remains unresolved: the May notice/live product page describe percentage bonuses while the detailed terms use fixed points per INR 150, an 8,000-point monthly cap and an inconsistent flight example. No app bonus is scored.

Updated airport lounges to two India-terminal and two global-terminal visits per quarter, unlocked by INR 20,000 spend in the current month for next-month access; primary/add-on quotas are shared. Railway lounges are four visits per quarter on the same spend gate. Golf allowance is retained in notes because terms grant up to two rounds or lessons at INR 20,000/40,000 thresholds and schema would otherwise imply two of each. Corrected movie offer to twice monthly, INR 250 off each second ticket, with INR 20,000 current-month spend gate. Added 1% fuel waiver (INR 200-5,000 transaction range; INR 300 monthly cap), RSA, claim-based joining offers and insurance schedule: INR 1 crore air accident, INR 10 lakh personal accident, INR 50,000 card liability/purchase protection, USD 500 baggage loss, USD 300 flight delay, USD 100 baggage delay and USD 300 passport/document loss. Trip cancellation remains unresolved: current marketing advertises INR 25,000/year but the linked detailed policy ended 7-May-2026 and no replacement policy was found. Current age, income and credit-score thresholds remain unpublished.

Primary sources: [Diamond Reserve product page](https://www.idfcfirst.bank.in/credit-card/diamond-reserve-credit-card), [June-2026 privileges terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Diamond-Reserve-Terms%26Conditions.pdf), [May-2026 cardmember update](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Diamond-Reserve-Credit-Card-Communication-May-26.pdf), [issuer launch announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-Diamond-Reserve-Credit-Card.pdf), and [IDFC FIRST insurance overview](https://www.idfcfirst.bank.in/credit-card/benefits/insurance-and-protection).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 839 reward rules (764 in strict scope; 644/764 strict-ready, 84%). Numeric source-path coverage is fees 835/2,484 (34%), rewards 806/3,028 (27%), benefits 693/3,005 (23%), and eligibility 493/493 (100%). These are traceability counts, not factual accuracy measures; dataset-wide review remains incomplete.


### IDFC FIRST Private Credit Card (2026-10-25)

Rebuilt FIRST Private from the current product page and its consolidated terms dated 17-Jul-2026, plus separate current insurance and partner-offer sections. The previous record's zero joining/annual fees and legacy point program were not appropriate for new issues: cards issued from 17-Jul-2026 have a INR 50,000 + GST commencement fee and INR 25,000 + GST annual fee from year two, with 50,000 joining-fee Reward Points (up to INR 50,000 value). The page lists 9% onboarding APR, zero forex, and no late-payment/over-limit fees. The card-specific post-onboarding APR and cash advance fee are not explicit in the new consolidated fee schedule; ATM fee is retained with a note from issuer FAQ, and its exact card-specific applicability remains uncertain. Fee treatment for pre-17-Jul legacy accounts is not fully described.

Replaced the old 3X/10X threshold with 10 points/INR 150 on eligible domestic and 5 points/INR 150 on eligible international purchases; rent, education, utilities, insurance, government, FASTag, wallet, railway, gift voucher and jewellery earn 1 point. Current exclusions include fuel, EMI, fees/GST, quasi-cash, cash withdrawals, loans on card and balance transfers. Added current IDFC app travel earn (50 bonus hotel/20 flight points per INR 150; total 60/30), INR 1 point value for in-app travel and INR 0.25 elsewhere, INR 99 + GST redemption fee, INR 6 lakh annual travel-redemption cap, credit-limit reward cap and MAD reversal. Separate charity Karma Points are recorded independently; not mixed into spend-redeemable reward points.

Updated unlimited airport lounge access (with 4 annual domestic accompanying-guest visits), unlimited railway-lounge access and golf rounds/lessons in India, one international golf round per quarter, BMS benefit (INR 750 off twice monthly through 31-Mar-2027), current CFAR policy through 7-May-2027 (separate INR 25,000 flight and hotel sublimits), air accident cover INR 2.5 crore, purchase cover INR 5 lakh and USD 1,200 travel-insurance sublimits. Recorded roadside assistance and hotel/airport offers. Current issuer MITC specifies a 1% fuel surcharge waiver on INR 200-5,000 fuel transactions with no FIRST Private per-statement cap. Removed milestone awards discontinued on 17-Jul-2026; explicit legacy terms say Club ITC Culinaire and Taj dining vouchers are no longer granted for post-cutoff issues/anniversaries. Age, income and score thresholds remain unpublished.

Primary sources: [FIRST Private product page](https://www.idfcfirst.bank.in/credit-card/FIRSTPrivateCreditCard), [consolidated terms effective 17-Jul-2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/first-private/FIRST-Private-Credit-Card-Consolidated-TnC-17072026.pdf), [issuer card policy and fuel waiver table](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/regulatory-disclosures/IDFC-FIRST-Bank-Credit-Card-Policy-Document.pdf), [Club ITC legacy terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/first-private/Club-ITC-Culinaire-Membership-FIRST-Private-Credit-Card-TnC-July-2026.pdf), and [Taj dining voucher legacy terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/first-private/Taj-Experiences-Dining-Voucher-FIRST-Private-Credit-Card-TnC-July-2026.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 842 reward rules (767 in strict scope; 647/767 strict-ready, 84%). Numeric source-path coverage is fees 837/2,476 (34%), rewards 809/3,040 (27%), benefits 708/3,019 (23%), and eligibility 493/493 (100%). These are traceability counts, not factual accuracy measures; dataset-wide review remains incomplete.


### IDFC FIRST Gaj Credit Card (2026-10-25)

Rebuilt Gaj from the current product page, the linked Gaj privileges PDF, the dated Gaj reward-structure PDF, the May-2026 cardmember notice and the 29-Dec-2025 launch release. Confirmed invitation-only availability, launch date, INR 12,500 + GST joining/annual fees, INR 10 lakh anniversary-year annual-fee waiver, zero forex, INR 199 + GST flat ATM advance charge, 45 interest-free days and INR 10,000 per-withdrawal limit. Removed the stale fixed 3.5% monthly purchase APR because no Gaj-specific APR was found in current issuer material. Core hotel/flight total reward rates of 50/25 points per INR 150 remain supported; the current schedule clarifies these include 45/20 bonus points over the 5-point base and that their shared monthly cap is 15,000 bonus points. Added 3X international and 1X insurance, utilities, rent, government, wallet, education, railway and FASTag categories, exclusions, credit-limit accrual ceiling, reward reversals when MAD is unpaid, redemption values/caps and statement that points do not expire while active. A single generic point value is left unknown because issuer value varies between app travel (INR 1) and other redemption (INR 0.25).

Corrected airport access from unsupported unlimited quotas to four domestic visits (including one guest visit) and four global visits per quarter, unlocked by INR 20,000 current-calendar-month spend for next-month access. Added railway lounge visits with the same spend gate, spend-triggered golf (up to 24 rounds/lessons yearly), trip cancellation (INR 25,000 each for flights and hotels, up to two cancellations shared with add-ons), current linked travel/purchase insurance amounts, fuel waiver (1%, INR 300 statement-cycle cap), meet-and-greet, hotel offers, roadside assistance and companion RuPay card. Full policy-level insurance exclusions/claim conditions and age/income/score thresholds are not published in the sources reviewed. Reward field modeling also cannot fully express spend-triggered lounge/golf access or that bonus-point caps exclude base points.

Primary sources: [Gaj product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/gaj), [Gaj reward structure terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/GAJ-CC-Rewards-Structure-TnC-22-12-25.pdf), [Gaj privileges and insurance PDF](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/IDFC-Gaj-Card-TC-Revised-dec25-v3-dec24.pdf), [May-2026 reward-cap notice](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Gaj-Credit-Card-Communication-May-26.pdf), and [29-Dec-2025 launch release](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-Gaj-Credit-Card-29122025.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 843 reward rules (768 in strict scope; 655/768 strict-ready, 85%). Numeric source-path coverage is fees 851/2,473 (34%), rewards 826/3,044 (27%), benefits 732/3,038 (24%), and eligibility 495/495 (100%). These are traceability counts, not factual accuracy measures; dataset-wide review remains incomplete.


### Axis Bank FreeCharge Plus Credit Card (2026-10-25)

Rechecked the live product page and linked cashback terms. Current fees are INR 350 joining, no first-year annual fee, INR 350 from year two, and waiver after INR 50,000 eligible spend in the preceding card-anniversary year; rent and wallet loads do not count. Corrected monthly finance charge from 3.0% to 3.75%; cash advance remains 2.5% with INR 500 minimum and forex markup 3.5%.

Confirmed 5% cashback only on Freecharge on-deck merchant IDs for purchases through the Freecharge app, 2% on local commute only on MCCs 4121, 4131, 4111 and 7512 (including Ola/Uber), and 1% on other eligible spend. The linked terms state no overall cashback cap, exclude transactions below INR 100, and exclude wallet loads, fuel, cash withdrawal, gold/jewellery, government, insurance, education, utility payments outside Freecharge, gift cards, EMI/post-facto EMI, rent, and bridge/road fees/tolls. Cashback is credited by the 8th of the next month after statement generation. Removed the broader Freecharge-spends interpretation; ordinary wallet loads are excluded.

The product page intro says T&Cs were updated 28-Aug-2026, while its footer and linked cashback PDF refer to 20-Jun-2025. Rates on the live page and linked cashback terms agree, but the effective-date conflict remains noted. The card is invite-only, surfaced through an eligible customer's Freecharge-app banner. No age, income, credit-score or residency thresholds are published, so unsupported launch date and residency were removed; schema/types now allow unknown residency as null. The INR 700 welcome voucher is shown only for cards issued before 04-Jan-2023. Current Wednesday offers listed are up to 15% off MakeMyTrip flights/hotels, 10% off Swiggy and 10% off Tira up to INR 1,000; Dining Delights terms vary by merchant. Sources: [FreeCharge Plus product page](https://www.axis.bank.in/cards/credit-card/axis-bank-freecharge-plus-credit-card) and [linked cashback terms](https://www.axis.bank.in/docs/default-source/default-document-library/cashback-tandc.pdf?sfvrsn=b270fe86_2).


### Axis Bank Fibe Credit Card (2026-10-25)

Rechecked the live Fibe product page, linked cashback terms and Axis domestic lounge program. Corrected monthly finance charge from 3.0% to 3.75%. The current card remains lifetime-free; ATM cash advance remains 2.5% (minimum INR 500) and foreign currency fee 3.5%. Corrected fuel-waiver qualifying transaction maximum from INR 4,000 to INR 5,000 and period from statement to month; current page caps waiver at INR 400 per month. The issuer notes that some transactions may incur INR 10 + GST rather than 1% + GST.

Current cashback is 3% on online food delivery, online entertainment and online local commute through issuer-listed MCCs 5499, 5812, 5814, 7841, 7829, 7832, 7922, 4121, 4131, 4111 and 7512; other spend earns 1%, with a combined INR 1,500 statement-cycle cap. Removed the previous Swiggy/Zomato merchant-only impression; the rate is MCC-based. Updated exclusions from the current terms: fuel, cash withdrawal, gold/jewellery, gift cards, EMI and post-facto EMI, rent, repayments, insurance, education, government services, wallet loads, CC-on-UPI below INR 2,000 or at small merchants, and bridge/road fees and tolls. Transactions below INR 100 do not earn cashback. Cashback is rounded down per transaction and credited T+3 days from statement generation. Axis T&C supplies the reward schedule and MCC list; the product page says terms were updated effective 28-Aug-2026.

The live lounge program lists one Fibe visit per quarter, with a spend gate of INR 50,000 eligible settled spend in the previous three calendar months; new-card issuance has a temporary spend-gate waiver. Updated eligibility to age 18-70 and resident Indian or NRI, and retained unknown income/credit-score cutoffs because the issuer does not publish numeric thresholds. Current page also advertises Wednesday offers (up to 15% off MakeMyTrip flights/hotels, 10% off Swiggy, and 10% off Tira up to INR 1,000) and Dining Delights; offer-specific terms and availability can change. Primary sources: [Fibe product page](https://www.axis.bank.in/cards/credit-card/fibe-axis-bank-credit-card), [Fibe cashback terms](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-cashback-on-fibe-axis-bank-credit-card.pdf?sfvrsn=7cc42032_3), and [Axis domestic lounge program](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf?sfvrsn=843429b3_11).


### Axis Bank Flipkart Super Elite Credit Card (2026-10-25)

Rechecked the live Axis product page and its linked SuperCoin terms. The page states the Flipkart card terms were updated effective 28-Aug-2026. Confirmed INR 500 joining and second-year-onward annual fees, annual-fee waiver above INR 2 lakh (rent MCC 6513 and wallet MCC 6540 excluded from waiver spend), 3.75% monthly finance charge, 2.5% cash advance fee (minimum INR 500), and 3.5% foreign currency fee. Corrected the fee-waiver omission and the prior placeholder launch date to the Axis launch announcement date, 22-Nov-2022.

Corrected the Flipkart accelerator interpretation. Axis terms say the card issues additional 12 SuperCoins/INR 100 for Plus members or 6/INR 100 for non-Plus members, capped at 300/150 additional coins per transaction; separate Flipkart platform coins may also be credited. Other eligible spend earns 2 card SuperCoins/INR 100. The prior record incorrectly treated Plus earn as 14 card coins (and described non-Plus as 8); the issuer's launch announcement explains 16/8 totals only when the independent Flipkart loyalty coins are included. Updated excluded-spend categories and MCC codes using current Axis terms. Redemption value varies with product/offer, so removed the unsubstantiated INR 0.25 and INR 0.22 per-coin estimates. Current product-page welcome list includes 500 SuperCoins, YouTube Premium (2 months), Gaana Plus (3 months), Lenskart Gold (1 year), Myntra select-style INR 500 discounts (orders above INR 2,999, max 3 transactions), Flipkart Flights 15% (max INR 1,500), and 30% off the first Flipkart Health medicine order. SuperCoin cash value remains unknown.

Updated the eligibility record to the issuer's stated age range 18-70 and resident-Indian or NRI status. The page does not publish minimum income or credit-score thresholds; required documents are indicative and approval remains at the bank's discretion. No end date is published for the listed welcome promotions, so their continued availability should be rechecked. Primary sources: [Axis Super Elite product page](https://www.axis.bank.in/cards/credit-card/flipkart-axis-bank-super-elite-credit-card), [Axis SuperCoin terms](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-for-flipkart-superelite-axis-bank-credit-card.pdf?sfvrsn=949a2028_1), and [Axis launch announcement](https://www.axis.bank.in/about-us/press-releases/axis-bank-and-flipkart-partner-to-launch-flipkart-axis-bank-super-elite-credit-card).


### Axis Bank Flipkart Credit Card (2026-10-25)

Rechecked the live Axis product page, linked cashback terms, welcome-benefit terms, and current preferred-merchant list PDF. The current product page shows a limited-period nil joining fee, INR 500 annual fee from year two, annual fee waiver above INR 3.5 lakh annual spend, 3.75% monthly finance charge, 2.5% cash advance fee (INR 500 minimum), and 3.5% foreign currency transaction fee. These replace the stale fixed INR 500 joining fee and 3.0% monthly finance charge; the current offer's end date is not published, so the nil joining fee is dated as verified today and should be rechecked.

Current cashback remains 7.5% on Myntra, 5% on Flipkart and Cleartrip, 4% unlimited on preferred merchants, and 1% unlimited on other eligible spend. The INR 4,000 cap is per statement quarter per named co-brand merchant. Updated exclusions to the current issuer list: eligible exclusions include Flipkart/Myntra gift cards, gold, EMI and post-facto EMI conversions, cash advances, card charges, utility/telecom, fuel, jewellery/watch/silverware, insurance, financial institutions, rent, wallet loads, education, and government services. Cashback is based on merchant IDs, not merely the merchant name; Swiggy accelerated cashback applies to food delivery in the Swiggy app, not Instamart or Genie. Cashback terms also say purchases below INR 100 do not earn cashback. The present enum schema cannot retain every detail of those exclusions, so additional specifics are summarized here and in the card note.

Updated the welcome benefit condition: the INR 250 Flipkart voucher requires a non-cash transaction within 30 days and a card charged the INR 500 joining fee, so it is unavailable under first-year-free issuance. Added the page's separate first-time Swiggy-user offer (50% off, up to INR 100). Fuel waiver remains 1% on INR 400-4,000 transactions, capped at INR 400 per statement cycle.

The separate preferred-merchant PDF is image-heavy and current terms say merchant membership can change without notice. The cached list could not be text-extracted; the old Swiggy/PVR/Uber/Cult.fit names are therefore explicitly flagged for visual verification and are not treated as high-confidence current identities. The source page and terms were retrieved 2026-10-25. See [Axis Flipkart product page](https://www.axis.bank.in/cards/credit-card/flipkart-axisbank-credit-card), [cashback terms](https://www.axis.bank.in/docs/default-source/default-document-library/cashback-tncs---final.pdf?sfvrsn=b55a0e1a_5), [welcome-benefit terms](https://www.axis.bank.in/docs/default-source/default-document-library/tncs-for-flipkart-welcome-benefit.pdf?sfvrsn=9ce2efcd_1), and [preferred merchant list](https://www.axis.bank.in/docs/default-source/default-document-library/flipkart-axis-bank-credit-card-preferred-merchants.pdf?sfvrsn=6f1c974f_3).

After this pass, `scripts/validate.py` reports 369 cards, 33 issuers, 0 errors, 0 warnings, 845 reward rules (770 strict; 660/770 strict-ready, 85%). Numeric source-path coverage is fees 866/2,457 (35%), rewards 852/3,046 (28%), benefits 754/3,061 (25%), and eligibility 495/495 (100%). These are evidence-path coverage counts, not accuracy scores; the dataset-wide audit remains incomplete.

### IDFC FIRST IndiGo follow-up (2026-10-25)

Rechecked current fee and offer claims against the live IDFC FIRST IndiGo product page and its linked October 2026 offer terms. The current product page states a dynamic purchase APR range of 8.5%Ã¢â‚¬â€œ46.2% p.a.; no account-specific monthly APR is published, so the YAML leaves `finance_charge_monthly_pct` unknown. Current ATM fee is INR 199 + GST per withdrawal, with up to 45 interest-free days and a 10% credit-limit withdrawal ceiling. The record keeps the 1.49% forex rate only in the historical fee period through 16-Sep-2026 and records 0% from 17-Sep-2026 under the bank-wide issuer announcement.

The current page confirms the fee-based 5,000 BluChip + meal welcome benefit, the same annual renewal benefit, 3,000 BluChips after INR 1 lakh spend in 90 days, and the October 1Ã¢â‚¬â€œ31 additional 5,000-chip unsecured-card offer. The linked terms define its November fulfilment and six-month voucher validity. The product page itself still conflicts on the FD minimum (INR 50,000 in FAQ/headline versus INR 1 lakh in application flow); that remains unresolved. Other open limitations remain: transaction-rail/MCC distinctions and shared-limit accrual are not fully representable in the reward model; current insurance policy duration and the trip-cancellation policy-period dates need authoritative clarification.

After updating the IndiGo benefits provenance, `python scripts/validate.py` reports 369 cards, 33 issuers, 0 errors, 0 warnings, and 843 reward rules (768 strict; 655/768 strict-ready, 85%). `python scripts/audit_numeric_evidence.py` currently reports explicit numeric source-path coverage of fees 854/2,468 (35%), rewards 826/3,044 (27%), benefits 721/3,039 (24%), and eligibility 495/495 (100%). The scanner denominator changed from the earlier snapshot, so these percentages are not directly comparable without that caveat. Counts measure field-level provenance coverage, not proof of accuracy. Dataset-wide review remains incomplete.

### IDFC FIRST Mayura follow-up (2026-10-25)

Rechecked Mayura against the live issuer product page, its current-linked Mayura Rewards Structure T&C, the 18-Jun-2026 cardholder update, and the annual-fee offer terms. Corrected the previous record's INR 12 lakh fee-waiver claim: the current offer is an annual-fee reward benefit after prior anniversary-year net spend of INR 8 lakh (7,500 points) or INR 15 lakh (15,000 points), conditional on paying the next annual fee. Corrected the ATM charge from 2.5%/INR 500 minimum to INR 199 + GST flat per withdrawal, with up to 45 interest-free days and a INR 10,000 per-transaction cap. The current page does not publish a fixed Mayura monthly purchase APR, so that value is unknown.

Updated reward terms to the June 2026 schedule: 5 points/INR 150 up to INR 20,000 statement-cycle eligible spend, 10 points/INR 150 on incremental eligible spend above that threshold, 5 points/INR 150 internationally, 3 points/INR 150 for rent/government/wallet/education, and 1 point/INR 150 for insurance/utility/railway/FASTag. App travel bonuses are 30 additional points/INR 150 for hotels and 15 for flights, subject to a shared 25,000 monthly bonus cap; point redemption values differ (INR 0.50 app travel, INR 0.25 other) and caps are documented. The schema cannot safely encode the incremental INR 20,000 threshold as an accelerator, so the corresponding rule has no canonical categories and is documented rather than blanket-scored. The previously stored 2X dining/online/international rates were not an accurate representation of the current schedule.

Corrected golf to four rounds and 12 lessons per calendar year (plus separate spend-unlocked benefits), and added current lounge spend gate, movie offer gate, railway lounge gate, fuel-waiver cap, trip-cancellation description, joining-benefit tranches, conditional annual-fee milestones, and current accident/travel cover limits. Full insurer policy conditions, eligibility age/income/score thresholds, source launch date, and the domestic lounge single-guest sub-limit remain unpublished or not fully verified; those data stay unknown or are described in notes. The issuer page also carries inconsistent/legacy FAQ text in places, so linked dated notices/terms were preferred where available.

Primary sources: [Mayura product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/mayura), [Mayura Rewards Structure T&C](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Mayura-CC-Rewards-Structure-TnC-28-05-25.pdf), [Mayura June 2026 update](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Mayura-Credit-Card-Communication-May-26.pdf), and [annual-fee payment offer terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Mayura-Credit-Card-Annual%20fee%20payment-Offer-29-08-25-02.pdf).

After this pass, the current validation and numeric-coverage snapshot is recorded in `docs/TODO.md`; these checks establish structural validity and evidence-path traceability, not factual accuracy across unreviewed cards. Dataset-wide review remains incomplete.

### IDFC FIRST LIC Select follow-up (2026-10-25)

Rechecked the active LIC Select page, its linked 09-Mar-2026 welcome offer, Travel & Shop bonus/redeem terms, and LIC Select privileges PDF. Removed unsupported launch-date, fixed monthly APR, and cash advance percentage/minimum assertions. Current lifetime-free fees are zero joining/annual fee; ATM cash advance is a flat INR 199 + GST and up to 45 interest-free days. APR is dynamic/account-specific (the issuer's general current range is 8.5%Ã¢â‚¬â€œ46.2% p.a.), so no monthly card-specific number is asserted. Zero forex markup applies from 17-Sep-2026; the previous 3.5% is only retained in the historical note and not as a current value.

Corrected rewards to the current LIC Select schedule: 10 points per INR 125 on LIC premiums paid through licindia.in (first five transactions per statement cycle only), 5 points per INR 125 on other eligible spend, and 5 points per INR 125 on essentials with a shared 600-point monthly cap. Points are INR 0.25 each, expire after three years, and cycle rewards reverse when MAD is not paid. App travel earns additional bonus points equal to 20% of base points for hotels and 8% for flights, shared 8,000 bonus-point monthly cap; the issuer's current Travel & Shop terms cap redemption at 100,000 points/month and 200,000/year and 70% of booking value. The schema cannot express the shared essentials cap or the five-transaction LIC premium limit, so both are documented as modeling constraints.

The current product page says the welcome award is 2,000 points and qualifying spend is INR 10,000 within 30 days; its linked welcome PDF says 2,500 points and more than INR 10,000. Both discrepancies are recorded as unresolved. The product page lists 2 domestic airport lounge visits per quarter, 4 railway lounge visits per quarter, 1% fuel surcharge waiver up to INR 300/month on INR 200Ã¢â‚¬â€œ5,000 transactions, accident/travel cover, and roadside assistance. The airport lounge PDF references a monthly activation threshold, but the threshold value is not legible in its extracted text and is not guessed. Insurance amounts on the product page and extracted linked policy table appear inconsistent; the published page values are represented with policy caveats and the discrepancy is documented. Eligibility age, income, credit score, explicit residency criteria, and exact launch date remain unverified.

Primary sources: [LIC Select product page](https://www.idfcfirst.bank.in/credit-card/lic-credit-card), [LIC Select welcome offer terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/LIC-Joining-Offers-01.pdf), [LIC Select Travel & Shop T&C](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/LIC-Select-TnC-Travel-and-Shop.pdf), [LIC Select privileges PDF](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Privileges-Document-LIC-Select-11-08-25-Link.pdf), and [bank-wide zero-forex announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf).

After the LIC Select update, validation reports 369 cards, 33 issuers, 0 errors, 0 warnings, and 845 reward rules (770 strict; 660/770 strict-ready, 86%). Numeric path coverage is fees 861/2,457 (35%), rewards 839/3,046 (28%), benefits 747/3,060 (24%), and eligibility 495/495 (100%). These counts are traceability aids, not accuracy scores; the dataset-wide review remains incomplete.


### IDFC FIRST Hello Cashback Credit Card (2026-10-25)

Rebuilt Hello Cashback from the live product/eligibility page and the issuer's linked Product Feature Document. Corrected the network from Visa Platinum to RuPay Select based on the current RuPay-only UPI product materials and card image; kept the exact network identification traceable to the issuer product guide. Removed the unsupported 2025 launch placeholder. Fees are INR 1,000 + GST annually from year two, with full reversal at INR 2 lakh annual spend and 50% reversal from INR 1 lakh to below INR 2 lakh. Joining is currently waived through 31-Oct-2026 (standard INR 1,000 + GST after); the previous record incorrectly treated the card as permanently free. ATM withdrawals are advertised as interest-free for up to 45 days with a flat INR 199 + GST transaction fee; a card-specific purchase APR was not published and was left unknown. Zero forex markup is confirmed on the current page and is consistent with the bank's 17-Sep-2026 all-card policy change.

Corrected cashback from the prior 1% base/5% incremental structure to 3% on eligible online spend up to INR 10,000 per statement, then 5% on incremental eligible online spend, with a combined INR 1,000 online cap. In-store, IDFC FIRST app UPI and issuer-defined essential categories earn 1%. App flight/hotel bookings get a separate additional 1% bonus, for total 4%/6% depending on the online-spend tier. Total cashback is capped at INR 1,500 per statement. Fuel, ATM cash, EMI and third-party UPI earn no cashback; online fuel/essential categories do not count toward the INR 10,000 threshold. Cashback posts after the due date if MAD is timely, reverses on refunds, and is forfeited for a cycle if MAD is not paid. Removed the prior INR 1,000 Ã¢â‚¬Å“introductory cashbackÃ¢â‚¬Â welcome claim, which was not present in current issuer offer terms.

Corrected the fuel surcharge waiver from INR 300 to 1% on INR 200Ã¢â‚¬â€œ5,000 fuel transactions, capped at INR 100 per statement. Added personal accident INR 2 lakh, lost-card liability INR 25,000, credit shield INR 50,000, purchase protection INR 25,000/60 days, and up to four RSA services per year. Eligibility is now issuer-backed at age 18Ã¢â‚¬â€œ80, Indian residency, no income proof or credit history required, and minimum INR 10,000 single-held FD; limit is 100% of FD value. The issuer document requires an active-card transaction for insurance and states the claim conditions/exclusions; the listed insurance limits are subject to those policy terms. No lounge or trip-cancellation cover was found for this card.

Primary sources: [Hello Cashback product/eligibility page](https://www.idfcfirst.bank.in/credit-card/hello-cashback-credit-card), [current cashback and insurance terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Hello-Cashback-Terms-and-Conditions.pdf), [RuPay card listing and card image](https://www.idfcfirst.bank.in/credit-card/rupay), and [bank-wide zero-forex announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf).

After this pass, validation reports 369 cards, 33 issuers, 0 errors, and 843 reward rules (768 in strict scope; 655/768 strict-ready, 85%). Numeric source-path coverage is fees 851/2,473 (34%), rewards 826/3,044 (27%), benefits 732/3,038 (24%), and eligibility 495/495 (100%). These are traceability counts, not factual accuracy measures; dataset-wide review remains incomplete.


### BOBCARD Etihad Guest and Etihad Guest Premium (2026-10-26)

Rechecked both live BOBCARD product pages and the current Etihad MITC 2.0 (April 2026). Corrected the monthly finance charge from 3.49% to 3.75%; refreshed fee provenance and current joining/annual fees, waiver thresholds, forex rates, cash-advance fees, earn rates, lounge quotas, fuel-waiver terms and age/residency eligibility. Replaced the unsupported 2024-01-01 launch dates with unknown and removed Visa Platinum/Signature tier assertions because the current BOBCARD pages do not identify a Visa tier. Lounge guest allowance is unpublished, so the records no longer assert zero guests.

Removed fixed INR valuations for Etihad Guest Miles and welcome/milestone miles because their value depends on Etihad redemption/tier conditions. The MITC says validity follows the Etihad Guest tier and redemptions are through Etihad after the statement posting period. Updated the Annexure 1 base-mile MCC exclusions from the April 2026 MITC; this list includes supermarket/convenience/variety/retail (MCC 5261, 5331, 5411, 5499) and fast food (MCC 5814). Fuel earns no miles per BOBCARD product page. The current BOBCARD product pages list 250/500 monthly miles, 2,000/4,000 quarterly miles, and advertised annual milestone totals; annual thresholds of INR 7.5 lakh/12 lakh were corroborated on Etihad's official partner page and added. The Etihad partner page also lists a once-yearly bonus for flying twice with Etihad; its award is documented in the audit because the card schema cannot represent a condition without a spend threshold.

The current BOBCARD pages advertise welcome bundles of 7,500/15,000 miles (including first-60-day spend/joining-fee and INR 50,000 cumulative-spend conditions), while Etihad's partner page separately describes 2,500/5,000 base welcome miles and tier upgrades. BOBCARD's MITC landing page lists a separate ?Additional Miles Offer 2026?; the exact offer terms and how it stacks with the base welcome offer need confirmation. BOBCARD also lists a Premium product-feature revision effective 5-Aug-2026, but its detailed effect was not retrievable in this pass, so Premium-specific changed terms remain to be checked. No numeric income or credit-score threshold is published.

Primary sources: [Etihad Guest product page](https://www.bobcard.co.in/credit-card-types/bobcard-etihad-guest), [Etihad Guest Premium product page](https://www.bobcard.co.in/credit-card-types/bobcard-etihad-guest-premium), [BOBCARD Etihad MITC 2.0, April 2026](https://media.bobcard.co.in/media/0shn4l2e/bobcard_etihad_mitc_a4-booklet_17042026.pdf), [BOBCARD MITC and revision index](https://www.bobcard.co.in/most-important-terms-and-condition), and [Etihad's BOBCARD partner benefits page](https://www.etihad.com/en-br/etihadguest/our-partners/financial/bob-cards).



### BOBCARD IRCTC Credit Card (2026-10-26)

Rebuilt IRCTC from the current BOBCARD product page and current BOBCARD MITC. Confirmed INR 500 joining fee, INR 350 annual fee, 3.5% forex fee, 3.75% monthly finance charge, 2.5%/INR 500 cash advance, RuPay network (tier unknown), and current age/residency split (salaried 21-60; self-employed 24-65; resident India). Removed unsupported launch date. The current page confirms 2 BOBCARD Reward Points per INR 100 base, 4 per INR 100 on departmental stores (capped at 1,000 per statement), and 16 or 40 per INR 100 on eligible IRCTC rail fare depending on travel-date season. Because the schema cannot express the two calendar windows, the record uses 16 as the normal-period rate and states the 40-point windows and restrictions in the accelerator notes. This avoids displaying the seasonal peak as a year-round rate.

Corrected the prior 1,000-point cap from the IRCTC train accelerator to the departmental-store accelerator. Confirmed 1 BOB Reward Point = INR 0.25 statement cashback and 4 BOB points = 1 IRCTC Travel Point; primary-cardholder, qualifying AC-class fare and journey completion restrictions apply. Added IRCTC transaction-charge cashback, railway lounges (4/year, primary cardholder), add-on cards and Smart EMI. Corrected fuel-waiver cap period to statement cycle. The page advertises zero liability for immediately reported card loss, but detailed liability conditions remain unpublished. Full current reward MCC appendix, income/score cutoffs, launch date, lounge guests/participating lounge list and the exact Visa/RuPay tier remain unknown; source notes preserve these gaps.

Primary sources: [BOBCARD IRCTC product page](https://www.bobcard.co.in/credit-card-types/irctc-credit-card), [IRCTC co-brand card page](https://contents.irctc.co.in/en/AboutLoyalty.html), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), and [BOBCARD feature/charge revision effective 1-Apr-2026](https://media.bobcard.co.in/media/nfkmkemd/revision-in-product-features-charges-wef-1st-april-26.pdf).



### BOBCARD HPCL Energie (2026-10-26)

Rebuilt HPCL Energie from the current BOBCARD product page, Jan-2026 MITC, April-2026 feature schedule and the issuer notice effective 15-Jul-2026. Corrected network Visa to RuPay and removed unsupported Visa Platinum and launch-date claims. Confirmed INR 499 joining/annual fees, INR 50,000 renewal-fee waiver in anniversary year for non-delinquent accounts, 3.5% forex, 3.75% monthly finance charge, and 2.5%/INR 500 minimum cash advance. Eligibility is resident India, salaried age 21-60 or self-employed age 24-65; numeric income/score cutoffs are not published.

Corrected the reward record to 2 points/INR 150 base; 24/INR 150 for eligible HPCL fuel, LPG and HP Pay App; and 10/INR 150 on utility/departmental-store spend. Both accelerators cap at 1,000 points per statement (the earlier record incorrectly left the latter uncapped). Each point is INR 0.25. UPI earns core points only; HP Pay wallet loads and direct debit do not get accelerated fuel rewards. Since 15-Jul-2026 fuel rewards and surcharge waiver also require an eligible HPCL merchant MID/TID. Corrected fuel-waiver cap from INR 250 monthly to INR 100 per statement. Added the 20%-off District movie benefit (25% up to INR 100, max twice monthly), four domestic lounge visits (one quarterly) gated by INR 20,000 net eligible prior-quarter spend, and primary-cardholder-only condition. The current lounge guest allowance and full eligible-MCC appendix remain unpublished or unverified. Promo ?free liters? banners were not modeled as a guaranteed amount.

Primary sources: [BOBCARD HPCL Energie product page](https://www.bobcard.co.in/credit-card-types/fuel-credit-card), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD product feature/reward revision, April 2026](https://media.bobcard.co.in/media/nfkmkemd/revision-in-product-features-charges-wef-1st-april-26.pdf), and [BOBCARD revision effective 15-Jul-2026](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf).


### BOBCARD ICSI Diamond (2026-10-26)

Rechecked ICSI Diamond against the current BOBCARD product page, the January-2026 MITC, the official universal application form, and BOBCARD's lounge criteria. Corrected the old 3.49% finance charge to 3.75%, changed the realized reward-point value from an unsupported INR 0.18 to the issuer's INR 0.25 cashback rate, replaced the unsupported 2022 launch/effective dates with unknown launch date and observation-date terms, corrected the fuel-waiver cap cycle from monthly to statement, and removed unsupported Visa Signature and guest-count claims. The application form offers both Mastercard and RuPay for this card; the single-network schema can represent only one, so the record uses RuPay as a representative value and explicitly flags the variant limitation.

The current page confirms zero joining/annual fees; 2% forex; 1 point/INR 100 base; 5 total points/INR 100 on dining, online and utility up to a 1,000-point statement cap; fuel earns no points; cashback at INR 0.25/point; a 500-point welcome reward for INR 5,000 spend within 60 days; 3,999 quarterly milestone points when spend exceeds INR 100,000 or the credit limit (whichever is higher); a 1% fuel surcharge waiver on INR 400-5,000 transactions capped at INR 250 per statement; and three domestic lounge visits per quarter. Lounge access requires INR 40,000 net eligible spend in the preceding calendar quarter from 1-Jan-2025. Current eligibility is resident India, eligible active ICSI membership, age 21-75, and minimum net annual salary/annual ITR of INR 300,000. Added FITPASS PRO for cards issued on/after 1-Aug-2026, with code within 30 days.

Unresolved: the live application network/tier, complete reward MCC exclusions, lounge guest terms and current participating-lounge list, full insurance policy exclusions/claim conditions, and numeric credit-score underwriting cutoff are not published in the product record sources. Product page states zero liability for immediately reported card loss; detailed liability terms remain to be verified.

Primary sources: [BOBCARD ICSI Diamond product page](https://www.bobcard.co.in/credit-card-types/icsi-diamond), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD universal application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [BOBCARD lounge eligibility criteria](https://media.bobcard.co.in/media/gnrf23lf/lounge-eligibility-criteria-1-1.pdf).


### BOBCARD Indian Army YODDHA (2026-10-26)

Rebuilt the card terms against the current BOBCARD product page, January-2026 MITC, April-2026 shared reward terms, lounge criteria and Amazon Prime terms. Corrected forex markup from 3.5% to 3%, monthly finance from 3.49% to 3.75%, reward-point realized value from unsupported INR 0.18 to the issuer's INR 0.25 cashback, and fuel-waiver cap period from monthly to statement. Removed unsupported 2022 launch date and RuPay Select tier. Current status is lifetime-free; cash advance remains 2.5% or INR 500 minimum.

Rewards are 2 points/INR 100 core; 10 total points/INR 100 for Departmental Stores MCC 5311, capped at 1,000 points per statement, then core rate. A material issuer-page conflict remains: current product-page marketing says department stores and movies and describes a monthly cap, while the detailed shared BOBCARD reward terms list only Departmental Stores MCC 5311 and a statement-cycle cap. The record follows the detailed MCC terms and calls out the discrepancy. Added SmartDeal portal-specific extra earn (8 points/INR 100 flights; 20 points/INR 100 hotels, through logged-in BOBCARD app/portal after journey fulfilment), UPI core-only, full Annexure 1 exclusions, two-year reward expiry and 1,000-point cashback-redemption minimum.

Benefits corrected to two domestic lounge visits per quarter after INR 20,000 net eligible spend in the prior calendar quarter (new card issue-quarter waiver; upgrades excluded); 500 welcome points for INR 5,000 spend in 60 days; 12-month Amazon Prime on INR 100,000 spend within 90 days of issuance; 1% fuel waiver on INR 400-5,000 transactions up to INR 250 per statement; and INR 20 lakh air/non-air personal accident cover. Added FITPASS PRO for primary cards issued on/after 1-Aug-2026, Smart EMI, RuPay concierge and up to three free add-on cards. Eligibility: designated Army personnel, veterans, Veer Nari and cadets, age 18-70. The dedicated application form permits Resident Indian and NRI/PIO nationality selections. Numeric income and credit-score cutoffs remain unpublished. Lounge guest policy/list and full insurance terms remain unresolved.

Primary sources: [BOBCARD Yoddha product page](https://www.bobcard.co.in/credit-card-types/indian-army-yoddha), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD shared Features and Rewards terms, April 2026](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [BOBCARD Yoddha application form](https://media.bobcard.co.in/media/5j1evkzk/bobcards-indian-army-yoddha_appl-form_21022024.pdf), [BOBCARD universal application form listing RuPay issuance](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [Amazon Prime milestone terms](https://media.bobcard.co.in/media/izzdlrcn/yoddha-amazon-prime-tc.pdf).


### BOBCARD Assam Rifles The SENTINEL (2026-10-26)

Rechecked the current BOBCARD product page, January-2026 MITC, April-2026 shared reward terms, lounge criteria, application forms and Sentinel-specific Amazon Prime conditions. Corrected forex markup from 3.5% to 3%, finance charge from 3.49% to 3.75%, realized point value from unsupported INR 0.18 to the issuer's INR 0.25 cashback, and fuel-waiver cap period from monthly to statement. Removed the unsupported 2022 launch date and RuPay Select tier. Joining and annual fees are zero; cash advance remains 2.5% or INR 500 minimum. Issuer application forms identify RuPay; no network tier is established.

Core earn is 2 points/INR 100. Current detailed BOBCARD feature terms list 10 total points/INR 100 for Departmental Stores MCC 5311, with a 1,000-point statement cap and base earn afterward. As with Yoddha, the current product page conflicts: it advertises Movies in addition to departmental stores and says the cap is monthly. The model follows the detailed feature terms and preserves this discrepancy. Added SmartDeal portal earn (8 points/INR 100 flights and 20/INR 100 hotels, only through the logged-in BOBCARD app/portal after fulfilment), UPI core-only, full shared Annexure 1 MCC exclusions, two-year points expiry and 1,000-point statement-cashback minimum.

Benefits now show two domestic lounge visits per quarter with INR 20,000 net eligible settled spend in the previous calendar quarter; the issuer waives the threshold for the card issue quarter, but not upgrades. Other confirmed benefits include 500 points for INR 5,000 spend in 60 days, 12-month Amazon Prime after INR 100,000 spend within 90 days of issuance, 1% fuel surcharge waiver on INR 400-5,000 fuel transactions capped at INR 250 per statement, INR 20 lakh air/non-air personal accident cover, FITPASS PRO for primary cards issued on/after 1-Aug-2026, Smart EMI, RuPay concierge and up to three free add-on cards. Eligibility is designated Assam Rifles personnel/veterans, age 18-70. The dedicated application form offers Resident Indian and NRI/PIO nationality choices. Numeric income and bureau-score cutoffs, lounge guest/list conditions and full insurance policy terms remain unpublished or unverified.

Primary sources: [BOBCARD Sentinel product page](https://www.bobcard.co.in/credit-card-types/assam-rifles-the-sentinel), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD shared Features and Rewards terms, April 2026](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [Sentinel application form](https://media.bobcard.co.in/media/31fguh5r/assam-rifles-the-sentinel.pdf), [universal application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [Sentinel Amazon Prime terms](https://media.bobcard.co.in/media/4wvl3vmo/sentinel-amazon-prime-tc.pdf).


### BOBCARD Indian Coast Guard RAKSHAMAH (2026-10-26)

Rechecked the current BOBCARD product page, January-2026 MITC, April-2026 shared reward terms, current lounge criteria, universal application form and Rakshamah-specific Amazon Prime terms. Corrected forex markup from 3.5% to 3%, finance charge from 3.49% to 3.75%, realized point value from unsupported INR 0.18 to the issuer's INR 0.25 cashback, and fuel-waiver cap period from monthly to statement. Removed the unsupported 2022 launch date and RuPay Select tier. Joining/annual fees are zero; cash advance is 2.5% or INR 500 minimum. Universal application materials list Rakshamah as RuPay; no separate network tier is established.

Core earn is 2 points/INR 100. Detailed BOBCARD feature terms list 10 total points/INR 100 for Departmental Stores MCC 5311, capped at 1,000 points per statement with base earn afterward. The live product page says Departmental Stores and Movies and describes a monthly cap, while the detailed terms omit Movies and specify statement cycle. The model follows detailed terms and documents the discrepancy. Added SmartDeal portal earn (8 points/INR 100 flights and 20/INR 100 hotels via logged-in BOBCARD app/portal after fulfilment), UPI core-only, shared Annexure 1 MCC exclusions, two-year points expiry and 1,000-point cashback redemption floor.

Benefits now show two domestic lounge visits per quarter after INR 20,000 net eligible settled spend in the prior calendar quarter; the threshold is waived for a newly issued card's issue quarter but not for upgrades. Other confirmed terms include 500 points on INR 5,000 spend in 60 days, 12-month Amazon Prime on INR 100,000 spend within 90 days of issuance, 1% fuel waiver on INR 400-5,000 fuel transactions capped at INR 250 per statement, INR 20 lakh personal accident cover for air/non-air accidents, FITPASS PRO for primary cards issued on/after 1-Aug-2026, Smart EMI, RuPay concierge and up to three free add-on cards. Eligibility is designated Indian Coast Guard personnel/veterans, age 18-70. Universal application form includes Resident Indian, NRI/PIO and Foreign National choices. Numeric income and bureau-score cutoffs, lounge guest/list terms and the full insurance policy remain unpublished or unverified.

Primary sources: [BOBCARD Rakshamah product page](https://www.bobcard.co.in/credit-card-types/indian-coast-guard-rakshamah), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD shared Features and Rewards terms, April 2026](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [BOBCARD lounge eligibility terms](https://media.bobcard.co.in/media/gnrf23lf/lounge-eligibility-criteria-1-1.pdf), [universal application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [Rakshamah Amazon Prime terms](https://media.bobcard.co.in/media/rngit0vy/icg-rakshamah-amazon-prime-tc.pdf).


### BOBCARD VIKRAM (2026-10-26)

Rechecked the current BOBCARD product page, January-2026 MITC, April-2026 shared reward terms, dedicated JioHotstar terms and universal application form. Corrected forex from 3.5% to 3%, finance charge from 3.49% to 3.75%, realized RP value from unsupported INR 0.18 to the issuer's INR 0.25 cashback, and fuel-waiver cap cycle from monthly to statement. Removed the unsupported 2023 launch date and RuPay Platinum tier; universal application lists Vikram under RuPay, but no tier is stated. Joining and annual fees are zero; cash advance is 2.5% or INR 500 minimum.

Core earn is 1 point/INR 100. The current page confirms 5 total points/INR 100 on Movies and Departmental Stores; detailed shared terms specify MCC 7832 and 5311 and a 1,000-point statement-cycle cap. The product page says the cap is monthly, so the record follows the detailed terms and preserves that discrepancy. After the accelerator cap, base earn applies. Added SmartDeal portal rates (8 points/INR 100 flights; 20/INR 100 hotels through the logged-in BOBCARD app/portal after fulfilment), UPI core-only, shared Annexure 1 MCC exclusions, two-year points expiry and 1,000-point cashback redemption minimum.

Benefits now capture the 3-month JioHotstar Super subscription for card activation/first transaction within 30 days (coupon code typically delivered 30-45 days after eligibility; current rupee value not established), 500 points on INR 5,000 spend within 60 days, INR 20 lakh air/non-air accident cover, 1% fuel waiver on INR 400-5,000 transactions up to INR 250 per statement, Smart EMI, up to three add-on cards, contactless payments and up to 50 days interest-free credit if the prior balance is paid in full. No product-specific lounge access is advertised. Eligibility is designated Defence Forces personnel; product page gives salaried primary age 18-60 and add-on age above 18. Numeric income and bureau-score criteria are unpublished. Residency is left unknown because the card page does not specify it and the universal application includes several nationality choices, despite generic issuer guidelines saying resident Indian. A 2026 insurance RFP lists possible additional on-duty cover for defence cards, but that proposal does not prove a current in-force policy; it is not modeled. Full insurance wording remains unverified.

Primary sources: [BOBCARD Vikram product page](https://www.bobcard.co.in/credit-card-types/vikram), [BOBCARD MITC, January 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [BOBCARD shared Features and Rewards terms, April 2026](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [Vikram JioHotstar offer terms](https://media.bobcard.co.in/media/jbtfve1d/vikram-disney-jiostar-tc.pdf), [universal application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf), and [insurance RFP listing proposed defence-card on-duty cover](https://media.bobcard.co.in/media/s40gdv2z/rfp-for-insurnace-covers-relating-to-credit-cards-pa-pi-clwi-on-duty-coverage.pdf).

### BOBCARD Indian Navy VARUNAH Premium (2026-10-26)

Rechecked the live issuer product page, January-2026 MITC, April-2026 shared reward terms, July-2026 lounge revision, shared lounge eligibility terms and card application materials. Fees are INR 2,499 joining and annual, with a joining-fee reversal after INR 25,000 eligible spend in the first 180 days and annual-fee reversal after INR 150,000 in the anniversary year; both require non-delinquent status. The January MITC confirms a 3.75% monthly finance charge and cash-advance fee of 2.5% (INR 500 minimum); forex is 2%. The issuer does not establish the card launch date or RuPay tier.

Core earn is 3 points per INR 100; eligible online, travel, dining and international spend earns 15 total points per INR 100, capped at 2,500 accelerated points per statement, then the core rate. UPI earns core only and fuel earns no points. Cashback redemption is INR 0.25 per point, with a 1,000-point statement-credit minimum and two-year expiry. Added shared SmartDeal rates (12 points per INR 100 on portal flights and 30 on portal hotels after fulfilment), the Annexure 1 MCC exclusions, and the MCC 4900 utility exception: utility earns core points but not acceleration.

Benefits include 500 welcome points after INR 5,000 spend within 60 days, Amazon Prime for 12 months after INR 100,000 spend in the first 90 days, unlimited domestic lounge access after INR 75,000 net eligible spend in the previous calendar quarter (threshold effective 15-Jul-2026), and the current fuel-waiver terms (1% on INR 400â€“5,000 fuel purchases, capped at INR 250 per statement; surcharge GST is not reversed). The page lists INR 1 crore air-accident and INR 10 lakh non-air/sea accident cover; full insurer conditions remain unverified. FITPASS PRO is limited to primary cards issued on/after 1-Aug-2026. Numeric income/score thresholds and card-specific residency criteria are unpublished or unclear; lounge guest rules and exact eligible lounge list are also unresolved. Shared lounge terms waive the threshold for the card's issue quarter, not upgrades.

Sources: [BOBCARD VARUNAH product page](https://www.bobcard.co.in/credit-card-types/indian-navy-varunah), [January-2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), [April-2026 shared reward terms](docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf), [July-2026 lounge revision](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf), [shared lounge eligibility criteria](https://media.bobcard.co.in/media/gnrf23lf/lounge-eligibility-criteria-1-1.pdf), and [universal BOBCARD application form](https://media.bobcard.co.in/media/isqiuclw/bobcards_universal-application-form_14oct2024_15k.pdf).

After this pass, `python scripts/validate.py` reports 369 cards, 33 issuers, 0 errors and 0 warnings; 853 reward rules (778 strict; 676/778 strict-ready, 87%). The numeric evidence scanner reports fees 1,023/2,457 (42%), rewards 1,000/3,050 (33%), benefits 966/3,046 (32%), and eligibility 534/557 (96%). These are field-path traceability measures, not factual accuracy scores. Dataset-wide review remains incomplete.

### AU Laksya follow-up (2026-10-26)

Reopened Laksya against the current product page, current AU Rewardz FAQ, 2026 cardholder agreement and the AU portfolio-launch announcement. Corrected the unsupported 2024-01-01 launch placeholder to 6-May-2026, the dated announcement that names Laksya in the newly launched portfolio. Replaced fee, reward and benefit effective dates that predated the card's launch with the 26-Oct-2026 verification date because exact effective dates for these current schedules are unpublished. Set Visa tier to unknown; public Laksya material describes Visa/RuPay acceptance for lounge access but does not establish the exact network variant or Visa tier issued to a given cardholder.

Corrected the fuel surcharge cap cycle from monthly to statement, matching the live page. Added direct numeric provenance for the general AU Rewardz conversion: INR 0.0025 per point outside e-vouchers and INR 0.002 per e-voucher. Added issuer-listed insurance coverage, card-liability cover, credit shield and device-protection plan, keeping limits and policy details unknown because the public product page does not state them. Also captured the zero-processing-fee Xpress EMI offer (eligible transactions from INR 2,000; up to 20 transactions may be clubbed) and contactless PIN-free payments up to INR 5,000. Contactless earn and utility/insurance/telecom rates remain documented but the calculator cannot model the channel axis or per-transaction cap exactly.

Sources: [AU Laksya product page](https://www.au.bank.in/personal-banking/credit-cards/laksya-credit-card), [AU Rewardz FAQ](https://www.au.bank.in/personal-banking/credit-cards), [AU 2026 portfolio-launch announcement](https://www.au.bank.in/pdfs/press-release/2026/AU-Small-Finance-Bank-unveils-a-curated-Credit-Cards-portfolio-aligned-with-Indias-evolving-aspirations.pdf), and [Laksya lounge terms](https://www.au.bank.in/pdf/TnC_Laksya_Lounge.pdf).


A second pass against the current product page and 30-Sep-2026 KFS filled the explicit 2.5x grocery/departmental multiplier provenance. The page confirms 2 RP/INR 100 base, 5 RP/INR 100 on grocery/departmental and contactless, grocery cap 1,000 points/statement, contactless uncapped, and zero-earn categories including BBPS, transportation and quasi-cash (kept in notes where the schema lacks a matching category). It also confirms lounge access 2/quarter after INR 50,000 spend in the previous quarter. KFS confirms 3.49% forex, 3.75% monthly finance, and 2.5% cash advance (minimum INR 500). Removed the Visa-only network and lounge route; public terms allow Visa/RuPay variants, leaving exact issued network and tier unknown.

After this follow-up, `python scripts/validate.py` reports 369 cards, 33 issuers, 0 errors and 0 warnings; 857 reward rules (782 strict; 681/782 strict-ready, 87%). Numeric evidence coverage is fees 1,081/2,483 (44%), rewards 1,033/3,066 (34%), benefits 1,025/3,056 (34%), and eligibility 538/561 (96%). These figures measure explicit numeric-field provenance, not factual accuracy; dataset-wide review remains incomplete.

### AU Ananta follow-up (2026-10-26)

Rechecked Ananta against AU's live product page, current Key Fact Statement, card-member agreement, dedicated lounge and milestone terms, and AU Rewardz FAQ. Replaced the unsupported 1-Jan-2024 launch placeholder with 6-May-2026, the issuer-announced launch date. The product page says partner offers depend on the selected network variant but does not identify the network or tier; both are now unknown. The local Ananta image was byte-identical to AU's Altura+ Visa Platinum artwork, so its image reference was removed rather than presenting the wrong card face.

Corrected the fuel-waiver cycle to statement, marked the four milestone awards repeatable once in each card-anniversary year, and added issuer-listed Xpress EMI, contactless and lifetime-free add-on-card benefits. The Ananta page lists card-liability, air-accident, purchase-protection, baggage-loss/delay, flight-delay, passport-loss, credit-shield and device-protection covers; those are now represented individually with unknown limits and conditions where the issuer has not published Ananta-specific terms. Added explicit provenance paths for the unresolved reward-unit values. AU's FAQ says 0.25 paise per point for catalogue and 0.20 paise for e-vouchers, while Ananta's milestone table states rupee values implying INR 0.25 per point, a 100x conflict. No generic unit value is applied. BBPS, transportation and quasi-cash exclusions remain in the evidence notes because the schema has no dedicated categories for them.

The same duplicate Altura+ artwork was referenced by AU Altura, Laksya, NOMO, SPONT, Vetta, Xcite and Zenith+; those seven inaccurate image references were also cleared. A nullable network value is now supported in the card schema and site types so a network the issuer has not specified can remain unknown. Prebuild also exposed and this pass fixed duplicate YAML keys in AU Zenith and IDFC FIRST IndiGo, and unquoted numeric MCC values in seven BOBCARD records.

Sources: [AU Ananta product page](https://www.au.bank.in/personal-banking/credit-cards/ananta-credit-card), [AU portfolio launch announcement](https://www.au.bank.in/pdfs/press-release/2026/AU-Small-Finance-Bank-unveils-a-curated-Credit-Cards-portfolio-aligned-with-Indias-evolving-aspirations.pdf), [AU Key Fact Statement, 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [AU card-member agreement](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), [Ananta milestone terms](https://www.au.bank.in/pdf/Ananta_Milestone-Benefit.pdf), [Ananta lounge terms](https://www.au.bank.in/pdf/TnC_Ananta_Lounge.pdf), [AU Rewardz FAQ](https://www.au.bank.in/personal-banking/credit-cards), and [AU insurance terms](https://www.au.bank.in/pdf/credit-card/insurance-terms-and-conditions.pdf).

After this Zenith follow-up, `python scripts/validate.py` reports 369 cards and 33 issuers with no errors or warnings; 855 reward rules (780 strict; 679/780 strict-ready, 87%). Numeric evidence coverage is fees 1,023/2,457 (42%), rewards 1,002/3,061 (33%), benefits 981/3,050 (32%), and eligibility 534/557 (96%). These figures measure structure and traceability, not dataset-wide factual accuracy; review remains in progress.

### AU Zenith reward follow-up (2026-10-26)

Rechecked Zenith reward details against AU's current card-member agreement and its Zenith-specific 2024 reward revision. Removed a duplicate YAML `accelerated` key and corrected source metadata that claimed redemption fields not present in the record. Added the structured ordinary-catalogue and e-voucher values, 200-point minimum, and INR 99 plus GST successful-redemption fee. Kept Zenith's ordinary base and dining/grocery earn rates unknown because the live product page does not publish numeric rates.

The current 24 March 2026 agreement confirms a 25,000-point statement-cycle overall cap, a 5,000-point dining cap (MCCs 5811, 5812, 5813, 5814), no points on rent, education/government, BBPS transactions done on AU 0101, EMI, fuel, cash withdrawal or quasi-cash, and 1 point per INR 100 on utility/telecom (MCCs 4812, 4814, 4899, 4900), maximum 100 points per transaction. The 1 March 2024 Zenith-specific revision states 1 point per INR 100 for insurance MCCs 5960 and 6300. AU's current Zenith page still advertises the Birthday Bonus, while that revision specifies 2,500 points credited on the birthday date; the 2026 agreement and product page do not restate the amount, so present-day quantity/detailed eligibility remain unconfirmed. There is no separate category-cycle cap for insurance/utility stated in the current agreement, so only the card-wide cap is modeled.

Sources: [AU card-member agreement, 24 March 2026](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), [AU Zenith reward revision, effective 1 April 2024](https://www.au.bank.in/tnc-of-cc-revision-of-au-small-finance-bank-credit-card-usage-terms-condition_1st_march_2024.pdf), [AU Rewardz FAQ](https://www.au.bank.in/personal-banking/credit-cards), [AU Zenith product page](https://www.au.bank.in/personal-banking/credit-cards/zenith-credit-card).

### AU Tejas follow-up (2026-10-26)

Rechecked Tejas against AU's current product FAQ, 30 Sep 2026 KFS, 24 Mar 2026 card-member agreement and merchant-specific offer terms. Corrected the annual fuel-waiver cap from monthly to statement cycle; added the 25,000-point statement reward cap and the utility/telecom earn rule (1 point/INR 100, maximum 100 points per transaction). Removed wallet-load and road-fee exclusions not supported by the current Tejas terms; retained the card-specific exclusions and documented the schema gap for BBPS/transportation. The current card page lists BBPS as excluded, while the agreement explicitly applies the general BBPS exclusion to AU 0101 transactions; channel scope remains unclear.

Structured AU Rewardz catalog and e-voucher conversion separately (INR 0.0025 and INR 0.002 per point), with the 200-point minimum and INR 99 plus GST successful-redemption fee. Cleared the unsupported `unit_value_inr_realized` value. Split the mutually exclusive 2,000-point and INR 500 voucher welcome options, and added their paid-fee, activation, first-transaction and 6-month claim conditions. Added the advertised Card Liability Cover, Credit Shield, Device Protection Plan, Xpress EMI, contactless and add-on-card benefits while keeping unpublished insurance terms unknown.

Separated the five partner offers because the three partner-app discounts and two app-based statement-cashback offers have different timing. District, Amazon Fresh/Now and Zomato specify once per card per month; cab bookings and AU 0101 bill payments cap at INR 50 per card per statement cycle. Updated transaction thresholds, eligible merchants/channels, offer codes/BIN caveats, MCC 4121 for cabs, and cashback posting windows from AU's offer PDFs. Removed the unsupported 1 Jan 2024 launch date and Visa Platinum network/tier claims; no exact launch date or issued network variant is established by the current Tejas page/card image.

Sources: [AU Tejas product page](https://www.au.bank.in/personal-banking/credit-cards/tejas-credit-card), [AU KFS, version 1.9 (30 Sep 2026)](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [AU card-member agreement (24 Mar 2026)](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), [Tejas welcome terms](https://www.au.bank.in/pdf/TnC-TEJAS_Welcome-Benefit.pdf), [District offer terms](https://www.au.bank.in/pdf/District-by-Zomato-AU-Tejas-Credit-Card.pdf), [Amazon Fresh/Now offer terms](https://www.au.bank.in/pdf/Amazon-FreshNow-AU-Tejas-Credit-Card.pdf), [Zomato offer terms](https://www.au.bank.in/pdf/Zomato-AU-Tejas-Credit-Card.pdf), [cab offer terms](https://www.au.bank.in/pdf/Cab-Services-AU-Tejas-Credit-Card.pdf), and [AU 0101 bill-payment offer terms](https://www.au.bank.in/pdf/Bill-Payments-AU-Tejas-Credit-Card.pdf).

After this Tejas follow-up, `python scripts/validate.py` reports 369 cards and 33 issuers with no errors or warnings; 856 reward rules (781 strict; 680/781 strict-ready, 87%). Numeric evidence coverage is fees 1,029/2,459 (42%), rewards 1,021/3,067 (33%), benefits 983/3,051 (32%), and eligibility 534/557 (96%). Site schema validation passes for 412 files, prebuild writes 369 records, and TypeScript typecheck passes. These are structure/provenance indicators, not factual accuracy scores; full library source review remains incomplete.



### AU CheQ Visa and RuPay follow-up (2026-10-26)

Rechecked AU's current CheQ product page, the current CheQ reward PDF, CheQ's card terms, and AU's dated launch announcement. Corrected the unsupported 1-Jan-2024 launch placeholder in both network records to 15-Apr-2026, the issuer-announced launch date. Corrected the fuel-surcharge waiver cap cycle from monthly to statement/billing cycle and added that cycle to the explicit verified field paths: CheQ's terms specify 1% on fuel transactions of INR 500-5,000, capped at INR 150 per billing cycle per card.

The current AU product page and CheQ card terms state that the standard Visa and RuPay cards are lifetime free, with a one-time INR 999 plus tax LED Visa option. The dated launch release instead announced INR 499 annual fee reversible after INR 300,000 annual spend, so the current terms are modeled and the conflicting launch-era fee is retained as history; the date of that fee change is not published. The 12,000-point accelerated cap, category and network rules, INR 200 transaction threshold, MCC exclusions, point redemption conversions, welcome benefit, and eligibility ages were checked in current issuer/partner documents; the merchant MID list remains dynamic and the model still cannot fully scope RuPay base exclusions by channel.

Neither current issuer source publishes a Visa or RuPay network tier, so both `network_tier` values are now null. The card supports two point-redemption values: INR 0.50 per point for flights/hotels and gift cards, and INR 0.25 for bill payments; the latter is used as the conservative realized value while the former remains the best-case value. CheQ's card terms do not mention a CheQ Points redemption fee, while the AU KFS lists INR 99 plus GST per successful reward-point redemption; applicability to CheQ's distinct point currency is unresolved, so the data no longer claims a fee waiver.

Sources: [AU CheQ product page](https://www.au.bank.in/personal-banking/credit-cards/cheq-au-credit-card), [AU/CheQ reward terms PDF](https://www.au.bank.in/pdf/credit-card/CheQ-Rewards-TnC.pdf), [CheQ AU card terms](https://cheq.one/legal/credit-card-terms-and-conditions), and [AU/CheQ launch announcement, 15 April 2026](https://www.au.bank.in/pdfs/press-release/2026/Press-Release-CheQ-and-AU-Small-Finance-Bank-launch-Indias-First-Co-branded-LED-Credit-Card.pdf).

After this follow-up, validation reports 369 cards and 33 issuers with no errors or warnings; 856 reward rules (781 strict; 680/781 strict-ready, 87%). Numeric evidence coverage remains fees 1,029/2,459 (42%), rewards 1,021/3,067 (33%), benefits 983/3,051 (32%), and eligibility 534/557 (96%). These are structure/provenance indicators, not factual accuracy scores; library-wide review remains incomplete.


### Bandhan Lumina unresolved-field follow-up (2026-10-26)

Applied conservative handling to the open P12 fields. The issuer page and August 2026 MITC available in the audit trail do not identify a Mastercard tier or a dated launch, so both are now null rather than carrying unverified World Elite and 7-Sep-2026 values. The issuer's published income range is above INR 18 lakh, but the source does not specify period or gross/net basis; the annual income threshold remains null and the note no longer implies an annualized value.

The official Bandhan Delights portal currently lists INR 100 e-vouchers for 400 Delight Points (INR 0.25/point), but the Lumina value chart still does not establish that one fixed value applies across every redemption or card benefit. Kept INR 0.25 as a best-case provisional value and cleared the conservative realized value to null. The current card product value chart says the fuel waiver cap is INR 1,000 per statement cycle, while the dated 19-Aug-2026 MITC says INR 500; retained INR 500 from the formal terms and left the conflict open pending issuer clarification. Sibling Bandhan records remain to be reviewed.

Source: [Bandhan Delights redemption portal](https://delights.bandhan.bank.in/), [Bandhan Lumina product page](https://creditcards.bandhan.bank.in/card-details/Lumina/), and [Bandhan MITC dated 19-Aug-2026](https://creditcards.bandhan.bank.in/landing/uploads/Credit_Card_MITC_English_19082026_2b514a85e4.pdf).


### Bandhan Flare and Ignite sibling-card follow-up (2026-10-26)

Reviewed both current card pages, their interactive issuer fee/eligibility/value panels, and the live Bandhan Delights catalogue. The old records cited Bandhan's general card landing page while carrying 2023 dates, Visa network tiers, and several stale benefits. Current product pages do not publish the payment network or tier, so those fields are now unknown; the launch dates are also unknown. Current item effective dates are not stated by the issuer. The required `effective_from` date fields retain 7-Sep-2026 as a provisional current-portfolio anchor and must not be represented as a confirmed launch or terms-effective date.

For Flare, corrected the annual renewal waiver from INR 3 lakh to INR 6 lakh; retained the issuer-listed INR 2,499 joining/renewal fees, 1.99% forex and 3.5% (minimum INR 500) cash-withdrawal fee. The fee panel specifies monthly finance charge of 2% for existing customers with CASA and 3.5% for new customers; the record uses 3.5% and documents the lower relationship-based rate. Added the panel's over-limit and late-payment charges. Replaced the old unsupported welcome condition with INR 2,000 Amazon Pay voucher after INR 10,000 spend within 30 days; recorded 4 domestic and 1 international lounge visit per calendar quarter, 25% BookMyShow discount up to INR 500/month, INR 500 statement-cycle fuel-waiver cap, 5,000-point monthly spend milestone at INR 75,000, first-EMI cashback up to INR 750, and four golf lessons per calendar year. The value chart assumes travel spend of INR 25,000/month for additional accelerated value, but does not publish sufficient card-specific terms to model that stream. The former lounge network mapping, concierge claim, fuel transaction bounds, and stale spend exclusions are removed or left unknown.

For Ignite, confirmed nil joining fee, INR 999 renewal fee with INR 1 lakh annual waiver, 3.5% forex and monthly finance charge, and 3.5% cash-withdrawal fee (minimum INR 500). Added fee-panel over-limit and late-payment amounts. Confirmed 4 reward points per INR 200 base and 8 per INR 200 for grocery/travel; removed the unsupported 1,000-point monthly cap and prior unverified spend/MCC exclusions. The issuer's monthly 1,200-point milestone at INR 30,000 and INR 250 statement-cycle fuel-waiver cap are now recorded, along with quarterly domestic/international lounge visits, 15% EazyDiner discount capped at INR 500/month, and first-EMI cashback capped at INR 500. The value chart has an activation-benefit value of INR 250 without stating point quantity or eligibility conditions, and assumes INR 20,000/month grocery/travel spend; these claims remain unmodeled pending current card-specific terms.

Both eligibility panels state age 21â€“65 and resident in India. Flare's indicative income is above INR 12 lakh and Ignite's above INR 6 lakh, but neither panel gives the period or gross/net basis; annual income thresholds remain null. The Delights catalogue supports INR 0.25 per point, while no fixed realized value is assigned. Detailed reward exclusions, exact network, date, and value-chart conditions remain open.

Sources: [Bandhan Flare product page](https://creditcards.bandhan.bank.in/card-details/Flare/), [Bandhan Ignite product page](https://creditcards.bandhan.bank.in/card-details/Ignite/), and [Bandhan Delights redemption portal](https://delights.bandhan.bank.in/).

After the sibling-card reconciliation, validation reports 369 cards and 33 issuers with no errors or warnings. Numeric provenance coverage is fees 1,067/2,483 (43%), rewards 1,026/3,063 (33%), benefits 1,007/3,056 (33%), and eligibility 538/561 (96%). These figures measure source-path coverage, not truth or full review completion; the dataset-wide audit remains in progress.

### IndusInd EazyDiner Platinum review (2026-10-26)

Rechecked the current IndusInd EazyDiner Platinum page, the consolidated 13-Oct-2026 MITC, its card-specific launch release, and issuer offer terms. Corrected the record's payment-network field to unknown because the product is offered on both Visa and RuPay while the scalar schema cannot represent both; removed the unsupported Mastercard Platinum tier. Replaced the unsupported 2022 launch placeholder with the dated 16-Jan-2024 Platinum launch. The official page identifies Visa and RuPay variants; the current RuPay variant was announced in August 2026. No card network tier is published. The `effective_from` dates in the data remain provisional anchors because current fee and reward terms do not publish their own effective dates.

The current MITC confirms nil joining and annual fees, 3.83% monthly finance charge, 3.5% forex markup, 2.5% cash-advance fee (minimum INR 300), 2.5% over-limit fee (minimum INR 500), updated late-payment slabs, 2% DCC fee, 1% rent fee, fuel transaction fee above INR 30,000/statement, and no reward-redemption fee. It also explicitly says Priority Pass is unavailable; removed the old four annual lounge visits.

Replaced stale reward modeling with 2 Reward Points per INR 100 (INR 0.20 each), reduced 0.7-point earn per INR 100 on insurance/rent/utility/government, and zero points on fuel. Removed unsupported wallet-load/EMI exclusions and MCC 6513. The separate 2X EazyPoints claim remains unmodeled because the issuer does not publish an earn conversion basis alongside the reward-point schedule. Points are redeemed in the EazyDiner App/PayEazy; no cash or statement-credit route is stated. Current card-specific exclusions beyond the listed categories need further terms review.

Replaced the stale paid-fee welcome benefit with 3 months' EazyDiner Prime membership (issuer-stated value INR 1,095) and 500 welcome EazyPoints (unvalued). Added sourced 2,000 Reward Points for INR 30,000 spend every 90 days excluding dining, and Prime renewal after INR 30,000 eligible settled spend in each 90-day period. Recorded Prime's 25%-50% restaurant discount range, PayEazy's additional 20% discount capped at INR 500 and three uses/calendar month, the monthly BookMyShow BOGO offer, and Total Protect coverage description. Corrected the fuel waiver to 1%, removed unsupported INR 400-4,000 transaction bounds, and left the issuer's unspecified monthly waiver cap unknown; GST on surcharge remains payable. Exact insurance policy conditions, app-offer exceptions, and fuel waiver cap remain unresolved.

Sources: [IndusInd EazyDiner Platinum card page](https://www.indusind.bank.in/in/en/personal/cards/credit-card/eazydiner-platinum-credit-card.html), [consolidated MITC dated 13-Oct-2026](https://www.indusind.bank.in/content/dam/indusind-corporate/credit-cards/MITC_Premium.pdf), [card launch release dated 16-Jan-2024](https://www.indusind.bank.in/iblogs/pressrelease/indusind-bank-and-eazydiner-collaboratively-launch-the-eazydiner-indusind-bank-platinum-credit-card-to-redefine-dining-experience-for-customers/), [RuPay variant announcement](https://www.indusind.bank.in/in/en/about-us/mediabrand/FY/2026-2027/August/eazydiner-and-indusInd-bank-launch-a-lifetime-free-credit-card.html), [PayEazy offer terms](https://www.indusind.bank.in/in/en/personal/tnc-extra-20-off.html), [Prime renewal terms](https://www.indusind.bank.in/in/en/personal/tnc-renewal.html), [BookMyShow terms](https://www.indusind.bank.in/in/en/personal/offer-tnc/bookmyshow-tnc.html), and [fuel waiver terms](https://www.indusind.bank.in/in/en/personal/tnc-petrol-surcharge-waiver.html).

After this pass, validation reports 369 cards and 33 issuers with no errors or warnings; 857 reward rules (782 strict; 681/782 strict-ready, 87%). Numeric source-path coverage is fees 1,071/2,483 (43%), rewards 1,027/3,065 (34%), benefits 1,015/3,056 (33%), and eligibility 538/561 (96%). These are provenance coverage counts, not factual-confidence scores; library-wide review remains in progress.
### Kotak White Reserve follow-up (2026-10-26)

Refreshed `data/cards/kotak/white-reserve.yaml` against the [current White Reserve product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card.html), [White Pass page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/whitepass.html), [lounge terms](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/lounge-program.html), [golf terms](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/golf.html), [Club Marriott terms](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/club-marriott.html), [concierge terms](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/concierge.html), and [White Reserve KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-white-reserve.pdf). Removed unsupported flat and international White Pass earning, Mastercard World/network assertions, launch date, and air-accident insurance amount. The current product page confirms a RuPay variant is available on request; the scalar network field is therefore left unknown.

The dedicated White Pass page's live ladder is recorded provisionally: INR 3L/6L/10L/15L/20L/30L/40L/50L/75L/1Cr thresholds award 5k/6k/9k/10k/12k/24k/26k/28k/63k/67k additional points, respectively; settled anniversary-year spend, 250k annual ceiling, INR 1 catalog value and INR 0.70 cashback value are documented. Kotak's general cardholder terms publish a conflicting ladder (3L/10L/20L before the common later tiers) and 90-days-after-anniversary expiry, while the dedicated page says 15 months from credit. The effective date of the page terms is unpublished; issuer clarification remains open.

The 12-Mar-2026 KFS supports INR 12,500 joining/annual fees, INR 10L annual fee waiver, 2% forex, 3.5% monthly finance charge and 2.5% (minimum INR 500) cash advance charge. KFS and product/fees pages conflict on fuel-waiver cap cycle (anniversary year vs calendar year); record follows the KFS. Other KFS fee details are retained in source notes because the schema has no corresponding fields. Product and feature pages support unlimited primary/add-on domestic and Priority Pass international lounges, two monthly primary-cardholder golf rounds, concierge and Club Marriott. Lounge guest/validation charges and an October notice about charges after complimentary visits are ambiguous against the advertised unlimited visits; guest entitlements remain unresolved. Club Marriott renewal from 1-Sep-2026 requires INR 6L prior anniversary-year spend. No current insurance certificate or card-specific eligibility criteria were found, so those numeric claims remain absent/unknown.

Validation: `scripts/validate.py` passes for 369 cards / 33 issuers with no warnings. Numeric evidence path coverage now reads fees 1,074/2,483 (43%), rewards 1,028/3,066 (34%), benefits 1,020/3,055 (33%), eligibility 538/561 (96%). These are provenance-path coverage counts, not factual confidence scores; corpus audit remains open.
### AU NOMO follow-up (2026-10-26)

Reviewed `data/cards/au/nomo.yaml` against AU's [current NOMO card page](https://www.au.bank.in/personal-banking/credit-cards/nomo-credit-card), [10-Apr-2026 airport lounge terms](https://www.au.bank.in/pdf/zenith-credit-card/revision-of-usage-terms-and-conditions_jan_25-4.pdf), [railway lounge terms (04-Oct-2024)](https://www.au.bank.in/pdfs/nomo-credit-card/Railway%20Lounges.pdf), [current MITC updated 30-Sep-2026](https://www.au.bank.in/credit-cards/mitc(with-schedule-of-charges).pdf), and [AU launch release (23-Apr-2024)](https://www.au.bank.in/content/dam/aubank/in/en/pdfs/press-release/2024/au-small-finance-bank-launches-atm-insurance-au-spont-rupay--secured-credit-card-nomo-au-0101-business-app-and-au0101-version-20---april-23-2024.pdf).

Corrected the unsupported 2024-01-01 launch claim to the documented 23-Apr-2024 launch date; confirmed Visa network from the launch release and removed unsupported Visa tier. Effective dates were changed from placeholder 2024-01-01 to the 26-Oct-2026 review snapshot because issuer material does not publish complete effective dates; the domestic lounge term has a specific effective date of 10-Apr-2026. Confirmed base earn (2 points/INR 100 retail; 1 point/INR 100 utility and insurance), 5,000-point statement cap, welcome award and quarterly milestone. Numeric evidence paths were added for the reward cap and zero complimentary lounge guests.

Current terms confirm two domestic airport visits per calendar quarter after INR 50,000 net retail spend in the preceding calendar quarter, primary cardholder only. AU's page FAQ still shows the superseded INR 20,000 gate. Railway access is two visits per quarter; the linked terms state INR 2 non-refundable validation and chargeable guests. A conflicting point value remains unresolved: card-page FAQ says INR 0.25 per point, while AU's generic Rewardz FAQ says 0.25 paise; INR redemption fields remain null. Fuel cap also conflicts: NOMO card page says INR 100/month, while the newer 30-Sep-2026 general MITC lists NOMO in an INR 150/month group. The card-specific value remains in the record with the conflict documented. The reward schema cannot represent calendar-quarter trigger_window, so the exact quarter stays in cycle/text and the generic trigger field remains an approximation needing schema support.

### AU Paytm follow-up (2026-10-26)

Reviewed `data/cards/au/paytm.yaml` against the [current AU Paytm card page](https://www.au.bank.in/personal-banking/credit-cards/paytm-au-credit-card) and [30-Sep-2026 AU KFS/MITC](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf). Filled numeric evidence paths for the KFS-backed 3.75% monthly finance charge, 2.5% cash advance fee (minimum INR 500), and 1% fuel waiver on INR 400â€“5,000 transactions capped at INR 100 per statement month. This resolves the record's missing fuel-waiver cap; the product page advertised 1% but omitted the range/cap. Current issuer page confirms lifetime-free fees, 5% Paytm app rewards, up to 2% Paytm UPI rewards, point redemption values (INR 1 for Paytm Gold, INR 0.50 elsewhere), age bands, and resident-Indian eligibility.

Unsupported 2024-01-01 launch/effective-date placeholders were removed: launch date is unknown, and 26-Oct-2026 is used as the review snapshot for current fee/reward/benefit records because full issuer effective dates are unpublished. Visa network tier is left unknown. Paytm-specific forex markup is not present in the current KFS markup table and remains null. Lounge benefits are advertised for the cardholder and companions on Paytm Travel, but visit count, booking gate and companion limit remain unpublished. Ordinary base earn and exact merchant eligibility/caps for app/UPI reward rates also remain unresolved; no base rate was inferred from the marketing percentages.

### AU Prathama current-terms follow-up (2026-10-26)

Rechecked `data/cards/au/prathama.yaml` against the [current Prathama product page](https://www.au.bank.in/personal-banking/credit-cards/prathama-credit-card), [AU KFS version 1.9 dated 30-Sep-2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [current AU Card Member Agreement](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), and [AU's published Rewardz point values](https://www.au.bank.in/personal-banking/credit-cards). Added source paths for 3.49% forex, 3.75% monthly finance charge, 2.5% cash advance fee/INR 500 minimum, and the 2x contactless multiplier. The product page confirms INR 100 joining/annual fees, no joining-fee waiver, INR 75,000 anniversary-year renewal waiver, 1 point/INR 100 other eligible spend, 2 points/INR 100 contactless, INR 5,000 statement-cycle threshold, no welcome benefit, 500-point SI setup bonus once per merchant, and INR 100 monthly fuel waiver on INR 400â€“5,000 transactions.

Corrected the card-member agreement reference from section 22.5.2 to 23.5.2. The current agreement sets a 1,000-point maximum across all earn categories per statement cycle; the data now represents that as `reward_cap`, rather than incorrectly scoping it to contactless. Removed wallet-load and insurance-premium exclusions because the current card page/agreement do not establish these as Prathama exclusions. The threshold reward/contactless overlap remains unspecified and is not added as a second estimated accelerator. Unpublished effective dates and network tier are left unknown; the old 2024-01-01 launch/effective-date placeholders are removed, with 26-Oct-2026 used as a current review snapshot. Validation passes for 369 cards / 33 issuers, no warnings.

### AU Vetta follow-up (2026-10-26)

Re-reviewed `data/cards/au/vetta.yaml` against the [current Vetta product page](https://www.au.bank.in/personal-banking/credit-cards/vetta-credit-card), [30-Sep-2026 KFS/MITC](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [current Card Member Agreement](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), and [AU insurance terms](https://www.au.bank.in/pdf/credit-card/insurance-terms-and-conditions.pdf).

Updated current fees to INR 2,999 joining/annual, 3.49% forex, 3.75% monthly finance charge, and 2.5% cash advance (minimum INR 500); modeled the INR 40,000 first-year waiver within 90 days in notes and the INR 150,000 prior-anniversary-year renewal waiver structurally. Current agreement section 23.5 confirms the 25,000-point statement-cycle cap for Vetta; sections 23.5.1 and 23.6 list reward exclusions. The file records rent, education/government, EMI, fuel and cash advance exclusions; BBPS and quasi-cash remain documented in the cap note because the current schema exclusion vocabulary is not modeled there. Utility/telecom earn (1 point per INR 100, at most 100 points per transaction) is retained in the source note because the published card page does not expose Vetta's underlying base/category schedule.

Corrected lounge access to one domestic visit per calendar quarter after INR 50,000 spend in that same quarter (term effective 10-Apr-2026) and four international visits/year (one per quarter); Priority Pass use in India is chargeable. Railway lounge access is two visits per calendar quarter, shared with add-on cardholders. Added explicit numeric provenance for the domestic threshold, birthday award (1,000 points), INR 50 lakh air-accident cover, and fuel waiver. Generic insurance conditions require an active card and an airline ticket purchased with an AU card; primary-cardholder-only and policy exclusions apply. The current page's card-liability statement is recorded without inventing an insurance limit.

Removed the unsupported 2022-04-01 launch date; exact Vetta launch date remains unknown. `network` and `network_tier` are null because the issuer page advertises both Visa and RuPay Vetta offers and does not identify one scalar network/tier for this record. Base/category earn remains unknown despite the marketing ceiling of up to 4 points per INR 100; milestone thresholds/awards beyond the birthday benefit are advertised but unpublished in accessible page text. Schema requires integer `spend_inr` for milestone entries, so the birthday event uses `0` only as a schema sentinel; it does not mean an issuer-defined spend threshold. The numeric audit intentionally leaves this path uncovered. Effective dates for complete fee/reward/benefit schedules are represented by the 26-Oct-2026 review snapshot because the issuer does not publish one complete effective date.

Validation: `scripts/validate.py` passes for 369 cards / 33 issuers with no errors or warnings (857 reward rules; 782 strict; 681/782 strict-ready). Numeric evidence-path coverage is fees 1,084/2,483 (44%), rewards 1,036/3,066 (34%), benefits 1,029/3,058 (34%), and eligibility 538/561 (96%). These counts measure traceability, not factual accuracy; dataset-wide review remains open.

### AU Xcite ACE follow-up (2026-10-26)

Re-reviewed `data/cards/au/xcite-ace.yaml` against the [current Xcite ACE product page](https://www.au.bank.in/personal-banking/credit-cards/swipeup-program/xcite-ace-credit-card), [30-Sep-2026 KFS/MITC](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [1-May-2026 railway lounge terms](https://www.au.bank.in/pdf/railway-lounges.pdf), and the [linked insurance terms](https://www.au.bank.in/pdf/xcite-ultra-credit-card/card-liability-insurance-tnc.pdf).

Confirmed INR 749 joining/annual fees, INR 200,000 prior-anniversary-year renewal waiver, 3.49% forex, 3.75% monthly finance, and 2.5% cash advance (minimum INR 500). Removed the unsubstantiated 2024-01-01 launch date and Visa/Platinum scalar fields. Current page confirms cashback up to 3% on milestones but does not publish their cadence, qualifying spend, rate schedule, exclusions, or redemption mechanics; base earn/value and statement-credit claims are now unknown. Removed unverified wallet, rent, insurance and EMI reward exclusions and MCC 6513.

Updated domestic lounge access to two visits per quarter after INR 50,000 spend in the previous quarter; guest entitlements remain unknown. Added eight railway visits per year (maximum two per quarter), INR 2 validation fee, and chargeable guest terms. Recorded Xpress EMI eligibility (individual transactions INR 500+, minimum combined total INR 2,000, up to 20 transactions) and concierge/device protection details. Added current page limits of INR 50 lakh air-accident cover, INR 2 lakh credit shield and INR 25,000 purchase protection. Lost-card, baggage, flight-delay, passport-loss and hijack covers are advertised but limits are unpublished; the linked detailed insurance PDF is dated 16-Apr-2021, so current policy applicability remains unresolved.

The product page specifies a 1% fuel surcharge waiver on INR 400-5,000 transactions, capped at INR 100 per statement cycle effective 1-Oct-2026. The KFS dated 30-Sep-2026 still lists INR 200 for SwipeUp-Xcite. Kept INR 100 because the product-specific issuer page dates the later change. Eligibility ages and resident-Indian requirement are confirmed. Validation passes for 369 cards / 33 issuers with no errors or warnings. Numeric evidence paths are fees 1,084/2,483 (44%), rewards 1,034/3,063 (34%), benefits 1,033/3,060 (34%), and eligibility 538/561 (96%). Counts measure traceability, not factual accuracy; dataset-wide review remains open.
### AU Xcite Ultra follow-up (2026-10-26)

Re-reviewed `data/cards/au/xcite-ultra.yaml` against the [current Xcite Ultra page](https://www.au.bank.in/personal-banking/credit-cards/swipeup-program/xcite-ultra-credit-card), the [30-Sep-2026 Key Fact Statement](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), the [24-Mar-2026 cardmember agreement](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf), the [10-Apr-2026 lounge terms](https://www.au.bank.in/pdf/zenith-credit-card/revision-of-usage-terms-and-conditions_jan_25-4.pdf), and the [linked insurance PDF](https://www.au.bank.in/content/dam/aubank/in/en/pdf/xcite-ultra-credit-card/card-liability-insurance-tnc.pdf).

Confirmed joining/annual fee INR 749, INR 200,000 prior-anniversary-year renewal waiver, 3.49% forex, 3.75% monthly finance and 2.5% cash advance (minimum INR 500). The current product page confirms 500 bonus points on INR 5,000 retail spend on calendar-month days 1-5; 5,000 points on INR 250,000 anniversary-year retail spend; 2 domestic lounge visits per quarter; 8 railway lounge visits/year (max 2/quarter); and fuel waiver of 1% on INR 400-5,000 transactions capped INR 100 per statement cycle. Current lounge terms add a INR 50,000 net retail spend gate in a calendar quarter for visits in the next quarter, primary cardholder only. Updated the fuel cap cycle from monthly to statement and concierge from false to true. Added product-page contactless, EMI, device protection, add-on and curated-offer details.

Removed unsupported Visa/Signature and 2024 launch claims. Current cardmember agreement confirms a 25,000 Reward Point statement-cycle cap; rent, education, government and BBPS exclusions; no points on EMI, fuel, cash withdrawal, quasi-cash, fees and other charges. Wallet-load and insurance exclusions were unsupported for this variant and removed. AU's generic page states ordinary point face value of 0.25 paise and e-voucher value of 0.20 paise, so catalog redemption is left unpriced; Xcite Ultra base and selected-category rates remain unpublished in accessible page text.

The current card-specific page section says INR 20 lakh air-accident cover, while its generic page footer says INR 50 lakh. Kept the card-specific figure and documented the conflict. The page footer also lists credit shield, purchase protection, lost-card and travel covers; current detailed limits/terms are not established. The linked insurance PDF is dated 16-Apr-2021, so applicability remains unresolved. Eligibility page confirms salaried ages 21-60, self-employed 25-65, add-on cardholders over 18 and resident-Indian status; income and bureau-score thresholds remain unpublished. No primary source establishes a launch date or network tier, so those fields are null.

Validation passes for 369 cards / 33 issuers with no errors or warnings. Numeric evidence-path coverage is fees 1,084/2,483 (44%), rewards 1,033/3,062 (34%), benefits 1,040/3,061 (34%), eligibility 538/561 (96%). Coverage measures traceability, not factual accuracy; dataset-wide review remains open.
### AU Xcite follow-up (2026-10-26)

Re-reviewed `data/cards/au/xcite.yaml` against AU's [current Xcite page](https://www.au.bank.in/personal-banking/credit-cards/swipeup-program/xcite-credit-card), the [30-Sep-2026 KFS](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), and the [current cardmember agreement](https://www.au.bank.in/credit-cards/credit-card-member-agreement.pdf).

KFS confirms INR 249 joining/annual fees, 3.49% forex, 3.75% monthly finance and 2.5% cash advance (minimum INR 500); the product page confirms INR 100,000 renewal-waiver spend. Corrected unsupported Visa/Platinum and 2024 launch claims to unknown. Current page advertises 2X Reward Points on retail spend days 1-5 monthly, but base/category rate is unpublished, so no numerical earn rule can be calculated. Current agreement supports the 25,000-point statement cap and excludes rent, education, government and BBPS; EMI, fuel, cash withdrawal, quasi-cash, fees and charges also earn no points. Removed unsupported wallet-load and insurance exclusions. AU Rewardz ordinary point value is 0.25 paise and e-voucher value 0.20 paise; catalog redemption value is left unknown.

Current page lists no airport lounge access or concierge. It confirms 8 railway lounge visits/year (max 2/calendar quarter), a 1% fuel waiver on INR 400-5,000 transactions capped at INR 100/statement cycle, complimentary device protection, card-liability cover, contactless payments up to INR 5,000, Xpress EMI with INR 2,000 minimum aggregate and up to 20 transactions, and lifetime-free add-on cards. Detailed card-liability conditions link to a PDF last updated 16-Apr-2021. Eligibility ages are salaried 21-60 and self-employed 25-65; add-on cardholders over 18; resident Indian. Income, score, network and exact launch date remain unpublished.

Validation passes for 369 cards / 33 issuers with no errors or warnings (857 reward rules; 782 strict; 681/782 strict-ready). Numeric evidence-path coverage is fees 1,084/2,483 (44%), rewards 1,032/3,061 (34%), benefits 1,040/3,061 (34%), eligibility 538/561 (96%). Coverage measures traceability, not factual accuracy; dataset-wide review remains open.
### IndusInd EazyDiner Platinum follow-up (2026-10-26)

Rechecked `data/cards/indusind/eazydiner-platinum.yaml` against the [current EazyDiner Platinum page](https://www.indusind.bank.in/in/en/personal/cards/credit-card/eazydiner-platinum-credit-card.html), [card-specific fuel-waiver revision effective 5-May-2024](https://www.indusind.bank.in/content/dam/indusind-corporate/Other/Fuel_Surcharge_Waiver.pdf), [generic fuel-waiver terms](https://www.indusind.bank.in/in/en/personal/tnc-petrol-surcharge-waiver.html), and [card-liability terms](https://www.indusind.bank.in/in/en/personal/tnc-lost-card-liability.html).

Corrected fuel-waiver bounds to INR 400-4,000 per eligible transaction. The card-specific PDF lists no billing-cycle cap; the generic current terms reserve the Bank's right to impose a monthly cap by value or transaction count. Kept `cap_per_cycle_inr` unknown and documented the discrepancy rather than treating an uncapped PDF line as a perpetual guarantee. GST on the surcharge remains payable; the MITC's 1%+GST fuel fee above INR 30,000 cumulative statement-cycle spend remains noted separately.

Added the linked liability-policy conditions to the fraud-liability benefit: cover is described up to the credit limit and for add-on cards; PIN/OTP-authenticated and pre-delivery fraud are excluded; the covered period is two days before through seven days after reporting (including the reporting day); claims must be reported within 15 days; an active card requires POS activity within the prior six months; counterfeit claims have a separate 15-day statement-based deadline. The recorded sum insured remains null because the amount varies with actual loss and card limit.

Validation passes for 369 cards across 33 issuers with no errors or warnings (857 reward rules; 782 strict; 681/782 strict-ready, 87%). Numeric evidence-path coverage: fees 1,084/2,483 (44%), rewards 1,032/3,061 (34%), benefits 1,042/3,063 (34%), eligibility 538/561 (96%). These coverage counts measure traceability, not factual accuracy; dataset-wide review remains open.

### Kotak White Reserve follow-up (2026-10-26)

Rechecked the fuel waiver against Kotak's [card-specific change notice effective 1-Jun-2025](https://images.kotak.bank.in/bank/mailers/2025/files/KotakWhiteReserveCC010625.pdf), [current lounge/benefits page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/white-reserve-credit-card/lounge-program.html), and [12-Mar-2026 White Reserve KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-white-reserve.pdf). The notice and current feature pages state 1% waiver for INR 400-7,500 fuel transactions, capped at INR 4,500 per calendar year. The KFS says anniversary year. Updated the record's rationale to use the card-specific effective-dated notice/current feature page while preserving the later KFS conflict; the cycle needs issuer confirmation.

The current White Pass page's milestone ladder remains consistent with the current record (up to INR 250,000 value, INR 1 catalogue / INR 0.70 cashback, 15 months from credit). Kotak's general cardholder terms still publish a different White Reserve ladder and 90-days-after-anniversary-cycle expiry. Lounge material says unlimited primary/add-on access and USD 35 per international guest, with a separate note saying charges apply after complimentary visits are exhausted; no clear complimentary-visit count or domestic guest price is published. These contradictions and effective-date gaps remain open. Validation remains clean: 369 cards / 33 issuers, zero errors/warnings; numeric evidence coverage unchanged at fees 1,084/2,483, rewards 1,032/3,061, benefits 1,042/3,063, eligibility 538/561. Coverage is traceability only; dataset review remains open.

### Bandhan Lumina primary-page follow-up (2026-10-26)

Inspected the live [Bandhan Lumina issuer page](https://creditcards.bandhan.bank.in/card-details/Lumina/) including its fees, eligibility and value-chart panels, and the issuer [Delights redemption portal](https://delights.bandhan.bank.in/). The eligibility panel gives ages 21-65 and resident-in-India status; these are now sourced explicitly in the card record. The income cutoff remains "above INR 18 lakh" with no income period or gross/net basis stated, so no annual numeric threshold is inferred.

The fee panel confirms INR 9,999 joining/renewal, INR 12 lakh waiver threshold, 1% forex markup, 1.5% monthly retail finance for ETB customers holding CASA and 3.5% for NTB, 3.5% monthly interest on cash withdrawals, and no cash-withdrawal transaction fee. Added the zero cash-advance fee structurally and retained relationship-dependent retail finance details in source notes.

The live product page explicitly advertises a fuel-waiver cap of INR 1,000 per statement cycle, while the 19-Aug-2026 MITC says INR 500; retained INR 500 from the formal MITC and documented the conflict. The page's value chart contains incompatible implied point values across benefit rows, so the global INR 0.25 remains provisional. The live issuer Delights portal lists one INR 100 Flipkart SuperCoins voucher for 400 points, which directly verifies INR 0.25 for that specific voucher route only; other catalogue/cashback value is not established. The current card page and August MITC do not establish a Mastercard tier or exact launch date.

Validation passes for 369 cards across 33 issuers with zero errors/warnings (857 reward rules; 782 strict; 681/782 strict-ready, 87%). Numeric evidence coverage at that checkpoint: fees 1,086/2,485 (44%), rewards 1,033/3,061 (34%), benefits 1,042/3,063 (34%), eligibility 540/563 (96%). Coverage is traceability, not factual accuracy; dataset-wide review remains open. The later Flare and Ignite page recheck is recorded below.

### Bandhan Flare and Ignite current-page recheck (2026-10-26)

Rechecked the live [Flare page](https://creditcards.bandhan.bank.in/card-details/Flare/) and [Ignite page](https://creditcards.bandhan.bank.in/card-details/Ignite/), including the rendered Fees & Charges and Eligibility panels. The Flare fee panel confirms INR 2,499 joining/renewal, INR 600,000 renewal-waiver spend, 1.99% forex, 2% monthly retail finance for existing customers holding CASA and 3.5% for new customers, 3.5% cash-withdrawal charge with INR 500 minimum, over-limit and late-fee slabs, EMI processing/foreclosure charges, rent fee and other listed charges. The eligibility panel states ages 21-65, resident in India and indicative income above INR 12 lakh; income period and gross/net basis are not stated.

The Flare benefit panel confirms 4 domestic and 1 international lounge visit per calendar quarter, 25% BookMyShow discount up to INR 500 monthly, 10 points per INR 200 eligible spend, 1% fuel waiver up to INR 500 per statement cycle, first-EMI cashback and four annual golf lessons. Its rotating hero content separately advertises 15% off EazyDiner up to INR 750 once monthly; retained that claim with the cap in the field note, while restaurant/payment rules remain unpublished. The lower card-collection carousel contains benefit copy for other cards and is not used as Flare evidence. Travel accelerator conditions and complete transaction exclusions remain unresolved.

The Ignite page confirms the stored base/accelerated earn display (4 points per INR 200; 8 per INR 200 on grocery/travel), monthly 1,200-point milestone after INR 30,000 spend, one domestic and one international lounge visit per calendar quarter, EazyDiner 15% up to INR 500 monthly, first-EMI cashback, and 1% fuel waiver up to INR 250 per statement cycle. Its fee panel confirms nil joining fee, INR 999 renewal fee waived at INR 100,000 annual spend, 3.5% monthly purchase/cash interest, 3.5% forex and 3.5% cash-withdrawal fee (minimum INR 500), plus the listed over-limit, late, EMI, rent, reissue and returned-payment charges. Eligibility states ages 21-65, resident in India and indicative income above INR 6 lakh; income period and gross/net basis are unspecified.

For both Flare and Ignite, the issuer does not establish a scalar network/tier or exact launch date. Ignite's value-chart activation benefit lacks point quantity and conditions; grocery/travel accelerator caps/qualifying mechanics and fuel transaction bounds are not published in the visible panels. Both retain INR 0.25 only as the rate for the issuer Delights portal's INR 100 / 400-point Flipkart SuperCoins voucher route; this is not a universal realized redemption value. The earlier Flare EazyDiner addition is retained as carousel evidence, with its monthly cap documented; it is not substituted for the separate BookMyShow benefit in the detailed panel.

Validation passes for 369 cards across 33 issuers with zero errors/warnings (857 reward rules; 782 strict; 681/782 strict-ready, 87%). Numeric evidence-path coverage is fees 1,086/2,485 (44%), rewards 1,035/3,061 (34%), benefits 1,043/3,064 (34%), and eligibility 540/563 (96%). These counts indicate path traceability only; dataset-wide source review remains open.

### Bandhan Sparks coverage gap and source review (2026-10-26)

The live Bandhan [Sparks product page](https://creditcards.bandhan.bank.in/card-details/Sparks/) identifies Sparks as an active credit-card product in the issuer's portfolio, but no Sparks YAML record existed in the library. Added `data/cards/bandhan/sparks.yaml` from the current page's main feature list and rendered fee/eligibility/value-chart panels. The fee panel confirms nil joining fee, INR 499 annual fee waived at INR 50,000 annual spend, 3.5% forex, monthly purchase/cash interest of 3.5%, cash-withdrawal fee of 3.5% (minimum INR 500), 2.5% over-limit charge (minimum INR 500), the current late-payment slabs, nil add-on/reward-redemption fee, EMI processing/foreclosure terms, and other listed fees. Rent, cash payment at branch, reissue and returned-payment charges are retained in notes where the schema does not fully model them.

The main page confirms 2 Reward Points per INR 200 eligible spend, 500 bonus points after INR 5,000 spend within 30 days, one domestic lounge visit per calendar quarter, 20% BookMyShow discount up to INR 100/month, 10% cashback up to INR 500 on a first EMI booking with minimum 12-month tenure, and 1% fuel waiver capped at INR 150 per statement cycle. The issuer's current eligibility panel states age 21-65, resident in India, and indicative income of at least INR 2.5 lakh; period and gross/net basis are unspecified, so no annual threshold is encoded.

The Sparks value chart additionally assumes INR 20,000/month grocery/apparel spend for an accelerated-reward value and INR 35,000/month other spend for base rewards, but does not publish the accelerator rate, cap, merchant definitions or calculation method. Its INR 200 annual value for base rewards does not reconcile to 2 points per INR 200 and the INR 0.25 value of the specific INR 100 / 400-point voucher listed by Delights. Kept the base reward and voucher route, but did not encode the chart's accelerated stream or a universal point value. The chart also lists activation benefit value INR 125, consistent with 500 points at INR 0.25 for that voucher only; it does not publish further activation conditions beyond the product-page spend offer. The airport list and complimentary guest entitlement remain unknown; the MITC says accompanying guests are charged a variable entry fee. Fuel transaction bounds are now documented from the MITC. Card-specific reward exclusions, exact launch date, and payment network/tier remain unknown. The issuer page links the [30-Apr-2026 Cardholder Agreement](https://creditcards.bandhan.bank.in/landing/uploads/Credit_Card_Cardholders_Agreement_30042026_1b89345542.pdf), whose general rewards terms have now been parsed; the MITC still governs card-specific exclusions and overrides the agreement if their terms conflict.

### Bandhan cardholder-agreement rewards clauses (2026-10-26)

Parsed section 13 and section 25 of the issuer-linked [Cardholder Agreement dated 30-Apr-2026](https://creditcards.bandhan.bank.in/landing/uploads/Credit_Card_Cardholders_Agreement_30042026_1b89345542.pdf). The agreement says reward accrual, expiry and redemption can differ by card and points only accrue on eligible purchases. It expressly excludes card membership fees and disputed transactions, allows merchant-based exclusions and reversals, and refers cardholders to the MITC for exclusion details. The Bank may set earning caps, vary redemption terms or minimums by product/cardholder, change or discontinue the scheme without prior notice, and points cannot be transferred. Only the primary cardholder may redeem; points remaining at account closure are forfeited, and unused points are immediately forfeited when the card is cancelled. Rewards redemption-related taxes/charges are borne by the cardholder. Rewards accumulation/redemption through conversion is barred for withdrawn/cancelled/cancellable cards and delinquent accounts. Section 25 states precedence as MITC, then Key Fact Statement, then Terms and Conditions.

These are agreement-level rules, not a complete card-specific earn/exclusion schedule. The live product pages and the dated MITC remain necessary for merchant categories, transaction caps and exact card benefits; where the generic agreement conflicts with a MITC, the MITC controls. For Sparks this confirms general exclusion/forfeiture mechanics but does not substantiate the grocery/apparel accelerator or clarify the value chart. Continue the Bandhan P12 review against each current MITC and any card-specific product terms. The PDF was read locally at `C:\Users\achar\AppData\Local\Temp\bandhan-cardholders-agreement-20260430.pdf`.

The new entry uses 7-Sep-2026 only as the same provisional current-portfolio date anchor used for sibling records; the issuer page does not establish that as a card launch or terms-effective date. Dataset validation now covers 370 cards across 33 issuers with zero errors/warnings (858 reward rules; 783 strict; 682/783 strict-ready, 87%). Numeric evidence-path coverage: fees 1,105/2,504 (44%), rewards 1,038/3,065 (34%), benefits 1,056/3,077 (34%), eligibility 542/565 (96%). Path coverage is not a factual-accuracy measure; the whole-library review remains open.

### Bandhan MITC cross-check (2026-10-26)

Parsed the issuer's [Most Important Terms and Conditions dated 19-Aug-2026](https://creditcards.bandhan.bank.in/landing/uploads/Credit_Card_MITC_English_19082026_2b514a85e4.pdf), including its fee tables and rewards section. The MITC specifies fuel-waiver eligibility ranges and statement-cycle caps: Sparks 1% on INR 500–2,500 transactions, max INR 150; Ignite INR 500–4,000, max INR 250; Flare INR 500–5,000, max INR 500; Lumina INR 500–5,000, max INR 500. The first three transaction ranges were absent from structured fields and have been added. Lumina's formal INR 500 cap conflicts with the current product-page value chart's INR 1,000; the MITC has precedence, so INR 500 remains encoded with the conflict documented.

The MITC says purchase-earned points become redeemable in the following billing cycle; monthly milestone points become available after two months, and refunds/reversals are adjusted against milestone awards. Its milestone-spend rule excludes fuel/petroleum and service stations; lotteries/gambling; rentals/real estate; emergency and postal services; tax, bail/bond, housekeeping, court/alimony/child-support payments; limousines/taxis; local/suburban transport, ferries, buses, bridges and tolls; utilities; insurance direct marketing/sales/underwriting/premiums; wallet loads; and all listed fees/charges. These detailed exclusions are recorded in the benefits-source notes for the three cards with monthly milestones. The MITC also says complimentary lounge access is for primary cardholders, while accompanying guests are charged a variable airport entry fee. These timing terms are now noted in Sparks, Ignite, and Flare reward-source notes; Lumina's current page advertises a monthly milestone but redemption timing remains as described by the MITC. For Sparks and Flare, the agreement/MITC forfeiture clause qualifies product-page statements that points do not expire: unused points are forfeited on card cancellation. The MITC does not give a complete merchant-category exclusion schedule; the current Delights rules and card-specific offer terms remain required to close that field review.

After the structured fuel-range corrections, `scripts/validate.py` passes for 370 cards across 33 issuers with zero errors/warnings (858 reward rules; 783 strict; 682/783 strict-ready, 87%). Numeric evidence-path coverage was rerun after the three fuel-waiver transaction bands were populated: fees 1,105/2,504 (44%), rewards 1,038/3,065 (34%), benefits 1,056/3,077 (34%), eligibility 542/565 (96%). These figures measure traceability, not factual accuracy. Dataset-wide review remains open.


### Axis Olympus current availability and variant review (2026-10-26)

Rechecked the live [Axis Olympus Citi-migration page](https://www.axis.bank.in/forward-together/migrate-credit-cards/transfer-citi-olympus-credit-card) and current [Olympus terms](https://www.axis.bank.in/docs/default-source/default-document-library/olympus-terms-and-conditions.pdf), updated effective 28-Aug-2026. The migration page explicitly offers Olympus to former Citi Prestige cardholders. Reclassified the record from `discontinued` to `invite-only`, cleared the unsupported 3-Jul-2026 discontinuation date, and pointed its application link to the migration page.

The current terms identify both Visa Infinite and Mastercard World Elite Olympus variants; the single-network schema cannot encode the selected variant, so `network` and `network_tier` are now null, with both variants described in the source notes. Verified and modeled 2 EDGE Miles per INR 100 on international transactions alongside the 1-per-INR-100 domestic base rate. The terms confirm the 2,500-mile welcome benefit after a first transaction within 30 days for eligible primary cardholders, and 2,500 miles annually after anniversary for active primary cards. The issuer also confirms a INR 10,000 Taj/ITC welcome and annual voucher, 8 domestic golf rounds or lessons per year (a combined entitlement) with one guest, plus one additional round or lesson per INR 50,000 spend. Added those current annual/welcome and golf details, the Hotels.com third-night credit, BookMyShow movie/non-movie offers, Taj Epicure terms, and airport services to the record. The migration page says converted pre-migration points remain non-expiring; post-migration points expire after 365 days without a transaction, redemption or EDGE Rewards portal login.

Current card-specific age, income, residency and credit-score cutoffs remain unpublished. Card-specific insurance coverage was not verified in the current sources and is not claimed. `scripts/validate.py` passes after these corrections: 370 cards, 33 issuers, 859 reward rules (785 strict; 684/785 strict-ready, 87%), 0 errors and 0 warnings. Numeric evidence-path coverage is fees 1,111/2,510 (44%), rewards 1,042/3,070 (34%), benefits 1,062/3,084 (34%), eligibility 542/565 (96%); these figures measure traceability, not factual correctness. Dataset-wide review remains open.

### Amazon Pay ICICI Bank Credit Card current-term review (2026-10-26)

Rechecked the current ICICI [product page](https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card), its linked [card FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card/faqs), current local issuer MITC, and the issuer's [October 2025 co-brand update](https://www.icici.bank.in/about-us/news-room/2025/amazon-pay-and-icici-bank-renew-partnership-enhance-indias-most-adopted-co-branded-credit-card). Corrected the record to reflect invite-only application status and Visa network with network tier left unknown; the issuer does not establish a tier in the reviewed materials. Corrected the launch date to the 30-Oct-2018 issuer launch announcement.

Current reward terms distinguish 5% for Prime and 3% for non-Prime Amazon.in shopping; 2% on specified digitally fulfilled Amazon Pay categories, Login and Pay with Amazon transactions, and physical gift cards; 5%/3% on flights and hotels booked through Amazon Pay by Prime/non-Prime members; and 1% on otherwise eligible domestic purchases. The record captures rent, education, fuel, EMI and international exclusions, and limits base earn on utilities, wallet loads and government-coded transactions while keeping the Amazon Pay 2% route available for qualifying digital categories. The source also excludes tax and precious-metal purchases, but the schema has no precise bucket for these product-level exclusions; they remain explicit rule notes, and merchant/MCC classification can still affect estimated rewards. The record states Amazon Pay balance credit within two working days after billing-cycle completion and the unlimited, non-expiring structure. The prior broad 1% base and omitted travel tier did not reflect the issuer's current category structure.

The live product page confirms nil joining/annual fees, 1.99% forex markup, 3.75% monthly finance charge, late-payment fee range INR 100–1,300, and monthly income threshold INR 30,000 for salaried and self-employed applicants with minimum age 21 and invite-only issuance. These monthly income cutoffs are stored annualized as INR 360,000. Updated the 1% fuel surcharge waiver to a maximum INR 4,000 transaction and INR 50,000 eligible fuel spend per statement cycle from the current issuer MITC; no unsupported INR 400 minimum transaction is claimed. Added the issuer-advertised three-month no-cost EMI for eligible Amazon.in transactions, while leaving the complete eligible transaction rules unknown. Maximum age, credit score cutoff, fuel minimum transaction amount, and exact late-fee slabs remain unpublished or unverified in the accessed card-specific materials; concierge and lounge access are not asserted. The benefit schema/types now allow a null concierge flag so unknown service availability is not encoded as a verified negative.

Current global validation passes: 370 cards across 33 issuers, 862 reward rules (788 strict; 691/788 strict-ready, 87%), zero errors and warnings. Numeric evidence-path coverage is fees 1,115/2,510 (44%), rewards 1,061/3,076 (34%), benefits 1,065/3,084 (35%), and eligibility 545/568 (96%). These counts measure traceability, not factual accuracy; dataset-wide review remains open.


### ICICI Bank Coral current-term review (2026-10-26)

Reviewed the current [Coral product page](https://www.icici.bank.in/personal-banking/cards/credit-card/coral-credit-card), issuer card FAQ, current local [ICICI MITC dated 9-Oct-2026](https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/mitc_cc.pdf), current Coral membership guide, the issuer Rewards FAQ, and current Culinary Treats terms. Cleared the unsupported 2014 launch date and single-network Visa classification because the reviewed issuer materials cover multiple Coral network variants but do not establish one network or an exact generic Coral launch date. Removed the unpublished point cash conversion and estimates derived from it; current point redemption value depends on the live catalog, and a INR 99 plus GST redemption handling fee applies.

Updated current fees and eligibility, including INR 500 joining/annual fees, annual-fee waiver above INR 1.5 lakh, minimum age 21, and issuer income thresholds (INR 20,000 monthly salaried, INR 2.4 lakh annual self-employed). Recorded the current INR 75,000 preceding-quarter domestic lounge gate, four annual railway visits, INR 25,000 preceding-quarter BookMyShow gate effective 1-Apr-2026, uncapped-by-count INOX monthly offers as stated on the page, and HPCL fuel-waiver range and INR 50,000 statement-cycle cap. Removed the expired fixed 15% dining rate; variable Culinary Treats offers remain without a fixed Coral percentage. Kept insurance and concierge conditioned on RuPay variant. The precise Coral launch date, point-to-rupee conversion, fixed dining percentage, credit-score cutoff, and variant selected at issuance remain unpublished or unverified.

Global validation passes for 370 cards across 33 issuers: 862 reward rules, 788 strict-scope rules, 695 strict-ready (88%), and zero errors or warnings. Numeric evidence-path coverage is fees 1,120/2,510 (45%), rewards 1,069/3,072 (35%), benefits 1,079/3,082 (35%), eligibility 549/572 (96%). These coverage indicators measure traceability, not factual accuracy; full dataset review remains open.


### ICICI Bank Expressions current-term review (2026-10-26)

Reviewed the current [Expressions issuer page and FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/expressions-card), current ICICI [feature and charge changes](https://www.icici.bank.in/personal-banking/cards/credit-card/upcoming-changes-features-and-charges), and general [ICICI rewards FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/faqs). Replaced the unsupported 2017 launch date and single-network Visa Platinum claim with unknown launch/network scalar values; issuer FAQ describes dual network configurations. Corrected retail earning to 3 points per INR 100 and utility/insurance to 1 per INR 100. Removed unsupported INR 0.25 / INR 0.20 point values and fixed voucher redemption rate because the issuer says point value varies by catalog item. Recorded the general INR 99 plus GST redemption fee and three-year points expiry; these are issuer-wide reward terms.

Refreshed the INR 499 joining and annual fees, INR 1.5 lakh annual-fee waiver, 3.75% monthly finance charge, and current 3.5% forex fee reference. Captured the INR 75,000 preceding-quarter lounge threshold and primary-cardholder restriction; the 1-Apr-2026 BookMyShow spend gate and network-variant offer limit; the separate INOX offer; and the HPCL INR 400-4,000 fuel-waiver range. Added the issuer-described counterfeit-card liability and account-takeover protection without inventing coverage limits. Corrected age to 21-65 and left income/credit-score cutoffs unpublished. Exact launch date, network variant selected, and point-to-rupee conversion remain unknown.

Global validation passes for 370 cards across 33 issuers: 862 reward rules, 788 strict-scope rules, 695 strict-ready (88%), and zero errors or warnings. Numeric evidence-path coverage is fees 1,125/2,510 (45%), rewards 1,073/3,069 (35%), benefits 1,087/3,082 (35%), eligibility 551/574 (96%). These indicators measure traceability, not factual accuracy; full dataset review remains open.


### ICICI Bank HPCL Super Saver current-term review (2026-10-26)

Reviewed the current [HPCL Super Saver issuer page and FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/hpcl-super-saver), ICICI's [2021 launch announcement](https://www.icici.bank.in/about-us/article/news-icici-bank-and-hpcl-launch-icici-bank-hpcl-super-saver-cobranded-credit-card-20212007130836320), current ICICI reward and fee terms, and the current local MITC. Corrected the card launch date to 20-Jul-2021 and cleared the stale single-network Visa Signature label because the current FAQ describes dual-network variants. Refreshed the INR 500 joining/annual fees, INR 1.5 lakh annual fee waiver, 3.5% forex fee, 3.75% monthly finance charge, and 2.5%/INR 500 cash-advance fee.

Rebuilt current rewards as 2 points per INR 100 retail spend and 20 points per INR 100 on utility, grocery and department-store categories, capped at 400 points per month. Removed the broad government/tax earn claim and retained department-store terms in notes because the calculator cannot isolate that merchant class from general shopping. Removed unsupported point-to-cash and statement-credit assumptions. The issuer advertises the points stream as 5% cashback, but the points are not a universal cash equivalent; catalog conversion varies. Recorded fuel cashback separately from points: 4% up to INR 200/month at HPCL, plus a further 1.5% Happy Coins through HP Pay; those wallet coins' cash value is unpublished. Fuel also has a separate 1% surcharge waiver on INR 400-INR 4,000 transactions.

Updated current 2026 lounge and BookMyShow spend gates, INOX terms, age/income eligibility, RuPay-only personal accident and concierge benefits, and the 2,000-point joining benefit. Removed the unsupported joining condition (INR 5,000 spend within 45 days); the current page states the benefit but not qualifying conditions. Added the issuer's roadside assistance scope. Point value, credit-score cutoff, variant selected at issuance, insurance amount, and joining-benefit qualifying mechanics remain unknown.

Current global validation after the Coral, Expressions and HPCL Super Saver passes: 370 cards across 33 issuers, 861 reward rules (787 strict; 694/787 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage is fees 1,130/2,510 (45%), rewards 1,078/3,062 (35%), benefits 1,095/3,080 (36%), eligibility 555/578 (96%). These figures measure traceability, not factual correctness; dataset-wide review remains open.


### ICICI Bank HPCL Coral current-term review (2026-10-26)

Reviewed the current [HPCL Coral product page](https://www.icici.bank.in/personal-banking/cards/credit-card/hpcl-coral-credit-card), [ICICI fuel-card guidance](https://www.icici.bank.in/personal-banking/blogs/card/credit-card/what-is-fuel-surcharge-waiver-in-credit-card), current ICICI reward FAQ and the October 2026 MITC. Cleared the unsupported 2018 launch date and single-network Visa/Platinum assignment because issuer materials list Visa/Mastercard, Amex and dual-network variants without a single scalar for this family. Updated current earning to 2 points per INR 100 retail and 1 per INR 100 utility/insurance, and removed unsupported point conversion values and statement-credit redemption. Fuel cashback is modeled separately from points: 2.5% at HPCL pumps, capped at INR 100/month; the 1% surcharge waiver applies to INR 400-INR 4,000 purchases on an ICICI Bank POS. The issuer says the Amex variant additionally earns 6 Reward Points per INR 100 on fuel; the combined catalog cannot target that variant, so it is retained as a documented exception and excluded from fuel point estimates.

Refreshed INR 199 joining/annual fee, INR 50,000 annual waiver threshold, 3.5% forex, 3.75% monthly finance, current age 21-65 and issuer income thresholds. Captured the BookMyShow spend threshold effective 1-Apr-2026 and removed the unsupported INOX benefit for this HPCL variant. The product page and ICICI fuel guide differ on whether the annual fee is waived in year one; this is documented unresolved across variants. Exact launch date, variant selection, point-to-rupee value, and credit-score cutoff remain unknown.

Global validation after this review: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage is fees 1,135/2,510 (45%), rewards 1,082/3,056 (35%), benefits 1,100/3,080 (36%), eligibility 559/582 (96%). These figures measure traceability, not factual accuracy; full dataset review remains open.


### ICICI Bank Platinum Chip current-term review (2026-10-26)

Reviewed the current [Platinum Chip product page and FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/platinum-chip-credit-card), ICICI's [current credit-card rewards FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/faqs), current issuer fuel terms, and the October 2026 MITC. Removed unsupported 2014 launch date, Visa Platinum network/tier assignment, and point conversion rates. Current earning is 2 points per INR 100 retail and 1 point per INR 100 utility/insurance; fuel is excluded. Point conversion varies by redemption item, and the general program currently charges INR 99 plus GST per redemption and expires points after three years.

Confirmed nil joining/annual fees, 3.5% forex markup, 3.75% monthly finance charge, age 21-65, and the issuer's INR 20,000 monthly income criterion for both employment classes. Monthly amounts are stored annualized. Updated the HPCL fuel waiver range to INR 400-INR 4,000 and added advertised Easy EMI conversion with its eligible transactions and charges left unspecified. Lounge and concierge availability are not stated on the current page and are left unknown. Exact launch date, network/tier, point cash value, credit-score threshold and detailed EMI conditions remain unknown.

Current global validation: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage is fees 1,139/2,510 (45%), rewards 1,086/3,052 (36%), benefits 1,103/3,080 (36%), eligibility 563/586 (96%). These figures indicate traceability, not factual accuracy; full dataset review remains open.


### ICICI Bank MakeMyTrip Platinum current-term review (2026-10-26)

Reviewed the current [ICICI Platinum product page](https://www.icici.bank.in/personal-banking/cards/credit-card/makemytrip/platinum-credit-card), linked [card-specific T&Cs](https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/mmt_platinum_tnc.pdf) and the local October 2026 MITC. Corrected the unsupported 2019 launch date to the issuer's 27-Sep-2018 public launch announcement (announcement date used as the launch proxy); the announcement historically names Visa payWave, but the unsupported current Visa/Platinum scalar was cleared because current issuance is not confirmed. The current product page's generic 3.5% forex value agrees with the October MITC treatment for Platinum: the MITC's new zero-markup benefit excludes Platinum. The older launch promotion differs from the current 2021-onward welcome voucher, so current card-specific terms govern. Effective dates below are verification snapshots dated 26-Oct-2026, not issuer-published dates.

Refreshed fee values and evidence references; corrected myCash from bank cashback to points with closed-loop MakeMyTrip redemption. Added the base domestic rate (1 myCash/INR 200), retained 1.25 international, 2 flights and 3 hotels/holidays rates, and recorded rounding, reversal behavior, expiry, non-cashability, redemption exclusions and qualifying-spend exclusions. Corrected the welcome condition to 10 business days (the voucher is delivered in the welcome kit), milestones and add-on spend treatment, lounge access to one quarterly domestic visit gated by INR 75,000 preceding-quarter spend, railway access to one per quarter, BookMyShow/INOX offer frequency, fuel waiver scope, and eligibility values. Current product page confirms Platinum remains available; its notice that Signature applications are closed does not apply to Platinum.

Unresolved: no current source identifies the network selected at issuance, the exact commercial launch date (the announcement date is used as proxy), an effective date for current terms, a credit-score cutoff, or limits/conditions for advertised fraud cover. The issuer's published self-employed income threshold of INR 20,000/year is unusually low; retained as written and flagged rather than replaced with a generic issuer criterion. Culinary Treats discount value is variable and not estimated.

Global validation after this review: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage: fees 1,143/2,510 (46%), rewards 1,093/3,052 (36%), benefits 1,119/3,082 (36%), eligibility 566/589 (96%). These figures measure traceability, not factual accuracy. `scripts/audit_stamps.py` reports 20 cards with `last_verified_on` later than their newest source retrieval; the MakeMyTrip Platinum card is current at 26-Oct-2026. Dataset-wide field review remains open.


### ICICI Bank Chennai Super Kings current-term review (2026-10-26)

Reviewed the [current CSK card page](https://www.icici.bank.in/personal-banking/cards/credit-card/csk-card), issuer card-specific [terms last updated 21-May-2026](https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/csk-tnc.pdf), current ICICI [credit-card feature/charge updates](https://www.icici.bank.in/personal-banking/cards/credit-card/upcoming-changes-features-and-charges), the current [Rewards FAQ](https://www.icici.bank.in/personal-banking/cards/credit-card/faqs), local CSK campaign terms, and the issuer [23-Mar-2022 launch announcement](https://www.icici.bank.in/about-us/article/news-icici-bank-partners-with-chennai-super-kings-20222303155444676). Corrected the unsupported 1-Mar-2022 launch date to the announcement date, cleared the unsupported Visa/Platinum scalar because the issuer describes dual-network (Mastercard/Amex or Visa/RuPay) variants without identifying the issued pair, and kept `on-hold` because the issuer says it is no longer accepting applications.

Refreshed the INR 500 joining/annual fees, INR 1.5 lakh annual-fee waiver, 3.5% forex, 3.75% monthly finance charge and 2.5%/INR 500 cash-advance fee snapshot. Updated eligibility to age over 21, salaried INR 20,000/month and self-employed INR 2.4 lakh/year; credit score and max age remain unpublished. Updated CSK card T&C reward handling, fuel/fees/EMI exclusions, three-year point expiry and variable catalogue value; removed unsupported fixed INR 0.25 face and INR 0.20 realized values. The current issuer Rewards FAQ says points are not currency and values vary by item, with INR 99 plus GST handling fee per redemption. Added current issuer rent/e-wallet exclusions and MCC 6513/7349 rent classification.

The current card page and the latest card-specific T&C conflict on important earn values: the page advertises 10 points/INR 100 on CSK match days and 1 on utility/insurance, while the T&C describes bonus points equal to regular earn (2) and appears to say 2 on utilities. The YAML keeps the page-advertised values with explicit conflict notes and medium confidence; do not interpret these rates as reconciled. Current lounge access is one visit/quarter for primary cardholders after INR 75,000 preceding-quarter spend. BookMyShow now requires INR 25,000 preceding-quarter spend from 1-Apr-2026; dual-network variants have a one-per-month-per-variant rule. The INOX twice-monthly offer, current fuel waiver and campaign benefits were refreshed; the page feature summary says HPCL-only fuel while its FAQ says any Indian fuel outlet up to INR 4,000, so the record flags that conflict. The archived top-spender terms cover a Dec-2023 to Mar-2024 campaign and were not treated as current campaign rules.

Global validation remains 370 cards / 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path totals remain fees 1,143/2,510 (46%), rewards 1,093/3,052 (36%), benefits 1,119/3,082 (36%), eligibility 566/589 (96%); the CSK record is on-hold and excluded from that coverage aid. These counts measure traceability, not factual correctness. Full field-level review remains open; next in the freshness queue is ICICI MakeMyTrip Signature.


### ICICI Bank MakeMyTrip Signature current-term review (2026-10-26)

Reviewed the current [Signature product page](https://www.icici.bank.in/personal-banking/cards/credit-card/makemytrip/signature-credit-card), its linked [Signature card T&Cs](https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/tnc_mmt_signature.pdf), the October 2026 MITC and the issuer's [2018 co-brand launch announcement](https://www.icici.bank.in/about-us/article/news-icici-bank-tiesup-with-makemytrip-to-launch-a-range-of-cobranded-credit-cards-20182709141041754). The current page says Signature applications are no longer accepted; retained `on-hold`. It does not establish the network currently issued, so cleared the unsupported Mastercard/World assignment. Used the announcement date, 27-Sep-2018, as a launch proxy rather than claiming a separately confirmed commercial launch date.

Refreshed the INR 2,500 joining fee, nil annual fee, 3.5% forex markup, 3.75% monthly finance charge and linked MITC cash-advance fee. Corrected myCash from bank cashback to points with closed-loop MakeMyTrip redemption; INR 1 per myCash applies in the stated booking/voucher context, with one-year expiry, restrictions, exclusions, rounding and reversal behavior captured. Current card-specific terms confirm 1.25 myCash/INR 200 domestic, 1.5 international, 2 on MMT flights and 4 on MMT hotel/holiday bookings. Updated milestones to 1,100 myCash at INR 2.5 lakh and 4,000 at INR 5 lakh per anniversary year, welcome to INR 1,500 myCash plus a holiday voucher up to INR 2,500, and movie/fuel benefits. The MMTBLACK Exclusive programme and its possible INR 20,000 holiday voucher are conditional; removed the fixed INR 20,000 welcome valuation. Eligibility is Indian citizen over 21 with monthly income INR 75,000 for both salaried and self-employed applicants (stored annualized); credit-score cutoff is unpublished.

The current product page lists two primary domestic airport lounge visits per quarter after INR 75,000 eligible spend in the previous quarter. The linked Signature PDF says one domestic visit per quarter. Followed the current page and recorded the discrepancy in the data. International access is one visit per year for primary cardholders; new applicants from 15-Nov-2024 receive Priority Pass, while earlier members retain DreamFolks. Railway lounge access is one quarterly visit for primary cardholders.

Global validation after this review: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage remains fees 1,143/2,510 (46%), rewards 1,093/3,052 (36%), benefits 1,119/3,082 (36%), eligibility 566/589 (96%); the on-hold card is outside this coverage aid's active scope. `scripts/audit_stamps.py` reports 20 cards with newer verification stamps than their newest source retrieval; MakeMyTrip Signature is current at 26-Oct-2026. Dataset-wide field review remains open. Next freshness-queue card: ICICI Manchester United Signature.


### ICICI Bank Manchester United Signature current-term review (2026-10-26)

Reviewed the current [Manchester United Signature product page](https://www.icici.bank.in/personal-banking/cards/credit-card/manchester-signature-card), its linked [Manchester United T&Cs](https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/docs/terms-condition/mu-tnc.pdf), [Signature membership guide](https://www.icici.bank.in/content/dam/icicibank/managed-assets/docs/personal/cards/credit-cards/membership-kits/membership-guide-signature.pdf), October 2026 MITC, current ICICI Rewards FAQ and issuer [launch announcement dated 22-Aug-2018](https://www.icici.bank.in/about-us/article/news-icici-bank-announces-partnership-with-manchester-united-20182108172023153). The live product URL redirects to ICICI home when opened directly; its official indexed page text and current membership-kit listing were reviewed. That product text says ICICI is currently not accepting applications, so corrected the incorrect `discontinued` state/date to `on-hold`. The page describes Mastercard/Amex and Visa/RuPay dual-network combinations, so cleared the unsupported single Visa/Signature scalar. Used the launch-announcement date as a proxy, not a separately confirmed commercial release date.

Updated current fees to INR 2,499 joining/annual plus GST, annual-fee waiver for spend over INR 2.5 lakh, 3.5% forex and 3.75% monthly finance. Current rewards page lists 3 ICICI points/INR 100 domestic and 5/INR 100 on match day; removed the old 4-point baseline, unsupported 6-point international rule, and fixed point-to-rupee valuations. The current generic ICICI Rewards guidance says point value varies by item, points expire after three years and each redemption incurs INR 99 plus GST. Current product text establishes a Manchester United holdall and football welcome item, two domestic lounge visits per quarter after INR 75,000 spend in the preceding quarter, 1% HPCL fuel waiver for INR 400?4,000 purchases at ICICI POS, a 25%-off movie offer up to INR 150 with a two-ticket minimum, and a BookMyShow INR 25,000 preceding-quarter gate effective 1-Apr-2026. Eligibility is Indian citizen, age 21?65, salaried INR 75,000/month and self-employed INR 9 lakh/year.

Unresolved: the shared card T&C describes match-day bonus points in addition to regular points but has placeholder values and does not quantify the bonus. The page's ?5 points on match day? is recorded as the advertised rate without adding the domestic 3-point rate; do not treat the math as reconciled. Top-spender campaign thresholds and winner counts in the linked PDF also contain placeholders, so these benefits remain qualitative. Current issuer materials do not establish international lounge visits; removed the older unsupported two-visit benefit.

Global validation after this review: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors and warnings. Numeric evidence-path coverage remains fees 1,143/2,510 (46%), rewards 1,093/3,052 (36%), benefits 1,119/3,082 (36%), eligibility 566/589 (96%); the on-hold card is outside the coverage aid's active scope. `scripts/audit_stamps.py` now reports 19 newer verification stamps than newest source retrieval; Manchester United Signature is current at 26-Oct-2026. Dataset-wide field review remains open. Next freshness-queue card: Kotak Myntra Kaching.


### Kotak Myntra Kotak Credit Card current-term and discontinuation review (2026-10-26)

Reviewed Kotak's [Myntra card FAQ](https://www.kotak.bank.in/en/get-help/myntra-kotak-credit-card-faq.html), official [cashback T&Cs](https://www.kotak.bank.in/content/dam/Kotak/herosliderbanner/myntra-kotak-cobrand-credit-card-cashback-t%26c.pdf), [launch announcement](https://www.kotak.com/content/dam/Kotak/about-us/media-press-releases/2023/press-release-myntra-xkotak.pdf), KFS and product-card listing. Corrected the unsupported 2021-07-01 launch date to Kotak's 1-Jun-2023 release, which also states Mastercard and RuPay variants; cleared the single Visa/Platinum scalar. Kotak's official product URL now redirects to the current product list. The FAQ still claims that users can apply, but a 7-Jul-2025 report quoting Kotak's customer email says the card ceased transactions and cardholders were migrated effective 10-Jul-2025. Corrected the false 2026 end date to 10-Jul-2025 and retained `discontinued`. Exact end date is supported indirectly by contemporaneous reporting rather than a public Kotak notice; conflicting FAQ content remains documented.

Corrected the fee snapshot to INR 500 joining/annual fees, INR 2 lakh annual spend waiver, 3.5% forex, 3.7% monthly finance and 2.5%/INR 500 cash-advance fee. Reworked cashback using Kotak's card T&Cs and current FAQ: 7.5% Myntra app/site instant discount up to INR 750 per transaction; 5% on Swiggy, Swiggy Instamart, Cleartrip, PVR and Urban Company, capped INR 1,000 per statement cycle; unlimited 1.25% on other eligible spend. Added cashback MCC/category exclusions, 30-day statement credit timing, round-down and reversal/EMI rules. Corrected activation to a INR 500 Myntra voucher after a qualifying INR 500 transaction within 30 days, and the quarterly milestone to two INR 250 PVR tickets after INR 50,000 spend. Removed the unsupported lounge benefit. Age/residency are 18?65 and resident Indian; no income/score cutoff is published.

Kotak's current FAQ lists a fuel waiver of 1% for transactions INR 500?3,500; its KFS lists INR 500?3,000. Followed the current FAQ and recorded the discrepancy. The KFS endpoint returned HTML rather than a PDF when archived; the published search result was reviewed for fees and charges. The current FAQ marks the PVR ticket delivery process as ?TBD? and names excluded spend as ?xxxx?; qualifying-spend exclusions and fulfillment details remain unknown.

Global validation after this review: 370 cards across 33 issuers, 860 reward rules (786 strict; 693/786 strict-ready, 88%), zero errors/warnings. Numeric evidence-path coverage remains fees 1,143/2,510 (46%), rewards 1,093/3,052 (36%), benefits 1,119/3,082 (36%), eligibility 566/589 (96%); discontinued records are outside active-scope coverage. `scripts/audit_stamps.py` now reports 18 cards with verification stamps newer than their newest source retrieval. Dataset-wide field review remains open. Next freshness-queue card: Kotak PVR Gold.

### Kotak PVR Gold current-term validation (2026-10-26)

Reviewed Kotak's [PVR Gold product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/pvr-gold-credit-card.html), [fees page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/pvr-gold-credit-card/fees-and-charges.html), current [KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/key-fact-statement-kfs-pvr.pdf) (version KFSPGP12032026), [how-to-use page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/pvr-gold-credit-card/how-to-use.html), [cardholder terms](https://www.kotak.bank.in/content/dam/Kotak/Customer-Service/others/credit_card_tandc.pdf), current [card list](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards.html) and [eligibility FAQ](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/credit-card-faqs.html). Kotak marks the card discontinued for new applications, so status is on-hold for existing cardholders; removed the unsupported 2026 discontinuation date and 2019 launch date. Network/tier are unknown.

Corrected fees to INR 0 joining/INR 499 annual, no waiver, 3.5% forex, 3.75% monthly finance and 2.5% cash-advance fee (minimum INR 500). Removed the unsupported PVR points earn/conversion and fuel surcharge waiver. The cardholder-terms reward-program list does not include PVR Gold. Current product page says 1 ticket up to INR 400 at INR 10,000 monthly eligible billing-cycle spend and 2 tickets total at INR 15,000; coupon is one movie ticket per redemption. Added 5% movie-ticket and 20% F&B instant discounts from product page. Kotak's main listing instead says 15% F&B cashback; retained the product-page rate and documented the conflict. Milestone exclusions are listed on the product page, but complete spend qualification and discount stacking are unclear. Eligibility FAQ states age 21�65 and Indian residency; numerical income/score thresholds are not published.

Validation remains open for remaining cards. Global data: 370 cards, 860 reward rules, zero validator errors/warnings. The new record is on-hold, so the evidence coverage totals are not expected to change. Continue the freshness queue at the next card listed in the continuation checklist.

### RBL Bank Edition Classic / Zomato card historical correction (2026-10-26)

Reviewed RBL's [Edition Classic T&Cs](https://webassets.rbl.bank.in/document/credit-cards/tnc-edition-classic-922.pdf), [benefit change notice effective 20-Sep-2022](https://webassets.rbl.bank.in/document/credit-cards/edition-classic-value-822.pdf), [Zomato partnership termination/replacement notice](https://webassets.rbl.bank.in/document/credit-cards/edition-card-1-423.pdf), [2-Mar-2020 launch release](https://webassets.rbl.bank.in/document/PRESS_COVERAGE_FILE_DIR_PATH/rbl-bank-zomato-mastercard-partnership.pdf), and current generic RBL MITC. Archived the issuer PDFs in `docs/sources/rbl/zomato-edition/` and the generic MITC in `docs/sources/rbl/_shared/`.

Corrected the record to the Edition Classic variant (not generic Edition), launched 2-Mar-2020, and replaced/discontinued 15-May-2023; cleared unsupported Platinum network tier. The final Classic reward terms effective 20-Sep-2022 were 1% Edition Cash on general spend and 5% on Zomato/Blinkit app spend capped at 500 Edition Cash/day; annual INR 2 lakh spend earned a 2,000 Edition Cash bonus. Edition Cash is closed-loop Zomato value, INR 1 per unit, with the last date to redeem 14-May-2023. Added 500 Edition Cash welcome benefit for full-fee accounts only. The 2023 notice says remaining Edition Cash would be credited as cashback on replacement Shoprite accounts by 10-Jun-2023. Removed false 10% Zomato/5% other online rates, three-month Zomato Gold welcome, INR 2 lakh annual-fee waiver, and unsupported fuel waiver. Kept the Gold and domestic-lounge launch claims only as unquantified launch-era notes; current/latest benefit terms are not established.

Current surviving official sources do not establish Edition Classic joining/annual fees, exact forex markup, finance rate, cash advance terms, waiver, or numeric eligibility criteria; these are null rather than carried from generic RBL tiers or third-party listings. Daily accelerator cap cannot be expressed by the schema's monthly cycle; preserved the INR 500/day condition in `capping_rules` and marked the modeled cap unknown.

Validator: 370 cards, 858 reward rules, zero errors/warnings. Numeric evidence totals unchanged because the discontinued record is outside active-scope coverage. Stamp scan now reports 16 mismatches; this record is current as of 26-Oct-2026. Next freshness-queue card: YES Bank Premia.


### Credit-card validation continuation (2026-10-26, slice UPI Credit Card)

Rechecked slice's live card page, current MITC/cardmember agreement and issuer launch announcement. Corrected stale July-2026 audit assumptions: card announcement date is 2025-06-28; current card is RuPay with tier unknown; fees are INR0 joining/annual, 0% bank forex markup and 3.5% monthly finance rate (42% APR). The 2.5%/INR25-min bank-transfer charge is distinct from any ATM cash-advance fee, which remains unknown. Current reward is 1 monies per INR1 eligible card spend, redeemable to slice savings at balance-based 1%-3% rates; removed erroneous 1% cashback plus 2% UPI accelerator/INR500 cap and fixed unit value. Removed unsupported fuel waiver; current MITC lists 2% fuel surcharge with INR10 minimum above INR25,000 cumulative cycle spend. Age/income/credit-score cutoffs remain unknown. Schema cannot precisely encode balance-based redemption tiers; detailed conditions are recorded in the card reward notes and source index. Sources: https://slice.bank.in/cc-mitc, https://slice.bank.in/cc-terms, https://slice.bank.in/credit-card, https://slice.bank.in/documents/press/slice-super-card-press-release.pdf. Dataset-wide review remains open.


### Credit-card validation continuation (2026-10-26, HSBC RuPay Cashback)

Reviewed current HSBC product page, card MITC/Service Guide, forex offer and current welcome/EazyDiner offers; archived five official PDFs locally. Corrected stale fee terms (INR499 joining/annual, waiver above INR200,000 annual spend, 3.75% monthly finance, 2.5%/INR500-min cash advance), cashback (10% dining/food/grocery, 1% other eligible, combined INR400 billing-cycle cap), offer-period 0% forex (standard 3.5%; waiver through 31-Dec-2026), current welcome terms, eligibility and removal of unsupported fuel surcharge waiver. Current page's lounge count conflicts with older Service Guide summary; documented and followed current product page. No primary launch announcement/score cutoff found; launch date and score cutoff remain unknown. Structural validation: 370 cards/858 rules, zero errors/warnings; strict-ready 695/785 (88%). Numeric evidence aid: fees 1,150/2,508; rewards 1,098/3,044; benefits 1,129/3,085; eligibility 566/597. Freshness scan: 13 mismatches remain. Next card PNB RuPay Select.


### Credit-card validation continuation (2026-10-26, PNB RuPay Select)

Reviewed current PNB card/rewards pages, MITC, schedule, eligibility guide, application form, UPI page and RuPay benefit guide. Corrected fee, eligibility, lounge, welcome and other benefit fields; cleared unsupported launch date and reward exclusions. RuPay Select card-specific point value is INR0.25; generic Rewardz page conflicts at INR0.50. Scheduled INR99 plus GST redemption fee starts 2026-11-01, so current record keeps fee null. Validator: 370 cards/858 rules, zero errors/warnings, strict-ready 695/785 (88%). Evidence coverage aid: fees 1,160/2,509; rewards 1,104/3,045; benefits 1,147/3,088; eligibility 576/601. Freshness scan: 12 mismatches remain; next is Equitas Selfe.


### Credit-card validation continuation (2026-10-26, Equitas Selfe)

Reviewed current Selfe product page/FAQ, issuer MITC v1.2, pricing form and application form. Corrected fee, reward, redemption, network and benefit claims; exact launch and numeric eligibility cutoffs remain unknown. Issuer PDF downloads returned 503 and are referenced by URL in the source index. Validator: 370 cards/858 rules, zero errors/warnings, strict-ready 695/785 (88%). Numeric coverage aid: fees 1,165/2,509; rewards 1,114/3,049; benefits 1,153/3,092; eligibility 576/601. Freshness scan: 11 mismatches remain; next Federal Scapia.


### Credit-card validation continuation (2026-10-26, Federal Scapia)

Reviewed current Federal product page, June-2026 cardholder agreement/MITC, April-2026 fee schedule, Scapia benefits terms and official launch announcement. Corrected fees, rewards, lounge/fuel terms, network and eligibility. Visa/RuPay rate differences exceed one-row schema expressiveness; conservative RuPay baseline used with the Visa terms preserved in notes. One PDF archived; other endpoints returned CAPTCHA HTML. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 695/785 (88%). Numeric evidence aid: fees 1,172/2,510; rewards 1,123/3,051; benefits 1,158/3,090; eligibility 578/603. Freshness scan: 10 mismatches remain; next HSBC TravelOne.


### Credit-card validation continuation (2026-10-26, HSBC TravelOne)

Reviewed current HSBC product/rewards pages and six linked issuer PDFs. Corrected fee and renewal-waiver details, monthly accelerated-points cap, DCC/carry-forward treatment, complete MCC exclusions, current welcome/milestone benefits, eligibility and source-backed travel privileges. Removed unsupported per-partner INR valuations and unsupported launch/fuel-waiver claims. Product page and milestone PDF differ on whether the INR1,200,000 threshold must be exceeded; the ambiguity is recorded. Validator: 370 cards/858 rules, zero errors/warnings, strict-ready 695/785 (88%). Numeric evidence coverage: fees 1,178/2,511; rewards 1,123/3,047; benefits 1,166/3,091; eligibility 586/611. Stamp audit: 9 mismatches remain. Next: SBI Club Vistara Prime.


### Credit-card validation continuation (2026-10-26, Club Vistara SBI Card PRIME)

Reviewed current SBI notices, PRIME T&C, SBI FAQ and Air India merger/Maharaja Club sources. Corrected issuance discontinuation date (28-Sep-2024), fee terms, rewards and exclusions; removed unsupported point/baggage values; recorded 1:1 point migration, benefit sunset on 31-Mar-2026 and inferred post-merger reward continuity explicitly. Validator remains 370 cards/858 rules, zero errors/warnings; strict-ready 695/785 (88%). This discontinued card is outside the active numeric-evidence coverage scope. Next: SBI Club Vistara.


### Credit-card validation continuation (2026-10-26, Club Vistara SBI Card)

Reviewed SBI notices, combined card T&C, SBI FAQ and Air India merger/Maharaja sources. Corrected stopped-issuance date, fees and waiver, points, eligibility age, lounge terms and benefit expiration; removed unsupported fixed point and baggage valuations. Post-merger earnings continuation is explicitly an inference. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 695/785 (88%). The discontinued card is outside active numeric-evidence coverage. Next: YES Paisabazaar RuPay.


### Credit-card validation continuation (2026-10-26, YES Bank PaisaSave RuPay)

Reviewed current RuPay product/rewards page, standard card eligibility page, listing and Oct-2026 MITC. Corrected 3.4% forex, no cash-advance facility, fuel waiver range/cap, RuPay variant fee status, eligibility and current 6%/1% cashback/UPI rules. Full MCC exclusions and 3,000-point statement cap were added. Product launch date/network tier and card-specific point expiry remain unknown; UPI fuel waiver wording conflict documented. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,047; benefits 1,170/3,092; eligibility 590/615. Stamp audit now 6 cards; next PNB Luxura RuPay.

### Credit-card validation continuation (2026-10-26, PNB LUXURA Metal RuPay)

Reviewed current product HTML, RuPay product sheet and FAQ, MITC, and January launch announcement. Corrected launch date, start dates, fee and eligibility data; restored RuPay-specific 40,000-point welcome offer while documenting conflicting 20,000-point HTML figure; removed unsupported realized point value and acceleration cap. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,047; benefits 1,170/3,092; eligibility 590/620. Stamp audit now 5 cards; next PNB LUXURA Visa.
### Credit-card validation continuation (2026-10-26, PNB LUXURA Metal Visa Infinite)

Reviewed PNB's live Visa page, Visa product sheet, shared FAQ, MITC and launch announcement. Confirmed Visa-only benefits, eligibility, fees and launch date; removed unsupported realized point value and unlimited 3X cap. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,047; benefits 1,170/3,092; eligibility 590/625. Stamp audit now 4 cards; next PNB RuPay Platinum.
### Credit-card validation continuation (2026-10-26, PNB RuPay Platinum)

Reviewed current PNB card/rewards pages, eligibility guide and MITC. Removed unsupported launch date, refreshed fees/reward terms and added verified age/income eligibility; documented generic INR0.50 versus card-specific INR0.25 point value conflict. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,047; benefits 1,170/3,092; eligibility 590/629. Stamp audit now 3 cards; next Union Divaa Icon.
### Credit-card validation continuation (2026-10-26, Union Bank DIVAA ICON)

Reviewed current Union Bank product page, latest MITC v1.4 and card-specific eligibility/benefits. Confirmed the INR1 lakh fee waiver against both sources; updated offers and insurance details; removed unsupported launch date and realized point value. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,046; benefits 1,170/3,094; eligibility 590/633. Stamp audit now 2 cards; next Union Nexteria.
### Credit-card validation continuation (2026-10-26, Union Bank NEXTERIA)

Reviewed current issuer product/eligibility pages and current MITC v1.4. Removed unsupported launch date and INR0.18 realized point value, updated premium benefits and annual/reward eligibility details. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,046; benefits 1,170/3,094; eligibility 590/635. Stamp audit now 1 card; next Union Unicorn.
### Credit-card validation continuation (2026-10-26, Union Bank Unicorn)

Reviewed current product, MITC and eligibility pages; archived current MITC. Added missing issuer-listed offers, removed unsupported launch date, and documented product-page �proposed� reward wording versus the current MITC schedule. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,046; benefits 1,170/3,094; eligibility 590/637. Stamp audit now reports 0 newer-verification mismatches; next Union RuPay Select.
### Credit-card validation continuation (2026-10-26, Union RuPay Select)

Rechecked current product page and MITC, superseding the migration-era audit. Confirmed fees, rewards, lounge/fuel benefits and insurance; removed unsupported launch date, realized value, MCC and fuel bounds. Logged unresolved eligibility conflict. Validator: 370 cards/858 rules, zero errors/warnings; strict-ready 697/785 (88%). Numeric evidence aid: fees 1,183/2,510; rewards 1,130/3,046; benefits 1,170/3,094; eligibility 590/637. Stamp audit: zero mismatches; next Union UNI Carbon.

## Union Bank UNI-CARBON (2026-10-26)

Current issuer page and MITC v1.4 reviewed. Updated primary annual fee and waiver, charges, HPCL reward cap/value, welcome benefit, fuel surcharge waiver, HP Pay offer, milestones and accident cover; unknown card-specific eligibility retained as unknown. Archived MITC under `docs/sources/union/uni-carbon/`. Validator: 370 cards, zero errors/warnings.


## BOBCARD Tiara (2026-10-26)

Reviewed current issuer product page, July 2026 feature revision, April 2026 rewards terms, annual report and generic MITC archive. Corrected network to RuPay, launch to 2024-09-29, finance charge to 3.75%, current lounge spend threshold, and reward value/caps; added current FITPASS and age criteria. Income, credit score, lounge change date and latest cash advance charge remain unresolved or partially sourced. Archived issuer PDFs under `docs/sources/bob/tiara/`. Validation: 370 cards, zero errors/warnings.

## HDFC Swiggy Ornge (2026-10-26)

Reviewed HDFC's current product page, Ornge-specific April 2026 terms, current cashback detail PDFs, co-branded MITC v3.9 and the joint Swiggy/HDFC launch announcement. Archived the latest card-specific T&C and co-branded MITC under `docs/sources/hdfc/`; older PDFs were preserved. Corrected launch date to the 2026-03-12 announcement proxy and network tier to Mastercard World, updated fees, cashback caps and minimums, exclusions, welcome benefit, golf and eligibility. Removed the unsupported INR 1,499 Swiggy One value. Kept the 3.5% forex markup at medium confidence because the current MITC omits a specific figure on the Ornge row. Logged the internal conflict between 12-month and 3-month Swiggy One statements, and the discrepancy between April terms and the separate February 1% MCC PDF; the later card-specific terms guide the structured exclusion list. No fixed credit-score cutoff, nationality-to-residency mapping or exact fuel surcharge waiver was promoted.

Validator: 370 cards/858 rules; zero errors/warnings; 697/785 strict-ready (88%). Numeric evidence-path audit: fees 1,202/2,510; rewards 1,150/3,043; benefits 1,186/3,095; eligibility 600/647. Stamp mismatch scan: 0. These are structural/provenance checks, not factual-accuracy rates. Next by oldest verification date: HSBC Taj.

### Credit-card validation continuation (2026-10-26, HSBC Taj)

Reviewed HSBC's current Taj product/rewards pages and six issuer PDFs. Corrected network, current INR110,000 joining/annual fees, 1.99% forex, 3.75% monthly finance rate, cash-advance fee, tiered reward earn and Taj Wallet redemption; rebuilt airport lounge access and current benefits; documented conflicting eligibility criteria in current product page versus card-specific Important Terms. Removed unsupported INR40,000 welcome value. Golf allowance text remains ambiguous about whether 12 games and lessons are a combined or separate allowance. `python scripts/validate.py`: 370 cards/859 reward rules, zero errors/warnings; 698/786 strict-ready (88%). Numeric evidence coverage aid: fees 1,208/2,510; rewards 1,156/3,045; benefits 1,196/3,096; eligibility 608/655. Stamp mismatch scan: zero. Next by oldest metadata date: IDFC FIRST EARN.
 
### Credit-card validation continuation (2026-10-26, IDFC FIRST EARN)

Reviewed the current product page, 20-Jan-2025 launch release, current MITC, zero-forex notice, E-Kit and July 2026 privilege document. Corrected launch date, limited-time joining fee, annual waiver, 0% forex effective 17-Sep-2026, cashback, eligibility, movie offer, roadside assistance and four insurance covers. Removed the unsupported MCC 6513 exclusion and stale fuel surcharge-waiver details; the current page confirms fuel earns cashback. MITC cash-advance fee is flat INR199, not representable in percentage-based schema; exact fee kept in source notes. Validator: 370 cards/860 rules, zero errors/warnings; strict-ready 698/786 (88%). Numeric evidence-path coverage: fees 1,222/2,511; rewards 1,170/3,051; benefits 1,207/3,100; eligibility 610/657. Stamp mismatch scan: zero. Next by oldest metadata date: IDFC FIRST Select.


## IDFC FIRST Select (2026-10-26)

Reviewed the current issuer product page, current Product Usage Guide, and the January reward / April lounge update. Corrected reward base, bonus categories, airport and railway lounge quotas, joining offers, fuel waiver, movie terms, income threshold and fee details. Recorded source conflicts about point expiry, lounge spend timing and travel bonus rate. Validator: 370 cards/860 rules, zero errors/warnings; 698/786 strict-ready (88%). Numeric evidence aid: fees 1,228/2,507; rewards 1,176/3,049; benefits 1,218/3,102; eligibility 612/659. Stamp audit: zero mismatches. Next oldest metadata: CRED IndusInd Bank RuPay.


## CRED IndusInd Bank RuPay (2026-10-26)

Reviewed the current issuer product/rewards page, 15-Sep-2025 launch announcement, 13-Oct-2026 consolidated MITC and current fuel waiver terms. Corrected launch date, annual fee, interest charge, card reward structure and redemption, 24-month expiry, fuel waiver limits and total-protect coverage; numeric eligibility remains unpublished. Validator: 370 cards / 862 rules, zero errors/warnings; 701/788 strict-ready (89%). Numeric evidence aid: fees 1,234/2,507; rewards 1,184/3,054; benefits 1,221/3,102; eligibility 612/659. Stamp audit: zero mismatches. Next oldest metadata: IDFC FIRST SWYP.


## IDFC FIRST SWYP (2026-10-26)

Reviewed the current issuer product page, official launch release, current card communication with June/July updates, privileges terms, general MITC and travel bonus terms. Corrected launch/network, zero forex, EMI/cash advance fee model, monthly milestone rewards, renewal/welcome offers, current fuel/movie/rail/lounge/insurance/referral benefits. Eligibility cutoffs and Mastercard tier remain unpublished; flat cash fee/referral waiver/variable EMI rate require notes due schema limits. Validator: 370 cards/861 rules, zero errors/warnings; 702/787 strict-ready (89%). Numeric evidence aid: fees 1,239/2,499; rewards 1,188/3,051; benefits 1,264/3,139; eligibility 612/659. Stamp audit: zero mismatches. Next oldest metadata: IDFC FIRST WOW! Black.


## IDFC FIRST WOW! Black (2026-10-26)

Reviewed the current issuer product page, official launch release, current card privileges and customer MITC. Corrected launch/network, fee and cash-advance representation, reward rates/redemption values, lounge quota, current welcome/fuel/movie/insurance benefits and secured eligibility. Hotel/flight bonus interpretation and lounge qualification-month wording remain ambiguous in issuer copy. Validator: 370 cards/864 rules, zero errors/warnings; 705/790 strict-ready (89%). Numeric evidence aid: fees 1,244/2,497; rewards 1,198/3,063; benefits 1,287/3,155; eligibility 614/661. Stamp audit: zero mismatches. Next oldest metadata: IDFC FIRST Wealth.


## IDFC FIRST Wealth (2026-10-26)

Reviewed current Wealth product page, January and May card communications, travel-rewards T&Cs, current privileges and customer MITC. Corrected Visa tier, fees, reward base/categories and same-day international-reward change, lounge/movie/golf/fuel/insurance terms and eligibility. Issuer contradictions remain on international rewards (dated footnote vs stale copy), railway lounge quota, and app travel bonus math. Validator: 370 cards/864 rules, zero errors/warnings; 705/790 strict-ready (89%). Numeric evidence aid: fees 1,248/2,490; rewards 1,209/3,066; benefits 1,308/3,166; eligibility 616/663. Stamp audit: zero mismatches. Next oldest metadata: IndusInd Celesta.


## IndusInd Celesta (reviewed 2026-10-26)

The issuer's current Celesta pages and consolidated MITC show a current American Express product with INR25,000 joining and INR5,000 annual fees, INR10 lakh annual spend waiver, 2.99% monthly finance, 3.5% forex, 1 domestic point/INR100 and 3 international points/INR100. Corrected prior Visa Infinite assignment, fees, rewards and benefits. Domestic lounge access is unlimited behind INR150,000 preceding-quarter spend; international allowance is 2 visits/quarter; golf is 1 game and 1 lesson per month. Exact launch date, numeric eligibility, current fuel waiver band/cap and full reward exclusions were not verified. Cash credit is INR0.75/point, but exemption from the redemption fee is not clear. Validator: 370 cards/865 rules, zero errors/warnings; 706/791 strict-ready. Numeric evidence audit: fees 1,255/2,491; rewards 1,213/3,066; benefits 1,311/3,165; eligibility 616/663. Stamp audit: zero mismatches. Next selected oldest record: IndusInd Crest (2026-07-03).


## IndusInd Crest (reviewed 2026-10-26)

Current issuer pages, FY2026-27 issuance policy and current MITC, lounge, golf and fuel documents exposed major stale values. Updated Mastercard World Elite network, joining/annual fees and spend waiver, forex/APR/cash advance, rewards/redemption, lounge access, fuel-waiver and golf benefits. The domestic lounge requires INR500,000 preceding-quarter spend; domestic and international allowances are both 2 visits/quarter. Golf allowance is 2 games and 2 lessons/month per the dated product update and current shared terms, despite the live Crest golf subpage still saying 3. Set status on-hold based on its omission from the active issuance list while current product/benefit pages remain live; not classified discontinued. Exact launch date, income period/split and credit-score cutoff remain unknown. Validator: 370 cards/865 rules, zero errors/warnings; 704/789 strict-ready. Numeric audit: fees 1,255/2,485; rewards 1,213/3,059; benefits 1,311/3,158; eligibility 616/663. Stamp audit: zero mismatches. Next oldest active record: IndusInd Duo (2026-07-03).


## IndusInd Duo (reviewed 2026-10-26)

Duo is on-hold because new sourcing has been discontinued. Corrected base reward to 1 point/INR150, cash credit INR0.75/point and 2,500/month cash-redemption cap; issuer sources conflict on whether monthly 2,500 is also an earning cap. Corrected the fuel waiver and monthly BOGO movie cap. Product page's 2% forex and INR249 issuance fee conflict with MITC defaults/fee table. Validator: 370 cards / 865 rules, zero errors/warnings; 704/788 strict-ready. Numeric evidence: fees 1,255/2,479; rewards 1,213/3,054; benefits 1,311/3,155; eligibility 616/663. Stamp audit: zero mismatches.


## IndianOil Kotak (reviewed 2026-10-26)

Kotak current KFS/MITC and product/reward/eligibility pages verified fees/APR/forex, rewards, redemption, fuel waiver, welcome benefit and applicant age. Corrected grocery point cap, fuel waiver cap, cash redemption and unsupported network tier/launch date. Validator: 370 cards/865 rules, zero warnings/errors; 704/788 strict-ready. Evidence-path audit: fees 1,262/2,479; rewards 1,222/3,055; benefits 1,316/3,155; eligibility 616/665. Stamp audit zero mismatches.


## IndusInd Iconia Amex (reviewed 2026-10-26)

Current MITC classifies Iconia discontinued and live product page says new sourcing stopped. Corrected weekday/weekend reward rates, redemption/cap, current fee snapshot, fuel waiver, eligibility income. Removed unsupported lounge quota, golf, welcome gift and air-accident cover. Validator: 370 cards/865 rules, zero errors/warnings; 702/786 strict-ready. Numeric evidence: fees 1,262/2,472; rewards 1,222/3,048; benefits 1,316/3,145; eligibility 616/665. Stamp audit zero mismatches.


## IndusInd Indulge (2026-10-26)

Current issuer terms materially corrected fees, rewards, lounge access, golf, fuel waiver, BMS offer and eligibility; unsupported 2011 launch date removed. Five issuer PDFs archived under `docs/sources/indusind/indulge/`. Cash-redemption fee applicability follows the consolidated MITC; exact launch date and public age/bureau cutoffs remain unknown. The issuer-wide 2026 reward update table conflicts in wording with the card-specific cash redemption cap and benefit guide; recorded cap applies to cash redemption only. See the IndusInd source index and checklist.


## IndusInd Jio-bp Mobility+ (2026-10-26)

Current card page, consolidated MITC, fuel-waiver table, benefit guide and Jio-bp launch release were reviewed and archived. Corrected unsupported launch date, network tier, conditional joining fee, finance charge, reward tiers/cap/exclusions, redemption valuation, welcome coupon and annual milestone structure. Documented the 30-day vs 90-day joining-fee conflict and the waiver table?s lack of a Jio-bp-specific row. See `docs/sources/indusind/INDEX.md` and the continuation checklist.


## YES Bank ACE (2026-10-26)

Reviewed current rendered ACE product-page text, YES Bank MITC v18 dated 2026-10-05 and the June 2026 card-features update. Updated current rewards (8/4/2 points per INR200), statement and MCC caps, exclusions, redemption/expiry, fee-waiver terms, APR/forex/cash advance, fuel waiver and published eligibility. Cleared unsupported network/tier and exact launch date. Purchase-protection numeric coverage remains unknown; no cover amount was inferred. The rendered-page capture limitation and current facts are recorded in `docs/sources/yes/ace/ace-page-rendered-extract.md`; two source PDFs are archived and signature-checked. Validator: 370 cards, 878 rules, 792 strict scope, 727 strict-ready, zero errors/warnings. Numeric evidence-path coverage: fees 1,390/2,464; rewards 1,377/3,078; benefits 1,515/3,212; eligibility 633/684. Stamp audit: zero mismatches.


## YES Bank AI Inside RuPay (2026-10-26)

Current rendered issuer page and current MITC v18 were reviewed. Removed unsupported 1% universal cashback, obsolete MCC exclusion, RuPay Platinum tier and exact launch date. The page only says ?up to 3% assured cashback? and does not publish its schedule or caps; the general cashback rate remains unknown. Confirmed zero membership fees, 3.99% monthly finance, no foreign-currency/DCC conversion fee for the virtual RuPay variant, existing-cardholder eligibility and published cashback exclusions. Updated fuel waiver to the INR400?5,000 band and INR125 statement cap; the UPI fuel waiver language remains internally ambiguous. Cash-advance fee is not applicable to virtual cards, but cash-withdrawal feature availability is not established. Validator: 370 cards/878 rules; 792 strict scope, 728 strict-ready (92%), zero errors/warnings. Numeric coverage: fees 1,394/2,462; rewards 1,379/3,076; benefits 1,519/3,213; eligibility 633/684. Stamp audit: zero mismatches. See `docs/sources/yes/INDEX.md`.


## YES Bank AI Inside (2026-10-26)

Current rendered issuer page and MITC v18 were reviewed. The page advertises up to 3% cashback but does not disclose the schedule/caps; removed the prior 1% general rate and unsupported historic exclusions. Cleared unsupported Mastercard/Platinum and exact launch date. Confirmed lifetime-free fees, 3.99% monthly finance, zero FX/DCC, cash-advance fee waiver, and fuel waiver at INR400?5,000 with INR750 statement cap. Eligibility and network are not established on the current rendered page. Validator: 370 cards/878 rules, 792 strict scope, 729 strict-ready (92%), zero errors/warnings. Numeric coverage: fees 1,398/2,460; rewards 1,381/3,074; benefits 1,523/3,214; eligibility 633/684. Stamp audit: zero mismatches.


## YES Bank Anq Phi (2026-10-26)

Current rendered issuer page, issuer-indexed Phi product guide, current MITC v18 and the June-2026 fee/feature update were reviewed. Corrected fees/waiver, forex 3.5% (June notice; MITC table's 3.4/3.5 row remains ambiguous), APR/cash advance, category-based rewards, point value/redemption limits, 3 international lounge visits/year and revised fuel band/cap. Cleared unsupported network/tier and exact launch date; numeric eligibility cutoffs remain unpublished. The product guide PDF download returned a JavaScript shell; indexed issuer text is archived as an extract, not treated as a signed source PDF. Validator: 370 cards/879 rules; 793 strict scope, 731 strict-ready (92%), zero errors/warnings. Numeric coverage: fees 1,405/2,461; rewards 1,387/3,075; benefits 1,529/3,215; eligibility 633/684. Stamp audit: zero mismatches.


## IndusInd Nexxt follow-up reconciliation (2026-10-26)

Rechecked the issuer's launch release against the earlier card record and corrected the launch date to 2018-11-14. Current card and rewards terms disagree on POS Pay-by-Rewards value (INR 1 vs INR 0.75 per point); general POS point value remains unknown and cash credit stays INR 0.75 per point. Cleared unsupported resident-only eligibility and uncapped-earning claims; the current bank update lists a 2,500 monthly-points figure without distinguishing earning from redemption. A bank notice says personal air-accident cover was discontinued effective 2025-12-21, so the stale live-page amount is not encoded as a current benefit. Evidence extract: `docs/sources/indusind/nexxt/nexxt-evidence-extract-2026-10-26.md`.

## Axis Miles & More World (2026-10-26)

Reviewed current Axis World product page, World terms, June-2025 rewards update, current MITC and 2013 launch release. Corrected earn to 4 Award Miles/INR 200; set unsupported fixed INR mile values to unknown; updated fees, eligibility, welcome/renewal miles, current reward exclusions and expiry conditions. Domestic airport access is 4 visits/quarter subject to the INR 50,000 previous-three-calendar-month spend rule, and Priority Pass allows 2 visits per membership year; guests are charged. Current page and MITC conflict on monthly finance rate (3.7% vs 3.75%). Insurance categories are described but monetary limits are not established in current issuer material. Archived issuer evidence under `docs/sources/axis/miles-more/`.

## Axis Google Pay Flex (2026-10-26)

Reviewed current Axis product page, current linked card-specific terms, reward structure effective 2026-10-16, bankwide terms update effective 2026-08-28, current MITC and issuer launch release. Replaced stale fee/reward data, restored fuel eligibility, removed unsupported MCC 6513 and RuPay Platinum tier, and documented current Google Pay-funded promotion terms separately from base issuer earn. Stars are INR 1 each, capped at 1,500 per reward cycle (up to 750 from Axis), with one-year expiry. The welcome reward headline is now INR 1,750 Stars plus INR 250 gift card, but remains offer-dependent. The exact INR 50,000 late-payment fee boundary is ambiguous between issuer prose and tables and remains documented.

Current global checks after this review: 370 cards, 884 reward rules, 793 active/invite-only strict scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage: fees 1,515/2,462 (62%), rewards 1,483/3,047 (49%), benefits 1,615/3,236 (50%), eligibility 661/714 (93%); verification-date mismatches: zero. These checks do not establish a dataset-wide factual-accuracy rate. Next in the oldest remaining active/invite-only queue is Axis IndianOil Premium, with 65 other records also last verified 2026-07-05.


## Axis IndianOil Premium (2026-10-26)

Reviewed current product page and linked card terms, June-2025 reward exclusion update, current domestic lounge program and IOCL outlet list, current MITC, EDGE Rewards FAQ and fee notices. Corrected the grocery cap to 33 total miles; corrected the fuel band to 6 total miles per INR 150 up to INR 15,000 monthly at authorized IOCL outlets, then base only. Removed unsupported RuPay/Select and 2020-01-01 launch fields, removed MCC 6513, and encoded current category-based exclusions. Network, network tier and exact Premium launch date remain unknown; the 2019 launch release is for the predecessor standard card. Documented fee-waiver threshold conflict (current linked page/terms: INR 30,000; separately indexed old-domain terms: INR 100,000 for issue dates after 2024-07-01), fee-waiver exclusion conflict, and returned-payment fee conflict (current page INR 450 minimum vs dated Dec-2024 notice INR 500). Added the INR 50,000 prior-three-calendar-month lounge gate. Current reward routes include INR 1/mile on specified IOCL fuel and Pay by Rewards redemption; partner/catalogue value varies.

Current global validation after this review: 370 cards, 884 reward rules, 793 active/invite-only strict scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage: fees 1,528/2,474 (62%), rewards 1,495/3,050 (49%), benefits 1,620/3,233 (50%), eligibility 663/716 (93%); verification-date mismatches: zero. This is not a factual-accuracy percentage. Evidence extract and PDFs are under `docs/sources/axis/indianoil-premium/`. The oldest remaining cohort has 65 cards last verified 2026-07-05; next by path order is Axis IndianOil (`data/cards/axis/indianoil.yaml`).


## Axis IndiGo Premium (2026-10-26)

Reviewed current Axis product page, current linked card-specific terms, 2026-08-28 terms update, double-welcome campaign, launch press release, current MITC and domestic lounge program. Corrected lounge access to two international visits/year and two domestic visits/quarter after INR 50,000 eligible preceding-three-month spend; corrected BOGO movie terms, reward exclusions, BluChip rates and fees/eligibility. Removed unsupported fuel surcharge waiver and INR 0.60/0.45 point-value estimates because IndiGo BluChips have no monetary value. Added effective November 1 movie spend gate, temporary double-welcome campaign and the campaign PDF vs product page start-date conflict. The launch release identifies both RuPay and Visa; network and tier remain unknown for a scalar record. Source extract and PDFs: `docs/sources/axis/indigo-premium/`. Validator: 370 cards, 884 reward rules, 793 strict scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric coverage: fees 1,537/2,475; rewards 1,511/3,045; benefits 1,644/3,228; eligibility 669/722. Stamp audit: zero mismatches.


## Axis LIC Platinum (2026-10-26)

Reviewed current Axis product page, LIC catalogue, category-exclusion revision and 2026-08-28 terms update. Updated fees, LIC reward rates/currency, exclusions, redemption conditions, fuel waiver and eligibility; unknowns (network, exact launch date, point valuation, insurance limit and income/score cutoffs) remain null. Validation is clean: 370 cards, 884 reward rules, 793 strict scope, 749 strict-ready (94%). Numeric evidence coverage: fees 1,541/2,475; rewards 1,516/3,043; benefits 1,648/3,227; eligibility 671/724. Stamp mismatches: zero. This measures evidence-path coverage, not factual accuracy.


## Axis LIC Signature (2026-10-26)

Current Axis product page, 2025 exclusion notice, current lounge program, LIC catalogue, 2026-08-28 terms update and current MITC were reviewed. Corrected reward currency/rates, exclusions, redemption, lounge gate/quota, fuel waiver, fees and eligibility. Captured the redemption fee conflict and product-page vs current lounge-program difference. Validation clean: 370 cards, 884 reward rules, 793 strict scope, 749 strict-ready (94%). Numeric evidence paths: fees 1,545/2,475; rewards 1,521/3,041; benefits 1,654/3,226; eligibility 673/726. Stamp mismatches: zero. Coverage is not factual accuracy.


## Axis RuPay generic landing page (2026-10-26)

Reviewed the current Axis RuPay variant page, current shared MITC and 2026-08-28 issuer-wide terms. Removed unsupported launch date, RuPay Platinum tier, generic EDGE reward valuation and MCC exclusion; variant-dependent details remain unknown. Documented DCC discrepancy (generic page 1.5%; later issuer update 3.5%). Validator passes: 370 cards, 884 reward rules, 793 strict scope, 749 strict-ready (94%). Numeric evidence paths: fees 1,549/2,473; rewards 1,521/3,037; benefits 1,654/3,226; eligibility 673/726; stamps zero. These do not quantify factual accuracy.


## Samsung Axis Bank Signature (2026-10-26)

Reviewed current card page, current card terms, lounge program, MITC, 2026-08-28 update and issuer launch announcement. Updated fees, EDGE rewards, Samsung cashback, lounge quota/gate, fuel waiver and eligibility; cleared unsupported realized point estimate and numeric MCC assertion. Fuel band upper limit conflicts in issuer page; modeled detailed INR4,000 band and documented INR5,000 summary. Validator clean: 370 cards, 884 rules, 793 strict scope, 749 strict-ready (94%). Numeric evidence coverage: fees 1,554/2,473; rewards 1,528/3,037; benefits 1,662/3,226; eligibility 675/728; stamps zero.


## Axis Bank Shoppers Stop (2026-10-26)

Reviewed current product page, card-member terms, MITC, Aug-2026 bankwide terms and Dining Delights PDF. Updated fee waiver, First Citizen rates/value/redemption, exclusions, welcome vouchers, fuel waiver and eligibility; removed unsupported Visa Platinum network/tier and MCC 6513. The EazyDiner offer is on the live product page but linked PDF offer period expired June 2024; noted unresolved. Validator clean: 370 cards, 884 rules, 793 strict scope, 749 strict-ready (94%). Numeric evidence coverage: fees 1,559/2,473; rewards 1,536/3,037; benefits 1,669/3,226; eligibility 677/730; stamps zero. Coverage does not measure accuracy.


## 2026-10-26: Axis SpiceJet Voyage Black

Reviewed current issuer materials and corrected stale finance, lounge, reward-source and eligibility data. Unsupported Visa Signature tier and MCC 6513 cleared. Conflicting lounge-count statements and conditional Gold membership earn documented. Dataset validator: 370 cards, 884 reward rules, 793 strict-scope, 749 strict-ready (94%), zero errors/warnings. This single-record review is not a dataset-wide accuracy estimate. Evidence: docs/sources/axis/spicejet-voyage-black/.


## 2026-10-26: Axis SpiceJet Voyage

Reviewed current issuer materials and corrected finance, annual-fee schedule, lounge access, reward and eligibility fields. Cleared unsupported Visa Platinum tier and MCC 6513; documented the precise lounge spend-period wording difference. Validator: 370 cards, 884 reward rules, 793 strict-scope, 749 strict-ready (94%), no errors/warnings. This card review does not establish dataset-wide factual accuracy. Evidence: docs/sources/axis/spicejet-voyage/.


## 2026-10-26: BOBCARD Scapia

Reviewed current issuer product page, Scapia-specific MITC/KFS and cardholder agreement. Corrected finance, zero-fee/forex details, fuel waiver, lounge, reward and coin redemption terms, and eligibility. Cleared unsupported launch date, Visa Signature tier and MCC 6513. Visa/RuPay variants have different rate/minimums; conservative RuPay base is structured. Validator: 370 cards, 883 rewards, 792 strict-scope, 748 strict-ready (94%), zero errors/warnings. Numeric coverage is not factual accuracy. Sources: docs/sources/bob/scapia/.


## BOBCARD Uni GoldX (2026-10-26)

Reviewed current BOBCARD product page, Uni GoldX MITC v9/KFS, Uni BOB rewards MITC and current Uni partner materials. Corrected finance to 3.99% monthly, cash advance fee minimum to INR300, fuel waiver to 1% up to INR7,500 capped at INR500/statement, Uni Coin earn/value, current age/residency eligibility, and removed unsupported Visa Platinum, 2024 launch date and MCC 6513. Recorded the KFS's INR100 GoldX UPI minimum versus broader product-page language and the distinction between card-MITC redemptions and Uni partner app gold redemption. Validator clean: 370 cards, 883 rules, 792 strict scope, 748 strict-ready (94%). Numeric evidence paths: fees 1,579/2,473; rewards 1,564/3,035; benefits 1,701/3,227; eligibility 683/738; stamp mismatches zero. These evidence-path measures do not establish factual accuracy across the library. Sources: `docs/sources/bob/uni-goldx/`.


## Bank of India RuPay Select (2026-10-26)

Reviewed the current BOI product page, Star Rewards page, official indexed MITC schedule, RuPay Select credit lounge terms and archived BOI brochure. Updated fee/eligibility details and cleared unsupported forex/finance rates, fuel waiver, point valuation, exact launch date and MCC exclusion. Documented BOI-source finance-rate conflicts, point-value absence, ambiguous card-wise reward bonus/standard/preferred stacking and source-page exclusions wording conflict. Direct BOI site/PDF retrieval returned HTTP 403; cited issuer search-index content and preserved the access limitation in the source extract. Validator clean: 370 cards, 883 rules, 792 strict scope, 748 strict-ready (94%). Numeric evidence paths: fees 1,583/2,471; rewards 1,564/3,032; benefits 1,705/3,223; eligibility 684/739; stamp mismatches zero. These evidence-path metrics do not establish database-wide factual accuracy. Sources: `docs/sources/boi/`.


## HSBC Premier Credit Card (reviewed 2026-10-27)

Reviewed current HSBC Premier product/rewards/fees pages, card MITC, welcome-offer T&Cs, HSBC Rewards terms, Travel with Points campaign and insurance conditions. Updated the waiver relationship condition, fees and current offers. Removed unsupported Mastercard World Elite tier, launch date, golf quota and numeric insurance limits. Refreshed Premier rewards at 3 points/INR100, published airline/hotel ratios and card MCC exclusions. Removed unsupported partner INR valuations; point values are redemption-specific and the current page advertises INR1 per point for Apple. Current travel portal offer: 6X flight and 12X hotel bookings through 2026-12-31; car-rental multiplier is unresolved due to conflicting issuer pages. Current welcome offer is 20,000 points subject to first transaction in 30 days and offer eligibility. Sources and open issues: `docs/sources/hsbc/premier/`.

After this review: 370 records, 884 reward rules, 793 strict-scope, 754/793 strict-ready (95%), validator 0 errors/warnings; explicit numeric evidence paths: fees 1,632/2,468, rewards 1,671/3,042, benefits 1,767/3,223, eligibility 707/763; stamp mismatches 0. These are coverage/structure measures, not a database factual-accuracy score.


## HSBC RuPay Platinum Credit Card (reviewed 2026-10-27)

Reviewed current HSBC card/rewards pages, card-specific MITC, Service Guide, KFS, welcome offer and EazyDiner terms. Updated monthly interest to 3.75%; current reward earn to 2 points/INR150; travel portal up to 6X with an 18,000 accelerated-points monthly cap; partner ratios and three-year Platinum point validity; current welcome offer requirements; fuel waiver and card eligibility. Removed estimated point INR values and the unsupported launch date. The record reflects RuPay domestic/UPI use plus JCB international acceptance in notes; the schema cannot encode both networks. Current sources and unresolved issues are in `docs/sources/hsbc/rupay-platinum/`.

After the review: 370 cards, 885 reward rules, 794 strict scope, 755/794 strict-ready (95%), validator zero errors/warnings; numeric evidence-path coverage fees 1,638/2,468, rewards 1,676/3,041, benefits 1,775/3,224, eligibility 713/769; stamp mismatches 0. These are schema/provenance measures, not a factual-accuracy score.


## HSBC Visa Platinum Credit Card (reviewed 2026-10-27)

Reviewed current HSBC product/rewards pages, card-specific MITC, Service Guide, KFS, current welcome, EazyDiner, fuel contactless, District and shared Rewards Terms. Corrected finance charges to 3.75% per month, removed unsupported launch date, refreshed current rewards and partner ratios, removed speculative point-INR estimates, updated welcome/merchant/fuel benefits and eligibility. Current issuer card page and dedicated Visa Platinum eligibility page conflict over minimum income and city coverage; structured data follows the current product card page, and both sources are recorded. Visa Signature privileges appear on the product page but issued network tier is not explicit; tier is null. Source archive: `docs/sources/hsbc/visa-platinum/`.

After review: 370 records; 887 reward rules, 796 strict scope, 757/796 strict-ready (95%), validator 0 errors/warnings; explicit numeric evidence coverage fees 1,644/2,468, rewards 1,683/3,042, benefits 1,784/3,226, eligibility 719/775; stamp mismatches 0. These measures do not imply database-wide factual accuracy.


## ICICI Emirates Emeralde Credit Card (reviewed 2026-10-27)

Reviewed the current card page/FAQ, card-specific PDF terms (dated 30-Sep-2025), current MITC (dated 9-Oct-2026), active INICI26 promo conditions and official 2022 launch announcement. Corrected launch date to the issuer announcement; cleared current network and tier scalars because the current card page does not reconfirm them. Confirmed ?10,000 joining/annual fee, 3.5% forex markup, 3.75% monthly finance rate, 2 Skywards Miles/?100 eligible retail spend, category exclusions, 48-hour post-statement posting and program-governed three-year miles validity. Removed unsupported ?0.9 nominal and ?0.65 realized mile values. Updated joining/annual miles and Silver conditions, Gold milestone, lounge access/provider split, fuel waiver, BookMyShow spend gate and current Emirates discount campaign.

Unresolved: product page text and image alt text disagree on self-employed minimum annual income (?30 lakh vs ?45 lakh); structured value is null. The card page advertises up to four monthly BookMyShow uses with a ?750 second-ticket cap and a ?25,000 preceding-quarter spend gate, but generic linked ICICI BookMyShow terms do not explicitly name the Emirates Emeralde variant; exact entitlement/count remains unclear. Current product-specific 2 miles/?100 is followed over the general Emirates page's 2.5 miles/?100. No fixed rupee value for Skywards Miles is encoded. Source evidence and conflict details are in `docs/sources/icici/emirates-emeralde/`.

Validation after review: 370 cards, 887 reward rules, 796 strict scope, 757/796 strict-ready (95%), validator 0 errors/warnings; explicit numeric evidence paths: fees 1,665/2,468 (67%), rewards 1,685/3,039 (55%), benefits 1,791/3,225 (56%), eligibility 720/776 (93%); stamp mismatches 0. These measures do not quantify factual accuracy across unreviewed records.


## ICICI Emirates Rubyx Credit Card (reviewed 2026-10-27)

Reviewed current ICICI product/FAQ and card-specific T&C (30-Sep-2025), October 2026 MITC, current linked BookMyShow offer T&C, INICI26 promo terms, and official 2022 launch announcement. The issuer states applications are currently not being accepted, so status is on-hold. Corrected 1 mile/?100 eligible retail spend (card-specific sources; generic Emirates overview still says 1.5), reward exclusions, fee terms, domestic lounge access (one/quarter after ?75,000 prior-quarter spend, primary cardholder only; no international access), BookMyShow threshold, monthly movie frequency, fuel range, Blue tier and eligibility. Removed estimated Skywards mile INR values. Cleared network/tier because current issuance is not reconfirmed.

Unresolved: generic Emirates landing page still gives 1.5 miles/?100 against current card-specific 1; product FAQ suggests application routes while a current notice says applications are not being accepted; historical launch material establishes Visa but the live page does not confirm current network/tier. Source extract at `docs/sources/icici/emirates-rubyx/issuer-extract-2026-10-27.md`.


After the Rubyx review: 370 card records; 887 reward rules, 795 strict scope, 756/795 strict-ready (95%); validator 0 errors/0 warnings; explicit numeric evidence paths fees 1,663/2,445 (68%), rewards 1,685/3,034 (56%), benefits 1,791/3,218 (56%), eligibility 720/776 (93%); stamp mismatches 0. Rubyx is on-hold and therefore excluded from active/invite-only strict-scope statistics. These are structural/traceability metrics, not accuracy measures.


## ICICI Emirates Sapphiro Credit Card (reviewed 2026-10-27)

Reviewed current ICICI product/FAQ, card-specific T&C dated 30-Sep-2025, current MITC dated 9-Oct-2026, linked BookMyShow terms, active INICI26 promo and official 2022 launch announcement. Confirmed ?5,000 joining/annual fee, 1.5 Skywards Miles/?100 eligible retail spend, zero-earn categories, 5,000 joining/annual miles and Silver status conditions, 2 domestic lounge visits per quarter after ?75,000 preceding-quarter spend, 2 international visits/year, BookMyShow ?25,000 preceding-quarter threshold, fuel waiver and published eligibility. Removed estimated INR mile values and unsupported MCC-only exclusion. Cleared current network/tier scalars because live product page does not reconfirm them.

Unresolved: card rate table and card-specific T&C say 1.5 miles/?100 while the same product page FAQ says ?up to 2? and the broad Emirates overview says 2; specific T&C and rate table are followed. A generic card-specific T&C clause mentions Gold Tier activation without a Sapphiro qualifying threshold; current Sapphiro page does not advertise a Gold milestone, so no milestone was encoded. Historical launch source identifies Visa as network partner but does not prove current issued network tier. Source details in `docs/sources/icici/emirates-sapphiro/issuer-extract-2026-10-27.md`.


After the Sapphiro review: 370 card records; 887 reward rules, 795 strict scope, 756/795 strict-ready (95%); validator 0 errors/0 warnings; numeric evidence coverage fees 1,684/2,445 (69%), rewards 1,687/3,031 (56%), benefits 1,804/3,220 (56%), eligibility 722/778 (93%); stamp mismatches 0. These remain structural/traceability measures, not accuracy measures.


## ICICI Parakram Select Credit Card (reviewed 2026-10-27)

Compared the current product page and detailed FAQ, linked card-specific T&C, current MITC and ICICI Rewards FAQ. Refreshed fees, rewards/exclusions, redemption, lounge, golf, insurance, fuel and eligibility notes; removed unsupported launch date/network/tier and fixed point-INR values. The current page/FAQ says two international lounge visits/year, while card T&C says one; live detailed golf FAQ caps at one/month while T&C says four. Current product details are encoded and discrepancies documented in `docs/sources/icici/parakram-select/issuer-extract-2026-10-27.md`.

Validation: 370 records; 887 reward rules, 795 strict scope, 756/795 strict-ready (95%); zero errors/warnings. Numeric evidence coverage fees 1,688/2,445 (69%), rewards 1,689/3,028 (56%), benefits 1,811/3,220 (56%), eligibility 722/778 (93%). Stamp mismatches 0. These measures are not factual accuracy rates. Current file recount finds 38 active/invite-only records last verified 2026-07-05; next by path order is ICICI Emeralde Private Metal.


## ICICI Emeralde Private Metal Credit Card (reviewed 2026-10-27)

Compared current product page/FAQ, card-specific T&C updated 21-May-2026, current MITC, iShop FAQ/cap PDF and current ICICI Lombard group insurance policy. Cleared unsupported launch/network/tier; refreshed fee, reward, redemption, benefit, insurance and age eligibility terms; removed unsupported point values, Air India transfer estimate and unsupported INR5,000,000 travel-medical limit. Documented unresolved iShop multipliers, insurance reward-cap conflict and differing insurance activity windows. Evidence archived in `docs/sources/icici/emeralde-private-metal/`.

Validation: 370 records; 884 reward rules, 792 strict scope, 753/792 strict-ready (95%); zero errors/warnings. Numeric evidence coverage fees 1,693/2,445 (69%), rewards 1,693/3,025 (56%), benefits 1,816/3,221 (56%), eligibility 724/780 (93%). Stamp mismatches zero. These are coverage/structure figures, not factual accuracy. Current oldest cohort: 37 active/invite-only cards last verified 2026-07-05; next by path is ICICI Emeralde.


## ICICI Emeralde Credit Card (reviewed 2026-10-27)

Compared the live card product page/FAQ, linked membership guide, current MITC and general terms, golf terms, linked group insurance policy and cancellation claim process. Updated current fees and spend waiver, reward earn rates, unlimited primary-cardholder lounge access, spend-gated golf and BookMyShow, fuel waiver, cancellation offer, air-accident cover and eligibility. Cleared unsupported Mastercard World Elite tier and 2017 launch date; current network variants are multiple and one aggregate network value is not established. Removed fixed point values, stale iShop multipliers, unsupported MCC exclusions, unlimited lounge guests and unsupported INR5,000,000 travel-medical coverage. Cash-advance fee is omitted because readable current issuer tariff evidence did not establish the card-specific fee. Birthday eligibility differs between the product panel and FAQ; insurance activity wording differs between the card FAQ (60 days) and group policy (90 days). Source copies and claim-level comparison: `docs/sources/icici/emeralde/issuer-extract-2026-10-27.md`.

After review: 370 records, 881 reward rules, 789 strict scope, 750/789 strict-ready (95%); zero validator errors/warnings. Numeric evidence paths: fees 1,696/2,443 (69%), rewards 1,695/3,016 (56%), benefits 1,822/3,219 (57%), eligibility 728/784 (93%); stamp mismatches 0. These measures do not establish factual accuracy for the unreviewed library. Next by oldest-cohort path: ICICI MakeMyTrip (`data/cards/icici/mmt.yaml`); 36 active/invite-only records remain at 2026-07-05.


## MakeMyTrip ICICI Bank Credit Card (reviewed 2026-10-27)

Reviewed the current ICICI product page/FAQ, card-specific T&Cs, current MITC, official 2024-10-03 launch release, MakeMyTrip partner page and current BookMyShow offer. Corrected dual Mastercard/RuPay modeling, launch date, annual waiver conditions, closed-loop myCash classification/value, current rates and insurance cap, lounge access/spend gate, vouchers, membership, movie offers and eligibility. Removed the unsupported MCC exclusion and cash-advance fee/minimum. Documented forthcoming 2026-11-10 reward/expiry terms, partner zero-forex announcement versus the current issuer 0.99% page, BookMyShow threshold-boundary discrepancy and INOX quota uncertainty. Evidence and source copies are in `docs/sources/icici/mmt/issuer-extract-2026-10-27.md`.

After review: 370 records, 882 reward rules, 790 strict scope, 754/790 strict-ready (95%); zero validator errors/warnings. Numeric evidence paths: fees 1,700/2,441 (70%), rewards 1,699/3,019 (56%), benefits 1,827/3,218 (57%), eligibility 731/787 (93%); stamp mismatches 0. These figures are not a factual-accuracy rate. Next by oldest-cohort path: ICICI Parakram (`data/cards/icici/parakram.yaml`); 35 active/invite-only records remain at 2026-07-05.


## 2026-10-27 ? ICICI Parakram

Current issuer page, card T&C, MITC and linked insurance policy reviewed. Corrected current terms and removed unsupported launch/network/tier and fixed point-value claims. Field-level source details: `docs/sources/icici/parakram/issuer-extract-2026-10-27.md`. Dataset-wide factual accuracy remains unmeasured; numeric evidence coverage indicates traceability only.


## 2026-10-27 ? ICICI Rubyx

Compared current card page/FAQ with linked card terms, MITC, welcome voucher T&Cs, golf terms, insurance policy and iShop FAQ/cap. Removed unsupported point valuation, network/tier/launch claims and stale international lounge value. Documented the 60-day product FAQ versus 90-day insurance policy activity conflict. See `docs/sources/icici/rubyx/issuer-extract-2026-10-27.md`.


## 2026-10-27 ? ICICI Sapphiro

Compared current Sapphiro page/FAQ with issuer MITC and card terms, welcome terms, golf terms, insurance policy and iShop rules. Corrected stale network/tier/launch claims, reward currency and valuation, reward rates, lounge, golf, BMS, insurance and eligibility. Air-accident 60-day FAQ conflicts with policy 90-day active-card clause. See `docs/sources/icici/sapphiro/issuer-extract-2026-10-27.md`.


## 2026-10-27 - IDFC FIRST WOW!

Reviewed current issuer product page and customer MITC, May-2026 WOW communication, and earlier update. Corrected standard WOW benefits and reward/fee/eligibility terms; removed unsupported launch date and WOW Black lounge/welcome claims. Personal-accident/lost-card cover in older notice is not reaffirmed by newer notice/current page and is excluded pending confirmation. Evidence: `docs/sources/idfc-first/wow/issuer-extract-2026-10-27.md`. Validation passed with 370 cards and zero errors/warnings; numeric path coverage remains traceability, not factual accuracy.


## 2026-10-27 - ICICI Times Black

Compared the current product page and FAQ with card-specific T&Cs, MITC, December-2025 insurance policy and 2026 cancellation-cover process. Cleared unsupported launch/tier, unlimited golf and INR5,000,000 medical cover; corrected rewards, lounge guest scope, fees, fuel waiver, insurance, CFAR and income eligibility. See `docs/sources/icici/times-black/issuer-extract-2026-10-27.md`. Validation passed with 370 cards and zero errors/warnings; traceability ratios are not factual accuracy.


## 2026-10-27 ? IndusInd Avios Visa Infinite

Reviewed and corrected Avios current terms against issuer card page, 13-Oct-2026 MITC, launch release and linked benefit terms. See `docs/sources/indusind/avios/issuer-extract-2026-10-27.md`. Validator: 370 cards, 887 rewards; 795 strict-scope and 770/795 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,722/2,431 (71%); rewards 1,735/3,028 (57%); benefits 1,889/3,228 (59%); eligibility 736/801 (92%). Stamp mismatches: zero. These are traceability measures, not factual accuracy. Current oldest cohort: 29 active/invite-only records at 2026-07-05; next by path is IndusInd Legend.


## 2026-10-27 ? IndusInd Legend

Reviewed and corrected Legend against current issuer product/fee pages, 13-Oct-2026 MITC, Dec-2025 benefit guide, current reward and fuel terms. Claim-level evidence: `docs/sources/indusind/legend/issuer-extract-2026-10-27.md`. Validator: 370 cards; 888 rules, 796 strict scope, 773/796 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,728/2,431 (71%); rewards 1,742/3,030 (57%); benefits 1,894/3,225 (59%); eligibility 736/801 (92%). Stamp mismatches: zero. These are traceability measures, not factual accuracy. Oldest cohort: 28 active/invite-only records at 2026-07-05; next by path is IndusInd Pinnacle.


## 2026-10-27 - IndusInd Pinnacle

Reviewed current issuer product page, MITC, reward rules, lounge/fuel/golf and redemption terms. Claim-level comparison: docs/sources/indusind/pinnacle/issuer-extract-2026-10-27.md. Validator: 370 cards; 890 rules; 798 strict scope; 777/798 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,734/2,431 (71%); rewards 1,750/3,036 (58%); benefits 1,908/3,229 (59%); eligibility 738/803 (92%). Stamp mismatches zero. These are traceability measures, not factual accuracy. Oldest cohort: 27 active/invite-only cards last verified 2026-07-05; next: Kotak Cashback+ Prime.


## 2026-10-27 ? Kotak Cashback+ Prime

Compared the current Kotak product page, card-specific Cashback+ Prime terms and KFS. Corrected fees and APR, removed the unavailable cash-advance fee, corrected reward cap/exclusions and fuel waiver, and cleared unsupported launch/network claims. Visa and RuPay variants aggregate in the product page; exact earn behavior remains variant-dependent. Eligibility thresholds and launch date are not established. Evidence: `docs/sources/kotak/cashback-plus-prime/issuer-extract-2026-10-27.md`.

After review: 370 records, 890 reward rules, 798 strict scope, 777/798 strict-ready (97%); zero validator errors/warnings. Numeric evidence paths: fees 1,739/2,429 (72%), rewards 1,757/3,033 (58%), benefits 1,912/3,229 (59%), eligibility 738/803 (92%); stamp mismatches 0. These are traceability measures, not factual accuracy. Next by oldest-cohort path: Kotak Cashback+ (`data/cards/kotak/cashback-plus.yaml`); 23 active/invite-only records remain at 2026-07-05.


## 2026-10-27 ? Kotak Cashback+

Reviewed current product and claim pages, card-specific terms and June-2026 KFS. Corrected fee/APR/cash advance, reward cap/exclusions, fuel waiver, and redemption minimum (500 from 16-Oct-2026). Cleared unsupported launch/network claims. RuPay variant and exact eligibility criteria remain unresolved. Evidence: `docs/sources/kotak/cashback-plus/issuer-extract-2026-10-27.md`.

After review, validator: 370 cards; 890 reward rules, 798 strict scope, 777/798 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,744/2,427 (72%); rewards 1,760/3,031 (58%); benefits 1,916/3,229 (59%); eligibility 738/803 (92%). Stamp mismatches: zero. Coverage is traceability, not database-wide factual accuracy. Next oldest-cohort item: Kotak IndiGo XL; 22 active/invite-only records remain last verified 2026-07-05.


## Kotak IndiGo XL ? 2026-10-27

Reviewed current issuer product, fee, value and offer pages, KFS, card-specific terms, consolidated MITC, MCC schedule, lounge documents and relaunch announcement. Corrected fee schedule, reward rates/exclusions/redemption, lounge and welcome/milestone claims; removed unsupported network/tier, residency, fuel surcharge waiver and baggage assistance. Remaining source conflicts: acquisition fee-waiver vs welcome eligibility, exact current-card match in older lounge list, and no fixed BluChip INR value. Evidence archive and claim-level detail: `docs/sources/kotak/indigo-xl/issuer-extract-2026-10-27.md`. Current validator passes; numeric evidence coverage: fees 1,750/2,427, rewards 1,768/3,031, benefits 1,926/3,223, eligibility 738/803. These are provenance coverage measures, not measured factual accuracy.


## Kotak IndiGo base - 2026-10-27

Compared current issuer product/benefits and fees pages, retail MITC, co-brand terms, rewards MCC schedule and relaunch announcement. Corrected fees, flight earn decomposition, base/dining rates, milestone thresholds, welcome/renewal and unsupported network/eligibility/lounge/fuel-waiver assertions. Remaining caveats: legacy migrated card fee variants, generic welcome meal term ambiguity, variable BluChip INR value, and multiple network variants. Evidence details: `docs/sources/kotak/indigo/issuer-extract-2026-10-27.md`. Validator passes; numeric evidence paths fees 1,756/2,427; rewards 1,775/3,030; benefits 1,932/3,215; eligibility 738/803. Coverage is not measured factual accuracy.


## Kotak Solitaire - 2026-10-27

Compared current product/rewards/fees pages, KFSKS04062026, retail MITC, April 2026 detailed terms, MCC schedule, lounge lists and current Visa/District privileges. Corrected annual program fee waiver, reward earning/cap and redemption, partner ratios, guest lounge count and fuel-waiver terms; removed unsupported launch date, network tier, golf and speculative valuations. Unresolved: fees presentation in KFS/product page, 3-vs-4 add-on cards, and direct detailed-T&C PDF download 403. Evidence archive: `docs/sources/kotak/solitaire/issuer-extract-2026-10-27.md`. Validator passes; numeric coverage fees 1,763/2,428; rewards 1,787/3,035; benefits 1,938/3,215; eligibility 738/803. Coverage is not factual accuracy.


## 2026-10-27 ? Kotak Zen Credit Card

Compared current Kotak product/fees/rewards redemption/milestone/eligibility pages, KFSZS12032026 and consolidated MITC. Corrected finance/cash advance, point redemption values, lounge quotas/spend gate, fuel waiver, milestones and published eligibility; removed unsupported launch date and Visa tier. See `docs/sources/kotak/zen-signature/issuer-extract-2026-10-27.md`. Validation passes for 370 cards, 890 rules, 798 strict scope, 777/798 strict-ready, zero errors/warnings; numeric evidence paths: fees 1,770/2,428 (73%), rewards 1,796/3,037 (59%), benefits 1,948/3,218 (61%), eligibility 740/805 (92%); stamp mismatches zero. Coverage is traceability, not factual accuracy.


## 2026-10-27 ? KVB Honour Credit Card

Compared current KVB product, retail MITC, redemption page and portfolio release. Corrected annual fee/waiver, APR/cash advance, rewards/redemption, fuel waiver, lounge description and welcome points; removed unsupported launch date and rupee point-value claims. Evidence: `docs/sources/kvb/honour/issuer-extract-2026-10-27.md`. Validator: 370 cards, 891 rules, 799 strict scope, 778/799 strict-ready (97%), zero errors/warnings. Numeric evidence paths: fees 1,777/2,428 (73%), rewards 1,801/3,038 (59%), benefits 1,952/3,215 (61%), eligibility 740/805 (92%). Stamp mismatches zero. These measures do not prove factual accuracy.


## 2026-10-27 ? OneCard Metal

Compared current OneCard product/fees pages and BOBCARD, CSB, Federal and South Indian Bank terms. Corrected generic record to account for six bank partners and three network variants; removed unsupported lounge, static category, rupee conversion and launch-date claims; refreshed current rewards/fees/fuel details. SBM and Indian Bank agreements remain unreviewed. Evidence: `docs/sources/onecard/metal/issuer-extract-2026-10-27.md`. Validator passes for 370 cards, 891 rules, 799 strict scope, 778/799 strict-ready, zero errors/warnings. Numeric paths: fees 1,780/2,425 (73%), rewards 1,804/3,033 (59%), benefits 1,954/3,211 (61%), eligibility 740/805 (92%). Stamp mismatches zero. Coverage is not factual accuracy.

## 2026-10-27 - RBL Icon Credit Card

Compared current RBL Icon product page, card-specific terms dated 04-Aug-2026, current MITC/KFS, Schedule of Charges and network guide. Corrected annual fees/charges, 2 points/INR100 base, international and weekend-dining rates/caps, current milestone ladder, welcome conditions, lounge terms, Mastercard-only golf, BookMyShow offer and fuel waiver. Removed unsupported launch date, single Mastercard/World tier, inaccurate free international lounge quota and fixed point valuation. Both Visa and Mastercard are listed; launch date and issuer-published numeric eligibility criteria were not found. International lounge access is available but costs up to USD35/visit; schema representation limitation documented. Source comparison: `docs/sources/rbl/icon/issuer-extract-2026-10-27.md`.

Validation: 370 cards, 892 reward rules, 800 strict-scope, 781/800 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,784/2,425 (74%), rewards 1,812/3,033 (60%), benefits 1,974/3,217 (61%), eligibility 740/805 (92%); stamp mismatches zero. Evidence-path coverage is not a factual-accuracy score. Next oldest-cohort card: RBL Insignia; 18 records remain dated 2026-07-05.

## 2026-10-27 - RBL Insignia Preferred Banking Credit Card

Compared current RBL product page, card terms, KFS/MITC/Schedule of Charges, network guide, RBL Rewards terms, Miles Transfer terms and milestone guide. Corrected fee waiver and no-fee segment, 28k welcome, dual network variants, 5/10 reward earn and 3:1 partner transfer ratio, six complimentary international visits plus spend-triggered vouchers, two domestic visits per quarter, INR8k voucher at INR8L, Mastercard-only golf, INR500 twice-monthly movie discount and fuel waiver. Cleared unsupported launch date, fixed point value and insurance caps. Unpublished launch/applicant numeric thresholds and scalar-schema variants are documented. Evidence: `docs/sources/rbl/insignia/issuer-extract-2026-10-27.md`.

Validation: 370 cards, 892 rules, 800 strict scope, 783/800 strict-ready, zero errors/warnings. Numeric evidence paths: fees 1,789/2,425 (74%), rewards 1,816/3,030 (60%), benefits 1,990/3,226 (62%), eligibility 740/805 (92%); stamp mismatches zero. Next oldest-cohort card: RBL IRCTC; 17 records remain dated 2026-07-05. Coverage is not a factual-accuracy score.

## 2026-10-27 - RBL IRCTC Credit Card

Compared current RBL product page, product terms, FAQ, central MITC, charges schedule, network guide and railway lounge terms. Updated fees, Mastercard/RuPay variants, general and accelerated reward rates/caps, exclusion MCCs, point redemption use, welcome, quarterly milestone, railway lounge access, train-cancellation protection, IRCTC transaction-charge reversal and FAQ age eligibility. Removed unsupported fuel waiver and stale rates. Open points include welcome threshold wording (above INR500 vs INR500 or more) and card PDF named RuPay while current network page lists both networks. Evidence: `docs/sources/rbl/irctc/issuer-extract-2026-10-27.md`.

Validator: 370 cards, 893 rules, 801 strict scope, 784/801 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,793/2,425 (74%), rewards 1,830/3,032 (60%), benefits 1,999/3,229 (62%), eligibility 740/807 (92%); stamp mismatches zero. Next oldest cohort record is RBL Play, with 16 records remaining at 2026-07-05. Evidence-path coverage is not a factual-accuracy score.

## 2026-10-27 - RBL Play Credit Card

Compared the current product page, linked Play T&Cs, BookMyShow offer guide, MITC, fee schedule, network guide and RuPay/NCMC FAQ. Removed unsupported points earning/statement redemption and lounge quota; corrected fees, Mastercard/Visa variants, BMS welcome, monthly ticket offer, food-and-beverage offer, fuel reversal, MCC spend exclusions and fee-waiver threshold. Current linked T&Cs include RuPay-only functionality not listed in the current network guide; kept this conflict open. Schema requires a reward record, so unquantified reward earn is null and benefits are stored separately. Source comparison: `docs/sources/rbl/play/issuer-extract-2026-10-27.md`.

Validation: 370 cards, 892 reward rules, 800 strict scope, 783/800 strict-ready (98%), zero errors/warnings. Numeric evidence paths: fees 1,798/2,425 (74%), rewards 1,830/3,024 (61%), benefits 2,008/3,230 (62%), eligibility 740/807 (92%); stamp mismatches zero. Next oldest-cohort item: RBL Shoprite; 15 records remain at 2026-07-05. Evidence-path coverage is not factual accuracy.


## RBL ShopRite Credit Card (reviewed 2026-10-27)

Current RBL product page, card T&Cs, current MITC/Schedule of Charges, network guide and rewards terms checked. Updated record fees/waiver, reward rates and grocery cap, point value and exclusions, welcome points, movie discount and fuel surcharge waiver. Cleared unsupported 2016 launch date and Mastercard Platinum tier. Evidence: `docs/sources/rbl/shoprite/issuer-extract-2026-10-27.md`.

Open conflicts: product page says reward posting within 45 days, T&Cs say within 60 days; cap period is described as monthly vs assigned billing cycle; product page lists RuPay while the network guide lists Mastercard/Visa only. Exact launch date, applicant cutoffs and lounge entitlement remain unsubstantiated.


## Axis Burgundy Private ? The One Card (reviewed 2026-10-27)

Compared current Axis product and eligibility pages, current MITC/KFS and fee notice, Burgundy Private Rewards T&Cs, Travel EDGE transfer table, current lounge, BookMyShow and golf terms, FY2026-27 insurance schedule and complimentary membership terms. Removed unsupported Visa Infinite tier/launch date and corrected fees; added current transfer ratios, lounges/guests, BMS, golf, fuel, dining, memberships, meet-and-assist and insurance. Claim-level comparison: `docs/sources/axis/burgundy-private/issuer-extract-2026-10-27.md`.

Open issuer/source discrepancies: joining fee per MITC vs fee notice/KFS; monthly vs statement-cycle fuel cap; unlimited lounges subject to quarterly quota; transfer-table label ?The One Metal?; membership consent effective 15-Nov-2026. Schema cannot encode the relationship-based fee waiver or combined domestic golf allocation.


## RBL World Safari (2026-10-27)

Reviewed current RBL product page, World Safari terms, network guide, MITC and Schedule of Charges. Updated current Mastercard/Visa variants, fees, base/travel points, welcome eligibility, milestone thresholds, lounge conditions, fuel waiver, concierge and golf details. Removed unsupported point values, stale lounge/fee details, numeric insurance limits and launch date. Product page and card terms conflict on international travel rewards; evidence and caveat are documented in `docs/sources/rbl/world-safari/issuer-extract-2026-10-27.md`. Validator: zero errors/warnings.


## South Indian Bank SBI Platinum (2026-10-27)

Compared current SBI Card MITC and live product page with archived issuer brochure. Updated verified fee terms; cleared unsupported launch date, card-specific APR and fixed point values; corrected chargeable Priority Pass and unsupported free-access quotas. Current page exposes no card-specific current benefit terms, so brochure-only reward/benefit claims are explicitly historical/unconfirmed. See `docs/sources/south-indian/sib-platinum/issuer-extract-2026-10-27.md`. Validator passed.


## Standard Chartered DigiSmart (2026-10-27)

Compared current product page, card-specific product T&Cs and tariff schedule. Corrected recurring monthly fee/reversal, cash advance fee, zero points on spend, current merchant benefits and published eligibility. See `docs/sources/standard-chartered/digismart/issuer-extract-2026-10-27.md`.


## Standard Chartered EaseMyTrip (2026-10-27)

Compared current product page, 11-Sep-2024 card-specific terms, current Most Important Document and tariff schedule. Corrected reward rates/merchant conditions, point value, current discounts, lounge quota, cash advance charges and published eligibility; cleared unsupported tier, launch date and fuel waiver. See `docs/sources/standard-chartered/easemytrip/issuer-extract-2026-10-27.md`.


## Standard Chartered Manhattan (2026-10-27)

Compared current product page, tariff schedule and the linked product T&C. The linked PDF is titled for Standard Chartered Rewards Credit Card and conflicts with Manhattan pricing/earning, so it was excluded. Corrected fee/cash advance, base points, joining reward and eligibility; removed unsupported tier, launch date and fuel waiver. Cashback cap inference and unresolved terms at `docs/sources/standard-chartered/manhattan/issuer-extract-2026-10-27.md`.
