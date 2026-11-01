# RBL Bank — source verification (2026-07-04)

RBL publishes a rich PDF set on `webassets.rbl.bank.in`, incl. the central
**`CardsScheduleCharges.pdf`** (annual fees + forex markup for ALL RBL cards) and
`RBL-MITC-final.pdf`, plus per-card `terms-<card>-card.pdf` + milestone guides.
Read via pypdf.

## Corrections from the Schedule of Charges PDF
| Card | Field | Was | Source |
| --- | --- | --- | --- |
| Insignia | annual fee | ₹10,000 | **₹7,000** (waived on ₹10L; NIL for Insignia Preferred Banking) |
| Icon | forex markup | 2.0% | **3.5%** (only Insignia/iGlobe/World Xclusive get 1.5%, Nova 2%, World Safari 0%) |
| Platinum Maxima Plus | annual fee | ₹2,000 | **₹2,500** |
| IRCTC | annual fee | ₹350 | **₹500** |

Confirmed correct: World Safari ₹3,000 + 0% forex, Shoprite ₹500 (waived ₹1.5L),
Play ₹500, Cookies ₹500, Platinum Maxima ₹2,000.

## Zomato Edition Classic (2026-10-26)
Archived RBL launch announcement, Edition Classic T&Cs, benefit change notice effective 20-Sep-2022, partnership termination/replacement notice and generic Aug-2026 MITC. The partnership notice confirms replacement with Shoprite effective 15-May-2023; see `zomato-edition/` and the card-specific confidence audit. Exact historical fees and some eligibility terms were not available in the surviving card-specific issuer material and are left unknown.


## RBL Bank Cookies Credit Card (reviewed 2026-10-26)

Reviewed the current [Cookies card page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/cookies-credit-card), current Cookies [product T&Cs](https://webassets.rbl.bank.in/document/credit-cards/terms-conditions-cookies.pdf), RBL [Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf), consolidated [MITC](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf), and [network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide). Archived the card terms, schedule, MITC and common application form under `cookies/`; the PDFs have valid `%PDF-` signatures.

Corrected current fee model: Cookies charges INR100 + GST monthly, waived for subsequent month on INR5,000 eligible settled monthly spend; the previous INR500 annual fee applied to legacy Cookies cards issued before 10-May-2021. Updated monthly finance rate representation to the current MITC maximum 3.99% p.m. (actual rate varies by bureau category), up-to-3.5% forex, 2.5% cash advance/minimum INR500, and redemption fee. Corrected rewards to 1 point/INR100 offline and 5 points/INR100 eligible online; issuer now states redemption up to INR0.20/point. Added welcome voucher, annual INR2L/INR5L milestone vouchers, capped Myntra/Uber/Zomato cashback, monthly BookMyShow discount and INR500-INR4,000 fuel surcharge reversal capped INR150/month. Cleared Mastercard Platinum and 2024-01-01 launch date; RBL shows Visa and Mastercard variants. Card-specific age, income, residency and bureau cutoffs were not established; no lounge/concierge entitlement found. The schema has no monthly-fee field, so its annual fee fields are null and the current monthly price is preserved in source-backed fee notes rather than miscast as an annual fee.


## RBL Platinum Maxima Plus (reviewed 2026-10-26)

Reviewed the current [card page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/platinum-maxima-plus-credit-card), [card-specific T&Cs](https://webassets.rbl.bank.in/document/credit-cards/terms-conditions-platinum-maxima-plus.pdf), [Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf), consolidated [MITC](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf), and [network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide); archived three PDFs under `platinum-maxima-plus/` and checked their PDF signatures.

Corrected scalar network to Visa and removed unsupported Visa/Mastercard Platinum assignment and 2023-01-01 launch date. Fees remain INR2,500 first-year and annual, plus GST; corrected reward record to 2 points/INR100 base and 10 total points/INR100 in dining, entertainment, grocery and international categories (up to 1,000 bonus-category points per billing cycle). Corrected milestone ladder (10,000 additional points each at INR2L, INR3.5L and INR5L eligible membership-year spend), 10,000-point welcome with issuance/fee conditions, domestic lounge threshold (INR35,000 prior calendar-quarter spend for 2 visits next quarter), and monthly BookMyShow free ticket up to INR200 on purchase of 2+ tickets. Removed unsupported fuel waiver. Current product page example values 67,600 points at INR16,900 (INR0.25 each); actual reward redemption value may depend on portal choice and INR99 + GST redemption fee applies. No card-specific age, income, residency, bureau-score or launch date evidence found. Issuer page prints MCC 711 for contracted services; this is not a valid four-digit MCC, so omitted from structured MCC codes and recorded the anomaly.

## RBL Icon Credit Card (reviewed 2026-10-27)

Reviewed the [current Icon card page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/icon-credit-card), card-specific T&Cs dated 04-Aug-2026, current central MITC/KFS and Schedule of Charges, and current network availability guide. Archived the current documents under `icon/` and updated the issuer manifest.

Corrected fees, reward earn/caps/exclusions, welcome offer, INR3L/INR5L/INR8L milestone ladder, domestic lounge spend gate, chargeable international lounge access, BookMyShow, fuel waiver and Mastercard-only golf benefit. Cleared unsupported launch date, single Mastercard/World network claim and fixed point value. Both Visa and Mastercard variants are currently listed; card-specific age, income, bureau and residency thresholds were not found. The schema cannot represent per-visit international lounge charges without a quota, so the chargeable access detail is explicit in benefit notes.

Field comparison and unresolved representation issues: `icon/issuer-extract-2026-10-27.md`.

## RBL Insignia Preferred Banking Credit Card (reviewed 2026-10-27)

Reviewed the current product page, card T&Cs, generic Insignia KFS, current MITC, Schedule of Charges, network guide, current Rewards terms, Miles Transfer terms and milestone guide. Current sources and field comparison are archived in `insignia/`.

Corrected dual network support, fee/waiver and nil-fee customer segment, 28,000-point welcome, domestic/international lounge quotas, INR8 lakh/INR8,000 milestone voucher, 5/10 points per INR100 domestic/international, current 3:1 airline/hotel partner transfers, no redemption fee/24-month expiry for Insignia, Mastercard-only golf, monthly INR500 BookMyShow and fuel reversal. Cleared unsupported launch date and fixed point value. Numeric applicant cutoffs and current issued network tier not found. Open schema and customer-segment caveats are in `insignia/issuer-extract-2026-10-27.md`.

## RBL IRCTC Credit Card (reviewed 2026-10-27)

Reviewed current product page, current IRCTC product terms and FAQ, central MITC, Schedule of Charges, network guide and railway lounge terms. Archived documents under `irctc/`; detailed field comparison: `irctc/issuer-extract-2026-10-27.md`.

Corrected dual Mastercard/RuPay network variants, fee/charges, reward rates/caps, INR1 IRCTC train redemption context, MCC exclusions, quarterly INR75,000/500-point milestone, age eligibility, welcome offer, railway lounge, train cancellation protection and IRCTC transaction-fee reversal. Removed unsupported fuel waiver and stale earning assumptions. Logged threshold wording difference (FAQ says INR500 or more; product page/T&C says above INR500) and product PDF's RuPay title despite both network variants listed.

## RBL Bank Play Credit Card (reviewed 2026-10-27)

Reviewed current Play product page, card-specific T&Cs, BMS offer guide, current charges schedule/MITC, RBL network guide and RuPay/NCMC FAQ. Archived the product capture and terms under `play/`; field comparison at `play/issuer-extract-2026-10-27.md`.

Removed unsupported reward points/statement-credit earn, stale lounge quota and unsupported 2021 launch/network tier. Current sources publish a BookMyShow welcome discount, spend-gated monthly BMS booking discount, monthly F&B discount, fuel surcharge reversal, and annual fee waiver. Current page/network guide list Mastercard and Visa; linked T&Cs include RuPay-only features. The RuPay mismatch is documented, and no scalar network is retained. Schema forces a rewards record; its earn fields are null with a note that no reward-point program was found.

## RBL ShopRite Credit Card (reviewed 2026-10-27)

Reviewed current product page, ShopRite card-specific T&Cs, current MITC and Schedule of Charges, network guide and Rewards terms. Archived issuer materials under shoprite/; claim-level comparison and unresolved timing/network conflicts are documented in shoprite/issuer-extract-2026-10-27.md.

Corrected the unsupported launch date/network tier, current fees and waiver, rewards and grocery cap, redemption value/exclusions, welcome points, BookMyShow discount and fuel waiver. The product page and T&Cs conflict on point-posting timing and monthly cap cycle. Product page and network guide conflict on RuPay availability; numeric eligibility and lounge entitlement were not found.



## RBL World Safari (reviewed 2026-10-27)

Compared the current [product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/world-safari-credit-card), [card-specific terms](https://webassets.rbl.bank.in/document/pdfs/terms-world-safari-card.pdf), network guide, MITC and Schedule of Charges. Archived the current page/network HTML and current card terms under `world-safari/`; preserved the existing historical PDF. Corrected dual Visa/Mastercard variants, fee/waiver snapshot, point values and exclusions, welcome conditions, milestone ladder, domestic/international lounge quotas, fuel waiver, insurance claims, concierge and golf details. The product page says no international points while ?3.4(c) of card terms grants 5 points/INR100 on international travel spend; details and other unknowns: `world-safari/issuer-extract-2026-10-27.md`.
