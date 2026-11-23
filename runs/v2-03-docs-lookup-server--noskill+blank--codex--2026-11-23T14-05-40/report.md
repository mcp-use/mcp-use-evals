# mcp-use SDK agentic eval — 2026-11-23

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-23T14-05-40` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 610563 / 6129
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main wrong turn was package configuration: after `npm init -y` created `"type": "commonjs"`, the edited `package.json` contained both `"type": "module"` and a later `"type": "commonjs"`. This made the first typecheck fail with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` A second package edit fixed it, after which `npx tsc --noEmit` passed.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent spent several calls discovering the SDK API from the npm package rather than using a skill or fetched documentation page: it ran `npm view mcp-use version description repository.url`, extracted `package/README.md`, and inspected declarations such as `package/dist/index.d.ts`, `package/dist/config.d.ts`, and `package/dist/server.d.ts`. One discovery attempt failed because `npm pack mcp-use --dry-run` did not create a tarball, followed by `tar: mcp-use-2.12.9.tgz: Cannot open: No such file or directory`; it recovered by running `npm pack mcp-use --silent`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs: it ran `rg -n "Streamable|streamable|resource\(|tool\(" node_modules/mcp-use/dist node_modules/mcp-use/README.md` and inspected `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, and `tools.d.ts` to discover resource, tool, and listener APIs. The README exposed a docs URL—`https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—but the transcript does not show it being fetched.
