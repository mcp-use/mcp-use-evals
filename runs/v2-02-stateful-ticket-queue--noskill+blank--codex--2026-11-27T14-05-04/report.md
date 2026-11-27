# mcp-use SDK agentic eval — 2026-11-27

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-27T14-05-04` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m12s
- Median turns: 15
- Median tool calls: 19
- Median tokens in/out: 519739 / 5639
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main friction was SDK API discovery: the agent first fetched npm metadata/readme via `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then searched installed declarations with `rg -n "serve\\(|Streamable|create.*server|MCPServer" node_modules/mcp-use`, and finally inspected `node_modules/mcp-use/dist/server.d.ts` to confirm `listen(port?: number...)`. No mcp-use skill file was used; the visible external documentation pointer came from the package readme: `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main time sink was SDK discovery: the agent first fetched package metadata and the full npm README via `npm view mcp-use readme --json`, then searched installed declarations with `rg -n "listen\(|serve\(|streamable|http" node_modules/mcp-use/...`, and finally inspected `node_modules/mcp-use/dist/server.d.ts` and `tools.d.ts` before concluding that “`The installed SDK supports a native server.listen() transport at /mcp`.” No skill file or focused docs page was used; the visible resource path was the npm README’s link to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, followed by direct node_modules inspection.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent spent noticeable discovery effort on SDK shape because the directory was blank (`total 8 ... . ..`). It first queried npm metadata with `npm view mcp-use version description repository.url dist.tarball`, then relied on the installed package’s README and declarations via `sed -n '1,200p' node_modules/mcp-use/README.md` and `find node_modules/mcp-use -name '*.d.ts'`. It also grepped bundled implementation files for startup behavior—`rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`—which returned a large minified `dist/index.js` snippet, suggesting the exported listen API was not immediately obvious from documentation or typings.
