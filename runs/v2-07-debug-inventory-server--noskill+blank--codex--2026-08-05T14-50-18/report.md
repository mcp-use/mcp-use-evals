# mcp-use SDK agentic eval — 2026-08-05

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-05T14-50-18` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m15s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 384308 / 4391
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent spent some discovery effort confirming an API that the scaffold already used, saying it was “`checking the SDK’s installed API`” and grepping `node_modules/mcp-use` for “`class MCPServer|listen\(|streamable|Streamable|transport`”; the installed declaration then showed `await server.listen(3000)`. No skill file or external docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main time loss was dependency setup: the first typecheck caused `npx` to fetch the unrelated deprecated package, reporting `npm warn exec The following package was not found and will be installed: tsc@2.0.4` and `This is not the tsc command you are looking for`. The agent then recovered with `npm install`, which `added 59 packages`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was straightforward and localized: the scaffold explicitly marked both defects with `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` The agent also correctly replaced expected exceptions such as `throw new Error("insufficient stock")` with text results.
