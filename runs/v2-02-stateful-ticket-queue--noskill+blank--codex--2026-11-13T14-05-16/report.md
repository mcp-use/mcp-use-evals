# mcp-use SDK agentic eval — 2026-11-13

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-13T14-05-16` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m44s
- Median turns: 18
- Median tool calls: 27
- Median tokens in/out: 893122 / 6162
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery cost was learning the SDK API from the installed package: the agent first inspected `node_modules/mcp-use/README.md`, then read `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`, and grepped for `"listen|mountMcp|createServer|streamable"`. It also attempted to consult bundled skill references at `node_modules/mcp-use/node_modules/@mcp-use/cli/dist/agent-skills/mcp-builder/references/server.md` and `.../openapi-to-mcp/references/testing.md`. This exploration eventually established that `"The installed SDK’s native listen() serves streamable HTTP at /mcp"`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK API from the installed package rather than prior guidance: the agent searched `node_modules/mcp-use/README.md` and declarations with `rg -n "Streamable|streamable|createMCP|MCPServer|tool\\("`, then inspected `node_modules/mcp-use/dist/server.d.ts` and `tools.d.ts`. The bundled README quickstart was sufficient to establish the `MCPServer`/`server.tool` shape, including `import { MCPServer } from "mcp-use";` and `inputSchema: weatherInput`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied primarily on installed-package inspection rather than external docs: it searched `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist`, and then read `node_modules/mcp-use/dist/server.d.ts`; the useful quickstart showed `import { MCPServer } from "mcp-use"` and `server.tool(...)`, while the declarations exposed `listen(port?: number...)`. It also queried npm with `npm view mcp-use readme --json`, but that command returned only package metadata and no README content.
