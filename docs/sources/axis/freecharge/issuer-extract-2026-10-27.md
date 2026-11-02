# Axis Bank FreeCharge Credit Card: issuer comparison (27 Oct 2026)

## Sources reviewed

- Current Axis product page: <https://www.axis.bank.in/cards/credit-card/axis-bank-freecharge-credit-card>
- Current Axis card application listing: <https://application.axis.bank.in/app_redirect/redirect.aspx?id=explorecards>
- Axis FreeCharge card terms effective 20 Jun 2025 (local archive): `docs/sources/axis/freecharge/terms-and-conditions-freecharge-final.pdf`.
- Axis general credit-card terms effective 28 Aug 2026: <https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf>
- Axis current Key Fact Sheet / Schedule of Charges: <https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/sosc-credit-cards.pdf?sfvrsn=e31b3c52_10>.

## Field reconciliation

| Area | Database value/review | Issuer evidence and limits |
| --- | --- | --- |
| Status and network | Invite-only; Visa Platinum retained | Current product page explicitly lists Visa Platinum platform and invite-only Freecharge-app access. No exact launch date published. |
| Fees | INR 250 joining; first-year fee nil; INR 250 from year two | Current Axis page. It states an annual-fee waiver exists and excludes rent and wallet loads, but does not publish the threshold. The database therefore keeps no numeric waiver amount and documents the known waiver in fee notes. |
| Charges | 3.75% monthly finance; cash advance 2.5%, min INR 500; FX 3.5%; DCC 3.5% | Current product page plus general terms effective 28 Aug 2026. Product page also lists redemption fees, rent/wallet/fuel/education/utility/gaming fees and current late-fee slabs. A fee line at exactly INR 500 due is not specified in the displayed slab. |
| Regular earn | 1 EDGE REWARD Point per INR 200 | Axis current application listing and card-specific page material. Point INR value is unknown; generic EDGE REWARD terms do not establish this card's conversion value. |
| Monthly milestones | 100 points at spend INR 2,000-4,999; 350 total points at INR 5,000+ | Current product page's milestone table. Month basis as stated by issuer. |
| Exclusions and points account | Rent, wallet loads, gold/jewellery, fuel, financial institutions, cash advances and repayments excluded | Card-specific terms effective 20 Jun 2025. Effective 1 Oct 2025, unredeemed points may be forfeited 30 days after card closure or if MAD is overdue for more than 90 days. |
| Welcome/offers | No active standard voucher modeled; current Wednesday offers recorded as variable | Current page lists up to 15% on Goibibo/MakeMyTrip, 10% off Swiggy/Amazon Fresh, and 10% off up to INR 1,000 on Tira; these are offer-of-the-day promotions with separate terms. Older Myntra, Shuttl, Freshmenu and Eros Now offers still appear in page content but are not treated as enduring card benefits. |
| Eligibility | Invite-only; age, residency, income and credit-score thresholds unknown | Current issuer page states eligible customers see a Freecharge app banner; it does not publish exact demographic or financial cutoffs. Third-party estimates were excluded. |

## Model and evidence limits

- The issuer states an annual-fee waiver but publishes no spend threshold on the current product page. The card schema requires an integer waiver threshold when a fee waiver object is present, so the record retains a null waiver object and explains the known condition in its fee-source notes.
- EDGE REWARD point value varies by redemption and no fixed FreeCharge-card INR value was found.
- Current product pages display some legacy offers alongside current Wednesday offers. Legacy promotions were not treated as guaranteed/current welcome benefits.
- Current source terms do not enumerate exact MCC codes for all categories; the record retains the documented rent code and captures broader category exclusions in source notes.

## Validation result

Confirmed current Visa Platinum, points earn and monthly milestones; retained invite-only status; cleared unsupported age/residency/income/score claims; documented the unpublished fee-waiver threshold and point conversion; refreshed source dates and numeric evidence paths. This issuer review does not supply a project-wide factual-accuracy percentage.
