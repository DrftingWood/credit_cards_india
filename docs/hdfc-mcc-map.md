# HDFC — MCC → reward-rate map (2026-07-03)

Which Merchant Category Codes drive which reward rate on each HDFC card, extracted
from the archived source PDFs in `docs/sources/hdfc/`. Positive MCC sets are
written into the data as `accelerated[].mcc_list`; excluded-MCC sets are recorded
in each rewards record's `capping_rules` (see the note at the bottom).

## Key finding

**Most HDFC accelerators do NOT qualify by MCC.** The premium points cards
(Infinia, Regalia, Regalia Gold), the co-brand cards (Swiggy app tier, Tata Neu,
Shoppers Stop, IRCTC), and the portal/UPI tiers (SmartBuy, Scan & Pay) all
qualify by **merchant TID/MID, brand list, or channel** — not by MCC. So
`mcc_list` is populated only where a PDF genuinely lists codes. The richer,
more consistent MCC signal across cards is the **exclusion list** (codes that
earn nothing), which recurs card-to-card.

## Cards with positive MCC → rate mappings

### hdfc-diners-black
| Rate | MCCs |
| --- | --- |
| 2× weekend dining (10 pts/₹150) | `5812, 5813, 5814` |
Base & 10× SmartBuy: category/portal-gated (no MCCs).

### hdfc-diners-privilege
| Rate | MCCs |
| --- | --- |
| 5× Swiggy/Zomato dining (20 pts/₹200) | `5812, 5814` |
10× SmartBuy: portal-gated.

### hdfc-phonepe-uno
| Rate | MCCs |
| --- | --- |
| 2% PhonePe categories (recharge/utility/bills/travel) | `4111, 4112, 4511, 4722, 4784, 4814, 4899, 4900` |
| 1% select online brands | `4121, 4214, 5137, 5262, 5311, 5399, 5691, 5699, 5732, 5811, 5812, 5814` |
| 1% UPI Scan & Pay | all scan spends (no MCC set) |

### hdfc-phonepe-ultimo
| Rate | MCCs |
| --- | --- |
| 10% PhonePe categories | `4111, 4112, 4511, 4722, 4784, 4814, 4899, 4900` |
| 5% select online brands | `4121, 4214, 5137, 5262, 5311, 5399, 5691, 5699, 5732, 5811, 5812, 5814` |
| 1% Scan & Pay | all scan spends |

### hdfc-upi-rupay
| Rate | MCCs |
| --- | --- |
| 3% groceries/supermarket/dining/PayZapp | `5411, 5812, 5814` (+ PayZapp app) |
| 2% utilities | `4900` |
| 1% base | all other |

### hdfc-swiggy-hdfc / swiggy-ornge / swiggy-blck (5% online tier)
The Swiggy-app tier (10%/5%) is MID/TID-based (no MCCs). The **5% online** tier
carries a large eligible-MCC table (see `data/cards/hdfc/swiggy-*.yaml`
`accelerated[].mcc_list`). Example (swiggy-hdfc, 82 codes):
`5137, 5139, 5611, 5621, 5631, 5641, 5651, 5655, 5661, 5691, 5697, 5699, 5948, 5200, 5300, 5311, 5331, 5949, 5973, 1731, 5045, 5046, 5065, 5099, 5722, 5732, 5734, 5946, 7372, 7622, 7623, 7629, 7631, 4411, 4899, 5193, 5992, 7032, 7033, 7333, 7832, 7911, 7922, 7929, 7933, 7991, 7996, 7997, 5198, 5211, 5231, 5251, 5712, 5713, 5714, 5718, 5719, 5950, 7641, 5122, 5912, 5975, 8042, 8043, 5977, 7230, 7297, 7298, 4121, 4111, 5511, 5521, 7512, 5192, 5733, 5735, 5941, 5942, 5945, 5995, 7829, 7941, 5399, 5411`

### hdfc-millennia / hdfc-pixel-play (partial)
| Card / rate | MCCs |
| --- | --- |
| millennia 5% online (10 merchants) | `4121` (Uber only; other 9 merchants MID/TID-based) |
| pixel-play 5% self-selected packs | `4121, 7512` (Uber travel pack; other packs MID/TID-based) |

## Excluded-MCC sets (earn zero — currently in `capping_rules`)

| Card(s) | Excluded MCCs |
| --- | --- |
| upi-rupay | `6540` |
| irctc-hdfc | `5816` (gaming), `6540` (wallet/prepaid) |
| tata-neu-plus | `5816` (gaming) |
| millennia, moneyback-plus, freedom | `6540` + education `8211, 8220, 8241, 8244, 8249, 8299` |
| freedom (capped, not excluded) | utility `4900`, telecom `4812, 4814, 4899` — capped 2,000 CP/mo |
| shoppers-stop-black | rent `6513`; fuel `1361, 5172, 5541, 5542, 5983, 9752` |
| pixel-play, pixel-go | `1361, 5172, 5541, 5542, 5983, 9752, 6513, 6540, 7349, 9211, 9222, 9223, 9311, 9399, 9402, 9405, 9950` |
| swiggy-ornge, swiggy-blck | `5172, 5541, 5542, 5983, 6513, 6540, 5094, 5944, 9211, 9222, 9223, 9311, 9399, 9402, 9405, 9950, 5947, 5816, 8211, 8220, 8241, 8244, 8249, 8299` |

## Cards with no MCC data in their PDFs

infinia, regalia, regalia-gold, diners-rewardz (category/TID-gated); shoppers-stop
(TID-gated, category-only exclusions); tata-neu-infinity, marriott-bonvoy, indianoil
(only shared MITC archived); 6e-rewards, 6e-rewards-xl (discontinued, pages 404).

## Structural note

Positive MCCs live in `accelerated[].mcc_list` (machine-readable). **Excluded
MCCs currently live as freeform strings in `capping_rules`** because the schema's
`exclusions[]` is a category enum, not an MCC list, and `base` has no MCC/cap
fields. To make exclusions and base caps calculator-usable, the schema needs a
structured `mcc_exclusions` field and optional `base` caps — tracked as a
proposed follow-up schema change (see the structure review).
