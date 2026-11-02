# Axis Bank Privilege Easy — issuer-source comparison (2026-10-27)

## Sources reviewed

- Current [Privilege Easy product page](https://www.axis.bank.in/cards/credit-card/privilege-easy-credit-card), retrieved 2026-10-27.
- Axis Bank KFS/Schedule of Charges and MITC, retrieved 2026-10-27; archived in this directory.
- Privilege Easy terms revision effective 28-Aug-2026, archived in this directory.
- Current general Axis domestic lounge program, archived in this directory.
- Current product-linked milestone PDF and insurance terms, archived in this directory.

## Field comparison

| Field area | Issuer evidence | Record treatment |
| --- | --- | --- |
| Product/security | Current page calls this an FD-backed secured card, with linked credit limit and guaranteed approval. Minimum FD ₹65,000; maximum ₹25,00,000. Not issued against Tax Saver, Flexi/auto-sweep, HUF, society, trust or company FDs. | Secured status and FD terms retained in notes. |
| Network/tier | Product page does not identify Privilege Easy's network. A value chart on the Easy page is titled for the regular `PRIVILEGE CREDIT CARD` and mentions Mastercard-affiliated lounges; it is not used to assign a network to Easy. | Removed unsupported Mastercard network. `network` remains null; `network-unverified` and `network-tier-unverified` retained. Local `mid` tier is unverified. |
| Fees | Product page: standard joining ₹1,500 (nil for Priority customers); annual ₹1,500 from year two. Annual fee waived at ₹5 lakh eligible spend in prior card-anniversary year. Current exclusions include utility/telecom, rent, wallet, government, insurance, gold/jewellery, fuel, education, bridge/road/toll; Aug-2026 revision adds gift-card treatment. | Structured standard fee and ₹5 lakh annual waiver retained. Priority joining-fee exception and current spend exclusions in notes. |
| Charges | Product page: finance 3.4% monthly (49.36% p.a.); cash withdrawal 2.5%/₹500 min; cash payment ₹175; forex 3.5%; DCC 3.5%; 1% rent/third-party education and thresholded wallet/fuel/utility/gaming fees; late fee slabs, overlimit and payment-return charges; EDGE redemption fee waived. | Values retained in descriptive notes. Exact ₹500 late-fee boundary is unpublished. |
| Rewards | Product page: 10 EDGE points per ₹200; fuel earns no points. 28-Aug-2026 Privilege Easy revision excludes gift cards, bridge fees, road fees and tolls. | Base earn and these exclusions retained; no universal point INR value or card-specific reward MCC table asserted. Welcome and milestone grants are separately advertised at ₹0.20 per point. |
| Welcome benefit | Product page: 12,500 points worth ₹2,500, redeemable against vouchers after joining fee is levied and first purchase within 30 days. Free cards, first-year-free cards and Priority segment are excluded. | Current claim and conditions retained. |
| Milestone | Product page: additional 10,000 points worth ₹2,000 after ₹2.5 lakh anniversary-year spend. The linked PDF says its offer applies exclusively to `Axis Bank Privilege credit card` holders (regular unsecured card), not Privilege Easy. | Amount retained because Easy page independently advertises it. The regular Privilege PDF's spend exclusions are not applied to Easy; Easy-specific milestone exclusions are marked unpublished. |
| Lounge access | Easy product page advertises two complimentary selected domestic lounge entries per calendar quarter. Its “complete list” link returns 404. The current general Axis domestic lounge roster does not list Privilege Easy. The Easy-page value chart's lounge line belongs to the regular Privilege card. | Two quarterly visits retained as advertised. Spend gate, lounge roster, provider/network and other access details remain unverified; no generic ₹50,000 gate imported. |
| Fuel waiver | Current Easy page: 1% refund at Indian fuel stations, transactions ₹400–₹4,001, up to ₹400/month; its fee table and value chart state ₹400 maximum transaction. Fuel-surcharge tax is non-refundable; fuel earns no points. | Structured upper transaction bound remains ₹4,000 to follow the fee table, with the ₹4,001 narrative conflict recorded. Monthly cap retained. |
| Movies | Product page: BOGO via District, up to ₹250 once/month. Privilege Easy-specific revision effective 1-Nov-2026 adds ₹25,000 spend in previous 3 months; issuance-month plus next-three-calendar-month waiver, account-level settled/billed spend and EMI installment basis. | Benefit retained with future effective-date gate documented. |
| Other benefits | Product page lists Dining Delights (no current Easy-specific discount/cap published), Extraordinary Weekends, EMI conversion above ₹2,500, and insurance: purchase protection/credit shield ₹1 lakh; lost travel document USD 300; delayed baggage USD 300; lost checked baggage USD 500. It also lists changing Wednesday offers. | Retained with linked terms and coverage caveat. Lounge details link failure documented. |
| Eligibility | Current page requires Axis FD, ₹65,000–₹25 lakh, excludes minors, and lists ineligible FD types above. It does not publish a maximum age, income, score or residency rule. | `min_age: 18` set from the minor exclusion; maximum age, income, score and residency remain unknown. |

## Schema/source limits and open items

- The Easy product page exposes only lounge quota; its current lounge-list URL is broken, and the general Axis lounge roster does not include this card. Do not infer its spend gate or lounge provider/network from another card's program.
- The linked milestone PDF is for the regular Privilege card and expressly excludes other variants by saying it applies exclusively to that card. The Easy page separately advertises the same points milestone but does not publish Easy-specific exclusions.
- Network and issuer tier are not stated; the local `mid` classification is retained only because the schema requires a tier enum.
- The fuel transaction upper-bound prose conflicts with the fee table (₹4,001 vs ₹4,000).
- The product page's Dining Delights link is external; current Easy-specific discount and cap were not available in reviewed sources.

## Review outcome

Removed the unsupported Mastercard network and the unsupported borrowing of regular Privilege milestone exclusions. Set the minimum age to 18 from the issuer's explicit exclusion of minors. Refreshed current issuer retrieval dates and archived current source materials. Structural and source-stamp validation should be rerun after the record update. This card comparison does not establish a dataset-wide factual-accuracy rate.
