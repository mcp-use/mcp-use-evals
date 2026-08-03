import { MCPServer } from "mcp-use";
import { startOrderApi } from "./order-api.js";
import { orderSpec } from "./order-spec.js";

const upstream = await startOrderApi();

const server = MCPServer.fromOpenAPI({
  spec: orderSpec,
  baseUrl: upstream.baseUrl,
  tags: ["orders"],
  name: "OpenAPI Order Service",
});

// listen() uses PORT when supplied and otherwise defaults to 3000.
await server.listen();

// Keep the upstream's close function reachable for graceful shutdown hooks in
// embedders; the process exits naturally when the MCP listener is stopped.
void upstream;
