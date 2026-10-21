# mcp-use SDK agentic eval — 2026-10-21

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-21T14-07-51` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 16
- Median tool calls: 21
- Median tokens in/out: 451746 / 5861
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): Discovery had some friction: the initial npm metadata/readme lookup failed with `npm error code ECONNRESET`, and the retry produced an empty file (`0 /tmp/mcp-use-readme.json`) followed by `Unexpected end of JSON input`. The agent then relied on installed package materials, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and grepping for `"Streamable|streamable|HTTP|createMCP|MCPServer|tool\\("`; the README quickstart provided the key `MCPServer`, Zod schema, and `server.tool` shape.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had some SDK discovery friction on a blank workspace: it queried npm with `npm view mcp-use version description repository.url dist.tarball --json`, then inspected installed declarations and docs via `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts` and `sed -n '1,220p' node_modules/mcp-use/README.md`. It needed several additional searches to establish the listener API and dependency shape, including `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts` and `npm ls zod --all`; no mcp-use skill file or external docs URL appears in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had to discover the API locally rather than using a skill or fetched docs: it searched `node_modules/mcp-use/README.md` and declarations with `rg -n "streamable|Streamable|createMcpServer|McpServer|tool\\("`, then inspected `node_modules/mcp-use/dist/server.d.ts` to confirm `listen(port?: number ...)`. This worked, but required several exploratory commands before implementation.
