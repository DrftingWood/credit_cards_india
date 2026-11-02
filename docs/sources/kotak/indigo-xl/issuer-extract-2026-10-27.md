# IndiGo Kotak Premium Credit Card (XL) issuer comparison — 2026-10-27

## Sources reviewed and archived

- Kotak [current features page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indigo-xl-credit-card.amp.html), captured at `product-page-2026-10-27.html`.
- Kotak [Key Fact Statement](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/kfs-indigo-kotak-xl-new.pdf), archived as `kfs-indigo-xl-2026-10-27.pdf` (version KFSIKXL12032026).
- Kotak [co-brand card terms](https://images.kotak.bank.in/bank/mailers/2025/files/Kotak%20IndiGo%20Credit%20Card%20TnC.pdf), archived as `indigo-kotak-card-terms-2026-10-27.pdf`.
- Current consolidated MITC archived in `../air/mitc-wealth-white-reserve-2026-10-26.pdf`.
- [Rewards MCC schedule](https://www.kotak.bank.in/content/dam/Kotak/gsfcfiles/credit-cards/list-of-mccs-with-respect-to-revised-fees-and-rewards_june_01_2025.pdf), archived as `kotak-reward-mcc-schedule-2025-06-01.pdf`.
- [Domestic lounge list](https://images.kotak.com/bank/mailers/2022/files/Kotak%20Domestic%20Lounge%20List.pdf) and [lounge program terms](https://images.kotak.com/bank/mailers/2023/files/Lounge%20MITC%2012-5%20Revised.pdf), archived in this directory.
- Current fee and value chart captures archived as `fees-page-2026-10-27.html` and `value-chart-2026-10-27.html`; limited-time [offers page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indigo-xl-credit-card/exclusive-offers.html) captured as `exclusive-offers-2026-10-27.html`.
- [Issuer relaunch announcement](https://www.kotak.bank.in/content/dam/Kotak/others/kotak-indigo-consumer-release-final-09-07-2025.pdf), archived as `indigo-kotak-relaunch-2025-07-10.pdf`.

## Corrections made

- Launch date is 2025-07-10 from Kotak's relaunch announcement. Network and network tier are null because the current product pages represent multiple variants and do not establish a single scalar network for this aggregate record.
- KFS fees: INR3,000 joining and annual, no recurring fee waiver, 3.5% forex/DCC, 3.75% monthly finance, and cash advance 2.5% (minimum INR500). Joining charge is billed within 90 days. KFS includes transaction fees on wallet load, fuel, gaming, utilities, education and rent; their bases and thresholds are described in fee notes.
- Eligible regular retail spend earns 2 BluChips/INR100; dining and entertainment earn 3/INR100. Direct IndiGo website/app flights show up to 21/INR100, but the total is tier-dependent (17/19/21); only 5 is card-attributable, alongside 8 base member, 4 channel and up to 4 tier BluChips. Third-party bookings and specified business/agent bookings do not qualify; passenger must match cardholder and complete travel.
- Replaced the incorrect general fuel reward exclusion with issuer MCC exclusions; fuel MCCs 5541/5542 are still excluded from rewards. Removed unsupported EMI exclusion.
- BluChip redemption value is dynamic at IndiGo's discretion. Program-file face/realized estimates are not issuer promises. Card vouchers are redeemed via IndiGo channels against base fare under one-way/one-journey and expiry restrictions.
- Updated welcome/renewal to 4,000 BluChips plus 6E Eats, and milestones to four 4,000-BluChip vouchers at INR150,000/400,000/750,000/1,200,000 anniversary-year spends. BluChip voucher amounts have no fixed rupee valuation in this record.
- Lounge benefit is two domestic visits per calendar quarter, no minimum spend; primary cardholder only and guests chargeable. Removed unsupported fuel-surcharge waiver and broad baggage assistance. Limited-time offers through 2027-02-28 are separately noted.
- Cleared unsupported residency, age, income and credit-score claims.

## Unresolved issuer evidence

1. Limited acquisition offer says joining fee can be waived/reversed after INR100,000 spend within 90 days and advertises welcome vouchers. Generic co-brand terms say welcome benefits are unavailable when joining fee is waived. Kept the offer and conflict visible in notes.
2. Lounge documents list variants as “IndiGo Premium” and “IndiGo 6E Rewards XL”; exact current product name “IndiGo Kotak Premium Credit Card” is not a direct match. Current product page/FAQ and lounge terms support the quota/no-spend condition, but exact list enrollment mapping remains unclear.
3. Lounge terms PDF is older than current product page; guest charges and a INR2 validation swipe are retained as terms-level details, while availability is flagged as name-mapping unresolved.
4. BluChip INR values fluctuate and the issuer says redemption value is at IndiGo's discretion; project-level estimates are not guaranteed redemption rates.
5. The product page includes network-specific variants, but this record is not variant-normalized; network scalar fields are null.

Accuracy guidance: the project's [database accuracy overview](../../DATABASE_ACCURACY_OVERVIEW_2026-10-27.md) distinguishes factual accuracy from validity and evidence-path coverage. The cited [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) defines accuracy as closeness to true value and treats it separately from completeness and validity.
