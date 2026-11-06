# mcp-use SDK agentic eval — 2026-11-06

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-06T14-05-58` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m54s
- Median turns: 18
- Median tool calls: 34
- Median tokens in/out: 1671467 / 8651
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was inconsistent terminal wording: the explicit decline/cancel branch returns `errorResult("Deployment was not approved.")` in `src/server.ts`, while only accepted `{ approve: false }` returns `errorResult("Deployment was declined.")`. This directly explains why the grader’s decline check did not find `decline`, despite the flow correctly terminating.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main miss was inconsistent decline messaging: the explicit `approve: false` branch returned `Deployment was declined.`, but an `action: "decline"` took the earlier branch and returned `Deployment was not approved.` (`src/server.ts`, `if (response.kind !== "elicit" || response.action !== "accept")`). The agent’s own HTTP verification exposed this exact response — `"text":"Deployment was not approved."` — yet it concluded, `Declined retry returns one terminal isError: true result`, without noticing the grader’s expected decline wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was discovering the raw helper and modern wire API by inspecting installed packages rather than usable examples. The agent repeatedly grepped declarations—`rg -n "inputRequired|inputResponse|acceptedContent|streamable|http" node_modules/mcp-use/dist node_modules/mcp-use`—and encountered missing packaged resources: `rg: node_modules/mcp-use/docs: No such file or directory` and `rg: node_modules/mcp-use/examples: No such file or directory`. It leaned on `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and bundled `@modelcontextprotocol/server` declarations and implementation, including `createMcpHandler-CLhGwQTn.d.mts` and `src-CX2iR2pK.mjs`; no skill file or fetched docs URL appears in the transcript.
