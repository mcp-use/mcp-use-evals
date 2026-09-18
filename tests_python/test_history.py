import json
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from harbor.models.task.task import Task

from mcp_use_evals.history import archive, manifest, recent_runs
from mcp_use_evals.synthesis import VALIDATOR, prepare_synthesis, synthesize
from mcp_use_evals.tasks import ROOT, prepare


def seed_run(path, stamp="2026-09-18T00:00:00+00:00"):
    path.mkdir(parents=True)
    (path / "manifest.json").write_text(json.dumps({"started_at": stamp}))
    (path / "execution-error.txt").write_text("container unavailable")
    return path


def test_archive_preserves_partial_evidence_and_excludes_credentials(tmp_path):
    run = seed_run(tmp_path / "job")
    (run / "config.json").write_text('{"env": {"KEY": "secret"}}')
    (run / "result.json").write_text(
        '{"config": {"env": {"KEY": "secret"}}, "finished_at": null}'
    )
    target = archive(run, tmp_path / "history")
    assert (target / "execution-error.txt").read_text() == "container unavailable"
    assert not (target / "config.json").exists()
    assert "secret" not in (target / "result.json").read_text()
    assert archive(run, tmp_path / "history") == target


def test_window_includes_manual_runs_and_excludes_old_and_future(tmp_path):
    seed_run(tmp_path / "runs/manual")
    seed_run(tmp_path / "runs/old", "2026-09-01T00:00:00+00:00")
    seed_run(tmp_path / "runs/future", "2026-10-01T00:00:00+00:00")
    now = datetime(2026, 9, 19, tzinfo=timezone.utc)
    assert [p.name for p in recent_runs(tmp_path, 7, now)] == ["manual"]
    target = tmp_path / "task"
    prepare_synthesis(tmp_path, target, 7, now)
    assert Task(target).config.agent.timeout_sec == 1200
    assert json.loads((target / "environment/selected.json").read_text()) == ["manual"]
    assert (target / "environment/evidence/old/manifest.json").exists()


def test_generic_sdk_only_packages_compatible_tasks(tmp_path):
    import shutil

    for directory in ("tasks", "src"):
        shutil.copytree(ROOT / directory, tmp_path / directory)
    for name in ("package.json", "pnpm-lock.yaml", "tsconfig.json"):
        shutil.copy2(ROOT / name, tmp_path / name)
    dataset = prepare(tmp_path, "@modelcontextprotocol/sdk", "official MCP SDK")
    assert len(list(dataset.iterdir())) == 4
    for task in dataset.iterdir():
        prompt = (task / "instruction.md").read_text()
        assert "mcp-use" not in prompt
        assert "@modelcontextprotocol/sdk" in prompt
    with pytest.raises(ValueError, match="SDK-specific"):
        prepare(
            tmp_path,
            "@modelcontextprotocol/sdk",
            "official",
            ["v3-08-openapi-order-service"],
        )
    with pytest.raises(ValueError, match="Unknown tasks"):
        prepare(tmp_path, selected=["missing"])
    with pytest.raises(ValueError, match="Invalid npm"):
        prepare(tmp_path, "../escape")


def test_manifest_registry_failure_is_recorded_not_fatal(tmp_path, monkeypatch):
    def fail(*args, **kwargs):
        raise OSError("registry offline")

    monkeypatch.setattr("mcp_use_evals.history.urlopen", fail)
    config = SimpleNamespace(job_name="sample", agents=[], tasks=[])
    manifest(tmp_path, "mcp-use", "mcp-use", config)
    data = json.loads((tmp_path / "manifest.json").read_text())
    assert data["registry_latest"] is None
    assert "registry offline" in data["registry_error"]


def test_synthesis_validator_rejects_fabricated_quotes(tmp_path):
    app = tmp_path / "app"
    logs = tmp_path / "logs"
    evidence = app / "evidence/run"
    evidence.mkdir(parents=True)
    (evidence / "analysis.md").write_text("actual error")
    report = {
        "coverage": "one attempt",
        "findings": [
            {
                "id": "error",
                "status": "new",
                "category": "sdk",
                "title": "error",
                "impact": "blocked",
                "confidence": "low",
                "frequency": "1 of 1",
                "suggested_fix": "investigate",
                "evidence": [
                    {"path": "runs/run/analysis.md", "quote": "fabricated error"}
                ],
            }
        ],
    }
    (app / "report.json").write_text(json.dumps(report))
    (app / "report.md").write_text("Report")
    code = VALIDATOR.replace("/logs/verifier", str(logs)).replace("/app", str(app))
    with pytest.raises(AssertionError, match="verbatim"):
        exec(code, {})
    assert not (logs / "reward.txt").exists()
    report["findings"][0]["evidence"][0]["quote"] = "actual error"
    (app / "report.json").write_text(json.dumps(report))
    exec(code, {})
    assert (logs / "reward.txt").read_text() == "1\n"


def test_empty_week_writes_coverage_report_without_model(tmp_path):
    import asyncio

    args = SimpleNamespace(
        history=tmp_path / "history", jobs_dir=tmp_path / "jobs", days=7
    )
    assert asyncio.run(synthesize(args)) == 1
    assert "No runs" in next((args.history / "reports").glob("*.md")).read_text()


def test_execution_failure_still_attempts_analysis(tmp_path, monkeypatch):
    import asyncio
    from mcp_use_evals.cli import execute

    config = SimpleNamespace(jobs_dir=tmp_path, job_name="failed")
    monkeypatch.setattr("mcp_use_evals.cli.prepare", lambda **kwargs: tmp_path)
    monkeypatch.setattr("mcp_use_evals.cli.build_config", lambda *args: config)
    monkeypatch.setattr("mcp_use_evals.history.manifest", lambda *args: None)

    async def fail(*args):
        raise RuntimeError("Docker failed")

    analyzed = []

    async def analyze(path, args):
        analyzed.append(path)
        return False

    monkeypatch.setattr("mcp_use_evals.cli.Job.create", fail)
    monkeypatch.setattr("mcp_use_evals.cli.analyze", analyze)
    args = SimpleNamespace(
        command="run",
        sdk_package="mcp-use",
        sdk_name="mcp-use",
        task=None,
        no_analyze=False,
        min_pass_rate=0,
    )
    assert asyncio.run(execute(args)) == 1
    assert analyzed == [tmp_path / "failed"]
    assert (tmp_path / "failed/execution-error.txt").read_text() == "Docker failed"


def test_synthesis_failure_preserves_explicit_report(tmp_path, monkeypatch):
    import asyncio

    seed_run(tmp_path / "history/runs/sample", datetime.now(timezone.utc).isoformat())

    async def fail(*args):
        raise RuntimeError("model unavailable")

    monkeypatch.setattr("mcp_use_evals.synthesis.Job.create", fail)
    args = SimpleNamespace(
        history=tmp_path / "history",
        jobs_dir=tmp_path / "jobs",
        days=7,
        analysis_model="test",
    )
    with pytest.raises(RuntimeError, match="model unavailable"):
        asyncio.run(synthesize(args))
    assert (
        "model unavailable"
        in next((args.history / "reports").glob("*-error.md")).read_text()
    )


def test_synthesis_publishes_completed_harbor_report(tmp_path, monkeypatch):
    import asyncio

    seed_run(tmp_path / "history/runs/sample", datetime.now(timezone.utc).isoformat())

    async def create(config):
        async def run():
            trial = config.jobs_dir / config.job_name / "trial"
            logs = trial / "verifier"
            logs.mkdir(parents=True)
            (logs / "report.json").write_text(
                '{"coverage": "one partial run", "findings": []}'
            )
            (logs / "report.md").write_text("# Weekly report\nOne partial run.")
            (trial / "result.json").write_text(
                json.dumps(
                    {
                        "finished_at": "2026-09-18",
                        "verifier_result": {"rewards": {"reward": 1}},
                    }
                )
            )

        return SimpleNamespace(run=run)

    monkeypatch.setattr("mcp_use_evals.synthesis.Job.create", create)
    args = SimpleNamespace(
        history=tmp_path / "history",
        jobs_dir=tmp_path / "jobs",
        days=7,
        analysis_model="test",
    )
    assert asyncio.run(synthesize(args)) == 0
    assert (
        "One partial run" in next((args.history / "reports").glob("*.md")).read_text()
    )
    metadata = json.loads(
        next((args.history / "reports").glob("*.metadata.json")).read_text()
    )
    assert metadata["runs"] == ["sample"]
