# Axis Bank — MCC → reward map (2026-07-03)

How Merchant Category Codes affect rewards on Axis cards, from the archived card
T&C + MITC PDFs in `docs/sources/axis/` (local-only).

## Universal rule (all Axis cards)

- **Rent — MCC `6513`**: a 1% rent surcharge fee applies and the transaction is
  reward-excluded on every Axis card (MITC + card T&Cs). Added to every active
  card's `rewards[].mcc_exclusions`.

## Common Axis reward-exclusion MCC set

Axis's EDGE-points card T&Cs (e.g. Magnus, IndianOil Premium) state that spends on
these MCCs earn **no base or accelerated points**:

| Category | MCCs |
| --- | --- |
| Insurance | `6300, 6381, 5960, 6012, 6051` |
| Fuel | `5541, 5542, 5983` |
| Gold / Jewellery | `5094, 5944` |
| Wallet load | `6540` |
| Rent | `6513` |

IndianOil-Premium additionally lists transport/utility MCCs `4111, 4121, 4131,
4784, 4814, 4816, 4899, 4900` in its excluded set. These are recorded per-card in
the category-level `exclusions[]` (fuel, insurance-premiums, rent, wallet-loads,
utilities, jewellery, …) which the verification pass populated from each T&C.

## Card-specific MCC tables

- **cashback** (`axis-bank-cashback-credit-card-tnc.txt`): defines both the online
  categories eligible for 7% cashback and a large **excluded-MCC table** (education
  `3000–30xx` airline codes, insurance/quasi-cash `4011,4214,4411,4582,4723,4761,
  4789,7523,7524`, etc.). The 7% online cap is ₹4,000/statement.
- **magnus / reserve / atlas**: insurance/fuel/gold MCCs excluded from base &
  accelerated EDGE points (set above).
- **indianoil-premium**: fuel earn is by IOCL merchant, with the transport/utility
  MCC set excluded from bonus points.
- **shoppers-stop**: First Citizen points exclude the standard Mastercard/Visa
  excluded-MCC set.

## What was written to the data

`rewards[].mcc_exclusions: ["6513"]` added to all 39 active Axis cards (the one
universal reward-exclusion MCC; the calculator consumes it). The broader
insurance/fuel/gold set is captured per-card via category `exclusions[]` (populated
during verification) and documented above; it isn't written as numeric
`mcc_exclusions` on every card because the category-level exclusions already model
"these categories earn nothing" for the calculator.

## Note

Axis, like ICICI, keeps most **positive** reward eligibility at the category/merchant
level rather than per-MCC accelerator tables, so `accelerated[].mcc_list` is largely
not applicable; the machine-readable MCC signal is the exclusion set.
