# mcp-use SDK agentic eval — 2026-08-24

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-24T14-16-08` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/1 |

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 1

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`, while the deterministic grader only tried `src/server.ts, src/index.ts`; the produced source confirms `index.ts` exists and no `src/` entry was created. This was understandable SDK/scaffold friction: the package README explicitly said `Replace its \`index.ts\``, and grepping the installed CLI showed its discovery list included `"index.ts"` alongside `"src/index.ts"`. Local validation therefore passed with `[mcp-use] built index.ts + views`, masking the grader’s narrower entry convention.
