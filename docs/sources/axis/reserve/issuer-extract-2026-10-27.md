# Axis Bank Reserve: issuer evidence reconciliation (27 Oct 2026)

Primary issuer sources reviewed:

- [Reserve product page](https://www.axis.bank.in/cards/credit-card/reserve-credit-card/beyond-expectations-always), retrieved 27 Oct 2026.
- [Reserve 20 Jun 2025 revision](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/tncs-reserve-13th-may.pdf?sfvrsn=ed6fda5e_1), archived as `reserve-revision-effective-2025-06-20.pdf`.
- [Reserve 28 Aug 2026 revision](https://campaign.axis.bank.in/generic/terms-and-conditions-reserve.pdf), archived as `reserve-revision-effective-2026-08-28.pdf`.
- [Current Axis credit-card Schedule of Charges/KFS](https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/sosc-credit-cards.pdf?sfvrsn=e31b3c52_10), archived as `sosc-credit-cards-updated-2026.pdf`.
- [Current Reserve terms / RSTC](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/rstc.pdf?sfvrsn=6a9f9616_1), archived as `reserve-current-card-terms.pdf`.
- [Reserve Priority Pass terms](https://www.axis.bank.in/docs/default-source/reserve-credit-card/rc_priority_pass_reserve.pdf?sfvrsn=784e5c7f_1), archived as `reserve-priority-pass-terms.pdf`.
- [Axis golf program terms](https://www.axis.bank.in/docs/default-source/reserve-credit-card/tnc_golf.pdf?sfvrsn=d9e26d4b_1), archived as `reserve-golf-terms.pdf`.
- [Axis Cathay Pacific cardholder offer and BIN/card list (valid through 2025)](https://www.axis.bank.in/docs/default-source/default-document-library/cathay-pacific-offer2-tc-31-12-25.pdf?sfvrsn=ff7919ca_1), archived as `reserve-visa-infinite-issuer-card-list-2025.pdf`.

## Field findings and resulting data

| Area | Issuer evidence | Record treatment |
|---|---|---|
| Fees | Product page and KFS give INR 50,000 joining/annual fee, INR 35 lakh annual waiver, 1.5% forex, 3% monthly APR, and nil cash-withdrawal charge. | Values retained; added source refs and full numeric field coverage. Waiver notes preserve transition for pre-1 Sep 2023 customers. |
| EDGE earn | Base 15 points per INR 200. June 2025 revision grants 30 per INR 200 on eligible international spend only up to assigned credit limit per calendar month, then 15; excludes temporary limit increases and delays accelerated half until day 45 after month-end. | Removed the incorrect `unlimited` cap. Current schema cannot encode the individual credit-limit-based spend ceiling, so it is explicit in notes. |
| Reward exclusions | Current product page and revisions list utilities/telecom, rent (points only up to INR 1 lakh monthly), wallet, gift cards, government, insurance, gold/jewellery, fuel, bridge/road/tolls, cash advances and repayments. EMI-converted purchases lose points, with no restoration after cancellation. | Added missing telecom, gift-card, and cash-advance exclusions. Repayments and EMI behavior are stated in notes because the exclusion vocabulary has no `repayments` value. Fee-waiver exclusions are separately described in notes. |
| Lounge | Current issuer Reserve terms state unlimited primary/add-on domestic visits and 12 complimentary guest visits per year. Priority Pass terms give unlimited international visits and 12 guests per year. The 28 Aug 2026 update says domestic access in India is by physical Reserve card; Priority Pass is not valid there. | Kept unlimited cardholder visit counts, clarified the different annual guest cycles and domestic entry method. Schema only allows guests-per-visit; left it null because annual guest allowances cannot be represented there. |
| Golf | Issuer golf T&Cs list 50 complimentary rounds/year, 4-day advance booking, availability conditions, max two booked slots at once and one per day. | Added 50 rounds/year and booking constraints. |
| Welcome | Product page: 15,000 points in year one after first transaction within 30 days; unavailable to first-year-free and lifetime-free accounts. | Retained and documented against current issuer copy. |
| Insurance / fuel | Product page lists INR 2 lakh purchase protection, USD 500 baggage loss/delay/documents, INR 5 lakh credit shield, and 1% fuel surcharge waiver for INR 400–4,000 transactions up to INR 400 per statement cycle. | Retained. Fee schedule confirms monthly APR and surcharge details. |
| Other benefits | Airport concierge, ITC Culinaire, Accor Plus, Club Marriott, 15% Postcard savings, EazyDiner Prime and complimentary BookMyShow tickets appear on the issuer page. Luxury airport transfers ended 20 Apr 2024; Oberoi offers ended 1 Oct 2025. From 15 Nov 2026, linked memberships renew only with explicit consent. | Retained currently advertised benefits and added expiry/renewal caveats. BookMyShow quota and EazyDiner tenure remain unresolved. |
| Network / eligibility | Reserve lounge terms specify Visa-affiliated domestic access. The issuer's Cathay offer card/BIN list identifies BIN 436560 as "Axis Bank Infinite Reserve Credit Card." The public product page does not establish numeric age/income/score criteria. | Retained Visa and populated the network tier as Infinite based on issuer card-specific evidence. Numeric eligibility remains null rather than inferred. Issuer relationship/underwriting criteria may apply. |

## Known data-model limits and unresolved facts

- International accelerated earn is capped by each account's assigned credit limit, not a fixed points/spend amount; the schema cannot calculate this cap.
- Lounge guest access is a pooled annual allowance, while the schema expresses guests per visit.
- Membership access, fee treatment and other legacy features can vary by onboarding cohort; only the explicitly published waiver transition is currently captured.
- No universal point-to-rupee value is published for EDGE catalog rewards. Miles-transfer ratios are dynamic and partner-specific; no universal fixed value is asserted.
- BookMyShow ticket count/conditions, EazyDiner membership duration, and numeric age/income/credit-score cutoffs remain unpublished or unverified. The network tier is sourced from an issuer offer's 2025 card/BIN list; issuance of a materially different variant is not established by the public Reserve product page.
- The older Reserve domestic-lounge PDF in this archive states validity only through 31 Mar 2022. It was retained for history and not used to assert current terms.

