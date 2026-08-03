import { describe, expect, it } from "vitest";
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

  it("accepts advanced runtime task contracts", () => {
    const config = {
      ...validConfig(),
      exactToolNames: ["add"],
      requiredSourcePatterns: ["MCPServer\\.fromOpenAPI"],
      forbiddenSourcePatterns: ["ctx\\.elicit\\("],
      buildCommand: ["npx", "mcp-use", "build", "--inline"],
      startCommand: ["npx", "mcp-use", "start", "--port", "{port}"],
      expectedTools: [
        {
          name: "add",
          requiredProps: ["a", "b"],
          viewUri: "ui://views/add.html",
        },
      ],
      expectedResources: [
        {
          uri: "ui://views/add.html",
          mimeType: "text/html;profile=mcp-app",
        },
      ],
      calls: [
        {
          tool: "add",
          args: { a: 2, b: 3 },
          expect: { type: "number-equals", value: 5 },
          isError: false,
          viewUri: "ui://views/add.html",
        },
      ],
      postCallResourceReads: [
        {
          uri: "audit://events",
          expect: { type: "contains", value: "allowed" },
        },
      ],
      inputRequiredCalls: [
        {
          tool: "deploy",
          args: { environment: "production" },
          key: "approval",
          message: "Approve?",
          requiredSchemaProps: ["approve"],
          response: { action: "accept", content: { approve: true } },
          expect: { type: "contains", value: "deployed" },
          isError: false,
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

  it("rejects invalid source regexes when loading the task", () => {
    const config = { ...validConfig(), requiredSourcePatterns: ["fromOpenAPI("] };
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
