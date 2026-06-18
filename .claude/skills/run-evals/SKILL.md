---
name: run-evals
description: >-
  How to run the mcp-use agentic-readiness evals in this repo (MCP-2072) — the
  `@vercel/agent-eval` harness, the A/B experiment matrix, running a single
  scenario, where results land, and the scorecard. Use whenever the user asks to
  run an eval / a variant (blank-cc, scaffold-codex, …) / a single scenario
  (e.g. a stormdesk eval), preview a dry run, or aggregate a scorecard. Skip for
  repos that aren't mcp-use-eve-evals.
---

# Running the mcp-use readiness evals

This repo measures how well coding agents (Claude Code, Codex) build MCP servers
with the mcp-use TS SDK. Read `README.md` for the scoring model; this skill is the
operational how-to so you don't re-derive it.

## Mental model

- **Harness:** `@vercel/agent-eval` (CLI: `npx agent-eval`). It boots a sandbox,
  runs the agent on a scenario, captures transcript + generated code, then the
  `onRunComplete` hook (`scoring/`) scores the run.
- **Experiments** = the A/B variants, one file each in `experiments/<variant>.ts`.
  Names: `blank` / `scaffold` / `skill` / `skill+scaffold`, each `× cc | codex`
  (e.g. `blank-cc`, `skill+scaffold-codex`). Each is a one-liner calling
  `defineExperiment({ agent, agentLabel, skill, scaffold })` (`scoring/experiment.ts`).
- **Scenarios** (a.k.a. evals/fixtures) = the tasks, one dir each in
  `evals/<scenario>/` (`PROMPT.md`, `EVAL.ts`, `package.json`, `tsconfig.json`).
  Discovered automatically. Current set: `basic-tool-server`, `oauth-clerk`,
  `oauth-custom-idp`, `stateful-notes-server`, `stormdesk-mcp-app`,
  `stormdesk-skybridge-app`.
- **`EVAL.ts` is generated, not hand-written.** It's the **functional probe**: in the
  sandbox it boots the agent's server, connects with the mcp-use client SDK, and lists
  tools (OAuth: boot + 401), emitting a `__READINESS_PROBE__…` stdout marker that scoring
  parses. The probe body lives once in `scripts/gen-evals.ts`; regenerate all six with
  `node scripts/gen-evals.ts` after editing it. Never hand-edit `evals/<scenario>/EVAL.ts`.

## Prerequisites

- **Docker daemon running** — `defineExperiment` sets `sandbox: 'docker'`, so runs
  are local containers. Check: `docker info`.
- **Keys in `.env`** (loaded automatically): `ANTHROPIC_API_KEY` (Claude Code agent
  + the LLM judge falls back to it), `OPENAI_API_KEY` (Codex agent), `VERCEL_TOKEN`
  (Vercel sandbox backend if ever switched off docker). The judge prefers a gateway
  key (`AI_GATEWAY_API_KEY` / `VERCEL_OIDC_TOKEN`) but transparently uses
  `ANTHROPIC_API_KEY` if none is set, so process scoring still works.
- Default per-run timeout is 600s; `runs` defaults to 1.

## Commands

```bash
npx agent-eval blank-cc --dry     # preview which scenarios a variant runs (no cost)
npx agent-eval blank-cc           # run one variant across ALL scenarios
npx agent-eval blank-cc --smoke   # run just the first scenario (alphabetical) as a sanity check
npx agent-eval                    # run the whole matrix (every variant × every scenario)
EVAL_FILTER='oauth-*' npx agent-eval blank-cc   # scope to specific scenarios (see below)
node scripts/gen-evals.ts         # (re)generate the EVAL.ts functional probes after editing the generator
npm run scorecard                 # aggregate results/ → pass / readiness / skill Δ + judge notes + SDK worklist
npx agent-eval playground         # browse runs in the web UI
```

Long runs: kick off with `run_in_background: true` and watch the tee'd log; the
sandbox + agent + scoring takes minutes per scenario.

## Run a SINGLE scenario (the common ask)

The CLI has **no scenario-filter flag** — filtering is done via `config.evals`
(accepts an exact name, a glob, or an array — `@vercel/agent-eval`'s
`resolveEvalNames`). Rather than hand-editing the variant file, `defineExperiment`
(`scoring/experiment.ts`) reads the **`EVAL_FILTER`** env var and sets `config.evals`
from it. So scope scenarios by just exporting the env var — no file edits, no revert:

```bash
# unset / empty / "all" → run every scenario (default)
EVAL_FILTER=stormdesk-mcp-app           npx agent-eval blank-cc --dry   # exactly 1
EVAL_FILTER='basic-tool-server,oauth-clerk' npx agent-eval blank-cc      # comma list → 2
EVAL_FILTER='basic-tool-server oauth-clerk' npx agent-eval blank-cc      # spaces also OK
EVAL_FILTER='oauth-*'                   npx agent-eval blank-cc           # glob → both oauth-*
EVAL_FILTER='stormdesk-*'               npx agent-eval blank-cc           # glob → both stormdesk-*
```

How it parses: a comma/space-separated value becomes a `string[]` (each item an exact
name or a glob); a lone value passes through as a string. `all`/empty leaves
`config.evals` unset (run all). Unknown names error at run time with
`Eval "<name>" not found. Available evals: …` (note: a `--dry` preview falls back to
"all" instead of erroring, so a real run is what surfaces a typo).

Results still land under the real variant name (`blank-cc/`), keeping the scorecard
consistent — filtering only narrows *which* scenarios run, not where they're written.

## Run in CI (GitHub Actions)

`.github/workflows/evals.yml` is `workflow_dispatch`-only (each run costs money). Its
inputs mirror the local levers: **variants** (`all` or a comma/space list of variant
names — fans out one parallel job each; unknown names fail the prepare job fast),
**evals** (`all`, a glob, or a comma/space list of scenario names — wired straight to
the `EVAL_FILTER` env var above), plus **smoke** and **force**. See `README.md` for
the required secrets and artifact layout.

## Where results land

```
results/<variant>/<model>/<timestamp>/<scenario>/run-N/
  result.json     # full run; scoring is under result.analysis.readiness
  project/        # the agent's generated code (copyFiles: 'changed')
  outputs/        # captured stdout/scripts
```

Read `result.analysis.readiness` for the 0–100 `score`, the `dimensions` breakdown,
lever-tagged `findings`, the LLM `judge.summary`, and the new `functionalPassed` +
`probe` (the MCP-client probe's verdict: `booted` / `connected` / `toolCount` / `tools` /
`oauthChallenge` / `pass`). The `__READINESS_PROBE__…` marker is also in
`outputs/eval.txt`. Then `npm run scorecard` rolls everything into pass / readiness /
skill Δ per scenario × agent, the judge's prose notes per run, and the SDK-defect worklist.
