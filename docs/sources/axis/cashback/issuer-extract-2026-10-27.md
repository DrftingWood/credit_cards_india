# Axis Bank Cashback Credit Card: issuer comparison (27 Oct 2026)

## Sources checked

- [Current Cashback Credit Card product page](https://www.axis.bank.in/cards/credit-card/cashback-credit-card), retrieved 2026-10-27. Includes current eligibility, headline rewards and fees; notes terms update effective 28 Aug 2026.
- [Cashback Credit Card Member Terms and Conditions](https://www.axis.bank.in/docs/default-source/default-document-library/axis-bank-cashback-credit-card-tnc.pdf?sfvrsn=d015df26_5), retrieved 2026-10-27. Main source for card fees, waiver, welcome benefit, reward tiers, utility MCCs, exclusions and cashback processing.
- [Axis Bank generic credit-card T&C revision, effective 28 Aug 2026](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf), linked from the current card page. Confirms 3.5% DCC markup, revised late fee, payment allocation, gift-card treatment and reward exclusions for bridge/road fees and tolls.
- [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) and [data quality action-plan guide](https://www.gov.uk/government/publications/implement-a-data-quality-action-plan/data-quality-action-plan-implementation-guide): distinguish accuracy from validity, completeness, consistency, uniqueness and timeliness. These are process guidance, not card fact sources.

## Record comparison and changes

- Fees: confirmed INR 1,000 joining/annual fees, INR 4 lakh or more annual spend waiver, monthly finance charge of 3.75%, cash advance fee 2.5% (minimum INR 500), and forex markup 3.5%. Waiver spend uses settlement date and excludes rent, wallet loads and gift cards; the waiver and INR 1,000 annual fee apply to portal onboardings from 1 June 2024. Generic T&C sets DCC markup to 3.5% effective 28 Aug 2026. Product page lists several spend-threshold service fees not represented by the current card fee fields.
- Cashback: confirmed 0.75% uncapped base on eligible POS/card-present transactions and travel, 2%/5%/7% marginal online card-not-present slabs, and INR 4,000 accelerated cap per statement month. Net spend includes purchases, reversals and EMI conversions. Transactions round cashback down; later reversals or EMI conversions may debit it, and negative net spend can create a debit.
- Utilities: 0.5% up to INR 100 per statement on MCCs 4816, 4899 and 4900. MCC 4814 telephone bill transactions earn base or accelerator depending on transaction channel.
- Exclusions: bridge/road fees and tolls, insurance, education, jewellery/precious metals/watches, government, wallet, rent, fuel and gift cards. Current card terms list excluded categories without publishing their exact MCCs. Removed the unsupported standalone rent MCC 6513.
- Welcome: 5,000 EDGE Reward Points worth INR 1,000, first spend within 30 days, for customers paying the joining fee; one-time for primary customer ID and unavailable to existing Cashback holders/card swaps.
- Eligibility: product page confirms primary cardholder age 18–70 and Indian residency, with bank discretion. Income and credit-score thresholds are not published.
- Network: cleared Visa/Signature because the current product page and terms reviewed do not identify one specific network variant; generic terms referring to Visa and Mastercard transactions do not establish this card's individual network.
- Dining: product page advertises Axis Bank Dining Delights and links general EazyDiner terms. The record now captures the program name with `discount_pct: null`; card-specific discount and detailed eligibility terms are unpublished on the card page.

## Data-model limitations and remaining uncertainty

- The model has no transaction-channel field for base earn. It therefore retains `travel` as the explicit base category and documents that calculator projections omit POS/card-present non-travel cashback. The online slabs are supported directly by the schema; prior notes saying otherwise were incorrect and have been removed.
- The calculator does not reproduce per-transaction rounding, statement-level reversal/EMI timing, cashback debits, account-standing conditions, or all product-page service-fee thresholds.
- Product and terms do not state income or bureau-score cutoffs, exact non-utility excluded MCCs, or one network variant. These remain unknown, not assumed.

## Validation evidence

After updating the record, rerun `python scripts/validate.py`, `python scripts/audit_stamps.py`, `python scripts/audit_numeric_evidence.py`, and `python tmp/next_queue.py`. Their results establish structural validity, date consistency and explicit evidence-path coverage; they do not by themselves establish factual accuracy.
