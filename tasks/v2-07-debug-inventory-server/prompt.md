An MCP inventory server project is already present in your current working directory. It is intended to use the mcp-use TypeScript SDK, but it has behavioral bugs. Diagnose and repair the existing project; do not create a new subdirectory or replace it with an unrelated implementation.

The server must continue to expose MCP over streamable HTTP from `src/server.ts`, listening on the `PORT` environment variable (defaulting to 3000 when unset). It must typecheck with `npx tsc --noEmit` and run with `npx tsx src/server.ts`.

Inventory state is in memory and must persist across calls for the lifetime of the server. It starts with:

- `coffee-mug`: 8 units
- `desk-lamp`: 2 units

The server must expose these four tools with typed schemas:

1. `list_inventory` takes no arguments and returns both seeded SKUs with their current quantities.
2. `get_stock` takes a non-empty string `sku` and returns that SKU's current quantity. For an unknown SKU, it must return text containing the exact phrase `not found` rather than throwing.
3. `reserve_stock` takes `sku` and a positive integer `quantity`. If enough units exist, it decreases shared stock and returns confirmation containing `Reserved <quantity>`. If the SKU is unknown, return text containing `not found`. If there is not enough stock, return text containing `insufficient stock` and leave inventory unchanged. Neither condition may throw.
4. `restock` takes `sku` and a positive integer `quantity`. It increases the same shared inventory state and returns confirmation containing `Restocked <quantity>`. An unknown SKU returns text containing `not found` rather than throwing.

When you are done, typecheck, start the server, and exercise a reserve, an insufficient-stock reserve, a restock, and unknown-SKU handling to verify state and error behavior.
