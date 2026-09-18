# mcp-use SDK agentic eval — 2026-09-18

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-18T14-07-47` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 3m06s
- Median turns: 21
- Median tool calls: 34
- Median tokens in/out: 995319 / 9350
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent substantial discovery time inspecting the installed package rather than using a skill or fetched docs, running `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `node-http.d.ts`, and the packaged README before concluding that “`The installed SDK provides a native MCPServer.listen() streamable-HTTP listener at /mcp`.” This indicates the API shape and endpoint required node_modules archaeology, though the packaged quickstart did provide the core `MCPServer`, `server.tool`, and Zod pattern.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main wrong turn was a Zod compatibility mismatch: the first `npx tsc --noEmit` failed because `ZodObject` was “`not assignable to type 'StandardSchemaWithJSON<unknown, unknown>'`” and “`Property 'jsonSchema' is missing`.” The agent then inspected package versions with `require('./node_modules/mcp-use/node_modules/zod/package.json').version` and changed `package.json`; only after `npm install && npx tsc --noEmit` did typechecking pass.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than using a skill or fetched docs: it ran `find node_modules/mcp-use`, `sed -n '100,180p' node_modules/mcp-use/README.md`, and inspected `node_modules/mcp-use/dist/server.d.ts` plus `tools.d.ts`. This worked, but indicates API-discovery overhead around `MCPServer`, `server.tool`, and `listen`.
