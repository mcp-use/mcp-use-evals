# mcp-use SDK agentic eval — 2026-10-21

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-21T14-07-53` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m43s
- Median turns: 16
- Median tool calls: 31
- Median tokens in/out: 847368 / 6866
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main SDK papercut was Zod version compatibility. The agent initially installed `zod@4.1.12`, while `mcp-use@2.11.0` resolved SDK packages using `zod@4.6.7`, as shown by `npm ls zod`. TypeScript then reported that the schema lacked `jsonSchema`: `Property 'jsonSchema' is missing`, and callback inputs degraded to `unknown`, e.g. `Type 'unknown' is not assignable to type 'string'`. The agent diagnosed this by checking `npm view zod version && npm ls zod`, updated the dependency, and the next `npx tsc --noEmit` passed. This suggests the SDK’s Standard Schema typing is sensitive to older Zod 4 releases without an immediately actionable compatibility message.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery friction was determining the v2 API shape. The agent first inspected the package README—`sed -n '1,240p' node_modules/mcp-use/README.md`—then probed declaration files, but guessed nonexistent paths such as `node_modules/mcp-use/dist/resources.d.ts` and received `exitCode":2`. It recovered by grepping installed declarations for `listen(` and `resourceTemplate`, using `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent spent notable time discovering API shape from installed package declarations rather than a concise example: it ran `rg -n "Streamable|streamable|createMcpServer|McpServer|resource\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `config.d.ts`, and `tools.d.ts`. Client-side verification required another extended search through `node_modules/@modelcontextprotocol/client`, including `rg -n "StreamableHTTP"` and inspection of `dist/index.d.mts`; no skill file or fetched docs URL appears in the transcript.
