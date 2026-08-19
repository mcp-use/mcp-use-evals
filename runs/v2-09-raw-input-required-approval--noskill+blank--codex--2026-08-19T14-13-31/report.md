# mcp-use SDK agentic eval — 2026-08-19

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-19T14-13-31` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 67% (2/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 2/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m31s
- Median turns: 20
- Median tool calls: 38
- Median tokens in/out: 1765579.5 / 10035.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was decline wording: `src/server.ts` returns `"Deployment was not approved."` for `response.action === "decline" || response.action === "cancel"`, while the other rejection branch returns `"Deployment was declined."`; the deterministic check expected the explicit decline result to contain `decline`. The agent’s own live verification exposed the problematic text—`"isError":true ... "Deployment was not approved."`—but it concluded that the flow was correct: “`a single terminal isError result for a decline`.” This suggests verification checked terminality but not the required decline-specific message.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent leaned heavily on installed package internals to discover the API, first running `rg -n "inputRequired|inputResponse|acceptedContent|createMcp|McpServer|streamable" node_modules/mcp-use` and later inspecting `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. This discovery was prolonged because initial searches returned little or nothing, including `rg ... "inputRequired|InputRequest|acceptedContent|inputResponse"` with an empty result and another command exiting with `exitCode:1`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main discovery cost was learning the raw helper API by repeatedly inspecting installed packages rather than from readily found docs: the agent ran `rg -n "inputRequired|inputResponse|acceptedContent|inputResponses|streamable" node_modules/mcp-use` and several follow-up searches in `node_modules/@modelcontextprotocol/server`. Its attempt to find usage documentation returned nothing: `rg -n "curl|tools/call|initialize|inputResponses|MCP-Protocol-Version" node_modules/mcp-use/README.md node_modules/mcp-use/docs` produced `output":""`. No skill file or external docs URL appears in the transcript.
