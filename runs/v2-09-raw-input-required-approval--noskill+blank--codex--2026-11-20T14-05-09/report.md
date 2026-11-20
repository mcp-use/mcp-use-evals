# mcp-use SDK agentic eval — 2026-11-20

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-20T14-05-09` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 50% (1/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/2 |

## pass^k

pass^2: 0% (0/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m50s
- Median turns: 18
- Median tool calls: 31
- Median tokens in/out: 1439725 / 7174
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main miss was inconsistent terminal wording. In `src/server.ts`, an explicit decline/cancellation returns `text: "Deployment approval was not granted."`, while only accepted `approve: false` returns `text: "Deployment was declined."`. The agent observed the former response during verification — `"text":"Deployment approval was not granted."` — but still concluded that “`Declined approval and accepted approve: false both return one terminal isError: true complete result`,” overlooking the wording distinction that triggered the deterministic call failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was discovering the raw multi-round API and modern protocol envelope by inspecting installed packages rather than using a skill or fetched docs. The agent repeatedly grepped declarations—`rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use`—then searched `node_modules/@modelcontextprotocol/server/dist/*.d.mts`; the only documentation lead shown was the installed README link to `https://modelcontextprotocol.io/specification/2026-07-28`, not an actually fetched URL.
