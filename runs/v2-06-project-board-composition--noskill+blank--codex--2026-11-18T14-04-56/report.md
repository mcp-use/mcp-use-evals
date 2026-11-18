# mcp-use SDK agentic eval — 2026-11-18

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-18T14-04-56` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m19s
- Median turns: 19
- Median tool calls: 31
- Median tokens in/out: 1078229 / 8547
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent spent substantial discovery time inspecting the installed package rather than using a skill or fetched docs: it ran `sed -n '1,260p' node_modules/mcp-use/README.md`, inspected `dist/server.d.ts` and `dist/resources.d.ts`, then grepped implementation details with `rg -n "async listen... node_modules/mcp-use/dist/index-node.js`. The README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): Discovery took several steps: the first upstream README fetch failed with `curl: (22) The requested URL returned error: 404`, after which the agent relied on the installed package README and type declarations via `sed -n '1,260p' node_modules/mcp-use/README.md` and grepped SDK declarations with `rg -n "listen\\(|noauth|securitySchemes|resourceTemplate"`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main discovery friction was that `npm view mcp-use readme --json` returned an empty `output`, so the agent inspected the installed package instead with `find node_modules/mcp-use...` and `rg -n "streamable|...|MCPServer|resource\("`. It then leaned directly on `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, `dist/resources.d.ts`, and `dist/node-bridge.d.ts` to determine tool/resource registration and listener behavior; no skill file or fetched docs URL appears in the transcript.
