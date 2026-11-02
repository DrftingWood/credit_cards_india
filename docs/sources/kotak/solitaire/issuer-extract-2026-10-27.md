# Kotak Solitaire Credit Card issuer comparison — 2026-10-27

## Sources reviewed and archived

- Current Kotak [Solitaire product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-solitaire-credit-card.html), captured as `product-page-2026-10-27.html`.
- Current [rewards page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-solitaire-credit-card/rewards.html), captured as `rewards-page-2026-10-27.html`.
- Current [fees page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-solitaire-credit-card/fees-and-charges.html), captured as `fees-page-2026-10-27.html`.
- Card-specific KFS version KFSKS04062026, archived as `kfs-solitaire-2026-10-27.pdf`.
- Current shared retail MITC archived in `../air/mitc-wealth-white-reserve-2026-10-26.pdf`.
- Current card-specific [detailed T&Cs dated 7-Apr-2026](https://images.kotak.bank.in/bank/mailers/2026/files/detailed-tc-kotak-solitaire-cc_07_04_2026_Final.pdf) were read via issuer PDF, but direct download returned HTTP 403. This is documented; the current KFS, MITC, page captures, and rendered claim details are archived.
- Issuer's current [reward-exclusion MCC schedule](https://www.kotak.bank.in/content/dam/Kotak/gsfcfiles/credit-cards/list-of-mccs-with-respect-to-revised-fees-and-rewards_june_01_2025.pdf) is referenced from `../indigo-xl/kotak-reward-mcc-schedule-2025-06-01.pdf`.
- Domestic lounge list and Priority Pass lounge list are already archived in `../white/domestic-lounge-list-2022.pdf` and `../white/priority-pass-lounge-list-2023.pdf`.

## Corrections made

- Removed unsupported 2021-01-01 launch date and Visa Infinite network tier. Current pages support Visa network privileges but do not identify a Visa tier.
- KFS lists NIL joining fee and INR25,000 annual fee; Solitaire Program membership waives the annual fee, and downgrade from the program triggers the INR25,000 annual fee. Standard rate is 3.5% monthly/42% APR. Cash withdrawal costs 1% with no interest through payment due date. Forex markup is zero.
- Corrected travel earn: Kotak Unbox flight/hotel and add-on bookings earn 10 Air Miles/INR100 (3 base + 7 accelerated), with accelerated miles capped at 100,000 per statement cycle; after the cap the base 3 continues. Other eligible purchases earn 3/INR100. International spend earns no miles; fuel earns no miles despite the separate fuel waiver. Air Miles expire after three years.
- Replaced outdated/non-current partner list and speculative rupee valuations with the issuer's current partner ratios: Air India 1:1; British Airways, United, Cathay, Air France-KLM Flying Blue, Accor and Qatar 2:1; Marriott 3:1. Partner transfers need 2,000 Air Miles and have no maximum cap. Unbox travel redemption is INR1/mile (minimum500); vouchers are INR0.50/mile (minimum500).
- Corrected lounge access: unlimited domestic and international access for primary and add-on cardholders. Primary cardholder has two free guest lounge entries per year for domestic and two for international; both guest entries can be used together. Validation charges: INR2 domestic and USD1 international, latter automatically reversed within seven working days.
- Updated fuel surcharge waiver to 1% on INR400-INR7,500 transactions, maximum INR10,000 per anniversary year. No Air Miles accrue on fuel.
- Removed unsupported golf benefit. Kept concierge. Updated Visa hotel benefits to current ITC Hotels and Elivaas third-night-free or 50%-off-second-night terms. Added current Kotak Solitaire Table offer (20% off up to INR5,000 twice/month on eligible District transactions through 2027-03-31).
- Cleared numeric age, income, score, residency and launch-date assertions not established by reviewed issuer pages.

## Unresolved source differences

1. Annual fee presentation differs: the fee page says Nil for program members and INR25,000 after downgrade; the KFS table expresses INR25,000 annual fee waived while the customer remains part of the Solitaire Program. The YAML stores INR25,000 with a zero-spend annual program-condition waiver.
2. Product-page FAQs conflict on the maximum add-on card count: one page section says up to four; another says up to three. No count is encoded.
3. Current detailed Solitaire T&Cs were accessible via web but issuer CDN blocked direct file download (HTTP 403); current card page and KFS plus already-archived MITC/MCC/lounge documents are retained locally.
4. Visa privilege page terms may change; hotel benefit is identified as Visa-provided and subject to change.
5. No exact card launch date or Visa network tier, nor numeric underwriting requirements, were found.

The review follows the project's [database accuracy overview](../../DATABASE_ACCURACY_OVERVIEW_2026-10-27.md) and the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework), which separates accuracy from validity and completeness.
