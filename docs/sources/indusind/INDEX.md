# IndusInd Bank — source verification (2026-07-04)

**Finding: IndusInd publishes NO downloadable credit-card PDFs.** Checked the card
pages (`.../credit-card/<slug>.html`), the central **Schedule of Charges**
(`/personal/schedule-of-charges.html`), and the **Terms & Conditions** hub
(`/personal/terms-and-conditions.html`) — all serve fees/rewards/MITC as
JS-rendered HTML tables, not PDFs. Only 3 generic corporate PDFs exist site-wide.

Reward structures, forex markup (1.8% discounted), and the 2025 lounge/redemption
changes were already verified against the live card-page tabs during the 2026-07-03
audit (see `docs/indusind-audit.md`). Exact fee figures live in the HTML Schedule of
Charges tab.

**Implication:** "PDF verification" is not literally possible for IndusInd (and, so far,
Federal) — the authoritative source is HTML, not PDF.

## Re-verification (2026-07-04)
Spot-checked Legend against the live page via `textContent`: forex **1.8%** ✓,
base **1 RP/₹100 weekday + 2 RP/₹100 weekend** ✓ — matches the YAML. IndusInd's
reward/forex/lounge data was accurately captured from these same HTML tabs during
the 2026-07-03 audit; no corrections needed on the spot-check. Exact per-card fee
figures are not shown on the card pages (buried behind a JS "fees & charges" link)
and there is no downloadable MITC — recorded as HTML-sourced.
