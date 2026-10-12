# mcp-use SDK agentic eval — 2026-10-12

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-12T14-14-20` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 2
- `contract.resources`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was choosing a root entry despite the grader expecting `src/server.ts` or `src/index.ts`: the agent said it was using “`the framework’s standard entry-and-views/<name>/view.tsx layout`” and created `index.ts`, while the CLI help only exposed “`--entry <path> Server entry module`” rather than confirming root `index.ts` as the contract location. The agent’s own build reinforced this assumption with “`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`,” so its extensive runtime verification never caught the entry-path mismatch.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The agent spent substantial discovery effort reverse-engineering the SDK from installed declarations and CLI bundles, including `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "views/|bootstrapView|mcp-env|default export|entry" node_modules/@mcp-use/cli`. The initial documentation attempt was unhelpful: `npm view mcp-use@2.0.4 readme --json` returned only npm notices and no README content.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was choosing a root entry file after concluding, `the installed framework confirms the expected convention: index.ts as the default export`. The produced server is indeed `index.ts`, while the grader searched only `src/server.ts` and `src/index.ts`; thus a locally successful `npx mcp-use build --inline` did not expose the contract mismatch. The CLI’s `--entry <path>` option was visible in `npx mcp-use --help`, but the agent neither used it nor added a conventional `src/` entry.
