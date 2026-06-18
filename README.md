# mcp-use agentic-readiness evals

Measures how well coding agents (Claude Code, Codex) build MCP servers with the **mcp-use**
TypeScript SDK — run in Vercel Sandboxes via [`@vercel/agent-eval`](https://github.com/vercel-labs/agent-eval),
scored into a single **Readiness Score (0–100)** you can track over time.

Tracks Linear **MCP-2072**.

## How it works

1. `@vercel/agent-eval` runs an agent in a Vercel Sandbox on a **scenario** (a task + starter
   workspace), and captures the transcript + generated code.
2. An `onRunComplete` hook scores the run (`scoring/`) and attaches it to `result.analysis.readiness`.
3. `npm run scorecard` aggregates every run into per-variant means, reliability, and **deltas**.

## Scoring (readiness-v0.1)

One 0–100 score per run, normalized over the dimensions actually measured:

| Dimension | Weight | Source | Status |
| -- | --: | -- | -- |
| Builds & typechecks | 25 | deterministic (gate) | ✅ |
| Functional (MCP-client probe) | 40 | deterministic | ⏳ not wired yet |
| API correctness | 20 | deterministic lints (deductions) | ✅ |
| Efficiency | 10 | transcript vs per-scenario budget | ✅ |
| Process quality | 5 | LLM judge (bounded) | ✅ |

- **Deterministic-anchored.** The judge owns only the 5-pt process slice, so the headline number
  stays stable across reruns/model changes. The judge's real value is **lever-tagged findings**
  (`docs` / `template` / `sdk` / `skill` / `process`) that feed the improvement loop.
- **Two tiers, one catalog.** Deterministic lints (`legacy-factory`, `hand-rolled-content-block`,
  `hand-rolled-jwks`, …) sit beside judge findings (`struggled-to-find-api`, `fought-template`, …).
  Judge findings that recur can graduate into lints.
- Until the MCP-client probe lands, `functional` is disabled and the score normalizes over the
  other four dimensions. `configVersion` + the per-run `dimensions` array keep trends like-for-like.

Companion numbers from the scorecard: **reliability** (% of trials clearing the gate) and
**skill / scaffold deltas** (score with vs without each treatment).

## A/B matrix (experiments)

Each `experiments/<variant>.ts` is one condition. `skill` and `scaffold` are independent treatments
injected into the sandbox before the agent runs (`scoring/injectors.ts` + `editPrompt`).

| condition | Claude Code | Codex |
| -- | -- | -- |
| blank | `blank-cc` | `blank-codex` |
| scaffold | `scaffold-cc` | `scaffold-codex` |
| skill | `skill-cc` | `skill-codex` |
| skill + scaffold | `skill+scaffold-cc` | `skill+scaffold-codex` |

**Treatments (`scoring/injectors.ts`):**

- **skill** — installs the real mcp-use [`mcp-apps-builder`](assets/skills/mcp-apps-builder) skill
  (vendored snapshot, re-synced from `$DEV/mcp-use/skills/`) into the agent's skills dir
  (`cc` → `.claude/skills/`, `codex` → `.codex/skills/`), exactly like `create-mcp-use-app --skills`,
  and prepends a prompt prefix pointing the agent at it.
- **scaffold** — runs the real `create-mcp-use-app --template mcp-apps` to seed the workspace with a
  genuine mcp-use project, then the agent builds on top. Because the scenario files land first and the
  scaffolder rejects a non-empty dir, it scaffolds into a temp subdir and overlays. The scaffolded
  project keeps its own `build` (`mcp-use build`), which becomes the build gate for scaffold variants;
  `vitest` is patched back in so `EVAL.ts` still runs.

## Layout

```
evals/<scenario>/      task workspace (PROMPT.md, EVAL.ts, package.json, src/)
experiments/<v>.ts     A/B variant — defineExperiment({ agent, skill, scaffold })
scoring/               readiness library (lints, judge, score engine, hook, factory)
scripts/scorecard.ts   aggregator → scorecard + deltas + lever rollup
```

## Setup

```bash
npm install
cp .env.example .env.local
```

Keys: an **agent** key (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` for direct, or `AI_GATEWAY_API_KEY`),
`AI_GATEWAY_API_KEY` (or `VERCEL_OIDC_TOKEN`) for the **judge + failure classifier**, and
`VERCEL_TOKEN` for the **sandbox**.

## Run

```bash
npx agent-eval blank-cc --dry     # preview a variant (no cost)
npx agent-eval blank-cc           # run one variant
npx agent-eval                    # run the whole matrix
npm run scorecard                 # aggregate runs → readiness scorecard
npx agent-eval playground         # browse runs in the UI
```

## Run in CI (GitHub Actions)

`.github/workflows/evals.yml` runs the evals on a GitHub-hosted runner using the
**local Docker sandbox** (ubuntu runners ship Docker, so no `VERCEL_TOKEN` is needed).
It's **manual only** (`workflow_dispatch`) — each run boots containers and calls paid
LLM APIs. From the **Actions → Readiness evals → Run workflow** menu:

- **variant** — pick one variant or `all` (the full 8-variant matrix). `all` fans out
  one parallel job per variant; a final job downloads every job's `results-*` artifact,
  runs `npm run scorecard`, and writes the scorecard to the run summary.
- **smoke** — run just 1 scenario per variant (cheap end-to-end check of keys + sandbox).
- **force** — ignore run fingerprints and re-run everything.

Required **repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Needed for |
| -- | -- |
| `ANTHROPIC_API_KEY` | Claude Code (`*-cc`) variants **and** the LLM judge — set this always |
| `OPENAI_API_KEY` | Codex (`*-codex`) variants |
| `AI_GATEWAY_API_KEY` | optional — only if you switch experiments to the gateway agent ids |

Artifacts per run: `results-<variant>` (each variant's `results/`) and `scorecard`
(the merged tree + `scorecard.txt`).

## Next

- **MCP-client probe** in `EVAL.ts` (boots the server, `initialize → tools/list → tools/call`,
  asserts) → enables the 40-pt functional dimension + a hard boot gate.
- Bump `runs` per variant for stable distributions. Judge model defaults to
  `anthropic/claude-opus-4-8` (override with `READINESS_JUDGE_MODEL`).
- **Timeouts:** the per-run default is **1200s** (`scoring/experiment.ts`), doubled from 600s because
  heavy scenarios were flooring — and the scaffold's `mcp-use build` (vite widget bundling) is heavier
  than the bare `tsc --noEmit` gate. Bump further per-variant via `timeout` if runs still floor.
