import { describe, expect, it } from "vitest";
import { assertAgentAuth, renderTranscript } from "../src/agent.js";

// Events shaped like the Agent SDK's message stream (SDKMessage union):
// assistant/user wrap an API message, result carries run totals.
const EVENTS: Record<string, unknown>[] = [
  {
    type: "system",
    subtype: "init",
    session_id: "s1",
    tools: ["Bash", "Write"],
  },
  {
    type: "assistant",
    message: {
      content: [
        { type: "text", text: "Creating the server entry file." },
        {
          type: "tool_use",
          name: "Write",
          input: { file_path: "src/server.ts" },
        },
      ],
    },
  },
  {
    type: "user",
    message: {
      content: [
        {
          type: "tool_result",
          content: [{ type: "text", text: "File created successfully" }],
        },
      ],
    },
  },
  {
    type: "user",
    message: {
      content: [
        {
          type: "tool_result",
          is_error: true,
          content: "command not found: tsx",
        },
      ],
    },
  },
  {
    type: "result",
    subtype: "success",
    num_turns: 4,
    total_cost_usd: 0.12,
    duration_ms: 30000,
  },
];

const AUTH_ENV_KEYS = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_AUTH_TOKEN",
  "OPENAI_API_KEY",
  "CODEX_API_KEY",
] as const;

function withAuthEnv(
  env: Partial<Record<(typeof AUTH_ENV_KEYS)[number], string>>,
  run: () => void
): void {
  const previous = new Map<string, string | undefined>();
  for (const key of AUTH_ENV_KEYS) {
    previous.set(key, process.env[key]);
    delete process.env[key];
  }
  Object.assign(process.env, env);
  try {
    run();
  } finally {
    for (const key of AUTH_ENV_KEYS) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe("assertAgentAuth", () => {
  it("requires direct Anthropic credentials for claude runs", () => {
    withAuthEnv({}, () => {
      expect(() => assertAgentAuth("claude")).toThrow(
        "claude runs require ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN"
      );
    });

    withAuthEnv({ ANTHROPIC_API_KEY: "sk-ant-test" }, () => {
      expect(() => assertAgentAuth("claude")).not.toThrow();
    });

    withAuthEnv({ ANTHROPIC_AUTH_TOKEN: "token-test" }, () => {
      expect(() => assertAgentAuth("claude")).not.toThrow();
    });
  });

  it("requires direct OpenAI credentials for codex runs", () => {
    withAuthEnv({}, () => {
      expect(() => assertAgentAuth("codex")).toThrow(
        "codex runs require OPENAI_API_KEY or CODEX_API_KEY"
      );
    });

    withAuthEnv({ OPENAI_API_KEY: "sk-openai-test" }, () => {
      expect(() => assertAgentAuth("codex")).not.toThrow();
    });

    withAuthEnv({ CODEX_API_KEY: "codex-test" }, () => {
      expect(() => assertAgentAuth("codex")).not.toThrow();
    });
  });
});

describe("renderTranscript", () => {
  it("condenses SDK events into text, tool calls, results and run totals", () => {
    const md = renderTranscript(EVENTS);
    expect(md).toContain("Creating the server entry file.");
    expect(md).toContain('[tool] Write({"file_path":"src/server.ts"})');
    expect(md).toContain("`[result]` File created successfully");
    expect(md).toContain("`[result ERROR]` command not found: tsx");
    expect(md).toContain("[run result] turns=4 cost=$0.12 duration=30000ms");
  });

  it("surfaces non-success result subtypes and harness notes", () => {
    const md = renderTranscript([
      {
        type: "result",
        subtype: "error_max_turns",
        num_turns: 50,
        total_cost_usd: 1.5,
        duration_ms: 90000,
      },
      { type: "harness", note: "agent timed out after 1200000ms" },
    ]);
    expect(md).toContain("[run result] error_max_turns turns=50");
    expect(md).toContain("[harness] agent timed out after 1200000ms");
  });

  it("ignores message types it does not render", () => {
    expect(
      renderTranscript([
        { type: "system", subtype: "init" },
        { type: "stream_event", event: {} },
      ])
    ).toBe("");
  });

  it("condenses AI SDK harness stream parts", () => {
    const md = renderTranscript([
      { type: "text-delta", text: "Creating " },
      { type: "text-delta", text: "the server." },
      {
        type: "tool-call",
        toolName: "bash",
        input: { command: "pnpm test" },
      },
      {
        type: "tool-result",
        toolName: "bash",
        output: "Tests passed",
      },
      {
        type: "result",
        subtype: "success",
        num_turns: 2,
        duration_ms: 1000,
      },
    ]);
    expect(md).toContain("Creating the server.");
    expect(md).toContain('[tool] bash({"command":"pnpm test"})');
    expect(md).toContain("`[result]` Tests passed");
    expect(md).toContain("[run result] turns=2 duration=1000ms");
  });
});
