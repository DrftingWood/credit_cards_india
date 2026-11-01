# AU Bank Altura issuer comparison — 2026-10-27

Compared `data/cards/au/altura.yaml` with AU's current [Altura product page](https://www.au.bank.in/personal-banking/credit-cards/altura-credit-card), [Key Fact Statement v1.9 dated 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), current card FAQ on cashback eligibility, and AU's [Altura-specific usage terms](https://www.au.bank.in/cc-ausfb-credit-card-usage-terms-condition.pdf).

## Field comparison

- **Identity/status:** The issuer page lists Altura as an available card. It does not identify one network or network tier, and the generic RuPay FAQ does not prove Altura is exclusively RuPay. Cleared the `rupay`/`platinum` values, tag, and RuPay lounge-access channel. No issuer launch date found; removed the unsupported 2021 date.
- **Fees:** The current page and KFS support INR 199 joining/annual fee (excl. GST), first-year waiver after INR 10,000 retail spend within 90 days, and renewal waiver after INR 40,000 retail spend in the preceding year/card anniversary year. KFS v1.9 confirms 3.49% forex, 3.75% monthly revolving interest, cash advance fee 2.5% or INR 500 minimum, cash-advance limit up to 40% of card limit, and late-payment fee 15% of total due with INR 10 minimum/INR 1,300 maximum. The schema cannot encode the percentage late-fee formula; it remains in notes.
- **Cashback:** The product page states 2% on grocery, departmental-store and utility-bill payments and 1% on other retail. Rates are represented as total rates: the base scope excludes grocery and utility buckets so the calculator cannot add 1% to the 2% accelerator. It has no department-store bucket, so departmental spend is not scored at the 2% rate (the `other` proxy remains at the conservative base rate). AU does not publish a cashback cap in the current product page/KFS; replaced the unsupported `unlimited` claim with `cap_status: not-published`.
- **Eligible/excluded spend:** AU's current general card FAQ says rewards/cashback are earned on POS and online retail transactions, excluding cash withdrawal, fuel, EMI, and charges. AU's Altura-specific usage terms identify rent MCC 6513 and wallet MCC 6540 as ineligible. Government and education buckets are outside the modeled base-earn scope because the current card terms do not identify them as eligible retail. The AU FAQ says cashback posts to the next month's statement.
- **Benefits:** The current page confirms INR 50 additional cashback at INR 10,000 retail spend each statement cycle, 8 railway lounge visits per year (not airport lounges), and a 1% fuel surcharge waiver for INR 400–5,000 transactions up to INR 100. KFS v1.9 confirms the ₹100 cap and notes fuel-surcharge GST is not reversed. Added advertised device protection, card-liability cover, contactless payments up to INR 5,000 without PIN, zero-processing-fee Xpress EMI on transactions INR 2,000+, and free add-on cards. Insurance coverage amounts, exclusions and claim details remain unverified.
- **Eligibility:** The current issuer page lists resident Indian; salaried age 21–60; self-employed age 25–65. Numeric income and credit-score cutoffs are not published. The criteria are indicative and AU retains approval discretion.

## Unresolved or model-limited

- Current product sources do not specify a single network, tier, launch date, cashback cap, or numeric income/score threshold.
- Departmental stores cannot be represented as a separate canonical spend category, and exact cashback caps are unpublished. The current record therefore avoids overstating those claims.
- Rent/wallet exclusions are stated in AU's Altura-specific usage terms; that document is older than the current product page/KFS, and no newer conflicting Altura terms were found in this review.

## Validation

Updated the record verification date to 2026-10-27. The project validator passed after the YAML changes. Numeric-evidence and verification-stamp audits were rerun and recorded in the project handoff after the review.
