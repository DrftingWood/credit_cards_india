# slice — audit + verification (2026-07-03)

Review of slice (slice Small Finance Bank) against the live **slice.bank.in** site,
2026-07-03.

## Findings
1. **Domain migration.** `sliceit.com` **redirects to `slice.bank.in`** — the 11th
   `.bank.in` migration this audit run. slice became a **Small Finance Bank** after
   merging with North East Small Finance Bank, so it now carries a `.bank.in` domain.
   Added `slice` to the validator's `ISSUER_ALLOWED_DOMAINS` (sliceit.com + slice.bank.in).
2. **slice UPI RuPay Credit Card — verified accurate:**
   - Lifetime-free, fully app-managed lifecycle.
   - RuPay credit card linked to UPI (GPay / PhonePe / Paytm scan-and-pay).
   - 1% base cashback + 2% cashback on UPI-QR spends (capped ₹500/month).
   - Re-sourced to slice.bank.in; added universal rent-MCC 6513; bumped dates.

## Scope
The pre-2024 "slice super card" was a PPI-linked BNPL product (excluded — not a
credit card). This entry tracks the post-merger RuPay credit card, which is slice's
current single consumer credit product.

## MCC pass
Rent (MCC 6513) excluded from cashback accrual (in addition to fuel, wallet-loads,
rent, EMI).
