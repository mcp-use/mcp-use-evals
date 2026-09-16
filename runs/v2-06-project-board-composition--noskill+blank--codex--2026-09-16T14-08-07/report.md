# mcp-use SDK agentic eval — 2026-09-16

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-16T14-08-07` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m11s
- Median turns: 15
- Median tool calls: 24
- Median tokens in/out: 738437 / 7417
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): API discovery relied heavily on the installed package rather than a skill or fetched docs: the agent ran `sed -n '1,340p' node_modules/mcp-use/dist/server.d.ts`, inspected `resources.d.ts` and `node-http.d.ts`, and then grepped for `"listen\\(|port|resourceTemplate"` across declarations and bundled JavaScript. The npm README appears not to have provided enough immediately usable API shape, since inspection continued into multiple `.d.ts` files after `sed -n '1,240p' node_modules/mcp-use/README.md`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): Discovery took several steps because fetching the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then relied heavily on the installed package’s README and declaration files, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `config.d.ts`; it also grepped implementation bundles with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had to discover the SDK API from installed declarations rather than package documentation: `npm view mcp-use version description readme --json` returned `"readme": ""`, after which it inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, and grepped for `"listen\\(|resource\\(|resourceTemplate|basePath"`. It similarly derived the verification-client API by grepping `node_modules/@modelcontextprotocol/client` for `"StreamableHTTPClientTransport|resources/read|callTool"`; no mcp-use skill file or fetched docs URL appears in the transcript.
