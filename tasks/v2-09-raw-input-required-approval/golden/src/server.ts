import {
  acceptedContent,
  inputRequired,
  inputResponse,
  MCPServer,
} from "mcp-use";
import { z } from "zod";

const approvalSchema = z.object({
  approve: z.boolean(),
  note: z.string().optional(),
});

const server = new MCPServer({
  name: "raw-input-required-approval",
  version: "1.0.0",
});

server.tool(
  {
    name: "request_deploy",
    description: "Request approval before deploying an environment",
    inputSchema: z.object({ environment: z.string() }),
    outputSchema: z.object({
      environment: z.string(),
      deployed: z.boolean(),
      note: z.string().optional(),
    }),
  },
  async ({ environment }, ctx) => {
    const response = inputResponse(ctx.inputResponses, "deployment-approval");
    if (response.kind === "elicit" && response.action !== "accept") {
      return {
        isError: true,
        content: [{ type: "text", text: `Deployment ${response.action}.` }],
      };
    }

    const approval = acceptedContent(
      ctx.inputResponses,
      "deployment-approval",
      approvalSchema
    );
    if (approval === undefined) {
      return inputRequired({
        inputRequests: {
          "deployment-approval": inputRequired.elicit({
            message: `Approve ${environment} deployment?`,
            requestedSchema: approvalSchema,
          }),
        },
      });
    }

    if (!approval.approve) {
      return {
        isError: true,
        content: [{ type: "text", text: "Deployment was not approved." }],
      };
    }

    const result = {
      environment,
      deployed: true,
      ...(approval.note === undefined ? {} : { note: approval.note }),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  }
);

await server.listen();
