# Credit card database accuracy overview (26 Oct 2026; refreshed after standard Shoppers Stop review)

## What the numbers mean

The database has no measured factual-accuracy percentage. Schema validation checks structure and cross-record consistency; it does not establish whether issuer terms are factually correct. The figures below separate structural validity, reward-source provenance, numeric-field evidence coverage and verification-date consistency. Field-level issuer comparisons remain necessary.

## Current database snapshot

- 370 card records across 33 issuers, 5 networks and 5 loyalty programs.
- 883 reward rules; 792 in the active/invite-only strict scope.
- 751/792 scoped rules (94%) are strict-ready; 41 lack confidence metadata. Across scoped rules, URL, source date, source type, freshness (within 180 days) and issuer ownership are present for 100%; confidence is present for 95%.
- `python scripts/validate.py`: zero errors and zero warnings.
- This is structural and provenance validation, not a fact-check of every field against its cited source.

## Explicit numeric-field evidence coverage

`python scripts/audit_numeric_evidence.py` checks whether numeric values in active and invite-only records appear in each record's `source.fields_verified` list.

| Area | Covered numeric fields | Total numeric fields | Coverage |
| --- | ---: | ---: | ---: |
| Fees | 1,607 | 2,469 | 65% |
| Rewards | 1,643 | 3,048 | 54% |
| Benefits | 1,746 | 3,227 | 54% |
| Eligibility | 697 | 753 | 93% |

This audit measures explicit evidence-path coverage only; it does not inspect whether the source actually supports the field. Rewards and benefits have the largest explicit coverage gaps.

## Freshness and unresolved issues

- `python scripts/audit_stamps.py`: zero cards have `metadata.last_verified_on` later than the newest nested source's `retrieved_on`. This only checks date ordering, not whether a source remains current.
- After both Shoppers Stop card reviews, 48 active/invite-only records remain tied at the oldest `last_verified_on` date (2026-07-05). Next by path order is HDFC Tata Neu Plus (`data/cards/hdfc/tata-neu-plus.yaml`). See the continuation checklist.
- Source URL reachability and actual field support have not been exhaustively audited across the full library. Fees, offers, lounges and eligibility can change between reviews.

## Latest record-level review: HDFC Shoppers Stop (standard)

Checked HDFC's current product page, fees/pricing page, linked card reward terms and launch announcement. Corrected the launch date to 2022-03-30, retained RuPay based on current UPI support but removed the unsupported Platinum tier, and updated ?299 fees, 3.5% foreign currency markup, 3.75% monthly finance, 3%/1% rewards with 500/1,000 category caps, point redemption values and two-year expiry. Refreshed the ?500 voucher, Silver Edge membership, ?500 weekend reward (one/month, up to five/year), ?250 fuel waiver and published eligibility. Current validator: 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,607/2,469 (65%); rewards 1,643/3,048 (54%); benefits 1,746/3,227 (54%); eligibility 697/753 (93%). Stamp mismatches: zero. These are evidence-path and structure measures, not factual accuracy. Sources: `docs/sources/hdfc/shoppers-stop/`.

## Latest record-level review: HDFC Shoppers Stop Black

Checked HDFC's current product and fee pages, linked card reward terms, co-branded MITC v3.9 and 2022 launch announcement. Corrected the launch date to 2022-03-30 and cleared unsupported network and tier claims. Refreshed ?4,500 fees, 3.5% forex markup, 3.75% monthly finance charge, current 7%/2% earning with per-category monthly caps, redemption routes, two-year expiry, fuel waiver, lounges, welcome voucher, insurance and published eligibility. The live product page's weekend reward is 2,000 points; linked detailed terms say ?1,500 and at most five awards/year. The card terms also label the non-Shoppers Stop rate 1% in one heading while their table/example and live product page say 2%. The current fees page and detailed terms differ on statement-credit redemption fees. All are documented in the source extract. Current validator remains 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,602/2,469 (65%); rewards 1,626/3,040 (53%); benefits 1,738/3,222 (54%); eligibility 691/747 (93%). Stamp mismatches: zero. These are source-path and structural metrics, not a factual-accuracy percentage. Sources: `docs/sources/hdfc/shoppers-stop-black/`.

## Latest record-level review: PhonePe HDFC Bank Uno

Rechecked HDFC's live Uno product page and reward details, card-specific FAQ/reward terms, co-branded MITC v3.9 and June 2025 issuer launch release. Corrected the launch date to 2025-06-26, cleared unsupported RuPay tier, documented current ?499 fees and waiver, and refreshed the post-2026-08-01 offer to five ?100 scratch cards. Statement-credit value is ?1/point (500-point minimum; ?7,500 monthly redemption maximum, no fee), with ?0.30/point via SmartBuy. Added the issuer-listed ?20,000/month salaried minimum. The card-specific terms say two-year point expiry while the newer MITC includes a one-year validity provision for Uno; expiry remains unmodeled pending clarification. Current snapshot: 370 cards, 883 reward rules, 792 strict-scope, 751/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,597/2,469 (65%); rewards 1,613/3,036 (53%); benefits 1,725/3,218 (54%); eligibility 685/741 (92%). Stamp mismatches: zero. These are evidence-path/validation metrics, not factual accuracy. Sources: `docs/sources/hdfc/phonepe-uno/`.

## Latest record-level review: PhonePe HDFC Bank Ultimo

Rechecked current HDFC product, fees, reward and co-branded MITC pages/PDFs, plus HDFC's 2025 launch release. Corrected launch date to 2025-06-26, removed unsupported RuPay tier, updated the current post-2026-08-01 welcome offer to five INR200 PhonePe scratch cards, corrected point redemption to INR1 statement credit / INR0.30 SmartBuy, recorded INR20,000/month salary minimum, and refreshed current reward/fee/lounge terms. Pincode is omitted because the issuer states that offer ended 2025-12-05. The card-specific FAQ and reward terms say points expire after two years; HDFC's consolidated MITC updated 2026-05-08 says one year, so expiry remains unresolved. Current validator: 370 cards, 883 rules, 792 strict scope, 751/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,592/2,469 (64%); rewards 1,596/3,034 (53%); benefits 1,720/3,219 (53%); eligibility 685/740 (93%); stamp mismatches zero. Metrics are not a factual-accuracy percentage. Sources: `docs/sources/hdfc/phonepe-ultimo/`.

## Latest record-level review: HDFC Infinia Metal Edition

Rechecked HDFC's current card and fee pages plus the May-2026 co-branded MITC. Confirmed INR12,500 joining/renewal fee, INR10 lakh waiver for newer Metal Edition accounts, 2% foreign markup, 1.99% monthly finance charge and fuel-waiver terms. Corrected the usual cash-advance fee exemption, removed unsupported exact launch date and lounge guest quota, corrected old transfer valuations and point values, and removed blanket insurance/fuel reward exclusions. The issuer supports INR1/point for flights/hotels and select Apple/Tanishq redemptions, up to INR0.50 for products/vouchers, and INR0.30 for statement credit. Insurance earning is capped at 10,000 points/month. Current SmartBuy offer 15282 returned HTTP 502, so the July-captured flight/hotel multiplier split and voucher sub-cap remain due for a live refresh. Evidence extract and archived MITC are under `docs/sources/hdfc/infinia/`.

## Latest record-level review: BOI RuPay Select

Reviewed current BOI product and Star Rewards page text, the official indexed MITC schedule, RuPay's Select Credit Card lounge terms and the archived BOI brochure. Updated current annual charges, reward earn and current eligibility, and removed unsupported finance/forex figures, fuel waiver, point valuation, exact launch date and MCC 6513. The official sources conflict on monthly finance-charge scenarios; current Star Rewardz reports standard 2 points/INR100, preferred 3/INR100 and a 3-point card-wise bonus, but category mapping/stacking is unclear. Documented the product-page/rewards-page exclusion wording conflict and the separate UPI <=INR2,000 exclusion; left point value unknown. The BOI pages/MITC returned HTTP 403 to direct clients, so their official search-indexed text is cited and the access limitation recorded. Current validation after HDFC Infinia: 370 cards, 883 reward rules, 792 strict-scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage: fees 1,587/2,469 (64%), rewards 1,582/3,033 (52%), benefits 1,713/3,220 (53%), eligibility 684/739 (93%); stamp mismatches: zero. This review does not establish dataset-wide factual accuracy. Sources: `docs/sources/boi/`.

## Previous record-level review: BOB Uni GoldX

Reviewed the current BOBCARD product page, card-specific MITC v9 and KFS, Uni BOB rewards MITC and current Uni partner materials. Corrected monthly finance to 3.99%, cash-advance minimum to INR300, the fuel waiver to 1% up to INR7,500 capped at INR500 per statement, and published age/residency eligibility. Corrected Uni Coin earning to 1 coin per INR1 at INR0.01 per coin, modeled Uni Store 5% value back, removed unsupported MCC 6513, Visa/Platinum tier and 2024 launch date. Documented the KFS's INR100 GoldX UPI reward minimum versus the broader BOBCARD product-page wording, coin inactivity/forfeiture terms and partner-app digital-gold redemption distinction. Current validation: 370 cards, 883 reward rules, 792 strict-scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage: fees 1,579/2,473 (64%), rewards 1,564/3,035 (52%), benefits 1,701/3,227 (53%), eligibility 683/738 (93%); stamp mismatches: zero. This card review does not establish a dataset-wide factual-accuracy percentage. Sources: `docs/sources/bob/uni-goldx/`.

## Practical reading

Structural validity is strong, but numeric support remains incomplete, particularly for reward and benefit values. No dataset-wide factual-accuracy percentage is defensible from these measures. Report confidence per card and field after comparison with current issuer evidence, including conflicts and unpublished terms.

## Latest record-level review: Axis IndiGo Premium

Reviewed current Axis product page, the linked card-specific terms, August 28 revision, double-welcome campaign, launch release and current lounge program. Corrected the international lounge quota to 2/year, domestic quota/gate to 2/quarter after INR 50,000 prior-three-month spend, BOGO BookMyShow offer and fee/current DCC data. Removed an unsupported fuel waiver and fixed BluChip rupee values; BluChips are explicitly non-monetary. Updated category exclusions, 3x grocery/hotel and 7x IndiGo earning, 2026 double-welcome campaign, published eligibility and both network variants; scalar network/tier remain unknown. Documented campaign dates conflict (offer PDF vs product page) and the November 1 movie spend gate. Validation: 370 cards, 884 reward rules; 793 strict-scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,537/2,475 (62%); rewards 1,511/3,045 (50%); benefits 1,644/3,228 (51%); eligibility 669/722 (93%). Stamp mismatches: zero. Coverage metrics do not estimate accuracy. Sources archived under `docs/sources/axis/indigo-premium/`.

## Previous record-level review: Axis IndianOil Credit Card

Reviewed the current Axis IndianOil product page, current card-specific terms, August 28, 2026 revision, activation terms, 2025 reward-exclusion revision and linked offer/outlet materials. Corrected the online monthly cap to 250 points, fuel monthly cap to 1,000 points, ₹50 fuel-surcharge-waiver cap, current fee and eligibility details, and removed an unsupported fixed point value and stale MCC 6513 exclusion. Documented ambiguity in the waiver cycle, the expired BookMyShow offer PDF, the forthcoming ₹25,000 spend gate effective November 1, and current product-page vs card-T&C fee language. Validation: 370 cards, 884 reward rules; 793 strict-scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,533/2,475 (62%); rewards 1,503/3,048 (49%); benefits 1,627/3,234 (50%); eligibility 665/718 (93%). Stamp mismatches: zero. These coverage metrics do not estimate factual accuracy. Sources are archived under `docs/sources/axis/indianoil/`.

## Previous record-level review: Axis Google Pay Flex

Reviewed the current Axis product page, the card-specific terms linked from that page, the reward structure effective 2026-10-16, the 2026-08-28 bankwide terms update and current MITC. Corrected stale fees and rewards, removed an unsupported MCC 6513 exclusion, restored fuel eligibility, removed unsupported RuPay tier, and refreshed welcome/campaign terms. Stars are INR 1 each, capped at 1,500 per reward cycle (up to 750 from Axis), and expire after one year. Campaign rewards remain Google Pay-funded and time-limited. The exact INR 50,000 late-fee boundary is ambiguous between issuer prose and tables and is documented. Current validation: 370 cards; 884 reward rules, 793 strict-scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,515/2,462 (62%); rewards 1,483/3,047 (49%); benefits 1,615/3,236 (50%); eligibility 661/714 (93%). Stamp mismatches: zero. These figures measure structural and evidence-path checks, not factual accuracy. Source captures are under `docs/sources/axis/google-pay-flex/`.

The [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) defines accuracy as degree of match to reality and cautions against confusing accuracy with completeness. The [RBI Credit Card and Debit Card Directions](https://systemhealth.rbi.org.in/Scripts/BS_ViewMasDirections.aspx_id%3D12300.html) describe credit-card KFS and MITC disclosure expectations; this project uses those materials to identify relevant issuer evidence and is not a regulatory compliance audit. A defensible sample accuracy estimate would need a defined representative field sample, verified numerator and denominator, review date, sampling method and unresolved-conflict treatment.

## Latest record-level review: YES Bank FinBooster

Reviewed the current issuer listing, June-2026 charges/features update and MITC v18. Updated reward rates to 10/6/2 YES Rewardz per INR200 for online dining, online grocery/apparel, and other eligible retail, respectively; marked accelerator caps unpublished. Corrected forex to 3.5%, monthly finance to 3.99%, cash advance to 2.5%/INR650 minimum, fuel-waiver range/cap to INR500-3,000 and INR100 per statement, and listed current issuer-published MCC exclusions. Cleared unsupported Mastercard/Platinum and exact launch date; left network, age/income/score/residency cutoffs and benefit details unknown where current issuer sources do not establish them. Validator: 370 cards, 880 reward rules, 794 strict-scope, 737/794 strict-ready (92%), zero errors/warnings. Evidence coverage: fees 1,425/2,462 (58%), rewards 1,414/3,080 (46%), benefits 1,555/3,225 (48%), eligibility 636/687 (93%); stamp mismatches: zero. This review improves support for one record, not a database-wide accuracy percentage. Full sources are archived under `docs/sources/yes/finbooster/`.

## Previous record-level review: YES Bank Essence

Reviewed the current rendered card page, card-specific MITC V17, May-2026 value chart and MITC v18. Corrected fees and spend reversals, 2.75% forex, 2.5%/INR650-min cash advance, 12/8/4 points per INR200 and 9,000-point statement cap, exclusions, redemption/expiry fees, lounge spend gate and current fuel waiver. Published age/salary eligibility was added; unsupported network, tier, exact launch date, residency and realized point value were cleared. The annual milestone window and purchase-protection limits remain uncertain. Validator: 370 cards, 879 rules, 793 strict-scope, 734/793 strict-ready (92%), zero errors/warnings. Evidence coverage: fees 1,419/2,462 (58%), rewards 1,405/3,078 (46%), benefits 1,551/3,224 (48%), eligibility 636/687 (93%); stamp mismatches: zero. This review improves source coverage for one record; it does not establish a factual-accuracy percentage. Full evidence is archived under `docs/sources/yes/essence/`.

## Previous record-level review: YES Bank ACE

The current ACE page was checked through rendered browser text alongside YES Bank MITC v18 dated 2026-10-05 and the June 2026 feature update. The record now reflects current fee waivers, 3.5% forex, 3.99% monthly finance, 2.5%/INR650-min cash advance, 8/4/2 rewards per INR200, reward caps and exclusions, redemption/expiry terms, revised fuel waiver and issuer-published eligibility. Unsupported network/tier and exact launch date were cleared; purchase-protection limits remain unknown. See `docs/sources/yes/INDEX.md` and `docs/CONTINUATION_CHECKLIST_CREDIT_CARD_VALIDATION.md`. The issuer page download is a JavaScript shell; rendered terms were summarized at `docs/sources/yes/ace/ace-page-rendered-extract.md`.

## Latest record-level review: YES Bank AI Inside RuPay

The current AI Inside RuPay issuer page and YES Bank MITC v18 were checked on 2026-10-26. The issuer advertises up to 3% cashback but publishes no general earning schedule or cap; the unsupported 1% base assertion was removed. Current fees are lifetime-free, monthly interest is 3.99%, foreign-currency/DCC markup is zero, and the card page restricts eligibility to existing AI Inside cardholders who do not hold another YES card. The updated fuel surcharge waiver is INR400-5,000 per transaction, capped at INR125 per statement. RuPay network is published; network tier and exact launch date are unknown. See `docs/sources/yes/INDEX.md` and the continuation checklist for remaining questions and capture notes.




## Latest record-level review: YES Bank Anq Phi

The current Anq Phi page, issuer-indexed Phi guide, current MITC v18 and June-2026 feature update were checked on 2026-10-26. Corrected joining/annual fees and waiver, forex markup, cash advance, APR, category-based rewards, redemption terms, lounge quota and fuel waiver. The issuer notice says forex markup is 3.5% effective 15-Jun-2026, while MITC v18 presents 3.4% and 3.5% on the card row; the dated feature update is followed and the table ambiguity remains documented. Unpublished network/tier, launch date and eligibility cutoffs remain unknown.

## Current database-level validation (26 Oct 2026, after Axis Magnus)

Re-run against the current worktree: 370 cards, 33 issuers, 5 networks, 5 loyalty programs; 884 reward rules, 793 active/invite-only rules in strict scope, 749/793 strict-ready (94%), with zero validator errors or warnings. Numeric evidence-path coverage is fees 1,487/2,442 (61%), rewards 1,477/3,054 (48%), benefits 1,612/3,235 (50%), and eligibility 659/710 (93%). Stamp audit found zero records whose verification date is later than the newest nested source retrieval date. These are coverage and date-order checks; none estimates factual accuracy.

## Latest record-level review: YES Bank First Preferred

Reviewed the current rendered issuer product page, MITC v18, June-2026 charges/features notice and issuer-indexed value chart. The issuer says new issuance to new customers has been discontinued and existing holders are reissued at expiry, so status is now `on-hold`. Corrected the INR999 joining/renewal fees and spend waivers, 2% foreign-currency markup, 3.99% monthly standard finance rate, 2.5%/INR650-min cash advance fee, current 8/4 reward schedule and exclusions, domestic/international lounge quotas and domestic INR75,000 prior-quarter gate, golf terms, BookMyShow offer and INR500-5,000 / INR250 fuel waiver. Unsupported Mastercard/World, exact launch date, realized point value, and default residency/eligibility values were cleared. The old official movie cap and legacy point-expiry statement conflict with current evidence; both conflicts are disclosed in the record extract. The current value-chart PDF endpoint returned an HTML shell, so its indexed content is cited but not archived as a PDF. Current validator and evidence coverage are recorded above. Full notes and archived issuer PDFs are under `docs/sources/yes/first-preferred/`.

## Latest record-level review: YES Bank EMI

The current issuer listing and indexed EMI Card terms plus MITC v18 were reviewed on 26-Oct-2026. Corrected the false lifetime-free fees to INR 499 joining/annual with renewal waiver at INR 120,000 preceding-year spend; updated 3.99% monthly finance, 3.5% forex, 2.5%/INR650-min cash advance and the INR500-3,000 / INR250 statement fuel waiver. The card-specific terms state 1% cashback on non-EMI transactions, capped at INR500/calendar month, and 18% p.a. automatic EMI conversion plus 1% processing fee. Unsupported exclusions, network/tier, launch date and resident-Indian default were removed. The EMI-specific terms PDF endpoint returned a JavaScript/404 shell, so capture limits and the official indexed text are documented in the issuer extract. Next review queue: 12 YES Bank cards tied at 2026-07-03; see the continuation checklist.

## Latest record-level review: YES Bank AI Inside

The current AI Inside page and YES Bank MITC v18 were checked on 2026-10-26. The issuer advertises ?up to 3%? cashback but does not publish its earning schedule/caps; the prior unsupported 1% general rate was removed. The page confirms lifetime-free membership, zero forex markup and 1% fuel waiver. The MITC gives 3.99% monthly finance, no FX/DCC fee, cash-advance fee waived for AI Inside, and a fuel waiver band of INR400-5,000 capped at INR750 per statement. Network variant, precise launch date and numeric eligibility remain unpublished in reviewed current product material.

## Latest record-level reviews

IDFC FIRST Select, CRED IndusInd Bank RuPay, IDFC FIRST SWYP and IDFC FIRST WOW! Black, and IDFC FIRST Wealth, IndusInd Celesta and Crest were rechecked on 2026-10-26. Select contained stale reward base, lounge quotas, reward expiry and fee details, plus unresolved conflicts on points expiry, lounge qualification month and app-booking bonus rates. CRED contained an incorrect launch date, annual fee, finance charge and obsolete rewards model. See the respective card-specific sections in the continuation checklist. IndusInd Celesta, Crest, Duo, Iconia and IndianOil Kotak are reviewed; Crest and Duo are on-hold; Iconia is discontinued. Duo is no longer sourced for new applications; next active queue card is selected in the continuation checklist.


## Latest record-level review: CRED IndusInd Bank RuPay

The CRED record was checked against the current issuer page, 13-Oct-2026 consolidated MITC, fuel surcharge waiver terms and official launch release. The existing record had an incorrect launch date, incorrectly NIL annual fee, stale finance charge and obsolete generic rewards. Current issuer terms show launch on 15-Sep-2025, NIL joining / INR499 annual fee, 3.95% monthly finance, category-specific 5%/1% CRED Reward Points, and 24-month points expiry. See `docs/sources/indusind/INDEX.md` and the continuation checklist for source conflicts and details.


## Latest record-level review: IDFC FIRST SWYP

The current issuer page, product communication and SWYP privileges/reward terms show that the prior record contained material errors: launch date, network, EMI financing representation, reward structure and card benefits. The current card is Mastercard, launched 8-Dec-2023; the regular rewards are spend milestones, not 3X/10X per-rupee earning. Current category-specific bonuses, card fees, annual reward, flat cash advance fee, and benefit terms are recorded in the card YAML and issuer index. Unpublished eligibility thresholds and limits of the data schema are noted.


## Latest record-level review: IDFC FIRST WOW! Black

The current issuer page and archived launch, privileges and MITC documents show the old record had incorrect card network/tier, launch date, cash advance fee representation, reward values, lounge quota and other benefit terms. It now records Mastercard with unknown tier, a linked virtual RuPay card, four points per INR150 (INR0.25 general redemption), one domestic lounge visit per quarter behind the monthly INR20,000 spend condition, 0% forex, the current welcome package, fuel/movie/insurance benefits and secured-FD eligibility. Travel bonus interpretation and lounge qualifying-month language remain source ambiguities; see the issuer index and continuation checklist.


## Latest record-level review: IDFC FIRST Wealth

The current issuer card page and four archived card-specific PDFs expose stale prior Wealth values: the Visa tier is Infinite; the reward base is 3 points per INR200; the 10X dining/travel categories no longer have the old INR20,000 monthly threshold; international earning ends effective 26-Oct-2026 per a dated issuer footnote; fees, lounge quotas, movie offer, golf, insurance and eligibility were refreshed. The issuer?s current page still contains conflicting international reward copy, and its railway lounge sources disagree on annual vs quarterly quota. Travel bonus percentages/points also do not reconcile. These conflicts are recorded in the card source index and checklist.


## Latest record-level review: IndusInd Celesta

Current issuer pages and the consolidated MITC, lounge terms and golf terms were checked on 2026-10-26. Celesta is currently American Express, with INR 25,000 joining fee, INR 5,000 annual fee (waived/reversed at INR 10 lakh combined spend), 2.99% monthly finance charge, 3.5% forex markup, domestic rewards of 1 point/INR 100 and international rewards of 3 points/INR 100. Domestic lounge access is unlimited subject to INR 1.5 lakh preceding-quarter spend; international Priority Pass includes 2 visits/quarter; golf is 1 game and 1 lesson/month. Exact launch date, eligibility thresholds, current fuel transaction band/cap, and full reward exclusions remain unresolved. Validator: 370 cards, 865 rules (791 strict; 706 strict-ready), zero errors/warnings. Numeric evidence-path coverage: fees 1,255/2,485 (51%), rewards 1,213/3,059 (40%), benefits 1,311/3,158 (42%), eligibility 616/663 (93%). Stamp audit: zero mismatches. These coverage figures are not factual-accuracy rates.


## Latest record-level review: IndusInd Duo

The current Duo card page, Duo benefit guide (20-Dec-2025), Duo terms, current consolidated MITC, current fuel-waiver PDF and FY2026-27 issuance policy were checked. Corrected the network tier, status and unsupported launch date; fees, reward rate/value, fuel band/cap and BookMyShow ticket terms were refreshed. Status is on-hold because the issuer discontinued new sourcing while continuing to publish terms for existing cardholders. Duo page lists 2% cross-currency markup and INR249 issuance fee, while the MITC has a general 3.5% forex default and NIL joining/annual fees; these remain explicit conflicts. The Duo guide says no credit-card earning cap while the reward update page lists 2,500 monthly; the card page specifically caps cash redemption at 2,500/month. Lounge, concierge, travel and golf features were discontinued effective 30-Nov-2021. Current snapshot: 370 cards, 866 reward rules, 788 strict-scope, 704/788 strict-ready (89%); numeric evidence fees 1,262/2,479, rewards 1,222/3,055, benefits 1,316/3,155, eligibility 616/665; zero stamp mismatches.


## Latest record-level review: IndianOil Kotak Credit Card

The current Kotak card, FAQ, rewards/redemption, eligibility pages, Key Fact Statement and September 2026 MITC were checked. Corrected the unsupported exact launch date and RuPay tier assignment; refreshed APR/cash advance, fuel reward caps, grocery/dining cap, cashback redemption and fuel surcharge waiver. The issuer specifies age 18-60 and Indian residency; income and bureau cutoffs remain unknown. Current snapshot after this record review: 370 cards, 866 reward rules, 788 strict-scope, 704/788 strict-ready (89%); evidence-path coverage fees 1,262/2,479, rewards 1,222/3,055, benefits 1,316/3,155, eligibility 616/665; zero stamp mismatches. These remain data-quality measures, not an accuracy percentage.


## Latest record-level review: IndusInd Iconia Amex

The current Iconia Amex page, current MITC, current reward cash-redemption page, reward update, Priority Pass terms, product-program policy, 2022 benefit guide and bank-wide 2025 insurance update were checked. The MITC explicitly categorizes Iconia as discontinued and the product page says new sourcing stopped; the record is now discontinued. Corrected weekday/weekend points, redemption values/cap, fee snapshot, eligibility income, fuel waiver cap and transaction band. Removed unsupported lounge quota, golf, welcome gift and air-accident insurance claims; the Amex lounge page claim remains unquantified, Priority Pass is unavailable, and current product policy says golf does not apply. Snapshot after Jio-bp Mobility+: 370 cards, 867 reward rules, 788 active/invite-only strict-scope, 707/788 strict-ready (89%); numeric evidence paths fees 1,274/2,473, rewards 1,230/3,048, benefits 1,337/3,152, eligibility 618/667; zero stamp mismatches. No dataset-wide factual accuracy percentage is measured.


## Latest record-level review: IndusInd Nexxt

The Nexxt record was checked against the current issuer product page, consolidated MITC, fuel-waiver schedule, Dec-2025 benefit guide and official launch announcement. Corrected the joining fee (?10,000, annual NIL), reward rate (1 point/?150), POS and cash-credit redemption values, monthly cash-credit cap/minimum, Mastercard/Platinum identity and 2018 launch date. Updated fuel-waiver range/cap, BookMyShow offer, and published travel cover values. The original record's Visa Signature, zero joining fee, 1 point/?100, 0.25/0.20 point values, exclusions and fuel band were unsupported or contradicted by current issuer evidence. Current validation: 370 cards, 867 reward rules, 788 strict-scope, 708 strict-ready (89%); numeric evidence coverage 52% fees, 41% rewards, 43% benefits, 93% eligibility; zero stamp mismatches. These are traceability measures, not factual accuracy rates. Full travel-insurance policy conditions remain to be checked.


## Latest record-level review: IndusInd Pioneer Heritage

The Pioneer Heritage record was checked against the current card page, latest rewards terms, merchant-category revision, MITC, fuel waiver schedule, March-2026 benefit guide, January-2026 Pioneer revision and 2020 launch release. Corrected the launch date, fees/waiver, finance charge, forex, cash-advance fee, domestic/international/category reward rates, redemption cap/value, lounges, golf, fuel waiver and current movie offer. The issuer distinguishes newer and erstwhile card variants, and the page's 30,000-point monthly cash-credit cap conflicts with current reward terms' 50,000 monthly cap across redemption options. The newer terms are encoded, with the conflict and network-variant limitation recorded. Current validation: 370 cards, 869 rules, 790 strict-scope, 711 strict-ready (90%), zero errors/warnings. Numeric evidence coverage is 52% fees, 41% rewards, 43% benefits and 93% eligibility; stamp mismatches: zero. These are traceability measures, not factual-accuracy rates.


## Latest record-level review: IndusInd Pioneer Legacy

The Pioneer Legacy record was checked against current card, reward, cash-credit, bonus, category-rate and lounge/golf/fee sources. Corrected the weekday/weekend and reduced-category reward schedule, cash redemption cap/value/fee, first-year bonus, fee-plan ambiguity, paid/complimentary forex, lounge thresholds, current golf quota, fuel waiver and published travel cover. The product page has multiple fee/network variants; no single joining fee, forex rate, network or tier is asserted. Current validation: 370 cards, 871 rules, 792 strict-scope, 714 strict-ready (90%), zero errors/warnings. Numeric evidence coverage is 52% fees, 41% rewards, 43% benefits and 93% eligibility; stamp mismatches: zero. The 2022 guide's personal air-accident cover was omitted because issuer updates say this bank-wide cover ended in Dec-2025.


## Latest record-level review: IndusInd Pioneer Private

The current issuer product and reward pages, card-specific detailed T&Cs, 2026 benefit guide, consolidated MITC, fuel-waiver schedule and bank-wide insurance update were reviewed. Corrected the unsupported 2015 launch date, current fee schedule (NIL joining, INR25,000 annual with INR10 lakh waiver, 2% monthly finance, zero forex and waived cash advance), Visa Infinite identity, rewards (3 points/INR100; selected MCCs 0.7; INR1 redemption value), lounge access, golf qualification/quota, welcome and annual Taj milestones, fuel waiver and published card benefits. The issuer reward cap evidence conflicts: the currently fetched reward page and card T&Cs say no monthly redemption cap, while an indexed older version states 30,000 monthly cash-credit points. Product-specific movie T&Cs state two uncapped complimentary movie tickets/month and three non-movie tickets/quarter, while the Visa Infinite benefits page shows a separate BOGO offer capped at INR300/transaction. These conflicts are recorded in the YAML and issuer manifest. Air-accident insurance was omitted because the bank ended it from 21-Dec-2025. Current validation: 370 cards, 872 rules, 793 strict-scope, 716 strict-ready (90%), zero errors/warnings. Numeric evidence-path coverage is fees 1,298/2,473 (52%), rewards 1,272/3,069 (41%), benefits 1,388/3,191 (43%) and eligibility 618/667 (93%); stamp mismatches: zero.


## IndusInd Platinum (reviewed 2026-10-26)

Issuer pages show Visa and Mastercard are both selectable variants, so the scalar network fields are unknown. Current MITC confirms NIL joining/annual fee, 3.5% foreign-currency mark-up, 3.95% monthly finance charge and 2.5% cash-advance fee (minimum INR300). Current rewards are 1.5 points per INR150; issuer lists INR0.40 cash and INR0.60 non-cash value (excluding air miles), with 2,500 points monthly cash-redemption cap. Fuel surcharge waiver is 1% on INR500–3,000 fuel transactions with INR100 billing-cycle cap. No current lounge entitlement was found; BMS was discontinued in 2022 and air-accident insurance in 2025. Exact launch date, eligibility cutoffs and full Total Protect policy terms remain unknown. This review increases explicit numeric evidence coverage, not a measured factual-accuracy rate.


## Poonawalla eLITE RuPay (reviewed 2026-10-26)

Issuer says the Poonawalla co-brand partnership ended and cardholders moved to IndusInd Platinum RuPay on 5-Oct-2025; the record is now discontinued. Legacy fees, reward rates, milestone and movie offer are recorded with end date 4-Oct-2025. No exact launch date, eligibility cutoffs, lounge quota or fuel cap were established.


## Samman RuPay (reviewed 2026-10-26)

Corrected the current model from reward points to 1% cashback on retail spend up to INR20,000 per statement cycle (INR200 maximum). Current MITC lists NIL joining / INR199 annual fee, annual fee waived after INR75,000 prior anniversary-year spend, 3.83% monthly interest and waived cash-advance fee. Benefits include 1% fuel waiver on INR400-INR4,000 transactions, 1% IRCTC surcharge waiver up to INR5,000 per booking (INR600 per anniversary year), two INR200 BookMyShow tickets per calendar year and published travel insurance limits. Exact eligibility thresholds and lounge access remain unknown.


## Tiger Credit Card (reviewed 2026-10-26)

Corrected monthly finance charge to 3.50% and retained card-specific 1.5% forex markup. Rewards earn 1 point per INR100 base plus annual anniversary-spend tiers of 1x, 2x, 4x and 6x; point value is INR0.40, cash redemption is capped at 5,000 points per calendar month and points expire after 24 months. Updated quarterly golf, quarterly domestic / annual international lounge visits, concierge, BookMyShow, fuel waiver and Total Protect notes. The movie offer page conflicts on calendar- versus financial-year frequency. Exact eligibility cutoffs and full Total Protect terms remain unpublished.

## Latest record-level review: Kotak 811 Dream Different

Reviewed the current Kotak KFS (version KFSDD04062026), consolidated MITC/Reward Card Agreement, Dream Different reward FAQ and general eligibility FAQ. Corrected product identity, launch date and network tier; fixed current joining fee, annual fee, finance charge, forex, cash advance fee and fuel waiver; recorded the railway waiver and FD-backed eligibility. Most significantly, the issuer confirms that Dream Different Reward Points and milestone rewards ended effective 1-Apr-2026; points left after 30-Sep-2026 expired. Current reward earning is represented as zero. The previous record had conflated Dream Different with the separate fee-paying Kotak 811 card and included its PVR milestone and annual-fee waiver. The current KFS lists a ?424 joining fee but leaves tax inclusion unclear. See `docs/sources/kotak/INDEX.md` and `docs/sources/kotak/811-dreamdifferent/`.

## Latest record-level review: Kotak Air+ Prime

Reviewed the current Kotak Air+ Prime KFS, detailed card T&Cs, consolidated MITC, fee/reward pages and lounge terms. Refreshed the annual-fee waiver requirement, finance and cash-advance terms, rewards and exclusions, welcome/renewal miles, lounge quotas and fuel waiver. Removed unsupported 2025-01-01 launch date and Visa Signature tier. A material redemption conflict remains: current detailed T&Cs say 1 Air Mile = ?0.50 on vouchers, while the product webpage says ?5; the record keeps the travel rate separate and documents the conflict. See `docs/sources/kotak/INDEX.md` and `docs/sources/kotak/air-plus-prime/`.

## Latest record-level review: Kotak Air+

Reviewed current Kotak Air+ product/FAQ pages, 12-Mar-2026 KFS, detailed card T&Cs and consolidated MITC. Corrected the unsupported launch date and Visa tier, current fees/waiver schedule, APR and cash-advance charge, Air Miles rates/cap/exclusions, welcome and renewal miles, lounge access and fuel waiver. Kotak's product FAQ conflicts with its current KFS/MITC over whether the INR4 lakh annual-fee waiver applies; the KFS/MITC schedule is represented, and the FAQ discrepancy is documented. See `docs/sources/kotak/INDEX.md` and `docs/sources/kotak/air-plus/`.

## Latest record-level review: Kotak Air

Rechecked the current Kotak Air product page, FAQ, KFS and consolidated MITC; corrected the benefit source URL and set fee confidence to medium. The annual-fee waiver sources conflict: KFS/MITC says INR250,000 qualifying retail spend, the card FAQ says above INR200,000, and the product-fee page says no waiver. The structured value follows KFS/MITC, with the conflict documented. Latest validation: 370 cards, 877 reward rules, 792 strict-scope and 721/792 strict-ready (91%), zero errors/warnings. Numeric evidence coverage: fees 1,343/2,470 (54%), rewards 1,325/3,079 (43%), benefits 1,439/3,200 (45%), eligibility 623/672 (93%). Stamp audit: zero mismatches. These coverage figures do not measure factual accuracy. A fresh active/invite-only queue scan places Kotak League Platinum first, tied at 2026-07-03.

## Latest record-level review: Kotak League Platinum

Reviewed current Kotak pages and KFS version KFSLP04062026; corrected the unsupported launch date/network tier, fee values, reward paths, current exclusions/utility cap, fuel and railway waivers, paid-variant joining gift, milestone benefits and eligibility. Current FAQ says no lounge benefit. General Kotak eligibility FAQ says age up to 65 while card-specific page says 60; income is published as INR500,000 without employment-type split; all are documented. Validator: 370 cards, 878 reward rules, 793 strict-scope, 722/793 strict-ready (91%), zero errors/warnings. Numeric evidence coverage: fees 1,350/2,470 (55%), rewards 1,331/3,082 (43%), benefits 1,446/3,199 (45%), eligibility 625/674 (93%). Stamp mismatches: zero. Coverage is not factual accuracy. Next oldest active/invite-only record: PVR INOX Kotak, tied at 2026-07-03.

## Latest record-level review: PVR INOX Kotak

Reviewed the current PVR INOX card page, KFS version KFSPIO12032026 and current PVR-program MITC terms. Removed unsupported network/tier, launch date, airport lounge quota, fuel waiver and generic points valuation; corrected fees, APR, add-on fee, monthly M-Coupon milestone, movie discounts, cinema-lounge entry and age/residency. The product page's table leaves exactly INR10,000 spend unspecified while its prose promises one ticket per INR10,000; bank terms reserve a right to set a cap, but the product page shows continued accrual. A limited offer through 31-Dec-2026 gives an INR400 voucher for PVR-app applicants who receive the card and spend INR500 within 30 days; linked offer PDF returned 403, accessible official offer page was used. Validator: 370 cards, 878 rules, 793 strict-scope, 722/793 strict-ready (91%), zero errors/warnings. Numeric evidence coverage: fees 1,357/2,471 (55%), rewards 1,332/3,078 (43%), benefits 1,451/3,197 (45%), eligibility 627/676 (93%). Stamp mismatches: zero. Next: Kotak UPI RuPay, tied at 2026-07-03.


## Latest record-level review: Kotak White (26 Oct 2026)

Reviewed Kotak's current White card/White Pass pages, KFSWS12032026, consolidated MITC, the 1-Apr-2026 change notice and current lounge terms. Removed unsupported network/tier and launch date; corrected milestone-only White Pass earning, current milestone ladder and exclusions, fee/waiver schedule, APR/forex/cash advance, lounge spend gate, quotas, surcharge waivers and issuer-published eligibility. Source conflicts on surcharge cap cycle and unpublished network variant/launch date are documented. The card review improved evidence coverage but does not establish a factual-accuracy percentage.


## Latest record-level review: RBL Bank Cookies (26 Oct 2026)

Reviewed RBL's current Cookies product page, card-specific terms, Schedule of Charges, MITC and network guide. Corrected the old annual-fee model to the recurring INR100 monthly fee (waived with INR5,000 eligible prior-month spend), updated current reward rates and point value, corrected fuel waiver, and added welcome/milestone vouchers, brand cashback and BookMyShow discount. RBL offers Visa and Mastercard variants, so scalar network/tier are unknown. The existing schema cannot model monthly fees; this limitation is explicit in the record notes. Card-specific age/income/bureau thresholds and launch date are not published. Evidence coverage increased; no single factual-accuracy percentage is inferred.


## Latest record-level review: RBL Platinum Maxima Plus (26 Oct 2026)

Current RBL card page, product T&Cs, schedule of charges, MITC and network guide were reviewed. Corrected the product to Visa (network tier unknown), cleared unsupported launch date, updated current fees, rewards/milestones, welcome conditions, lounge gate and movie benefit, and removed the unsupported fuel surcharge waiver. The current issuer page's MCC list includes invalid three-digit entry 711 for contracted services; it is documented rather than entered as a four-digit MCC. The current page's value illustration implies INR0.25 per point; redemption portal options may differ.

## Latest record-level review: Standard Chartered Smart (26 Oct 2026)

Current SC Smart page, Smart FAQ, card-specific terms dated 30-Sep-2024, current tariff schedule and general credit-card terms were reviewed. Replaced monthly cashback caps with statement-cycle caps, removed the derived INR18,000 annual cap and unsupported fuel surcharge waiver, corrected cash advance charge to 3%/INR300 minimum, and added conditional first-90-day interest-free and eligible 3-month EMI offers. Fee waiver and eligibility now reflect card-specific terms; exact launch date, network variant, income/bureau cutoffs and sourcing-city list remain unknown. Validator: 370 cards, 878 reward rules, 792 strict-scope, 724/792 strict-ready (91%), zero errors/warnings. Numeric evidence coverage: fees 1,383/2,463 (56%), rewards 1,366/3,076 (44%), benefits 1,511/3,212 (47%), eligibility 629/680 (92%). Stamp mismatches: zero. Coverage is not factual accuracy. ACE, AI Inside RuPay, AI Inside and Anq Phi were reviewed after this historical snapshot; the current oldest active/invite-only record is YES Bank EMI (`data/cards/yes/emi.yaml`), tied at 2026-07-03.

## Latest record-level review: YES Bank FREO (26-Oct-2026)

The current rendered issuer page says new applications are closed and existing cardholders should contact the bank to upgrade, so the record is now `on-hold`. Updated membership fees/waivers, 3.4% forex markup, 3.99% monthly finance, cash advance 2.5%/INR650 minimum, 1% unlimited cashback on eligible personal spends and its current exclusions, plus INR400-5,000 fuel-waiver range and INR125 statement cap. Added published age/income criteria and cleared unsupported network, tier, launch date and default residency. Current card-specific MITC download returned an HTML/JavaScript shell; current consolidated MITC v18 is archived and used for common charges. Cashback posting details and lounge/concierge claims remain unknown. Current validator: 370 cards, 881 rules, 792 strict scope, 735/792 strict-ready (92%), zero errors/warnings. Evidence coverage: fees 1,425/2,450 (58%), rewards 1,414/3,070 (46%), benefits 1,555/3,219 (48%), eligibility 636/687 (93%); stamp mismatches: zero. These figures do not measure factual accuracy. Full rendered evidence is in `docs/sources/yes/freo/freo-rendered-extract.md`.


## Latest record-level review: YES Bank Klick

The current rendered issuer page, linked Klick RuPay guide, current card listing and consolidated MITC v18 were reviewed. Corrected the unsupported Mastercard/Platinum identity to virtual RuPay, removed unsupported launch date, and corrected virtual-card cash-advance fee treatment, reward evidence, current exclusions and fuel-waiver band/cap. The issuer publishes 2 points per INR200 on non-UPI spend and says existing YES Bank cardholders cannot apply. A separately indexed guide suggests UPI points, in conflict with the current linked guide/page; UPI earn remains unasserted. Exact launch date, network tier, age/income/bureau/residency thresholds and cash-advance availability remain unknown. Latest validation: 370 cards, 881 rules, 792 strict-scope, 735/792 strict-ready (92%), zero errors/warnings. Numeric evidence paths: fees 1,429/2,448 (58%), rewards 1,416/3,070 (46%), benefits 1,555/3,220 (48%), eligibility 636/687 (93%); date-order mismatches: zero. These are support/structural indicators, not a factual accuracy rate.


## Latest record-level review: YES Bank POP-CLUB

The current rendered product page, current YES Bank credit-card listing and consolidated MITC v18 were checked. Corrected unsupported launch date and RuPay Platinum assignment, standard joining/annual fees and spend waiver, current forex/APR/cash-advance fee, 10/2 POPcoin earn, minimum qualifying transaction, exclusions, POPcoin value/redemption scope/expiry, eligibility and current fuel-waiver terms. The card page's INR100 statement fuel cap conflicts with MITC v18's INR300 cap; the card-specific page is represented and conflict retained. Card-specific one-year POPcoin expiry conflicts with general MITC v18's three-year reward-point term; the specific POPcoin FAQ is followed. Current joining bundle is marked as limited-time with unknown fulfillment conditions. Latest validation: 370 cards, 881 reward rules, 792 strict-scope, 737/792 strict-ready (93%), zero errors/warnings. Numeric evidence paths: fees 1,436/2,449 (59%), rewards 1,421/3,070 (46%), benefits 1,562/3,221 (48%), eligibility 640/691 (93%); date-order mismatches: zero. These are support/structural indicators, not a factual accuracy rate. Full evidence is under `docs/sources/yes/pop-club/`.


## Latest record-level review: YES Bank RESERV (26 Oct 2026)

Reviewed current YES Bank listing, indexed RESERV product terms, current MITC v18 and the official Nov-2023 value chart. Corrected stale standard APR to 2.99% monthly, cash-advance minimum to INR650, foreign-currency markup to 2.00%, utility reward cap to 750 points, redemption-fee exception, domestic lounge spend gate, and fuel-waiver range/cap to INR500-4,000 and INR500 per statement. Cleared unsupported Mastercard/World and launch date. Existing issuer card page still lists Reserv; record remains active. Current issuer sources support three domestic lounge visits quarterly and six international visits yearly. Exact movie-booking conditions, current Select MCC mapping, realized point value, guest rules and eligibility thresholds remain unknown or provisional. Current validation: 370 cards, 882 rules, 791 strict-scope, 739/791 strict-ready (93%), zero errors/warnings. Numeric evidence coverage: fees 1,443/2,442 (59%), rewards 1,431/3,066 (47%), benefits 1,570/3,223 (49%), eligibility 640/691 (93%); stamp mismatches: zero. Full source extract and current MITC copy are under `docs/sources/yes/reserv/`.


## Latest record-level review: YES Bank SELECT (26 Oct 2026)

Reviewed current SELECT page/listing and current MITC v18. Updated fees/waivers, 3.99% monthly APR, 2.5%/INR650-min cash advance, reward rates/caps/exclusions, utility MCC 4900 cap, current 1% fuel waiver on INR500-3,000 with INR125 statement cap, one domestic quarterly lounge visit with INR50,000 prior-quarter spend gate, District BOGO/coffee offer and published age/income/existing-cardholder eligibility. Cleared unsupported Mastercard/World, exact launch date and resident-only criterion. The issuer detail page carousel says 3.50% forex, while MITC v18 lists 2.75% markup / 3.50% DCC; the structured record follows MITC and the conflict remains disclosed. Bureau cutoff, network variant, international lounge quota and full Select MCC list remain unknown. Validation: 370 cards, 883 rules, 792 strict-scope, 743/792 strict-ready (93%), zero errors/warnings. Numeric evidence coverage: fees 1,450/2,442 (59%), rewards 1,444/3,070 (47%), benefits 1,578/3,228 (49%), eligibility 644/695 (93%); stamp mismatches: zero. Evidence is under `docs/sources/yes/select/`.


## Latest record-level review: YES Bank Wellness (26 Oct 2026)

Reviewed current issuer listing, official Wellness usage guide and current MITC v18. Updated ?499 standard joining/renewal fee, 3.99% monthly APR, 2.5%/?650-min cash advance, 3.5% forex, 20/4 YES Rewardz per ?200 at pharmacy/other retail, current issuer exclusions, up-to-?0.25 point value, health services, welcome voucher and current fuel waiver (?500-3,000 transactions, ?125 statement cap). Removed unsupported Mastercard/Platinum and launch date. Current MITC fuel cap conflicts with an older Wellness guide's ?250 cap; v18 is followed. Card-specific age/income/bureau/residency and reward cap remain unknown; no lounge access inferred. Validation: 370 cards, 883 rules, 792 strict-scope, 745/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,456/2,442 (60%), rewards 1,450/3,069 (47%), benefits 1,584/3,229 (49%), eligibility 644/695 (93%); stamp mismatches: zero. Evidence extract and current MITC copy are under `docs/sources/yes/wellness/`.


## Latest record-level review: YES Bank Wellness Plus (26 Oct 2026)

Reviewed current issuer listing, official Wellness Plus usage guide/value chart, and current MITC v18. Updated ?1,499 fee, 3.99% monthly APR, 2.5%/?650-min cash advance, 3.5% forex, 30/6 YES Rewardz per ?200 on pharmacy/other retail, health benefits, two domestic lounge visits quarterly, and current fuel-waiver band/cap (?500-3,000 transactions; ?250 per statement). Removed unsupported Mastercard World and exact launch date. Current MITC cap conflicts with older guide's ?500 cap; v18 is followed. Card-specific eligibility and reward cap remain unknown. Validation: 370 cards, 883 rules, 792 strict-scope, 747/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,462/2,442 (60%), rewards 1,456/3,068 (47%), benefits 1,592/3,230 (49%), eligibility 644/695 (93%); stamp mismatches: zero. Full extract and archived MITC are under `docs/sources/yes/wellness-plus/`.


## Latest record-level review: YES Bank Zagg (26 Oct 2026)

Reviewed the current YES Bank Zagg page, Zagg/Rivpe rewards policy and FAQ, co-brand network page and current MITC v18. Replaced the incorrect YES Rewardz currency with Zagg Coins: 3 coins per INR100 only on eligible Zagg-app UPI transactions, INR50 minimum, rounded down, coin value INR0.25 each (effective cash value 0.75%) and a dynamic cap equal to 1.5% of assigned credit limit per statement. Updated co-brand network to RuPay, common fees, lounge threshold/quota, fuel waiver and published age/income/existing YES-cardholder eligibility; cleared unsupported Mastercard/Platinum/date/residency values. Zagg Coin expiration is not stated in the reviewed policy. Validation: 370 cards, 883 rules, 792 strict-scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,468/2,442 (60%), rewards 1,460/3,067 (48%), benefits 1,598/3,231 (49%), eligibility 648/699 (93%); stamp mismatches: zero. Evidence is under `docs/sources/yes/zagg/`.

## Previous record-level review: Canara Bank RuPay Select

Reviewed the current Canara Bank RuPay Select product page and official February 2026 variants/features comparison on 2026-10-26. Updated fees, cash advance minimum, rewards and point value, domestic/international lounge quotas, fuel surcharge reimbursement and concierge. Cleared unsupported launch date, realized reward value and default residency. The current product page says NIL primary enrollment fee while the February comparison says INR250; this conflict remains documented and the current product page was followed. Latest full validator: 370 cards, 883 reward rules, 792 strict scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,471/2,442 (60%), rewards 1,461/3,066 (48%), benefits 1,598/3,232 (49%), eligibility 650/701 (93%). Stamp audit: zero date-order mismatches. These are schema/provenance/evidence-path checks, not a factual accuracy score. Sources and capture notes are in `docs/sources/canara/rupay-select/`.

## Previous record-level review: IDBI Bank Winnings

Reviewed current issuer product and FAQ pages plus archived KFS, MITC and Usage Guide on 2026-10-26. Corrected cash advance minimum; recorded welcome offers, milestone rewards, current MCC exclusions, domestic/international lounge quotas and age/residency criteria. Cleared unsupported launch date and unsubstantiated realized point value. The issuer FAQ says 1 Delight Point = 0.25 paisa, an ambiguous and unusually low value; numeric redemption value remains unknown pending issuer clarification. Latest validator: 370 cards, 883 reward rules, 792 strict-scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,473/2,442 (60%), rewards 1,461/3,063 (48%), benefits 1,603/3,239 (49%), eligibility 651/702 (93%). Stamp audit: zero date-order mismatches. These checks measure structure/provenance/evidence paths, not factual accuracy. See `docs/sources/idbi/winnings/`.

## Latest record-level review: Adani One ICICI Bank Platinum and Signature

Reviewed the current ICICI product pages and linked card-specific T&Cs, current shared MITC, Adani Rewards terms and official launch information on 2026-10-26. Corrected both cards' rewards from fixed-value cashback/bank credit to closed-loop Adani OneApp Rewards with no monetary value; updated reward schedules, exclusions, vouchers, airport services, lounge and spend gates. Captured conflicts and unsupported fields in the source extracts. Latest validator: 370 cards, 883 reward rules, 792 strict scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,483/2,442 (61%), rewards 1,471/3,057 (48%), benefits 1,603/3,239 (49%), eligibility 655/706 (93%). Stamp audit: zero date-order mismatches. These checks measure schema/provenance/evidence paths and do not calculate factual accuracy. Next oldest review cohort is dated 2026-07-05 and includes Axis Magnus, Axis Miles & More, Axis RuPay, Axis Shoppers Stop and other issuers. Evidence is archived in `docs/sources/icici/adani-one-platinum/` and `docs/sources/icici/adani-one-signature/`.
Reviewed the current ICICI product pages and linked card-specific T&Cs, current shared MITC, Adani Rewards terms and official launch information on 2026-10-26. Corrected both cards' rewards from fixed-value cashback/bank credit to closed-loop Adani OneApp Rewards with no monetary value; updated reward schedules, exclusions, vouchers, airport services, lounge and spend gates. Captured conflicts and unsupported fields in the source extracts. At that point, validation showed 370 cards, 883 reward rules, 792 strict scope and 748/792 strict-ready; see the current database validation above for the refreshed snapshot. Evidence is archived in `docs/sources/icici/adani-one-platinum/` and `docs/sources/icici/adani-one-signature/`.

## Latest record-level review: Axis Bank Magnus (26 Oct 2026)

Reviewed the current Magnus product, benefits and eligibility pages; card-specific terms effective 28-Aug-2026; current MITC; Sept-2023 and June-2025 Magnus changes; and the live EDGE transfer table. Corrected the launch date to 18-Sep-2019; added current fee-waiver exclusions, DCC/rent fees, the limit-dependent accelerated reward band, rent reward cap, portal rate above INR2 lakh, domestic lounge authentication change, four guest visits/year, current voucher window, insurance and published age/income/residency criteria. Replaced stale partner ratios with the issuer's current 28-row table; left fixed INR point valuation unknown. Removed unsupported air-accident cover, golf and milestone claims. The card page's 2:5 transfer headline conflicts with partner-level 5:1/5:2 ratios and its “20 partners” count differs from 28 rows in the live transfer table. A separate Burgundy Salary LTF construct is not modeled as a separate card record. Validator: 370 cards, 884 rules, 793 strict-scope, 749/793 strict-ready (94%), zero errors/warnings. Evidence-path coverage and stamp results are in the current database validation above. Sources are under `docs/sources/axis/magnus/`.


## Latest record-level review: Axis IndianOil Premium (26 Oct 2026)

Reviewed the current Axis product page and linked card terms, June-2025 reward-exclusion revision, current lounge program and IOCL outlet list, current MITC, EDGE Rewards FAQ and fee-change notices. Corrected the grocery cap to 33 total miles, cleared unsupported RuPay/Select and 2020-01-01 launch claims, removed MCC 6513, encoded category-based exclusions and documented different annual-fee-waiver and returned-payment terms. Fuel earn is 6 total miles per INR 150 up to INR 15,000 monthly at authorized IOCL outlets, then base-only; the lounge benefit requires INR 50,000 eligible spend in the previous three calendar months except for the new-issuance grace period. Some EDGE Miles redemption paths are INR 1/mile but realized value varies. Current validation: 370 cards, 884 rules, 793 strict scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence coverage: fees 1,528/2,474 (62%), rewards 1,495/3,050 (49%), benefits 1,620/3,233 (50%), eligibility 663/716 (93%). Stamp mismatches: zero. No dataset-wide factual-accuracy percentage is defensible. Evidence is under `docs/sources/axis/indianoil-premium/`.


## Latest record-level review: Axis LIC Platinum (2026-10-26)

Reviewed the current Axis product page, linked LIC reward catalogue, 2025 category-based exclusion notice, 2026-08-28 issuer-wide terms update and current MITC. Corrected the LIC reward currency/rates, removed unsupported fixed point values, captured catalogue-specific redemption fee/expiry and refreshed current fee, fuel-waiver and eligibility fields. Network/tier, exact launch date, fixed point value, income and bureau cutoffs, accelerator cap, and numeric insurance limit remain unknown where current issuer evidence does not publish them. The validator is clean at 370 cards / 884 rules; strict-ready is 749/793 (94%). Current numeric evidence paths: fees 1,541/2,475 (62%), rewards 1,516/3,043 (50%), benefits 1,648/3,227 (51%), eligibility 671/724 (93%); stamp mismatches: zero. These coverage measures are not a factual accuracy rate. Source extract and PDFs are under `docs/sources/axis/lic-platinum/`.


## Latest record-level review: Axis LIC Signature (2026-10-26)

Reviewed current Axis product page, card-specific 2025 exclusion notice, current Axis lounge program, LIC reward catalogue, 2026-08-28 issuer terms update and current MITC. Corrected reward currency/rates, category exclusions, redemption value handling, lounge visits to 2/quarter after INR50,000 prior-three-calendar-month spend, fuel waiver, fees and eligibility. Added current up-to-INR300 activation cashback. Unknown network/tier, exact launch date, fixed point value, accelerator cap, eligibility thresholds and numeric insurance limit remain null. Documented product-page vs catalogue redemption-fee conflict and 8/year vs 2/quarter lounge wording. Validation: 370 cards, 884 rules, 793 strict-scope, 749 strict-ready (94%), zero errors/warnings. Numeric evidence paths: fees 1,545/2,475 (62%); rewards 1,521/3,041 (50%); benefits 1,654/3,226 (51%); eligibility 673/726 (93%); stamps zero. These coverage measures are not a factual-accuracy rate.


## Latest record-level review: Axis RuPay generic landing page (2026-10-26)

The current Axis RuPay page is a generic variant chooser, not a single card SKU. Removed unsupported exact launch date, RuPay Platinum tier, generic EDGE reward value/rate, and MCC exclusion. Variant-dependent joining/annual fees and reward terms remain null; the generic page supports the retained cash advance, forex and finance values. Documented stale 1.5% DCC on the generic page against the 2026-08-28 issuer update of 3.5%. Validation remains 370 cards, 884 reward rules, 793 strict scope, 749 strict-ready (94%), zero errors/warnings. Numeric evidence paths: fees 1,549/2,473 (63%), rewards 1,521/3,037 (50%), benefits 1,654/3,226 (51%), eligibility 673/726 (93%); stamp mismatches zero. These are evidence-path metrics, not a factual-accuracy rate.


## Latest record-level review: Samsung Axis Bank Signature (2026-10-26)

Reviewed current card page, updated card-specific T&Cs, current lounge terms, MITC, 2026-08-28 issuer update and dated launch announcement. Corrected fees/rewards, corrected the lounge gate and fuel waiver, encoded Samsung purchase cashback channels and exclusions, removed the unsupported point-realization estimate and unsupported MCC 6513. The fuel-waiver detail conflicts between INR4,000 and INR5,000 upper-band wording; detailed section says INR4,000. Validator: 370 cards, 884 rules, 793 strict scope, 749 strict-ready (94%), zero errors/warnings. Numeric evidence paths: fees 1,554/2,473 (63%); rewards 1,528/3,037 (50%); benefits 1,662/3,226 (52%); eligibility 675/728 (93%); stamp mismatches zero. These are traceability measures, not a factual-accuracy rate.


## Latest record-level review: Axis Bank Shoppers Stop (2026-10-26)

Reviewed current Axis product page, current card T&C, current MITC, 2026-08-28 issuer-wide terms and linked Dining Delights PDF. Updated joining/annual fee and waiver, First Citizen base/accelerated rates, ?0.50 value, exclusions, welcome vouchers, fuel waiver, and published eligibility. Cleared unsupported Visa Platinum network/tier and specific MCC 6513 assertion. EazyDiner offer appears on the live product page although the currently linked detailed PDF period ended 2024-06-30; this conflict is recorded for live verification. Current validator: 370 cards, 884 rules, 793 strict scope, 749 strict-ready (94%), zero errors/warnings. Numeric evidence paths: fees 1,559/2,473 (63%); rewards 1,536/3,037 (51%); benefits 1,669/3,226 (52%); eligibility 677/730 (93%); stamp mismatches zero. Metrics are traceability aids, not factual accuracy.


## Latest record-level review: Axis SpiceJet Voyage Black (26 Oct 2026)

Compared the current issuer page and card-specific terms with the current MITC, bankwide 28-Aug-2026 terms update, SpiceClub point-earning/exclusion documents, voucher/membership/milestone terms, current lounge program and 2022 launch announcement. Corrected the finance rate to 3.75% monthly, recorded first-year annual fee NIL and renewal annual fee INR2,000, modeled lounge access as 2/quarter after INR50,000 eligible spend in the previous three calendar months, and updated point MCCs, membership-earn conditions, cap and age/residency eligibility. Removed unsupported Visa Signature tier and MCC 6513. The issuer product page advertises eight lounge visits/year while the current lounge table gives two/quarter; this discrepancy is documented and the detailed program table is modeled. SpiceClub Gold member earn is conditional and time-limited to the complimentary year unless continued by tier qualification. Validator remains 370 cards, 884 reward rules, 793 strict-scope, 749/793 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage after this review: fees 1,563/2,473 (63%), rewards 1,543/3,037 (51%), benefits 1,681/3,226 (52%), eligibility 679/732 (93%); zero verification-date mismatches. These metrics do not measure factual accuracy. Sources and open issues are documented in `docs/sources/axis/spicejet-voyage-black/`.


## Latest record-level review: Axis SpiceJet Voyage (26 Oct 2026)

Compared the current issuer card page with MITC, 28-Aug-2026 bankwide terms, SpiceClub points/exclusion terms, activation, membership, milestone/renewal documents, current lounge program and the 2022 launch announcement. Corrected monthly finance to 3.75%, represented the year-one annual-fee waiver and INR750 renewal fee, set domestic lounge access to one visit/quarter after INR50,000 eligible spend, updated reward MCCs and the Silver-tier membership condition, and added published age/residency eligibility. Cleared unsupported Visa Platinum tier and MCC 6513. The current lounge program says prior three calendar months while the product page says previous quarter; this source wording difference is recorded. Validator remains 370 cards, 884 reward rules, 793 strict-scope and 749/793 strict-ready (94%), with zero errors/warnings. Numeric evidence-path coverage after review: fees 1,567/2,473 (63%), rewards 1,552/3,037 (51%), benefits 1,692/3,227 (52%), eligibility 681/734 (93%); date mismatches zero. These are coverage checks, not a factual-accuracy estimate. See `docs/sources/axis/spicejet-voyage/`.


## Latest record-level review: BOBCARD Scapia (26 Oct 2026)

Reviewed the current BOBCARD Scapia product page, card-specific MITC/KFS and current cardholder agreement. Corrected finance rate, variant handling, Scapia Coin currency/value/redemption/expiry, reward exclusions, lounge activation conditions, airport privileges and fuel waiver. The record now uses the conservative RuPay rate (5 Coins/INR100 above INR500); Visa earn is 10 Coins/INR100 on eligible transactions INR20+, and app travel earns 20 Coins/INR100 on either variant. Coins redeem only in the Scapia app at 5/INR1 and expire after 36 months. Unsupported 2024 launch date, Visa Signature tier and MCC 6513 were cleared. Validator: 370 cards, 883 reward rules, 792 strict-scope, 748/792 strict-ready (94%), zero errors/warnings. Numeric evidence-path coverage: fees 1,573/2,473 (64%), rewards 1,558/3,035 (51%), benefits 1,698/3,228 (53%), eligibility 683/736 (93%); date mismatches zero. These measures do not establish database-wide factual accuracy. See `docs/sources/bob/scapia/`.
