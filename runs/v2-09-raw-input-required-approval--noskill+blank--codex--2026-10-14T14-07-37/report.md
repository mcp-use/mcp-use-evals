# mcp-use SDK agentic eval — 2026-10-14

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-14T14-07-37` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m38s
- Median turns: 20
- Median tool calls: 37
- Median tokens in/out: 2122964 / 10494
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main time sink was API discovery through installed declarations rather than concise documentation: the agent repeatedly ran searches such as `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable|listen|create" node_modules/mcp-use/dist` and inspected `node_modules/@modelcontextprotocol/server/dist/index.d.mts`. The package README search produced no guidance: `sed ... README.md | rg ... "input_required|inputRequired|inputResponses" || true` returned only the install output.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main miss was the decline wording: `src/server.ts` returns `text: "Deployment was not approved."` for `response.action === "decline"`, while the deterministic check required the result to contain `decline`. The agent’s own verification reproduced that exact response — `"text":"Deployment was not approved."` — but it still concluded, `The live protocol checks passed`, so the manual test checked terminality but not the expected semantic wording. The accepted-`false` branch used the safer wording `text: "Deployment was declined."`, making the inconsistency easy to overlook.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the terminal message for an explicit decline: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`, while the grader reports `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent’s own live verification showed the same payload—`"text":"Deployment was not approved."`—but it concluded that the declined path was confirmed, so the verification checked terminality rather than the expected decline wording. The separate `approve: false` branch did use `terminalError("Deployment was declined.")`, making the wording inconsistent across two semantically equivalent rejection paths (`src/server.ts`).
