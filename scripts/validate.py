#!/usr/bin/env python3
"""Validate all YAML data files against their JSON Schemas and cross-file invariants.

Usage:
    python scripts/validate.py

Exits 0 on success, 1 on any error. Prints warnings but still exits 0 if only warnings.
"""
from __future__ import annotations

import json
import socket
import sys
from datetime import date, datetime, timedelta
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_DIR = ROOT / "schema"
DATA_DIR = ROOT / "data"
CATEGORY_RULES_PATH = ROOT / "scripts" / "category_rules.yaml"
STALENESS_WARN_DAYS = 180
# Premium-tier active cards churn fastest (2024-26 devaluation cycle) and get
# the most traffic — tighter budget. Hard error budget applies to every card.
STALENESS_WARN_DAYS_PREMIUM = 90
STALENESS_ERROR_DAYS = 270
PREMIUM_TIERS = {"premium", "super-premium", "invite-only"}
URL_CHECK_TIMEOUT_SECONDS = 10
AGGREGATOR_SOURCE_DOMAINS = {
    "cardinsider.com",
    "www.cardinsider.com",
    "bankbazaar.com",
    "www.bankbazaar.com",
    "paisabazaar.com",
    "www.paisabazaar.com",
    "cardexpert.in",
    "www.cardexpert.in",
    "cardmaven.in",
    "www.cardmaven.in",
    "cardnavy.in",
    "www.cardnavy.in",
}
ISSUER_ALLOWED_DOMAINS = {
    "amex": {"americanexpress.com", "www.americanexpress.com"},
    "au": {"aubank.in", "www.aubank.in"},
    "bob": {"bobfinancial.com", "www.bobfinancial.com", "bobcard.co.in", "www.bobcard.co.in"},
    "boi": {"bankofindia.co.in", "www.bankofindia.co.in"},
    "canara": {"canarabank.com", "www.canarabank.com"},
    "federal": {"federalbank.co.in", "www.federalbank.co.in", "scapia.cards", "www.scapia.cards"},
    "hsbc": {"hsbc.co.in", "www.hsbc.co.in"},
    "idbi": {"idbibank.in", "www.idbibank.in"},
    "indusind": {"indusind.com", "www.indusind.com"},
    "kotak": {"kotak.com", "www.kotak.com"},
    "kvb": {"kvb.co.in", "www.kvb.co.in"},
    "onecard": {"getonecard.app", "www.getonecard.app"},
    "pnb": {"pnbindia.in", "www.pnbindia.in", "pnbcard.in", "www.pnbcard.in"},
    "slice": {"sliceit.com", "www.sliceit.com"},
    "south-indian": {"southindianbank.com", "www.southindianbank.com"},
    "standard-chartered": {"sc.com", "www.sc.com"},
    "union": {"unionbankofindia.co.in", "www.unionbankofindia.co.in"},
    "yes": {"yesbank.in", "www.yesbank.in"},
    "axis": {"axisbank.com", "www.axisbank.com", "axis.bank.in", "www.axis.bank.in"},
    "hdfc": {"hdfcbank.com", "www.hdfcbank.com"},
    "icici": {"icicibank.com", "www.icicibank.com", "icici.bank.in", "www.icici.bank.in"},
    "idfc-first": {"idfcfirstbank.com", "www.idfcfirstbank.com", "idfcfirst.bank.in", "www.idfcfirst.bank.in"},
    "rbl": {"rblbank.com", "www.rblbank.com", "irctc.co.in", "www.irctc.co.in"},
    "sbi": {"sbicard.com", "www.sbicard.com"},
}


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


def check_dated_array(errors, card_path: Path, section_name: str, records, card_is_active: bool, discontinued_on=None):
    """Verify an effective-dated array: sorted, non-overlapping, gap-free, exactly one open-ended if active, all closed if discontinued."""
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

    # non-overlapping and gap-free
    sorted_spans = sorted(spans, key=lambda s: s[0])
    for a, b in zip(sorted_spans, sorted_spans[1:]):
        a_end = a[1] if a[1] is not None else date.max
        if a_end >= b[0]:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{a[2]}] and [{b[2]}] overlap "
                f"({a[0]}..{a[1]} vs {b[0]}..{b[1]})"
            )
        elif a[1] is not None and (b[0] - a[1]).days > 1:
            errors.append(
                f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{a[2]}] ends {a[1]} but [{b[2]}] "
                f"starts {b[0]} — {(b[0] - a[1]).days - 1} day gap with no record"
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
    if discontinued_on is not None:
        for start, end, i in spans:
            if end is None:
                errors.append(
                    f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{i}] is open-ended but the card "
                    f"was discontinued on {discontinued_on}; close it with effective_until"
                )
            elif end > discontinued_on:
                errors.append(
                    f"[lint] {card_path.relative_to(ROOT)} :: {section_name}[{i}] ends {end}, after "
                    f"discontinued_on {discontinued_on}"
                )


def collect_sources(node):
    """Yield all nested `source` objects from a card payload."""
    if isinstance(node, dict):
        source = node.get("source")
        if isinstance(source, dict):
            yield source
        for value in node.values():
            yield from collect_sources(value)
    elif isinstance(node, list):
        for item in node:
            yield from collect_sources(item)


def check_source_urls(warnings, path: Path, instance: dict):
    """Best-effort source URL availability check via GET request."""
    sources = [src for src in collect_sources(instance) if src.get("url")]
    unique_urls = sorted({src["url"] for src in sources})
    for url in unique_urls:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            warnings.append(
                f"[warn] {path.relative_to(ROOT)} :: source url '{url}' does not use http/https and was not checked"
            )
            continue
        check_url_reachability(warnings, path, "source url", url)


def check_url_reachability(warnings, path: Path, label: str, url: str):
    req = Request(url, method="GET", headers={"User-Agent": "credit-cards-india-validator/1.0"})
    try:
        with urlopen(req, timeout=URL_CHECK_TIMEOUT_SECONDS) as resp:
            status = getattr(resp, "status", 200)
            if status >= 400:
                warnings.append(
                    f"[warn] {path.relative_to(ROOT)} :: {label} '{url}' returned HTTP {status}"
                )
    except HTTPError as exc:
        warnings.append(
            f"[warn] {path.relative_to(ROOT)} :: {label} '{url}' returned HTTP {exc.code}"
        )
    except (URLError, TimeoutError, socket.timeout) as exc:
        warnings.append(
            f"[warn] {path.relative_to(ROOT)} :: {label} '{url}' could not be reached ({exc.__class__.__name__})"
        )


def check_application_urls(errors, warnings, path: Path, instance: dict, check_urls: bool):
    application = instance.get("application") or {}
    issuer_slug = instance.get("issuer")
    card_id = instance.get("id")
    for field in ("apply_url", "pre_approval_check_url"):
        url = application.get(field)
        if not url:
            continue
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            errors.append(
                f"[lint] {path.relative_to(ROOT)} :: application.{field} must use http/https (got '{url}')"
            )
            continue
        hostname = (parsed.hostname or "").lower()
        allowed = ISSUER_ALLOWED_DOMAINS.get(issuer_slug, set())
        if allowed and hostname not in allowed:
            warnings.append(
                f"[warn] {path.relative_to(ROOT)} :: application.{field} host '{hostname}' is outside "
                f"issuer allowlist for '{issuer_slug}' (card id: {card_id})"
            )
        if check_urls:
            check_url_reachability(warnings, path, f"application.{field}", url)


def _load_category_rules():
    """Load scripts/category_rules.yaml; returns (rules, untaggable_re) or ([], None) on miss."""
    import re as _re
    if not CATEGORY_RULES_PATH.exists():
        return [], None
    raw = yaml.safe_load(CATEGORY_RULES_PATH.read_text(encoding="utf-8"))
    rules = [(_re.compile(r["match"]), list(r["buckets"])) for r in raw.get("rules", [])]
    untaggable = _re.compile(raw.get("untaggable", r"$^"), _re.IGNORECASE)
    return rules, untaggable


def main() -> int:
    check_urls = "--check-urls" in sys.argv[1:]
    errors: list[str] = []
    warnings: list[str] = []
    category_rules, untaggable_re = _load_category_rules()

    card_schema = load_schema("card")
    issuer_schema = load_schema("issuer")
    network_schema = load_schema("network")
    loyalty_schema_path = SCHEMA_DIR / "loyalty_program.schema.json"
    loyalty_schema = json.loads(loyalty_schema_path.read_text(encoding="utf-8")) if loyalty_schema_path.exists() else None

    card_validator = validator_for(card_schema)
    issuer_validator = validator_for(issuer_schema)
    network_validator = validator_for(network_schema)
    loyalty_validator = validator_for(loyalty_schema) if loyalty_schema else None

    # --- loyalty programs ---
    loyalty_programs: dict[str, dict] = {}
    loyalty_dir = DATA_DIR / "loyalty_programs"
    if loyalty_dir.exists() and loyalty_validator is not None:
        for path in sorted(loyalty_dir.rglob("*.yaml")):
            instance = load_yaml(path)
            validate_schema_instance(errors, loyalty_validator, instance, path, "loyalty_program")
            if isinstance(instance, dict) and "id" in instance:
                if instance["id"] != path.stem:
                    errors.append(f"[lint] {path.relative_to(ROOT)} :: id '{instance['id']}' must match filename '{path.stem}'")
                loyalty_programs[instance["id"]] = instance

    # --- tag vocabulary ---
    allowed_tags: set = set()
    tags_path = DATA_DIR / "tags.yaml"
    if tags_path.exists():
        raw_tags = yaml.safe_load(tags_path.read_text(encoding="utf-8"))
        if isinstance(raw_tags, dict) and isinstance(raw_tags.get("tags"), list):
            allowed_tags = set(raw_tags["tags"])

    # --- display-merchant vocabulary ---
    allowed_merchants: set = set()
    merchants_path = DATA_DIR / "merchants.yaml"
    if merchants_path.exists():
        raw_merchants = yaml.safe_load(merchants_path.read_text(encoding="utf-8"))
        if isinstance(raw_merchants, dict) and isinstance(raw_merchants.get("merchants"), list):
            allowed_merchants = set(raw_merchants["merchants"])

    # --- channel taxonomy ---
    channels_known: dict[str, set] = {}
    channels_path = DATA_DIR / "channels" / "known.yaml"
    if channels_path.exists():
        raw = load_yaml(channels_path)
        if isinstance(raw, dict):
            for cls, tokens in raw.items():
                if isinstance(tokens, list):
                    channels_known[cls] = set(tokens)

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
        disc_date = as_date(instance.get("discontinued_on")) if status == "discontinued" else None
        check_dated_array(errors, path, "fees", instance.get("fees", []), card_is_active, disc_date)
        check_dated_array(errors, path, "rewards", instance.get("rewards", []), card_is_active, disc_date)
        check_dated_array(errors, path, "benefits", instance.get("benefits", []), card_is_active, disc_date)

        # co-brand partner ↔ loyalty programme alias lint
        # Warning-tier per the validator-promotion pattern: promote to error
        # once offender count is zero (see docs/ROADMAP.md).
        co_brand = instance.get("co_brand")
        if isinstance(co_brand, dict) and status != "discontinued":
            partner_str = (co_brand.get("partner") or "").lower()
            referenced_programs = {
                rec.get("loyalty_program")
                for rec in (instance.get("rewards") or [])
                if rec.get("loyalty_program")
            }
            for prog_id, prog in loyalty_programs.items():
                aliases = prog.get("co_brand_partner_aliases") or []
                if not aliases:
                    continue
                if any(alias.lower() in partner_str for alias in aliases):
                    if prog_id not in referenced_programs:
                        warnings.append(
                            f"[warn] {path.relative_to(ROOT)} :: co_brand.partner "
                            f"'{co_brand.get('partner')}' matches loyalty programme "
                            f"'{prog_id}' aliases but no rewards[].loyalty_program "
                            f"references '{prog_id}'"
                        )

        # loyalty program / channel / stacks-with-program lints
        for r_idx, rec in enumerate(instance.get("rewards", []) or []):
            program_ref = rec.get("loyalty_program")
            if program_ref and program_ref not in loyalty_programs:
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].loyalty_program "
                    f"'{program_ref}' not found in data/loyalty_programs/"
                )

            base = rec.get("base") or {}
            # cashback units are rupees by definition.
            if rec.get("currency") == "cashback" and base.get("unit_value_inr") not in (None, 1, 1.0):
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}] currency is 'cashback' but "
                    f"base.unit_value_inr is {base.get('unit_value_inr')} (must be 1 or null); "
                    f"if a unit is worth less than ₹1 the currency is points, not cashback"
                )
            # card-level realized value must agree with the referenced programme's.
            card_realized = base.get("unit_value_inr_realized")
            if program_ref and program_ref in loyalty_programs and card_realized is not None:
                prog_uv = (loyalty_programs[program_ref].get("unit_value_inr") or {})
                prog_realized = prog_uv.get("realized") if isinstance(prog_uv, dict) else None
                if prog_realized is not None and abs(card_realized - prog_realized) > 1e-9:
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].base.unit_value_inr_realized "
                        f"({card_realized}) disagrees with programme '{program_ref}' realized "
                        f"({prog_realized}); the calculator uses the programme value, so align or drop the card-level one"
                    )
            rec_is_open = rec.get("effective_until") is None
            unit_value = (
                base.get("unit_value_inr_realized")
                if base.get("unit_value_inr_realized") is not None
                else base.get("unit_value_inr")
            )
            if unit_value is None and rec.get("currency") == "cashback":
                unit_value = 1
            for a_idx, acc in enumerate(rec.get("accelerated", []) or []):
                has_mult = acc.get("multiplier") is not None
                has_eff = acc.get("effective_rate") is not None
                if has_mult and has_eff:
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}] sets both "
                        f"multiplier and effective_rate; they use different conventions and have repeatedly "
                        f"contradicted each other — set exactly one"
                    )
                if not has_mult and not has_eff:
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}] sets neither "
                        f"multiplier nor effective_rate"
                    )
                # Plausibility band: a broad-category accelerator worth >12% of spend is
                # almost certainly a units error or an undecomposed stacked rate.
                # Narrow merchant promos (channel / merchants set) can legitimately exceed it.
                if (
                    rec_is_open
                    and has_eff
                    and unit_value is not None
                    and not acc.get("channel")
                    and not acc.get("merchants")
                    and acc.get("card_attributable_rate") is None
                    and not acc.get("earn_components")
                ):
                    eff_per = acc.get("effective_per_inr") or base.get("per_inr") or 1
                    value_pct = acc["effective_rate"] / eff_per * unit_value * 100
                    if value_pct > 12:
                        errors.append(
                            f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}] "
                            f"({acc.get('category')}) is worth {value_pct:.1f}% of spend with no channel/merchant "
                            f"restriction and no decomposition — check units (effective_rate is units per "
                            f"effective_per_inr/base.per_inr rupees, not a percent)"
                        )
                if allowed_merchants:
                    for m_tok in acc.get("merchants") or []:
                        if m_tok not in allowed_merchants:
                            errors.append(
                                f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}].merchants "
                                f"token '{m_tok}' not declared in data/merchants.yaml"
                            )
                ch = acc.get("channel")
                if isinstance(ch, dict):
                    cls = ch.get("class")
                    merchants = ch.get("merchants") or []
                    known = channels_known.get(cls, set()) if cls else set()
                    if cls and channels_known and not known:
                        errors.append(
                            f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}].channel.class "
                            f"'{cls}' not declared in data/channels/known.yaml"
                        )
                    for m in merchants:
                        if known and m not in known:
                            errors.append(
                                f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}].channel.merchants "
                                f"token '{m}' not declared under class '{cls}' in data/channels/known.yaml"
                            )
                if acc.get("stacks_with_program") and not program_ref:
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}].stacks_with_program=true "
                        f"requires rewards[{r_idx}].loyalty_program to be set"
                    )
                cat_str = (acc.get("category") or "").lower()
                tags = acc.get("canonical_categories")
                if (
                    category_rules
                    and cat_str
                    and not tags
                    and not (untaggable_re and untaggable_re.search(cat_str))
                ):
                    matched = False
                    for pattern, _ in category_rules:
                        if pattern.search(cat_str):
                            matched = True
                            break
                    if matched:
                        errors.append(
                            f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}] "
                            f"category '{cat_str}' matches a known rule but has no canonical_categories tag "
                            f"(run scripts/tag_canonical_categories.py --apply)"
                        )

                if (
                    program_ref
                    and acc.get("effective_rate") is not None
                    and acc["effective_rate"] > 5
                    and acc.get("card_attributable_rate") is None
                ):
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: rewards[{r_idx}].accelerated[{a_idx}] "
                        f"effective_rate {acc['effective_rate']} > 5 with loyalty_program "
                        f"'{program_ref}' but no card_attributable_rate set; "
                        f"likely a stacked rate that should be decomposed"
                    )

        # tags must come from the controlled vocabulary
        if allowed_tags:
            for tag in (instance.get("metadata") or {}).get("tags") or []:
                if tag not in allowed_tags:
                    errors.append(
                        f"[lint] {path.relative_to(ROOT)} :: metadata.tags '{tag}' not declared in data/tags.yaml"
                    )

        # discontinued cards should have discontinued_on
        if status == "discontinued" and not instance.get("discontinued_on"):
            errors.append(f"[lint] {path.relative_to(ROOT)} :: status is 'discontinued' but discontinued_on is null")

        # staleness budget — tiered warning, hard error at STALENESS_ERROR_DAYS
        last_verified = as_date((instance.get("metadata") or {}).get("last_verified_on"))
        if last_verified:
            age = (date.today() - last_verified).days
            warn_days = (
                STALENESS_WARN_DAYS_PREMIUM
                if card_is_active and instance.get("tier") in PREMIUM_TIERS
                else STALENESS_WARN_DAYS
            )
            if age > STALENESS_ERROR_DAYS and status != "discontinued":
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: metadata.last_verified_on is {age} days old "
                    f"(> {STALENESS_ERROR_DAYS}); re-verify the card against its sources"
                )
            elif age > warn_days:
                warnings.append(
                    f"[warn] {path.relative_to(ROOT)} :: metadata.last_verified_on is {age} days old "
                    f"(> {warn_days})"
                )
        source_dates = [as_date(src.get("retrieved_on")) for src in collect_sources(instance) if src.get("retrieved_on")]
        source_dates = [d for d in source_dates if d is not None]
        if source_dates:
            max_source_date = max(source_dates)
            if last_verified and last_verified < max_source_date:
                errors.append(
                    f"[lint] {path.relative_to(ROOT)} :: metadata.last_verified_on ({last_verified}) is earlier than "
                    f"latest source.retrieved_on ({max_source_date})"
                )

        if check_urls:
            check_source_urls(warnings, path, instance)

        if status in {"active", "invite-only"}:
            aggregator_hosts = sorted({
                (urlparse(src["url"]).hostname or "").lower()
                for src in collect_sources(instance)
                if src.get("url")
                and (urlparse(src["url"]).hostname or "").lower() in AGGREGATOR_SOURCE_DOMAINS
            })
            for source_host in aggregator_hosts:
                warnings.append(
                    f"[warn] {path.relative_to(ROOT)} :: source host '{source_host}' appears to be an aggregator; "
                    "prefer issuer-owned source URLs for active cards"
                )

        check_application_urls(errors, warnings, path, instance, check_urls)

    # deferred: replaces_card references
    for path, instance in cards:
        replaces = (instance.get("application") or {}).get("replaces_card")
        if replaces is not None and replaces not in card_ids_seen:
            errors.append(
                f"[lint] {path.relative_to(ROOT)} :: application.replaces_card '{replaces}' does not match any known card id"
            )

    print(
        f"Checked {len(cards)} cards, {len(issuers)} issuers, {len(networks)} networks, "
        f"{len(loyalty_programs)} loyalty programs."
    )
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
