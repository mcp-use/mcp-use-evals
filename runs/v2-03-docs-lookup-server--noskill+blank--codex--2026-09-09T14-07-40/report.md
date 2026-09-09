# mcp-use SDK agentic eval — 2026-09-09

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-09T14-07-40` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m12s
- Median turns: 12
- Median tool calls: 24
- Median tokens in/out: 614747 / 5695
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main time sink was API discovery: the agent queried npm (`npm view mcp-use version description repository.url`), unpacked the package README (`npm pack mcp-use@2.4.3`), and searched shipped declarations (`rg -n "resource\\(" /tmp/mcp-use-package/package`). This worked, but indicates the blank run required inspecting package internals such as `dist/server.d.ts` and `dist/resources.d.ts` rather than relying on an immediately usable example.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent spent substantial discovery time inspecting the package rather than using a skill or fetched documentation: it ran `npm view mcp-use ...`, packed the npm tarball with `npm pack mcp-use --silent`, read `package/README.md`, and searched declarations with `rg -n "listen\\(|resourceTemplate|basePath" .tmp-mcp-use/package/dist/*.d.ts`. This source-level exploration was useful for API shape, but one chained declaration lookup immediately hit a missing path: `sed: can't read .tmp-mcp-use/package/dist/resources.d.ts` (exit code 2).
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main friction was SDK/API discovery: the agent first queried npm with `npm view mcp-use version description repository.url`, then inspected the installed package using `sed -n '1,240p' node_modules/mcp-use/README.md` and several declaration files including `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. It also grepped for the listener signature with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts`. No skill file was used; the transcript instead shows reliance on packaged README/types, whose README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
