# YES Bank — source verification (2026-07-04)

YES links a central MITC + T&C + per-card PDFs via `yes.bank.in/pdf?name=...` (session-gated; not directly curl-able). Fees/rewards are also rendered in-page (textContent-readable).

## Verified
- **Marquee**: page states Membership Fee **INR 9,999** + renewal INR 4,999 -- matches YAML.

All 28 YES cards were verified against the live pages during the thorough audit (PR #46), which applied real corrections (Reserv 24/12/6 model + fee 2499 + rename, SELECT/ACE renames, Prosperity cashback family, AI-Inside/Wellness/PaisaSave/BYOC + fintech co-brands). Reward/fee figures are page-sourced; exact caps on the cashback cards remain in the MITC.


## YES Bank EMI Credit Card (reviewed 2026-10-26)

Reviewed the current [EMI card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/emi-credit-card), issuer card listing, card-specific EMI T&Cs and current [MITC v18 (05-Oct-2026)](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false). The MITC is archived and signature-checked under `emi/`. The card page is JavaScript-rendered; the card-specific T&C PDF download returned a JavaScript/404 shell, so its indexed issuer text and capture limitation are recorded in `emi/emi-rendered-extract.md`.

Corrected the record's false lifetime-free fees to INR 499 joining / INR 499 renewal, waived after INR 120,000 spend in the preceding year. Current MITC v18 confirms 3.99% monthly finance, 3.5% forex, 2.5%/INR 650-min cash advance, and fuel waiver of 1% on INR 500-3,000 transactions capped at INR 250 per statement cycle. Card-specific EMI terms describe 18% p.a. auto-conversion, 1% processing fee, and amount-based tenures; card-specific current effective date for the membership fees was not published. Cashback is 1% on non-EMI transactions, capped at INR 500 per calendar month; removed unsupported detailed reward exclusions/MCC 6513. Cleared unsupported Mastercard/Platinum, exact launch date and default resident-indian eligibility. See the YAML and rendered extract for remaining unknowns.


## YES Bank Essence Credit Card (reviewed 2026-10-26)

Reviewed the current rendered [Essence product page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/essence-credit-card), card-specific MITC V17, May-2026 value chart and consolidated MITC v18 dated 2026-10-05. Archived and signature-checked all three PDFs. Corrected standard joining/renewal fees and spend waivers, forex markup, cash-advance minimum, points schedule/cap/exclusions, redemption terms, domestic lounge threshold, fuel waiver and published age/salary eligibility. Removed unsupported Mastercard World assignment, launch date and resident-Indian default. The limited-period LTF offer is retained in notes alongside the standard fee schedule. Annual milestone window, purchase-protection limits and regular-card versus virtual RuPay eligibility wording remain unresolved; details and JavaScript-rendered page limitation are recorded in `essence/essence-rendered-extract.md`.


## YES Bank ACE (reviewed 2026-10-26)

Reviewed the current [ACE card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/ace-credit-card) via rendered browser text, current [MITC v18 (2026-10-05)](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), and the issuer's June 2026 credit-card feature update. The source PDFs are archived under `docs/sources/yes/ace/`. The page downloads as a JavaScript shell, so `ace/ace-page-rendered-extract.md` records the relevant rendered text and capture limitation.

The current record uses the issuer's 8/4/2 points per INR200 schedule, 5,000-point statement cap and 150-point utility MCC 4900 cap; revised 2026-06-15 reward exclusions and fuel waiver band/cap; INR499 fee/waiver terms; current forex, finance and cash-advance amounts; point value/redemption/expiry terms; and published age/income eligibility. Unsupported network/tier and launch date were cleared. Purchase protection remains descriptive because the current numeric cover conditions were not established. See `data/cards/yes/ace.yaml` for field-level provenance and explicit unknowns.


## Paisabazaar PaisaSave RuPay (reviewed 2026-10-26)

Sources: [current RuPay product page and reward terms](https://pri1.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/paisabazaar-rupay-credit-card), [standard PaisaSave eligibility page](https://pri1.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/paisabazaar-credit-card), [YES Bank credit-card MITC (version 18, 05-Oct-2026)](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), and official card listing. The current general MITC PDF downloaded and passed PDF signature validation in `paisabazaar-rupay/yesbank-mitc-2026-10-05.pdf`; `current-mitc.txt` is a local text extraction. The card page is crawlable through YES Bank's indexed `pri1` official subdomain.

### Corrections

- Cleared unsupported 2023-01-01 launch date and RuPay Platinum tier; card's launch date and network tier are not stated in current primary evidence. The RuPay card is virtual-only, with no physical plastic. The issuer limits eligibility to existing YES Bank PaisaSave cardholders.
- RuPay variant fees are joining INR0 and renewal INR0; do not confuse it with the standard PaisaSave Visa variant's INR499 fee. Finance is 3.99% monthly. Updated foreign-currency markup from 3.5% to 3.4% under MITC effective 15-Jun-2026. Cash advance limit is NIL for the virtual RuPay variant; removed the previously entered 2.5%/INR300 cash-advance fee.
- Current reward terms from 15-Dec-2025: 6% on the issuer's allowlisted 24 Dining & Travel MCCs for non-UPI transactions, 1% on other eligible spend; UPI Dining/Travel does not earn the 6% rate. UPI above INR2,000 earns 1% across non-excluded categories, and UPI below INR2,000 earns no cashback. 1 Reward Point = INR1; redeem for statement credit via YES Rewardz without a redemption fee.
- Corrected 6% accelerator cap to 3,000 Reward Points per statement cycle (then base points continue), expanded MCC exclusions to the full published issuer list, and documented older rates through 14-Dec-2025. The card-specific terms do not establish reward expiry; no expiry was assumed.
- Updated fuel waiver to 1%, INR500?INR3,000 transaction range, INR125 per statement cap. The general MITC says UPI fuel transactions do not receive a waiver, then specifically caps YES Bank RuPay virtual UPI waivers at INR125; this internal wording ambiguity is retained in YAML notes.
- Eligibility from the standard PaisaSave page: age 21?60; salaried net salary INR25,000/month or self-employed ITR at least INR750,000/year. RuPay variant is available only to existing PaisaSave cardholders. No score threshold published.


## YES Bank AI Inside RuPay (reviewed 2026-10-26)

Reviewed the rendered current [issuer card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/ai-inside-rupay-credit-card) and current MITC v18 dated 2026-10-05. The issuer page advertises up to 3% cashback but does not publish the earning schedule or cap; the prior 1% universal base-rate assertion was removed. The record now leaves the general cashback rate unknown, records only issuer-supported exclusions, corrects the fuel cap to INR125 per statement and clears unsupported Platinum tier/exact launch date. Lifetime-free fees, 3.99% monthly finance and zero forex are retained. Cash-advance fee is null because the current MITC says the charge does not apply to virtual cards; facility availability is not established. Full rendered statements and UPI fuel-waiver ambiguity are documented in `ai-inside-rupay/ai-inside-rupay-rendered-extract.md`.


## YES Bank AI Inside (reviewed 2026-10-26)

Reviewed the current [AI Inside card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/ai-inside-credit-card) through rendered browser text and YES Bank MITC v18 dated 2026-10-05. As with the RuPay variant, the current page advertises ?up to 3%? but not the earn schedule or caps; removed the unsupported generic 1% base, unsupported Mastercard/Platinum assignment and exact launch date. Retained current zero membership fees/forex markup and 3.99% monthly finance. The current MITC states AI Inside cash-advance fee is waived and fuel waiver is 1% at INR400?5,000, capped at INR750 per statement. See `ai-inside/ai-inside-rendered-extract.md`.


## YES Bank Anq Phi (reviewed 2026-10-26)

Reviewed the current [Anq Phi card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/anq-phi-credit-card), official Anq Phi product guide (issuer-indexed PDF), current [MITC v18 dated 05-Oct-2026](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), and [June-2026 fees/features update](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT8966189EF8734F58919CDA61BAFF0D96/native/communication_group_1_final_sms.pdf?download=false). The product guide's direct download returned a 5,640-byte JavaScript shell, not PDF bytes; its indexed issuer text is transcribed in `anq-phi/anq-phi-rendered-extract.md`. MITC v18 and the June update are archived and signature-checked.

Corrections include NIL joining / INR499 annual fee with INR120,000 renewal waiver, 3.5% forex (the dated June notice is followed because the consolidated table presents an ambiguous 3.4%/3.5% row), 3.99% monthly finance, 2.5%/INR650-min cash advance, 4 base points and 24 accelerated points per INR200 in product-guide categories, 3 international lounge visits/year, and revised INR500-3,000 fuel-waiver band with INR300 statement cap. Unsupported Mastercard/World network assignment, exact launch date and derived eligibility thresholds were cleared. Redemption point realization varies by channel; no realized-value scalar is asserted.
## YES Bank FinBooster Credit Card (reviewed 2026-10-26)

Reviewed the current YES Bank credit-card listing, the June-2026 issuer feature/charge update and current MITC v18 dated 2026-10-05. Corrected the reward schedule to 10 points/INR200 on online dining, 6 on online grocery/apparel, and 2 on other eligible retail (except fuel). Current issuer page lists NIL joining/renewal fees and a free Credit Strong subscription. Updated forex to 3.5%, finance to 3.99% monthly, cash advance to 2.5%/INR650 minimum, and fuel waiver to INR500-3,000 with INR100 statement cap. Added issuer-published MCC exclusions and redemption/expiry terms. Removed unsupported Mastercard/Platinum and exact launch date; eligibility thresholds, reward-cap status, Credit Strong terms and network remain unresolved. The detail page is JavaScript-rendered; see `finbooster/finbooster-rendered-extract.md` and the local archived PDFs.


## YES Bank YES First Preferred Credit Card (reviewed 2026-10-26)

Reviewed the current rendered issuer product page, YES Bank MITC v18 (05-Oct-2026), the June-2026 charges/features update and the official indexed value chart. New issuance to new customers has been discontinued; existing holders may receive a replacement at expiry. Corrected INR999 joining/renewal fees and INR50,000/INR250,000 spend waivers, 2% foreign-currency markup, 3.99% monthly standard APR, cash-advance charges, 8/4-point reward schedule, current select MCCs/exclusions, lounge access, golf, BookMyShow and fuel waiver. Cleared unsupported Mastercard/World, launch date, realized point value, default residency and numeric eligibility claims. Current versus legacy point-expiry and current versus older movie-cap evidence are documented. The issuer product page is JavaScript-rendered; visible terms are preserved in `first-preferred/first-preferred-rendered-extract.md`, with the two verified PDFs archived in that directory.


## YES Bank FREO Credit Card (reviewed 2026-10-26)

Reviewed the current rendered issuer page and current MITC v18. The issuer says it is no longer accepting applications and asks existing holders to contact the bank for an upgrade; the record is now `on-hold`. Corrected fees to zero joining / INR399 annual with INR10,000 first-month and INR100,000 renewal waivers, current 3.4% forex markup, 3.99% monthly finance, 2.5%/INR650-min cash advance, unlimited 1% cashback restrictions and current INR400-5,000 / INR125 statement fuel waiver. Added issuer-published age and income eligibility; cleared unsupported network/tier and launch date. The card-specific PDF link returned a JavaScript shell; current page terms and limitations are documented in `freo/freo-rendered-extract.md` and a verified generic MITC v18 is archived in that folder.


## YES Bank Klick (reviewed 2026-10-26)

Reviewed the current [Klick RuPay page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/klick-credit-card), linked [Klick user guide](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTD761E1D607794FB484485C383950BC34/native/ybl_yes_bank_user_guide_klick_rupay_credit_card.pdf?download=false), current [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false) and current issuer card listing. Corrected Mastercard/Platinum to virtual RuPay, cleared unsupported launch date, and removed the cash-advance fee because the MITC says the charge is not applicable to any virtual credit card (cash-advance availability itself remains unknown). Updated 3.5% forex, 3.99% monthly finance, lifetime-free fees, 2 points/INR200 non-UPI reward, published exclusions and 1% fuel waiver on INR500-3,000 transactions capped at INR250 per statement. The issuer guide states existing YES cardholders cannot apply. A separately indexed guide suggests UPI earn, conflicting with the current linked guide/page; the record does not assert a UPI earn rate. Exact launch date, network tier and age/income/bureau/residency cutoffs remain unknown. Full extract and archived PDFs are under `klick/`.


## YES Bank POP-CLUB (reviewed 2026-10-26)

Reviewed the current [POP-CLUB page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/pop-club-credit-card), current [YES Bank MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), and [POP's current POPcoin site](https://mypop.in/). Updated the record to RuPay with unknown tier/launch date; corrected standard membership fees, annual spend waiver, cash-advance minimum, 10/2 POPcoin rates, INR100 minimum qualifying transaction, full issuer exclusions, one-year coin expiry, published age/income and existing-YES-cardholder eligibility, and the fuel band/cap. A material conflict remains: the current card page states INR100 fuel cap from 01-Jun-2026 while MITC v18's cap table states INR300. The card-specific page value is followed and the conflict is preserved. The card FAQ's 365-day expiry also conflicts with the general MITC v18 three-year point-expiry text; card-specific POPcoin expiry is followed. Current fuel UPI handling, reward posting details, realized point value, and joining-offer fulfillment terms remain unknown. Archived current MITC and rendered evidence are under `pop-club/`.


## YES Bank Prosperity Rewards (reviewed 2026-10-26)

Reviewed the current [Prosperity Rewards page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/yes-prosperity-rewards-credit-card), issuer credit-card listing, current consolidated [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), June-2026 issuer update, and indexed card-specific issuer terms. The current page says new issuance has stopped, existing holders will be reissued at expiry. Cleared unsupported exact launch date and Mastercard/Platinum assignment; refreshed fee/waiver, forex/APR/cash advance, current reward schedule/select MCCs/exclusions, redemption/expiry, fuel waiver and unknown eligibility fields. The current product page advertises purchase protection, but the 2024 issuer purchase-protection FAQ's eligible-card list omits YES Prosperity Rewards; applicability and policy terms remain uncertain and are recorded. Older indexed Prosperity-specific MITC lists INR500 cash-advance minimum versus current generic MITC v18 INR650; current v18 is represented. Card-specific MITC, purchase FAQ and value-chart downloads returned 404/JavaScript shells and are not archived as PDFs. See `prosperity-rewards/` for the rendered extract and archived common MITC.


## YES Bank RESERV (reviewed 2026-10-26)

Reviewed current issuer listing, indexed Reserv product terms, current [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false), and official Nov-2023 Reserv value chart. Corrected APR, cash-advance minimum, forex, reward cap/exclusions/redemption, lounge spend gate, and fuel waiver; cleared unsupported Mastercard/World and exact launch date. The detail page is JavaScript-rendered; capture limitations and remaining unknowns are in `reserv/reserv-rendered-extract.md`. Archived MITC v18 is signature-checked. The current value-chart PDF URL returned a session shell and is not archived as a PDF.


## YES Bank SELECT (reviewed 2026-10-26)

Reviewed current [SELECT product page](https://pri1.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/select-credit-card), issuer listing and [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false). Corrected fees, APR/cash advance, reward caps/exclusions, utility cap, current lounge gate, fuel waiver and published eligibility. Cleared unsupported network/tier/date/residency assumptions. Product page FX headline conflicts with the v18 markup/DCC table; detail and extraction limitations are recorded in `select/select-rendered-extract.md`.


## YES Bank Wellness (reviewed 2026-10-26)

Reviewed current issuer listing, official Wellness usage guide and [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false). Updated common charges, pharmacy earning, health benefits and fuel waiver; removed unsupported network/tier/date/eligibility claims. Current MITC's ?125 fuel cap supersedes the older Wellness guide's ?250 statement. Current product text and capture limits are summarized in `wellness/wellness-rendered-extract.md`.


## YES Bank Wellness Plus (reviewed 2026-10-26)

Reviewed current issuer listing, official Wellness Plus usage guide/value chart and current [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false). Updated common fees, rewards, health benefits, lounges and current fuel waiver. Current v18's ?250 fuel cap supersedes the older guide's ?500. Guide download/capture limitations and unknown terms are recorded in `wellness-plus/wellness-plus-rendered-extract.md`.


## YES Bank Zagg (reviewed 2026-10-26)

Reviewed current [YES Bank Zagg card page](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/zagg-credit-card), Zagg/Rivpe [rewards policy](https://zagg.money/rewards-policy), [FAQ](https://zagg.money/faqs), network listing and current [MITC v18](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false). Corrected to RuPay and Zagg Coins instead of YES Rewardz. Current app-based coin terms, dynamic cap, lounges, fuel, common charges and eligibility are recorded in `zagg/zagg-rendered-extract.md`; card-specific MITC link redirects to a JavaScript shell.


## YES BANK BYOC (reviewed 2026-10-27)

Reviewed current issuer card listing, BYOC product page, current consolidated MITC v18, BYOC-specific indexed terms/value chart and domestic lounge schedule. Reworked the record around the BYOC Cashback module: corrected module/subscription fee model, cashback rates/caps, current lounge spend gate, fuel surcharge range/cap, cash-advance minimum and point-in-time finance/forex fees; cleared unsupported Platinum network tier/date, ET Prime and unsupported lounge processor. Network remains unknown because current issuer material does not identify the issued network variant. The product page and BYOC-specific terms are JavaScript/404 shells for direct retrieval; web-extracted evidence and limits are in `byoc/byoc-rendered-extract-2026-10-27.md`.

## YES BANK Marquee (reviewed 2026-10-27)

Compared current card listing, current MITC v18, issuer Schedule of Charges, Marquee value chart and domestic lounge schedule. Corrected renewal waiver, APR/cash advance, reward rates and caps, lounge visit quota and spend gate, guest eligibility conflict, fuel range/cap, welcome/renewal points and unsupported insurance/golf claims. Current sources do not establish network/tier, launch date, exact qualifying reward MCCs, golf quotas or applicant cutoffs; these remain unknown. Evidence comparison: `marquee/issuer-extract-2026-10-27.md`.

## YES Prosperity Cashback Plus (reviewed 2026-10-27)

Reviewed current issuer product page and consolidated MITC v18, with issuer legacy card terms for welcome offer detail and the official cashback revision notice. Marked on-hold because new issuance is discontinued; corrected current fee, APR/cash advance, forex, reward rates/caps, welcome cashback and fuel waiver. Cleared unsupported network/tier/date/residency and application URL. Evidence, MCC lists and cashback rule interactions: `prosperity-cashback-plus/issuer-extract-2026-10-27.md`.

## YES Prosperity Cashback (reviewed 2026-10-27)

Compared current issuer catalogue, MITC v18, Cashback/Cashback Plus utility-revision notice and the legacy standard Cashback issuer template (indexed text; direct page fetch returned 503). Corrected common charges, fuel waiver and welcome spend window; removed unsupported network/tier/date/residency/application assumptions and unverified lounge/concierge claims. Reward rates are retained from issuer legacy text at medium confidence; current variant-specific category caps, AutoPay details and full exclusions remain unresolved. See `prosperity-cashback/issuer-extract-2026-10-27.md`.


## YES Bank UNI RuPay (reviewed 2026-10-27)

Current listing confirms zero joining/renewal fees and the 1% Uni Coin cashback headline. The current MITC specifies the fuel waiver transaction ceiling and cycle cap. Card-specific coin denomination/redemption and detailed earn exclusions remain unpublished in accessed issuer evidence. Full comparison and direct source links are in `uni-rupay/issuer-extract-2026-10-27.md`.


## YES Private (reviewed 2026-10-27)

Current Private page, catalogue, KFS, MITC, Usage Guide and Purchase Protection FAQ compared. Current page values conflict with the older Usage Guide on rewards and welcome points; open issues are recorded in `private/issuer-extract-2026-10-27.md`.


## YES BANK UNI Credit Card (reviewed 2026-10-27)

Corrected the annual fee to INR499, corrected cash advance availability and fuel waiver. Issuer catalogue says 1% cashback in Uni Coins but does not establish this product variant's coin conversion/redemption; see `uni/issuer-extract-2026-10-27.md`.

PaisaSave standard-card current fee/forex, fuel-waiver and eligibility corrections (2026-11-01) are recorded at `paisabazaar/issuer-review-2026-11-01.md`; reward terms retain the substantive 2026-10-25 issuer check.
