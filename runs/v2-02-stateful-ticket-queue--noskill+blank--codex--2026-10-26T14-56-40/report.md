# mcp-use SDK agentic eval — 2026-10-26

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-26T14-56-40` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 701368 / 6229
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery cost was determining the SDK shape from installed artifacts rather than an example: the agent first queried npm with `npm view mcp-use version description repository.url dist.tarball && npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and grepped `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts`. The type declaration ultimately supplied the important port behavior: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main time sink was API discovery: the agent first queried npm metadata and README (`npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme`), then inspected the package archive (`npm pack mcp-use --dry-run --json`), and finally leaned on installed package docs and declarations (`sed -n '1,240p' node_modules/mcp-use/README.md` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`). It further grepped SDK types for transport and authentication details with `rg -n "listen\\(|securitySchemes|noauth|basePath"`, suggesting the streamable-HTTP API shape was not immediately obvious from the initial npm lookup.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs: it ran `npm view mcp-use readme --json`, then searched `node_modules/mcp-use` with `rg -n "streamable|Streamable|tool\("`, and opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/mount-mcp.d.ts`. It later grepped the bundled MCP client declarations for `StreamableHTTP` and `callTool(` to construct its verifier.
