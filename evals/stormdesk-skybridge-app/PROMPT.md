I want to build **StormDesk**, an MCP App for a city operations lead coordinating storm response.

Please build it with Alpic's Skybridge and local mock data.

The main experience should be an interactive widget tool called `plan-storm-response`. It should accept a neighborhood, hazard type, severity, planning window, and priorities, then show a useful operations view with incidents, available crews, recommended assignments, staging sites, blocked roads, supply constraints, risks, and a response timeline. The widget should remember the operator's choices and make what they are looking at available to the model.

I also need two plain tools:

- `assign-crew`, which assigns a crew to an incident from a staging site and returns `Assignment confirmed` when it succeeds. Unknown ids or unavailable crews should come back as tool errors.
- `generate-public-update`, which writes a concise resident-facing `public update` for a neighborhood.

Please expose a read-only playbook resource at `stormdesk://playbook` named `stormdesk-playbook`. It should include escalation rules, shelter guidance, crew safety, and public communications guidance.

Use enough seed data to make Harborview flooding work end to end. Include incident `INC-104`, incident `INC-221`, crews `crew-pump-7`, `crew-saw-2`, unavailable crew `crew-med-1`, staging sites `site-civic` and `site-north`, blocked road `Bayfront Ave`, and a sandbag constraint.

When you're done, verify it locally with the `mcp-use client` CLI: list tools/resources, inspect and call `plan-storm-response`, exercise successful and failing `assign-crew` calls, call `generate-public-update`, and read the playbook resource.

If an Alpic deploy token is available in the environment, deploy it with the Alpic CLI and verify the deployed MCP URL with the client CLI too.

In your final response, include the project path, what you verified locally, and, if deployed, the MCP URL and remote verification summary.
