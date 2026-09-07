# mcp-use SDK agentic eval — 2026-09-07

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-07T14-08-11` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m08s
- Median turns: 13
- Median tool calls: 30
- Median tokens in/out: 867651 / 7081
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was SDK API discovery: the agent queried npm with `npm view mcp-use version description repository.url --json`, then inspected installed declarations using `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "streamable|resource|tool\(" ... node_modules/mcp-use/dist -g '*.d.ts'`. No skill file or fetched documentation URL appears; it relied primarily on npm metadata and grepping `node_modules`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): Discovery took several steps: the registry README query returned nothing (`npm view mcp-use readme` → `output":""`), so the agent inspected the installed package with `find node_modules/mcp-use` and `rg -n "streamable|...|MCPServer..."`, then read `node_modules/mcp-use/README.md` and declaration files including `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/resources.d.ts`. This local package documentation supplied the working `MCPServer`, `server.tool`, resource, and `listen` API shapes; no skill file or fetched docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main time sink was SDK discovery: the agent first queried npm metadata (`npm view mcp-use version description repository.url --json`), then attempted to fetch the registry README (`npm view mcp-use readme --json`) but got no useful output, and finally inspected installed declarations such as `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts`. This node_modules inspection established the needed API shape, summarized as: `The SDK supports static resources and URI templates natively`.
