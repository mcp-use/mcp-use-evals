# mcp-use SDK agentic eval — 2026-09-16

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-16T14-08-07` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m01s
- Median turns: 13
- Median tool calls: 21
- Median tokens in/out: 401429 / 5949
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main friction was SDK discovery. The agent first tried the npm metadata/readme route with `npm view mcp-use readme`, but the result was empty: `0 /tmp/mcp-use-readme.json`. It then downloaded and inspected the package itself via `npm pack mcp-use` and extracted `package/README.md`, `package/dist/server.d.ts`, and `package/dist/tools.d.ts`; the declaration inspection supplied the needed API shape, including `listen(port?: number | undefined, options?: ListenOptions)` and its returned `url`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than external docs, reading `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts` after stating it would “`confirm the mcp-use API available in the installed package`.” It also repeatedly grepped bundled JavaScript for transport details with commands such as `rg -n "async listen|listen\\(" node_modules/mcp-use/dist/chunk-*.js`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had some SDK discovery friction before implementation: it queried npm with `npm view mcp-use version description repository.url dist.tarball`, then searched installed package docs/types using `rg -n "streamable|Streamable|MCPServer|createMCP|tool\(" node_modules/mcp-use`. It ultimately leaned on `node_modules/mcp-use/README.md`’s Quickstart and inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`; no skill file or fetched docs URL appears in the transcript.
