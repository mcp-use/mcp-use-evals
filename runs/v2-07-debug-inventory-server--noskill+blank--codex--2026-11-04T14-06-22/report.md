# mcp-use SDK agentic eval — 2026-11-04

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-04T14-06-22` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m08s
- Median turns: 13
- Median tool calls: 15
- Median tokens in/out: 346950 / 3743
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent correctly identified the application bugs immediately from the scaffold—`unknown-SKU paths throw, reservation updates in the wrong direction, and restocking mutates a discarded copy`—so little time was lost on behavioral diagnosis. SDK discovery required inspecting installed package internals rather than using a skill or docs URL: it ran `rg -n "class MCPServer|listen\(|Streamable|port|PORT" node_modules/mcp-use/dist node_modules/mcp-use` and then opened `node_modules/mcp-use/dist/server.d.ts`, where the signature was found as `listen(port?: number | undefined, options?: ListenOptions)`. It also spent 16 seconds reinstalling dependencies with `npm install`, despite the initial probe explicitly checking `node_modules/mcp-use node_modules/@modelcontextprotocol/sdk`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The initial inspection command was unnecessarily marked failed because it included Git status in a non-repository: `fatal: not a git repository (or any of the parent directories): .git`. A second bundled inspection also exited unsuccessfully because dependencies were absent, reporting `UNMET DEPENDENCY mcp-use@2.0.4` and the other packages, so the agent had to run `npm install`, which took `17s` and surfaced `5 high severity vulnerabilities` plus an `esbuild@0.28.2` install-script warning.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was direct after inspection: the agent identified that “`errors are thrown instead of returned, reservations add stock, and restocks update a discarded copy`,” matching the explicit bug comments in the original `src/server.ts`.
