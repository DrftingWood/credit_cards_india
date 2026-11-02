# Axis Bank Pride Platinum — issuer-source comparison (2026-10-27)

## Sources reviewed

- Current [Pride Platinum product page](https://www.axis.bank.in/cards/credit-card/pride-platinum-credit-card), retrieved 2026-10-27.
- Axis Bank Key Fact Sheet / Schedule of Charges PDF, updated 15 February 2026, retrieved 2026-10-27; archived as `sosc-credit-cards-retrieved-2026-10-27.pdf`.
- Axis Bank MITC, retrieved 2026-10-27; archived as `mitc-credit-cards-retrieved-2026-10-27.pdf`.
- Axis Bank general revision notice effective 28 August 2026; archived as `terms-revision-effective-2026-08-28.pdf`.
- Pride Platinum EDGE Reward Points T&Cs PDF linked by the product page; archived pre-existing copy as `pride-platinum-edge-rewards-mcc-exclusions.pdf`.

## Field reconciliation

| Area | Issuer evidence | Record treatment |
| --- | --- | --- |
| Network/tier | Product page does not specify a card network or card tier. | Network remains null; `network-unverified` retained. `entry` classification is retained only because the record schema requires a tier enum and offers no unknown value. |
| Fees | Product page: nil joining fee; annual fee nil in year one and ₹250 from year two. KFS and MITC: annual fee ₹250, waived on ₹20,000 eligible preceding-anniversary-year spend. | Joining ₹0 and annual ₹250 retained. First-year nil is described in notes. The waiver object is cleared because issuer pages conflict: current product page's summary/KFS/MITC state ₹20,000, but its expanded fee table states ₹40,000. Record documents the conflict; neither threshold is asserted as settled. |
| Other charges | Current product page lists finance 3.75% monthly, cash advance 2.5% (₹500 minimum), forex 3.5%, DCC 3.5%, rent/third-party education/wallet/fuel/utility/online skill-gaming transaction charges, and late-payment/over-limit/payment-return charges. MITC supports monthly/annual finance rate. | Values retained in descriptive fee notes. The fee schema has no structured fields for these charge categories. Exact ₹500 late-fee boundary is not stated in the published slab. |
| Rewards | Product page: 4 EDGE points per ₹200. Card-specific reward PDF excludes utilities, education, insurance, government institutions, wallet, rent and fuel. 28-Aug-2026 generic revision says gift cards and bridge/road fees/tolls do not earn rewards. | Base earn retained. Explicit exclusions updated to the card-specific list plus gift cards and bridge/road fees/tolls. No fixed INR value is published. |
| Dining | Product page promotes 15% at partner restaurants but does not state current cap, minimum spend or frequency. | Discount retained; conditions noted as unpublished / dependent on current Dining Delights terms. |
| Fuel waiver | Product page: 1% on domestic fuel transactions ₹400–₹4,000, up to ₹250 per statement cycle; fuel earns no EDGE points and fuel-surcharge GST is non-refundable. | Structured terms retained. |
| Other benefits | Product page supports zero lost-card liability after reporting, EMI conversion for purchases over ₹2,500, free add-ons for spouse/parents/children/siblings over 18, and Wednesday offers (currently MMT, Swiggy and Tira). | Retained, with time-sensitive Wednesday offer terms described as changeable. |
| Eligibility | Product page: primary age 18–70; resident Indian or NRI; Defence Forces and Government of India employees. Criteria indicative and approval is at bank discretion; no numerical minimum income or score published. | Ages/residency retained. Employer group is recorded in notes, with no numeric income/score claim. |

## Remaining uncertainty and model limits

- Annual-fee waiver threshold conflict (₹20,000 vs ₹40,000) across sections of the current issuer product page and the KFS/MITC. Fee waiver is null pending issuer clarification or a consistent current source.
- Product page describes 15% Dining Delights but does not provide current cap, minimum spend or frequency.
- Network cannot be verified from current card-specific issuer material. `tier: entry` is a constrained schema classification, not an issuer-published tier.
- Many transaction fees are only represented in free-text notes because the card schema lacks dedicated fields.

## Review outcome

Corrected the obsolete ₹40,000 waiver value in the structured fee field by clearing the contested threshold; added current fee treatment, current August revision exclusions and the issuer conflict to the card notes. Source-date audit and structural validator should be rerun after the card update. This record comparison establishes issuer support for the listed claims only; it does not produce a database-wide accuracy rate.
