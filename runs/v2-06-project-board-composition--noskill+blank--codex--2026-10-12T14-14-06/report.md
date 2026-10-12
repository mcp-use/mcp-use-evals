# mcp-use SDK agentic eval — 2026-10-12

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-12T14-14-06` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m21s
- Median turns: 11
- Median tool calls: 16
- Median tokens in/out: 391366 / 5128
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then inspected the installed package via `sed -n '1,240p' node_modules/mcp-use/README.md` and grepped declarations with `rg -n "resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. This suggests the package’s local README and TypeScript declarations, rather than a skill file or fetched docs URL, were the primary implementation references.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery: the agent inspected the installed package README and declarations with `sed -n '1,220p' node_modules/mcp-use/README.md`, then separately opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `index.d.ts`, and finally searched implementation/type files with `rg -n "listen\\(" node_modules/mcp-use/dist/...`. This suggests the SDK surface for resources, templates, and `listen` was not obvious from a single source, although the agent ultimately concluded, `The SDK’s resource-template API maps naturally to issue://{id}`. No mcp-use skill file or fetched docs URL appears in the transcript; the resources used were the installed README and `node_modules` declarations.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent spent several discovery steps inspecting the installed package rather than using a skill or external docs: it said it would check the “`mcp-use TypeScript API`,” then searched `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/resources.d.ts` for “`streamable|create.*server|MCPServer|McpServer|resource`.” This worked, but reflects API-discovery friction in a blank workspace; the agent explicitly wanted to avoid “`relying on an older example`.”
