# mcp-use SDK agentic eval — 2026-09-30

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-30T14-08-31` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m44s
- Median turns: 19
- Median tool calls: 25
- Median tokens in/out: 817048.5 / 8309
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had to discover the SDK API directly from the installed package, inspecting `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/config.d.ts`; this exposed the relevant signature, `listen(port?: number | undefined, options?: ListenOptions)`, and the config note that the listener uses `PORT`. No skill file or fetched external docs appear in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main delay was dependency setup rather than SDK implementation: the first install failed with `npm error 404 Not Found - GET https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz`, requiring a pinned retry, `npm install mcp-use@2.7.2 zod@3.24.2 --no-audit --no-fund`.
