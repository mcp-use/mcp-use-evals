# mcp-use SDK agentic eval — 2026-09-04

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-04T14-07-27` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m57s
- Median turns: 18
- Median tool calls: 25
- Median tokens in/out: 649433 / 6929
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery cost was learning the SDK and client APIs directly from installed packages: the agent searched `node_modules/mcp-use` for `"Streamable|streamable|listen\\(|tool\\("`, read `node_modules/mcp-use/README.md` and several `dist/*.d.ts` files, then later searched `@modelcontextprotocol/client` for `"StreamableHTTPClientTransport"`, `listTools`, and `callTool`. No skill file or fetched documentation URL appears; package selection came from `npm view mcp-use version description repository.url dist-tags --json`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent relied primarily on installed-package discovery rather than external docs: it opened `node_modules/mcp-use/README.md`, inspected `node_modules/mcp-use/dist/index.d.ts`, and grepped declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts`. This successfully exposed the useful port precedence contract: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): API discovery took several exploratory steps: `npm view mcp-use readme --json` returned only an npm notice, followed by the very large `npm view mcp-use --json` metadata dump. The agent then relied on installed-package documentation and type declarations, grepping `node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist`, then reading `README.md`, `server.d.ts`, and `config.d.ts`; no skill file or external docs URL appears in the transcript.
