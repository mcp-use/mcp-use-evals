# mcp-use SDK agentic eval — 2026-09-09

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-09T14-07-43` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 9
- Median tool calls: 11
- Median tokens in/out: 220806 / 3165
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent first tried to inspect the SDK before dependencies existed, hitting `node_modules/mcp-use: No such file or directory`, then spent 17 seconds on `npm install` (`added 59 packages ... in 17s`). It relied on grepping installed SDK declarations rather than a skill file or external docs, using `rg -n "listen\\(|class MCPServer|interface.*Listen|Streamable" node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`; this confirmed the simple API example `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct: the agent identified that “`missing SKUs throw, reservations increase stock, and restocks modify a temporary copy`” and corrected those defects in place. Discovery had minor friction because it initially searched an uninstalled dependency and got “`find: ‘node_modules/mcp-use’: No such file or directory`,” then had to run “`npm install`,” which took “`15s`.” After installation, it leaned on SDK declarations by grepping “`class MCPServer|listen\\(|Streamable|streamable|PORT|transport`” and reading `node_modules/mcp-use/dist/server.d.ts` plus `config.d.ts`; the declaration clarified that registrations are served “`statelessly over a composed fetch handler`” while advising state such as “`pools and caches at module scope`.” No skill file or external docs URL was used in the visible transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent initially tried to inspect the SDK before dependencies were installed, getting `rg: node_modules/mcp-use: No such file or directory`, then spent 13 seconds on `npm install`. It subsequently leaned on grepping installed SDK declarations for API shape—`rg -n "class MCPServer|listen\\(|streamable|transport|tool\\(" node_modules/mcp-use`—and inspected `node_modules/mcp-use/dist/server.d.ts`; no skill file or fetched docs URL appears in the transcript.
