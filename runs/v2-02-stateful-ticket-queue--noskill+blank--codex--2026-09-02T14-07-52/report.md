# mcp-use SDK agentic eval — 2026-09-02

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-02T14-07-52` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 15
- Median tool calls: 21
- Median tokens in/out: 473934 / 5713
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had some SDK discovery friction and relied on the installed package rather than a skill or external docs: it queried `npm view mcp-use version description repository.url`, then inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/tools.d.ts`. The declaration that clarified startup behavior was `listen(port?: number | undefined, options?: ListenOptions)` alongside “`Serve over HTTP on Node`”.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main time sink was SDK discovery: the agent first tried npm metadata and README retrieval, but `npm view mcp-use readme --json` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, and the fallback `npm view mcp-use readme | head -220` returned no output. It then downloaded and unpacked the package with `npm pack mcp-use` and inspected `/tmp/mcp-use-package-234/package/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`; this package-source inspection revealed the `listen(port?: number | undefined, options?: ListenOptions)` API. The README itself pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had some API-discovery friction and inspected the installed package rather than using a skill file or fetching the linked docs: `sed -n '1,260p' node_modules/mcp-use/README.md`, `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts`, and `rg -n "listen\\(|port|streamable|createServer" node_modules/mcp-use/dist`. The package README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
