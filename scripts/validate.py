#!/usr/bin/env python3
"""Validate all YAML data files against their JSON Schemas and cross-file invariants.

Usage:
    python scripts/validate.py

Exits 0 on success, 1 on any error. Prints warnings but still exits 0 if only warnings.
"""
from __future__ import annotations

import json
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_DIR = ROOT / "schema"
DATA_DIR = ROOT / "data"
STALENESS_WARN_DAYS = 180


def _normalize(value):
    """Convert YAML-parsed date/datetime into ISO strings so jsonschema can validate format: date."""
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _normalize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_normalize(v) for v in value]
    return value


def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return _normalize(yaml.safe_load(f))


def load_schema(name: str) -> dict:
    return json.loads((SCHEMA_DIR / f"{name}.schema.json").read_text(encoding="utf-8"))


def validator_for(schema: dict) -> Draft202012Validator:
    return Draft202012Validator(schema, format_checker=FormatChecker())


def as_date(value):
    """Coerce a value (date, datetime, or ISO string) to date."""
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    return datetime.fromisoformat(value).date()


def validate_schema_instance(errors, validator, instance, path: Path, kind: str):
    for err in sorted(validator.iter_errors(instance), key=lambda e: e.path):
        loc = "/".join(str(p) for p in err.absolute_path) or "<root>"
        errors.append(f"[schema:{kind}] {path.relative_to(ROOT)} :: {loc} :: {err.message}")


def check_dated_array(errors, card_path: Path, section_name: str, records, card_is_active: bool):
    """Verify an effective-dated array: sorted, non-overlapping, exactly one open-ended if active."""
    if not records:
        errors.append(f"[lint] {card_path.relative_to(ROOT)} :: {section_name} must have at least 1 record")
        return

    spans = []
    for i, rec in enumerate(records):
        start = as_date(rec.get("effective_from"))
        end = as_date(rec.get("effective_until"))
        if start is None:
            errors.append(f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{i}] missing effective_from")
            continue
        if end is not None and end < start:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{i}] effective_until {end} < effective_from {start}"
            )
        spans.append((start, end, i))

    # sorted by effective_from
    for a, b in zip(spans, spans[1:]):
        if a[0] > b[0]:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name} records not sorted by effective_from"
            )
            break

    # non-overlapping
    sorted_spans = sorted(spans, key=lambda s: s[0])
    for a, b in zip(sorted_spans, sorted_spans[1:]):
        a_end = a[1] if a[1] is not None else date.max
        if a_end >= b[0]:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{a[2]}] and [{b[2]}] overlap "
                f"({a[0]}..{a[1]} vs {b[0]}..{b[1]})"
            )

    open_records = [s for s in spans if s[1] is None]
    if card_is_active:
        if len(open_records) == 0:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name} has no open-ended record "
                f"(effective_until: null) but card is active"
            )
        elif len(open_records) > 1:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name} has {len(open_records)} open-ended records; must be exactly 1"
            )


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    card_schema = load_schema("card")
    issuer_schema = load_schema("issuer")
    network_schema = load_schema("network")

    card_validator = validator_for(card_schema)
    issuer_validator = validator_for(issuer_schema)
    network_validator = validator_for(network_schema)

    # --- networks ---
    networks: dict[str, dict] = {}
    for path in sorted((DATA_DIR / "networks").glob("*.yaml")):
        instance = load_yaml(path)
        validate_schema_instance(errors, network_validator, instance, path, "network")
        if isinstance(instance, dict) and "id" in instance:
            if instance["id"] != path.stem:
                errors.append(f"[lint] {path.relative_to(ROOT)} :: id '{instance['id']}' must match filename '{path.stem}'")
            networks[instance["id"]] = instance

    # --- issuers ---
    issuers: dict[str, dict] = {}
    for path in sorted((DATA_DIR / "issuers").glob("*.yaml")):
        instance = load_yaml(path)
        validate_schema_instance(errors, issuer_validator, instance, path, "issuer")
        if isinstance(instance, dict) and "id" in instance:
            if instance["id"] != path.stem:
                errors.append(f"[lint] {path.relative_to(ROOT)} :: id '{instance['id']}' must match filename '{path.stem}'")
            issuers[instance["id"]] = instance

    # --- cards ---
    card_ids_seen: set[str] = set()
    cards: list[tuple[Path, dict]] = []
    for path in sorted((DATA_DIR / "cards").rglob("*.yaml")):
        instance = load_yaml(path)
        validate_schema_instance(errors, card_validator, instance, path, "card")
        if not isinstance(instance, dict):
            continue
        cards.append((path, instance))

        card_id = instance.get("id")
        issuer_slug = instance.get("issuer")
        network_slug = instance.get("network")
        network_tier = instance.get("network_tier")
        status = instance.get("status")

        # id uniqueness
        if card_id:
            if card_id in card_ids_seen:
                errors.append(f"[lint] {path.relative_to(ROOT)} :: duplicate card id '{card_id}'")
            card_ids_seen.add(card_id)

            # id vs filename / folder
            expected_parent = issuer_slug
            if expected_parent and path.parent.name != expected_parent:
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: file must live under data/cards/{expected_parent}/"
                )
            if not card_id.startswith(f"{issuer_slug}-"):
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: id '{card_id}' must start with '{issuer_slug}-'"
                )
            expected_slug = card_id[len(f"{issuer_slug}-"):] if card_id.startswith(f"{issuer_slug}-") else None
            if expected_slug and path.stem != expected_slug:
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: filename '{path.stem}' must equal '{expected_slug}' "
                    f"(derived from id '{card_id}' minus issuer prefix)"
                )

        # cross-ref: issuer exists
        if issuer_slug and issuer_slug not in issuers:
            errors.append(f"[lint] {path.relative_to(ROOT)} :: issuer '{issuer_slug}' not found in data/issuers/")

        # cross-ref: network exists
        if network_slug and network_slug not in networks:
            errors.append(f"[lint] {path.relative_to(ROOT)} :: network '{network_slug}' not found in data/networks/")

        # cross-ref: network_tier is declared on the network
        if network_slug and network_tier and network_slug in networks:
            allowed = networks[network_slug].get("tiers") or []
            if network_tier not in allowed:
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: network_tier '{network_tier}' not declared on "
                    f"network '{network_slug}' (allowed: {', '.join(allowed)})"
                )

        # cross-ref: replaces_card exists
        replaces = (instance.get("application") or {}).get("replaces_card")
        if replaces is not None:
            # we can only validate after all cards have been collected; defer
            pass

        # dated-array invariants
        card_is_active = status == "active" or status == "invite-only"
        check_dated_array(errors, path, "fees", instance.get("fees", []), card_is_active)
        check_dated_array(errors, path, "rewards", instance.get("rewards", []), card_is_active)
        check_dated_array(errors, path, "benefits", instance.get("benefits", []), card_is_active)

        # discontinued cards should have discontinued_on
        if status == "discontinued" and not instance.get("discontinued_on"):
            errors.append(f"[lint] {path.relative_to(ROOT)} :: status is 'discontinued' but discontinued_on is null")

        # staleness warning
        last_verified = as_date((instance.get("metadata") or {}).get("last_verified_on"))
        if last_verified:
            age = (date.today() - last_verified).days
            if age > STALENESS_WARN_DAYS:
                warnings.append(
                    f"[warn] {path.relative_to(ROOT)} :: metadata.last_verified_on is {age} days old "
                    f"(> {STALENESS_WARN_DAYS})"
                )

    # deferred: replaces_card references
    for path, instance in cards:
        replaces = (instance.get("application") or {}).get("replaces_card")
        if replaces is not None and replaces not in card_ids_seen:
            errors.append(
                f"[lint] {path.relative_to(ROOT)} :: application.replaces_card '{replaces}' does not match any known card id"
            )

    print(f"Checked {len(cards)} cards, {len(issuers)} issuers, {len(networks)} networks.")
    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  {w}")
    if errors:
        print(f"\n{len(errors)} error(s):")
        for e in errors:
            print(f"  {e}")
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
