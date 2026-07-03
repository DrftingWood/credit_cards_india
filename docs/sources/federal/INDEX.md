# Federal Bank — source verification (2026-07-03)

Federal Bank publishes its **Credit Cards MITC as an inline HTML page**
(`/credit-cards-mitc`), **not** as downloadable per-card PDFs. Verification was
therefore done against the central MITC fee/charges table (columns:
**Signet / Imperio / Celesta / Wave**).

## Corrections applied from the MITC table
| Card | Field | Was | MITC (corrected) |
| --- | --- | --- | --- |
| Signet | annual/joining fee | ₹999 | **₹750** |
| Signet | forex markup | 1.5% | **3.5%** |
| Imperio | annual/joining fee | ₹1,000 | **₹1,500** |
| Imperio | forex markup | 1.5% | **3.5%** |
| Celesta | forex markup | 1.5% | **2.0%** |

Celesta annual fee ₹3,000 confirmed. Cash-advance limits per MITC: Signet 10% /
Imperio 20% / Celesta 25% of credit limit.

## Note
The MITC lists a **"Wave"** column (RuPay Wave, ₹199) — excluded from the card set
during the audit as a floater/companion (shares the primary card's limit), but it
does carry its own ₹199 fee per MITC. Scapia is co-issued via the Scapia app
(scapia.cards), not on Federal's site.
