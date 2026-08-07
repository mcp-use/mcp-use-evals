# mcp-use SDK agentic eval — 2026-08-07

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-07T14-23-37` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 342805 / 3858
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was querying an uninstalled package: the agent first ran `rg ... node_modules/mcp-use`, which returned `No such file or directory`, and only afterward ran `npm install`. Once installed, it relied directly on SDK artifacts rather than external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/README.md`, and bundled JS; the declaration’s example, `await server.listen(3000);`, clarified the listen API.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair was direct: the agent identified the existing faults as `thrown “not found”/stock errors, reservation increasing stock, and restock mutating a discarded copy`, then made a single `fileChange` to `src/server.ts`. SDK discovery required grepping installed declarations—`rg -n "class MCPServer|listen\\(" node_modules/mcp-use/dist/*.d.ts`—to confirm that `listen()` honors `PORT`; no skill file or external docs URL appears in the transcript. A minor initial detour was combining inspection with `git status --short`, which made the command report failure because `fatal: not a git repository`, though it still listed the project files. Verification was thorough and worked on the first attempt: `npx tsc --noEmit` exited `0`, the initialize request returned `HTTP/1.1 200 OK`, and live calls showed `Reserved 3`, `insufficient stock`, `Restocked 5`, and `SKU unknown-sku not found`. The only noisy finish was the intentionally interrupted server process being surfaced as a failed tool result—`^C` with `"exitCode":1` and `"status":"failed"`—despite successful request logs such as `tools/call reserve_stock`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was grepping the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`; the agent then ran `npm install` and relied on installed declaration files, including `node_modules/mcp-use/dist/server.d.ts`, to inspect `MCPServer.listen`. No skill file or external docs URL appeared; SDK shape was learned by `rg -n "listen\(|class MCPServer...` and `sed` over `node_modules/mcp-use/dist/*.d.ts`.
