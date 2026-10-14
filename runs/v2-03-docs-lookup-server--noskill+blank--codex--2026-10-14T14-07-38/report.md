# mcp-use SDK agentic eval — 2026-10-14

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-14T14-07-38` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 20
- Median tool calls: 28
- Median tokens in/out: 955380 / 7602
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent spent substantial discovery time deriving the SDK shape from the installed package rather than concise documentation: it ran `npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, `dist/tools.d.ts`, and grepped for `"streamable|listen\\(|resource\\("`. No mcp-use skill file or external docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was API discovery: fetching the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent instead inspected the installed package via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and related declarations such as `resources.d.ts` and `tools.d.ts`. This node_modules inspection appears to have supplied the needed `MCPServer`, resource-template, tool, and `listen` API shapes.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main time sink was SDK/schema compatibility discovery. The agent first installed `zod@3.24.2`, then switched to `zod@4.1.12`, but typechecking reported that `Property 'jsonSchema' is missing`; it then queried available versions and upgraded again to `zod@4.6.7`, after which the schema errors disappeared. This suggests mcp-use’s requirement for a sufficiently recent Zod v4 implementation was not obvious from the initial package/API surface.
