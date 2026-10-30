# mcp-use SDK agentic eval — 2026-10-30

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-30T14-06-43` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 12
- Median tool calls: 15
- Median tokens in/out: 301431 / 3598
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main time sink was SDK API discovery. The agent first queried npm metadata and the readme with `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then inspected the installed package via `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`. It needed multiple declaration searches, including `rg -n "listen\\(|streamable|transport|MCPServer"`, before concluding that “`The installed SDK provides the HTTP listener directly and mounts the streamable MCP endpoint at /mcp`.” No skill file or external docs URL is visible; the run leaned on npm and grepping `node_modules`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was SDK API discovery. The agent first queried npm metadata with `npm view mcp-use version description repository.url homepage dist.tarball --json`, then inspected the package tarball via `npm pack mcp-use@2.12.2 --dry-run`. Its attempt to fetch the repository README used a dead path and returned `curl: (22) The requested URL returned error: 404`. It recovered only after installing the package and inspecting local documentation/types: `sed -n '1,280p' node_modules/mcp-use/README.md`, followed by grepping declarations with `rg -n "listen\\(|Streamable|streamable|Node|Hono|serve" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. The key `listen()` behavior—including `PORT` precedence and the default `3000`—was ultimately found in `node_modules/mcp-use/dist/server.d.ts`: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the SDK shape from the installed package rather than prior guidance: it searched `node_modules/mcp-use` for `"streamable|Streamable|Http|HTTP|...|MCPServer"` and then read `node_modules/mcp-use/README.md`, `dist/tools.d.ts`, `dist/server.d.ts`, and `dist/config.d.ts`. The useful README example explicitly showed `import { MCPServer } from "mcp-use"` and `server.tool(...)`, so this path worked without code-level API retries.
