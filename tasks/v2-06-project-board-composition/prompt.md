Build an MCP (Model Context Protocol) server using the mcp-use TypeScript SDK (the `mcp-use` npm package): a small project-issue tracker.

Build the project directly in your current working directory — do not create a new subdirectory for it.

Requirements:

1. The server must expose exactly these three tools, backed by shared in-memory state (no database, no files):
   - `create_issue` — string parameter `title`. Creates a new issue and returns a confirmation that includes the new issue's id.
     - Issue ids are assigned sequentially in creation order, starting at `1`, formatted as a plain string (`"1"`, `"2"`, `"3"`, ...) — not random and not UUIDs.
     - A newly created issue starts unassigned and unresolved (open).
   - `assign_issue` — string parameters `id` and `assignee`. Assigns the issue with that id to the given person and returns a confirmation that includes the assignee's name.
   - `resolve_issue` — string parameter `id`. Marks the issue with that id as resolved. Once resolved, the exact word `resolved` (lowercase) must appear in the tool's response.
2. Error contract: when `assign_issue` or `resolve_issue` is called with an id that doesn't exist, the tool must not throw — it must return a message containing the exact phrase `not found`.
3. In addition to the tools, expose two read-only resources that reflect the *current* state of the same in-memory data (i.e. a tool call's effect must be visible to a resource read that happens afterward):
   - A fixed resource at the URI `board://summary` whose content includes the current number of open (not yet resolved) issues as a plain number.
   - A per-issue resource reachable at URIs of the form `issue://<id>` (substituting the issue's actual id for `<id>`), whose content describes that one issue. If `<id>` doesn't correspond to any existing issue, the resource's content must contain the exact phrase `not found` (same phrasing as the tool error contract above).
4. State must persist across both tool calls and resource reads for the lifetime of the server process: an issue created by one call must be visible to later `assign_issue`/`resolve_issue` calls and to reads of `board://summary` and `issue://<id>`, all from the same shared store.
5. All tool input parameters must be validated with typed schemas.
6. The server must serve MCP over streamable HTTP, listening on the port given by the `PORT` environment variable (defaulting to 3000 when unset).
7. The server entry file must be `src/server.ts` or `index.ts`.
8. The project must be TypeScript: it must typecheck cleanly with `npx tsc --noEmit` and be runnable with `npx tsx <entry-file>`.
9. Install any dependencies you need so the project runs as-is.

When you are done, verify your work: typecheck the project, start the server, and exercise the full lifecycle — read `board://summary` while the tracker is empty, create an issue, assign it, resolve it, read `board://summary` and `issue://<id>` again to confirm they reflect each change, and confirm the not-found cases for both an unknown issue id passed to a tool and an unknown id read via the per-issue resource.
