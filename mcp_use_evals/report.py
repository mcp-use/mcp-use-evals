"""Small CI adapter over Harbor artifacts; never ask an LLM to compute scores."""

import json
from collections import Counter
from pathlib import Path


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def summarize(job_dir: Path) -> dict:
    job = read_json(job_dir / "result.json")
    rows = []
    for path in sorted(job_dir.glob("*/result.json")):
        trial = read_json(path)
        grade_path = path.parent / "verifier/grade.json"
        grade = read_json(grade_path) if grade_path.exists() else {}
        reward = ((trial.get("verifier_result") or {}).get("rewards") or {}).get(
            "reward"
        )
        error = trial.get("exception_info")
        valid = (
            not error
            and bool(trial.get("finished_at"))
            and type(reward) in (float, int)
            and reward in (0, 1)
            and type(grade.get("contractPass")) is bool
            and type(grade.get("scoredForPassRate")) is bool
            and reward == int(grade["contractPass"])
        )
        outcome = (
            "invalid"
            if not valid
            else "static-pass"
            if not grade["scoredForPassRate"] and reward == 1
            else "static-fail"
            if not grade["scoredForPassRate"]
            else "pass"
            if reward == 1
            else "fail"
        )
        rows.append(
            {
                "trial": path.parent.name,
                "task": trial["task_name"],
                "outcome": outcome,
                "failure": (error or {}).get("exception_type")
                or grade.get("failureCode"),
                "sdk_path": grade.get("sdkPath"),
                "sdk": grade.get("sdk"),
                "agent": trial.get("agent_info"),
                "usage": trial.get("agent_result"),
            }
        )
    counts = Counter(row["outcome"] for row in rows)
    eligible = counts["pass"] + counts["fail"]
    expected = job.get("n_total_trials", 0)
    complete = (
        expected > 0
        and len(rows) == expected
        and bool(job.get("finished_at"))
        and not any(
            job.get("stats", {}).get(k, 0)
            for k in ("n_pending_trials", "n_running_trials", "n_cancelled_trials")
        )
    )
    return {
        "job": job_dir.name,
        "expected": expected,
        "completed": len(rows),
        "complete": complete,
        "passed": counts["pass"],
        "failed": counts["fail"],
        "invalid": counts["invalid"],
        "static_passed": counts["static-pass"],
        "static_failed": counts["static-fail"],
        "pass_rate": 100 * counts["pass"] / eligible if eligible else None,
        "trials": rows,
    }


def gate(summary: dict, min_pass_rate: float) -> bool:
    if not summary["complete"] or summary["invalid"]:
        return False
    return summary["pass_rate"] is not None and summary["pass_rate"] >= min_pass_rate


def write_report(job_dir: Path) -> dict:
    summary = summarize(job_dir)
    rate = summary["pass_rate"]
    formatted = f"{rate:.1f}%" if rate is not None else "N/A"
    lines = [
        f"# MCP SDK evals: {summary['job']}",
        "",
        f"Pass rate: **{formatted}** ({summary['passed']} passed, {summary['failed']} failed).",
        f"Infrastructure-invalid: {summary['invalid']}. "
        f"Results: {summary['completed']}/{summary['expected']}. "
        f"Batch complete: {summary['complete']}.",
        f"Static adoption (excluded): {summary['static_passed']} passed, "
        f"{summary['static_failed']} failed.",
        "",
        "| Task | Result | First failure | SDK imports | Requested package version | Adopted |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for row in summary["trials"]:
        sdk = row.get("sdk") or {}
        installed = sdk.get("installedVersion") or "unknown"
        adopted = sdk.get("importedRequestedSdk", "unknown")
        lines.append(
            f"| {row['task']} | {row['outcome']} | {row['failure'] or '—'} | {row['sdk_path'] or '—'} | {installed} | {adopted} |"
        )
    lines.extend(
        [
            "",
            "Correctness comes only from the deterministic verifier. "
            "Agent analysis is qualitative and cannot change these numbers.",
            "",
        ]
    )
    (job_dir / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    (job_dir / "report.md").write_text("\n".join(lines))
    return summary
