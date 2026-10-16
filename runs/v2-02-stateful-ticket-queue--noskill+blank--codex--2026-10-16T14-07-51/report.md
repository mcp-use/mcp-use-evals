# mcp-use SDK agentic eval — 2026-10-16

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-16T14-07-51` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m37s
- Median turns: 17
- Median tool calls: 24
- Median tokens in/out: 708331 / 7061
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied on installed-package inspection rather than a skill file or external docs: it queried npm with `npm view mcp-use version description repository.url --json`, then read `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `tools.d.ts`, and `node_modules/mcp-use/README.md`. It also grepped the package for API clues with `rg -n "listen\(|streamable|createServer|server\.tool|noauth"` before finding the useful listener contract: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had discovery friction because npm metadata returned an empty README (`"readme": ""`), so it inspected the installed package directly with `find node_modules/mcp-use`, searched declarations for `"Streamable|streamable|create.*server|tool\\("`, and read `node_modules/mcp-use/README.md` plus `dist/server.d.ts`. The useful API shape came from the declaration example `await server.listen(3000);` and signature `listen(port?: number | undefined, options?: ListenOptions)`; the README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had SDK-discovery friction: `npm view mcp-use readme` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so it fell back to packing the npm release and inspecting `package/README.md`, `package/dist/server.d.ts`, `package/dist/config.d.ts`, and `package/dist/tools.d.ts`. It did not use a skill file or fetch the linked docs URL; the visible resources were the npm metadata, packaged README, and declaration files.
