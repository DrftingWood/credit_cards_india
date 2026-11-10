"""scripts/test_crawl_diff.py — presence-checker unit tests (no network)."""
from crawl_diff import expectations_for, check_page

CARD = {
    "id": "test-card",
    "fees": [{"effective_until": None, "annual_fee_inr": 2999, "joining_fee_inr": 2999,
              "forex_markup_pct": 3.5, "source": {"url": "https://x"}}],
    "rewards": [{"effective_until": None, "base": {"rate": 4, "per_inr": 150}}],
}

exp = expectations_for(CARD)
assert ("annual_fee_inr", "2999") in [(e.field, e.needle) for e in exp]
assert any(e.field == "base_rate" for e in exp)

page = "Annual fee: Rs. 2,999 (plus GST). Earn 4 Reward Points per Rs. 150. Forex markup 3.5%."
res = check_page(page, exp)
assert all(r.status == "MATCHED" for r in res), res

conflict = "Annual fee: Rs. 3,499. Earn 4 Reward Points per Rs. 150."
res2 = {r.field: r.status for r in check_page(conflict, exp)}
assert res2["annual_fee_inr"] == "CONFLICTING-NUMBER-NEARBY"
print("OK: crawl_diff core tests passed")

# Needles match on digit boundaries: fee 500 is not inside "15,000", forex 3.5 is
# not inside "13.5", and a rate of 1 is not inside "2026".
import shutil  # noqa: E402
import sys  # noqa: E402
import tempfile  # noqa: E402
from pathlib import Path  # noqa: E402

import crawl_diff  # noqa: E402
from crawl_diff import Expectation  # noqa: E402


def status(text, exp):
    return check_page(text, [exp])[0].status


fee500 = Expectation("annual_fee_inr", "500", "annual fee", None)
assert status("Annual fee: Rs. 15,000 + GST", fee500) != "MATCHED"
assert status("Annual fee: Rs. 5,000", fee500) != "MATCHED"
assert status("Annual fee: Rs. 500 + GST", fee500) == "MATCHED"
assert status("Annual fee: Rs.500.", fee500) == "MATCHED"
fx = Expectation("forex_markup_pct", "3.5", "markup", None)
assert status("Forex markup 13.5% on all", fx) != "MATCHED"
assert status("Forex markup 3.55%", fx) != "MATCHED"
assert status("Forex markup 3.5%.", fx) == "MATCHED"
rate1 = Expectation("base_rate", "1", "per", "100")
assert status("Valid till 2026: 2 points per 100 spent", rate1) == "NOT-FOUND"
assert status("Earn 1 point per Rs 100", rate1) == "MATCHED"
assert status("Earn 21 points per Rs 1000", rate1) == "NOT-FOUND"
fee2999 = Expectation("annual_fee_inr", "2999", "annual fee", None)
assert status("Annual fee: Rs. 12,999", fee2999) != "MATCHED"


# A page that could not be checked (non-2xx, or no Playwright) must not exit 0.
def issuer_root():
    root = Path(tempfile.mkdtemp(prefix="crawl_diff_test_"))
    (root / "data" / "cards" / "acme").mkdir(parents=True)
    (root / "data" / "cards" / "acme" / "gold.yaml").write_text(
        "id: acme-gold\nstatus: active\nfees:\n- effective_until: null\n  annual_fee_inr: 500\n"
        "  source:\n    url: https://acme.example/gold\n", encoding="utf-8")
    return root


root = issuer_root()
code = crawl_diff.run_issuer("acme", "2026-11-10", root=root,
                             render=lambda url: ("Annual fee Rs 500", url, 404))
report = (root / "docs" / "drift" / "acme-2026-11-10.md").read_text(encoding="utf-8")
assert code != 0 and "404" in report, (code, report)
code = crawl_diff.run_issuer("acme", "2026-11-10", root=root,
                             render=lambda url: ("Annual fee Rs 500", url, 200))
assert code == 0, code
shutil.rmtree(root)

root = issuer_root()
saved = sys.modules.get("playwright")
sys.modules["playwright"] = None  # makes `import playwright...` raise ImportError
try:
    code = crawl_diff.run_issuer("acme", "2026-11-10", root=root)
finally:
    if saved is None:
        sys.modules.pop("playwright", None)
    else:
        sys.modules["playwright"] = saved
assert code != 0, code
shutil.rmtree(root)
print("OK: crawl_diff boundary and fetch-failure tests passed")
