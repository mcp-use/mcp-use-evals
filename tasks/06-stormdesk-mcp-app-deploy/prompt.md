I want to build **StormDesk**, an MCP App for a city operations lead coordinating storm response.

Build the project in this current working directory. Put `package.json`, source files, resources, and any config files directly in this workspace; do not create the project in `/tmp`, `$HOME`, or any other separate directory.

The app should help them look at a neighborhood storm plan, choose incidents and staging sites, assign crews, and draft a public update. It should use the mcp-use TypeScript SDK and local mock data.

The main experience should be an interactive widget tool called `plan-storm-response`. It should accept a neighborhood, hazard type, severity, planning window, and priorities, then show a useful operations view with incidents, available crews, recommended assignments, staging sites, blocked roads, supply constraints, risks, and a response timeline. The widget should behave like a real app: remember the operator's choices, let them act on recommended assignments, and keep the model aware of what the operator is looking at so follow-up questions make sense.

I also need two plain tools:

- `assign-crew`, which assigns a crew to an incident from a staging site and returns `Assignment confirmed` when it succeeds. Unknown ids or unavailable crews should come back as tool errors.
- `generate-public-update`, which writes a concise resident-facing `public update` for a neighborhood.

Please expose a read-only playbook resource at `stormdesk://playbook` named `stormdesk-playbook`. It should include escalation rules, shelter guidance, crew safety, and public communications guidance.

Use enough seed data to make Harborview flooding work end to end. Include incident `INC-104`, incident `INC-221`, crews `crew-pump-7`, `crew-saw-2`, unavailable crew `crew-med-1`, staging sites `site-civic` and `site-north`, blocked road `Bayfront Ave`, and a sandbag constraint.

When you're done, verify it with the `mcp-use client` CLI locally: list tools/resources, inspect and call `plan-storm-response`, exercise successful and failing `assign-crew` calls, call `generate-public-update`, and read the playbook resource.

If `MCP_USE_API_KEY` is available, use it without printing it and deploy the app to the Manufact Demo Org with the `mcp-use` CLI. Then verify the deployed MCP URL with the client CLI too.

In your final response, include the project path, what you verified locally, and, if deployed, the MCP URL, inspector URL, and remote verification summary. Never print the API key.
