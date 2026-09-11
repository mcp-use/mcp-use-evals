# mcp-use SDK agentic eval — 2026-09-11

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-11T14-08-06` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m58s
- Median turns: 12
- Median tool calls: 19
- Median tokens in/out: 939559 / 7490
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent spent notable time discovering the SDK API rather than using documentation directly: it fetched the npm metadata/readme with `npm view mcp-use readme`, then inspected package internals using `rg -n "resource\\(|resourceTemplate|streamable|listen\\(|MCPServer" node_modules/mcp-use` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`. That inspection did surface an important state-model detail: the declaration says a fresh server is built “`for every HTTP request`” and recommends “`put pools and caches at module scope`,” which the implementation followed at `src/server.ts`: `const issues = new Map<string, Issue>();`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent spent substantial discovery effort inspecting package internals rather than relying on concise usage docs: it fetched `npm view mcp-use readme --json`, then searched `node_modules/mcp-use/dist` for `"resource\\(|\\.listen\\(|Streamable|HTTP|transport"` and opened `server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `config.d.ts`. It also grepped the bundled MCP client declarations for `"StreamableHTTP"`, `"declare class Client"`, `"callTool"`, and `"readResource"`, indicating that the client/API shape was learned from type declarations.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: before coding, the agent queried the package registry with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then searched installed declarations using `rg -n "resource\\(|Resource|streamable|listen\\(|serve\\(" node_modules/mcp-use`. It relied particularly on `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts` to determine `resource`, `resourceTemplate`, and `listen` shapes; no fetched documentation page or skill file appears in the transcript.
