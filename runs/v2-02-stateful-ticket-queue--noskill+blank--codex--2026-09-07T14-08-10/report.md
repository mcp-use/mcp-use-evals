# mcp-use SDK agentic eval — 2026-09-07

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-07T14-08-10` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m45s
- Median turns: 16
- Median tool calls: 23
- Median tokens in/out: 617268 / 6572
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent substantial discovery effort on package metadata and installed declarations rather than a skill or fetched docs: it ran `npm view mcp-use version description repository.url`, inspected `node_modules/mcp-use/dist/index.d.ts`, and grepped `rg -n "streamable|Streamable|listen|tool\\(" node_modules/mcp-use/dist`. This was productive but indicates API-shape discovery friction, especially around `MCPServer.listen` and tool registration.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main SDK papercut was schema-version compatibility: the initial install pulled Zod `3.25.76`, after which typechecking failed because `Property 'jsonSchema' is missing` and callback inputs became `unknown` (`Type 'unknown' is not assignable to type 'string'`). The agent inspected `node_modules/mcp-use/dist/tools.d.ts` and package metadata—`node -p ... peerDependencies` plus `sed -n ... node_modules/mcp-use/dist/tools.d.ts`—then modified `package.json`; only after reinstalling did `tsc --noEmit` pass.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had to discover the SDK API directly from the installed package, first reading `node_modules/mcp-use/README.md`, then inspecting `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and package exports; its search specifically found `listen(port?: number | undefined, options?: ListenOptions)`. No skill file or fetched documentation URL appears in the transcript.
