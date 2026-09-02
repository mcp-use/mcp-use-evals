# mcp-use SDK agentic eval — 2026-09-02

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-02T14-07-51` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m27s
- Median turns: 19
- Median tool calls: 30
- Median tokens in/out: 1595093 / 8014
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The agent had substantial SDK discovery friction because the registry README lookup returned nothing (`npm view mcp-use@2.0.4 readme --json` → `output":""`), so it leaned heavily on installed declarations and implementation searches, including `rg -n "inputRequired|inputResponse|acceptedContent..." node_modules/mcp-use` and `sed -n '1380,1508p' node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. The first broad grep was noisy enough to surface bundled CLI and Zod code (`node_modules/mcp-use/node_modules/@mcp-use/cli/dist/chunk-ISAAAHEM.js`), and a follow-up search exited unsuccessfully with `exitCode":2`, indicating package-layout/API discovery cost.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was decline wording: the explicit decline branch returned `Deployment approval was not granted.` (`src/server.ts`, non-accept branch), while the separate `approve: false` branch returned `Deployment was declined.` (`src/server.ts`). The agent’s manual decline test visibly produced `"text":"Deployment approval was not granted."`, but it still concluded, `Declined request returned one terminal isError: true result and no further input request.` This verified terminal behavior but did not check that the response text identified a decline, causing the reported `contract.calls` failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main correctness miss was the terminal decline message: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check required the final result to contain `decline`. The agent’s own verification only checked terminal shape, reporting `verified: approval form, accepted approval with note, and terminal decline`, so it did not validate the decline wording that ultimately failed.
