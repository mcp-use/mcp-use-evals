# mcp-use SDK agentic eval — 2026-08-14

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-14T14-23-55` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m38s
- Median turns: 12
- Median tool calls: 22
- Median tokens in/out: 586245 / 5791
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had SDK discovery friction and inspected the installed package rather than using a skill or fetched docs: it ran `npm view mcp-use version description repository.url --json`, then searched `node_modules/mcp-use/README.md` and declarations with `rg -n "streamable|Streamable|http" ...` and opened `node_modules/mcp-use/dist/server.d.ts`. Those declarations clarified the state model and listener behavior, including `"a fresh SDK McpServer is built ... for every HTTP request"` and `"Serve over HTTP on Node"`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had SDK discovery friction and relied first on npm metadata/readme (`npm view mcp-use readme --json`), then inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched implementation files via `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. This led it to the correct API conclusion: `The installed SDK provides a native listen() method for its streamable HTTP endpoint`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent first relied on npm package metadata and the embedded README via `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, which surfaced the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; there is no visible fetch of that docs URL.
