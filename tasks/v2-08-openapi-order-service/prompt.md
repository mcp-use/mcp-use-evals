Build an MCP (Model Context Protocol) server using version `2.0.4` of the mcp-use TypeScript SDK: an OpenAPI-backed order service.

Build the project directly in your current working directory — do not create a new subdirectory for it.

The project must be fully self-contained. Do not call a network service or depend on credentials. Instead, start a small in-process HTTP order API on an ephemeral loopback port, then create the MCP server with `MCPServer.fromOpenAPI()` using a parsed, bundled OpenAPI 3.1 document and that API's URL as `baseUrl`. The HTTP order API and the MCP server must run in the same Node process.

Requirements:

1. The OpenAPI document must declare these four operations:
   - `POST /orders`, operation id `createOrder`, tag `orders`. It accepts a required JSON request body with string `sku` and integer `quantity` fields. Creating the first order must return id `ord-1001`; later orders increment deterministically.
   - `GET /orders/{id}`, operation id `getOrder`, tag `orders`. It accepts required string path parameter `id` and optional string query parameter `include`. For an existing order, return JSON that includes its `sku`; when `include=events`, include an events array.
   - `DELETE /orders/{id}`, operation id `cancelOrder`, tag `orders`. It accepts required string path parameter `id`, removes the order, and returns JSON whose status contains `cancelled`.
   - `GET /internal/audit`, operation id `getAuditLog`, tag `admin`.
2. Generate MCP tools from the OpenAPI document using `MCPServer.fromOpenAPI({ ..., tags: ["orders"] })`. The server must expose exactly `createOrder`, `getOrder`, and `cancelOrder`; it must not expose `getAuditLog`.
3. An unknown order read or cancellation must produce an upstream HTTP 404 response with text containing the exact phrase `not found`. Do not implement these three MCP tools manually.
4. Keep the OpenAPI document bundled in source: do not fetch an OpenAPI document at runtime and do not use external `$ref` values.
5. The MCP server must use streamable HTTP at `/mcp`, listen on the port supplied by `PORT` (defaulting to 3000 when unset), and have entry file `src/server.ts` or `index.ts`.
6. The project must typecheck with `npx tsc --noEmit` and be runnable with `npx tsx src/server.ts`.
7. Install every required dependency. Pin `mcp-use` to exactly `2.0.4`.

When you are done, verify the lifecycle over MCP: create `{ sku: "green-tea", quantity: 2 }`, retrieve `ord-1001` with `include: "events"`, cancel it, then retrieve it again and confirm the result contains `not found`. Also confirm that only the three `orders` tools are listed.
