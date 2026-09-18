"""Package frozen task contracts as ordinary, self-contained Harbor tasks."""

import hashlib
import json
import shutil
from pathlib import Path

from harbor.models.task.task import Task

ROOT = Path(__file__).resolve().parent.parent
GRADER_VERSION = "2.1.0"
IGNORE = shutil.ignore_patterns("node_modules", ".git", ".env", ".env.*", "dist")


def prepare(root: Path = ROOT) -> Path:
    # Keep one copy of the domain-specific verifier in source control. The
    # generated tasks are portable: no symlinks or dependencies on this checkout.
    output = root / ".harbor" / "tasks"
    output.mkdir(parents=True, exist_ok=True)
    source_tasks = sorted((root / "tasks").glob("*/task.json"))
    if not source_tasks:
        raise ValueError("No task contracts found")
    for contract in source_tasks:
        source = contract.parent
        target = output / source.name
        if target.exists():
            shutil.rmtree(target)
        for directory in ("environment", "tests/verifier", "solution"):
            (target / directory).mkdir(parents=True)
        prompt = (source / "prompt.md").read_bytes()
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
        # Tests and oracle sources are uploaded by Harbor only in their phase;
        # neither is placed in the agent's Docker build context.
        shutil.copy2(contract, target / "tests/task.json")
        for name in ("package.json", "pnpm-lock.yaml", "tsconfig.json"):
            shutil.copy2(root / name, target / "tests/verifier" / name)
        shutil.copytree(root / "src", target / "tests/verifier/src")
        shutil.copytree(source / "golden", target / "solution/golden", ignore=IGNORE)
        (target / "solution/solve.sh").write_text(
            "#!/bin/bash\nset -euo pipefail\ncp -a /solution/golden/. /app/\n"
        )
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
    expected = {p.parent.name for p in source_tasks}
    for stale in output.iterdir():
        if stale.is_dir() and stale.name not in expected:
            shutil.rmtree(stale)
    return output
