# mcp-use SDK agentic eval — 2026-11-13

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-13T14-05-18` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m44s
- Median turns: 15
- Median tool calls: 24
- Median tokens in/out: 657965 / 6864
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent spent substantial discovery time inspecting package internals rather than relying on a concise SDK example: it ran `npm view mcp-use readme`, `npm pack mcp-use@2.12.4 --dry-run`, then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. It also grepped the protocol client declarations for verification APIs, including `"StreamableHTTPClientTransport|resources/read|readResource|callTool"` and `"new Client\\(|client\\.connect\\("`, suggesting the client-side test path was not immediately discoverable.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery friction was failed npm README retrieval: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, using `sed -n '1,220p' node_modules/mcp-use/README.md` and then grepping declarations with `rg -n "resource\\(|listen\\(|streamable|nodeHttp|Node" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`; this indicates the package README and `.d.ts` files were the key API-shape resources.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): Discovery relied on npm metadata and grepping installed declaration files rather than a skill file or fetched docs URL: `npm view mcp-use version description repository.url`, followed by `sed -n '1,360p' node_modules/mcp-use/dist/server.d.ts`. The package README offered no guidance—the command `npm view mcp-use readme` returned `output":""`—so the agent inspected `index.d.ts`, `tools.d.ts`, `resources.d.ts`, and `server.d.ts` to determine API shape.
