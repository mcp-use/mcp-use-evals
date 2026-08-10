# mcp-use SDK agentic eval — 2026-08-10

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-10T14-27-10` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m23s
- Median turns: 12
- Median tool calls: 15
- Median tokens in/out: 562714 / 4962
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The run’s main friction was environment setup and SDK discovery rather than the repair itself. Dependencies were initially absent—`UNMET DEPENDENCY mcp-use@2.0.4` and the other packages—so the agent had to run `npm install`, which took `17s`. It then grepped installed SDK declarations for HTTP behavior—`rg -n "listen\\(|streamable|transport|port" node_modules/mcp-use/dist`—before finding the decisive documentation in `node_modules/mcp-use/dist/server.d.ts`: `Port precedence is the argument, PORT, config.port, then 3000`. This confirmed that the existing `await server.listen();` already met the port requirement, so no source change was needed there.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct, but SDK discovery cost time. The agent first searched an absent install and received `node_modules/mcp-use: No such file or directory`, then ran `npm install`. It subsequently leaned on package internals rather than a skill or external docs, grepping `node_modules/mcp-use` for `"class MCPServer|listen\\(|streamable|transport|port"` and reading `node_modules/mcp-use/dist/server.d.ts`, whose comments state that `listen` supports environment/config resolution and show `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was probing the SDK before dependencies existed: `find node_modules/mcp-use` failed with `No such file or directory`, after which the agent had to run `npm install`. Once installed, it leaned heavily on package internals rather than a skill file or external docs, grepping `node_modules/mcp-use` for `listen`, `streamable`, and `http`, then reading `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `listen-address.d.ts`, and the packaged README. This was useful for resolving listener behavior, reflected in: `The SDK’s listen() resolves PORT itself (with its documented 3000 fallback)`.
