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

## Next

- **MCP-client probe** in `EVAL.ts` (boots the server, `initialize → tools/list → tools/call`,
  asserts) → enables the 40-pt functional dimension + a hard boot gate.
- Drop in the real mcp-use **skill** (`MCP_USE_SKILL_MD` or `scoring/injectors.ts`) and **scaffold**
  (`MCP_USE_SCAFFOLD_CMD`) — currently placeholders.
- Bump `runs` per variant for stable distributions. Judge model defaults to
  `anthropic/claude-opus-4-8` (override with `READINESS_JUDGE_MODEL`).
