# mcp-use SDK agentic eval — 2026-09-11

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-11T14-08-21` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 67% (2/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 2/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m50s
- Median turns: 27
- Median tool calls: 34.5
- Median tokens in/out: 1714482.5 / 8473.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The substantive contract miss was the decline wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")`, while the deterministic check required the final result to contain `decline`. The agent’s verifier only asserted `!declinedFlow.result.isError` in `scripts/verify.ts`, so its success message—`Verified accepted approval with note and terminal declined approval.`—did not validate the decline text and allowed this mismatch through.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main SDK papercut was schema compatibility: the agent initially installed Zod 3 (`zod@3.25.76`), then typechecking failed because `Property 'jsonSchema' is missing`. It had to switch to Zod 4 via `npm install zod@'^4.0.0'`, after which `npx tsc --noEmit` passed. This suggests the SDK’s typed schema requirement was not obvious from package metadata.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was discovering the exact 2026-07-28 HTTP request shape through repeated failures. The test first lacked `_meta` (`request is missing the required per-request envelope key(s): _meta`), then lacked its namespaced fields (`missing the required per-request envelope key(s): io.modelcontextprotocol/protocolVersion, io.modelcontextprotocol/clientCapabilities`), then required two non-obvious headers (`the required Mcp-Method header is absent` and `the required Mcp-Name header is absent`), and finally needed the elicitation capability (`client capabilities do not declare the required capability`). The agent resolved this incrementally by editing `test/approval-flow.ts` after each error and grepping installed packages for protocol keys: `rg -n "io\\.modelcontextprotocol/protocolVersion|io\\.modelcontextprotocol/clientCapabilities" node_modules/@modelcontextprotocol`.
