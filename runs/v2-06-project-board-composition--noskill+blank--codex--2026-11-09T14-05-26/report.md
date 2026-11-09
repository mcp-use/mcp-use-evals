# mcp-use SDK agentic eval — 2026-11-09

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-09T14-05-26` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 401485 / 5577
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main wrong turn was project module configuration: `npm init -y` created `"type": "commonjs"`, and the first `npx tsc --noEmit` failed with `Cannot find name 'process'`, ``'import.meta' meta-property is not allowed in files which will build into CommonJS output``, and `The current file is a CommonJS module and cannot use 'await' at the top level`. The agent then modified both `package.json` and `tsconfig.json`, stating, `I corrected the project’s module configuration`, after which typechecking succeeded.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery: the agent queried npm metadata with `npm view mcp-use version description repository.url dist-tags --json`, then inspected installed declarations via `sed -n '1,440p' node_modules/mcp-use/dist/server.d.ts` and `sed -n '1,220p' node_modules/mcp-use/dist/resources.d.ts`. It also explicitly grepped the package for transport and registration shapes with `rg -n "streamable|resource|McpServer|createMCP" node_modules/mcp-use/dist node_modules/mcp-use/README.md`, rather than relying on a skill file or fetched docs URL.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had discovery friction around the SDK API: after `npm view mcp-use readme --json` yielded no visible README content, it inspected package-local docs and declarations with `sed -n '1,240p' node_modules/mcp-use/README.md` and `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts`. One declaration-inspection command also included a nonexistent file and exited `2`, shown by `sed: can't read node_modules/mcp-use/dist/index-node.d.ts`.
