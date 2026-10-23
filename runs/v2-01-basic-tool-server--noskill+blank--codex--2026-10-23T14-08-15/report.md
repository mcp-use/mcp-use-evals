# mcp-use SDK agentic eval — 2026-10-23

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-23T14-08-15` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 581304 / 4736
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied heavily on package-local materials rather than external docs: it inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/tools.d.ts`, finding the README example `import { MCPServer } from "mcp-use"` and `server.tool(...)`. It later grepped bundled implementation code to confirm listener behavior, locating `async listen(port=void 0,options={})`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had discovery friction around the SDK API: `npm view mcp-use readme --json` returned no README content, so it inspected the installed package with `find node_modules/mcp-use` and `rg -n "streamable|Streamable|http|tool\\(" ...`, then read `node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist/server.d.ts` to determine the `MCPServer.tool` and `listen(port)` shapes. No mcp-use skill file or external docs URL appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main time sink was manual verification against the SDK’s modern HTTP protocol. The first handshake mixed a legacy `initialize` body with `MCP-Protocol-Version: 2026-07-28`, producing `an initialize request (legacy handshake) was sent with a modern MCP-Protocol-Version header`. Subsequent retries uncovered requirements incrementally: first `missing the required per-request envelope key(s): _meta`, then missing `io.modelcontextprotocol/protocolVersion` and `io.modelcontextprotocol/clientCapabilities`, then `the required Mcp-Method header is absent`, and finally `the required Mcp-Name header is absent`. The fifth adjusted request succeeded with `"text":"41.75"`, suggesting the protocol’s required headers/envelope were not readily discoverable from the initial API setup.
