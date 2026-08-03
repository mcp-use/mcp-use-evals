import { MCPServer } from "mcp-use";
import { oauthClerkProvider } from "mcp-use/oauth/clerk";
import { z } from "zod";

interface ClerkUser {
  id: string;
}

const server = new MCPServer<ClerkUser>({
  name: "clerk-protected-server",
  version: "1.0.0",
  description: "Golden solution for the Clerk-protected server eval task",
  // Verifies bearer JWTs against the Clerk instance's JWKS with an issuer
  // check; the frontend API URL is read from the environment, never hardcoded.
  oauth: oauthClerkProvider({
    frontendApiUrl: process.env.MCP_USE_OAUTH_CLERK_FRONTEND_API_URL!,
  }),
});

server.tool(
  {
    name: "whoami",
    description: "Return the authenticated user's user id",
    inputSchema: z.object({}),
  },
  async (_params, ctx) => ({
    content: [{ type: "text", text: `You are ${ctx.auth.user.id}` }],
  })
);

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

// listen() resolves the port from PORT env (default 3000)
await server.listen();
