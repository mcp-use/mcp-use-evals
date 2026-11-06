# mcp-use SDK agentic eval — 2026-11-06

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-06T14-06-00` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m43s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 820473 / 7362
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on grepping installed SDK declarations rather than external docs or a skill file, using `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `config.d.ts` to discover `fromOpenAPI`, `listen()`, ephemeral ports, and the `/mcp` behavior.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was SDK API discovery through installed package internals rather than documentation: the agent searched declarations with `rg -n "fromOpenAPI|streamable|MCPServer" node_modules/mcp-use/dist --glob '*.d.ts'`, then inspected `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, `config.d.ts`, and `node-bridge.d.ts`. It went deeper into bundled implementation code to determine request-body behavior, using `fold -w 160 node_modules/mcp-use/dist/chunk-Y26DNVWA.js`; it then concluded, `The SDK is installed and its OpenAPI generator uses a \`body\` tool argument for JSON request bodies.` This indicates the generated input shape was not obvious from the public type surface alone, although `tools/list` later confirmed `"required":["body"]`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was API discovery through installed package internals rather than documentation: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/openapi/types.d.ts` and `server.d.ts`, and later searched `chunk-*.js` for `fromOpenAPI`. Some probes followed nonexistent build paths, producing `node_modules/mcp-use/dist/server.js: No such file or directory` and `sed: can't read node_modules/mcp-use/dist/openapi/index.mjs`, suggesting the package’s emitted-file layout was not obvious. The investigation did uncover the important generated argument shape, summarized as `its OpenAPI generator maps request bodies to a generated body tool argument`, which was then used in `arguments: { body: { sku: 'green-tea', quantity: 2 } }`.
