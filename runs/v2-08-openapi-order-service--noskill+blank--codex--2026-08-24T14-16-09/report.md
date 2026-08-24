# mcp-use SDK agentic eval — 2026-08-24

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-24T14-16-09` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m48s
- Median turns: 21
- Median tool calls: 26
- Median tokens in/out: 1014983.5 / 7750.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main time sink was SDK discovery through installed package internals: the agent repeatedly ran searches such as `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/server.d.ts`, and searched the client package for `StreamableHTTPClientTransport`, `listTools`, and `callTool`. No skill file or fetched documentation URL appears; the resources used were the SDK README, declaration files, compiled JavaScript, and package metadata, including `sed -n '1,140p' node_modules/mcp-use/README.md` and `node -e "const p=require('./node_modules/mcp-use/package.json')..."`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was SDK API discovery through installed package internals rather than a skill or fetched documentation: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|http" node_modules/mcp-use/dist node_modules/mcp-use/README.md`, inspected `node_modules/mcp-use/dist/openapi/types.d.ts`, and later searched the MCP client declaration for `class Client|listTools\(|callTool\(`. This worked, but required several separate declaration-file probes before constructing the verification client.
