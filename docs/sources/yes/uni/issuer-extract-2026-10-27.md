# YES BANK UNI Credit Card source comparison (2026-10-27)

## Issuer sources

- [YES BANK card catalogue](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards): product remains listed; zero joining fee, ?499 renewal fee; 1% cashback in Uni Coins on all transactions; zero foreign-currency conversion markup; 1% fuel surcharge waiver.
- [YES BANK Key Fact Statement for UNI / UNI RuPay](https://www.yes.bank.in/content/published/api/v1.1/assets/CONT07A77C257C7A4BDD85DB97E51D2B5B8F/native/yesbank_key_fact_statement.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false): UNI has nil first-year membership and ?499 renewal; 3.99% monthly finance; cash advance limit and fee not applicable; ?50,000 renewal waiver rule appears in KFS co-brand terms (not lifetime free for this UNI variant).
- [Current YES BANK co-brand MITC/KFS indexed text](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false): confirms UNI annual fee ?499 and waiver schedule. Access to linked PDFs is rendered/indexed, but direct retrievals may return an HTML shell.
- [YES BANK Key Fact Statement current indexed copy](https://www.yes.bank.in/content/published/api/v1.1/assets/CONT07A77C257C7A4BDD85DB97E51D2B5B8F/native/yesbank_key_fact_statement.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false): 1% surcharge waiver for fuel transactions up to ?7,500; maximum ?500 per statement cycle for UNI and UNI RuPay. Fuel surcharge GST is not reversed.

## Corrections

- Kept active status because UNI is still listed in the current bank catalogue. Corrected annual fee from ?0 to ?499, retained nil joining fee, and added ?50,000 annual spend waiver.
- Finance charge 3.99% monthly; no cash advance facility/fee; forex markup 0% per current catalogue. Cleared unsupported Mastercard/Platinum and launch-date values because current product-specific evidence does not establish these.
- Catalogue headline: 1% cashback in Uni Coins on all transactions. Accessible issuer terms do not provide the coin issuance ratio, conversion value, redemption mechanism or variant-specific exclusions. Those numeric fields and unit value are left null; do not transfer SBM Uni MITC or Uni GoldX rules to this YES BANK product.
- Fuel waiver corrected to 1% up to ?7,500, capped ?500 per statement cycle; surcharge GST is not reversed. No minimum transaction amount found.
- Cleared unsupported default residency and false `concierge: false`; lounge and eligibility details remain unknown. The official product page remains the application reference.

## Unresolved terms

The one-percent Uni Coin headline is not enough to infer either 100 coins per ?100 or a rupee value per coin. Current product-specific redemption and reward exclusions could not be found in accessible YES BANK materials. No launch announcement or network product detail was located during this pass.
