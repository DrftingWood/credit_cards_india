# DBS BFL 5X issuer-source comparison (2026-10-27)

Target: `data/cards/dbs/bfl-5x.yaml` — Bajaj Finserv DBS Bank 5X Rewards SuperCard.

## Primary sources reviewed and archived

- [5X Rewards Product Benefits and Terms](https://www.dbs.bank.in/in/credit-cards/supercard/bajaj-finserv-dbs-5X-rewards-supercard.html), retrieved 2026-10-27; local capture `product-benefits-terms-retrieved-2026-10-27.html`.
- [Current SuperCard terms index](https://www.dbs.bank.in/in/credit-cards/supercard/terms-and-conditions.html), retrieved 2026-10-27; local capture `terms-index-retrieved-2026-10-27.html`.
- [SuperCard MITC](https://www.dbs.bank.in/in/credit-cards/supercard/bajaj-finserv-dbs-supercard-mitc-new.html), retrieved 2026-10-27; local capture `mitc-retrieved-2026-10-27.html`.
- [DBS/Bajaj rewards FAQ](https://www.dbs.bank.in/in/credit-cards/supercard/help-support/dbs-bajaj-credit-card-rewards-management.html), retrieved 2026-10-27; local capture `rewards-faq-retrieved-2026-10-27.html`.

## Corrections supported by issuer sources

- DBS's current 5X terms page says the SuperCard will be discontinued effective 2026-08-01 and cardholders migrated to DBS SuperX or SuperX Plus. The broader SuperCard landing page says new issuance stopped 2024-11-23, while an older consolidated MITC references 2025-12-01; current card-specific page and current terms index both publish 2026-08-01. Logged this conflict and used the specific current notice.
- 5X-specific MITC fee table lists first-year joining fee as 0/499, annual fee 499 + GST, and says customer-specific fees are those communicated at issuance. Card-specific annual-fee waiver on INR50,000 annual spend was discontinued effective 2025-08-12. Record stores standard joining fee INR499 and annual INR499; this does not imply all issued customers paid joining fees.
- Current MITC states forex 3.5%, cash withdrawal fee 2.5% (minimum INR500), and finance charge up to 4% monthly/48% annually. Exact APR/customer plan is unknown, so the record leaves finance charge null.
- Base reward: 2 Cash Points/INR200 on eligible spend. The 5X milestone triggers at INR10,000 eligible spend per statement period; beyond 1X base, additional 8 points/INR200 accrue, capped 3,000 additional points/month. Fuel and cash withdrawals count toward threshold but do not earn; rent, wallet loads and utilities count neither toward threshold nor rewards.
- Eligible Card+ IN rewards-platform transactions earn an additional 18 Cash Points/INR200 (20 total), capped at 3,000 additional points/month, separate from the milestone cap. App flight bookings are excluded.
- Welcome: 2,000 Cash Points after first customer-initiated primary-card transaction within 60 days of issuance and payment of joining fee.
- Fuel surcharge waiver: 1% + GST reversed for fuel transactions greater than INR400 and less than INR4,000, capped INR100 per statement; GST on surcharge is not reversed.
- Eligible DBS Card+ IN membership purchases earn Cash Points equivalent to 20% discount, capped at 1,000 points. Points expire after two years. DBS FAQ states INR99 + GST per redemption.
- No lounge entitlement is listed for the 5X Rewards variant. Do not carry over benefits advertised for 5X Plus or higher variants.

## Cleared as unsupported / limitations

Removed the unsupported 2022-04-01 launch date, Visa Platinum tier, old fixed INR0.20 point value, 30-day/4,000-point welcome offer, general online-spend accelerator, BookMyShow discount and domestic lounge visit. Visa network remains supported by card terms/MITC context; card tier is unknown. Exact card start dates and each existing holder's fee/interest plan remain unknown. The snapshot's effective_from date is 2026-07-31 (last full day before stated discontinuation), not a claim that terms began that day.

The schema cannot fully express the interaction between milestone qualification, additional earn caps and app accelerator; conditional terms are preserved in notes and the issuer extract.
