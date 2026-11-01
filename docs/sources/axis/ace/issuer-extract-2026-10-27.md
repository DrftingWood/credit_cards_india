# Axis Bank ACE Credit Card — issuer comparison (27 Oct 2026)

## Sources checked

- [Current ACE product page](https://www.axis.bank.in/cards/credit-card/axis-bank-ace-credit-card): current benefits, fee schedule, rates, annual spend waiver, fuel waiver and dining value chart. The page says ACE terms update effective 28 Aug 2026.
- [ACE cashback proposition terms](https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/axis-bank-ace-credit-card-tncs.pdf): 5% on specified Google Pay Android bill/recharge transactions; 4% Swiggy, Zomato and Ola app/site; 1.5% other eligible merchants; combined ₹500 statement cap for accelerated streams; exclusions and cashback timing.
- [Axis airport lounge program](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-airport-lounge-access-program.pdf): 4 domestic visits/calendar year; ₹50,000 eligible spend in prior three calendar months; issuance-month and following-three-month waiver for new cards.
- [Axis MITC](https://www.axis.bank.in/docs/default-source/default-document-library/mitc-credit-cards.pdf): fees and fee waiver rules. Gift-card category is excluded from annual fee waiver spend effective 28 Aug 2026.
- [Axis launch announcement](https://www.axis.bank.in/about-us/press-releases/axis-bank-launches-ace-credit-card-in-collaboration-with-google-pay-visa): dated 12 Oct 2020 and identifies Visa collaboration.
- [Dining Delights terms](https://www.axis.bank.in/docs/default-source/default-document-library/debit-card/terms-and-conditions-for-dining-delights.pdf): current Axis dining benefit includes ACE; 15% up to ₹500, minimum order ₹2,500, once per card per month.

## Corrections and field limits

- Corrected launch date from 15 Jul 2020 to 12 Oct 2020 based on Axis's launch announcement. Visa is supported; a Visa Platinum tier was not established in the checked ACE-specific issuer sources, so `network_tier` is now unknown.
- Confirmed joining fee ₹499 (reversed after ₹10,000 eligible spend within 45 days), annual fee ₹499 from year two, and waiver for annual eligible spend greater than ₹200,000. The current waiver terms exclude rent, wallet loads and gift-card category spend; this is stated in fee notes.
- Confirmed 3.5% forex markup, 3.75% monthly finance charge and cash advance charge 2.5%, minimum ₹500 from Axis fee documents.
- Confirmed 5% Google Pay Android eligible bill/recharge cashback, 4% on Swiggy/Zomato/Ola through their apps/sites, and 1.5% other eligible spends. The 5% and 4% streams share a ₹500 statement cap; they do not earn base cashback above the cap. Exclusions apply as stated in current ACE terms. MCC level rules exceed the current category schema and are not all separately modeled.
- Confirmed four domestic lounge visits per calendar year and the ₹50,000 previous-three-calendar-month spend gate, with new-card waiver. Removed the unsupported Dreamfolks operator claim.
- Confirmed fuel waiver of 1% on ₹400–₹4,000 transactions, capped at ₹500 per statement; GST on surcharge is not refunded and fuel earns no cashback.
- Corrected dining program label to Axis Bank Dining Delights; offer is 15% up to ₹500, minimum ₹2,500, once per card per month. This is not evidence of EazyDiner Prime membership.
- Set residency unknown because the generic Axis eligibility page permits both Indian residents and NRIs and does not provide ACE-specific criteria. Age, income and credit-score values remain unknown.
- Axis's product page lists additional transaction fees on specific cumulative spend categories (including fuel and skill gaming); not all fit the structured fee schema and should be checked against current MITC before adding as separate fee rows.

## Scope note

These are field comparisons for the listed claims, not a claim that the whole dataset is factually accurate. Retrieved/verified date records this review snapshot, not each term's effective date. Current official product and MITC pages can change.
