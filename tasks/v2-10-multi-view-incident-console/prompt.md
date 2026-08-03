Build a TypeScript MCP Apps server for a small, deterministic incident console with two distinct views.

Register exactly two tools:

- `list_incidents` takes no input and returns structured data for incidents `INC-101` and `INC-102`. Bind it to a view named `incident-list` with description `Incident list console`.
- `get_incident` requires an `id` string and returns structured detail for that incident. Bind it to a different view named `incident-detail` with description `Incident detail console`.

Each tool must declare an output schema and return useful text plus structured content. Create both React MCP Apps views under `views/`. The list view must visibly render incident cards and include the literal marker `data-view="incident-list"`; the detail view must visibly render id, severity, owner, and status and include `data-view="incident-detail"`. Keep the views self-contained and deterministic, with no external assets or APIs.

Default-export the server for the `mcp-use build`/start workflow and respect the supplied runtime port.

Build directly in the current working directory with `mcp-use` version `2.0.4`, React 19, TypeScript, and typed Zod input/output schemas. Install every required dependency. The project must typecheck with `npx tsc --noEmit`; `npx mcp-use build --inline` and `npx mcp-use start` must serve MCP at `/mcp` on `PORT` (default 3000).

When finished, verify that both tools and both `ui://views/<name>.html` resources are listed, each resource is readable as `text/html;profile=mcp-app`, and each successful tool result advertises its own view rather than the other view.
