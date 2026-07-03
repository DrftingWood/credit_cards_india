# IDFC FIRST Bank — source verification (2026-07-04)

IDFC FIRST publishes per-card **"Communication" PDFs** under
`content/dam/idfcfirstbank/pdf/credit-card/<Card>-Credit-Card-Communication-*.pdf`.
Downloaded + read via pypdf.

## Corrections found (metal cards used per-Rs100; source says per-Rs150)
| Card | Field | Was | Source PDF |
| --- | --- | --- | --- |
| Ashva | reward per_inr | 100 | **150** ("reward points for every Rs150", 1 RP = Rs0.40) |
| Ashva | accel effective_rate | 9 | **10** ("up to 10 reward points for every Rs150") |
| Mayura | reward per_inr | 100 | **150** ("10 reward points for every Rs150", 1 RP = Rs0.50) |

Ashva joining Rs2,999 + 1% forex ✓; Mayura joining Rs5,999 + 0% forex ✓ (confirmed
from page JSON-LD/title). Reward points never expire on both. Other IDFC cards already
use per-Rs150 (classic/wealth/wow/select/power/first-private/etc.); indigo (BluChip
co-brand), hello-cashback (%), secured-rupay (FD) use their own models.
