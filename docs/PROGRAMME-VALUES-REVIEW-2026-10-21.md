# Programme unit values: review of the 19 co-brand cards (2026-10-21)

The owner decided on 2026-10-21 to pass full loyalty-programme data to the card
pages and `/calculator` (DECISIONS **D-27**). Before this, only `/recommend`
received the `programs` map. With it, `unitValueFor` values a card's points at
the programme's `unit_value_inr` instead of the card's own `base.unit_value_inr`
/ `unit_value_inr_realized`. Nineteen active cards link to a programme, and every
one of them would have changed value.

I checked each card against the repo's own sources and data: the card YAML and
its rewards `source` note, the programme YAML,
`docs/REMEDIATION_2026-07.md`, `docs/TRANSFER_PARTNERS.md`, and the card
schema's closed-loop rule. No outside research was done. Where the programme
value was clearly wrong, I fixed the programme file and cited the source in a
comment beside the value. bob-irctc is excluded from the change through a new
field. Values are ₹ per point, shown as realized / face.

## Outcome by card

| # | Card | Card's own value | Programme value before review | Value now (with programme data) | Outcome |
|---|---|---|---|---|---|
| 1 | `bob-irctc` | 0.18 / 0.25 | 0.95 / 1.00 | 0.18 / 0.25 | **Excluded**: card sets `unit_value_from_program: false` |
| 2 | `axis-indigo` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | **Programme fixed** (IndiGo BluChip) |
| 3 | `axis-indigo-premium` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 4 | `idfc-first-indigo` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 5 | `kotak-indigo` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 6 | `kotak-indigo-xl` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 7 | `sbi-indigo` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 8 | `sbi-indigo-elite` | 0.45 / 0.60 | 0.50 / 1.00 | 0.45 / 0.60 | Programme fixed (IndiGo BluChip) |
| 9 | `sbi-air-india-platinum` | 0.55 / 0.70 | 0.50 / 1.00 | 0.55 / 0.70 | **Programme fixed** (Air India Maharaja) |
| 10 | `sbi-air-india-signature` | 0.55 / 0.70 | 0.50 / 1.00 | 0.55 / 0.70 | Programme fixed (Air India Maharaja) |
| 11 | `hdfc-irctc-hdfc` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | **Programme fixed** (IRCTC) |
| 12 | `rbl-irctc` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (IRCTC) |
| 13 | `sbi-irctc-platinum` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (IRCTC) |
| 14 | `sbi-irctc-premier` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (IRCTC) |
| 15 | `hdfc-tata-neu-infinity` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | **Programme fixed** (Tata NeuCoins) |
| 16 | `hdfc-tata-neu-plus` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (Tata NeuCoins) |
| 17 | `sbi-tata-neu-infinity` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (Tata NeuCoins) |
| 18 | `sbi-tata-neu-plus` | 1.00 / 1.00 | 0.95 / 1.00 | 1.00 / 1.00 | Programme fixed (Tata NeuCoins) |
| 19 | `hdfc-marriott-bonvoy` | 0.55 / 0.80 | 0.55 / 0.85 | 0.55 / 0.85 | **Accepted** (face only; Absolute layer +₹960/yr on the test profile) |

Result: with programme data, the realized value (the Realistic layer and the
`/calculator` rank) stays the same for all 19 cards. The only change on the card
pages and `/calculator` is Marriott Bonvoy's face value in the Absolute layer.
The programme files now agree with the card values verified on 2026-07-05, so a
future programme edit reaches every linked card from one file.

## Why each group came out this way

**1. `bob-irctc`: the new value was clearly wrong, so the card is excluded.**
The card earns generic BOBCARD Reward Points, not IRCTC points. Its rewards
source note (bobcard.co.in IRCTC card page, retrieved 2026-07-05) says:
"earns GENERIC BOB Reward Points (Rs0.25), also redeemable on
statement/catalogue ... 4 BOB RP = 1 IRCTC travel point." The IRCTC programme
value (₹0.95-1.00 per IRCTC point) would have valued each BOB point about 4x too
high, which is ₹0.18 to ₹0.95. The link to `irctc-loyalty` can't be removed,
because the co-brand alias lint (D-16b) is error-tier. Instead, the rewards
record now sets a new schema field, `unit_value_from_program: false`, and
`unitValueFor` keeps the card's own values. Stacking is unaffected; the card has
none.

This was already live on `/recommend`, which always passed programme data.
bob-irctc was scored at ₹0.95 a point there. On a ₹20k online + ₹20k travel
profile its /recommend net falls from ₹19,600 to ₹3,430.

**2-8. IndiGo cards: the programme was stale.** `indigo-bluchip.yaml` (retrieved
2026-04-30) still had face 1.0 and realized 0.5. The 2026-07-05 remediation
lowered all seven IndiGo cards to 0.45 realized and 0.60 face. Sources:
`REMEDIATION_2026-07.md` ("IndiGo BluChip ₹1→0.45" and "IndiGo voucher rates
1.0→0.6"), and each card's rewards source note ("BluChip voucher rate corrected
1.0->0.6 to match floating value"). The programme file's own range is
₹0.40-0.60, with a "typical mid-route value near ₹0.41-0.50". So the programme
is set to face 0.60 (the top of its band) and realized 0.45.

**9-10. SBI Air India cards: the programme was stale.**
`air-india-flying-returns.yaml` (2026-04-30) predates Air India's April 2026
award-chart change. Both SBI cards' rewards sources (sbicard.com, verified
2026-07-05) read "Air India Maharaja (~Rs0.5-0.7 economy post Apr-2026 chart
...). Was face Rs1.0". `TRANSFER_PARTNERS.md` (verified 2026-07-05) gives 0.55,
"post-Apr-2026 revaluation". The programme is set to face 0.70 and realized
0.55.

**11-18. IRCTC and Tata Neu cards: the programme haircut breaks the closed-loop
rule.** All eight cards are `redemption_scope: closed-loop`. The card schema
says a closed-loop currency "is shown at full in-ecosystem value (realized =
face) rather than an arbitrary haircut; the restriction is conveyed by the
badge". Both programmes applied a 5% haircut (0.95):
- Tata Neu's haircut was unsourced. Its note says "refine if a sourced
  redemption-friction study lands".
- IRCTC's haircut came from the 50% refund on cancelled award tickets. That file
  is marked PROVISIONAL.

Every one of these cards' rewards sources was research-verified on 2026-07-05 at
₹1 a point (HDFC, RBL and SBI issuer pages; cardmaven.in for HDFC Tata Neu).
Both programmes are set to realized 1.0. The IRCTC cancellation rule stays in
the file as a constraint note.

**19. Marriott Bonvoy: accepted.** Realized is 0.55 on both sides. Face moves
from the card's 0.80 (retrieved 2026-04-15) to the programme's 0.85, which is
documented in `marriott-bonvoy.yaml` (TPG and Head for Points, 2026-04-30).
Neither number is clearly wrong. The difference only affects the Absolute
(face) layer.

## Two side effects outside the 19 point values

1. **Programme earn is kept out of the rank on card pages and `/calculator`.**
   Passing `programs` also switches on D-9 stacking: for `stacks_with_program`
   accelerators, the programme's member baseline, channel bonus and tier are
   added to the card's rate. That affects 4 IndiGo cards and Marriott Bonvoy.
   On a ₹20k online + ₹20k travel + ₹10k groceries + ₹5k dining profile, it
   would have lifted:
   - `kotak-indigo` from ₹3,900 to ₹16,860 (rank 169 to 36)
   - `idfc-first-indigo` from ₹3,911 to ₹16,871
   - `sbi-indigo` from ₹3,631 to ₹16,591
   - `kotak-indigo-xl` from ₹6,180 to ₹19,140
   - `hdfc-marriott-bonvoy` from ₹7,560 to ₹23,089 (rank 90 to 13)

   That member earn comes with programme membership whichever card pays, so it
   is the "4-5x overcredit" that D-8 removed. It also contradicts D-24, which
   keeps programme tier earn out of the rank. So card pages and `/calculator`
   pass `stackProgramEarn: false`: programme data sets unit values only. The
   user's declared tier still shows as its own ledger line (D-24), now through
   `ScoringContext.tierLine`. `/recommend` is unchanged and still stacks (D-9).
   That gap is an open question for the owner (see D-27).
2. **`/recommend` moves for these cards.** It always used programme values, so
   the programme corrections change it. On a ₹20k online + ₹20k travel profile,
   with each card's own channels selected:

| Card | /recommend net before | after |
|---|---|---|
| bob-irctc | ₹19,600 | ₹3,430 |
| IndiGo ×7 | e.g. kotak-indigo ₹17,700 | ₹15,780 (all about 10% lower: 0.50 to 0.45) |
| SBI Air India ×2 | ₹6,901 / ₹11,801 | ₹7,741 / ₹13,481 |
| IRCTC ×4 | e.g. sbi-irctc-premier ₹24,624 | ₹25,920 (+5%) |
| Tata Neu ×4 | e.g. sbi-tata-neu-infinity ₹21,375 | ₹22,500 (+5%) |
| hdfc-marriott-bonvoy | ₹21,329 | ₹21,329 |

## Checks

`site/lib/program-values.test.ts` pins this outcome on the live data. Every
active card linked to a programme must be one of these 19, with exactly the
realized and face values in the "Value now" column. A new linked card, or a
programme edit, fails the test until this review is updated.
