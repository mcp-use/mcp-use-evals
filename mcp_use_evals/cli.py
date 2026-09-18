"""Thin convenience commands; all trials and analysis run through Harbor's SDK."""

import argparse
import asyncio
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import yaml
from dotenv import load_dotenv
from harbor.analyze.analyzer import run_analyze
from harbor.job import Job
from harbor.models.environment_type import EnvironmentType
from harbor.models.job.config import JobConfig

from .report import gate, write_report
from .tasks import ROOT, prepare


def positive(value: str) -> int:
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("must be at least 1")
    return number


def percentage(value: str) -> float:
    number = float(value)
    if not 0 <= number <= 100:
        raise argparse.ArgumentTypeError("must be between 0 and 100")
    return number


def job_name(value: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*", value):
        raise argparse.ArgumentTypeError("use a simple job name, not a path")
    return value


def build_config(args: argparse.Namespace, dataset: Path) -> JobConfig:
    data = yaml.safe_load(args.config.read_text()) if args.config else {}
    config = JobConfig.model_validate(data)
    if args.attempts:
        config.n_attempts = args.attempts
    if args.concurrency:
        config.n_concurrent_trials = args.concurrency
    # The wrapper intentionally targets this repo's task suite. Arbitrary
    # datasets/multi-agent experiments can use the Harbor CLI directly.
    available = {p.name for p in dataset.iterdir() if p.is_dir()}
    selected = set(args.task or available)
    unknown = selected - available
    if unknown:
        raise ValueError(f"Unknown task(s): {', '.join(sorted(unknown))}")
    if not selected:
        raise ValueError("No tasks selected")
    from harbor.models.trial.config import TaskConfig

    config.datasets = []
    config.tasks = [
        TaskConfig(path=dataset / name, source="sdk-v3") for name in sorted(selected)
    ]
    for agent in config.agents:
        agent.skills = [
            str(Path(s).resolve()) if Path(s).exists() else s for s in agent.skills
        ]
        agent.skills.extend(str(p.resolve()) for p in args.skill)
    config.jobs_dir = args.jobs_dir.resolve()
    config.job_name = args.job_name or (
        f"{args.command}-{datetime.now(timezone.utc):%Y%m%dT%H%M%SZ}-{uuid4().hex[:6]}"
    )
    return config


def github_outputs(job_dir: Path, summary: dict | None = None) -> None:
    if output := os.getenv("GITHUB_OUTPUT"):
        with open(output, "a") as stream:
            stream.write(f"run-dir={job_dir}\nreport={job_dir / 'report.md'}\n")
            if summary is not None:
                rate = summary["pass_rate"]
                stream.write(f"pass-rate={rate if rate is not None else 'null'}\n")
    if summary is not None and (output := os.getenv("GITHUB_STEP_SUMMARY")):
        with open(output, "a") as stream:
            stream.write((job_dir / "report.md").read_text())


async def analyze(path: Path, args: argparse.Namespace) -> bool:
    report, analysis_dir = await run_analyze(
        path=path,
        agent="codex",
        model=args.analysis_model,
        rubric_path=ROOT / "configs/analysis-rubric.toml",
        config_path=ROOT / "configs/analysis.yaml",
        environment=EnvironmentType.DOCKER,
        n_concurrent=args.analysis_concurrency,
        jobs_dir=path.parent / "analysis",
        job_name=f"{path.name}-{uuid4().hex[:6]}",
    )
    # Harbor also writes each analysis into its source trial's analysis.json,
    # which is displayed by `harbor view` alongside the original trajectory.
    (path / "analysis.json").write_text(report.model_dump_json(indent=2))
    lines = ["# Agent analysis (unscored)", ""]
    for result in report.results:
        lines.extend(
            [f"## {result.trial_name}", "", result.summary or result.error or "", ""]
        )
        for name, check in result.checks.items():
            lines.append(f"- **{name}** ({check.outcome.value}): {check.explanation}")
        lines.append("")
    (path / "analysis.md").write_text("\n".join(lines))
    if output := os.getenv("GITHUB_STEP_SUMMARY"):
        with open(output, "a") as stream:
            stream.write("\n".join(lines))
    print(f"Analysis: {analysis_dir}; readable report: {path / 'analysis.md'}")
    return bool(report.results) and not any(result.error for result in report.results)


async def execute(args: argparse.Namespace) -> int:
    if args.command == "archive":
        from .history import archive

        print(archive(args.path, args.history))
        return 0
    if args.command == "synthesize":
        from .synthesis import synthesize

        return await synthesize(args)
    if args.command == "prepare":
        print(
            prepare(
                sdk_package=args.sdk_package,
                sdk_name=args.sdk_name or args.sdk_package,
                selected=args.task,
            )
        )
        return 0
    if args.command == "report":
        summary = write_report(args.path)
        github_outputs(args.path.resolve(), summary)
        print((args.path / "report.md").read_text())
        return 0 if gate(summary, args.min_pass_rate) else 1
    if args.command == "analyze":
        return 0 if await analyze(args.path.resolve(), args) else 1

    config = build_config(
        args,
        prepare(
            sdk_package=args.sdk_package,
            sdk_name=args.sdk_name or args.sdk_package,
            selected=args.task,
        ),
    )
    job_dir = config.jobs_dir / config.job_name
    if job_dir.exists():
        raise ValueError(
            f"Job already exists: {job_dir}. Use harbor jobs resume -p {job_dir}"
        )
    from .history import manifest

    job_dir.mkdir(parents=True)
    manifest(job_dir, args.sdk_package, args.sdk_name or args.sdk_package, config)
    github_outputs(job_dir)  # Available even if startup or a later step fails.
    print(f"Harbor job: {job_dir}", flush=True)
    execution_ok = True
    summary = None
    try:
        job = await Job.create(config)
        await job.run()
    except Exception as exc:
        execution_ok = False
        (job_dir / "execution-error.txt").write_text(str(exc))
        print(f"Execution incomplete: {exc}", file=sys.stderr)
    finally:
        if (job_dir / "result.json").exists():
            try:
                summary = write_report(job_dir)
                github_outputs(job_dir, summary)
                print((job_dir / "report.md").read_text())
            except (OSError, ValueError, KeyError, TypeError) as exc:
                execution_ok = False
                (job_dir / "report-error.txt").write_text(str(exc))
                print(f"Report incomplete: {exc}", file=sys.stderr)

    # Run analysis even when deterministic checks fail. Keep its error visible
    # without changing the scores or losing the already-written scorecard.
    analysis_ok = True
    if args.command == "run" and not args.no_analyze:
        try:
            analysis_ok = await analyze(job_dir, args)
        except Exception as exc:
            analysis_ok = False
            (job_dir / "analysis-error.txt").write_text(str(exc))
            print(f"Analysis failed: {exc}", file=sys.stderr)
    return (
        0
        if execution_ok
        and summary is not None
        and gate(summary, args.min_pass_rate)
        and analysis_ok
        else 1
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", type=Path, default=ROOT / ".env")
    commands = parser.add_subparsers(dest="command", required=True)
    prep = commands.add_parser("prepare", help="Package the Harbor task dataset")
    add_experiment_args(prep)
    for command in ("run",):
        sub = commands.add_parser(command)
        add_experiment_args(sub)
        sub.add_argument("--config", type=Path, default=ROOT / "configs/baseline.yaml")
        sub.add_argument("--attempts", type=positive)
        sub.add_argument("--concurrency", type=positive)
        sub.add_argument("--skill", action="append", type=Path, default=[])
        sub.add_argument("--job-name", type=job_name)
        sub.add_argument("--jobs-dir", type=Path, default=ROOT / "jobs")
        sub.add_argument("--min-pass-rate", type=percentage, default=0)
        sub.add_argument("--no-analyze", action="store_true")
        add_analysis_args(sub)
    sub = commands.add_parser(
        "synthesize", help="Synthesize recent runs and prior findings"
    )
    sub.add_argument("--history", type=Path, default=ROOT / "history")
    sub.add_argument("--jobs-dir", type=Path, default=ROOT / "jobs")
    sub.add_argument("--days", type=positive, default=7)
    add_analysis_args(sub)
    sub = commands.add_parser("archive", help="Preserve a run in durable history")
    sub.add_argument("path", type=Path)
    sub.add_argument("--history", type=Path, default=ROOT / "history")
    sub = commands.add_parser("report")
    sub.add_argument("path", type=Path)
    sub.add_argument("--min-pass-rate", type=percentage, default=0)
    sub = commands.add_parser("analyze")
    sub.add_argument("path", type=Path)
    add_analysis_args(sub)
    args = parser.parse_args()
    load_dotenv(args.env_file, override=False)
    try:
        raise SystemExit(asyncio.run(execute(args)))
    except (ValueError, OSError) as exc:
        parser.exit(2, f"Error: {exc}\n")


def add_experiment_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--sdk-package", default="mcp-use")
    parser.add_argument("--sdk-name", help="Display name; defaults to the package name")
    parser.add_argument("--task", action="append", help="Exact task id; repeatable")


def add_analysis_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--analysis-model", default="openai/gpt-5.6-sol")
    parser.add_argument("--analysis-concurrency", type=positive, default=2)


if __name__ == "__main__":
    main()
