# mcp-use SDK agentic eval — 2026-09-28

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-28T14-08-36` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m06s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 404140 / 6716
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): API discovery relied on npm metadata and installed declarations rather than a skill or fetched docs: the agent ran `npm view mcp-use version description repository.url dist-tags --json`, then inspected `node_modules/mcp-use/dist/server.d.ts` and searched `rg -n "listen\\(" ...`; the declaration exposed `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description homepage repository --json`, then inspected installed declarations and docs using `rg -n "class MCPServer|listen\(|Streamable|streamable|transportType|server\.tool" node_modules/mcp-use` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. This worked, but indicates the SDK shape and default streamable-HTTP behavior were established by grepping `node_modules` rather than an immediately known example; the agent concluded, `The SDK’s current server API provides a /mcp streamable-HTTP endpoint by default`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied on package-local documentation and API inspection rather than a skill file: it read `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and searched implementation files with `rg -n "listen\\(" node_modules/mcp-use/...`. This discovery worked, but required several exploratory commands before settling on `MCPServer.listen`.
