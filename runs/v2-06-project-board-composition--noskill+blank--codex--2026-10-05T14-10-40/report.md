# mcp-use SDK agentic eval — 2026-10-05

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-05T14-10-40` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 16
- Median tool calls: 32
- Median tokens in/out: 1073427 / 7880
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had some SDK discovery friction in the blank workspace: it first queried package metadata with `npm view mcp-use version description repository.url dist.tarball`, then inspected the installed package via `node_modules/mcp-use/README.md` and declarations such as `node_modules/mcp-use/dist/server.d.ts` and `config.d.ts`. Its first declaration-search command exited with code 2 while looking for `resources.d.ts` and `index-node.d.ts`, after which it ran another broad inspection command including `sed -n '1,270p' node_modules/mcp-use/dist/config.d.ts` and `node -e "import('mcp-use').then(x=>console.log(Object.keys(x)))"`. No mcp-use skill file or fetched docs URL appears in the transcript; the visible resources were npm metadata and installed package files.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had discovery friction around the SDK API: it first queried npm metadata and the README (`npm view mcp-use version description repository.url dist.tarball` and `npm view mcp-use readme`), then inspected installed declarations and implementation with `sed`/`rg` under `node_modules/mcp-use/dist/`; one exploratory command also referenced nonexistent declaration files and exited `2`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had API-discovery friction and relied first on the npm README (`npm view mcp-use readme`) and then extensively inspected installed declarations, including `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts` and searches for `StreamableHTTPClientTransport` under `node_modules/@modelcontextprotocol/client/dist`; no skill file or fetched docs page appears in the transcript.
