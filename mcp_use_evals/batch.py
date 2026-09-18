"""Aggregate CI shards with explicit missing-shard and error handling."""

import json
import os
import sys
from pathlib import Path

from .report import gate, write_report


def batch_report(jobs: Path, expected: list[str], minimum: float) -> tuple[str, bool]:
    if not expected or not 0 <= minimum <= 100:
        raise ValueError("Expected tasks and a threshold in [0, 100] are required")
    passed = failed = invalid = missing = 0
    healthy = True
    lines = [
        "# MCP SDK evaluation batch",
        "",
        "| Task | Passes | Failures | Infra |",
        "| --- | --- | --- | --- |",
    ]
    for name in expected:
        if Path(name).name != name or name in (".", ".."):
            raise ValueError(f"Invalid shard name: {name}")
        path = jobs / name
        try:
            summary = write_report(path)
        except (OSError, ValueError, KeyError, TypeError):
            missing += 1
            healthy = False
            lines.append(f"| {name} | missing/malformed | — | — |")
            continue
        passed += summary["passed"]
        failed += summary["failed"]
        invalid += summary["invalid"]
        healthy &= gate(summary, 0)
        lines.append(
            f"| {name} | {summary['passed']} | {summary['failed']} | {summary['invalid']} |"
        )
    rate = 100 * passed / (passed + failed) if passed + failed else None
    lines.extend(
        [
            "",
            f"Passes: {passed}/{passed + failed}. Pass rate: {f'{rate:.1f}%' if rate is not None else 'N/A'}.",
            f"Required: {minimum:g}%. Invalid: {invalid}. Missing shards: {missing}.",
            "",
            "Download the eval artifacts and run `uv run harbor view jobs` for trajectories and agent analysis.",
            "",
        ]
    )
    return "\n".join(lines), healthy and rate is not None and rate >= minimum


def main() -> None:
    jobs = Path(sys.argv[1])
    report, passed = batch_report(
        jobs,
        json.loads(os.environ["EXPECTED_TASKS"]),
        float(os.environ["MIN_PASS_RATE"]),
    )
    jobs.mkdir(parents=True, exist_ok=True)
    (jobs / "batch-report.md").write_text(report)
    if target := os.getenv("GITHUB_STEP_SUMMARY"):
        with open(target, "a") as stream:
            stream.write(report)
    print(report)
    raise SystemExit(
        0 if passed and os.getenv("EVAL_STATUS", "success") == "success" else 1
    )


if __name__ == "__main__":
    main()
