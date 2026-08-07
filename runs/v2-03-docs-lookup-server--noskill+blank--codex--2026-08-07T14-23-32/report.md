# mcp-use SDK agentic eval — 2026-08-07

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-07T14-23-32` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m13s
- Median turns: 12
- Median tool calls: 18
- Median tokens in/out: 411479 / 5307
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was learning the SDK API directly from the installed package: the agent inspected `node_modules/mcp-use/README.md`, then opened `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, `node-http.d.ts`, `tools.d.ts`, and `config.d.ts`; it also searched compiled output with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. No skill file or external docs URL was used in the visible transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was SDK/API discovery: the agent inspected package internals with `find node_modules/mcp-use`, `sed ... node_modules/mcp-use/dist/resources.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts` before implementing, rather than relying on a skill file or external docs.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied on local package inspection rather than a skill file or external docs, first reading `node_modules/mcp-use/README.md` and then grepping declarations with `rg -n "resource\\(|listen\\(|streamable|node-http|nodeHttp" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. It needed several declaration-file reads to establish the API shape, including `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `node-http.d.ts`, `config.d.ts`, and `tools.d.ts`.
