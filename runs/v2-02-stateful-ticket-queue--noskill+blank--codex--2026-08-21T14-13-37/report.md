# mcp-use SDK agentic eval — 2026-08-21

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-21T14-13-37` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m35s
- Median turns: 14
- Median tool calls: 19
- Median tokens in/out: 558770 / 5567
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent began from a genuinely blank directory, as the initial listing showed only `.` and `..`, so there was no scaffold to fight. It relied first on npm package metadata and README via `npm view mcp-use readme --json`, which surfaced `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then inspected installed declarations with `rg -n "class MCPServer|listen\\(|streamable|serve" node_modules/mcp-use...` and `sed -n '1,420p' node_modules/mcp-use/dist/server.d.ts`; this node_modules inspection appears to have provided the concrete `MCPServer`, `tool`, and `listen` API shape.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had API-discovery friction and relied first on npm metadata/readme—`npm view mcp-use@2.3.0 readme --json`—then inspected installed declarations with `rg -n "class MCPServer|serve\\(|listen\\(|streamable" node_modules/mcp-use/...` and `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. This suggests the package’s exported server/listen shape was not obvious from initial package information.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had to discover the SDK shape locally, first reading `node_modules/mcp-use/README.md` and then grepping declarations with `rg -n "Streamable|streamable|listen\\(|serve\\(|PORT|node-http" ...`; it further inspected `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`. No skill file or external docs URL appears in the transcript.
