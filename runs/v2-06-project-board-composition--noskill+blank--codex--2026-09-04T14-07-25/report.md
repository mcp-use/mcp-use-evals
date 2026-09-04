# mcp-use SDK agentic eval — 2026-09-04

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-04T14-07-25` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m44s
- Median turns: 17
- Median tool calls: 21.5
- Median tokens in/out: 667635.5 / 6083
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

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main time sink was SDK/API discovery through installed declarations after npm README retrieval failed: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then repeatedly inspected package internals, including `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `rg -n "StreamableHTTPClientTransport" node_modules`, and `node_modules/@modelcontextprotocol/client/dist/index.d.mts`. No mcp-use skill file or fetched docs URL appears; the run leaned primarily on `node_modules` type declarations and package metadata such as `npm view mcp-use version`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main wrong turn was retaining npm’s CommonJS scaffold (`"type": "commonjs"`) while using top-level await, which caused `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The initial TypeScript setup also omitted Node types from compiler configuration despite installing `@types/node`, producing `TS2591: Cannot find name 'process'` and the suggestion to `add 'node' to the types field in your tsconfig`; both issues required edits to `package.json` and `tsconfig.json` before `npx tsc --noEmit` passed.
