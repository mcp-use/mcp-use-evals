# mcp-use SDK agentic eval — 2026-09-21

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-21T14-08-12` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m25s
- Median turns: 14
- Median tool calls: 19
- Median tokens in/out: 369539 / 4156
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs URL: it ran `sed -n '1,240p' node_modules/mcp-use/README.md`, inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, and searched implementation files with `rg -n "listen\\("`. The npm metadata/readme lookup provided little visible guidance—the result only showed `"version": "2.5.1"` and `"description": "MCP framework and CLI built on the official v2 SDK"`—so declaration-file spelunking appears to have supplied the API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery: `npm view mcp-use readme --json` returned an empty `output`, so the agent installed the package and inspected local files with `sed -n '1,240p' node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`. The README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched; no mcp-use skill file was used.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): Discovery had some friction: the initial attempt to fetch npm README metadata failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then relied on installed package resources, explicitly searching `node_modules/mcp-use/README.md` and declarations such as `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/tools.d.ts`; the packaged README provided the working `import { MCPServer } from "mcp-use"` and `server.tool(` pattern.
