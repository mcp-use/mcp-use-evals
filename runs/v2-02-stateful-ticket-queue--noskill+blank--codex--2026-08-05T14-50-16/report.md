# mcp-use SDK agentic eval — 2026-08-05

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-05T14-50-16` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 511709 / 5925
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main wrong turn came from the generated CommonJS package setup: `npm init -y` produced `"type": "commonjs"`, after which typechecking failed with `TS1470: The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.` The agent then inspected `cat package.json && npx tsc --showConfig`, modified `package.json`, and reran `npx tsc --noEmit`, so the module-format mismatch cost an extra edit/check cycle.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main friction was SDK API discovery in a blank directory: the agent first queried npm with `npm view mcp-use version description repository.url && npm view mcp-use readme --json`, then installed the package and inspected `node_modules/mcp-use/README.md` plus declaration files including `dist/index.d.ts`, `dist/server.d.ts`, `dist/node-http.d.ts`, and `dist/tools.d.ts`. Its targeted search for the startup API, `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts ...`, produced no matching API output, only the later `npm ls zod` tree, so the package’s exported shape required local-package spelunking rather than an immediately useful example.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): SDK discovery took several attempts because both `npm view mcp-use readme | head -200` and the fetched GitHub TypeScript README returned `output:""`. The agent then inspected the published tarball with `npm pack mcp-use --silent` and read `package/README.md`, `package/dist/server.d.ts`, and `package/dist/tools.d.ts`, indicating the package artifacts were the useful API-shape resource.
