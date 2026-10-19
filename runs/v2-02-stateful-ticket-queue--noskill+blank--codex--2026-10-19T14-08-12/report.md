# mcp-use SDK agentic eval — 2026-10-19

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-19T14-08-12` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m23s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 680527 / 5715
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main wrong turn was module/type configuration: `npm init -y` created `"type": "commonjs"`, and the first typecheck failed with `Cannot find name 'process'` plus `The current file is a CommonJS module and cannot use 'await' at the top level.` Inspection then revealed duplicate package fields—`package.json:6: "type": "module"` and `package.json:14: "type": "commonjs"`—despite `@types/node@26.6.5` already being installed. The agent had to modify both `package.json` and `tsconfig.json` before `npx tsc --noEmit` passed, suggesting scaffold/config editing rather than the SDK itself caused the rework.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main time sink was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then repeatedly inspected installed declarations using `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts`, `rg -n "listen\\("`, and later searched the MCP client package for `StreamableHTTPClientTransport` and `callTool`. The npm query only surfaced package metadata—`"description": "MCP framework and CLI built on the official v2 SDK"`—so the useful API shape appears to have come from grepping `node_modules`, not a skill file or fetched docs URL.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main wrong turn was package-module configuration. After editing `package.json`, it contained both `"type": "module"` and a later `"type": "commonjs"`, so TypeScript failed with `TS1470: The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.` The agent then inspected the manifest with `npm pkg get type`, saw `"commonjs"`, removed the duplicate, and the next `npx tsc --noEmit` passed. This looks like friction from modifying the `npm init` scaffold rather than an SDK issue.
