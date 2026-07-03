# ICICI Bank — MCC → reward-rate map (2026-07-03)

How Merchant Category Codes affect rewards on ICICI cards, extracted from the
archived PDFs in `docs/sources/icici/`.

## Key finding

**ICICI defines reward eligibility mostly by category/merchant on the web page,
not by MCC in its PDFs.** Unlike HDFC (rich per-card MCC tables), only the shared
MITC and a couple of card T&Cs (amazon-pay, emeralde-private-metal) enumerate MCCs.
So `mcc_list` on accelerators is largely not applicable here; the machine-readable
MCC signal is the **universal exclusion** and the **fee/restricted-category** map.

## Universal rule (all ICICI cards)

- **Rent — MCC `6513` earns ZERO reward points on every ICICI card** (MITC:
  *"No reward point will be extended for the transaction routed from 6513 MCC for
  all credit cards"*). Added to every active card's `rewards[].mcc_exclusions`.

## Fee / restricted-category MCCs (MITC — a 1% fee, not necessarily zero rewards)

| Category | MCCs | Rule |
| --- | --- | --- |
| Rent | `6513` | 1% fee **+ zero rewards** (all cards) |
| Fuel (surcharge) | `1361, 5172, 5541, 5542, 5983, 9752, 5555, 3851` | 1% fee on fuel > ₹10,000 |
| Utilities | `4899, 4900, 4901, 4814, 4821` | 1% fee on > ₹50,000 |
| Transportation | `4111, 4112, 4784, 4131` | 1% fee on > ₹50,000 |
| Education (3rd-party apps) | `8211, 8220, 8241, 8244, 8249, 8299, 8493, 8494, 7911` | 1% fee |
| Skill-based gaming | `5816` | 1% fee |
| Wallet load | `6540` | 1% fee on ≥ ₹5,000 |

These are **fees**, not reward exclusions (except rent 6513), so they're documented
here rather than written into `mcc_exclusions`.

## Card-specific MCC data

### amazon-pay (`tc-for-amazon-pay-credit-card.txt`)
Classifies "restricted categories" by MCC (these earn the base 1%, not the 5%/3%/2%
Amazon/partner tiers): Utility/Insurance `4899,4900,4901,3887,4897,5416,5417,4812,
4813,4814,4815,4821,4896,4902,3886,5960,6300,6381,6399`; Grocery/Dept `3333,5411,
5412,5441,9751,5311,5331,5499`; Rent `7014,7407,5271,6513`; Government `6760,9222,
9211,9399,9402,9405`; Fuel `1361,3851,5172,5541,5542,5983,9752,5555`; Education
`8211,8220,8241,8244,8249,8299,8493,8494,7911`; Gaming `5816`; Wallet `6540`;
Transport `4111,4112,4784,4131`; Tax `9311,9313`.

### emeralde-private-metal (`metal-gifts-tc-website-51023.txt`)
Reward points are **capped** (not zeroed) for two MCC groups (kept in the card's
`capping_rules`): grocery/utilities/insurance/rent/govt cluster
(`7014,7407,5271,6513,6760,9222,9211,9399,9402,9405,9313,9311,1361,3851,5172,5541,
5542,5983,9752,5555,7276,1520,1750,1740,1711,1761,1771,1731,6540`) and utilities/
education cluster (`4899,4900,4901,3887,4897,5416,5417,4812,4813,4814,4815,4821,
4896,4902,3886,8211,8220,8241,8244,8249,8299,8493,8494,7911`) — each capped at
~1,000 RP/category/cycle.

## What was written to the data

`rewards[].mcc_exclusions: ["6513"]` added to all 22 active ICICI cards (the one
universal zero-reward MCC). The calculator already consumes `mcc_exclusions`. Other
MCC groups are fee/cap rules, documented above and (for emeralde-private-metal) kept
in `capping_rules`.
