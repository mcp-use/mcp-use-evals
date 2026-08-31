# mcp-use SDK agentic eval — 2026-08-31

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-31T14-08-19` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m51s
- Median turns: 15
- Median tool calls: 21
- Median tokens in/out: 516962 / 5309
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had API-discovery friction in the blank workspace: it first fetched npm metadata and the full README with `npm view mcp-use readme --json`, then inspected installed declarations using `find node_modules/mcp-use` and `sed -n ... node_modules/mcp-use/dist/server.d.ts`. It also grepped the package for transport/startup shape with `rg -n "listen\(|Streamable|streamable|serve\("`. No skill file or dedicated docs page was used; the README merely exposed the link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had SDK discovery friction: it first queried npm with `npm view mcp-use readme`, then inspected installed declarations using `rg -n "class MCPServer|listen\\(|streamable|http" node_modules/mcp-use/dist`, eventually concluding that the SDK “provides a native `listen()` method that serves streamable HTTP at `/mcp`.” No skill file or fetched docs URL was used; the visible resources were the npm README and `node_modules/mcp-use/dist/server.d.ts`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had to discover the SDK shape from package metadata and installed declarations rather than a skill or fetched documentation: it ran `npm view mcp-use version description repository.url dist.tarball --json`, then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `config.d.ts`, and `tools.d.ts`. This worked, but the repeated declaration searches—first broad `sed`, then `rg -n "listen\("`—show some API-discovery friction around tool registration and HTTP startup.
