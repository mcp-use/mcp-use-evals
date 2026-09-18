# mcp-use SDK evals · Harbor

Can a coding agent build a correct MCP server with mcp-use, and what should we
improve when it struggles?

This repo owns **nine frozen tasks and a deterministic TypeScript verifier**.
[Harbor](https://docs.harborframework.com/) owns agent execution, Docker sandboxes,
parallel attempts, infrastructure retries, trajectories, and agentic analysis.
There is no custom agent runner, sandbox implementation, or LLM judge loop.

## Run locally

Requirements: Docker with Compose, [uv](https://docs.astral.sh/uv/), and an
`OPENAI_API_KEY` in your shell or this checkout's ignored `.env`. `uv sync`
installs the pinned Python/Harbor dependencies. Node and pnpm are installed
inside the task containers; host Node is only needed to develop the verifier.

```bash
uv sync --locked

# Validate every golden solution using Harbor's oracle agent. No model/API key.
uv run evals verify

# One real Codex attempt, then automatic agentic analysis.
uv run evals run --task v2-01-basic-tool-server --attempts 1

# Baseline: nine tasks × three independent attempts.
uv run evals run

# Browse outcomes, tool calls, token usage, and each trial's Analysis tab.
uv run harbor view jobs
```

The existing key can be reused without copying it into a new checkout:

```bash
uv run evals --env-file /path/to/existing/.env run --task v2-01-basic-tool-server --attempts 1
```

Shell environment takes precedence over `.env`. Credentials are never written
to a job config by our wrapper. Model requests still incur your provider's costs.

## What Harbor replaces

| Previously maintained here | Now |
| --- | --- |
| Codex/Claude SDK wrappers, process parsing, agent installation | Harbor's built-in agents |
| Docker/Vercel sandbox lifecycle and workspace syncing | Harbor environments |
| Trial loops, retries, concurrency and timeouts | Harbor `Job` / `JobConfig` |
| Custom transcript format and performance extraction | Native results and ATIF trajectories |
| Per-trial LLM judge and weekly synthesis runner | Harbor `analyze` with an MCP-specific rubric |
| Bespoke report UI | Harbor's local results viewer |
| Results-branch push/rebase races in CI | Workflow artifacts and a single batch gate |

The remaining Python code packages tasks, invokes the SDK, and applies our
pass-rate policy to native results. The TypeScript code is domain logic: MCP
handshakes, exact tools/resources, stateful calls, view metadata, raw
`input_required` flows, source requirements, and OAuth verification helpers.

The tradeoffs are a Python dependency alongside the TypeScript verifier, a
Docker requirement for the default configuration, and model costs for analysis.
Harbor is pinned to **0.23.0** in `pyproject.toml` and `uv.lock`; upgrades must
pass our tests and oracle gate. This uses the current `harbor analyze` interface,
not the removed `harbor jobs summarize` command.

## Configuration and experiments

[`configs/baseline.yaml`](configs/baseline.yaml) is a native Harbor job config:
Codex, `openai/gpt-5.6-terra`, high reasoning, three attempts per task, three
concurrent containers, and up to two retries using Harbor's exception policy.
The agent has 20 minutes; the verifier has 15 minutes including installation.

```bash
# Different sample size/concurrency; repeat --task to select multiple tasks.
uv run evals run --attempts 5 --concurrency 2 --min-pass-rate 90

# Separate skill experiment: Harbor installs the skill for the selected agent.
uv run evals run --skill /path/to/mcp-apps-builder --job-name codex-with-skill

# Choose agents/models/environment in a separate native config.
uv run evals run --config configs/my-experiment.yaml

# Skip paid qualitative analysis, or rerun it later on saved evidence.
uv run evals run --no-analyze
uv run evals analyze jobs/<job-name>
```

The wrapper always selects this repo's task suite; it overrides `tasks`,
`datasets`, `jobs_dir`, and `job_name` from a supplied config. Agent/model,
retry, timeout and environment settings remain native Harbor configuration.
CLI overrides take precedence. Additional agent providers need their normal
provider credentials. Automatic analysis independently uses Codex with
`openai/gpt-5.6-sol` and therefore needs OpenAI access even for Claude trials.
Use `--analysis-model` to change that model and `--analysis-concurrency` to cap
parallel analyses. Analysis has a 10-minute per-agent timeout and one retry.

For the full Harbor CLI—including cloud providers, resume, multi-agent
experiments, and custom dataset selection—package the tasks once:

```bash
uv run evals prepare
uv run harbor run -c configs/baseline.yaml
uv run harbor run -p .harbor/tasks -a claude-code -m anthropic/claude-sonnet-5
uv run harbor jobs resume --help
```

Direct Harbor runs retain native artifacts but bypass our automatic analysis
and CI gate. Apply them afterward with `evals analyze` and `evals report`.
Use separate checkouts for simultaneous experiments that regenerate tasks.

## Scores and reports

Each successful verification emits `/logs/verifier/reward.txt` (`1` or `0`)
and `grade.json` with every check, first failure code, SDK provenance, and grader
version. A verifier crash leaves no reward; it becomes a Harbor infrastructure
error, never an ordinary failed solution. Tests and golden solutions are kept
out of the agent's Docker build context and uploaded by Harbor in their phase.

Our headline remains **passing valid runtime trials / valid runtime trials**.
Infrastructure errors and static-import-only tasks are excluded from that
denominator. The CI gate nevertheless rejects infrastructure errors, missing
results, unfinished jobs, empty samples, and inconsistent reward/grade evidence.
The default runtime pass-rate floor is 80%, configurable with `--min-pass-rate`.
Oracle verification requires every task—including static tasks—to pass.

Native Harbor aggregate metrics may use different denominators; `summary.json`
is authoritative for our policy. Harbor's pass@k means "at least one success"
and is not the old custom pass^k reliability metric. Do not interchange them.

```
jobs/<job-name>/
  config.json, lock.json, result.json   # native Harbor job metadata/results
  report.md, summary.json              # deterministic scorecard and CI policy
  analysis.md, analysis.json           # readable/native qualitative reports
  <trial>/
    result.json, config.json
    agent/trajectory.json             # native ATIF; tool-by-tool evidence
    verifier/grade.json, reward.txt    # deterministic result
    verifier/test-stdout.txt
    analysis.json                     # Harbor viewer's Analysis tab
jobs/analysis/<job-name>-<id>/         # analysis-agent trajectories and usage
```

The analysis rubric investigates SDK friction, documentation gaps, unfair task
requirements, and reward manipulation. It requests quoted evidence and concrete
fixes. Analysis cannot alter scores. If analysis fails, the command exits nonzero
but preserves the already-written deterministic report; rerun only analysis.
Reports draft findings for review and never post messages or create issues.

## CI/CD

- **Harness checks** runs TypeScript/Python tests and all oracle tasks on PRs,
  including forks, without model secrets.
- **Evals** runs Monday/Wednesday/Friday or manually. An oracle gate precedes a
  dynamically discovered task matrix. Each shard executes trials and analysis,
  uploads artifacts even on failure, and adds reports to the Actions summary.
  A final job computes the weighted batch pass rate and applies the threshold
  once across all selected tasks. Missing shards and analysis errors remain red.
- Permissions are `contents: read`. Raw jobs and analyses are retained for 90
  days. Download/extract them into `jobs/` and use `uv run harbor view jobs`.

For callers in another repo, pin this action to a reviewed commit:

```yaml
jobs:
  eval:
    runs-on: ubuntu-latest
    timeout-minutes: 180
    steps:
      - uses: mcp-use/mcp-use-evals@<commit-sha>
        id: eval
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          tasks: v2-01-basic-tool-server
          attempts: '3'
          min-pass-rate: '80'
      - uses: actions/upload-artifact@v4
        if: always() && steps.eval.outputs.run-dir != ''
        with:
          name: mcp-evals
          path: ${{ steps.eval.outputs.run-dir }}
```

## Task authoring and migration

Keep editing `tasks/<id>/prompt.md`, `task.json`, `golden/`, and optional `starter/`.
`evals prepare` assembles self-contained native tasks under ignored `.harbor/tasks/`:
`instruction.md`, `task.toml`, `environment/Dockerfile`, `tests/test.sh`, and
`solution/solve.sh`. Shared verifier sources are copied automatically; there
are no checked-in duplicated graders or fragile symlinks.

All nine existing task prompts/contracts/golden solutions are unchanged.
The grader remains version 2.1.0. Prompt and contract hashes are recorded in
task metadata; Harbor also records task checksums and actual agent versions.
Never edit a frozen task's behavior in place—add a new task id and golden
solution, then run `evals verify`.

This is an intentional harness-version boundary, not a drop-in old-CLI adapter:

- `pnpm eval` → `uv run evals run`; `pnpm verify-tasks` → `uv run evals verify`.
- `--trials` → `--attempts`; skill conditions → native agent skills / `--skill`.
- Legacy automatic `create-mcp-use-app` scaffold conditions are not reproduced;
  use a separately versioned task environment containing a pinned scaffold.
  The debugging task's checked-in starter is preserved.
- Old `run.json`, weekly Slack synthesis, the writable `eval-results` branch,
  and custom longitudinal metrics are retired. Historical data stays untouched;
  compare new Harbor jobs within the new harness version. Keep longer-lived
  artifacts in your chosen storage if the 90-day Actions retention is insufficient.
- New OAuth tasks needing an agent-phase IdP or external secrets must define
  that service/environment in Harbor before being added. The packager rejects
  legacy agent-phase secret fields rather than silently omitting them. None of
  the nine current tasks requires those fields.

Develop the verifier with Node 24 and pnpm 10.33:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck && pnpm test
uv run ruff check mcp_use_evals tests_python
uv run pytest
uv run evals verify
```
