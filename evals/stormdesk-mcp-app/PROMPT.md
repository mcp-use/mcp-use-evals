I want to build **StormDesk**, a small MCP server for a city operations lead coordinating storm response.

Use the mcp-use TypeScript SDK with local mock data.

I need three tools and one resource:

- `plan-storm-response` — takes a neighborhood, hazard type, and severity, and returns an operations view: the active incidents, which crews are available, and a recommended crew-to-incident assignment for each.
- `assign-crew` — assigns a crew to an incident from a staging site and returns `Assignment confirmed` on success. Unknown ids or unavailable crews should come back as tool errors.
- `generate-public-update` — writes a short resident-facing `public update` for a neighborhood.
- A read-only playbook resource at `stormdesk://playbook` named `stormdesk-playbook`, covering escalation rules and public communications guidance.

Use enough seed data to make Harborview flooding work end to end: incidents `INC-104` and `INC-221`, crews `crew-pump-7` and `crew-saw-2`, an unavailable crew `crew-med-1`, and staging sites `site-civic` and `site-north`.

When you're done, verify it locally with the `mcp-use client` CLI: list tools and resources, call `plan-storm-response`, exercise a successful and a failing `assign-crew` call, call `generate-public-update`, and read the playbook resource.

In your final response, include the project path and a short summary of what you verified.
