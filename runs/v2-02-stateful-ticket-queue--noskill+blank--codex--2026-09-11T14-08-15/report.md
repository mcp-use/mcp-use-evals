# mcp-use SDK agentic eval — 2026-09-11

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-11T14-08-15` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m47s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 749262 / 6526
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied on npm metadata/readme first (`npm view mcp-use version description homepage repository --json` and `npm view mcp-use readme`) and then inspected installed declarations to determine the API shape (`rg -n "class MCPServer|listen\(|streamable|serve" node_modules/mcp-use/dist` and `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts`). This suggests the blank scaffold offered no local guidance, though the declarations did expose `MCPServer.listen`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent needed package/API discovery rather than relying on a skill file: it queried npm with `npm view mcp-use version description repository.url dist-tags --json`, read the package README, then inspected installed declarations using `rg -n "class MCPServer|serve\\(|listen\\(|http" node_modules/mcp-use/dist` and `sed -n '1,125p' node_modules/mcp-use/dist/server.d.ts`. This suggests the blank/no-skill setup imposed some API-shape discovery overhead.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had API-discovery friction before implementation: it queried npm metadata and the full README with `npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "class MCPServer|serve\\(|listen\\(" node_modules/mcp-use` and `sed -n '1,150p' node_modules/mcp-use/dist/server.d.ts`. The declaration’s example and `ListenOptions` appear to have supplied the needed `MCPServer.tool`/`listen` shape; no mcp-use skill file or fetched docs page appears in the transcript.
