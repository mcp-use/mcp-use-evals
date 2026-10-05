# mcp-use SDK agentic eval — 2026-10-05

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-05T14-10-36` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m50s
- Median turns: 16
- Median tool calls: 19
- Median tokens in/out: 614998 / 7093
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent time discovering the SDK API rather than relying on a scaffold: it queried the npm README (`npm view mcp-use readme`) and then grepped installed declarations with `rg -n "class MCPServer|listen\\(|serve\\(|streamable|Streamable" node_modules/mcp-use/dist`. This led it to the direct API conclusion, `"The SDK’s current server API provides streamable HTTP directly through MCPServer.listen()."`
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent spent time discovering the API rather than using a skill: it first fetched package metadata and the npm README with `npm view mcp-use readme`, then searched installed internals using `rg -n "class MCPServer|serve\\(|streamable|http" node_modules/mcp-use`, and finally inspected declarations including `node_modules/mcp-use/dist/server.d.ts`. The README did expose the documentation URL, `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then searched the installed package via `rg -n "serve\\(|listen\\(|streamable|http" node_modules/mcp-use/dist node_modules/mcp-use/README.md`, and finally inspected declarations with `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. The README primarily pointed onward to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; no skill file or fetched docs page appears in the transcript.
