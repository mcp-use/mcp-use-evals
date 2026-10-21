# mcp-use SDK agentic eval — 2026-10-21

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-21T14-07-57` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m48s
- Median turns: 18
- Median tool calls: 26
- Median tokens in/out: 1154016 / 8662
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the cancellation/decline wording: the non-accept branch returned `terminalError("Deployment was not approved.")` (`src/server.ts`), while the grader required the final result to contain “decline”; the transcript’s live check showed `"text":"Deployment was not approved."`. The agent treated that response as sufficient, reporting `verified: initial form, accepted approval with note, terminal decline`, so its verification checked terminality but not the expected decline wording. By contrast, `approve: false` used `terminalError("Deployment was declined.")` (`src/server.ts`), creating inconsistent messages for two decline paths.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline error wording: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check reports `did not match {"type":"contains","value":"decline"}`. The agent verified only that the response was terminal—`"isError":true,"resultType":"complete"`—and concluded, `A declined retry returns one isError: true terminal result`, but did not align the message itself with the expected decline wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main friction was API discovery through installed declarations: the agent repeatedly ran searches such as `rg -n "inputRequired|inputResponse|acceptedContent|Streamable|streamable|create.*server|McpServer" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `@modelcontextprotocol/server/dist/*.d.mts`. One search took a wrong path because it assumed `.d.ts` files and returned `exitCode:2`; the package actually exposed declarations such as `index.d.mts`.
