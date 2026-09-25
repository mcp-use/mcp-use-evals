# mcp-use SDK agentic eval — 2026-09-25

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-25T14-08-26` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m01s
- Median turns: 14
- Median tool calls: 28
- Median tokens in/out: 1024367 / 6468
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline text: `src/server.ts` returns `"Deployment was not approved."` for an explicit decline, while the deterministic check required text containing `decline`. The agent saw that exact wire result—`"text":"Deployment was not approved."`—but still concluded, `Wire verification is passing`, so its manual verification checked terminality rather than the required observable wording. The later `fileChange({"event":"modify","path":"src/server.ts"})` did not correct that branch; the final source still contains `"Deployment was not approved."`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main friction was discovering the raw helper and modern wire APIs without a skill file or fetched docs. The agent repeatedly inspected installed declarations and bundled implementation, starting with `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use` and later reading `node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`. It also grepped the client bundle for protocol details: `rg -n "inputResponses|input_required|inputRequired" node_modules/@modelcontextprotocol/client`. This worked, but indicates the API shape and retry-wire format were not readily discoverable from the package README alone.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was inconsistent decline wording: the direct `action === "decline"` branch returns `terminalError("Deployment was not approved.")` in `src/server.ts`, while accepted `approve: false` returns `terminalError("Deployment was declined.")`. The live verification reproduced `"Deployment was not approved."`, but the agent concluded only that it was terminal—`"Decline returned one terminal isError: true result with no new input request"`—and did not notice the grader’s expected decline wording.
