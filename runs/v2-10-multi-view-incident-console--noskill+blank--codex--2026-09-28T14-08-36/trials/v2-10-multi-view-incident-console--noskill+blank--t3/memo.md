The decisive wrong turn was placing the entry at repository-root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the agent followed the installed README’s instruction, `Replace its index.ts`, and the build confirmed `built index.ts + views`. This is a scaffold/discovery mismatch: the SDK workflow accepted the root entry, but the grading/runtime convention did not.

The agent leaned heavily on installed-package material rather than a skill file: it inspected `node_modules/mcp-use/README.md`, declaration files such as `node_modules/mcp-use/dist/tools.d.ts`, and grepped CLI internals for `"mcp-env|viewsDir|view\\.tsx|index\\.ts"`. It also consulted command help via `mcp-use build --help` and `mcp-use start --help`; no external docs URL was fetched in the transcript.

Dependency setup cost an extra iteration because Zod 3 conflicted with the SDK dependency: `peer zod@"^4.2.0" from @modelcontextprotocol/ext-apps@1.7.4-pr720.1`, after which the agent modified `package.json` and reran `npm install`.

Verification also hit avoidable tooling friction. The agent assumed `jq` existed, receiving `/bin/bash: line 2: jq: command not found`; piping the CLI into the missing consumer additionally produced an unhandled `Error: write EPIPE`. It then replaced that approach with temporary JSON files and a Node script.

The inline-resource marker check initially reported `"markerFound":false` for both views even though the source contains `data-view="incident-list"` in `views/incident-list/view.tsx` and `data-view="incident-detail"` in `views/incident-detail/view.tsx`. The agent ultimately verified those literals by grepping source rather than demonstrating their literal presence in the generated HTML.

Process cleanup required two attempts: after `kill 514`, `curl` still returned `204`, and `ps` showed `node node_modules/.bin/mcp-use start`; only `kill 527` stopped the listener.