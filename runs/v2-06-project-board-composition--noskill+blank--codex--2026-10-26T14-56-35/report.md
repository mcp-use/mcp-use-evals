# mcp-use SDK agentic eval — 2026-10-26

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-26T14-56-35` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m35s
- Median turns: 14
- Median tool calls: 22
- Median tokens in/out: 760891 / 7439
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had to discover the SDK API by inspecting installed declarations rather than relying on readily surfaced package documentation: it ran `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, inspected `resources.d.ts`, and grepped for `"listen\\(|streamable|resource\\("`. The initial `npm view mcp-use readme --json` yielded no README content in the shown output, only package metadata such as `"version": "2.11.2"`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main time sink was API discovery: after `npm view mcp-use readme --json` returned no README content, the agent inspected the installed package directly with `sed -n '1,240p' node_modules/mcp-use/README.md`, then queried declarations via `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts` and repeatedly grepped for `listen(` and `resourceTemplate`. This indicates the npm metadata alone did not provide enough usable guidance for the resource-template and listener APIs.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main SDK discovery cost was local package inspection rather than a skill or fetched docs: the agent ran `npm view mcp-use readme --json`, then examined `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `config.d.ts`, and `tools.d.ts`. This suggests the API shape for `resourceTemplate` and `listen()` required declaration-file spelunking; the grep also produced the minor dead-end `rg: node_modules/mcp-use/dist/README.md: No such file or directory`.
