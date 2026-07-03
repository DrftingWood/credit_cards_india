# OneCard — audit + verification (2026-07-03)

Review of OneCard (FPL Technologies) against the live **getonecard.app** site
(Playwright + DOM extraction), 2026-07-03.

## About the issuer
OneCard is a fintech brand operated by **FPL Technologies**; the physical card is
**co-issued on partner-bank rails** (BoB / IDFC First / Federal / SBM / South Indian
Bank) depending on the applicant. It is marketed as a single unified product, so the
dataset models one card (`onecard-metal`) rather than one per partner bank.

## Findings
- **No `.bank.in` question** — OneCard is a fintech, not a scheduled bank; it stays on
  `getonecard.app` / `onecard.io`. Added `onecard` to the validator's
  `ISSUER_ALLOWED_DOMAINS` (was absent).
- **OneCard Metal — verified accurate against live:**
  - Lifetime-free (no joining / annual / reward-redemption fees) ✓
  - **5X reward points on your top 2 spend categories each month** (auto-selected) + 1X
    base (1 point per ₹50); 1 point = ₹1 on in-app redemption ✓
  - ~1% forex markup; app-first lifecycle; premium metal body ✓
  - Domestic lounge unlocked on ₹50,000 quarterly spend ✓
  - Added universal rent-MCC 6513; bumped verification dates.

## MCC pass
Rent (MCC 6513) excluded from reward accrual (in addition to fuel, wallet-loads,
insurance-premiums, EMI).

## Scope
Single product — no additional OneCard variants to add (the partner-bank rails are the
same consumer product, not distinct cards).
