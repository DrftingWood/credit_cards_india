# travel-booking-savings

A small standalone model for the **holistic** cost of booking a trip — not "which card
earns most," but "what is the cheapest *total* way to book *this* trip," once you net out:

1. the cash **price** on each channel (cheapest aggregator vs bank portal vs OTA vs direct),
2. any instant **discount** / coupon,
3. the **value of rewards earned**, and
4. the **opportunity cost of any points burned**.

It lives in the `credit_cards_india` repo (under `booking-savings/`) but is *independent* of
the card dataset and its validate/build pipeline — it neither touches nor depends on the card
YAMLs. The dataset/engine answers "how good is a card." This answers "how should I actually book."

## The core identity

```
Net effective cost = price*(1-discount) - value_of_rewards_earned      (pay cash)
                   = points_used * point's_best_alternative_value      (pay with points)
```

Everything is measured against one baseline: the **cheapest aggregator cash price P**.
Portal / OTA prices are entered as a `markup` % over P.

## Two break-evens it makes concrete

- **Redeeming points on a marked-up portal:** effective value per point = `r / (1 + markup)`.
  If your points transfer for more than the portal's face rate, redeeming there is a *leak* —
  and burning transferable miles (worth ~₹2) to cover a ₹1 portal rate is the worst move on the board.
- **Booking cash on a portal for an accelerator:** worth the markup only while
  `markup < (k_portal - k_alt) / (1 - k_portal)`. A rich accelerator (SmartBuy 10X ≈ 33% back)
  tolerates a ~40%+ markup; a thin one (or spend beyond the 10X cap) tolerates only ~1–3%.

## Usage

```
python holistic.py
```

Edit the `PT` point-values and the `Method(...)` lists at the bottom with **your real quotes**
for the trip you're pricing. The markups in the examples (SmartBuy +3%, EDGE +5%, MMT +2%) are
placeholders — replace them with the actual price gap you see between the portal and the
cheapest aggregator, because that gap is the whole question.

## Caveats

- SmartBuy 10X is capped (~₹22,500/month at 33%, then 3.33%) — the model is cap-aware but the cap
  is monthly, so booking several things dilutes it.
- MMT myCash is closed-loop (spendable only on MakeMyTrip) — treat its value accordingly.
- Award bookings (transfer miles → book a partner award) are a *different* path not modelled here;
  this tool is about cash/points on retail travel prices.
