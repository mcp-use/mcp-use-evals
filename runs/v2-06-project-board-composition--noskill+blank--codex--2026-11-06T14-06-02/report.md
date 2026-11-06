# mcp-use SDK agentic eval — 2026-11-06

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-06T14-06-02` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m23s
- Median turns: 13
- Median tool calls: 22
- Median tokens in/out: 674586 / 6046
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had API-discovery friction and leaned on installed-package internals rather than external docs: it opened `node_modules/mcp-use/README.md`, then searched declarations with `rg -n "resource\(|streamable|listen\(|createServer|registerResource|resources"` and read `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/config.d.ts`. That search also produced a distracting glob error: `rg: node_modules/mcp-use/dist/internal/*.d.ts: No such file or directory`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than external docs, reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/node-http.d.ts`, and grepping for `resource(` to establish the API shape. Client-side verification had extra discovery friction: the first search for `*.d.ts` returned no files, after which it found the package actually shipped declarations such as `index.d.cts` and `shimsNode.d.mts`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK API from package artifacts rather than an immediately usable example: the agent fetched the npm README, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then searched installed declarations with `rg -n "resource\\(|resources|Streamable|streamable|listen|serve" node_modules/mcp-use/dist` and inspected `node_modules/mcp-use/dist/server.d.ts` plus `resources.d.ts`.
