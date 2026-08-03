import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

interface Order {
  id: string;
  sku: string;
  quantity: number;
}

export interface RunningOrderApi {
  baseUrl: string;
  close(): Promise<void>;
}

/** A deterministic upstream used only by this process's generated MCP tools. */
export async function startOrderApi(): Promise<RunningOrderApi> {
  const orders = new Map<string, Order>();
  let nextOrderNumber = 1001;

  const httpServer = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const path = url.pathname;

    if (request.method === "POST" && path === "/api/orders") {
      const body = await readJson(request);
      if (!isCreateOrder(body)) {
        sendJson(response, 400, { error: "sku and integer quantity are required" });
        return;
      }
      const id = `ord-${nextOrderNumber++}`;
      const order = { id, sku: body.sku, quantity: body.quantity };
      orders.set(id, order);
      sendJson(response, 201, { ...order, status: "open" });
      return;
    }

    const id = orderIdFromPath(path);
    if (id && request.method === "GET") {
      const order = orders.get(id);
      if (!order) {
        sendText(response, 404, `Order ${id} not found`);
        return;
      }
      sendJson(response, 200, {
        ...order,
        status: "open",
        ...(url.searchParams.get("include") === "events"
          ? { events: [{ type: "created", orderId: id }] }
          : {}),
      });
      return;
    }

    if (id && request.method === "DELETE") {
      if (!orders.delete(id)) {
        sendText(response, 404, `Order ${id} not found`);
        return;
      }
      sendJson(response, 200, { id, status: "cancelled" });
      return;
    }

    if (request.method === "GET" && path === "/api/internal/audit") {
      sendJson(response, 200, { entries: [] });
      return;
    }

    sendText(response, 404, "not found");
  });

  await listen(httpServer);
  const address = httpServer.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${address.port}/api`,
    close: () => close(httpServer),
  };
}

function orderIdFromPath(path: string): string | null {
  const match = /^\/api\/orders\/([^/]+)$/.exec(path);
  return match ? decodeURIComponent(match[1]!) : null;
}

function isCreateOrder(value: unknown): value is { sku: string; quantity: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { sku?: unknown }).sku === "string" &&
    Number.isInteger((value as { quantity?: unknown }).quantity)
  );
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    return null;
  }
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown
): void {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

function sendText(
  response: ServerResponse,
  status: number,
  text: string
): void {
  response.writeHead(status, { "content-type": "text/plain" });
  response.end(text);
}

function listen(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
