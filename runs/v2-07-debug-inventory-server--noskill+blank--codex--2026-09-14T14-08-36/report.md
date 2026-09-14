# mcp-use SDK agentic eval — 2026-09-14

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-14T14-08-36` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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
- Median tool calls: 16
- Median tokens in/out: 457739 / 4118
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair itself was straightforward, but SDK/client discovery added friction. The agent first grepped before dependencies existed and got `node_modules/mcp-use: No such file or directory`, then ran `npm install`. It relied heavily on installed declarations rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `node-http.d.ts`; the declaration clarified that `MCPServer.listen` provides the HTTP behavior and showed `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main time loss was dependency setup: the first typecheck accidentally downloaded the unrelated deprecated `tsc@2.0.4`, producing `This is not the tsc command you are looking for`; only afterward did the agent run `npm install`, which took `21s`, and then `npx tsc --noEmit` succeeded.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was grepping the SDK before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install`. Once installed, it leaned on the packaged README and declaration files—`node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/dist/listen-address.d.ts`—to confirm the listener behavior; the declarations exposed `DEFAULT_LISTEN_PORT = 3000`.
