import argparse
import hashlib
import shutil
from pathlib import Path

import pytest
from harbor.analyze.models import load_rubric
from harbor.models.job.config import JobConfig
from harbor.models.task.task import Task

from mcp_use_evals.cli import build_config
from mcp_use_evals.tasks import ROOT, prepare


@pytest.fixture(scope="module")
def dataset(tmp_path_factory):
    root = tmp_path_factory.mktemp("dataset")
    for directory in ("tasks", "src"):
        shutil.copytree(ROOT / directory, root / directory)
    for name in ("package.json", "pnpm-lock.yaml", "tsconfig.json"):
        shutil.copy2(ROOT / name, root / name)
    return prepare(root)


def test_every_task_is_valid_and_preserves_frozen_evidence(dataset):
    originals = sorted((ROOT / "tasks").iterdir())
    assert len(originals) == len(list(dataset.iterdir())) == 9
    for original in originals:
        generated = dataset / original.name
        task = Task(generated)
        prompt = (original / "prompt.md").read_bytes()
        assert task.instruction == prompt.decode()
        assert (
            task.config.metadata["prompt_hash"]
            == hashlib.sha256(prompt).hexdigest()[:12]
        )
        assert (generated / "tests/task.json").read_bytes() == (
            original / "task.json"
        ).read_bytes()
        assert task.config.agent.timeout_sec == 1200
        assert task.config.verifier.timeout_sec == 900
        # No oracle or verifier content may leak into the image build context.
        assert set(p.name for p in (generated / "environment").iterdir()) <= {
            "Dockerfile",
            "starter",
        }
        assert not list(generated.rglob("*.env"))
        for source in (original / "golden").rglob("*"):
            if source.is_file():
                assert (
                    source.read_bytes()
                    == (
                        generated
                        / "solution/golden"
                        / source.relative_to(original / "golden")
                    ).read_bytes()
                )


def test_debug_task_keeps_starter_project(dataset):
    name = "v2-07-debug-inventory-server"
    assert (dataset / name / "environment/starter/src/server.ts").read_bytes() == (
        ROOT / "tasks" / name / "starter/src/server.ts"
    ).read_bytes()


def args(**updates):
    values = dict(
        command="run",
        config=ROOT / "configs/baseline.yaml",
        attempts=None,
        concurrency=None,
        task=None,
        skill=[],
        jobs_dir=Path("jobs"),
        job_name="test",
    )
    return argparse.Namespace(**(values | updates))


def test_config_round_trips_through_sdk_and_keeps_model_pin(dataset):
    config = build_config(args(), dataset)
    assert config.n_attempts == 3
    assert len(config.tasks) == 9
    assert config.agents[0].model_name == "openai/gpt-5.6-terra"
    assert JobConfig.model_validate_json(config.model_dump_json()) == config


def test_unknown_task_fails_before_running_any_agent(dataset):
    with pytest.raises(ValueError, match="Unknown task"):
        build_config(args(task=["typo"]), dataset)


def test_oracle_uses_no_model_or_skills(dataset):
    config = build_config(args(command="verify"), dataset)
    assert config.n_attempts == 1
    assert config.agents[0].name == "oracle"
    assert config.agents[0].model_name is None
    assert config.agents[0].kwargs == {}


def test_native_analysis_rubric_loads():
    rubric = load_rubric(ROOT / "configs/analysis-rubric.toml")
    assert {c.name for c in rubric.criteria} == {
        "sdk_usability",
        "documentation",
        "task_specification",
        "reward_integrity",
    }
