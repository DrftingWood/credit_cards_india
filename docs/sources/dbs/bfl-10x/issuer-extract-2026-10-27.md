# DBS BFL 10X issuer-source comparison (2026-10-27)

Target: `data/cards/dbs/bfl-10x.yaml` — Bajaj Finserv DBS Bank 10X Rewards SuperCard (10X Signature variant).

## Primary sources reviewed and archived

- [10X Signature Product Benefits and Terms](https://www.dbs.bank.in/in/credit-cards/supercard/bajaj-finserv-dbs-10X-signature-supercard.html), retrieved 2026-10-27; local capture `product-benefits-terms-retrieved-2026-10-27.html`.
- [SuperCard terms index and discontinuation notice](https://www.dbs.bank.in/in/credit-cards/supercard/terms-and-conditions.html), retrieved 2026-10-27; local capture `terms-index-retrieved-2026-10-27.html`.
- [DBS/Bajaj rewards FAQ](https://www.dbs.bank.in/in/credit-cards/supercard/help-support/dbs-bajaj-credit-card-rewards-management.html), retrieved 2026-10-27; local capture `rewards-faq-retrieved-2026-10-27.html`.
- [DBS lounge program terms](https://www.dbs.bank.in/in/credit-cards/airport-lounge-access-tnc.html), retrieved 2026-10-27; local capture `lounge-terms-retrieved-2026-10-27.html`.

## Corrections supported by issuer evidence

- Status: discontinued effective 2026-08-01; issuer says cardholders migrate to DBS SuperX or SuperX Plus. This is a program-level notice; individual migration completion was not verified.
- The 10X Signature fee table lists INR2,999 joining and annual fees plus GST, without a fee waiver. Older cardholder fee plans may differ.
- Base rewards: 2 Cash Points per INR200 on eligible spend. On reaching INR20,000 eligible statement-month spend, eligible spend beyond the threshold earns an additional 18 per INR200 (20 total), capped at 15,000 additional points monthly. Fuel and cash withdrawals count toward the threshold but do not earn; rent, wallet loads and utilities count neither toward threshold nor rewards.
- Eligible rewards-platform spend in DBS Card+ IN earns additional 38 points per INR200 (40 total), capped at 15,000 additional points per month, separate from the milestone cap. Flight bookings in the app are excluded from this accelerator.
- Welcome offer: 12,000 Cash Points after a first customer-initiated transaction within 60 days of issuance and payment of joining fee.
- Domestic lounge quota: two visits per quarter; no international quota is listed for this variant.
- Fuel surcharge waiver: 1%, maximum INR200 per statement cycle. The reviewed card-specific terms do not establish a transaction band.
- Cash Points expire after two years. FAQ states INR99 + GST per redemption. A universal INR-per-point value is not established; removed previous assumed INR0.20 value.

## Cleared as unsupported / unresolved

Removed the old 2022-04-01 launch date, network/tier, annual-fee waiver, 4,000-point welcome offer, online-spend accelerator, BookMyShow offer, 1-visit lounge claim and INR150 fuel cap. Current reviewed sources did not establish these details for the 10X Signature variant. APR, forex markup, cash-advance charge, detailed applicant thresholds and exact prior fee plans remain unknown. Product-specific T&Cs say they prevail over the Cardmember Agreement for conflicts; common charges may be in the MITC/KFS. The issuer does not publish the original product launch date on the reviewed pages.

Reward values and milestone/app spend conditions exceed what this schema can fully express. YAML notes preserve the additional thresholds and separate caps to prevent treating the simple structured earn rate as unconditional.
