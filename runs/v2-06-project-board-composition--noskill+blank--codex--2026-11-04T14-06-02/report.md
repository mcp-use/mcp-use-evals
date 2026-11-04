# mcp-use SDK agentic eval — 2026-11-04

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-04T14-06-02` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 16
- Median tool calls: 22
- Median tokens in/out: 793356 / 8757
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main wrong turn was installing Zod 3: `npm install mcp-use@2.12.2 zod@3` led to `Property 'jsonSchema' is missing`, plus handler arguments inferred as `unknown`. Upgrading with `npm install zod@4` made `npx tsc --noEmit` pass, suggesting the SDK’s required schema-generation compatibility was not obvious during dependency setup.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main SDK discovery friction was API-shape research in the installed package: the agent first inspected `node_modules/mcp-use/README.md`, then searched declarations with `rg -n "resource|listen\\(|streamable|mount" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`, and finally opened `resources.d.ts`, `server.d.ts`, `config.d.ts`, and `tools.d.ts`. The npm metadata/readme lookup was not useful in the visible output: `npm view mcp-use readme --json` produced only the package metadata and npm notices, prompting the declaration-file investigation.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery in the blank workspace. The agent first queried npm (`npm view mcp-use version description repository.url dist-tags --json`), then leaned heavily on package-local docs and declarations: `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`. For lifecycle testing it similarly searched the transitive client package with `rg -n "listTools\\(|callTool\\(|readResource\\(" node_modules/@modelcontextprotocol/client/dist/index.d.mts`, suggesting the runnable client API was not immediately obvious from the server package.
