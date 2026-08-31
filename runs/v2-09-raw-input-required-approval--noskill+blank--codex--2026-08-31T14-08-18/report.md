# mcp-use SDK agentic eval — 2026-08-31

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-31T14-08-18` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m39s
- Median turns: 21
- Median tool calls: 37
- Median tokens in/out: 1995587 / 8291
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main time sink was SDK/protocol discovery through installed package internals rather than documentation: the agent repeatedly ran searches such as `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. This did uncover the needed API behavior, including `acceptedContent(responses, key, schema) requires a synchronously-validating schema`, but required several exploratory commands.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was decline wording: the declined-response branch returns `terminalError("Deployment was not approved.")` in `src/server.ts`, while the separate `approve: false` branch returns `terminalError("Deployment was declined.")`. The agent’s test only asserted `assert.equal(declined.isError, true)` in `src/flow.test.ts`, so `"Approval and decline flows verified."` did not verify that the decline result text actually contained “decline.” The live smoke test exposed the exact final text—`"text":"Deployment was not approved."`—but the agent still concluded it had confirmed a `"terminal declined error"`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline message: `src/server.ts` returns `text: "Deployment was not approved. No deployment was performed."`, while the deterministic check reports `did not match {"type":"contains","value":"decline"}`. The agent’s own verification only checked terminal shape, then concluded `The protocol checks passed`; it did not assert that the error text contained “decline,” despite sending an input response with `"action":"decline"`.
