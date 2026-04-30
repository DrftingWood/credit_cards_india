#!/usr/bin/env python3
"""Bulk-scaffold compliant card YAMLs from a Python list of dicts.

This is for the catalog-expansion pass — each spec produces a valid
schema-conforming YAML that passes scripts/validate.py. Authors are
expected to refine accelerators / benefits afterwards; this gets the
basic shell in place with sourced fees / base rate.
"""
from __future__ import annotations

import sys
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
TODAY = date.today().isoformat()


def render(spec: dict) -> str:
    issuer = spec["issuer"]
    slug = spec["slug"]
    name = spec["name"]
    network = spec.get("network", "visa")
    network_tier = spec.get("network_tier")
    tier = spec.get("tier", "mid")
    status = spec.get("status", "active")
    co_brand = spec.get("co_brand")
    launched_on = spec.get("launched_on")
    discontinued_on = spec.get("discontinued_on")

    joining_fee = spec.get("joining_fee_inr", 0)
    annual_fee = spec.get("annual_fee_inr", 0)
    fee_waiver = spec.get("fee_waiver")  # {spend_inr, cycle}
    forex = spec.get("forex_markup_pct", 3.5)
    fin_charge = spec.get("finance_charge_monthly_pct", 3.5)

    currency = spec.get("currency", "points")
    currency_name = spec.get("currency_name")
    base_rate = spec.get("base_rate", 1)
    base_per_inr = spec.get("base_per_inr", 100)
    base_unit_value = spec.get("unit_value_inr", 0.25)
    realized = spec.get("unit_value_inr_realized")

    accelerated = spec.get("accelerated", [])
    exclusions = spec.get("exclusions", ["fuel", "wallet-loads", "rent", "emi"])

    lounge_access = spec.get("lounge_access")  # {domestic, international}
    welcome = spec.get("welcome", [])
    fuel_waiver = spec.get("fuel_surcharge_waiver")

    eligibility = spec.get("eligibility", {})
    income_salaried = eligibility.get("salaried")
    income_self = eligibility.get("self_employed")
    min_age = eligibility.get("min_age", 21)
    max_age = eligibility.get("max_age", 60)
    cs_min = eligibility.get("credit_score_min")

    apply_url = spec.get("apply_url")
    source_url = spec["source_url"]
    notes = spec.get("notes", "")
    tags = spec.get("tags", [])

    out = []
    e = out.append
    issuer_yaml = f'"{issuer}"' if issuer in ("yes", "no", "on", "off", "true", "false") else issuer
    e(f"id: {issuer}-{slug}")
    e(f"name: {name}")
    e(f"issuer: {issuer_yaml}")
    e(f"network: {network}")
    if network_tier:
        e(f"network_tier: {network_tier}")
    else:
        e("network_tier: null")
    e(f"tier: {tier}")
    e("card_type: credit")
    if co_brand:
        e("co_brand:")
        e(f"  partner: {co_brand['partner']}")
        e(f"  category: {co_brand['category']}")
        if co_brand.get("partner_website"):
            e(f"  partner_website: {co_brand['partner_website']}")
    else:
        e("co_brand: null")
    e(f"status: {status}")
    e(f"launched_on: {launched_on or 'null'}")
    e(f"discontinued_on: {discontinued_on or 'null'}")
    e("")

    # Fees
    e("fees:")
    e(f"  - effective_from: {launched_on or '2024-01-01'}")
    e("    effective_until: null")
    e(f"    joining_fee_inr: {joining_fee}")
    e(f"    annual_fee_inr: {annual_fee}")
    if fee_waiver:
        e("    fee_waiver:")
        e(f"      spend_inr: {fee_waiver['spend_inr']}")
        e(f"      cycle: {fee_waiver.get('cycle', 'annual')}")
    else:
        e("    fee_waiver: null")
    e(f"    forex_markup_pct: {forex}")
    e(f"    finance_charge_monthly_pct: {fin_charge}")
    e("    cash_advance_fee:")
    e("      pct: 2.5")
    e("      min_inr: 500")
    e("    gst_applicable: true")
    e("    source:")
    e(f"      url: {source_url}")
    e(f"      retrieved_on: {TODAY}")
    e("")

    # Rewards
    e("rewards:")
    e(f"  - effective_from: {launched_on or '2024-01-01'}")
    e("    effective_until: null")
    e(f"    currency: {currency}")
    if currency_name:
        e(f"    currency_name: {currency_name}")
    else:
        e("    currency_name: null")
    e("    base:")
    e(f"      rate: {base_rate}")
    e(f"      per_inr: {base_per_inr}")
    e(f"      unit_value_inr: {base_unit_value}")
    if realized is not None:
        e(f"      unit_value_inr_realized: {realized}")
    if accelerated:
        e("    accelerated:")
        for a in accelerated:
            e(f"      - category: {a['category']}")
            if a.get("canonical_categories"):
                cats = ", ".join(a["canonical_categories"])
                e(f"        canonical_categories: [{cats}]")
            e(f"        multiplier: {a.get('multiplier', 1)}")
            if "effective_rate" in a:
                e(f"        effective_rate: {a['effective_rate']}")
            cap = a.get("cap_per_cycle", "unlimited")
            if cap == "unlimited":
                e(f'        cap_per_cycle: "unlimited"')
            else:
                e(f"        cap_per_cycle: {cap}")
            e(f"        cap_unit: {a.get('cap_unit', 'points')}")
            e(f"        cycle: {a.get('cycle', 'monthly')}")
            if a.get("notes"):
                e(f'        notes: "{a["notes"]}"')
    else:
        e("    accelerated: []")
    if exclusions:
        excl_str = "\n".join(f"      - {x}" for x in exclusions)
        e("    exclusions:")
        for x in exclusions:
            e(f"      - {x}")
    e("    source:")
    e(f"      url: {source_url}")
    e(f"      retrieved_on: {TODAY}")
    e("")

    # Benefits
    e("benefits:")
    e(f"  - effective_from: {launched_on or '2024-01-01'}")
    e("    effective_until: null")
    if lounge_access:
        e("    lounge_access:")
        if lounge_access.get("domestic"):
            d = lounge_access["domestic"]
            e("      domestic:")
            v = d["visits_per_cycle"]
            if v == "unlimited":
                e('        visits_per_cycle: "unlimited"')
            else:
                e(f"        visits_per_cycle: {v}")
            e(f"        cycle: {d.get('cycle', 'annual')}")
            if d.get("via"):
                via_str = ", ".join(d["via"])
                e(f"        via: [{via_str}]")
        if lounge_access.get("international"):
            i = lounge_access["international"]
            e("      international:")
            v = i["visits_per_cycle"]
            if v == "unlimited":
                e('        visits_per_cycle: "unlimited"')
            else:
                e(f"        visits_per_cycle: {v}")
            e(f"        cycle: {i.get('cycle', 'annual')}")
            if i.get("via"):
                via_str = ", ".join(i["via"])
                e(f"        via: [{via_str}]")
    else:
        e("    lounge_access: null")
    if welcome:
        e("    welcome:")
        for w in welcome:
            if w.get("condition"):
                e(f'      - condition: "{w["condition"]}"')
                e(f'        benefit: "{w["benefit"]}"')
            else:
                e(f'      - benefit: "{w["benefit"]}"')
            if w.get("value_inr"):
                e(f"        value_inr: {w['value_inr']}")
    if fuel_waiver:
        e("    fuel_surcharge_waiver:")
        e(f"      pct: {fuel_waiver.get('pct', 1.0)}")
        e(f"      min_txn_inr: {fuel_waiver.get('min_txn_inr', 400)}")
        e(f"      max_txn_inr: {fuel_waiver.get('max_txn_inr', 5000)}")
        if fuel_waiver.get("cap_per_cycle_inr"):
            e(f"      cap_per_cycle_inr: {fuel_waiver['cap_per_cycle_inr']}")
        e(f"      cycle: {fuel_waiver.get('cycle', 'monthly')}")
    e("    concierge: false")
    e("    source:")
    e(f"      url: {source_url}")
    e(f"      retrieved_on: {TODAY}")
    e("")

    # Eligibility
    e("eligibility:")
    e(f"  min_age: {min_age}")
    e(f"  max_age: {max_age}")
    e("  income_inr_annual:")
    e(f"    salaried: {income_salaried if income_salaried is not None else 'null'}")
    e(f"    self_employed: {income_self if income_self is not None else 'null'}")
    e(f"  credit_score_min: {cs_min if cs_min is not None else 'null'}")
    e("  residency: resident-indian")
    e("")

    if apply_url:
        e("application:")
        e(f"  apply_url: {apply_url}")
        e("")

    e("metadata:")
    e(f"  last_verified_on: {TODAY}")
    if tags:
        tag_str = ", ".join(tags)
        e(f"  tags: [{tag_str}]")
    return "\n".join(out) + "\n"


def write_card(spec: dict) -> Path:
    out = ROOT / "data" / "cards" / spec["issuer"] / f"{spec['slug']}.yaml"
    if out.exists():
        print(f"skip (exists): {out.relative_to(ROOT)}")
        return out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(spec), encoding="utf-8")
    print(f"created: {out.relative_to(ROOT)}")
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: bulk_scaffold.py <python_file_with_SPECS_list>")
        sys.exit(2)
    ns = {}
    exec(Path(sys.argv[1]).read_text(encoding="utf-8"), ns)
    specs = ns.get("SPECS", [])
    for s in specs:
        write_card(s)
    print(f"\nTotal: {len(specs)} cards processed.")
