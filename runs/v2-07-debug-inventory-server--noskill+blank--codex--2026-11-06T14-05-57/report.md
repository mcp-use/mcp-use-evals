# mcp-use SDK agentic eval — 2026-11-06

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-06T14-05-57` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 12
- Median tool calls: 18
- Median tokens in/out: 486131 / 4478
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent first had to install dependencies because its SDK inspection found `debug-inventory-server@ . └── (empty)`, after which `npm install` took 15 seconds and reported `5 high severity vulnerabilities` plus an `esbuild@0.28.2` install-script warning. It relied on grepping `node_modules` rather than a skill file or fetched docs, using `rg -n "class MCPServer|listen\(|streamable|transport" node_modules/mcp-use`, then reading `node_modules/mcp-use/dist/server.d.ts`; that declaration provided the decisive example `await server.listen(3000)` and explained that registrations are rebuilt per request while state should remain at module scope: `put pools and caches at module scope`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was that the agent tried inspecting the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, then had to run `npm install`, which took `15s`. It leaned on installed package declarations rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts`; that declaration usefully documented that `MCPServer.listen` serves HTTP and showed `await server.listen(3000)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was direct, but the agent spent several calls confirming listener behavior by grepping installed SDK files: `rg -n "class MCPServer|listen\\(" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts`, which documented `listen(port?: number | undefined, options?: ListenOptions)`. This resolved uncertainty around leaving `await server.listen();` unchanged while relying on `PORT`.
