# mcp-use SDK agentic eval — 2026-10-12

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-12T14-14-04` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 11
- Median tool calls: 14
- Median tokens in/out: 392167 / 4229
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main friction was SDK discovery around HTTP port behavior. The agent first searched before dependencies were installed, but `rg -n "class MCPServer|listen\\(|streamable|PORT" node_modules/mcp-use node_modules/@mcp-use` returned no output; it then ran `npm install`, which took `17s`. It leaned on installed package sources rather than external docs or a skill file, searching `node_modules/mcp-use/README.md` and inspecting `node_modules/mcp-use/dist/server.d.ts`. The decisive API documentation was the declaration stating port precedence is “`the argument, PORT, config.port, then 3000`,” which justified retaining `await server.listen();` in `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main time loss came from typechecking before dependencies were installed: `npx tsc --noEmit` fetched the unrelated deprecated package, reporting `The following package was not found and will be installed: tsc@2.0.4` and `This is not the tsc command you are looking for`. The agent recovered with `npm install`, after which `npx tsc --noEmit` passed.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was probing the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`, followed by `npm install`. After installation, the agent relied on package internals rather than a skill file or fetched docs, searching `node_modules/mcp-use` for `class MCPServer|listen\(|streamable|Streamable` and reading `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `README.md`. The declaration was useful for resolving port behavior, explicitly stating: `Port precedence is the argument, PORT, config.port, then 3000`.
