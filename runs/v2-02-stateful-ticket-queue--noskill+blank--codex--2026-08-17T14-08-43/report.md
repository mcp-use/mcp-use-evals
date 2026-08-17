# mcp-use SDK agentic eval — 2026-08-17

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-17T14-08-43` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m35s
- Median turns: 13
- Median tool calls: 24
- Median tokens in/out: 551087 / 5454
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had API-discovery friction and relied first on npm metadata/readme via `npm view mcp-use readme`, then inspected installed declarations with `rg -n "listen\(|serve\(|streamable|MCPServer" node_modules/mcp-use` and `sed -n '1,220p' node_modules/mcp-use/dist/server.d.ts`; no skill file or fetched docs URL appears in the transcript. The declaration comment provided an important state-lifetime clue: `a fresh SDK McpServer is built from it for every HTTP request` and `put pools and caches at module scope`, which matches `src/server.ts`’s module-level `const tickets = new Map<number, Ticket>();`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main discovery friction was determining the SDK’s server and transport API. The agent first queried npm with `npm view mcp-use version description repository.url dist.tarball` and fetched the package README, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; it then relied more heavily on installed declarations via `rg -n "class MCPServer|listen\\(|streamable|http" node_modules/mcp-use` and `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. It also had to inspect protocol details manually with `rg -n "MCP-Protocol-Version|protocolVersion.*202|initialize" node_modules/mcp-use/dist` before constructing raw curl JSON-RPC requests using `MCP-Protocol-Version: 2025-11-25`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main discovery friction was determining the SDK API: the agent first queried package metadata with `npm view mcp-use version description readme --json`, then inspected installed declarations using `rg -n "class MCPServer|listen\\(|streamable|MCPServer" node_modules/mcp-use/dist` and `sed -n ... node_modules/mcp-use/dist/server.d.ts`. The npm README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows no direct docs fetch or skill-file use.
