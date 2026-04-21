#!/usr/bin/env python3
"""Compile the YAML dataset into consumer-friendly JSON artifacts under dist/.

Produces:
    dist/cards.json       — array of enriched card objects (issuer + network embedded,
                            current fee/reward/benefit records surfaced, computed values)
    dist/issuers.json     — array of issuers
    dist/networks.json    — array of networks
    dist/index.json       — summary metadata (counts, group-by-issuer/network/tier, tag vocabulary)

Designed for site/API consumption. Run after scripts/validate.py passes.

Usage:
    python scripts/build.py [--out dist]
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"


def _normalize(value: Any) -> Any:
    """Convert YAML-parsed date/datetime into ISO strings so the output is pure JSON."""
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _normalize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_normalize(v) for v in value]
    return value


def load_yaml(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return _normalize(yaml.safe_load(f))


def load_many(dir_path: Path) -> dict[str, dict]:
    return {doc["id"]: doc for doc in (load_yaml(p) for p in sorted(dir_path.glob("*.yaml")))}


def open_record(records: list[dict]) -> dict | None:
    """Return the effective-dated record whose effective_until is null."""
    for rec in records or []:
        if rec.get("effective_until") in (None, "null"):
            return rec
    return None


def compute_headline_rate_pct(current_rewards: dict | None) -> float | None:
    """Rough best-case effective-return percentage from the base rate.

    base: rate <units> per per_inr, unit_value_inr INR per unit
    -> pct = (rate * unit_value_inr / per_inr) * 100
    """
    if not current_rewards:
        return None
    base = current_rewards.get("base") or {}
    rate = base.get("rate")
    per_inr = base.get("per_inr")
    unit_value = base.get("unit_value_inr")
    if rate is None or not per_inr or unit_value is None:
        return None
    try:
        return round((float(rate) * float(unit_value) / float(per_inr)) * 100, 4)
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def enrich_card(card: dict, issuers: dict[str, dict], networks: dict[str, dict]) -> dict:
    issuer = issuers.get(card.get("issuer"))
    network = networks.get(card.get("network"))
    current_fees = open_record(card.get("fees", []))
    current_rewards = open_record(card.get("rewards", []))
    current_benefits = open_record(card.get("benefits", []))

    annual_fee = (current_fees or {}).get("annual_fee_inr")
    joining_fee = (current_fees or {}).get("joining_fee_inr")
    fee_waiver = (current_fees or {}).get("fee_waiver")

    return {
        **card,
        "issuer_detail": issuer,
        "network_detail": network,
        "current_fees": current_fees,
        "current_rewards": current_rewards,
        "current_benefits": current_benefits,
        "computed": {
            "is_active": card.get("status") in ("active", "invite-only"),
            "is_invite_only": card.get("status") == "invite-only",
            "is_lifetime_free": annual_fee == 0 and joining_fee == 0,
            "has_fee_waiver": fee_waiver is not None,
            "fee_waiver_spend_inr": (fee_waiver or {}).get("spend_inr"),
            "primary_reward_currency": (current_rewards or {}).get("currency"),
            "headline_rate_pct": compute_headline_rate_pct(current_rewards),
            "has_domestic_lounge": bool(((current_benefits or {}).get("lounge_access") or {}).get("domestic")),
            "has_international_lounge": bool(((current_benefits or {}).get("lounge_access") or {}).get("international")),
            "co_brand_partner": (card.get("co_brand") or {}).get("partner"),
            "co_brand_category": (card.get("co_brand") or {}).get("category"),
        },
    }


def build_index(cards: list[dict], issuers: dict, networks: dict) -> dict:
    tiers = Counter(c["tier"] for c in cards)
    statuses = Counter(c["status"] for c in cards)
    by_issuer = Counter(c["issuer"] for c in cards)
    by_network = Counter(c["network"] for c in cards)
    by_reward_currency = Counter(
        (c.get("computed") or {}).get("primary_reward_currency")
        for c in cards
        if (c.get("computed") or {}).get("primary_reward_currency")
    )

    all_tags: Counter[str] = Counter()
    for c in cards:
        for tag in (c.get("metadata") or {}).get("tags", []):
            all_tags[tag] += 1

    active = sum(1 for c in cards if (c.get("computed") or {}).get("is_active"))
    invite_only = sum(1 for c in cards if (c.get("computed") or {}).get("is_invite_only"))
    lifetime_free = sum(1 for c in cards if (c.get("computed") or {}).get("is_lifetime_free"))

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "counts": {
            "cards_total": len(cards),
            "cards_active": active,
            "cards_invite_only": invite_only,
            "cards_lifetime_free": lifetime_free,
            "issuers": len(issuers),
            "networks": len(networks),
        },
        "by_status": dict(statuses.most_common()),
        "by_tier": dict(tiers.most_common()),
        "by_issuer": dict(by_issuer.most_common()),
        "by_network": dict(by_network.most_common()),
        "by_reward_currency": dict(by_reward_currency.most_common()),
        "tags": dict(all_tags.most_common()),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default="dist", help="Output directory (default: dist)")
    args = parser.parse_args(argv)

    out_dir = (ROOT / args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    networks = load_many(DATA_DIR / "networks")
    issuers = load_many(DATA_DIR / "issuers")

    cards: list[dict] = []
    for path in sorted((DATA_DIR / "cards").rglob("*.yaml")):
        raw = load_yaml(path)
        cards.append(enrich_card(raw, issuers, networks))

    cards.sort(key=lambda c: c["id"])

    (out_dir / "cards.json").write_text(
        json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (out_dir / "issuers.json").write_text(
        json.dumps(sorted(issuers.values(), key=lambda x: x["id"]), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (out_dir / "networks.json").write_text(
        json.dumps(sorted(networks.values(), key=lambda x: x["id"]), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    index = build_index(cards, issuers, networks)
    (out_dir / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"Wrote {len(cards)} cards, {len(issuers)} issuers, {len(networks)} networks to {out_dir.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
