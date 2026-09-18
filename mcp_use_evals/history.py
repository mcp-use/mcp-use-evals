"""Version evidence and an append-only, Git-friendly history of runs."""

import hashlib
import json
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen


def manifest(path, package, name, config):
    latest = None
    error = None
    try:
        with urlopen(
            f"https://registry.npmjs.org/{quote(package, safe='')}/latest", timeout=20
        ) as response:
            latest = json.load(response)["version"]
    except Exception as exc:
        error = str(exc)
    revision = subprocess.run(
        ["git", "rev-parse", "HEAD"], capture_output=True, text=True
    ).stdout.strip()
    data = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "sdk_package": package,
        "sdk_name": name,
        "registry_latest": latest,
        "registry_error": error,
        "revision": revision,
        "job": config.job_name,
        "agents": [
            {
                "name": a.name,
                "model": a.model_name,
                "skills": a.skills,
                "reasoning_effort": a.kwargs.get("reasoning_effort"),
            }
            for a in config.agents
        ],
        "tasks": [str(t.path.name) for t in config.tasks],
        "source_url": (
            f"https://github.com/{os.environ['GITHUB_REPOSITORY']}/actions/runs/{os.environ['GITHUB_RUN_ID']}"
            if os.getenv("GITHUB_RUN_ID")
            else None
        ),
    }
    for task in config.tasks:
        evidence = path / "tasks" / task.path.name
        evidence.mkdir(parents=True)
        for source in (
            task.path / "instruction.md",
            task.path / "task.toml",
            task.path / "tests/task.json",
            task.path / "tests/experiment.json",
        ):
            shutil.copy2(source, evidence / source.name)
    (path / "manifest.json").write_text(json.dumps(data, indent=2) + "\n")


def archive(source: Path, history: Path) -> Path:
    """Preserve evidence, including partial runs; omit configs that can contain secrets."""
    source = source.resolve()
    identity = hashlib.sha256((source / "manifest.json").read_bytes()).hexdigest()[:16]
    target = history / "runs" / f"{source.name}-{identity}"
    target.mkdir(parents=True, exist_ok=True)
    names = {
        "manifest.json",
        "instruction.md",
        "task.toml",
        "task.json",
        "experiment.json",
        "execution-error.txt",
        "report-error.txt",
        "summary.json",
        "report.md",
        "analysis.json",
        "analysis.md",
        "analysis-error.txt",
        "grade.json",
        "reward.txt",
        "test-stdout.txt",
        "trajectory.json",
        "result.json",
    }
    for item in source.rglob("*"):
        if item.is_file() and item.name in names:
            destination = target / item.relative_to(source)
            destination.parent.mkdir(parents=True, exist_ok=True)
            if item.name == "result.json":
                # Native TrialResult embeds TrialConfig, including agent env.
                result = json.loads(item.read_text())
                result.pop("config", None)
                destination.write_text(json.dumps(result, indent=2) + "\n")
            else:
                shutil.copy2(item, destination)
    return target


def recent_runs(history: Path, days: int, now: datetime) -> list[Path]:
    from datetime import timedelta

    selected = []
    for path in sorted((history / "runs").glob("*/manifest.json")):
        stamp = datetime.fromisoformat(json.loads(path.read_text())["started_at"])
        if now - timedelta(days=days) <= stamp <= now:
            selected.append(path.parent)
    return selected
