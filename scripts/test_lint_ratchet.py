"""scripts/test_lint_ratchet.py — dataset-tooling tests (no network, no writes to data/).

Plain-assert functions (pytest collects them) that also run when the file is
invoked directly, which is how CI runs every scripts/test_*.py.
"""
import json
import sys
import tempfile
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import validate  # noqa: E402

TODAY = date(2026, 11, 1)


def _card(card_id="hdfc-test", issuer="hdfc", network="visa", program=None,
          verified="2026-10-01", retrieved="2026-10-01"):
    rec = {"effective_from": "2024-01-01", "effective_until": None,
           "source": {"url": "https://example.test/x", "retrieved_on": retrieved}}
    if program:
        rec["loyalty_program"] = program
    return (Path(card_id + ".yaml"),
            {"id": card_id, "issuer": issuer, "network": network,
             "rewards": [rec], "metadata": {"last_verified_on": verified}})


def _baseline(tmp, n):
    p = Path(tmp) / "lint-baseline.json"
    p.write_text(json.dumps({"warnings": n}), encoding="utf-8")
    return p


def test_more_warnings_than_baseline_fails():
    with tempfile.TemporaryDirectory() as tmp:
        code, msg = validate.ratchet_result(5, _baseline(tmp, 3))
    assert code == 1, (code, msg)
    assert "5" in msg and "3" in msg


def test_fewer_warnings_passes_and_says_lower_the_baseline():
    with tempfile.TemporaryDirectory() as tmp:
        code, msg = validate.ratchet_result(1, _baseline(tmp, 3))
    assert code == 0, (code, msg)
    assert "lower the baseline" in msg


def test_equal_warnings_passes_quietly():
    with tempfile.TemporaryDirectory() as tmp:
        code, msg = validate.ratchet_result(3, _baseline(tmp, 3))
    assert code == 0 and "lower the baseline" not in msg


def test_missing_baseline_fails():
    with tempfile.TemporaryDirectory() as tmp:
        code, msg = validate.ratchet_result(0, Path(tmp) / "nope.json")
    assert code == 1 and "baseline" in msg


def test_orphan_loyalty_program_is_reported():
    cards = [_card(program="used-prog")]
    programs = {"used-prog": {}, "orphan-prog": {}}
    out = validate.find_orphans(cards, {"hdfc": {}}, {"visa": {}}, programs)
    assert any("orphan-prog" in w and "loyalty" in w for w in out), out
    assert not any("used-prog" in w for w in out), out
    assert all(w.startswith("[warn]") for w in out)


def test_orphan_issuer_and_network_are_reported():
    cards = [_card()]
    out = validate.find_orphans(cards, {"hdfc": {}, "ghost-bank": {}}, {"visa": {}, "diners": {}}, {})
    assert any("ghost-bank" in w for w in out), out
    assert any("diners" in w for w in out), out
    assert not any("'hdfc'" in w or "'visa'" in w for w in out), out


def test_stale_card_is_reported():
    out = validate.find_stale([_card(verified="2025-01-01", retrieved="2025-01-01")], 365, TODAY)
    assert len(out) == 1 and "hdfc-test" in out[0] and out[0].startswith("[warn]"), out


def test_fresh_card_is_not_reported():
    assert validate.find_stale([_card(verified="2026-10-20", retrieved="2026-10-20")], 365, TODAY) == []


def test_freshest_of_verified_and_retrieved_wins():
    # verified long ago but a source was retrieved recently: not stale
    assert validate.find_stale([_card(verified="2020-01-01", retrieved="2026-10-20")], 365, TODAY) == []


def _schema_dir(tmp, version, changelog_top):
    root = Path(tmp)
    (root / "schema").mkdir()
    (root / "docs").mkdir()
    if version is not None:
        (root / "schema" / "VERSION").write_text(version + "\n", encoding="utf-8")
    (root / "docs" / "SCHEMA_CHANGELOG.md").write_text(
        "# Schema changelog\n\n## [Unreleased]\n\n## [" + changelog_top + "] - 2026-11-01\n\n- x\n",
        encoding="utf-8")
    return root


def test_schema_version_matches_changelog_ok():
    with tempfile.TemporaryDirectory() as tmp:
        assert validate.check_schema_version(_schema_dir(tmp, "1.2.3", "1.2.3")) == []


def test_schema_version_changelog_mismatch_is_error():
    with tempfile.TemporaryDirectory() as tmp:
        errs = validate.check_schema_version(_schema_dir(tmp, "1.2.3", "1.0.0"))
    assert len(errs) == 1 and "1.0.0" in errs[0] and "1.2.3" in errs[0], errs


def test_schema_version_not_semver_is_error():
    with tempfile.TemporaryDirectory() as tmp:
        errs = validate.check_schema_version(_schema_dir(tmp, "v1", "1.0.0"))
    assert errs and "semver" in errs[0], errs


def test_schema_version_missing_is_error():
    with tempfile.TemporaryDirectory() as tmp:
        assert validate.check_schema_version(_schema_dir(tmp, None, "1.0.0"))


def test_real_repo_schema_version_is_consistent():
    assert validate.check_schema_version() == []


def test_warn_stale_non_integer_is_a_usage_error_not_a_traceback():
    import subprocess
    script = Path(__file__).resolve().parent / "validate.py"
    r = subprocess.run([sys.executable, str(script), "--warn-stale", "abc"],
                       capture_output=True, text=True)
    assert r.returncode == 2
    assert "Traceback" not in r.stderr
    assert "--warn-stale" in r.stderr and "integer" in r.stderr


def test_malformed_date_is_none_not_a_crash():
    from validate_extras import as_date
    assert as_date("TBD") is None
    assert as_date("2026-13-40") is None
    assert as_date("2026-10-01") == date(2026, 10, 1)
    assert validate.find_stale([_card(verified="TBD", retrieved="TBD")], 365, TODAY) == []


def test_malformed_date_ends_in_the_error_list_not_a_traceback():
    # A temp copy of the reference data plus one card whose last_verified_on is "TBD":
    # the run must finish, print the schema error it recorded, and exit non-zero.
    import contextlib
    import io
    import shutil
    import yaml
    real = Path(__file__).resolve().parent.parent / "data"
    with tempfile.TemporaryDirectory() as tmp:
        data = Path(tmp) / "data"
        for sub in ("issuers", "networks", "loyalty_programs", "channels"):
            if (real / sub).exists():
                shutil.copytree(real / sub, data / sub)
        card_path = sorted((real / "cards").rglob("*.yaml"))[0]
        card = yaml.safe_load(card_path.read_text(encoding="utf-8"))
        card["metadata"]["last_verified_on"] = "TBD"
        out = data / "cards" / card_path.parent.name / card_path.name
        out.parent.mkdir(parents=True)
        out.write_text(yaml.safe_dump(card, sort_keys=False, allow_unicode=True), encoding="utf-8")
        saved = validate.ROOT, validate.DATA_DIR, sys.argv
        validate.ROOT, validate.DATA_DIR, sys.argv = Path(tmp), data, ["validate.py"]
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
                code = validate.main()
        finally:
            validate.ROOT, validate.DATA_DIR, sys.argv = saved
    assert code != 0, buf.getvalue()[-2000:]
    assert "last_verified_on" in buf.getvalue() and "TBD" in buf.getvalue(), buf.getvalue()[-2000:]


if __name__ == "__main__":
    failed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                print(f"ok   {name}")
            except Exception as exc:  # noqa: BLE001
                failed += 1
                print(f"FAIL {name}: {type(exc).__name__}: {exc}")
    sys.exit(1 if failed else 0)
