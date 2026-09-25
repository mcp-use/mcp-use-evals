# mcp-use SDK agentic eval — 2026-09-25

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-25T14-08-27` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m32s
- Median turns: 22
- Median tool calls: 28
- Median tokens in/out: 817710 / 9937
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API-shape discovery in installed packages: the agent repeatedly grepped declarations and bundled runtime code, including `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, inspecting `node_modules/mcp-use/dist/server.d.ts`, searching for `StreamableHTTPClientTransport`, and finally reading `node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. This suggests the SDK’s OpenAPI generation, `listen()` behavior, and client transport imports were not immediately discoverable from a single obvious reference.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent spent substantial discovery time grepping SDK internals rather than using docs, first running `rg -n "fromOpenAPI|streamable|Streamable|run\\(" node_modules/mcp-use` and then inspecting `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and bundled `index-node.js`. It specifically reverse-engineered generated input bindings from `function createInputBindings(operation)` and telemetry behavior from `function isUsageDisabled()`, with no skill file or fetched docs URL visible in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent spent substantial discovery effort inspecting installed SDK internals rather than relying on task-specific guidance: it ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use`, opened `dist/openapi/types.d.ts`, `dist/server.d.ts`, and `README.md`, then searched the bundled implementation for `"requestBody|body"`. This inspection was useful for discovering the generated request shape, later summarized as `generates a required body input for JSON request bodies`, but indicates that the `fromOpenAPI` input conventions were not immediately obvious from the public API.
