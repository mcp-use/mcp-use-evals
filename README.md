# @mcp-use/sdk-evals

Agentic-readiness evals for the mcp-use TypeScript SDK ([MCP-2072](https://linear.app/manufact/issue/MCP-2072)): how well can coding agents build MCP servers with our SDK, and what should we fix (docs / skill / SDK / templates) when they can't?

Evals run against the **published npm package** — what agents in the wild actually get.

## How it works

```
task.json (contract) ──► agent builds a server ──► deterministic grader ──► TrialGrade (pass/fail)
                                    │                                              │
                                    └──► transcript ──► LLM judge ──► prose memo (unscored, never a number)

results/*/run.json (many runs) ──► pnpm synthesize ──► weekly report + Slack summary
```

Each trial: prepare a fresh sandbox → run an agent against a task prompt → grade the resulting workspace
against the task's declarative contract (`task.json`). There is **one** scored layer:

| Layer | What it produces | Counts toward the headline metric? |
| --- | --- | --- |
| **Functional grade** (`src/graders/functional.ts`) | A deterministic, unweighted checklist — install, typecheck, entry, start, MCP handshake, tools, resources, sequenced tool calls, OAuth where applicable — run in order and stopped at the first failure. Emits `TrialGrade { contractPass, checks[], failureCode, sdkPath }`. | Yes — this is the entire scored layer. |
| **Performance** (`src/graders/perf.ts`) | `TrialPerf { durationMs, turns, tokensIn, tokensOut, toolCalls, costUsd }`, reported beside correctness. | No — perf is never subtracted from or blended with correctness. |
| **LLM judge memo** (`src/graders/judge.ts`) | A short prose memo per trial: where the agent lost time, what it tried, what papercuts appeared. Every claim must carry a verbatim transcript quote. `"Nothing notable."` is a valid memo for clean runs. | Never. The judge cannot move any number; it exists purely to explain trials a human (or the weekly synthesis pass) should read. |

**There is no blended 0–100 readiness score.** The old pipeline computed `readiness = min(functionalScore,
100 − Σ penalties)` from regex "process detectors" plus a penalty-mapped LLM judge. All of that has been
deleted. Correctness and performance never mix, the judge never affects a number, and infra failures
(`valid: false`, e.g. sandbox prep or agent-harness crashes) are excluded from every denominator.

### Initial operating model: Codex baseline

The initial monitor is deliberately one simple experiment: **can Codex build each server from a blank
workspace without the skill?** Its condition is `noskill+blank`. Keep skill and scaffold comparisons as
separate, explicitly named experiments; do not blend them into the baseline trend.

| Term | Meaning in the baseline monitor |
| --- | --- |
| **Task** | One fixed assignment, consisting of a frozen `prompt.md`, a machine-checkable `task.json` contract, and a known-good `golden/` solution. Changing the prompt or contract creates a new task for trend purposes. |
| **Condition** | The controlled setup for an attempt. Initially this is always `noskill+blank`: no mcp-apps-builder skill and an empty workspace. Internally, the condition is stored as a legacy variant id. |
| **Trial** | One independent Codex attempt at one task under one condition, in a fresh sandbox. It ends in one `TrialGrade`: pass, fail, or invalid infrastructure result. |
| **Cell** | One task × condition pairing, containing its repeated trials. With three trials, `v2-02-stateful-ticket-queue × noskill+blank` is one three-trial cell. |
| **Evaluation batch** (or **run**) | A group of cells executed together. For the baseline, one batch is every checked-in task under `noskill+blank`, with three fresh trials per task. CI may shard this into per-task jobs; the report should still treat it as one batch. |

Run one baseline batch on **Monday, Wednesday, and Friday**:

```text
9 tasks × 3 fresh trials = 27 trials per batch
3 batches per week       = 81 trials per week
```

The headline **pass rate** is `passing valid scored trials ÷ valid scored trials`. For example, `41/54
(76%)` means Codex passed the full contract in 41 eligible attempts. Invalid `infra.*` trials are excluded;
source-import-only tasks are reported separately and do not enter this denominator.

After the Friday batch, the weekly synthesis reads every persisted `run.json` and judge memo from the week.
Code computes pass rates, reliability (`pass^k`), performance, and failure counts; the synthesis agent only
does the qualitative work—summarizing recurring struggles, selecting quoted evidence, and drafting proposed
issues for human review.

### Metrics

- **Pass rate** (the headline metric): `passed ÷ valid scored trials`, where "scored" excludes tasks running
  in `deterministicReadiness.mode: "source-imports"` (those are open-ended app/deploy tasks graded on
  typecheck + required imports only, and reported in their own "static adoption" table, never folded into
  the headline).
- **pass^k**: when every task×condition cell has ≥2 trials, the fraction of cells where *all* k trials passed
  — a stricter reliability signal than the mean pass rate.
- **Skill deltas**: paired pass-rate deltas between `skill+X` vs `noskill+X` conditions under the same
  workspace condition, always printed with trial counts.
- **Performance**: median duration/turns/toolCalls/tokens and cost-per-success, computed over passing trials
  only.
- **Failure/SDK-path breakdown**: counts of trials by `failureCode` (first failing contract stage) and by
  `sdkPath` (`mcp-use` | `official-sdk` | `hand-rolled` | `unknown` — a recorded fact, worth zero points).

See `src/report.ts` for the full per-run scorecard and `src/synthesis.ts` for the cross-run weekly rollup.

### Conditions

A condition is represented in the CLI by an id: `skill|noskill` × `scaffold|blank`. The initial baseline
condition is `noskill+blank`. Use `--condition`; `--variant` remains a deprecated compatibility alias.

- **skill** — `skills/mcp-apps-builder` copied into the sandbox's project skill directory (`.claude/skills/` for Claude, `.codex/skills/` for Codex), and the prompt points the agent to the copied skill. Set `MCP_USE_SKILL_DIR` to read the skill from a separate checkout (required if you're consuming this repo's action from outside the mcp-use monorepo, since the default path assumes a sibling `skills/` directory).
- **scaffold** — workspace pre-scaffolded with `create-mcp-use-app` (starter template); **blank** = empty dir, tests discovery from nothing

## Commands

```bash
pnpm install

# baseline batch: Codex, every task, blank workspace, no skill, 3 fresh trials each
pnpm eval --agent codex --condition noskill+blank --trials 3

# quick local smoke test of one task (one trial by default)
pnpm eval --agent codex --task v2-01-basic-tool-server --condition noskill+blank

# a focused experiment is separate from the baseline; include both conditions
# in one batch so the report can calculate a paired skill delta
pnpm eval --agent codex --condition noskill+blank --condition skill+blank --trials 3

# prove the grader/tasks aren't broken (no agent, no judge, no API keys)
pnpm verify-tasks
pnpm verify-tasks --task v2-01-basic-tool-server

# cross-run trend table (pass rate over time, skips old pre-v2 run.json files)
pnpm trends

# weekly synthesis report over the last N days, optionally posted to Slack
pnpm synthesize --days 7
pnpm synthesize --days 7 --results-dir eval-results/runs --slack
pnpm synthesize --dry-run   # build the prompt + print computed stats, skip the model call

# tests
pnpm test
```

Results land in `results/<runId>/` (gitignored), where the run id leads with what ran: `<task|N-tasks>--<condition|all-conditions>--<timestamp>`, e.g. `v2-01-basic-tool-server--noskill+blank--2026-06-11T18-40-40`. Each run dir holds `run.json` (raw trial rows, including its logical `batchId`), `report.md` (the scorecard), and per-trial `transcript.jsonl` + `memo.md` + workspace snapshots. **Read the transcripts/memos when a trial fails** — that's how you tell a real agent failure from a grader bug.

### `verify-tasks` — the grader's own gate

`pnpm verify-tasks` replaces the old `--agent golden` flow. For every task it copies the task's known-good
solution (`tasks/<id>/golden/`) into a fresh workspace and runs it through the exact same
`gradeWorkspace()` the real evals use — no agent, no judge, no API keys required. Every task must score
`contractPass: true` or the command exits 1. This is what proves a red trial is a real agent failure and not
a broken grader or a stale task contract; it gates CI (see `.github/workflows/evals.yml`) before any
agent/judge budget is spent.

## Required secrets / env

| Variable | Required for | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` (or `ANTHROPIC_AUTH_TOKEN`) | `--agent claude`, and the LLM judge when `--judge-model` is set to an Anthropic model id | Not required for `--agent codex` runs using the pinned default judge model (`gpt-5.6-sol`) — the judge preflight check keys off the resolved judge model, not the agent runner. |
| `OPENAI_API_KEY` (or `CODEX_API_KEY`) | `--agent codex`, and the LLM judge (the pinned default `--judge-model` in `src/graders/judge.ts` is a `gpt*` model) | Required by default unless you pass `--skip-judge` or `--judge-model` with an Anthropic model id. |
| `SLACK_WEBHOOK_URL` | `pnpm synthesize --slack` | Omit `--slack` to skip; passing it without the webhook set is a hard error. |
| `MCP_USE_EVAL_SANDBOX` | agent runs | `docker` (recommended for CI; requires Docker, uses `node:24-bookworm` by default — override with `MCP_USE_EVAL_DOCKER_IMAGE`) or unset for Vercel Sandbox. |

Export credentials in your shell or put them in `.env` (gitignored; loaded by `pnpm eval`/`pnpm synthesize`, shell env wins on conflict).

## Using the composite action from another repo

The root [`action.yml`](./action.yml) is a composite action: any repo can run these evals against its own
MCP server / SDK usage without checking out this whole harness by hand. It runs `pnpm eval`, locates the
newest `results/<runId>/`, computes the pass rate from `run.json`, and writes a step summary — it does
**not** upload artifacts or post PR comments; that's on the caller. Copy-paste starting point:

```yaml
name: mcp-use SDK evals

on:
  schedule:
    - cron: "0 14 * * 1,3,5" # Mon/Wed/Fri
  workflow_dispatch:

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: mcp-use/mcp-use-evals@main
        id: eval
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          agent: codex
          conditions: "noskill+blank"
          trials: "3"

      - name: Fail the build below a pass-rate floor
        if: fromJSON(steps.eval.outputs.pass-rate) < 80
        run: |
          echo "Pass rate ${{ steps.eval.outputs.pass-rate }}% is below the 80% floor"
          exit 1

      - uses: actions/upload-artifact@v4
        with:
          name: mcp-use-evals-results
          path: ${{ steps.eval.outputs.run-dir }}
```

Inputs: `anthropic-api-key` (only for Claude or an Anthropic judge), `openai-api-key`, `agent` (`codex`
default), `tasks` (comma-separated, default all), `conditions` (default `noskill+blank`; `variants` is a
deprecated alias), `trials` (default `3`), `batch-id` (optional grouping id), `model`
(empty = pinned per-agent default, see below), `judge-model`, `skip-judge` (default `false`), `timeout-min`
(default `20`), `sandbox` (default `docker`), `skill-dir` (default empty — see below). Outputs: `run-dir`,
`report` (path to `report.md`), `pass-rate` (0–100).

To request a `skill+*` condition from outside this monorepo, `MCP_USE_SKILL_DIR`'s default sibling-directory
resolution (`src/tasks.ts`) won't resolve, so you must check out the skill source yourself and pass its path
via `skill-dir`:

```yaml
      - uses: actions/checkout@v4
        with:
          repository: mcp-use/mcp-use # wherever skills/mcp-apps-builder lives
          path: skill-src

      - uses: mcp-use/mcp-use-evals@main
        id: eval
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          agent: codex
          conditions: "skill+blank,noskill+blank"
          skill-dir: ${{ github.workspace }}/skill-src/skills/mcp-apps-builder
```

## This repo's own scheduled runs

- **`.github/workflows/evals.yml`** — Mon/Wed/Fri (and `workflow_dispatch`). A `verify-tasks` job gates a
  `claude` × `codex` matrix (each leg `uses: ./`, the local action). Every leg uploads its `results/<runId>/`
  as a workflow artifact (workspace snapshots excluded) and publishes a compact copy — `run.json`,
  `report.md`, and `trials/**/memo.md` — to the orphan `eval-results` branch under `runs/<runId>/`.
- **`.github/workflows/weekly-synthesis.yml`** — Mondays. Checks out `main` and the `eval-results` branch,
  runs `pnpm synthesize --days 7 --results-dir eval-results/runs --slack`, uploads the report as an artifact,
  and commits it to `eval-results` under `synthesis/`.

The checked-in workflow currently retains the Claude × Codex matrix. To use the initial operating model above,
configure it to select **Codex only**, `noskill+blank`, and three trials per task; the README's baseline
counts assume that configuration.

### `eval-results` branch layout

```
eval-results/
  runs/
    <runId>/
      run.json
      report.md
      trials/
        <task>--<condition>--<trial>/
          memo.md
  synthesis/
    <YYYY-MM-DD>.md
```

`pnpm synthesize --results-dir eval-results/runs` reads `<dir>/*/run.json` — exactly this layout.

## Scoring rules (don't break the trend line)

- Run **≥3 trials** for any run you intend to compare over time; compare pass rate, not a single trial.
- **Never edit a task in place** — results carry a `promptHash`; a changed prompt is a different task. Add a new task dir instead.
- **Pass rate is the only headline metric.** No 0–100 blended score exists anywhere in this pipeline.
- **The judge is unscored.** It writes a prose memo per trial and never affects any number; changing the judge model at any time is safe and doesn't invalidate trend history the way changing the grader would.
- **Agent models are pinned, not "harness default."** `src/agent.ts` defaults `--agent claude` to `claude-sonnet-5` and `--agent codex` to `gpt-5.6-terra` (reasoning effort `high`) instead of deferring to whatever the AI SDK harness resolves as its own default. A harness's internal default can silently change across a dependency bump and quietly shift trend data — pinning here means a model change is a deliberate, visible edit to this file. `--model` / `--reasoning-effort` still override per invocation.
- **Infra failures are excluded, not counted as fails.** `valid: false` (sandbox prep failure, agent-harness crash, grader crash) is dropped from every denominator — it isn't evidence about the SDK.
- `GRADER_VERSION` (in `src/types.ts`) is recorded in every run's manifest; bump it when grading semantics change so `pnpm trends` / `pnpm synthesize` readers know a comparison crosses a version boundary.

## Adding a task

1. `tasks/<nn-name>/prompt.md` — pin the _observable contract_ (exact tool names, behavior, entry file, PORT handling) and leave implementation free, so the deterministic grader never fails a legitimate solution.
2. `tasks/<nn-name>/task.json` — expected tools, optional exact tool names and view URIs, resources and MIME types, ordered calls (`contains` / `not-contains` / `number-equals`, plus optional `isError`), pre/post-call resource reads, raw `inputRequiredCalls`, source provenance patterns, and optional build/start commands. Calls run in order on one session, so sequenced calls can assert stateful behavior. For open-ended app/deploy tasks where exact strings are too brittle, use `"deterministicReadiness": { "mode": "source-imports", "imports": [{ "source": "mcp-use/server" }] }` and keep `expectedTools`/`calls` empty — the grade is then `typecheck` + `imports` only, and reported outside the headline pass rate. For tasks that need external credentials during the agent phase, add `agentEnvKeys` with environment variable names only; the harness writes present values to `.env` / `.mcp-use-eval-env.sh` and excludes those files from synced snapshots. For OAuth tasks, add `"oauth": { "backend": "clerk" | "okta" }` — the harness runs a local IdP (a [vercel-labs/emulate](https://github.com/vercel-labs/emulate) backend, `src/oauth-backends.ts`) live during the agent phase, then grades against a **fresh** instance on a different port: it injects the IdP env vars when starting the server, probes for 401s on missing/wrong tokens, obtains a token via a headless authorization-code flow, and authenticates the tools/calls checks with it. Clerk tasks may also set `oauth.frontendApiUrl`; that real Clerk Frontend API URL is exposed only to the agent phase as `MCP_USE_OAUTH_CLERK_FRONTEND_API_URL`, while grading still uses the deterministic local issuer. `whoami`-style call expectations must use the seed constants exported from `src/oauth-backends.ts` (a test enforces this).
3. Optional `tasks/<nn-name>/starter/` — an existing project copied into the agent workspace before the run. Use this for debugging and migration tasks; omit it for greenfield tasks.
4. `tasks/<nn-name>/golden/` — a known-good solution; `pnpm verify-tasks --task <nn-name>` must score `contractPass: true` before you trust agent runs against it.
5. New SDK feature agents should adopt? Add a check to the ladder in `src/graders/functional.ts` (deterministic, unweighted — everything scored lives there) or watch for it turning up in judge memos first and promote it once it's a recurring, well-understood pattern.

### Current tasks

| Task                               | Exercises                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `v2-01-basic-tool-server`          | Single typed tool, streamable HTTP, PORT handling — the SDK happy path                                                   |
| `v2-02-stateful-ticket-queue`      | Four CRUD tools over shared in-memory state, sequenced lifecycle calls, "not found" error contract, count reporting      |
| `v2-03-docs-lookup-server`         | Read-only lookup server: an index resource, per-slug parameterized resource reads, and a search tool over seeded content |
| `v2-06-project-board-composition` | Tools plus live resources over shared state — a resource read must reflect a prior tool call's effect                    |
| `v2-07-debug-inventory-server` | Repair an existing, behaviorally broken inventory server from a task-owned starter fixture |
| `v2-08-openapi-order-service` | Generate an exact order-service tool surface from a bundled OpenAPI document and local upstream |
| `v2-09-raw-input-required-approval` | Multi-round deployment approval using only raw `input_required` helpers |
| `v2-10-multi-view-incident-console` | Build, start, list, read, and call two independently bound MCP Apps views |
| `v2-11-middleware-protected-audit` | Protocol middleware authorization, error results, and a post-call audit resource |

## Known limitations

- Agent runs use the stable AI SDK v7 harness (`@ai-sdk/harness`) with selectable `claude` and `codex` runners. The prepared local workspace is uploaded to the selected network sandbox (`MCP_USE_EVAL_SANDBOX=docker` or `vercel`) before the turn and synced back afterward for the local graders.
- OAuth task env vars are staged into `.env` and `.mcp-use-eval-env.sh` in the agent workspace. The prompt tells the agent to source the shell file before commands that need those values.
- Everything the harness spawns (agent, graders, the server under test) gets a sanitized environment (`sanitizedEnv()` in `src/proc.ts`): plain `/bin/bash` instead of the user's login shell, no `npm_*`/`PNPM_*` script-context vars, no monorepo `node_modules/.bin` on `PATH`, no inherited `NODE_ENV`. Without this, the user's shell rc and the `pnpm eval` context pollute every Bash result the agent sees (and the judge reads).
- Trials run sequentially (servers bind real ports; agent runs are the bottleneck anyway).
