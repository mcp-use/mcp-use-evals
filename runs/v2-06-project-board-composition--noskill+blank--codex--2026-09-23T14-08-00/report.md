# mcp-use SDK agentic eval — 2026-09-23

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-23T14-08-00` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m32s
- Median turns: 19
- Median tool calls: 26
- Median tokens in/out: 975598 / 7537
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery cost was API-shape research: the agent first fetched npm metadata and the full README via `npm view mcp-use readme --json`, then searched installed declarations with `rg -n "resource\\(|resourceTemplate|registerResource|Streamable|listen\\(|serve\\(" node_modules/mcp-use/dist`. It specifically inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`, suggesting the package typings—not a skill file or fetched docs page—were the practical reference.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had discovery friction and relied heavily on package-local API inspection: it first fetched npm metadata/readme with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then grepped declarations using `rg -n "resource\\(|Streamable|streamable|listen\\(|serve\\(" node_modules/mcp-use...` and opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts` to determine registration and listening shapes.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had to discover the API primarily by inspecting installed declarations and README rather than using a skill or fetched docs: `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts`, `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, and `sed -n '1,220p' node_modules/mcp-use/README.md`. It also queried npm metadata first with `npm view mcp-use version description repository.url --json`.
