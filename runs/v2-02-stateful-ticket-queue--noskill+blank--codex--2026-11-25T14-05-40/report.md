# mcp-use SDK agentic eval — 2026-11-25

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-25T14-05-40` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 15
- Median tool calls: 20
- Median tokens in/out: 635773 / 5455
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): API discovery consumed several probes: the agent first queried npm metadata and the full README with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then searched installed package internals using `rg -n "class MCPServer|listen\\(|serve\\(|Streamable|streamable|export.*MCPServer" node_modules/mcp-use/dist node_modules/mcp-use`. The broad search returned noisy bundled output such as `node_modules/mcp-use/dist/mcp-proxy-YSI2UFBY.js`, so it narrowed to declaration files before finding `listen(port?: number | undefined...)` in `node_modules/mcp-use/dist/server.d.ts`. The README did expose a documentation link—`https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—but the transcript shows no fetch of that URL and no use of an mcp-use skill file.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main discovery friction was API-shape lookup. With a blank workspace, the agent first fetched the npm metadata/readme via `npm view mcp-use version description readme --json`, then inspected installed declarations using `rg -n "listen\\(|serve\\(|Streamable|HTTP|MCPServer" node_modules/mcp-use` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. No skill file was used; the npm readme exposed the docs URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched directly.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had initial API-discovery friction and relied on npm metadata plus installed declarations rather than a skill file: it queried `npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`. The key transport/API shape came from the declaration stating `listen(port?: number | undefined, options?: ListenOptions)` and documenting that it serves HTTP.
