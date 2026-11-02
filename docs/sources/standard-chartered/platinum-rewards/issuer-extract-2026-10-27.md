# Standard Chartered Platinum Rewards — issuer evidence comparison (2026-10-27)

## Sources archived

- Current card page: <https://www.sc.bank.in/credit-cards/platinum-rewards/> — archived as `product-page-retrieved-2026-10-27.html`.
- Card-specific Platinum Rewards terms: <https://www.sc.bank.in/content/dam/sc/in/credit-cards/docs/in-sc-platinum-rewards-credit-card-tcs.pdf> — archived as `product-terms-retrieved-2026-10-27.pdf` (one scanned page, manually reviewed from rendered page image).
- Product Most Important Document: <https://www.sc.bank.in/content/dam/sc/in/credit-cards/docs/in-common-plat-reward-midc.pdf> — archived as `most-important-document-retrieved-2026-10-27.pdf`.
- Current tariff: <https://www.sc.bank.in/credit-cards/tariffs-and-charges/> — archived as `tariffs-and-charges-retrieved-2026-10-27.html`.

## Field comparison and disposition

| Field | Prior record | Current issuer evidence | Disposition |
|---|---|---|---|
| Network / tier | Visa / Platinum | Card page says Visa network; does not identify an issuer network tier | Keep Visa; clear tier |
| Launch date | 2018-01-01 | No issuer launch date found | Clear date |
| Joining / renewal fee | INR250 / INR250; annual waiver at INR6,000 | Current tariff lists INR250 in year 1 and INR250 thereafter. Product page and PRCXC MID separately show an electronic application offer with zero first-year and renewal fees, conditional on a transaction of at least INR500 within 30 days; otherwise one-time INR250 + GST. Offer excludes existing SC cardholders and offers no joining benefit. | Keep tariff fee baseline; explain digital offer and condition in fee notes. No annual spend waiver is published. |
| Supplementary fee | Not modeled | Product page/MID say nil joining and renewal fee | Mention in notes only |
| Finance / forex / cash advance | 3.75% monthly / 3.5% / 2.5%, minimum INR500 | Current tariff: 3.75% monthly, 3.5% overseas transaction fee, 3% cash advance with minimum INR300 | Correct cash advance fee |
| Base rewards | 1 point per INR150; catalogue INR0.25; realized INR0.22 | Card terms: 1 point per INR150 on all other spend; 1 point = INR0.25 for catalogue redemption | Keep rate and catalogue value; clear unsupported realized-value estimate |
| Accelerated rewards | 5 per INR150 dining/fuel, uncapped monthly | Card terms say Hotels, Restaurants and Fuel. Current product page says fine dining and fuel, 5 per INR150, “no monthly cap.” Card terms also state primary and supplementary holders have separate card-level maximums without giving a number. | Model dining/fuel; note hotel wording and cap conflict. Do not mark cap path as source-verified. |
| Reward exclusions | Wallet loads, rent, insurance, EMI; MCC 6513 | Terms exclude returned, disputed, unauthorized/fraudulent, non-cardholder initiated, charged-back transactions, finance/other charges/fees, and cash advances | Remove unsupported old category/MCC exclusions; schema captures cash-advance only; document remaining exclusions in notes |
| Welcome | None | Card terms: 100% cashback up to INR500 on restaurant transactions within 90 days of card setup, only for clients who paid joining fee; supplementary cards excluded. Digital MID says no joining benefit for electronic-offer applicants. | Add conditional welcome benefit; schema lacks per-benefit source fields, so source is listed in this comparison. |
| Fuel surcharge waiver | 1%, INR500–4,000 transaction, no cap | No card-specific fuel surcharge reversal in current product page or terms; fuel earns accelerated points | Remove unsupported waiver |
| Lounge | None | No lounge access identified in reviewed current card evidence | Keep null |
| Eligibility | Unknown ages / income | Product page: age 21–65, stable monthly income, sourcing-location condition, subject to bank checks. PRCXC MID: GMI INR20,000; it does not split annual income by occupation. | Add published age values; keep annual occupation-specific income and credit score unknown; note GMI in text. |

## Limits and unresolved details

- The tariff page’s standard INR250/INR250 fees coexist with an electronically submitted application offer in the product page and MID. The dataset stores standard fees and describes the conditional offer in notes; it cannot encode channel-specific fee variants.
- The current product page says no monthly cap, while card-specific terms say card-level maximums exist without publishing a number. Do not interpret either as a fully quantified overall cap.
- The T&C uses Hotels, Restaurants and Fuel; the current product page uses fine dining and fuel. Merchant eligibility depends on Visa MCC coding.
- The schema does not support a Hotels canonical reward bucket or detailed exclusions for fees, fraud/disputes, returns and chargebacks. These are stated in notes.
- Product-specific terms were issued as a scanned single-page PDF and manually read from its rendered page; the archived source remains available for review.

## Data and validation

Updated record: `data/cards/standard-chartered/platinum-rewards.yaml`. The record sets `metadata.last_verified_on` to 2026-10-27 and links the archived issuer evidence from the relevant source entries.
