# mcp-use SDK agentic eval — 2026-10-16

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-16T14-07-44` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m26s
- Median turns: 13
- Median tool calls: 27
- Median tokens in/out: 887304 / 6311
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent relied on package metadata (`npm view mcp-use version...`), the installed README (`sed -n '1,260p' node_modules/mcp-use/README.md`), and direct declaration-file inspection (`cat node_modules/mcp-use/dist/resources.d.ts` and `sed -n ... server.d.ts`) to discover `MCPServer`, resource templates, and `listen`; no skill file or fetched docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main wrong turn was module configuration: the first typecheck failed with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` Inspection showed `package.json` contained both `"type": "module"` and a later `"type": "commonjs"`, apparently from editing the `npm init` scaffold rather than replacing its field. After another `fileChange` to `package.json`, `npx tsc --noEmit` succeeded with `exitCode":0`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main time sink was API discovery through installed package internals: after `npm view mcp-use readme --json` returned no useful README content, the agent searched `node_modules/mcp-use` for `"class MCPServer|...|resource\\("` and then opened `dist/server.d.ts`, `dist/resources.d.ts`, and related declarations. It also inspected `@modelcontextprotocol/client` declarations for `"StreamableHTTPClientTransport"`, `"listResources("`, `"readResource("`, and `"callTool("`; one guessed declaration path failed with `sed: can't read node_modules/@modelcontextprotocol/client/dist/esm/client/streamableHttp.d.ts`.
