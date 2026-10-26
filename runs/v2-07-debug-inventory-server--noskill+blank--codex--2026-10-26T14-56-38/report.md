# mcp-use SDK agentic eval — 2026-10-26

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-26T14-56-38` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m16s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 487579 / 3793
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was querying SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`. After `npm install`, the agent leaned on local package resources rather than a skill file or external docs, searching `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/dist/server.d.ts` for `"listen("`, `"streamable"`, and `"MCPServer"`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main detour was probing the SDK before dependencies existed: `rg ... node_modules/mcp-use` returned `No such file or directory`, after which the agent ran `npm install`. Its first post-install API search hit the bundled implementation—`node_modules/mcp-use/dist/index-node.js:1:` followed by minified output—before a more useful declaration search found `node_modules/mcp-use/dist/config.d.ts:115` stating that `listen()` uses `PORT` and line 118 documenting the default as `3000`. Thus, the agent leaned on grepping `node_modules` for API shape; no skill file or fetched docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was missing dependencies: the initial inspection ended with `UNMET DEPENDENCY mcp-use@2.0.4` and the agent had to run `npm install`, which took `19s` and emitted an unrelated warning about `5 high severity vulnerabilities`.
