# mcp-use SDK agentic eval — 2026-08-07

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-07T14-23-34` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m30s
- Median turns: 12
- Median tool calls: 18
- Median tokens in/out: 617968 / 6810
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main wrong turn came from the default npm scaffold remaining CommonJS: `npm init -y` produced `"type": "commonjs"`, and the first typecheck failed with `"The 'import.meta' meta-property is not allowed in files which will build into CommonJS output"` plus `"Cannot find name 'process'"` and `"cannot use 'await' at the top level."` The agent recovered by changing package configuration to `"type": "module"` and adjusting TypeScript settings, after which `npx tsc --noEmit` exited successfully.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK API from the published package rather than an available skill or scaffold. The agent first queried npm with `npm view mcp-use version description repository.url dist.tarball`, then unpacked the package using `npm pack mcp-use@2.0.4` and inspected `package/README.md`, `package/dist/index.d.ts`, `package/dist/server.d.ts`, and `package/dist/resources.d.ts`. This worked, but required several exploratory calls before implementation; the README itself pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, though the transcript does not show that URL being fetched.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent relied heavily on installed declaration files rather than a skill or fetched docs, inspecting `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `README.md`, then grepping for `"resource\\(|resourceTemplate|listen\\("`. It also inspected the bundled MCP client API via `rg -n "(callTool|readResource)\\(" node_modules/@modelcontextprotocol/client/dist/index.d.mts`, indicating some discovery friction around both registration and end-to-end testing APIs.
