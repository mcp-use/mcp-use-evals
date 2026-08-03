import type { OpenAPIDocument } from "mcp-use";

/** All references are local and bundled; the generated server never fetches a spec. */
export const orderSpec: OpenAPIDocument = {
  openapi: "3.1.0",
  info: { title: "Local Order Service", version: "1.0.0" },
  paths: {
    "/orders": {
      post: {
        operationId: "createOrder",
        tags: ["orders"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrder" },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/orders/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        operationId: "getOrder",
        tags: ["orders"],
        parameters: [
          { name: "include", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Order" } },
      },
      delete: {
        operationId: "cancelOrder",
        tags: ["orders"],
        responses: { "200": { description: "Cancelled" } },
      },
    },
    "/internal/audit": {
      get: {
        operationId: "getAuditLog",
        tags: ["admin"],
        responses: { "200": { description: "Audit log" } },
      },
    },
  },
  components: {
    schemas: {
      CreateOrder: {
        type: "object",
        additionalProperties: false,
        required: ["sku", "quantity"],
        properties: {
          sku: { type: "string" },
          quantity: { type: "integer" },
        },
      },
    },
  },
};
