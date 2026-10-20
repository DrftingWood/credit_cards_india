"""Rule-level reward provenance: inheritance, gap detection, coverage (D-21).

A *rule* is one earn rule of a reward record: its `base` rate, or one entry of
its `accelerated[]` list. Every reward record must carry a `source` (schema-
required); an accelerator may also carry its own `source`. A rule without its
own source inherits the record's, so every rule always has an *effective*
source. This module grades that effective source.

Pure and network-free so scripts/test_provenance.py can exercise it directly.
scripts/validate.py calls it for the coverage summary, the default-mode
warnings, and the strict-mode errors.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from urllib.parse import urlparse

RULE_MAX_AGE_DAYS = 180  # same horizon as validate.py's STALENESS_WARN_DAYS

# Gaps that mean the provenance claim is broken or contradicted. These warn in
# the default mode, so they surface without failing the build.
HARD_GAPS = ("no-url", "no-date", "bad-scheme", "homepage-url", "unvouched")
# Gaps that mean the provenance is thin but not wrong. Default mode only counts
# them in the coverage summary; strict mode fails on them too.
SOFT_GAPS = ("no-type", "no-confidence", "stale", "aggregator")
ALL_GAPS = HARD_GAPS + SOFT_GAPS

GAP_TEXT = {
    "no-url": "effective source has no url",
    "no-date": "effective source has no retrieved_on",
    "bad-scheme": "source url is not http(s)",
    "homepage-url": "source url is a bare homepage, not the page that states the rule",
    "unvouched": "inherited source lists fields_verified that do not cover this rule",
    "no-type": "source.type not set",
    "no-confidence": "source.confidence not set",
    "stale": f"source.retrieved_on older than {RULE_MAX_AGE_DAYS} days",
    "aggregator": "source is an aggregator, not issuer evidence",
}


def _as_date(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        return None


@dataclass
class Rule:
    loc: str  # e.g. "rewards[0].accelerated[2]"
    kind: str  # "base" | "accelerated"
    current: bool  # parent reward record is open-ended
    explicit: bool  # rule carries its own source
    source: dict  # effective source (own, else inherited)
    record_source: dict
    gaps: list[str] = field(default_factory=list)


def iter_rules(card: dict):
    """Yield a Rule for every base and accelerated entry of every reward record."""
    for r_idx, rec in enumerate(card.get("rewards") or []):
        if not isinstance(rec, dict):
            continue
        rec_src = rec.get("source") if isinstance(rec.get("source"), dict) else {}
        current = rec.get("effective_until") is None
        if rec.get("base") is not None:
            yield Rule(f"rewards[{r_idx}].base", "base", current, False, rec_src, rec_src)
        for a_idx, acc in enumerate(rec.get("accelerated") or []):
            if not isinstance(acc, dict):
                continue
            own = acc.get("source") if isinstance(acc.get("source"), dict) else None
            yield Rule(
                f"rewards[{r_idx}].accelerated[{a_idx}]",
                "accelerated",
                current,
                own is not None,
                own if own is not None else rec_src,
                rec_src,
            )


def _vouches_for(fields_verified, kind: str) -> bool:
    """Does a fields_verified list cover a rule of this kind?

    Only reward paths count: `rewards.base*` covers the base rule and
    `rewards.accelerated*` covers accelerators. A list with no reward paths at
    all (only fees.*, lounge_access.*, ...) says nothing about rewards, so it
    neither vouches nor contradicts and is treated as covering.
    """
    paths = [p for p in fields_verified if isinstance(p, str) and p.startswith("rewards.")]
    if not paths:
        return True
    return any(p == f"rewards.{kind}" or p.startswith(f"rewards.{kind}.") for p in paths)


def grade(rule: Rule, today: date, aggregator_hosts=frozenset(), max_age_days: int = RULE_MAX_AGE_DAYS):
    """Fill rule.gaps with every gap code that applies, and return them."""
    src = rule.source or {}
    gaps: list[str] = []
    url = src.get("url")
    if not url:
        gaps.append("no-url")
    else:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            gaps.append("bad-scheme")
        elif parsed.path in {"", "/"} and not parsed.query:
            gaps.append("homepage-url")
        if (parsed.hostname or "").lower() in aggregator_hosts:
            gaps.append("aggregator")
    retrieved = _as_date(src.get("retrieved_on"))
    if retrieved is None:
        gaps.append("no-date")
    elif (today - retrieved).days > max_age_days:
        gaps.append("stale")
    if not rule.explicit and src.get("fields_verified") and not _vouches_for(src["fields_verified"], rule.kind):
        gaps.append("unvouched")
    if not src.get("type"):
        gaps.append("no-type")
    if not src.get("confidence"):
        gaps.append("no-confidence")
    rule.gaps = gaps
    return gaps


def in_strict_scope(rule: Rule, card: dict) -> bool:
    """Strict mode enforces the rules a reader can act on today: open-ended
    reward records of cards that can still be applied for or held."""
    return rule.current and card.get("status") in {"active", "invite-only"}


class Coverage:
    """Accumulates per-rule grades into the summary validate.py prints."""

    def __init__(self):
        self.rules = 0
        self.scoped = 0
        self.explicit = 0
        self.gap_counts = {g: 0 for g in ALL_GAPS}
        self.strict_ready = 0
        self.by_issuer: dict[str, dict[str, int]] = {}
        self.rows: list[dict] = []

    def add(self, card: dict, path: str, rule: Rule):
        self.rules += 1
        if not in_strict_scope(rule, card):
            return
        self.scoped += 1
        self.explicit += rule.explicit
        for g in rule.gaps:
            self.gap_counts[g] += 1
        ready = not rule.gaps
        self.strict_ready += ready
        iss = self.by_issuer.setdefault(card.get("issuer") or "?", {"rules": 0, "strict_ready": 0})
        iss["rules"] += 1
        iss["strict_ready"] += ready
        self.rows.append(
            {
                "card": card.get("id"),
                "path": path,
                "rule": rule.loc,
                "explicit": rule.explicit,
                "url": (rule.source or {}).get("url"),
                "retrieved_on": str((rule.source or {}).get("retrieved_on")),
                "gaps": list(rule.gaps),
            }
        )

    @staticmethod
    def _pct(n: int, d: int) -> str:
        # floor, so "100%" is only ever printed when nothing is missing
        return f"{(100 * n) // d}%" if d else "n/a"

    def summary_lines(self) -> list[str]:
        s = self.scoped
        have = lambda gap: s - self.gap_counts[gap]  # noqa: E731
        return [
            f"Provenance: {self.rules} reward rules; {s} in strict scope (open records of active/invite-only cards).",
            f"  explicit rule-level source {self.explicit} ({self._pct(self.explicit, s)}), "
            f"inherited from the reward record {s - self.explicit}.",
            f"  url+date {self._pct(min(have('no-url'), have('no-date')), s)} · "
            f"type {self._pct(have('no-type'), s)} · confidence {self._pct(have('no-confidence'), s)} · "
            f"fresh <={RULE_MAX_AGE_DAYS}d {self._pct(have('stale'), s)} · "
            f"issuer-owned {self._pct(have('aggregator'), s)}",
            f"  strict-ready {self.strict_ready}/{s} ({self._pct(self.strict_ready, s)}); "
            + ", ".join(f"{g}={n}" for g, n in self.gap_counts.items() if n),
        ]

    def as_report(self) -> dict:
        return {
            "rules": self.rules,
            "strict_scope": self.scoped,
            "explicit": self.explicit,
            "strict_ready": self.strict_ready,
            "gap_counts": self.gap_counts,
            "by_issuer": self.by_issuer,
            "rows": self.rows,
        }
