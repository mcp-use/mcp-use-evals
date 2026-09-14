# mcp-use SDK agentic eval — 2026-09-14

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-14T14-08-37` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 67% (2/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 2/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m27s
- Median turns: 17.5
- Median tool calls: 31.5
- Median tokens in/out: 1667049 / 7986.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The agent relied heavily on grepping installed declarations rather than a skill file or fetched docs: `rg -n "inputRequired|inputResponse|acceptedContent|inputResponses|streamable" node_modules/mcp-use`, followed by inspection of `node_modules/@modelcontextprotocol/server`. Discovery was noisy—the first grep surfaced a huge minified dependency blob—and one assumed package path was wrong: `IO error ... node_modules/mcp-use/node_modules/@modelcontextprotocol/server/dist: No such file or directory`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the explicit decline branch’s wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while the separate accepted-`false` branch returns `terminalError("Deployment was declined.")`. The agent manually observed the former response as `"Deployment was not approved."` but still concluded, `Both HTTP retries now behave correctly`, so its verification checked terminality but not whether the decline result clearly contained “decline.”
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was API/protocol discovery through installed package internals rather than concise examples. The agent repeatedly grepped declarations and bundled code, starting with `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use/dist` and later searching `node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`; the useful API confirmation came from `node_modules/mcp-use/dist/index.d.ts:37:export { acceptedContent, ... inputRequired, inputResponse ... }`. No skill file or external docs URL appears in the transcript; the run leaned on npm metadata (`npm view mcp-use@2.0.4`) and `node_modules`.
