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
    if (quantity === undefined) return result(`SKU ${sku} not found`);
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
    if (available === undefined) return result(`SKU ${sku} not found`);
    if (quantity > available) return result(`SKU ${sku} has insufficient stock`);

    inventory.set(sku, available - quantity);
    return result(`Reserved ${quantity} of ${sku}`);
  }
);

server.tool(
  {
    name: "restock",
    inputSchema: z.object({ sku: z.string().min(1), quantity: z.number().int().positive() }),
  },
  async ({ sku, quantity }) => {
    const available = inventory.get(sku);
    if (available === undefined) return result(`SKU ${sku} not found`);

    inventory.set(sku, available + quantity);
    return result(`Restocked ${quantity} of ${sku}`);
  }
);

await server.listen();
