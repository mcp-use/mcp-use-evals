# mcp-use SDK agentic eval — 2026-11-18

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-18T14-04-58` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m50s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 534054 / 5683
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main wrong turn was installing Zod 3 (`npm install mcp-use@2.12.6 zod@3`), which failed against the SDK’s schema interface: `Property 'jsonSchema' is missing` and left the callback input unknown (`'query' is of type 'unknown'`). The agent diagnosed this as a `schema-version mismatch` and resolved it by moving to `zod@4.6.7`, after which `npx tsc --noEmit` passed. This is a notable compatibility papercut because the SDK accepted a Zod object syntactically but required the newer Standard JSON Schema support.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied heavily on installed-package discovery rather than a skill file or fetched docs: it opened `node_modules/mcp-use/README.md`, inspected `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`, and later copied protocol usage from `node_modules/@modelcontextprotocol/sdk/dist/esm/examples/client/simpleStreamableHttp.js`. The README only pointed onward to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; the transcript does not show that URL being fetched.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery detour was package documentation retrieval: `npm view mcp-use readme --json` produced `Unexpected end of JSON input`, and the fallback `npm view mcp-use readme` returned no visible content. The agent then relied on the installed package, searching `node_modules/mcp-use` for `streamable`, `resource(`, `tool(`, and `MCPServer`, and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts` to determine the API shape. This worked, but indicates the npm metadata path was unhelpful and type-definition inspection was needed.
