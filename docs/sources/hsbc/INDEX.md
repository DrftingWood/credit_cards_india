# HSBC India — source verification (2026-07-04)

HSBC serves card fees/rewards as HTML on the product pages (hsbc.co.in); values are
in-page text (extractable via textContent). No per-card PDFs found on the product page.

## Correction found
- **Premier** — page states *"joining fee of INR 12,000 (paid after you activate) + annual
  renewal fee INR 20,000 (waived if you meet HSBC Premier eligibility)."* YAML had joining
  ₹0 → corrected to **₹12,000**; annual ₹20,000 confirmed; forex 0.99% confirmed.

Live/Visa-Platinum/RuPay etc. verified during the audit (PR #48, incl. the 12X-travel /
1:1-airmiles corrections). TravelOne/Taj fees carried # TODO earlier — resolved to
tier-standard during cleanup; exact figures per MITC remain HTML-sourced.
