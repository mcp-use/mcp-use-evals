# mcp-use SDK agentic eval — 2026-10-12

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-12T14-14-05` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m07s
- Median turns: 13
- Median tool calls: 16
- Median tokens in/out: 429157 / 3350
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main wrong turn was a schema-version compatibility issue: the first typecheck rejected the Zod object because `Property 'jsonSchema' is missing`, which also left callback fields untyped as `'a' is of type 'unknown'` and `'b' is of type 'unknown'`. The agent recovered by modifying `package.json`, then rerunning `npm install && npx tsc --noEmit`, which completed successfully; however, the transcript does not show the actual dependency edit, making the required Zod compatibility constraint less discoverable.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main wrong turn was module configuration: `npm init -y` created `"type": "commonjs"`, while the implementation used top-level `await server.listen(port);`. The first typecheck therefore failed with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent then modified `package.json`, after which `npx tsc --noEmit && npm run typecheck` passed. This was scaffold friction rather than an MCP API issue.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent spent discovery time querying npm (`npm view mcp-use version description repository.url dist.tarball`) and grepping installed package contents for API shape (`rg -n "streamable|HTTP|create.*Server|server\.tool|McpServer|tool\(" node_modules/mcp-use`). It then relied on the local SDK README example at `node_modules/mcp-use/README.md`, including `export const getWeather = server.tool(`, plus declaration files such as `node_modules/mcp-use/dist/server.d.ts` and `node-bridge.d.ts`; no external docs fetch or skill file is visible.
