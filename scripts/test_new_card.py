"""scripts/test_new_card.py — the scaffold passes the card schema and stays inside data/cards.

Scaffolds into a temp copy of the needed dirs; never writes into the real data/.
"""
import shutil
import tempfile
from pathlib import Path

import yaml

import new_card
from validate import _normalize, load_schema, validator_for

VALIDATOR = validator_for(load_schema("card"))
ROOTS: list[Path] = []


def scaffold_root() -> Path:
    root = Path(tempfile.mkdtemp(prefix="new_card_test_"))
    ROOTS.append(root)
    (root / "data" / "issuers").mkdir(parents=True)
    (root / "data" / "issuers" / "acme.yaml").write_text("id: acme\n", encoding="utf-8")
    (root / "data" / "loyalty_programs").mkdir(parents=True)
    return root


# 1. A fresh scaffold is schema-valid and written with LF line endings. The name
#    carries a colon and quotes so the template must quote it, not paste it raw.
root = scaffold_root()
name = 'Acme "Gold": Card'
assert new_card.main(["new_card.py", "acme", "gold", name], root=root) == 0
out = root / "data" / "cards" / "acme" / "gold.yaml"
raw = out.read_bytes()
assert b"\r\n" not in raw
instance = _normalize(yaml.safe_load(raw.decode("utf-8")))
errors = [f"{'/'.join(map(str, e.absolute_path))}: {e.message}" for e in VALIDATOR.iter_errors(instance)]
assert not errors, errors
assert instance["name"] == name and instance["id"] == "acme-gold"


# 2. A slug or issuer outside [a-z0-9-]+ is rejected before anything is written,
#    so "../x" cannot escape data/cards.
for issuer, slug in [("acme", "../x"), ("../acme", "x"), ("acme", "Gold"), ("acme", "a/b"), ("acme", "")]:
    root = scaffold_root()
    before = sorted(p for p in root.rglob("*"))
    assert new_card.main(["new_card.py", issuer, slug, "X"], root=root) == 2, (issuer, slug)
    assert sorted(p for p in root.rglob("*")) == before, (issuer, slug)

for r in ROOTS:
    shutil.rmtree(r)
print("OK: new_card tests passed")
