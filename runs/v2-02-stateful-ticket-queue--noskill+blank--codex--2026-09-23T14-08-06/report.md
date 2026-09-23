# mcp-use SDK agentic eval — 2026-09-23

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-23T14-08-06` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 518167 / 5024
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had some SDK discovery friction before implementation: it first queried npm with `npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "class MCPServer|serve\\(|streamable|Streamable" node_modules/mcp-use` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. This worked, but indicates the package README alone was not sufficient to confidently identify the current `MCPServer.listen` API.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had API-discovery friction and relied first on npm metadata/readme via `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then inspected installed declarations with `sed -n '1,130p' node_modules/mcp-use/dist/server.d.ts` and `sed -n '1,220p' node_modules/mcp-use/dist/tools.d.ts`. It also broadly grepped the package for startup and transport clues using `rg -n "start\\(|streamable|Streamable|serve\\(|listen\\(" node_modules/mcp-use/dist node_modules/mcp-use/README.md`, suggesting the basic server/listen API was not immediately obvious from the package entry point.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first pulled the npm README with `npm view mcp-use readme --json`, whose visible guidance pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then searched installed package internals using `rg -n "listen\\(|serve\\(|transport|Streamable" node_modules/mcp-use`. It initially guessed the wrong declaration path—`sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory`—before enumerating declarations with `find node_modules/mcp-use/dist -maxdepth 1 -name '*.d.ts'` and inspecting `node_modules/mcp-use/dist/server.d.ts`, `index.d.ts`, and `tools.d.ts`. This package-source inspection established the needed listener behavior: the agent concluded, `The SDK’s native MCPServer listener serves the /mcp streamable-HTTP endpoint`.
