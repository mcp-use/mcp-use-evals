# mcp-use SDK agentic eval — 2026-08-31

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-31T14-08-14` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m15s
- Median turns: 10
- Median tool calls: 13
- Median tokens in/out: 436788 / 4204
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main friction was SDK discovery before dependencies existed: the first probe, `ls node_modules/mcp-use ... && rg ...`, failed with `exitCode":2`, so the agent had to run `npm install` before inspecting API shape. It then leaned on installed package declarations and README via `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md`; the declaration’s example clarified `await server.listen(3000);`. No skill file or fetched docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct because the scaffold explicitly marked two defects with `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` The agent also correctly identified the thrown business errors from `throw new Error("insufficient stock")` and replaced them with normal tool results.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was searching the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by `npm install`. After installation, the agent leaned heavily on grepping SDK internals—`rg -n "class MCPServer|listen\(|Streamable|streamable|http" node_modules/mcp-use`—and reading `node_modules/mcp-use/dist/server.d.ts`, which exposed `listen(port?: number | undefined, options?: ListenOptions)`. The broad grep also dumped a large minified bundle beginning `node_modules/mcp-use/dist/chunk-GX6PGIEO.js:1`, adding noise to a simple listener-signature check.
