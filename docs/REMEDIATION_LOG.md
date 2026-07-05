# Remediation log

Append one line per unit of work. Driven by the `cc-remediate` skill (`/loop /cc-remediate`).
Format: `date | item/scenario | what changed | commit | notes`

2026-07-05 | flaw#1 floor audit | audited 319 cards; reframed (not broadly broken) | 9280d66 | Category A left as-is
2026-07-05 | flaw#1 Category B | 4 outliers fixed (OneCard/EazyDiner/SC-EaseMyTrip/Times Black) | 91c7061 |
2026-07-05 | flaw#1 Category C | 22 missing realized populated; 3 Vistara discontinued | fbe0ed5 |
2026-07-05 | flaw#2 EDGE Reward Points | uniform ₹0.18 floor; fixed Reserve/indianoil/LIC errors | 1883d93 |
2026-07-05 | flaw#3 EDGE Miles stragglers | indianoil-premium + olympus ₹0.5→₹1.0 | e81aa88 |
2026-07-05 | flaw#6 low-confidence | SC Rewards ₹0.25, Regalia KrisFlyer-only, Emeralde no-6:1 | cf710af |
2026-07-05 | scenario B (nominal inflation) | Scapia cards ₹1.0→₹0.20 coin (5x error) | 12d970c | user-flagged
2026-07-05 | scenario B/D | audited face≥0.5; found Scapia-class suspects (adani-signature, ixigo, apollo-select, phonepe-ultimo, irctc-platinum, SC-beyond, Uni, AU cheq/kosmo/paytm) | (verifying) | in TODO
2026-07-05 | scenario B (nominal inflation) | 13 cards value-fixed (Uni 100x, ixigo/cheq/kosmo/paytm, Adani, Apollo, phonepe-ultimo, SC-beyond) | 1f1d3f4 | Uni earn scaled x100
2026-07-05 | TODO: SC Rewards earn-rate | base 1/150 -> 4/150 retail | 7686ae4 |
2026-07-05 | flaw#5 co-brand | SBI Club Vistara x2 discontinued (Vistara defunct) | 9e0e770 |
2026-07-05 | scenario D (cross-card consistency) | found SC 360 RP spread (0.25/0.5/1.0) + ICICI RP (0.25/1.0=expected) | - | 2 verify agents launched (airline co-brand values + SC lineup)
2026-07-05 | flaw#5 co-brand airline | 18 cards: KrisFlyer/Emirates/Etihad/AirIndia UP from ~0.2, IndiGo BluChip DOWN from 1.0, SpiceClub 0.4 | 34f071d | reopens Rs5L verdict
2026-07-05 | scenario D SC 360 lineup | 4 cards ->Rs0.25, priority-visa-infinite ->Rs1.0 | 4aa6ac2 |
2026-07-05 | scenario C (internal consistency) | 10 cards: IndiGo voucher 1.0->0.6 x7 (stale), face raised to ceiling x3 | 1b6bb39 |
2026-07-05 | scenario E (sibling) | sbi/apollo 1.0/0.5, irctc-platinum realized 0.9; flagged IRCTC family + 8 obscure RP cards | 7692db7 |
2026-07-05 | scenario G (5L replay) | verdict shifted: KrisFlyer -0.6%->+3.95%, Etihad ->3.6% (were undervalued); Ixigo 7%->2.8%, EaseMyTrip 5%->2.5% (were overvalued). Diners Black still #1. | - | analysis capstone
2026-07-05 | scenarios F+H | CLEAN: 0 base-60 ratio bugs, 0 malformed transfer_ratios, 0 missing provenance (319/319). Value scenarios A-H effectively dry. | - | 1 dry pass; IRCTC/obscure-RP verify agent launched
