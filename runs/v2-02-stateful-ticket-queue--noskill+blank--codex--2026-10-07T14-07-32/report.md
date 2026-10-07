# mcp-use SDK agentic eval — 2026-10-07

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-07T14-07-32` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m37s
- Median turns: 16
- Median tool calls: 24
- Median tokens in/out: 791690 / 6148
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent several discovery steps establishing the SDK API: it queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then searched installed declarations using `rg -n "class MCPServer|listen\(|streamable|start\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `index.d.ts`. The npm README exposed the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched; implementation relied on package metadata and `node_modules` declarations instead.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent relied on npm metadata/readme first—`npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`—which surfaced `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but there is no evidence it fetched that documentation. It then discovered the API by grepping installed package internals—`rg -n "listen\\(|streamable|createServer|MCPServer\\(" node_modules/mcp-use`—and inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`; no mcp-use skill file was used.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent needed SDK discovery before implementation, first querying npm with `npm view mcp-use version description repository.url` and `npm view mcp-use readme`, then grepping installed declarations via `rg -n "listen\(|serve\(|streamable|transport|MCPServer" node_modules/mcp-use/dist`. The first declaration inspection also referenced nonexistent files and exited 2: `sed: can't read ...` is not shown due truncated? Result exit 2 but output doesn't show exact error. Avoid.
