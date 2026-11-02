# IDFC FIRST Bank — source verification (2026-07-04)

IDFC FIRST publishes per-card **"Communication" PDFs** under
`content/dam/idfcfirstbank/pdf/credit-card/<Card>-Credit-Card-Communication-*.pdf`.
Downloaded + read via pypdf.

## Corrections found (metal cards used per-Rs100; source says per-Rs150)
| Card | Field | Was | Source PDF |
| --- | --- | --- | --- |
| Ashva | reward per_inr | 100 | **150** ("reward points for every Rs150", 1 RP = Rs0.40) |
| Ashva | accel effective_rate | 9 | **10** ("up to 10 reward points for every Rs150") |
| Mayura | reward per_inr | 100 | **150** ("10 reward points for every Rs150", 1 RP = Rs0.50) |

Ashva joining Rs2,999 + 1% forex ✓; Mayura joining Rs5,999 + 0% forex ✓ (confirmed
from page JSON-LD/title). Reward points never expire on both. Other IDFC cards already
use per-Rs150 (classic/wealth/wow/select/power/first-private/etc.); indigo (BluChip
co-brand), hello-cashback (%), secured-rupay (FD) use their own models.

## FIRST EARN secured RuPay Credit Card (reviewed 2026-10-26)

Reviewed IDFC FIRST's [current product page](https://www.idfcfirst.bank.in/credit-card/secured-rupay-credit-card), the [20-Jan-2025 launch announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-Launches-all-new-FIRST-EARN-RuPay-Credit-Card.pdf), current [MITC/fees](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf), [zero-forex announcement effective 17-Sep-2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf), the current 10-page E-Kit and current FIRST EARN Privileges terms. All five PDFs were downloaded under `docs/sources/idfc-first/secured-rupay/`.

### Corrections and limitations

- Corrected unsupported 2024-01-01 launch/effective dates to the official 20-Jan-2025 launch date.
- Corrected current joining fee to INR0 for new cards issued on/after 16-Dec-2025, annual fee to INR499 + GST from year two, and annual-fee waiver at INR100,000 eligible anniversary-year spend. Current all-card forex markup is zero from 17-Sep-2026; the earlier 3.5% period is retained separately.
- Current MITC lists customer-specific finance rates of 0.71%-3.85% monthly (8.5%-46.2% APR). It shows a flat INR199 cash-advance transaction fee. The schema cannot model a flat fee, so `cash_advance_fee` is null and the exact fee is preserved in the notes.
- Refreshed cashback to 0.5% standard, 1% UPI through IDFC FIRST app for cards issued from 16-Dec-2025, total cashback cap INR500 per statement, and correct exclusions/settlement conditions. Removed old MCC 6513 rent exclusion; fuel purchases earn cashback. RuPay UPI merchant restrictions remain subject to NPCI.
- Added current 10% first-transaction cashback up to INR250 within 15 days, 5% first-EMI cashback up to INR1,000 within 30 days, District movie offer and spend-active condition, roadside assistance, four current insurance covers, FD-backed credit limit and eligibility age/residency.
- Removed the older fuel-waiver values because the current card page did not re-confirm them. The issuer advertises up to 5% travel-booking bonus cashback, but current program terms/scope remain unverified and are noted for follow-up.
- Eligibility: 18-80, Indian resident with India address and singly-held IDFC FIRST FD of at least INR5,000; no income proof or prior credit history required. No numeric bureau-score minimum is published.


## FIRST Select (reviewed 2026-10-26)

Reviewed the current [FIRST Select page](https://www.idfcfirst.bank.in/credit-card/select), current [Select Product Usage Guide](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Select-Product-Guide-28-03-24.pdf), [January reward-base/category update and April lounge update](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Select-Credit-Card.pdf), current [general MITC](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf), and bank-wide [zero-forex notice effective 17-Sep-2026](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf). Archived the latest Select guide and update PDF under `select/`.

Corrected the reward base to 1 point/INR200, category rates, reward eligibility/expiry, lounge quota, and benefits. The issuer page itself conflicts about point expiry (24 months vs never), current vs previous month lounge threshold, and app travel bonus rates (20%/10% vs 33%/13% in the current Select PDF). The structured record follows the explicit 24-month expiry, preserves lounge threshold timing ambiguity, and flags travel bonus rates as unresolved. Product page states annual income INR12 lakh or more. Cash advance has a flat INR199 + GST fee not expressible in the current fee schema.


## FIRST SWYP (reviewed 2026-10-26)

Reviewed current [FIRST SWYP product page](https://www.idfcfirst.bank.in/credit-card/swyp-emi-credit-card), [8-Dec-2023 launch release](https://www.idfcfirstbank.com/content/dam/idfcfirstbank/pdf/news-media/press-release/FIRST-SWYP-PR-0412.pdf), current [card communication with June/July 2026 updates](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/FIRST-SWYP-Credit-Card-Communication-May-26.pdf), [SWYP privileges terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/Swyp-privileges-document.pdf), current [MITC](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf), and [travel bonus terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/SWYP-CC-Rewards-Structure-TnC.pdf). All five PDFs are archived under `swyp/`.

Corrected the card's launch date to 8-Dec-2023, network to Mastercard (tier unpublished), removed the fabricated 0.99% revolving rate and generic 3X/10X reward model, corrected cash advance to flat INR199 + GST, and updated forex to zero effective 17-Sep-2026. The card is pay-in-full or EMI-conversion; conversion fees vary. Current rewards are non-incremental monthly spend milestones (200 to 4,000 points) plus education/FASTag/rail special milestones (400 at INR20,000 and 800 total at INR40,000 from July 2026 statement cycles). Recorded point value INR0.25 and no expiry. Refreshed joining/annual offers, movie, fuel waiver, railway lounge, referral, roadside and insurance benefits.

Unresolved/model limits: flat cash-advance fee, referral-based fee waiver and variable EMI conversion fees do not fit existing fee fields; exact criteria are in notes. The issuer does not publish SWYP-specific age, income or score cutoffs on its current product page. Mastercard tier is not stated. The general SWYP page's benefit summary is less detailed than the current communication/privileges terms; these dated card terms guide rewards and special-category milestones.

## FIRST WOW! Black (reviewed 2026-10-26)

Reviewed the current [issuer product page](https://www.idfcfirst.bank.in/credit-card/wow-black-credit-card), [8-Dec-2025 launch announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/FIRST-WOW-Black-8th-Dec-press-release.pdf), current [privileges terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/WOW-Black-Privileges.pdf), and current [customer MITC](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/MITC-Document-Customer.pdf). Archived the PDFs locally under wow-black/.

Corrected the saved network from Visa Signature to Mastercard (tier unpublished), launch date to 8-Dec-2025, zero forex, cardholder-specific APR range, INR199 flat cash advance fee, reward value (INR0.25 generally / INR0.50 for travel), earn categories and exclusions, and points cap/expiry. Corrected lounge access from four visits per quarter to one domestic visit per calendar quarter after INR20,000 spend, plus current welcome offers, fuel waiver cap, movie offer and eligibility (age 18-80, citizen/resident with singly held FD of at least INR20,000). The linked virtual RuPay card shares the limit and reward pool.

Unresolved: app travel bonus headline wording conflicts with specific examples; lounge FAQ has inconsistent prior/current month wording; flat cash-advance fee is preserved in notes because schema cannot encode it; welcome package value is partner-dependent. Details and official source copies are in wow-black.yaml, the source manifest and the continuation checklist.

## FIRST Wealth Credit Card (reviewed 2026-10-26)

Reviewed the current [FIRST Wealth product page](https://www.idfcfirst.bank.in/credit-card/wealth), January 2026 reward/lounges update, May 2026 card communication, [travel reward T&Cs](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Wealth-CC-Rewards-Structure-TnC-28-05-25-copy.pdf), [card privileges](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/credit-card/FIRST-Wealth-Privileges.pdf), and current customer MITC. Archived four current card PDFs under wealth/.

Corrected Visa tier from Signature to Infinite; removed unsupported launch day; updated APR/cash advance/zero-forex; changed reward base to 3 points per INR200 and current eligible categories; updated lounge quantities/gates, movie offer, golf/railway benefits, fuel waiver, insurance and income eligibility. Effective 26-Oct-2026, issuer page footnote says international purchases stop earning points even though other page text still claims 10X. The issuer also conflicts on railway lounge quota (four annually versus up to four quarterly) and travel bonus math; these are documented as unresolved rather than converted into asserted earn rates. See the card YAML and source manifest.


## FIRST WOW! (reviewed 2026-10-27)

Reviewed the [current product page](https://www.idfcfirst.bank.in/credit-card/wow), current customer MITC, May-2026 card communication and earlier WOW update; archived these sources under `wow/`. Corrected Visa Infinite platform, unsupported launch date, current flat ATM fee and variable APR, 1X/4X points on INR200 base, redemption value/fee and 24-month expiry, fuel waiver, roadside assistance and FD eligibility. Removed standard-card lounge/welcome claims that belong to WOW Black. Older personal-accident/lost-card claims are not reaffirmed by the latest notice and remain excluded pending current verification.


## Ashva (reviewed 2026-10-27)

The current Ashva record and field decisions are documented in [the issuer comparison](ashva/issuer-extract-2026-10-27.md). Thirteen card-specific/linked PDFs and two dated HTML captures are indexed in `_manifest.json`. The 2024 launch release confirms Visa Infinite and launch on 19-Sep-2024. The current earn model is 5 points/INR150 up to INR20,000 eligible statement-cycle spend and 10 points/INR150 on incremental eligible spend above; special categories and the 26-Oct international rate are recorded separately. The 17-Sep-2026 bank-wide zero-forex policy conflicts with the Ashva FAQ's 1% overseas ATM markup, which remains explicitly unresolved. Other unresolved points include app travel-booking bonus rates, international threshold counting, and the shared golf rounds-or-lessons pool.


## FIRST Classic (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](classic/issuer-extract-2026-10-27.md). Current and historical reward rates were checked against the January and May 2026 notices and current page. IDFC?s 13-Sep-2026 revised international-rewards notice supersedes its 1-Sep proposal to end rewards; the Classic product page retains a conflicting stale footnote. Removed the unsupported Classic travel-insurance claim based on the card-linked privileges table. Manifest lists eight issuer PDFs and two dated page captures.

## Diamond Reserve (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](diamond-reserve/issuer-extract-2026-10-27.md). The 6-Jan launch release, current product page, June privileges, May communication, current MITC, Aug-2026 insurer schedule and revised international-rewards notice are archived and listed in the manifest. Corrected the fee effective date, eligibility notes and INR50,000 credit-shield cover. Kept the international-reward and app-travel-bonus conflicts explicit. The product page advertises INR25,000 CFAR, but the linked policy ended 7-May-2026 and no replacement period was found, so active CFAR remains unresolved.

## FIRST Private (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](first-private/issuer-extract-2026-10-27.md). The current 17-Jul-2026 consolidated terms, fee policy and card page support new-issue cohort fees/rewards, travel and lifestyle terms, and current CFAR through 7-May-2027. The one-page CFAR document linked from the product page is stale and ends 7-May-2025. The card page's INR50,000 lost-card cover conflicts with the separate insurance overview's INR5 lakh figure; both are documented in the record and comparison.

## Gaj (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](gaj/issuer-extract-2026-10-27.md). Archived sources confirm the current reward rates and caps, spend-gated lounge access, trip-cancellation sublimits, insurance amounts, annual fee benefit and lifestyle terms. Corrected the golf schema values to unknown separate round/lesson counts because the two monthly visits form a shared pool. Added credit shield and annual-fee payment points, removed the unsupported resident-only claim, and documented possible merchant DCC alongside zero issuer forex.

## Hello Cashback (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](hello-cashback/issuer-extract-2026-10-27.md). Archived the current page capture, feature terms, product guide, current MITC and zero-forex notice. Confirmed cashback tiers/caps, annual fee reversal, benefits and FD-backed eligibility; corrected the unsupported RuPay tier and single-held FD wording. The live FAQ conflicts on whether the joining-fee offer ends 30 or 31 Oct 2026; card-specific revolving APR and launch date remain unpublished.

## IndiGo IDFC FIRST Dual (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](indigo/issuer-extract-2026-10-27.md). Archived the launch release, current product page and October offer page, May-2026 communication, product guide, privileges, current MITC and zero-forex notice. Corrected checked-baggage delay and trip-cancellation insurance classifications, followed the current detailed FAQ for 12 golf rounds while documenting the linked guide/page-graphic conflict (4 rounds), and added the one-time EazyDiner/Postcard benefits. Current issuer conflicts remain for the FD minimum, stale 1.49% forex paragraph and trip-cancellation policy dates.


## Mayura (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](mayura/issuer-extract-2026-10-27.md). Archived the current page, May-2026 update, 2025 reward terms, 2024 launch release and zero-forex notice. Corrected network to Mastercard World, launch date and duplicate benefits; cleared the unsupported Visa Infinite and resident-only claims. Travel bonus and trip-cancellation period conflicts remain explicit.


## FIRST Millennia (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](millennia/issuer-extract-2026-10-27.md). Checked the current product page, May-2026 communication, privileges, product guide, MITC, zero-forex policy and issuer eligibility pages. Retained Visa with tier unknown, applied the 26-Oct international-points cutoff, cleared minimum age due to issuer conflict (18 vs 21), and documented residency-source conflict.


## FIRST Power+ (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](power-plus/issuer-extract-2026-10-27.md). Archived the current product page, May-2026 communication, reward schedule, travel booking terms, privileges, welcome offer terms, MITC and zero-forex notice. Preserved fuel-waiver and 30/60-day welcome-window conflicts; travel-bonus representation limits are documented.


## FIRST Power (reviewed 2026-10-27)

Field decisions are recorded in [the issuer comparison](power/issuer-extract-2026-10-27.md). Archived the current fuel-card page, May-2026 communication, reward schedule, privileges, travel terms, welcome terms, MITC and zero-forex notice. Added partner-dependent merchant offers without assigning cash value; documented the welcome window, fuel waiver and employment-age conflicts.
