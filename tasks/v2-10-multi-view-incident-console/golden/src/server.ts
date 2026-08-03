import { MCPServer } from "mcp-use";
import { z } from "zod";

const incidents = [
  { id: "INC-101", title: "Login latency", severity: "high", owner: "Avery Chen", status: "investigating" },
  { id: "INC-102", title: "Webhook backlog", severity: "medium", owner: "Priya Shah", status: "mitigated" },
] as const;

const incidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.string(),
  owner: z.string(),
  status: z.string(),
});

const server = new MCPServer({
  name: "multi-view-incident-console",
  version: "1.0.0",
  basePath: "/mcp",
});

server.tool(
  {
    name: "list_incidents",
    inputSchema: z.object({}),
    outputSchema: z.object({ incidents: z.array(incidentSchema) }),
    view: { name: "incident-list", description: "Incident list console", prefersBorder: true },
  },
  async () => ({
    content: [{ type: "text", text: "Incidents: INC-101, INC-102" }],
    structuredContent: { incidents: [...incidents] },
  })
);

server.tool(
  {
    name: "get_incident",
    inputSchema: z.object({ id: z.string() }),
    outputSchema: incidentSchema,
    view: { name: "incident-detail", description: "Incident detail console", prefersBorder: true },
  },
  async ({ id }) => {
    const incident = incidents.find((item) => item.id === id) ?? incidents[0];
    return {
      content: [{ type: "text", text: `${incident.id}: ${incident.title}; owner ${incident.owner}` }],
      structuredContent: incident,
    };
  }
);

export default server;
