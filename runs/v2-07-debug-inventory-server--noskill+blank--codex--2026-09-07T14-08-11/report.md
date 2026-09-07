# mcp-use SDK agentic eval — 2026-09-07

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-07T14-08-11` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 11
- Median tool calls: 14
- Median tokens in/out: 363244 / 3993
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was confirming port behavior: the agent said it was “`checking the installed SDK’s listen options so the HTTP transport explicitly honors PORT`” and grepped `node_modules/mcp-use`, finding `listen(port?: number | undefined, options?: ListenOptions)`, but ultimately retained `await server.listen();` in `src/server.ts`. This suggests the SDK’s environment-variable/default-port behavior was not obvious from the API signature and required implementation/docs inspection.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was searching the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`; the agent then ran `npm install` and repeated the search successfully. It leaned on installed SDK declarations and README rather than a skill file, grepping for `"class MCPServer|listen\\(|streamable|transport"` and inspecting `node_modules/mcp-use/dist/server.d.ts`, whose example showed `await server.listen(3000);`. This confirmed the transport behavior summarized as `"The SDK already provides streamable HTTP at /mcp"`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was checking the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`. The agent then ran `npm install` and relied on grepping installed declarations—`rg -n "listen\(|Streamable|streamable|port" node_modules/mcp-use`—followed by direct inspection of `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/config.d.ts`; no skill file or fetched docs URL appears in the transcript.
