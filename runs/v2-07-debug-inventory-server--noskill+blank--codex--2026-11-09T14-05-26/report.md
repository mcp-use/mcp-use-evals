# mcp-use SDK agentic eval — 2026-11-09

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-09T14-05-26` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m16s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 436277 / 4409
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main wrong turn was in end-to-end verification: after correctly using `"method":"tools/call"` for the first three operations, the agent invoked tool names as JSON-RPC methods and received four `{"code":-32601,"message":"Method not found"}` errors. It then corrected the requests to `"method":"tools/call"` and successfully verified unknown-SKU handling and final inventory.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct: the agent identified that “`error cases throw, reservations add instead of subtracting, and restocks update a throwaway copy`” and corrected those defects in place. To confirm the mcp-use listener API and environment-port behavior, it searched installed package sources with `rg -n "listen\(|streamable|port|transport" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/README.md`; no external docs or skill file appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was that dependencies were absent: the first SDK inspection failed with `node_modules/mcp-use: No such file or directory`, so the agent had to run `npm install`, which took `13s`. It then relied on grepping installed SDK declarations rather than a skill file or fetched documentation, searching for `"listen\\("`, `"class MCPServer"`, and `"streamable"` under `node_modules/mcp-use`; this surfaced the useful contract that the port `listen()` uses is controlled by `PORT` and defaults to `3000` in `node_modules/mcp-use/dist/config.d.ts:115-118`.
