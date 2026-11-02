# DBS SuperX Credit Card issuer-source review (27 Oct 2026)

Target: `data/cards/dbs/superx.yaml`.

## Issuer sources retrieved

- DBS [current consolidated MITC](https://www.dbs.bank.in/in/credit-cards/credit-card-consolidated-mitc.pdf), local PDF capture `consolidated-mitc-retrieved-2026-10-27.pdf` and extracted text `.txt`.
- DBS [Key Fact Document](https://www.dbs.bank.in/in/credit-cards/supercard/key-fact-document.pdf), local PDF capture `key-fact-document-retrieved-2026-10-27.pdf` and extracted text `.txt`.
- DBS [April 2026 Schedule of Charges](https://www.dbs.bank.in/in/iwov-resources/flp/splitter/images/pdf/Schedule_of_Charges.pdf), local capture `schedule-of-charges-retrieved-2026-10-27.pdf` and text `.txt`.
- Old recorded product URL `https://www.dbs.com/in/personal/cards/credit-cards/superx-credit-card` now returns the generic Wealth Management site, archived as `legacy-product-url-retrieved-2026-10-27.html`.
- DBS current [credit card catalogue](https://www.dbs.bank.in/in/credit-cards/default.html) lists SuperX as a product category but provides no linked public SuperX benefit terms.
- DBS [DBS Delights terms](https://www.dbs.bank.in/digibank/in/terms-and-conditions.page) list SuperX as eligible for the rewards platform; this does not establish earn rules.

## Confirmed and corrected

- Keep status active: current DBS documents list SuperX and SuperX Plus as cards being issued to SuperCard holders, with future discontinuation language in the current MITC. No SuperX discontinuation notice found.
- Removed unsupported 2024-01-01 launch date, Visa Signature assignment and the old product application URL; exact SuperX launch date, issued network/tier and public application flow are not established.
- Fee schedule: no joining fee (MITC marks NA), INR1,499 annual fee, no spend waiver. GST applies to fees.
- Forex markup: 3.5%; cash advance: 2.5% or INR500, whichever higher.
- SuperX finance charge is listed as a range 3.5%-4% monthly (42%-48% annual), varying by credit history and other account factors. A single assigned account rate cannot be inferred; the scalar rate is null.
- DBS lists DBS SuperX for DBS Delights redemption and a shared redemption fee (INR99 + GST in the April schedule / Key Fact Document). No public SuperX earn rate, point nomenclature/value, exclusions, expiry or redemption ratio is published in the reviewed issuer documents.

## Removed stale/inferred claims

Removed the record's assumed 1 point/INR100 earn, 5X dining/online/travel categories, fixed INR0.25 value, 5,000-point welcome offer, quarterly lounge, BookMyShow discount and INR150 fuel waiver. These details belong to neither the publicly documented SuperX terms nor the current shared DBS fee documents; they appear to have been inferred from other DBS card products.

Public card-specific eligibility thresholds and benefit terms remain unavailable. The direct legacy product URL did not return a SuperX page. Do not treat generic DBS Delights availability as proof of a particular earn rate or welcome benefit.

## Source conflict requiring continued monitoring

The current retrieved consolidated MITC states the *Bajaj Finserv DBS SuperCard* will be discontinued effective 15-Dec-2026 and holders will be issued SuperX/SuperX Plus. DBS's generic SuperCard webpage still says new issuance ceased 23-Nov-2024, and older web-indexed MITC content said 1-Dec-2025. These notices concern the predecessor SuperCard rather than SuperX, so do not mark SuperX discontinued. Retain the active status and monitor current issuer communications.
