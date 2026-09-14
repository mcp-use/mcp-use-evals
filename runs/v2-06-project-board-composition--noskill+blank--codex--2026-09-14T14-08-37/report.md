# mcp-use SDK agentic eval — 2026-09-14

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-14T14-08-37` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m10s
- Median turns: 16
- Median tool calls: 27
- Median tokens in/out: 1052989 / 7208
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main time sink was API discovery. The agent first queried npm metadata and the full README via `npm view mcp-use readme --json`, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but then relied heavily on installed declarations, running `rg -n "resource\\(|Resource|streamable|listen|serve" node_modules/mcp-use/dist node_modules/mcp-use -g '*.d.ts'` and inspecting `server.d.ts`, `resources.d.ts`, `node-http.d.ts`, and `config.d.ts`. No mcp-use skill file was used in this `noskill+blank` run.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had to discover the SDK surface from installed declarations rather than starting from a known example: it said it would check the “`available mcp-use API`,” then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, and `resources.d.ts`, including grepping for “`listen\(`” and “`resourceTemplate`.” It also queried npm metadata first with `npm view mcp-use version description repository.url peerDependencies dependencies --json`; no skill file or fetched docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main wrong turn was package configuration: `npm init -y` created `"type": "commonjs"`, and the edited `package.json` temporarily contained both `"type": "module"` and `"type": "commonjs"`. This caused `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent then corrected `package.json`, after which `npx tsc --noEmit` passed.
