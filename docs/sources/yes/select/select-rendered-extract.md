# YES Bank SELECT: issuer evidence extract

Reviewed: 2026-10-26  
Current card page: <https://pri1.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/select-credit-card>  
Current issuer listing: <https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards>  
Current consolidated MITC v18: <https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false>

## Status and fees

- Current standard SELECT page remains available, so status stays active. It also describes a separate virtual RuPay variant for existing Mastercard/Visa holders; standard card does not apply for existing YES Bank cardholders.
- Current page/MITC confirms ?599 joining and renewal fees, joining waiver after ?10,000 retail spend in first month, renewal waiver after ?100,000 eligible retail spend during the prior 12 months; effective values preserved.
- Current MITC v18 sets 3.99% monthly / 47.88% annual APR, cash advance at 2.5% or ?650 minimum (effective 15-Jun-2026).
- Forex conflict: current MITC v18 fee table lists 2.75% foreign-currency markup / 3.50% DCC for SELECT, while the card-page carousel and an issuer listing headline show 3.50% as ?Foreign Currency Markup?; the card-page footnote says 2.75% applied before 15-Jun-2026. The structured markup follows the consolidated MITC (2.75%) with medium confidence; the discrepancy is retained here.
- Removed unsupported Mastercard/World and 2019 launch-date claims. Network variant is not represented as a single scalar.

## Rewards and benefits

- Current page: 8 points/?200 online retail except Select categories, 4/?200 offline except Select categories, and 2/?200 on Select categories. Glossary cap is 5,000 per statement cycle. Utility MCC 4900 points capped at 150 per statement. Current full select MCC list was not available in the page snippet; legacy 4899 mapping is not copied as current.
- Effective 15-Jun-2026 exclusions: rent, wallet, fuel, government, marketing/advertising, cash withdrawals, post-purchase and instant EMI, insurance, education, railways, toll, ferry and jewellery. Current MCC mappings are recorded in the YAML.
- Issuer page says point value up to ?0.25; actual value depends on redemption path, so realized value is null. Current MITC generic redemption fee is ?100 + GST per request; flight bookings add ?99 + GST; points expire after three years.
- Card page advertises one domestic lounge visit per quarter. Current MITC v18 says SELECT requires INR50,000 eligible spend in the preceding quarter for domestic lounge access. International quota is not asserted.
- District movie offer: BOGO, max discount ?150 on second ticket once per user per calendar month. BOGO coffee is at eligible outlets in select malls; terms apply.
- Current MITC fuel waiver: 1% on ?500??3,000 transactions, maximum ?125 per statement; GST on surcharge is not waived and UPI fuel is ineligible.

## Eligibility and capture limits

- Current page: age 21?60; salaried minimum net salary ?50,000/month or self-employed ITR ?7.5 lakh/year. Already holding any YES Bank credit card makes applicant ineligible for standard SELECT; existing Mastercard/Visa holders can request separate virtual RuPay variant. Bureau threshold and residency cutoff are not published.
- Current web page is JavaScript-rendered; the official current generic MITC was archived from a verified issuer copy and signature-checked. Card-specific SELECT PDF was not downloaded; visible current text and capture notes are preserved here.
