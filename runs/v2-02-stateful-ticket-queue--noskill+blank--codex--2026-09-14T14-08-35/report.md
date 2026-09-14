# mcp-use SDK agentic eval — 2026-09-14

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-14T14-08-35` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m52s
- Median turns: 12
- Median tool calls: 24
- Median tokens in/out: 523912 / 6914
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery cost was establishing the SDK API from package artifacts rather than a local skill or scaffold: the agent fetched `npm view mcp-use readme`, then searched installed declarations with `rg "listen\\(|serve\\(|Streamable" node_modules/mcp-use/dist` and opened `node_modules/mcp-use/dist/server.d.ts`. The README at least surfaced the official docs URL, ``https://docs.mcp-use.com/v2/typescript/getting-started/welcome``, but the transcript does not show that URL being fetched directly.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main wrong turn was protocol-version handling during verification: the first initialize request used `MCP-Protocol-Version: 2026-07-28` and received `400` with `the request headers and body disagree: an initialize request (legacy handshake) was sent with a modern MCP-Protocol-Version header`. The agent recovered by removing that header and sending body version `2025-11-25`, which returned `"protocolVersion":"2025-11-25"`; this suggests the SDK’s modern-versus-legacy handshake distinction was not obvious.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had SDK-discovery friction in the blank workspace: it first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and fetched the package README, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`. It then grepped installed package internals for the API shape using `rg -n "serve\(|listen\(|Streamable|streamable|MCPServer" node_modules/mcp-use/dist node_modules/mcp-use/README.md` and inspected `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `tools.d.ts`, and `node-http.d.ts`; no mcp-use skill file was used in the visible transcript.
