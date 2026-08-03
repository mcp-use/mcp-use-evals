import { MCPServer } from "mcp-use";
import {
  oauthCustomProvider,
  OAuthError,
  OAuthErrorCode,
  type OAuthAuthInfo,
} from "mcp-use/oauth";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { z } from "zod";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing required env var ${name}`);
  return value;
}

interface CompanyUser {
  id: string;
}

const issuer = env("OAUTH_ISSUER");
const authEndpoint = env("OAUTH_AUTH_ENDPOINT");
const tokenEndpoint = env("OAUTH_TOKEN_ENDPOINT");
const jwksUrl = env("OAUTH_JWKS_URL");
const audience = env("OAUTH_AUDIENCE");

// The company IdP's JWKS, fetched lazily and cached by jose.
const jwks = createRemoteJWKSet(new URL(jwksUrl));

const oauth = oauthCustomProvider<CompanyUser>({
  // RFC 8414 authorization-server metadata, hand-assembled from the env vars
  // the company IdP exposes (there's no vendor-specific discovery helper).
  oauthMetadata: {
    issuer,
    authorization_endpoint: authEndpoint,
    token_endpoint: tokenEndpoint,
    response_types_supported: ["code"],
  },
  // Our own token verifier: check the RS256 signature against the IdP's
  // JWKS and require iss/aud to match this deployment's configuration.
  createTokenVerifier: (resource) => ({
    async verifyAccessToken(token: string) {
      try {
        const { payload } = await jwtVerify(token, jwks, {
          issuer,
          audience,
        });
        const sub = payload.sub;
        if (typeof sub !== "string" || sub.length === 0) {
          throw new Error("token is missing a subject claim");
        }
        return {
          token,
          clientId: typeof payload.aud === "string" ? payload.aud : audience,
          scopes: [],
          expiresAt: payload.exp,
          resource,
          extra: { payload },
        };
      } catch (error) {
        if (error instanceof OAuthError) throw error;
        const message = error instanceof Error ? error.message : String(error);
        throw new OAuthError(OAuthErrorCode.InvalidToken, message);
      }
    },
  }),
  mapAuthInfo: (authInfo: OAuthAuthInfo) => {
    const payload = (authInfo.extra?.["payload"] ?? {}) as Record<
      string,
      unknown
    >;
    const sub = payload["sub"];
    return {
      user: { id: typeof sub === "string" ? sub : authInfo.clientId },
      payload,
      permissions: [],
    };
  },
});

const server = new MCPServer<CompanyUser>({
  name: "custom-idp-server",
  version: "1.0.0",
  description: "Golden solution for the custom company OIDC IdP eval task",
  oauth,
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

// listen() resolves the port from PORT env (default 3000) and serves
// streamable HTTP MCP at /mcp.
await server.listen();
