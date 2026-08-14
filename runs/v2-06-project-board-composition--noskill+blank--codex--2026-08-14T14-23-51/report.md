# mcp-use SDK agentic eval — 2026-08-14

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-14T14-23-51` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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
- Median tokens in/out: 463140 / 6092
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery cost was local SDK archaeology: the agent inspected `node_modules/mcp-use/README.md`, then opened `dist/server.d.ts`, `dist/resources.d.ts`, and related declarations, and finally ran `rg -n "listen\\(" ...` to determine registration and listener APIs. No external docs or skill file appear in the transcript; the implementation path came from `node_modules/mcp-use`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had API-discovery friction and relied first on the npm metadata/readme—`npm view mcp-use readme --json`—then inspected installed declarations with `rg -n "resource\\(|resources|streamable|listen\\(" node_modules/mcp-use` and `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. This suggests the package’s readily available examples were insufficient for confidently identifying resource templates and HTTP startup APIs.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent relied on npm metadata and installed-package inspection rather than a skill file or fetched docs: it ran `npm view mcp-use version description repository.url dist.tarball --json`, read `node_modules/mcp-use/README.md`, and inspected `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts` for `resource(`, `streamable`, and `listen(` API shapes.
