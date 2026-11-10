"""scripts/test_audit_scripts.py — audit_stamps / audit_uncapped read data from the repo, not the CWD.

Inline cards in a temp dir; never writes into the real data/.
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

import audit_stamps
import audit_uncapped

HERE = Path(__file__).resolve().parent


def cards_dir(cards: dict) -> Path:
    root = Path(tempfile.mkdtemp(prefix="audit_test_"))
    for rel, doc in cards.items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")
    return root


def rec(accel, currency="cashback"):
    return {"effective_until": None, "currency": currency,
            "base": {"rate": 1, "per_inr": 100}, "accelerated": accel}


# 1. The default data dir is the repo's, wherever the script is run from.
assert audit_stamps.CARDS_DIR == HERE.parent / "data" / "cards"
assert audit_uncapped.CARDS_DIR == HERE.parent / "data" / "cards"
out = subprocess.run([sys.executable, str(HERE / "audit_uncapped.py")], capture_output=True, text=True,
                     cwd=tempfile.gettempdir(), env=dict(os.environ, PYTHONIOENCODING="utf-8"))
assert out.returncode == 0 and not out.stdout.startswith("0 "), out.stdout[:200] + out.stderr[-500:]


# 2. audit_stamps: a stamp later than every source is listed.
root = cards_dir({
    "acme/late.yaml": {"id": "acme-late", "metadata": {"last_verified_on": "2026-10-01"},
                       "fees": [{"source": {"retrieved_on": "2026-09-01"}}]},
    "acme/ok.yaml": {"id": "acme-ok", "metadata": {"last_verified_on": "2026-09-01"},
                     "fees": [{"source": {"retrieved_on": "2026-09-01"}}]},
})
assert [r[0] for r in audit_stamps.find_rows(root)] == ["acme-late"]
shutil.rmtree(root)


# 3. audit_uncapped: an authored card_attributable_rate of 0 is the card's rate; it must
#    not fall through to the receipt-visible effective_rate.
root = cards_dir({
    "acme/zero.yaml": {"id": "acme-zero", "status": "active", "rewards": [rec([
        {"category": "x", "card_attributable_rate": 0, "effective_rate": 10}])]},
    "acme/hot.yaml": {"id": "acme-hot", "status": "active", "rewards": [rec([
        {"category": "y", "effective_rate": 10}])]},
})
assert [r[0] for r in audit_uncapped.find_rows(root)] == ["acme-hot"]
shutil.rmtree(root)

print("OK: audit script tests passed")
