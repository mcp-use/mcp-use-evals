# mcp-use SDK agentic eval — 2026-08-31

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-31T14-08-17` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `contract.entry`: 3

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entrypoint at repository root: the produced file is `index.ts`, while the deterministic grader searched `src/server.ts` and `src/index.ts`; the agent’s own build output reinforced the mistaken layout with `[mcp-use] built index.ts + views`. The SDK CLI accepting that root entrypoint while the grading/start contract expected `src/` is a significant scaffold/convention papercut.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at root as `index.ts`; the SDK README explicitly said `Replace its \`index.ts\``, and the agent’s node_modules grep found candidates including `index.ts`, but the deterministic contract reported `no entry file found (tried: src/server.ts, src/index.ts)`. Thus the SDK CLI accepted and built it — `[mcp-use] built index.ts + views ...` — while the grader could not discover it.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was choosing a root entry, evidenced by `fileChange({"event":"create","path":"index.ts"})` and the build message `[mcp-use] built index.ts + views`; no `src/server.ts` or `src/index.ts` was created, despite the produced server correctly having `export default server;` in `index.ts`. The agent followed the SDK’s own template rather than the grader’s expected layout: it unpacked `create-mcp-use-app-2.0.5.tgz` and inspected `package/dist/templates/mcp-apps/index.ts`, which likely reinforced the root-entry choice.
