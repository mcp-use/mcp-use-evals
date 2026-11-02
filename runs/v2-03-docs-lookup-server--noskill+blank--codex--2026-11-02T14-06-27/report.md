# mcp-use SDK agentic eval — 2026-11-02

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-02T14-06-27` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m13s
- Median turns: 12
- Median tool calls: 20
- Median tokens in/out: 435106 / 4659
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent spent substantial discovery effort inspecting the published package rather than using a skill or direct documentation: it ran `npm pack mcp-use`, extracted `package/README.md`, and inspected `package/dist/server.d.ts`, `package/dist/resources.d.ts`, `package/dist/config.d.ts`, and `package/dist/tools.d.ts`. This worked, but indicates the SDK’s resource, tool, and `listen` API shape was not immediately known; the declarations supplied examples such as `await server.listen(3000);` and the resource callback form `contents: [{ uri: uri.href, mimeType: "text/plain", text: "hello" }]`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was API discovery: `npm view mcp-use readme --json` produced no output, so the agent switched to downloading and inspecting the package via `npm pack mcp-use@2.12.2` and extracting `package/README.md`, `package/dist/resources.d.ts`, `package/dist/config.d.ts`, and `package/dist/server.d.ts`. The package README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched; instead, the agent relied on the tarball’s README and declaration files, including the resource callback example `contents: [{ uri: uri.href, mimeType: "text/plain", text: "hello" }]`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main wrong turn was project module configuration: `npm init -y` created `"type": "commonjs"`, and the first typecheck failed with `Cannot find name 'process'` plus `'import.meta' meta-property is not allowed in files which will build into CommonJS output.` The agent then inspected configuration via `cat package.json && npx tsc --showConfig` and modified both `package.json` and `tsconfig.json` before typechecking again.
