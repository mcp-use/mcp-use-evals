# mcp-use SDK agentic eval — 2026-11-11

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-11T14-05-17` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 16
- Median tool calls: 24
- Median tokens in/out: 1052709 / 6381
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the terminal decline wording: the explicit `action:"decline"` branch returned `Deployment was not approved.` (`src/server.ts`: `response.action !== "accept"` → `terminalError("Deployment was not approved.")`), while only accepted content with `approve: false` returned `Deployment was declined.` (`src/server.ts`: `if (!approval.approve)`). The agent manually verified the former and saw `"text":"Deployment was not approved."`, but concluded that the “Declined approval returns one terminal `isError: true` result,” overlooking the grader’s expected decline-specific text.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main time sink was API and protocol discovery through installed package internals: the agent ran `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use` and then inspected `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-dBHMsxwf.d.cts`; no skill file or fetched docs URL appears in the transcript.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The agent spent substantial time reverse-engineering APIs by grepping installed declarations rather than using a skill or fetched mcp-use docs: `rg -n "inputRequired|inputResponse|acceptedContent|streamable|http" node_modules/mcp-use` and later inspecting `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-dBHMsxwf.d.cts`. It also consulted bundled SDK READMEs, including `node_modules/@modelcontextprotocol/server/README.md` and `node_modules/@modelcontextprotocol/client/README.md`.
