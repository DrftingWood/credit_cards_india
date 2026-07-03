# YES Bank — source verification (2026-07-04)

YES links a central MITC + T&C + per-card PDFs via `yes.bank.in/pdf?name=...` (session-gated; not directly curl-able). Fees/rewards are also rendered in-page (textContent-readable).

## Verified
- **Marquee**: page states Membership Fee **INR 9,999** + renewal INR 4,999 -- matches YAML.

All 28 YES cards were verified against the live pages during the thorough audit (PR #46), which applied real corrections (Reserv 24/12/6 model + fee 2499 + rename, SELECT/ACE renames, Prosperity cashback family, AI-Inside/Wellness/PaisaSave/BYOC + fintech co-brands). Reward/fee figures are page-sourced; exact caps on the cashback cards remain in the MITC.
