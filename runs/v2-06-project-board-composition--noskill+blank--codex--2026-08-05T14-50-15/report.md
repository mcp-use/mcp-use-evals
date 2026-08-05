# mcp-use SDK agentic eval — 2026-08-05

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-05T14-50-15` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 18
- Median tool calls: 24
- Median tokens in/out: 686128 / 7367
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had substantial API-discovery friction and inspected the installed package rather than relying on external docs: `find node_modules/mcp-use -maxdepth 3 -type f`, followed by reads of `README.md`, `dist/index.d.ts`, `dist/server.d.ts`, `dist/resources.d.ts`, and searches such as `rg -n "listen\\("`. It also had to reverse-engineer the verification client from dependency declarations, searching `@modelcontextprotocol/client` for `"StreamableHTTP"`, `"class Client"`, `"callTool("`, and `"readResource("`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url` and then inspected installed declarations via `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`/`tools.d.ts`, rather than using a skill file or fetched documentation URL. This did lead directly to the needed API shape, including the declaration example `await server.listen(3000)` and the agent’s conclusion that the SDK “`supports a fixed resource plus a URI template directly`.”
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: the agent queried npm (`npm view mcp-use version description repository.url peerDependencies dependencies --json`) and then inspected package internals with `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, and `node-http.d.ts`. No skill file or fetched docs URL appears; it relied on `node_modules/mcp-use/README.md` and declaration files to determine registration and `listen()` shapes.
