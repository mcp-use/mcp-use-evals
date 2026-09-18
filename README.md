# Weekly SDK developer-experience evals · Harbor

Can a coding agent build a working MCP server with today's SDK, and where does it struggle?

Harbor 0.23.0 owns agent execution, Docker environments, attempts, retries and
trajectories. This repository owns task contracts, deterministic MCP verification,
per-attempt analysis, and weekly synthesis. There are no golden solutions, oracle
runs, PR checks, or automatic push checks.

## Run locally

Requirements: Docker with Compose, uv, and an `OPENAI_API_KEY` in your shell or
this checkout's ignored `.env`. Existing credentials are reused; paid agent and
analysis runs incur provider costs. Host Node is only needed for verifier development.

```bash
uv sync --locked
uv run evals run --task v3-01-basic-tool-server --attempts 1
uv run evals run                         # nine tasks × three attempts
uv run harbor view jobs
```

The baseline uses Codex with `openai/gpt-5.6-terra`, high reasoning, three concurrent
containers, and up to two infrastructure retries under Harbor's policy. Attempts
have 20 minutes; verification has 15 minutes. Analysis independently uses Codex
with `openai/gpt-5.6-sol`, two concurrent analyses, a ten-minute timeout, and one retry.

```bash
uv run evals run --attempts 5 --concurrency 2
uv run evals run --skill /path/to/skill --job-name with-skill
uv run evals run --config configs/my-experiment.yaml
uv run evals run --no-analyze
uv run evals analyze jobs/<job-name>
uv run evals --env-file /existing/.env run --task v3-01-basic-tool-server
```

## Latest SDK and alternate experiments

The v3 prompts ask for the latest SDK, without prescribing a version. Before the
job starts, `manifest.json` records npm's `latest` version, the requested SDK,
repository revision, configured agents/models/skills, selected tasks and Actions
URL. A registry lookup failure is recorded without blocking the run. Each
`grade.json` records the installed requested-package version and whether source
imports reference it. Harbor results retain actual agent versions and usage.
The rendered prompt and contract are also preserved. Versions are evidence, not
constraints; selecting an older SDK is a finding to investigate.

```bash
uv run evals run --sdk-package @modelcontextprotocol/sdk --sdk-name 'official MCP SDK'
```

This selects the four portable greenfield tasks (basic tools, tickets, docs,
project board), using the same behavior contracts and SDK-specific rendered
instructions. The inventory starter and OpenAPI, approval, views and middleware
tasks require mcp-use; explicitly selecting one with another SDK raises an error.
Add a separate variant/environment for equivalent SDK-specific experiments.
SDK adoption is reported separately and does not alter functional correctness.
The generic experiment mechanism accepts other npm packages too.

## Correctness and diagnosis

The TypeScript verifier checks installation, typechecking, task-specific source
requirements, optional builds, server startup, real MCP handshakes, tools,
resources, calls and metadata. Every required check must pass: reward is 1 or 0,
with per-check details and the first failure in `grade.json`. This is contract
coverage, not proof that every requirement in prose is exhaustively tested.

The pass rate is passing valid runtime attempts divided by all valid runtime
attempts. Static-only tasks, if added, are tracked separately. Missing or
inconsistent evidence and infrastructure errors stay visible and cause a nonzero
exit. Ordinary solution failures do not fail a complete run by default: the
weekly percentage is a health signal, not a release gate. An optional explicit
`--min-pass-rate` restores threshold enforcement for an experiment. Our
`summary.json` is authoritative, rather than Harbor metrics with other denominators.

Per-attempt analysis reviews passing and failing trajectories for SDK friction,
documentation gaps, task fairness and reward integrity. It asks for evidence and
fixes, and cannot change deterministic grades. Negative findings do not fail the
run; an analysis execution failure does. Execution errors preserve partial
evidence and still attempt analysis.

## Weekly synthesis and durable history

```bash
# Include manual/local experiments in subsequent reports:
uv run evals archive jobs/<job-name> --history history
uv run evals synthesize --history history --days 7
```

Archive after rerunning analysis to update that run's saved evidence. Local runs
enter CI synthesis only after their history is added to the `eval-history` branch;
manual Actions runs are archived automatically. Archive uses a manifest-derived
identity, so repeated archival updates the same run rather than double-counting it.

Synthesis runs one separate Harbor task. It receives the reporting window's runs,
historical evidence and prior reports. It groups repeated issues, examines passes
with recovered friction, distinguishes likely causes, and reuses finding IDs across
new/recurring/apparently-resolved/not-observed findings. Lack of recurrence alone
is not evidence of resolution. Findings include frequency, impact, confidence,
suggested fixes, and evidence paths with verbatim excerpts. A deterministic
validator checks report structure, evidence-file existence and exact quotations;
it does not prove the analyst's causal interpretation.

Reports are JSON plus Markdown in `history/reports/`, separate from delivery.
Nothing posts to Slack or creates issues. Empty weeks and failed synthesis produce
explicit coverage/error reports without invented conclusions. Reports contain
relative evidence links for browsing the history branch; Actions source links
provide run context. The history includes trajectories and verifier output, but
omits native config files that may contain environment credentials. Evidence is
stored with the repository's visibility and access permissions.

The single weekly/manual workflow:

1. Restores `eval-history`.
2. Runs local harness tests (failures are surfaced after evidence collection).
3. Runs attempts and per-trial analysis.
4. Archives complete or partial runs, even after failures.
5. Synthesizes all runs from the last seven days, including manual Actions runs.
6. Commits evidence and reports to `eval-history`, even if synthesis fails.
7. Uploads raw jobs and reports as 90-day Actions artifacts.

The Git history branch has no automatic expiry and preserves earlier revisions.
Writes are serialized across scheduled/manual runs to avoid lost updates. The job
needs `contents: write` for that branch and `OPENAI_API_KEY` for paid runs. It runs
Mondays at 14:00 UTC, or through workflow dispatch. There are no PR or push triggers.
Branch protections must permit the Actions token to update `eval-history`.

## Using the action elsewhere

Pin the action to a reviewed commit. It runs attempts and per-trial analysis;
weekly scheduling, archival and synthesis are orchestration responsibilities.

```yaml
- uses: mcp-use/mcp-use-evals@<commit-sha>
  id: eval
  with:
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    tasks: v3-01-basic-tool-server
    attempts: '3'
    sdk-package: mcp-use
    sdk-name: mcp-use
- uses: actions/upload-artifact@v4
  if: always() && steps.eval.outputs.run-dir != ''
  with:
    name: sdk-evals
    path: ${{ steps.eval.outputs.run-dir }}
```

## Authoring and development

Edit `tasks/<id>/prompt.md`, `task.json`, `experiment.json`, and optional `starter/`.
`experiment.json` declares portability. Prompt placeholders are `{{sdk_package}}`
and `{{sdk_name}}`. `evals prepare` renders self-contained Harbor tasks under
`.harbor/tasks/`; tests are uploaded only during verification, not placed in the
agent image. No reference implementation or solution directory is required.
Add a new revision when changing task behavior; v2 is retained in Git history,
while v3 introduces latest-SDK instructions. The deterministic contract checks
remain unchanged by this revision. Suspected verifier defects are findings for
investigation; there is no oracle gate.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
uv run ruff check mcp_use_evals tests_python
uv run pytest
uv run evals prepare
```

Direct Harbor experiments can use `uv run harbor run -c configs/baseline.yaml`
after preparation, but bypass wrapper manifests, automatic analysis and reporting.
Use the wrapper for runs intended for weekly history. Avoid concurrent task
preparation in one checkout. New tasks requiring agent-phase services or secrets
need an explicit Harbor environment; legacy secret fields are rejected.
