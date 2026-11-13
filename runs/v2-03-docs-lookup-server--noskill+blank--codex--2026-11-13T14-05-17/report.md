# mcp-use SDK agentic eval — 2026-11-13

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-13T14-05-17` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m25s
- Median turns: 11
- Median tool calls: 20
- Median tokens in/out: 520340 / 5325
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main friction was API discovery: after installation, the agent inspected package internals with `find node_modules/mcp-use -maxdepth 2 -type f`, then read `node_modules/mcp-use/README.md` and declaration files including `dist/index.d.ts` and `dist/server.d.ts`. That first inspection partially failed with `exitCode":2`, prompting a more targeted grep for `"listen\\(|interface Resource|type Resource|uriTemplate|class MCPServer"` and later inspection of `dist/tools.d.ts`. The README exposed the docs URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows local package inspection rather than fetching that URL.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main wrong turn was a Zod version mismatch. The initial typecheck failed with `Property 'jsonSchema' is missing` and made the callback input unknown: `'query' is of type 'unknown'`. Investigation showed two incompatible versions: the project had `zod@3.25.76`, while `@modelcontextprotocol/server@2.3.1` used `zod@4.6.7`. After modifying `package.json` and reinstalling, `npx tsc --noEmit` passed; the final source imports `zod/v4` at `src/server.ts`: `import { z } from "zod/v4";`. This dependency compatibility requirement is a notable SDK papercut because `inputSchema` expects `StandardSchemaWithJSON`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main friction was API discovery in a blank workspace. The agent first checked npm metadata with `npm view mcp-use version description repository.url --json`, then read `node_modules/mcp-use/README.md`, and finally inspected declaration files via `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`. That declaration-file probe partially failed with `exitCode":2`, after which the agent resorted to `rg -n "listen\\(|PORT|basePath|resourceTemplate"` and encountered minified `node_modules/mcp-use/dist/index.js` output. This suggests the package README did not immediately provide enough concrete server/resource API shape for the task.
