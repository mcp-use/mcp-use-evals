Build an MCP (Model Context Protocol) server using the mcp-use TypeScript SDK (the `mcp-use` npm package): an in-memory support-ticket queue.

Build the project directly in your current working directory — do not create a new subdirectory for it.

Requirements:

1. The server must expose exactly these four tools, backed by shared in-memory state (no database, no files):
   - `create_ticket` — string parameter `title`. Creates a new open ticket and returns a confirmation message that includes the ticket's id. Ticket ids must be assigned sequentially as plain integers starting at 1, in the order tickets are created (the first ticket created is id `1`, the second is id `2`, and so on), and must also be accepted back as strings by `claim_ticket`/`close_ticket` (e.g. `"1"`).
   - `list_tickets` — no parameters. Returns the titles of every currently open ticket (tickets that have not been closed yet, whether claimed or not) and the total open count (the count must appear as a number in the response).
   - `claim_ticket` — string parameter `id`. Marks the matching open ticket as claimed and returns a confirmation message that includes the ticket's id. Claiming a ticket must not remove it from `list_tickets`, and calling it again on a ticket that is already claimed must not error.
   - `close_ticket` — string parameter `id`. Removes the matching ticket from the queue entirely and returns a confirmation message that includes the ticket's id.
2. Error contract: when `claim_ticket` or `close_ticket` is called with an id that doesn't match any open ticket, the tool must not throw — it must return a message containing the exact phrase `not found`.
3. State must persist across tool calls for the lifetime of the server process: a ticket created by one call must be visible to later `list_tickets`/`claim_ticket`/`close_ticket` calls, and a closed ticket must no longer appear in later responses.
4. All tool input parameters must be validated with typed schemas.
5. The server must serve MCP over streamable HTTP, listening on the port given by the `PORT` environment variable (defaulting to 3000 when unset).
6. The server entry file must be `src/server.ts` or `index.ts`.
7. The project must be TypeScript: it must typecheck cleanly with `npx tsc --noEmit` and be runnable with `npx tsx <entry-file>`.
8. Install any dependencies you need so the project runs as-is.

When you are done, verify your work: typecheck the project, start the server, and exercise the full ticket lifecycle — create two tickets, list them, claim one, try claiming and closing an unknown id, close a ticket, and list again to confirm the closed ticket is gone and the other remains.
