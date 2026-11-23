# mcp-use SDK agentic eval — 2026-11-23

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-23T14-05-40` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 16
- Median tool calls: 20
- Median tokens in/out: 416682 / 4524
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was probing the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`. The agent then ran `npm install`, which took `16s`, and leaned on installed package declarations rather than a skill file or fetched docs, searching `node_modules/mcp-use/dist/server.d.ts` for `class MCPServer` and `listen(`. That inspection confirmed the simple API through the declaration example `await server.listen(3000);`, but the existing source already used that shape, so it did not materially drive the behavioral repair.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command lost a turn because `git status --short && find .. -name AGENTS.md -print` stopped at `fatal: not a git repository`, so the intended `AGENTS.md` search did not run in that command. Dependency setup also consumed 15 seconds and surfaced unrelated noise: `added 64 packages ... in 15s`, `5 high severity vulnerabilities`, and an `esbuild@0.28.2` install-script warning.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was probing the SDK before dependencies existed: `find node_modules/mcp-use` returned `No such file or directory`, and `rg` returned `IO error for operation on node_modules/mcp-use`; the agent then ran `npm install`. It subsequently leaned on installed package internals rather than a skill file or external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md`. Those declarations clarified the listener behavior: config docs said the port defaults to `3000` and that `PORT` takes precedence, supporting the decision to retain `await server.listen()`.
