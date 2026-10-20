#!/usr/bin/env python3
"""Backfill `source.local_refs` + `source.fields_verified` from the audit docs (D3).

`fields_verified` claims that a specific archived document supports a specific
record field, so it is only written where the repo already says so: each claim
below quotes an audit doc or verification commit that names the document, the
field and the cards. A claim is applied to a card only when

  * the card's open-ended record in that section exists,
  * its source has no `local_refs` / `fields_verified` yet (existing evidence is
    never merged into or rewritten),
  * the field's current value equals what the claim says the document states:
    a literal value from the doc, or, for "confirmed as-is" claims, the value
    the field had at the verification commit (same record, same effective_from),
  * for reward claims, every accelerator on the record is covered, so the
    record's `fields_verified` never makes an inherited rule look vouched for
    (or contradicted) when it was not checked (see provenance._vouches_for);
  * and the field did not carry a `# TODO verify` marker before the 2026-07-03
    TODO cleanup (CLEANUP_PRE_REV), which stripped markers without re-reading
    sources. The audit docs predate that cleanup, so a marker on a field means
    the audit itself left that card's value unconfirmed. Claims tied to a
    verification commit made after the cleanup (`rev`) re-examined the field
    and are exempt.

Nothing is read from the PDFs themselves; `--archive DIR` only checks that each
cited file exists in a checkout that has the gitignored archive. Insertion is a
ruamel round-trip with the same write guard as the other backfill scripts:
`local_refs` and `fields_verified` go after `confidence` (or `type`, or
`retrieved_on`), CRLF is kept, and a file whose diff would touch any other line
is refused.

Usage:
    python scripts/backfill_local_evidence.py                       # dry run
    python scripts/backfill_local_evidence.py --claims hdfc-mitc-finance --apply
    python scripts/backfill_local_evidence.py --archive "<main checkout>" --list-skips
"""
from __future__ import annotations

import argparse
import difflib
import io
import re
import subprocess
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
AS_OF = object()  # "the value the field had at the claim's verification commit"
CLEANUP_PRE_REV = "2a2c5b4~1"  # last commit before the 2026-07-03 "TODO cleanup" series


@dataclass
class Claim:
    id: str
    issuer: str
    section: str  # fees | rewards
    fields: tuple[str, ...]  # record-relative paths: "forex_markup_pct", "base.rate", "accelerated.cap_per_cycle"
    expect: dict  # card slug -> {field: literal or AS_OF}
    ref: str | dict  # docs/sources/... path, or {slug: path}
    cite: str
    rev: str | None = None  # verification commit for AS_OF values
    all_accelerators: bool = field(default=False)

    def ref_for(self, slug: str) -> str:
        return self.ref[slug] if isinstance(self.ref, dict) else self.ref


def _same(slugs, **values):
    return {s: dict(values) for s in slugs}


def _axis():
    fin = {
        3.0: "ace airtel flipkart horizon magnus reserve cashback samsung-infinite samsung-signature freecharge "
        "freecharge-plus fibe google-pay-flex spicejet-voyage spicejet-voyage-black",
        3.75: "atlas select privilege aura my-zone neo indigo indigo-premium indianoil indianoil-premium shoppers-stop "
        "flipkart-super-elite vistara vistara-signature vistara-infinite miles-more lic-platinum lic-signature "
        "pride-platinum pride-signature kwik",
        3.4: "my-zone-easy privilege-easy",
    }
    forex = {"magnus": 2.0, "reserve": 1.5, "indigo-premium": 2.5}
    out = {}
    for rate, slugs in fin.items():
        for s in slugs.split():
            out[s] = {"finance_charge_monthly_pct": rate, "forex_markup_pct": forex.get(s, 3.5)}
    return out


HDFC_ALL = (
    "diners-black diners-privilege diners-rewardz freedom indianoil infinia irctc-hdfc marriott-bonvoy millennia "
    "moneyback-plus phonepe-ultimo phonepe-uno pixel-go pixel-play regalia-gold regalia shoppers-stop-black "
    "shoppers-stop swiggy-blck swiggy-hdfc swiggy-ornge tata-neu-infinity tata-neu-plus upi-rupay"
).split()
ICICI_ALL = (
    "adani-one-platinum adani-one-signature amazon-pay coral csk emeralde-private-metal emeralde emirates-emeralde "
    "emirates-rubyx emirates-sapphiro expressions hpcl-coral hpcl-super-saver mmt-platinum mmt-signature mmt "
    "parakram-select parakram platinum-chip rubyx sapphiro times-black"
).split()
ICICI_FOREX = {"times-black": 1.49, "amazon-pay": 1.99, "emeralde": 2.0, "emeralde-private-metal": 2.0}
SBI_ALL = sorted(p.stem for p in (ROOT / "data" / "cards" / "sbi").glob("*.yaml"))
BOB_CAPS = {"eterna": 5000, "tiara": 5000, "premier": 2000, "select": 1000, "easy": 1000}

CLAIMS = [
    Claim(
        "hdfc-mitc-finance", "hdfc", "fees", ("finance_charge_monthly_pct",),
        {s: {"finance_charge_monthly_pct": 1.99 if s in ("infinia", "diners-black") else 3.75} for s in HDFC_ALL},
        "docs/sources/hdfc/_shared/mitc-in-english.pdf",
        "docs/hdfc-pdf-verification.md, 'Finance charge is wrong on every card': MITC v4.3 states 3.75%/month, "
        "1.99%/month for Infinia / Diners Black (pine-labs-pro uses its own KFS; discontinued 6E cards not re-checked)",
    ),
    Claim(
        "axis-mitc-finance-forex", "axis", "fees", ("finance_charge_monthly_pct", "forex_markup_pct"),
        _axis(),
        "docs/sources/axis/_shared/mitc-credit-cards.pdf",
        "docs/axis-audit.md, 'Systematic findings (from the MITC per-card table, eff 20-Dec-2024)': per-card finance "
        "tiers 3.0 / 3.75 / 3.4 and forex (Magnus 2.0, Reserve 1.5, Indigo Premium 2.5, everyone else 3.5)",
    ),
    Claim(
        "sbi-mitc-finance-cash", "sbi", "fees", ("finance_charge_monthly_pct", "cash_advance_fee"),
        _same(SBI_ALL, finance_charge_monthly_pct=3.75, cash_advance_fee={"pct": 2.5, "min_inr": 500}),
        "docs/sources/sbi/_shared/mitc-english.pdf",
        "docs/sbi-audit.md, 'Systematic findings': finance charge 3.75%/month MITC-confirmed universal SBI rate; "
        "cash advance 2.5% or Rs 500 (MITC)",
    ),
    Claim(
        "icici-mitc-finance-forex", "icici", "fees", ("finance_charge_monthly_pct", "forex_markup_pct"),
        {s: {"finance_charge_monthly_pct": 3.75, "forex_markup_pct": ICICI_FOREX.get(s, 3.5)} for s in ICICI_ALL},
        {s: ("docs/sources/icici/_shared/mitc-cc-gk-t.pdf" if s == "amazon-pay" else "docs/sources/icici/_shared/mitc_cc.pdf")
         for s in ICICI_ALL},
        "docs/icici-audit.md, 'Systematic findings': finance 3.75%/month (MITC s.2) on every ICICI card; forex per the "
        "MITC exception list (times-black 1.49, amazon-pay 1.99, emeralde + private metal 2.0, everyone else 3.5); "
        "PDF per card from docs/sources/icici/_manifest.json",
    ),
    Claim(
        "rbl-soc-fee-forex", "rbl", "fees", ("annual_fee_inr", "forex_markup_pct"),
        _same("cookies icon insignia irctc platinum-maxima-plus play shoprite world-safari".split(),
              annual_fee_inr=AS_OF, forex_markup_pct=AS_OF),
        "docs/sources/rbl/_shared/CardsScheduleCharges.pdf",
        "commit a95bb94 'PDF-verify: RBL': the central Schedule of Charges gives all cards' annual fees + forex; "
        "Insignia/Icon/Maxima Plus/IRCTC corrected, World Safari/Shoprite/Play/Cookies confirmed",
        rev="a95bb94",
    ),
    Claim(
        "bob-features-tnc-earn", "bob", "rewards",
        ("base.rate", "base.per_inr", "accelerated.multiplier", "accelerated.effective_rate", "accelerated.cap_per_cycle"),
        {s: {"base.rate": AS_OF, "base.per_inr": AS_OF, "accelerated.multiplier": AS_OF,
             "accelerated.effective_rate": AS_OF, "accelerated.cap_per_cycle": cap} for s, cap in BOB_CAPS.items()},
        "docs/sources/bob/_shared/features-and-rewards-important-terms-conditions-01042026.pdf",
        "commit 9c8d0f1 'PDF-verify: BoB': core RP, accelerated 5X rates and per-cycle caps (Eterna/Tiara 5000, "
        "Premier 2000, Select/Easy 1000) verified against the central Features & Rewards T&C",
        rev="9c8d0f1", all_accelerators=True,
    ),
]


def get_path(rec: dict, path: str):
    """Value at a record-relative path; 'accelerated.x' reads the single accelerator."""
    head, _, rest = path.partition(".")
    node = rec.get(head)
    if head == "accelerated":
        if not isinstance(node, list) or len(node) != 1:
            return KeyError
        node = node[0]
        head, _, rest = rest.partition(".")
        node = node.get(head, KeyError) if isinstance(node, dict) else KeyError
        return node if not rest else KeyError
    if not rest:
        return node if head in rec else KeyError
    return node.get(rest, KeyError) if isinstance(node, dict) else KeyError


def open_record(doc: dict, section: str) -> tuple[int, dict] | tuple[None, None]:
    recs = [(i, r) for i, r in enumerate(doc.get(section) or []) if isinstance(r, dict) and r.get("effective_until") is None]
    return recs[0] if len(recs) == 1 else (None, None)


def todo_keys(text: str) -> dict[tuple[str, str], set[str]]:
    """Keys marked `TODO` per (section, effective_from) record; a nested marked
    line also marks its record-level parent key (e.g. pct -> cash_advance_fee)."""
    out: dict[tuple[str, str], set[str]] = {}
    sec = eff = parent = None
    for line in text.splitlines():
        m = re.match(r"^([a-z_]+):", line)
        if m:
            sec, eff, parent = m.group(1), None, None
            continue
        m = re.match(r"^  - effective_from:\s*['\"]?([0-9-]+)", line)
        if m and sec in ("fees", "rewards"):
            eff, parent = m.group(1), None
            continue
        m = re.match(r"^    ([a-z_]+):", line)
        if m:
            parent = m.group(1)
        if eff and sec in ("fees", "rewards") and re.search(r"\bTODO\b(?!\.md)", line):
            keys = out.setdefault((sec, eff), set())
            k = re.match(r"^\s*(?:-\s+)?([a-z_]+):", line)
            if k:
                keys.add(k.group(1))
            if parent:
                keys.add(parent)
    return out


def evaluate(claim: Claim, slug: str, rec: dict | None, old_rec: dict | None,
             todo: frozenset | set = frozenset()) -> tuple[list[str], str]:
    """Return (verified dotted paths, reason). Pure: no I/O. Empty list means skip.

    `todo`: keys of this record that carried a TODO marker before the cleanup."""
    if rec is None:
        return [], "no-open-record"
    src = rec.get("source") or {}
    if src.get("local_refs") or src.get("fields_verified"):
        return [], "has-evidence"
    if claim.all_accelerators and len(rec.get("accelerated") or []) != 1:
        return [], "accelerators-not-all-covered"
    want = claim.expect.get(slug)
    if want is None:
        return [], "not-in-claim"
    ok = []
    flagged = 0
    for f in claim.fields:
        if f not in want:
            continue
        if not claim.rev and ({f.split(".")[0], f.split(".")[-1]} & set(todo)):
            flagged += 1
            continue
        cur = get_path(rec, f)
        if cur is KeyError:
            continue
        exp = want[f]
        if exp is AS_OF:
            if old_rec is None:
                return [], "no-record-at-rev"
            exp = get_path(old_rec, f)
            if exp is KeyError or exp != cur:
                continue
        elif exp != cur:
            continue
        ok.append(f"{claim.section}.{f}")
    if claim.all_accelerators and len(ok) != len(claim.fields):
        return [], "value-changed"
    return ok, ("ok" if ok else ("todo-flagged" if flagged else "value-mismatch"))


def text_at(rev: str, rel: str) -> str | None:
    try:
        out = subprocess.run(["git", "show", f"{rev}:{rel}"], cwd=ROOT, capture_output=True, check=True)
    except subprocess.CalledProcessError:
        return None
    return out.stdout.decode("utf-8")


def load_at(rev: str, rel: str) -> dict | None:
    text = text_at(rev, rel)
    return yaml.safe_load(text) if text is not None else None


def make_yaml():
    from ruamel.yaml import YAML

    y = YAML()
    y.preserve_quotes = True
    y.width = 4096
    y.indent(mapping=2, sequence=4, offset=2)
    y.representer.add_representer(type(None), lambda r, d: r.represent_scalar("tag:yaml.org,2002:null", "null"))
    return y


def add_evidence(src, refs: list[str], paths: list[str]) -> None:
    from ruamel.yaml.comments import CommentedSeq

    keys = list(src.keys())
    anchor = next((k for k in ("confidence", "type", "retrieved_on") if k in keys), keys[-1])
    pos = keys.index(anchor) + 1
    fv = CommentedSeq(paths)
    src.insert(pos, "local_refs", CommentedSeq(refs))
    src.insert(pos + 1, "fields_verified", fv)
    if anchor in src.ca.items:
        # the comment / blank line that followed the anchor's value now follows
        # the last fields_verified item (a sequence keeps it per item, not per key)
        token = src.ca.items.pop(anchor)[2]
        if token is not None:
            fv.ca.items[len(paths) - 1] = [token, None]


def pure_insert(before: str, after: str, added_lines: int, blocks: int | None = None) -> bool:
    """Only evidence lines were inserted, each source's lines as one contiguous block."""
    a, b = before.splitlines(), after.splitlines()
    ops = difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes()
    inserts = [b[j1:j2] for tag, _i1, _i2, j1, j2 in ops if tag == "insert"]
    if any(tag in ("replace", "delete") for tag, *_ in ops):
        return False
    if sum(len(blk) for blk in inserts) != added_lines:
        return False
    if blocks is not None and len(inserts) != blocks:
        return False
    for blk in inserts:
        bodies = [ln.strip() for ln in blk]
        if bodies[0] != "local_refs:" or "fields_verified:" not in bodies:
            return False
        if not all(x in ("local_refs:", "fields_verified:") or x.startswith("- ") for x in bodies):
            return False
    return True


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--claims", default="", help="comma-separated claim ids (default: all)")
    ap.add_argument("--archive", default="", help="checkout holding the gitignored docs/sources PDFs")
    ap.add_argument("--list-skips", action="store_true")
    args = ap.parse_args(argv)
    only = {c.strip() for c in args.claims.split(",") if c.strip()}
    claims = [c for c in CLAIMS if not only or c.id in only]

    # card file -> section -> (refs, paths, claim ids)
    plan: dict[Path, dict[str, tuple[list, list, list]]] = defaultdict(dict)
    stats: Counter = Counter()
    skips: list[str] = []
    for claim in claims:
        for slug in claim.expect:
            path = ROOT / "data" / "cards" / claim.issuer / f"{slug}.yaml"
            if not path.exists():
                stats["no-card-file"] += 1
                skips.append(f"{claim.id} {slug}: no-card-file")
                continue
            ref = claim.ref_for(slug)
            if args.archive and not (Path(args.archive) / ref).exists():
                stats["ref-missing-in-archive"] += 1
                skips.append(f"{claim.id} {slug}: {ref} not in archive")
                continue
            rel = path.relative_to(ROOT).as_posix()
            doc = yaml.safe_load(path.read_text(encoding="utf-8"))
            _, rec = open_record(doc, claim.section)
            old_rec = None
            if claim.rev and rec is not None:
                old_doc = load_at(claim.rev, rel) or {}
                old_rec = next((r for r in old_doc.get(claim.section) or []
                                if str(r.get("effective_from")) == str(rec.get("effective_from"))), None)
            todo: set[str] = set()
            if not claim.rev and rec is not None:
                pre = text_at(CLEANUP_PRE_REV, rel)
                todo = todo_keys(pre).get((claim.section, str(rec.get("effective_from"))), set()) if pre else set()
            paths, reason = evaluate(claim, slug, rec, old_rec, todo)
            stats[reason] += 1
            if not paths:
                skips.append(f"{claim.id} {slug}: {reason}")
                continue
            if len(paths) < len([f for f in claim.fields if f in claim.expect[slug]]):
                stats["partial"] += 1
                skips.append(f"{claim.id} {slug}: partial ({', '.join(paths)} only)")
            refs, fv, ids = plan[path].setdefault(claim.section, ([], [], []))
            if ref not in refs:
                refs.append(ref)
            fv.extend(p for p in paths if p not in fv)
            ids.append(claim.id)

    y = make_yaml()
    refused = []
    for path, sections in sorted(plan.items()):
        raw = path.read_bytes().decode("utf-8")
        newline = "\r\n" if "\r\n" in raw else "\n"
        text = raw.replace("\r\n", "\n")
        doc = y.load(text)
        added = 0
        for section, (refs, fv, _ids) in sections.items():
            i, _ = open_record(yaml.safe_load(text), section)
            add_evidence(doc[section][i]["source"], refs, fv)
            added += 2 + len(refs) + len(fv)
            stats["sources"] += 1
            stats["fields_verified"] += len(fv)
        buf = io.StringIO()
        y.dump(doc, buf)
        out = buf.getvalue()
        if not pure_insert(text, out, added, blocks=len(sections)):
            refused.append(path.relative_to(ROOT).as_posix())
            continue
        stats["files"] += 1
        if args.apply:
            path.write_bytes(out.replace("\n", newline).encode("utf-8"))

    print(("Applied" if args.apply else "Dry run") + " — claims: " + ", ".join(c.id for c in claims))
    for k in sorted(stats):
        print(f"  {k:28} {stats[k]}")
    if refused:
        print("  refused (round-trip would change other lines; edit by hand): " + ", ".join(refused))
    if args.list_skips:
        for s in skips:
            print("  skip " + s)
    return 0


if __name__ == "__main__":
    sys.exit(main())
