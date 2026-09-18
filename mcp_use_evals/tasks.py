"""Package frozen task contracts as ordinary, self-contained Harbor tasks."""

import hashlib
import json
import re
import shutil
from pathlib import Path

from harbor.models.task.task import Task

ROOT = Path(__file__).resolve().parent.parent
GRADER_VERSION = "2.1.0"
IGNORE = shutil.ignore_patterns("node_modules", ".git", ".env", ".env.*", "dist")


def prepare(
    root: Path = ROOT,
    sdk_package: str = "mcp-use",
    sdk_name: str = "mcp-use",
    selected: list[str] | None = None,
) -> Path:
    if not re.fullmatch(r"(?:@[a-z0-9_.-]+/)?[a-z0-9_.-]+", sdk_package):
        raise ValueError("Invalid npm SDK package name")
    # Keep one copy of the domain-specific verifier in source control. The
    # generated tasks are portable: no symlinks or dependencies on this checkout.
    output = root / ".harbor" / "tasks"
    output.mkdir(parents=True, exist_ok=True)
    source_tasks = sorted((root / "tasks").glob("*/task.json"))
    if not source_tasks:
        raise ValueError("No task contracts found")
    available = {p.parent.name for p in source_tasks}
    if selected and set(selected) - available:
        raise ValueError(f"Unknown tasks: {sorted(set(selected) - available)}")
    for contract in source_tasks:
        if selected and contract.parent.name not in selected:
            continue
        portable = json.loads((contract.parent / "experiment.json").read_text())[
            "portable"
        ]
        if sdk_package != "mcp-use" and (
            not portable or (contract.parent / "starter").exists()
        ):
            if selected:
                raise ValueError(
                    f"{contract.parent.name} requires an SDK-specific environment or API; select portable greenfield tasks"
                )
            continue
        source = contract.parent
        target = output / source.name
        if target.exists():
            shutil.rmtree(target)
        for directory in ("environment", "tests/verifier"):
            (target / directory).mkdir(parents=True)
        prompt = (
            (source / "prompt.md")
            .read_text()
            .replace("{{sdk_package}}", sdk_package)
            .replace("{{sdk_name}}", sdk_name)
            .encode()
        )
        (target / "instruction.md").write_bytes(prompt)
        config = json.loads(contract.read_text())
        if config.get("oauth") or config.get("agentEnvKeys"):
            raise ValueError(
                f"{source.name}: agent-phase services/secrets must be declared in "
                "the Harbor environment before adding this task"
            )
        dockerfile = (
            "FROM node:24.15.0-bookworm\n"
            "RUN corepack enable && corepack prepare pnpm@10.33.0 --activate\n"
            "WORKDIR /app\n"
        )
        if (source / "starter").exists():
            shutil.copytree(
                source / "starter", target / "environment/starter", ignore=IGNORE
            )
            dockerfile += "COPY starter/ /app/\n"
        (target / "environment/Dockerfile").write_text(dockerfile)
        # Tests are uploaded by Harbor only during verification.
        shutil.copy2(contract, target / "tests/task.json")
        (target / "tests/experiment.json").write_text(
            json.dumps({"sdk_package": sdk_package, "sdk_name": sdk_name})
        )
        for name in ("package.json", "pnpm-lock.yaml", "tsconfig.json"):
            shutil.copy2(root / name, target / "tests/verifier" / name)
        shutil.copytree(root / "src", target / "tests/verifier/src")
        (target / "tests/test.sh").write_text(
            "#!/bin/bash\nset -euo pipefail\n"
            "mkdir -p /logs/verifier\n"
            "rm -f /logs/verifier/reward.txt /logs/verifier/reward.json\n"
            "cd /tests/verifier\n"
            "pnpm install --frozen-lockfile --ignore-scripts >/logs/verifier/install.log 2>&1\n"
            "pnpm exec tsx src/verify.ts /app /tests/task.json /logs/verifier\n"
        )
        prompt_hash = hashlib.sha256(prompt).hexdigest()[:12]
        contract_hash = hashlib.sha256(contract.read_bytes()).hexdigest()
        (target / "task.toml").write_text(
            'schema_version = "1.4"\n'
            "[metadata]\n"
            f'grader_version = "{GRADER_VERSION}"\n'
            f'prompt_hash = "{prompt_hash}"\n'
            f'contract_hash = "{contract_hash}"\n'
            "[agent]\ntimeout_sec = 1200\n"
            "[verifier]\ntimeout_sec = 900\n"
            "[environment]\ncpus = 2\nmemory_mb = 4096\n"
            "build_timeout_sec = 600\n"
        )
        Task(target)  # Validate using the pinned SDK, including the input tree.
    expected = {
        p.parent.name
        for p in source_tasks
        if (not selected or p.parent.name in selected)
        and (
            sdk_package == "mcp-use"
            or (
                json.loads((p.parent / "experiment.json").read_text())["portable"]
                and not (p.parent / "starter").exists()
            )
        )
    }
    for stale in output.iterdir():
        if stale.is_dir() and stale.name not in expected:
            shutil.rmtree(stale)
    return output
