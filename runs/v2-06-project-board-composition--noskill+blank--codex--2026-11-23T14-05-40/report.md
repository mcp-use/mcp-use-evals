# mcp-use SDK agentic eval — 2026-11-23

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-23T14-05-40` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m54s
- Median turns: 16
- Median tool calls: 24
- Median tokens in/out: 846826 / 7448
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery friction was documentation access: the npm README fetch produced an empty file and failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, followed by `0 /tmp/mcp-use-readme.json`. The agent then relied heavily on installed package internals, inspecting `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and grepping for `"resource\\(|streamable|listen\\("`; the declaration clarified port behavior with `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent relied on npm metadata and installed-package inspection rather than a skill file or fetched docs: `npm view mcp-use version description repository.url --json`, `sed -n '1,220p' node_modules/mcp-use/README.md`, and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`. It also had to grep dependency declarations to discover the verification client API, including `rg -n "StreamableHTTPClientTransport|class Client"` and constructor/method signatures in `node_modules/@modelcontextprotocol/client/dist/index.d.mts`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: the agent relied heavily on installed-package internals, first reading `node_modules/mcp-use/README.md` and declarations such as `node_modules/mcp-use/dist/server.d.ts`, then repeatedly grepping for signatures with `rg -n "listen\\("`, `rg -n "resourceTemplate\\("`, and later inspecting `@modelcontextprotocol/client` for `StreamableHTTPClientTransport`, `Client`, `readResource`, and `callTool`. No skill file or fetched documentation page was used; the only docs URL appeared inside the README as `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
