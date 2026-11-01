# slice source verification — 2026-10-26

The single current consumer card is the slice UPI Credit Card. Reviewed the live [issuer
card page](https://slice.bank.in/credit-card), current [MITC](https://slice.bank.in/cc-mitc),
[cardmember agreement](https://slice.bank.in/cc-terms), and issuer [launch release dated
2025-06-28](https://slice.bank.in/documents/press/slice-super-card-press-release.pdf).

Corrections to the prior 2026-07-04 audit: the current MITC defines rewards as 1 monies per
INR1 eligible card spend, with cash redemption into a slice savings account at balance-based
rates of 1%, 1.5%, 2%, or conditional 3%; it does not specify a 2% UPI accelerator or an
INR500 monthly cap. The old 1% cashback model and fixed INR1 value were also inaccurate.
Current MITC sets forex markup to zero, monthly finance rate to 3.5% (42% APR), and joining/
annual fees to zero. It contains a bank-transfer charge of 2.5% (minimum INR25), which is
distinct from an ATM cash-advance fee. The prior 3.5% forex charge and 2.5%/INR300 cash
advance terms are unsupported by current MITC. Current MITC describes a 2% fuel surcharge
once cumulative cycle fuel spend exceeds INR25,000, so the old fuel surcharge waiver was
removed. It also lists fees for education, wallet, utility and rent categories.

The card's issue launch date is recorded from the issuer's 28-Jun-2025 announcement. Exact
network tier, numeric applicant age/income/bureau cutoffs, and a cash-advance fee remain
unpublished in the reviewed issuer material. The issuer states that 1 monies accrues per INR1
eligible card spend; redemption value varies by monies balance and, for the 3% tier, slice
savings-account average quarterly balance. The dataset schema cannot faithfully encode the
balance-conditioned rate tiers, so the conditions are preserved in reward notes. No PDFs
were downloaded or modified in this review.
