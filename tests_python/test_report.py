import json
from pathlib import Path

import pytest

from mcp_use_evals.batch import batch_report
from mcp_use_evals.report import gate, summarize, write_report


def make_job(path: Path, outcomes: list[str], *, expected=None, finished=True):
    path.mkdir(parents=True, exist_ok=True)
    (path / "result.json").write_text(
        json.dumps(
            {
                "n_total_trials": len(outcomes) if expected is None else expected,
                "finished_at": "2026-09-18T00:00:00Z" if finished else None,
                "stats": {},
            }
        )
    )
    for i, outcome in enumerate(outcomes):
        trial = path / f"trial-{i}"
        (trial / "verifier").mkdir(parents=True)
        passed = outcome in ("pass", "static-pass")
        invalid = outcome == "invalid"
        (trial / "result.json").write_text(
            json.dumps(
                {
                    "task_name": "task",
                    "finished_at": "2026-09-18T00:00:00Z",
                    "exception_info": {"exception_type": "RuntimeError"}
                    if invalid
                    else None,
                    "verifier_result": {"rewards": {"reward": int(passed)}},
                }
            )
        )
        if not invalid:
            (trial / "verifier/grade.json").write_text(
                json.dumps(
                    {
                        "contractPass": passed,
                        "scoredForPassRate": not outcome.startswith("static"),
                    }
                )
            )
    return path


def test_infra_and_static_trials_never_enter_pass_rate(tmp_path):
    summary = summarize(make_job(tmp_path, ["pass", "fail", "invalid", "static-pass"]))
    assert summary["pass_rate"] == 50
    assert summary["invalid"] == 1
    assert summary["static_passed"] == 1
    assert not gate(summary, 0)


@pytest.mark.parametrize(
    "outcomes,expected,finished",
    [
        ([], 0, True),
        (["pass"], 2, True),
        (["pass"], 1, False),
        (["pass", "pass"], 1, True),
    ],
)
def test_empty_partial_and_unfinished_batches_fail(
    tmp_path, outcomes, expected, finished
):
    summary = summarize(
        make_job(tmp_path, outcomes, expected=expected, finished=finished)
    )
    assert not gate(summary, 0)


@pytest.mark.parametrize(
    "mutation", ["no-grade", "no-reward", "null-rewards", "mismatched-grade"]
)
def test_missing_or_inconsistent_verifier_evidence_is_invalid(tmp_path, mutation):
    make_job(tmp_path, ["pass"])
    if mutation == "no-grade":
        (tmp_path / "trial-0/verifier/grade.json").unlink()
    elif mutation == "mismatched-grade":
        (tmp_path / "trial-0/verifier/grade.json").write_text(
            json.dumps(
                {
                    "contractPass": False,
                    "scoredForPassRate": True,
                }
            )
        )
    else:
        p = tmp_path / "trial-0/result.json"
        data = json.loads(p.read_text())
        data["verifier_result"] = None if mutation == "no-reward" else {"rewards": None}
        p.write_text(json.dumps(data))
    summary = summarize(tmp_path)
    assert summary["invalid"] == 1
    assert not gate(summary, 0)


def test_threshold_uses_unrounded_rate_and_analysis_does_not_affect_it(tmp_path):
    make_job(tmp_path, ["pass", "pass", "fail"])
    (tmp_path / "analysis.json").write_text('{"score": 100}')
    summary = write_report(tmp_path)
    assert not gate(summary, 66.7)
    assert gate(summary, 66.6)
    assert "66.7%" in (tmp_path / "report.md").read_text()


def test_oracle_requires_static_tasks_to_pass(tmp_path):
    summary = summarize(make_job(tmp_path, ["pass", "static-fail"]))
    assert gate(summary, 100)
    assert not gate(summary, 100, oracle=True)


def test_batch_weights_trials_and_rejects_missing_shards(tmp_path):
    make_job(tmp_path / "one", ["pass", "pass", "fail"])
    make_job(tmp_path / "two", ["pass"])
    text, passed = batch_report(tmp_path, ["one", "two"], 75)
    assert passed
    assert "3/4" in text
    assert not batch_report(tmp_path, ["one", "two"], 76)[1]
    assert not batch_report(tmp_path, ["one", "two", "missing"], 0)[1]


def test_analysis_jobs_are_not_counted_as_eval_trials(tmp_path):
    make_job(tmp_path / "one", ["fail"])
    make_job(tmp_path / "analysis", ["pass"] * 5)
    text, passed = batch_report(tmp_path, ["one"], 1)
    assert not passed
    assert "0/1" in text
