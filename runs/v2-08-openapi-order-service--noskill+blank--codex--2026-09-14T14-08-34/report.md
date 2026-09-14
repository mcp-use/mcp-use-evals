# mcp-use SDK agentic eval — 2026-09-14

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-14T14-08-34` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m27s
- Median turns: 20.5
- Median tool calls: 27
- Median tokens in/out: 909822 / 8755
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than a skill file or fetched docs, searching `node_modules/mcp-use` for `"fromOpenAPI|streamable|Streamable"` and inspecting `dist/server.d.ts`, `dist/openapi/types.d.ts`, and the minified `chunk-Y26DNVWA.js` for request-body and parameter binding behavior. This discovery work was productive but relatively low-level; the useful listener contract was ultimately found in the declaration: `"Serve over HTTP on Node. Pass port \`0\` for an ephemeral port"` and `listen(...): Promise<{ port: number; url: string; }>`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied on installed package internals rather than external docs or a skill file, explicitly searching `node_modules` with `rg -n "fromOpenAPI|StreamableHTTP|class MCPServer"` and reading `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the package README. API discovery had a minor dead end when a follow-up inspection exited 2 while attempting `sed -n '1,100p' node_modules/mcp-use/dist/index-node.d.ts`; it nevertheless found the needed exports via `node_modules/mcp-use/dist/index.d.ts` showing `export { MCPServer }` and `export type { ... OpenAPIDocument ... }`.
