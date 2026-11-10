"""Helpers for validate.py: dataset tooling added with the schema changelog.

Schema-version check, orphan and stale reports, and the warning ratchet, plus
the small date/source helpers they share with validate.py. Stdlib only.
"""
from __future__ import annotations

import json
import re
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINT_BASELINE_PATH = ROOT / "scripts" / "lint-baseline.json"
SEMVER_RE = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
CHANGELOG_TOP_RE = re.compile(r"^## \[(\d[^\]]*)\]", re.MULTILINE)


def as_date(value):
    """Coerce a value (date, datetime, or ISO string) to date; None when it is not one.

    A malformed string ("TBD") is already a schema error; raising here would kill the
    run with a traceback before that error list is printed.
    """
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    try:
        return datetime.fromisoformat(value).date()
    except (TypeError, ValueError):
        return None


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


def _rel(path: Path) -> str:
    """Repo-relative path for messages; falls back to the path as given (test fixtures)."""
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def check_schema_version(root: Path = ROOT) -> list[str]:
    """Errors if schema/VERSION is missing or not semver, or the changelog's top entry differs."""
    version_path = root / "schema" / "VERSION"
    changelog_path = root / "docs" / "SCHEMA_CHANGELOG.md"
    if not version_path.exists():
        return ["[schema-version] schema/VERSION is missing"]
    version = version_path.read_text(encoding="utf-8").strip()
    if not SEMVER_RE.match(version):
        return [f"[schema-version] schema/VERSION '{version}' is not valid semver (MAJOR.MINOR.PATCH)"]
    if not changelog_path.exists():
        return ["[schema-version] docs/SCHEMA_CHANGELOG.md is missing"]
    top = CHANGELOG_TOP_RE.search(changelog_path.read_text(encoding="utf-8"))
    if not top:
        return ["[schema-version] docs/SCHEMA_CHANGELOG.md has no '## [x.y.z]' entry"]
    if top.group(1) != version:
        return [
            f"[schema-version] docs/SCHEMA_CHANGELOG.md top entry is {top.group(1)} but "
            f"schema/VERSION is {version}; add a changelog entry or fix the version"
        ]
    return []


def find_orphans(cards, issuers, networks, loyalty_programs) -> list[str]:
    """Warnings for issuers, networks and loyalty programmes that no card references.

    `cards` is a list of (path, instance). References: card.issuer, card.network,
    rewards[].loyalty_program.
    """
    used_issuers, used_networks, used_programs = set(), set(), set()
    for _, inst in cards:
        used_issuers.add(inst.get("issuer"))
        used_networks.add(inst.get("network"))
        for rec in inst.get("rewards") or []:
            used_programs.add(rec.get("loyalty_program"))
    out = []
    for kind, known, used in (
        ("issuer", issuers, used_issuers),
        ("network", networks, used_networks),
        ("loyalty programme", loyalty_programs, used_programs),
    ):
        for slug in sorted(set(known) - used):
            out.append(f"[warn] orphan {kind} '{slug}': no card references it")
    return out


def parse_stale_days(raw: str) -> int | None:
    """Parse the --warn-stale argument; None when it is not a non-negative integer."""
    return int(raw) if raw.strip().isdigit() else None


def find_stale(cards, days: int, today: date | None = None) -> list[str]:
    """Warnings for cards whose newest evidence date is older than `days`.

    The evidence date is the latest of metadata.last_verified_on and every
    source.retrieved_on. Cards with no such date are not reported here.
    """
    today = today or date.today()
    out = []
    for path, inst in cards:
        dates = [as_date((inst.get("metadata") or {}).get("last_verified_on"))]
        dates += [as_date(src.get("retrieved_on")) for src in collect_sources(inst) if src.get("retrieved_on")]
        dates = [d for d in dates if d is not None]
        if not dates:
            continue
        age = (today - max(dates)).days
        if age > days:
            out.append(
                f"[warn] {_rel(path)} :: newest last_verified_on/source.retrieved_on is {age} days old (> {days})"
            )
    return out


def ratchet_result(count: int, baseline_path: Path = LINT_BASELINE_PATH) -> tuple[int, str]:
    """(exit code, message) comparing the standing warning count to the baseline file."""
    if not baseline_path.exists():
        return 1, f"[ratchet] baseline file {_rel(baseline_path)} is missing"
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))["warnings"]
    if count > baseline:
        return 1, (
            f"[ratchet] {count} warning(s) > baseline {baseline}: fix the new warnings "
            "(the baseline may only go down)"
        )
    if count < baseline:
        return 0, (
            f"[ratchet] {count} warning(s) < baseline {baseline}: lower the baseline in "
            f"{_rel(baseline_path)} to {count}"
        )
    return 0, f"[ratchet] {count} warning(s) = baseline {baseline}"


# An accelerator cannot pay back more than the spend it is earned on. A rate above this is
# a unit slip (reward units per Rs 100 authored against a per-Rs-1 base), not a rich card.
IMPOSSIBLE_RATE_PCT = 100


def implied_accelerator_pct(rec: dict, acc: dict, program: dict | None = None) -> float | None:
    """Percent of spend an accelerator returns, the way the site calculator reads it.

    None when the record carries no usable rate or unit value. `program` is the loyalty
    programme record, used for the unit value unless the record opts out (D-27).
    """
    base = rec.get("base") or {}
    if program and rec.get("unit_value_from_program") is not False:
        uv_rec = program.get("unit_value_inr") or {}
        unit_value = uv_rec.get("realized", uv_rec.get("face"))
    else:
        unit_value = base.get("unit_value_inr_realized", base.get("unit_value_inr"))
    if unit_value is None and rec.get("currency") == "cashback":
        unit_value = 1
    if acc.get("card_attributable_rate") is not None:
        rate, per_inr = acc["card_attributable_rate"], acc.get("card_attributable_per_inr", 100)
    elif acc.get("effective_rate") is not None:
        rate, per_inr = acc["effective_rate"], acc.get("effective_per_inr", base.get("per_inr"))
    else:
        return None
    numeric = all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in (rate, per_inr, unit_value))
    if not numeric or per_inr <= 0:
        return None
    return rate * unit_value / per_inr * 100
