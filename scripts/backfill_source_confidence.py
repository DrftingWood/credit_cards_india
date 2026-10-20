#!/usr/bin/env python3
"""Backfill `source.confidence` from the per-card PROVENANCE header (D3).

Every card written before the 2026-07-04 verification wave carries a header
comment that docs/PROVENANCE.md defines per card:

    #   Verified   : 2026-07-04   Confidence: HIGH (pdf)

That comment states that the card's *primary* fields (fees, forex, reward rates
and caps) were cross-checked against the issuer's own evidence. This script
copies that statement into the machine-readable `source.confidence` of the
records it actually covers, and nowhere else. A source gets a value only when
ALL of these hold:

  * the header tier is exactly `HIGH (pdf)`, `MEDIUM (web)` or `LOW (unconfirmed)`
    (MIXED or free-text headers are left for a person) -> high / medium / low;
  * the record is in `fees` or `rewards` (the header does not speak for
    `benefits`) and is open-ended (`effective_until: null`);
  * `source.type` is issuer-page or issuer-pdf (an aggregator/archive/partner
    URL is not what the wave checked; run backfill_source_type.py first);
  * the record's covered values are identical to the same record (same section
    + effective_from) at WAVE_REV, the commit that wrote the headers. "Covered"
    is what the header vouches for: every fee field, and every reward field
    except prose and modelling added on top of the verified terms (`notes`,
    `capping_rules`, `redemption`, `base.unit_value_inr[_realized]`,
    `accelerated[].channel`). A rate, cap, cycle, slab, category, merchant or
    exclusion edited after the wave takes the record out of the header's cover.
    When only uncovered keys changed, the source must also be the one the wave
    saw (same `retrieved_on` and `notes`): a re-stamped source now speaks for
    the later modelling research, not for the header;
  * neither the source notes nor the record's notes hedge the values
    (unverified / estimate / aggregator / not stated / not published /
    widely reported / verify against ...);
  * the record carried no `TODO` marker before the 2026-07-03 "TODO cleanup"
    commits (CLEANUP_PRE_REV). That cleanup stripped 1,300+ `# TODO verify`
    markers without re-reading sources, so a record that had one was flagged as
    doubtful and never cleared — unless the wave itself then edited the record
    (its values differ between CLEANUP_POST_REV and WAVE_REV), which means it
    was re-examined against the issuer source.

Sources that already have a `confidence` are never changed. Insertion follows
backfill_source_type.py: ruamel round-trip, `confidence` placed after `type`
(or `retrieved_on`), CRLF kept, and a file is refused unless the diff is
exactly the inserted lines.

Usage:
    python scripts/backfill_source_confidence.py                    # dry run, all issuers
    python scripts/backfill_source_confidence.py --issuers axis,bob  # dry run, subset
    python scripts/backfill_source_confidence.py --issuers axis --apply
    python scripts/backfill_source_confidence.py --list-skips        # why each source was skipped
"""
from __future__ import annotations

import argparse
import difflib
import io
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
WAVE_REV = "4091c6d"  # "Provenance & confidence: annotate all 317 cards" (2026-07-04)
CLEANUP_PRE_REV = "2a2c5b4~1"  # last commit before the 2026-07-03 "TODO cleanup" series
CLEANUP_POST_REV = "96b197f"  # "TODO cleanup: ... ZERO markers left"
SECTIONS = ("fees", "rewards")
ISSUER_OWNED = {"issuer-page", "issuer-pdf"}
TIER_MAP = {("HIGH", "pdf"): "high", ("MEDIUM", "web"): "medium", ("LOW", "unconfirmed"): "low"}

HEADER_RE = re.compile(r"^#\s*Verified\s*:\s*(\d{4}-\d{2}-\d{2})\s+Confidence:\s*([A-Z]+)\s*\(([a-z]+)\)\s*$", re.M)
HEDGE_RE = re.compile(
    r"unverif|unconfirm|not\s+(?:source-|independently\s+|individually\s+)?verif|estimat|aggregator|"
    r"not\s+stated|could\s+not|couldn't|unclear|assum|inferr|approximat|tbc|to\s+be\s+confirmed|"
    r"widely\s+reported|reportedly|not\s+(?:disclosed|published)|verify\s+against",
    re.I,
)


def header_tier(text: str) -> str | None:
    """The card's header confidence mapped to the schema enum, or None if absent/non-standard."""
    m = HEADER_RE.search(text)
    if not m:
        return None
    return TIER_MAP.get((m.group(2), m.group(3)))


# Reward keys the header never vouched for: prose, valuation and channel
# modelling layered on the verified earn terms after (or during) the wave.
UNCOVERED_RECORD_KEYS = {"source", "notes", "capping_rules", "redemption"}
UNCOVERED_BASE_KEYS = {"unit_value_inr", "unit_value_inr_realized", "notes"}
UNCOVERED_ACCEL_KEYS = {"channel", "notes", "source"}


def strip_source(rec: dict) -> dict:
    return {k: v for k, v in rec.items() if k != "source"}


def covered_view(rec: dict, section: str) -> dict:
    """The part of a record its PROVENANCE header vouches for."""
    if section != "rewards":
        return strip_source(rec)
    view = {k: v for k, v in rec.items() if k not in UNCOVERED_RECORD_KEYS}
    if isinstance(view.get("base"), dict):
        view["base"] = {k: v for k, v in view["base"].items() if k not in UNCOVERED_BASE_KEYS}
    if isinstance(view.get("accelerated"), list):
        view["accelerated"] = [
            {k: v for k, v in a.items() if k not in UNCOVERED_ACCEL_KEYS} if isinstance(a, dict) else a
            for a in view["accelerated"]
        ]
    return view


def hedged(rec: dict) -> bool:
    """True if the record's own words cast doubt on its values."""
    texts = [str((rec.get("source") or {}).get("notes") or ""), str(rec.get("notes") or "")]
    return any(HEDGE_RE.search(t) for t in texts)


def todo_flagged(text: str) -> set[tuple[str, str]]:
    """(section, effective_from) of every fees/rewards/benefits record with a TODO marker on any of its lines."""
    out: set[tuple[str, str]] = set()
    sec = eff = None
    for line in text.splitlines():
        m = re.match(r"^([a-z_]+):", line)
        if m:
            sec, eff = m.group(1), None
            continue
        m = re.match(r"^  - effective_from:\s*['\"]?([0-9-]+)", line)
        if m and sec in ("fees", "rewards", "benefits"):
            eff = m.group(1)
            continue
        if eff and sec in ("fees", "rewards", "benefits") and re.search(r"\bTODO\b(?!\.md)", line):
            out.add((sec, eff))
    return out


def wave_record(wave_doc: dict | None, section: str, rec: dict) -> dict | None:
    if not wave_doc:
        return None
    for old in wave_doc.get(section) or []:
        if isinstance(old, dict) and str(old.get("effective_from")) == str(rec.get("effective_from")):
            return old
    return None


def decide(rec: dict, section: str, tier: str | None, wave_doc: dict | None,
           flagged: bool = False, rechecked: bool = False) -> tuple[str | None, str]:
    """Return (confidence-to-insert or None, reason). Pure: no I/O.

    `flagged`: the record had a TODO marker before the cleanup; `rechecked`: the
    wave edited the record after the cleanup (so the flag was looked at again).
    """
    src = rec.get("source") or {}
    if src.get("confidence"):
        return None, "already-set"
    if tier is None:
        return None, "no-standard-header"
    if section not in SECTIONS:
        return None, "section-not-covered"
    if rec.get("effective_until") is not None:
        return None, "closed-record"
    if src.get("type") not in ISSUER_OWNED:
        return None, f"type-{src.get('type') or 'missing'}"
    if wave_doc is None:
        return None, "new-since-wave"
    old = wave_record(wave_doc, section, rec)
    if old is None or covered_view(old, section) != covered_view(rec, section):
        return None, "changed-since-wave"
    if strip_source(old) != strip_source(rec):
        old_src = old.get("source") or {}
        if any(str(old_src.get(k)) != str(src.get(k)) for k in ("retrieved_on", "notes")):
            return None, "resourced-since-wave"
    if hedged(rec):
        return None, "notes-hedged"
    if flagged and not rechecked:
        return None, "todo-flagged"
    return tier, "ok"


def make_yaml():
    from ruamel.yaml import YAML  # imported lazily so the unit tests need only PyYAML

    y = YAML()
    y.preserve_quotes = True
    y.width = 4096
    y.indent(mapping=2, sequence=4, offset=2)
    y.representer.add_representer(type(None), lambda r, d: r.represent_scalar("tag:yaml.org,2002:null", "null"))
    return y


def add_confidence(src, value: str) -> None:
    """Insert `confidence` after `type` (else `retrieved_on`), keeping trailing comments in place."""
    keys = list(src.keys())
    anchor = "type" if "type" in keys else ("retrieved_on" if "retrieved_on" in keys else keys[-1])
    src.insert(keys.index(anchor) + 1, "confidence", value)
    if anchor in src.ca.items:
        src.ca.items["confidence"] = src.ca.items.pop(anchor)


def pure_insert(before: str, after: str, added: int, key: str = "confidence") -> bool:
    """The round-trip changed nothing except `added` inserted `<key>:` lines."""
    diff = [ln for ln in difflib.ndiff(before.splitlines(), after.splitlines()) if ln[:1] in "+-"]
    return len(diff) == added and all(ln.startswith("+ ") and ln[2:].strip().startswith(f"{key}: ") for ln in diff)


def text_at(rev: str, rel: str) -> str | None:
    try:
        out = subprocess.run(["git", "show", f"{rev}:{rel}"], cwd=ROOT, capture_output=True, check=True)
    except subprocess.CalledProcessError:
        return None
    return out.stdout.decode("utf-8")


def load_at_rev(rel: str, rev: str = WAVE_REV) -> dict | None:
    text = text_at(rev, rel)
    return yaml.safe_load(text) if text is not None else None


def flag_state(rel: str, section: str, rec: dict, wave_doc: dict | None) -> tuple[bool, bool]:
    """(flagged before the TODO cleanup, re-checked by the wave afterwards)."""
    pre = text_at(CLEANUP_PRE_REV, rel)
    if pre is None or (section, str(rec.get("effective_from"))) not in todo_flagged(pre):
        return False, False
    post = wave_record(load_at_rev(rel, CLEANUP_POST_REV), section, rec)
    wave = wave_record(wave_doc, section, rec)
    rechecked = post is not None and wave is not None and strip_source(post) != strip_source(wave)
    return True, rechecked


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--issuers", default="", help="comma-separated issuer dirs (default: all)")
    ap.add_argument("--list-skips", action="store_true")
    args = ap.parse_args(argv)
    only = {s.strip() for s in args.issuers.split(",") if s.strip()}

    y = make_yaml()
    stats: Counter = Counter()
    skips: list[str] = []
    refused: list[str] = []
    for path in sorted((ROOT / "data" / "cards").rglob("*.yaml")):
        if only and path.parent.name not in only:
            continue
        rel = path.relative_to(ROOT).as_posix()
        raw = path.read_bytes().decode("utf-8")
        newline = "\r\n" if "\r\n" in raw else "\n"
        text = raw.replace("\r\n", "\n")
        plain = yaml.safe_load(text)
        tier = header_tier(text)
        wave_doc = load_at_rev(rel)
        doc = None
        added = 0
        for sec in ("fees", "rewards", "benefits"):
            for i, rec in enumerate(plain.get(sec) or []):
                if not isinstance(rec, dict) or not isinstance(rec.get("source"), dict):
                    continue
                flagged, rechecked = flag_state(rel, sec, rec, wave_doc) if sec in SECTIONS else (False, False)
                value, reason = decide(rec, sec, tier, wave_doc, flagged, rechecked)
                stats[reason] += 1
                if value is None:
                    if reason not in {"already-set", "closed-record", "section-not-covered"}:
                        skips.append(f"{rel} {sec}[{i}]: {reason}")
                    continue
                if doc is None:
                    doc = y.load(text)
                add_confidence(doc[sec][i]["source"], value)
                stats[f"set-{value}"] += 1
                added += 1
        if not added:
            continue
        buf = io.StringIO()
        y.dump(doc, buf)
        out = buf.getvalue()
        if not pure_insert(text, out, added):
            refused.append(rel)
            stats["refused-sources"] += added
            continue
        stats["files"] += 1
        if args.apply:
            path.write_bytes(out.replace("\n", newline).encode("utf-8"))

    print(("Applied" if args.apply else "Dry run") + (f" — issuers: {', '.join(sorted(only))}" if only else " — all issuers"))
    for k in sorted(stats):
        print(f"  {k:22} {stats[k]}")
    if refused:
        print("  refused (round-trip would change other lines; edit by hand): " + ", ".join(refused))
    if args.list_skips:
        for s in skips:
            print("  skip " + s)
    return 0


if __name__ == "__main__":
    sys.exit(main())
