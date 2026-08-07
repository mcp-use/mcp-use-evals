# mcp-use SDK agentic eval — 2026-08-07

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-07T14-23-34` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 67% (2/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 2/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m42s
- Median turns: 16.5
- Median tool calls: 28.5
- Median tokens in/out: 1199063 / 6862.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was inconsistent terminal wording: `src/server.ts` returns `errorResult("Deployment was not approved.")` for protocol-level decline/cancel, but returns `errorResult("Deployment was declined.")` only for accepted content with `approve: false`. The verifier checked only `assert.equal("isError" in declined && declined.isError, true)` and never asserted that the decline message contained “decline,” so its success banner—`Verified accepted approval (with note) and terminal declined approval.`—did not catch the contract-call mismatch.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main time sink was SDK/API discovery through installed package internals rather than concise examples: the agent repeatedly ran searches such as `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable|inputResponses|createMCP" node_modules/mcp-use` and inspected `node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`. The only documentation surfaced was the SDK README’s spec pointer, `implementing the [2026-07-28 MCP spec](https://modelcontextprotocol.io/specification/2026-07-28)`, so the run leaned primarily on declaration files and bundled implementation code, not a skill file or fetched docs URL.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was discovering the raw helper and wire-protocol shapes by repeatedly grepping installed packages rather than using higher-level documentation: `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable|http" node_modules/mcp-use` followed by searches through `node_modules/@modelcontextprotocol/server`. The agent specifically relied on declaration files such as `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/tools.d.ts`, and `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`; no skill file or fetched docs URL appears in the transcript.
