# mcp-use SDK agentic eval — 2026-10-07

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-07T14-07-27` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m31s
- Median turns: 13
- Median tool calls: 19
- Median tokens in/out: 663906 / 5960
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent relied first on npm metadata and the package README via `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then inspected installed SDK declarations with `rg -n "resource\\(|resourceTemplate|serve\\(|listen\\(|http" node_modules/mcp-use/dist` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`. This suggests the API shape—especially resources and HTTP startup—required direct package inspection rather than being immediately known.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals to discover the API, inspecting `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, `resources.d.ts`, and `config.d.ts`, and grepping for `resourceTemplate(` and `await server.listen`. It also used the bundled quickstart at `node_modules/mcp-use/README.md:117` (`const server = new MCPServer({`) rather than a skill file or fetched docs URL. Documentation discovery had a small dead end because `rg` reported `node_modules/mcp-use/docs: No such file or directory`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent relied on npm metadata/README discovery (`npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme`) and then inspected installed declarations directly (`rg -n "resource\\(|serve\\(|listen\\(|Streamable|streamable" node_modules/mcp-use/dist` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`). This suggests the package README alone did not provide enough immediately usable detail for resources, templates, and HTTP startup; the agent explicitly concluded only after declaration inspection that “`The SDK supports its built-in streamable HTTP listener and typed resource templates`.” No mcp-use skill file or fetched documentation page appears in the transcript; only the README’s link to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome` was displayed.
