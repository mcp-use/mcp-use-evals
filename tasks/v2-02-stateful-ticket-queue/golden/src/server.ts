import { MCPServer, text } from "mcp-use";
import { z } from "zod";

interface Ticket {
  title: string;
  claimed: boolean;
}

// v2's MCPServer rebuilds a fresh SDK server from its tool registry on every
// request (stateless-per-request architecture), so shared mutable state must
// live at module scope -- above the MCPServer instance -- not as instance
// fields or state recreated inside a tool callback.
const tickets = new Map<string, Ticket>();
let nextId = 1;

const server = new MCPServer({
  name: "stateful-ticket-queue",
  version: "1.0.0",
  description: "Golden solution for the stateful ticket queue eval task",
});

server.tool(
  {
    name: "create_ticket",
    description: "Create a new open support ticket",
    inputSchema: z.object({ title: z.string().describe("Ticket title") }),
  },
  async ({ title }) => {
    const id = String(nextId++);
    tickets.set(id, { title, claimed: false });
    return text(`Created ticket ${id}: "${title}"`);
  }
);

server.tool(
  {
    name: "list_tickets",
    description:
      "List every currently open ticket (not yet closed) and the open count",
    inputSchema: z.object({}),
  },
  async () => {
    const entries = [...tickets.entries()];
    const lines = entries.map(
      ([id, ticket]) =>
        `${id}: ${ticket.title}${ticket.claimed ? " (claimed)" : ""}`
    );
    return text(
      `${entries.length} open ticket(s):\n${lines.join("\n")}`
    );
  }
);

server.tool(
  {
    name: "claim_ticket",
    description: "Mark an open ticket as claimed by id",
    inputSchema: z.object({ id: z.string().describe("Ticket id to claim") }),
  },
  async ({ id }) => {
    const ticket = tickets.get(id);
    if (!ticket) return text(`Ticket ${id} not found`);
    ticket.claimed = true;
    return text(`Ticket ${id} claimed`);
  }
);

server.tool(
  {
    name: "close_ticket",
    description: "Close (remove) a ticket by id",
    inputSchema: z.object({ id: z.string().describe("Ticket id to close") }),
  },
  async ({ id }) => {
    if (!tickets.delete(id)) return text(`Ticket ${id} not found`);
    return text(`Ticket ${id} closed`);
  }
);

// listen() resolves the port from PORT env (default 3000) and serves
// streamable-HTTP MCP at the default base path ("/mcp").
await server.listen();
