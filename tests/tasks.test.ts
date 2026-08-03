import { describe, expect, it } from "vitest";
import { CLERK_SEED, OKTA_SEED } from "../src/oauth-backends.js";
import { listTaskIds, loadTask } from "../src/tasks.js";
import { TaskConfigSchema, parseVariant, variantId } from "../src/types.js";

function validConfig(): Record<string, unknown> {
  return {
    title: "Test task",
    entryCandidates: ["src/server.ts"],
    expectedTools: [{ name: "add", requiredProps: ["a", "b"] }],
    calls: [
      {
        tool: "add",
        args: { a: 2, b: 3 },
        expect: { type: "number-equals", value: 5 },
      },
    ],
  };
}

describe("TaskConfigSchema", () => {
  it("accepts a valid config", () => {
    expect(TaskConfigSchema.safeParse(validConfig()).success).toBe(true);
  });

  it("accepts the optional oauth and variants fields", () => {
    const config = {
      ...validConfig(),
      oauth: {
        backend: "clerk",
        frontendApiUrl: "https://example.clerk.accounts.dev",
      },
      variants: ["skill+scaffold", "noskill+blank"],
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(true);
  });

  it("round-trips supported variants", () => {
    expect(variantId(parseVariant("noskill+blank"))).toBe("noskill+blank");
    expect(variantId(parseVariant("skill+scaffold"))).toBe("skill+scaffold");
  });

  it("rejects removed docs experiment variants", () => {
    expect(() => parseVariant("blank+docs-old")).toThrow('Invalid variant "blank+docs-old"');
    expect(() => parseVariant("blank+docs-new")).toThrow('Invalid variant "blank+docs-new"');
  });

  it("accepts optional resource list and read checks", () => {
    const config = {
      ...validConfig(),
      expectedResources: [{ uri: "app://config", name: "config" }],
      resourceReads: [
        {
          uri: "app://config",
          expect: { type: "contains", value: "enabled" },
        },
      ],
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(true);
  });

  it("accepts optional agent environment key pass-through", () => {
    const config = {
      ...validConfig(),
      agentEnvKeys: ["MCP_USE_API_KEY"],
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(true);
  });

  it("accepts import-based deterministic readiness", () => {
    const config = {
      ...validConfig(),
      deterministicReadiness: {
        mode: "source-imports",
        imports: [
          { source: "mcp-use/server", names: ["MCPServer"] },
          { source: "mcp-use/react" },
        ],
      },
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(true);
  });

  it("rejects an unknown oauth backend", () => {
    const config = { ...validConfig(), oauth: { backend: "auth0" } };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects the removed static bearer-auth contract", () => {
    const config = {
      ...validConfig(),
      auth: { tokenEnv: "MCP_AUTH_TOKEN", token: "secret" },
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects an unknown expectation type instead of silently mis-grading", () => {
    const config = validConfig();
    (config.calls as Array<{ expect: unknown }>)[0].expect = {
      type: "containss",
      value: "5",
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects an expectation whose value type does not match its type", () => {
    const config = validConfig();
    (config.calls as Array<{ expect: unknown }>)[0].expect = {
      type: "number-equals",
      value: "five",
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);

    (config.calls as Array<{ expect: unknown }>)[0].expect = {
      type: "contains",
      value: 5,
    };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects a misspelled variant id instead of silently skipping the task", () => {
    const config = { ...validConfig(), variants: ["skil+blank"] };
    const result = TaskConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (field-name typos)", () => {
    const config = { ...validConfig(), varaints: ["skill+blank"] };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects an empty entryCandidates list", () => {
    const config = { ...validConfig(), entryCandidates: [] };
    expect(TaskConfigSchema.safeParse(config).success).toBe(false);
  });
});

describe("oauth task seeds", () => {
  // task.json call expectations are literals; they must match the identities
  // the backends actually seed, or the calls check can never pass.
  it("whoami expectations match the seeded backend identities", async () => {
    const clerk = await loadTask("v2-04-oauth-clerk");
    expect(JSON.stringify(clerk.config.calls)).toContain(CLERK_SEED.sub);
    const okta = await loadTask("v2-05-oauth-custom-idp");
    expect(JSON.stringify(okta.config.calls)).toContain(OKTA_SEED.sub);
  });
});

describe("loadTask", () => {
  it("loads every checked-in task and stamps the directory name as id", async () => {
    const ids = await listTaskIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const task = await loadTask(id);
      expect(task.config.id).toBe(id);
      expect(task.prompt.length).toBeGreaterThan(0);
      expect(task.promptHash).toMatch(/^[0-9a-f]{12}$/);
    }
  });
});
