# mcp-use SDK agentic eval — 2026-11-06

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-06T14-05-59` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 492519 / 5297
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had API-discovery friction: it first queried npm metadata/readme with `npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "serve\\(|streamable|Streamable|listen|createServer" node_modules/mcp-use` and `sed -n '380,430p' node_modules/mcp-use/dist/server.d.ts`. The declaration was ultimately sufficient, exposing `listen(port?: number ...): Promise<{ ... url: string; }>`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had some API-discovery friction on the blank scaffold: it first queried npm metadata and the package README (`npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`), then inspected installed declarations with `rg -n "listen\\(|serve\\(|streamable|MCPServer" node_modules/mcp-use` and `sed -n '1,150p' node_modules/mcp-use/dist/server.d.ts`. This suggests the README alone was not sufficient to establish the current server/listen API shape.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main discovery overhead was determining the SDK API and transport behavior. The agent first queried npm metadata and the full README with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, which surfaced the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but it did not fetch that documentation directly. It then inspected installed declarations using `rg -n "class MCPServer|start\\(|listen\\(|transport|streamable" node_modules/mcp-use` and `sed -n '360,425p' node_modules/mcp-use/dist/server.d.ts`, indicating that node_modules type definitions were the practical source for discovering `MCPServer.listen()` and streamable HTTP behavior.
