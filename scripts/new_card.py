#!/usr/bin/env python3
"""Scaffold a new card YAML with today's `retrieved_on` and TODO markers.

Usage:
    python scripts/new_card.py <issuer_slug> <card_slug> "<Full card name>"

Example:
    python scripts/new_card.py hdfc millennia "HDFC Bank Millennia Credit Card"
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = """id: {issuer}-{slug}
name: {name}
issuer: {issuer}
network: visa                 # TODO: visa | mastercard | rupay | amex | diners
network_tier: null            # TODO: set to a tier declared on the network
tier: mid                     # TODO: entry | mid | premium | super-premium | invite-only
card_type: credit
co_brand: null
status: active
launched_on: null
discontinued_on: null

fees:
  - effective_from: {today}   # TODO: actual launch or last-revision date
    effective_until: null
    joining_fee_inr: 0        # TODO
    annual_fee_inr: 0         # TODO
    fee_waiver: null
    forex_markup_pct: null
    finance_charge_monthly_pct: null
    cash_advance_fee: null
    gst_applicable: true
    source:
      url: https://TODO
      retrieved_on: {today}

rewards:
  - effective_from: {today}
    effective_until: null
    currency: points          # TODO: points | cashback | miles
    currency_name: null
    base:
      rate: 1                 # TODO
      per_inr: 100             # TODO
      unit_value_inr: null
    accelerated: []
    exclusions: []
    redemption: []
    source:
      url: https://TODO
      retrieved_on: {today}

benefits:
  - effective_from: {today}
    effective_until: null
    lounge_access: null
    source:
      url: https://TODO
      retrieved_on: {today}

eligibility:
  min_age: 21
  max_age: 60
  income_inr_annual:
    salaried: null
    self_employed: null
  credit_score_min: null
  residency: resident-indian

application:
  apply_url: null

metadata:
  last_verified_on: {today}
  maintainers: []
  tags: []
"""


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__, file=sys.stderr)
        return 2
    _, issuer, slug, name = argv

    issuer_file = ROOT / "data" / "issuers" / f"{issuer}.yaml"
    if not issuer_file.exists():
        print(f"error: issuer '{issuer}' not seeded. Add {issuer_file.relative_to(ROOT)} first.", file=sys.stderr)
        return 2

    out_dir = ROOT / "data" / "cards" / issuer
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}.yaml"
    if out_path.exists():
        print(f"error: {out_path.relative_to(ROOT)} already exists.", file=sys.stderr)
        return 2

    content = TEMPLATE.format(issuer=issuer, slug=slug, name=name, today=date.today().isoformat())
    out_path.write_text(content, encoding="utf-8")
    print(f"Created {out_path.relative_to(ROOT)}. Fill in the TODOs, then run scripts/validate.py.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
