import { MCPServer } from "mcp-use";
import { z } from "zod";

const inventory = new Map<string, number>([
  ["coffee-mug", 8],
  ["desk-lamp", 2],
]);

const server = new MCPServer({
  name: "debug-inventory-server",
  version: "1.0.0",
});

const result = (message: string) => ({
  content: [{ type: "text" as const, text: message }],
});

server.tool(
  { name: "list_inventory", inputSchema: z.object({}) },
  async () =>
    result(
      [...inventory.entries()]
        .map(([sku, quantity]) => `${sku}: ${quantity}`)
        .join("\n")
    )
);

server.tool(
  { name: "get_stock", inputSchema: z.object({ sku: z.string().min(1) }) },
  async ({ sku }) => {
    const quantity = inventory.get(sku);
    if (quantity === undefined) throw new Error(`SKU ${sku} was not found`);
    return result(`${sku}: ${quantity}`);
  }
);

server.tool(
  {
    name: "reserve_stock",
    inputSchema: z.object({ sku: z.string().min(1), quantity: z.number().int().positive() }),
  },
  async ({ sku, quantity }) => {
    const available = inventory.get(sku);
    if (available === undefined) throw new Error(`SKU ${sku} was not found`);
    if (quantity > available) throw new Error("insufficient stock");

    // BUG: a reservation should decrease stock, not increase it.
    inventory.set(sku, available + quantity);
    return result(`Reserved ${quantity} of ${sku}`);
  }
);

server.tool(
  {
    name: "restock",
    inputSchema: z.object({ sku: z.string().min(1), quantity: z.number().int().positive() }),
  },
  async ({ sku, quantity }) => {
    // BUG: this copy is discarded after the call, so restocks are not shared.
    const localInventory = new Map(inventory);
    const available = localInventory.get(sku);
    if (available === undefined) throw new Error(`SKU ${sku} was not found`);
    localInventory.set(sku, available + quantity);
    return result(`Restocked ${quantity} of ${sku}`);
  }
);

await server.listen();
