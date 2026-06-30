# @mcp-use/sdk-evals

Agentic-readiness evals for the mcp-use TypeScript SDK ([MCP-2072](https://linear.app/manufact/issue/MCP-2072)): how well can coding agents build MCP servers with our SDK, and what should we fix (docs / skill / SDK / templates) when they can't?

Evals run against the **published npm package** — what agents in the wild actually get.

## How it works

Each trial: prepare a fresh sandbox (OS tmpdir) → run an agent against a task prompt → produce one score: **Readiness**.

| Layer | How | Measures |
| --- | --- | --- |
| **Functional checks** | By default: `tsc --noEmit`, server starts, expected tools/resources list, and tool calls return correct results. OAuth tasks also require the intended SDK OAuth provider, 401s for missing/wrong tokens, and acceptance of an IdP-issued token. Open-ended app/deploy tasks can instead opt into `deterministicReadiness.mode: "source-imports"`, which caps readiness from typecheck + required SDK imports only. | Did the agent build the required thing, or for open-ended app tasks, did it use the intended SDK path? |
| **Deterministic penalties** | Source and transcript detectors (`raw-sdk-import`, `package-export-confusing`, `deep-type-spelunking`, `compile-repair-loop`, ...). Direct type/artifact inspection is neutral unless it shows costly public-API discoverability friction. | Which docs / skill / SDK / template lever should move? |
| **LLM judge criteria** | A pinned judge model grades stable yes/no/unknown readiness criteria over the final code and transcript. Each "no" verdict maps to a fixed readiness penalty. | Nuanced agentic failures that are hard to catch with regexes alone. |
| **Judge discovery findings** | The judge also reports unscored observations and suggestions. Promote recurring findings into scored readiness criteria or deterministic detectors. | How the rubric should evolve. |

Readiness starts at 100, subtracts deterministic and judge penalties, clamps to 0, and is capped by the functional check score. Every variant×trial runs in a fresh sandbox; readiness penalties aggregate into a per-run `report.md` with a "Top Readiness Penalties" section - each entry names the improvement lever (docs / skill / SDK / template / process).

### Variants

A trial runs under a variant = `skill|noskill` × `scaffold|blank`, with two extra blank-workspace docs variants for documentation experiments:

- **skill** — `skills/mcp-apps-builder` copied into the sandbox's project skill directory (`.claude/skills/` for Claude, `.codex/skills/` for Codex), and the prompt points the agent to the copied skill. Set `MCP_USE_SKILL_DIR` to read the skill from a separate checkout.
- **scaffold** — workspace pre-scaffolded with `create-mcp-use-app` (starter template); **blank** = empty dir, tests discovery from nothing
- **blank+docs-old** — empty workspace plus a prompt link to the current production TypeScript docs: <https://docs.mcp-use.com/typescript/getting-started/welcome>
- **blank+docs-new** — empty workspace plus a prompt link to the preview TypeScript docs at <http://localhost:3000/typescript/getting-started/welcome>. Set `MCP_USE_EVAL_NEW_DOCS_URL` to override it.

When a run includes both docs variants, `report.md` includes a "Docs Comparison" section with old-vs-new readiness, functional, and penalty deltas.

## Usage

Agent runs use a network sandbox. Set `MCP_USE_EVAL_SANDBOX=docker` to run the agent in a local Docker container (the recommended CI path; requires Docker). Without that env var, the harness uses Vercel Sandbox. Docker runs use `node:24-bookworm` by default; set `MCP_USE_EVAL_DOCKER_IMAGE` to override it.

Agent runs also require direct provider credentials for the selected AI SDK harness:

- `--agent claude` (default) uses `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN`.
- `--agent codex` uses `OPENAI_API_KEY` or `CODEX_API_KEY`.
- The readiness judge uses `ANTHROPIC_API_KEY`. It is part of default scoring; pass `--skip-judge` only for local smoke tests or golden grader checks.

Export credentials in your shell or put them in `.env` (gitignored; loaded by `pnpm eval`, shell env wins on conflict).

```bash
# from this repo
pnpm install

# use Docker instead of Vercel Sandbox for agent workspaces
export MCP_USE_EVAL_SANDBOX=docker

# smoke-test the graders without an agent (copies the task's golden solution)
pnpm eval --agent golden --skip-judge

# quick single run during iteration
pnpm eval --task 01-basic-tool-server --variant noskill+blank

# compare blank workspaces with docs links
pnpm eval --task 01-basic-tool-server --variant blank+docs-old --variant blank+docs-new

# compare harness adapters
pnpm eval --agent codex --task 01-basic-tool-server
pnpm eval --agent claude --task 01-basic-tool-server

# recorded run: full matrix, 3 trials per cell
pnpm eval --variant all --trials 3

# cross-run trend table
pnpm trends
```

Results land in `results/<runId>/` (gitignored), where the run id leads with what ran: `<task|N-tasks>--<variant|all-variants>[--golden]--<timestamp>`, e.g. `01-basic-tool-server--noskill+blank--2026-06-11T18-40-40`. Each run dir holds `run.json` (raw rows), `report.md` (scorecard), and per-trial transcripts + workspace snapshots. **Read the transcripts when a trial fails** — that's how you tell a real agent failure from a grader bug.

## Scoring rules (don't break the trend line)

- Run **≥3 trials** for any run you intend to compare over time; compare mean readiness, not a single trial.
- The **judge model is pinned** (`--judge-model`, default in `src/graders/judge.ts`). Changing it re-calibrates the judge trend — do it deliberately and note it.
- **Never edit a task in place** — results carry a `promptHash`; a changed prompt is a different task. Add a new task dir instead.
- **Readiness is the only headline score.** Functional checks cap it; deterministic penalties and LLM-judge penalties explain it.
- Judge criteria are scored by default. Judge discovery findings are not scored until you promote them into a criterion or deterministic detector.
- Readiness penalties are scored and trended. A new detector or judge criterion changes what's measured; note it when comparing across runs.

## Adding a task

1. `tasks/<nn-name>/prompt.md` — pin the _observable contract_ (exact tool names, behavior, entry file, PORT handling) and leave implementation free, so the deterministic grader never fails a legitimate solution.
2. `tasks/<nn-name>/task.json` — expected tools, optional expected resources, fixture calls (`contains` / `not-contains` / `number-equals` expectations; calls run in order on one session, so sequenced calls can assert stateful behavior), optional `resourceReads`, optional `readinessBudgets`, and valid variants. For open-ended app/deploy tasks where exact strings are too brittle, use `"deterministicReadiness": { "mode": "source-imports", "imports": [{ "source": "mcp-use/server" }] }` and keep `expectedTools`/`calls` empty. For tasks that need external credentials during the agent phase, add `agentEnvKeys` with environment variable names only; the harness writes present values to `.env` / `.mcp-use-eval-env.sh` and excludes those files from synced snapshots. For OAuth tasks, add `"oauth": { "backend": "clerk" | "okta" }` — the harness runs a local IdP (a [vercel-labs/emulate](https://github.com/vercel-labs/emulate) backend, `src/oauth-backends.ts`) live during the agent phase, then grades against a **fresh** instance on a different port: it injects the IdP env vars when starting the server, checks that source uses the expected SDK provider (`oauthClerkProvider()` for Clerk, `oauthCustomProvider()` for the custom IdP), probes for 401s, obtains a token via a headless authorization-code flow, and authenticates the tools/calls checks with it. Clerk tasks may also set `oauth.frontendApiUrl`; that real Clerk Frontend API URL is exposed only to the agent phase as `MCP_USE_OAUTH_CLERK_FRONTEND_API_URL`, while grading still uses the deterministic local issuer. The Clerk backend is a JWT/JWKS-compatible local issuer and intentionally does not emulate Dynamic Client Registration; DCR belongs in a separate integration test or a purpose-built fake. `whoami`-style call expectations must use the seed constants exported from `src/oauth-backends.ts` (a test enforces this).
3. `tasks/<nn-name>/golden/` — a known-good solution; `--agent golden` must score 100/100 before you trust agent runs.
4. New SDK feature agents should adopt? Add a readiness detector or judge criterion in `src/graders/readiness.ts` / `src/graders/judge.ts`.

### Current tasks

| Task                        | Exercises                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `01-basic-tool-server`      | Single tool, zod schema, streamable HTTP, PORT handling — the SDK happy path                                        |
| `02-stateful-notes-server`  | Four CRUD tools over shared in-memory state, sequenced lifecycle calls, "not found" error contract, count reporting |
| `03-oauth-clerk`            | Clerk-protected server via `oauthClerkProvider()` zero-config env, JWKS verification, identity from the auth context |
| `04-oauth-custom-idp`       | Generic OIDC IdP via `oauthCustomProvider` + `jwksVerifier` (issuer/audience claim checks), env-driven configuration |
| `05-job-board-context`      | Job board browsing with current liked-listing state, ambiguous "Am I qualified for this?" follow-up, model-context UI |
| `06-stormdesk-mcp-app-deploy` | Hand-built MCP App widget from blank workspace, resources, mcp-use client CLI verification, no OAuth, optional Manufact Demo Org deploy |

## Known limitations

- Agent runs use the AI SDK v7 harness canary (`@ai-sdk/harness`) with selectable `claude` and `codex` runners. The prepared local workspace is uploaded to the selected network sandbox (`MCP_USE_EVAL_SANDBOX=docker` or `vercel`) before the turn and synced back afterward for the existing local graders.
- OAuth task env vars are staged into `.env` and `.mcp-use-eval-env.sh` in the agent workspace. The prompt tells the agent to source the shell file before commands that need those values.
- Everything the harness spawns (agent, graders, the server under test) gets a sanitized environment (`sanitizedEnv()` in `src/proc.ts`): plain `/bin/bash` instead of the user's login shell, no `npm_*`/`PNPM_*` script-context vars, no monorepo `node_modules/.bin` on `PATH`, no inherited `NODE_ENV`. Without this, the user's shell rc and the `pnpm eval` context pollute every Bash result the agent sees (and the judge reads).
- Trials run sequentially (servers bind real ports; agent runs are the bottleneck anyway).
