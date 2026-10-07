# mcp-use SDK agentic eval — 2026-10-07

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-07T14-07-28` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m33s
- Median turns: 18
- Median tool calls: 30
- Median tokens in/out: 1229094 / 6894
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was in decline handling: `src/server.ts` routes any non-accept action through `if (response.kind !== "elicit" || response.action !== "accept" || !approval)` and returns `"Deployment approval was not granted."`, while only accepted `{ approve: false }` reaches `"Deployment was declined."`. The agent’s own live decline test exposed the problematic text — `Deployment approval was not granted.` — but it concluded only that the retry was terminal: `"the declined retry returned a completed isError result (no input_required)"`. This overlooked the grader’s expected decline-identifying content and caused `input-required:request_deploy:2` to fail.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main discovery cost was learning the raw multi-round API from installed package internals rather than concise examples: the agent searched `node_modules/mcp-use` for `"inputRequired|inputResponse|acceptedContent"` and then inspected `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. The packaged README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but no external docs or skill file were used in the visible run.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline error text: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check required the final result to contain `decline`. The focused test failed to catch this because `test/deployment-flow.test.ts` only checks `assert.equal(declined.isError, true)`, `assert.notEqual(declined.resultType, "input_required")`, and absence of `"inputRequests"`; it never asserts the terminal message content. This led the agent to conclude prematurely that `"approval and terminal decline flows verified"`.
