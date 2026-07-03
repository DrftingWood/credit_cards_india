# Kotak Mahindra Bank — source verification (2026-07-04)

Kotak serves fees/MITC as **HTML** (no PDFs): per-card `.../<slug>/fees-and-charges.html`,
central MITC `/credit-cards/mitc-and-ca.html`, and GSFC `/gsfc.html`. Reward tables and
fee tables are JS-rendered and partly resist text extraction.

## Correction found
- **League Platinum** — the card's own Fees & Charges page is titled *"No Joining &
  Annual Fees"* (Kotak League Platinum is lifetime-free). YAML had ₹499/₹499 → corrected
  to **₹0/₹0 (lifetime-free)**.

Reward structures for the Kotak cards were verified against the live pages during the
2026-07-03 audit (PR #42). The JS-rendered fee tables on the remaining cards could not be
fully machine-extracted on re-check; values are HTML-sourced.
