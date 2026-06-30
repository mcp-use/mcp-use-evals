import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HarnessAgent, type HarnessAgentAdapter } from "@ai-sdk/harness/agent";
import { createClaudeCode } from "@ai-sdk/harness-claude-code";
import { createCodex } from "@ai-sdk/harness-codex";
import { createVercelSandbox } from "@ai-sdk/sandbox-vercel";
import { createDockerSandbox } from "./docker-sandbox.js";
import { run } from "./proc.js";
import type { AgentRunInfo } from "./types.js";

const DEFAULT_TIMEOUT_MS = 20 * 60_000;
const BRIDGE_PORT = 4000;
const REMOTE_WORKSPACE_TAR = "/tmp/mcp-use-eval-workspace.tgz";
const REMOTE_RESULT_TAR = "/tmp/mcp-use-eval-result.tgz";

export type AgentRunner = "claude" | "codex";

interface RemoteSandboxSession {
  run(opts: {
    command: string;
    workingDirectory?: string;
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
  }): Promise<{ exitCode: number; stdout: string; stderr: string }>;
  readBinaryFile(opts: {
    path: string;
    abortSignal?: AbortSignal;
  }): Promise<Uint8Array | null>;
  writeBinaryFile(opts: {
    path: string;
    content: Uint8Array;
    abortSignal?: AbortSignal;
  }): Promise<void>;
  writeTextFile(opts: {
    path: string;
    content: string;
    abortSignal?: AbortSignal;
  }): Promise<void>;
}

export function assertAgentAuth(runner: AgentRunner): void {
  if (
    runner === "claude" &&
    !hasAnyEnv("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN")
  ) {
    throw new Error(
      "claude runs require ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN. " +
        "Use `--agent golden` to exercise the graders without an agent."
    );
  }
  if (
    runner === "codex" &&
    !hasAnyEnv("OPENAI_API_KEY", "CODEX_API_KEY")
  ) {
    throw new Error(
      "codex runs require OPENAI_API_KEY or CODEX_API_KEY. " +
        "Use `--agent golden` to exercise the graders without an agent."
    );
  }
}

/**
 * Run a coding agent in an AI SDK harness. The prepared local workspace is
 * copied into the network sandbox before the turn, then synced back so the
 * existing local graders can inspect the agent-authored result.
 */
export async function runHarnessAgent(opts: {
  runner: AgentRunner;
  workspace: string;
  prompt: string;
  model?: string;
  reasoningEffort?: "low" | "medium" | "high";
  timeoutMs?: number;
  /** trial-specific env (e.g. the OAuth task's live IdP config) */
  extraEnv?: Record<string, string>;
}): Promise<AgentRunInfo> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeoutMs);
  const startedAt = Date.now();

  const events: Record<string, unknown>[] = [];
  let remoteSession: RemoteSandboxSession | undefined;
  let remoteWorkDir: string | undefined;
  let syncedWorkspace = false;
  let session:
    | Awaited<ReturnType<InstanceType<typeof HarnessAgent>["createSession"]>>
    | undefined;
  try {
    const harness = (
      opts.runner === "codex"
        ? createCodex({
            model: opts.model,
            reasoningEffort: opts.reasoningEffort,
          })
        : createClaudeCode({
            model: opts.model,
            thinking: "on",
          })
    ) as unknown as HarnessAgentAdapter;
    const agent = new HarnessAgent({
      harness,
      sandbox: createSandboxProvider(timeoutMs),
      permissionMode: "allow-all",
      onSandboxSession: async ({ session, sessionWorkDir, abortSignal }) => {
        remoteSession = session as unknown as RemoteSandboxSession;
        remoteWorkDir = sessionWorkDir;
        await uploadWorkspace({
          localWorkspace: opts.workspace,
          session: remoteSession,
          remoteWorkDir,
          abortSignal,
        });
        if (opts.extraEnv) {
          await writeTrialEnv({
            session: remoteSession,
            remoteWorkDir,
            env: opts.extraEnv,
            abortSignal,
          });
        }
      },
      debug: { enabled: true, level: "warn" },
      onLog: (event) => {
        events.push({ type: "diagnostic", ...event });
      },
    });

    session = await agent.createSession({ abortSignal: abort.signal });
    const result = await agent.stream({
      session,
      prompt: buildPrompt(opts.prompt, opts.extraEnv),
      abortSignal: abort.signal,
    });
    for await (const part of result.stream) {
      events.push(part as unknown as Record<string, unknown>);
    }

    const [usage, steps] = await Promise.all([
      Promise.resolve(result.usage).catch(() => null),
      Promise.resolve(result.steps).catch(() => []),
    ]);
    events.push({
      type: "result",
      subtype: "success",
      duration_ms: Date.now() - startedAt,
      num_turns: Array.isArray(steps) ? steps.length : null,
      total_usage: usage,
    });

    if (remoteSession && remoteWorkDir) {
      await downloadWorkspace({
        localWorkspace: opts.workspace,
        session: remoteSession,
        remoteWorkDir,
        abortSignal: abort.signal,
      });
      syncedWorkspace = true;
    }
  } catch (err) {
    if (
      !abort.signal.aborted &&
      remoteSession &&
      remoteWorkDir &&
      !syncedWorkspace
    ) {
      await downloadWorkspace({
        localWorkspace: opts.workspace,
        session: remoteSession,
        remoteWorkDir,
      })
        .then(() => {
          syncedWorkspace = true;
        })
        .catch((syncErr) => {
          events.push({
            type: "harness",
            note: `failed to sync remote workspace after error: ${String(syncErr)}`,
          });
        });
    }
    if (abort.signal.aborted) {
      events.push({
        type: "harness",
        note: `agent timed out after ${timeoutMs}ms and was aborted`,
      });
    } else {
      events.push({
        type: "harness",
        note: `AI SDK harness error: ${String(err)}`,
      });
    }
  } finally {
    await session?.destroy().catch((err) => {
      events.push({
        type: "harness",
        note: `failed to destroy harness session: ${String(err)}`,
      });
    });
    clearTimeout(timer);
  }

  const result = events.find((e) => e.type === "result");
  return {
    durationMs: numberField(result, "duration_ms"),
    turns: numberField(result, "num_turns"),
    costUsd: null,
    rawJsonl: events.map((e) => JSON.stringify(e)).join("\n"),
    transcriptMd: renderTranscript(events),
  };
}

function createSandboxProvider(timeoutMs: number) {
  const sandbox = process.env.MCP_USE_EVAL_SANDBOX ?? "vercel";
  if (sandbox === "docker") {
    return createDockerSandbox({
      image: process.env.MCP_USE_EVAL_DOCKER_IMAGE,
      ports: [BRIDGE_PORT],
    });
  }
  if (sandbox === "vercel") {
    return createVercelSandbox({
      runtime: "node24",
      ports: [BRIDGE_PORT],
      timeout: timeoutMs + 60_000,
    });
  }
  throw new Error(
    `unknown MCP_USE_EVAL_SANDBOX "${sandbox}" (expected "vercel" or "docker")`
  );
}

function numberField(
  obj: Record<string, unknown> | undefined,
  key: string
): number | null {
  const v = obj?.[key];
  return typeof v === "number" ? v : null;
}

/** Condense agent events into a readable transcript (also fed to the judge). */
export function renderTranscript(events: Record<string, unknown>[]): string {
  if (events.some((e) => isHarnessStreamPart(e))) {
    return renderHarnessStreamTranscript(events);
  }
  const out: string[] = [];
  for (const e of events) {
    if (e.type === "assistant" || e.type === "user") {
      const message = e.message as { content?: unknown } | undefined;
      const content = Array.isArray(message?.content) ? message.content : [];
      for (const block of content as Record<string, unknown>[]) {
        if (
          block.type === "text" &&
          typeof block.text === "string" &&
          block.text.trim()
        ) {
          out.push(block.text.trim());
        } else if (block.type === "tool_use") {
          out.push(
            `\`[tool] ${String(block.name)}(${truncate(JSON.stringify(block.input ?? {}), 300)})\``
          );
        } else if (block.type === "tool_result") {
          const isError = block.is_error === true;
          const text = truncate(
            flattenToolResult(block.content),
            isError ? 500 : 200
          );
          out.push(`\`[result${isError ? " ERROR" : ""}]\` ${text}`);
        }
      }
    } else if (e.type === "result") {
      const status = e.subtype === "success" ? "" : ` ${String(e.subtype)}`;
      out.push(
        `---\n[run result]${status} turns=${e.num_turns ?? "?"} cost=$${e.total_cost_usd ?? "?"} duration=${e.duration_ms ?? "?"}ms`
      );
    } else if (e.type === "harness") {
      out.push(`---\n[harness] ${String(e.note)}`);
    }
  }
  return out.join("\n\n");
}

function renderHarnessStreamTranscript(
  events: Record<string, unknown>[]
): string {
  const out: string[] = [];
  let text = "";
  const flushText = () => {
    const trimmed = text.trim();
    if (trimmed) out.push(trimmed);
    text = "";
  };

  for (const e of events) {
    if (e.type === "text-delta" && typeof e.text === "string") {
      text += e.text;
    } else if (e.type === "tool-call") {
      flushText();
      out.push(
        `\`[tool] ${String(e.toolName)}(${truncate(JSON.stringify(e.input ?? {}), 300)})\``
      );
    } else if (e.type === "tool-result") {
      flushText();
      out.push(`\`[result]\` ${truncate(flattenToolResult(e.output), 200)}`);
    } else if (e.type === "tool-error") {
      flushText();
      out.push(
        `\`[result ERROR]\` ${truncate(flattenToolResult(e.error), 500)}`
      );
    } else if (e.type === "error") {
      flushText();
      out.push(`---\n[harness] ${truncate(flattenToolResult(e.error), 500)}`);
    } else if (e.type === "diagnostic") {
      flushText();
      out.push(`---\n[diagnostic:${String(e.level)}] ${String(e.message)}`);
    } else if (e.type === "result") {
      flushText();
      const status = e.subtype === "success" ? "" : ` ${String(e.subtype)}`;
      out.push(
        `---\n[run result]${status} turns=${e.num_turns ?? "?"} duration=${e.duration_ms ?? "?"}ms`
      );
    } else if (e.type === "harness") {
      flushText();
      out.push(`---\n[harness] ${String(e.note)}`);
    }
  }
  flushText();
  return out.join("\n\n");
}

async function uploadWorkspace(opts: {
  localWorkspace: string;
  session: RemoteSandboxSession;
  remoteWorkDir: string;
  abortSignal?: AbortSignal;
}): Promise<void> {
  const bytes = await createWorkspaceTar(opts.localWorkspace);
  await opts.session.writeBinaryFile({
    path: REMOTE_WORKSPACE_TAR,
    content: bytes,
    abortSignal: opts.abortSignal,
  });
  await checkedRemoteRun(opts.session, {
    command: `mkdir -p ${sh(opts.remoteWorkDir)} && tar -xzf ${sh(REMOTE_WORKSPACE_TAR)} -C ${sh(opts.remoteWorkDir)}`,
    abortSignal: opts.abortSignal,
  });
}

async function downloadWorkspace(opts: {
  localWorkspace: string;
  session: RemoteSandboxSession;
  remoteWorkDir: string;
  abortSignal?: AbortSignal;
}): Promise<void> {
  await checkedRemoteRun(opts.session, {
    command: [
      "tar",
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=dist",
      "--exclude=.mcp-use",
      "--exclude=.env",
      "--exclude=.mcp-use-eval-env.sh",
      "-czf",
      sh(REMOTE_RESULT_TAR),
      "-C",
      sh(opts.remoteWorkDir),
      ".",
    ].join(" "),
    abortSignal: opts.abortSignal,
  });
  const bytes = await opts.session.readBinaryFile({
    path: REMOTE_RESULT_TAR,
    abortSignal: opts.abortSignal,
  });
  if (!bytes) throw new Error("remote workspace archive was not created");

  await rm(opts.localWorkspace, { recursive: true, force: true });
  await mkdir(opts.localWorkspace, { recursive: true });
  await extractWorkspaceTar(opts.localWorkspace, bytes);
}

async function writeTrialEnv(opts: {
  session: RemoteSandboxSession;
  remoteWorkDir: string;
  env: Record<string, string>;
  abortSignal?: AbortSignal;
}): Promise<void> {
  const dotenv = Object.entries(opts.env)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join("\n");
  const exports = Object.entries(opts.env)
    .map(([key, value]) => `export ${key}=${sh(value)}`)
    .join("\n");
  await opts.session.writeTextFile({
    path: `${opts.remoteWorkDir}/.env`,
    content: `${dotenv}\n`,
    abortSignal: opts.abortSignal,
  });
  await opts.session.writeTextFile({
    path: `${opts.remoteWorkDir}/.mcp-use-eval-env.sh`,
    content: `${exports}\n`,
    abortSignal: opts.abortSignal,
  });
}

async function createWorkspaceTar(workspace: string): Promise<Uint8Array> {
  const dir = await mkdtemp(join(tmpdir(), "mcpuse-eval-tar-"));
  const tarPath = join(dir, "workspace.tgz");
  try {
    const res = await run("tar", [
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=dist",
      "--exclude=.env",
      "--exclude=.mcp-use-eval-env.sh",
      "-czf",
      tarPath,
      "-C",
      workspace,
      ".",
    ]);
    if (res.code !== 0) {
      throw new Error(`tar failed: ${res.stderr || res.stdout}`);
    }
    return new Uint8Array(await readFile(tarPath));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function extractWorkspaceTar(
  workspace: string,
  bytes: Uint8Array
): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), "mcpuse-eval-tar-"));
  const tarPath = join(dir, "workspace.tgz");
  try {
    await writeFile(tarPath, bytes);
    const res = await run("tar", ["-xzf", tarPath, "-C", workspace]);
    if (res.code !== 0) {
      throw new Error(`tar extract failed: ${res.stderr || res.stdout}`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function checkedRemoteRun(
  session: RemoteSandboxSession,
  opts: { command: string; abortSignal?: AbortSignal }
): Promise<void> {
  const res = await session.run(opts);
  if (res.exitCode !== 0) {
    throw new Error(
      `remote command failed (${res.exitCode}): ${opts.command}\n${res.stderr || res.stdout}`
    );
  }
}

function buildPrompt(
  prompt: string,
  extraEnv: Record<string, string> | undefined
): string {
  if (!extraEnv || Object.keys(extraEnv).length === 0) return prompt;
  return [
    "Trial-specific environment variables are available in `.env` and `.mcp-use-eval-env.sh` in this workspace.",
    "Source `.mcp-use-eval-env.sh` before commands that need those values.",
    "",
    prompt,
  ].join("\n");
}

function isHarnessStreamPart(e: Record<string, unknown>): boolean {
  return (
    typeof e.type === "string" &&
    [
      "text-delta",
      "tool-call",
      "tool-result",
      "tool-error",
      "finish",
      "finish-step",
      "diagnostic",
    ].includes(e.type)
  );
}

function hasAnyEnv(...keys: string[]): boolean {
  return keys.some((key) => Boolean(process.env[key]));
}

function flattenToolResult(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) =>
        typeof c === "object" && c !== null && "text" in c
          ? String((c as { text: unknown }).text)
          : ""
      )
      .join(" ");
  }
  return JSON.stringify(content ?? "");
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function sh(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
