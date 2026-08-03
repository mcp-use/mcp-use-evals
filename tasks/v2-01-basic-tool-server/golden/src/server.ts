import { MCPServer } from "mcp-use";
import { z } from "zod";

const server = new MCPServer({
  name: "basic-tool-server",
  version: "1.0.0",
  description: "Golden solution for the basic tool server eval task",
});

server.tool(
  {
    name: "add",
    description: "Add two numbers and return the sum",
    inputSchema: z.object({
      a: z.number().describe("First addend"),
      b: z.number().describe("Second addend"),
    }),
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  })
);

// listen() resolves the port from an explicit arg, then PORT env, then
// config.port, then defaults to 3000; serves streamable-HTTP MCP at /mcp.
await server.listen();
