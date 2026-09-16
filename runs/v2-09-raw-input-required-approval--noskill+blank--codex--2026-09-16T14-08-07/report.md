# mcp-use SDK agentic eval — 2026-09-16

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-16T14-08-07` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m25s
- Median turns: 23
- Median tool calls: 31
- Median tokens in/out: 1324216 / 8287
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The substantive miss was the decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`, while the separate `approve: false` branch says `"Deployment was declined."`. This made explicit decline handling semantically terminal but inconsistent with the expected decline marker, despite the agent concluding that “`a decline returns a complete isError result`.”
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The substantive miss was decline-message wording: `src/server.ts` returns `deploymentError("Deployment was not approved.")` for a response whose action is not accept, while the grader expected the final result to contain `decline`. The agent’s own declined-retry verification exposed exactly this output—`"text":"Deployment was not approved."`—but it still concluded, `Declined approval returned one terminal error result`, without checking the required wording closely enough. By contrast, accepted `approve: false` uses `deploymentError("Deployment was declined.")`, so the two decline paths were inconsistently phrased in `src/server.ts`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was API discovery in installed packages: the agent repeatedly searched declarations and bundled internals, including `rg -n "inputRequired|inputResponse|acceptedContent|Streamable|streamable|HTTP" node_modules/mcp-use` and later inspected `node_modules/@modelcontextprotocol/server/dist/*.mjs` plus `node_modules/@modelcontextprotocol/client/dist/index.d.mts`. No skill file or fetched docs URL appears; the run leaned on `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `context.d.ts`, and upstream MCP package declarations.
