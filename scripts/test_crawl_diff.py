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
