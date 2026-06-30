import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, posix } from "node:path";
import type {
  HarnessV1NetworkSandboxSession,
  HarnessV1SandboxProvider,
} from "@ai-sdk/harness";
import {
  extractLines,
  type Experimental_SandboxProcess,
  type Experimental_SandboxSession,
} from "@ai-sdk/provider-utils";
import { run } from "./proc.js";

const DEFAULT_IMAGE = "node:24-bookworm";
const DEFAULT_WORKDIR = "/workspace";
const DOCKER_PROVIDER_ID = "docker-sandbox";

export interface DockerSandboxSettings {
  image?: string;
  ports?: ReadonlyArray<number>;
}

export function createDockerSandbox(
  settings: DockerSandboxSettings = {}
): HarnessV1SandboxProvider {
  return new DockerSandboxProvider(settings);
}

class DockerSandboxProvider implements HarnessV1SandboxProvider {
  readonly specificationVersion = "harness-sandbox-v1" as const;
  readonly providerId = DOCKER_PROVIDER_ID;

  constructor(private readonly settings: DockerSandboxSettings) {}

  createSession = async (options?: {
    sessionId?: string;
    abortSignal?: AbortSignal;
    identity?: string;
    onFirstCreate?: (
      session: Experimental_SandboxSession,
      opts: { abortSignal?: AbortSignal }
    ) => Promise<void>;
  }): Promise<HarnessV1NetworkSandboxSession> => {
    options?.abortSignal?.throwIfAborted();
    const image = this.settings.image ?? DEFAULT_IMAGE;
    const ports = [...(this.settings.ports ?? [])];
    const name = `mcp-use-eval-${sanitizeName(options?.sessionId ?? randomUUID())}`;

    await ensureDockerAvailable();
    await docker(["pull", image], options?.abortSignal);

    const args = [
      "run",
      "--detach",
      "--rm",
      "--init",
      "--name",
      name,
      ...ports.flatMap((port) => ["--publish", `127.0.0.1::${port}`]),
      image,
      "bash",
      "-lc",
      `mkdir -p ${shQuote(DEFAULT_WORKDIR)} && cd ${shQuote(DEFAULT_WORKDIR)} && sleep infinity`,
    ];
    await docker(args, options?.abortSignal);

    try {
      const session = new DockerNetworkSandboxSession({
        container: name,
        ports,
        defaultWorkingDirectory: DEFAULT_WORKDIR,
      });
      if (options?.onFirstCreate) {
        await options.onFirstCreate(session.restricted(), {
          abortSignal: options.abortSignal,
        });
      }
      return session;
    } catch (err) {
      await docker(["rm", "--force", name]).catch(() => {});
      throw err;
    }
  };
}

class DockerSandboxSession implements Experimental_SandboxSession {
  constructor(protected readonly container: string) {}

  get description(): string {
    return [
      `Docker sandbox (container: ${this.container}).`,
      "Filesystem changes persist for the lifetime of the container.",
    ].join("\n");
  }

  async run({
    command,
    workingDirectory,
    env,
    abortSignal,
  }: {
    command: string;
    workingDirectory?: string;
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
  }): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    const result = await dockerExec(
      this.container,
      command,
      { workingDirectory, env },
      abortSignal
    );
    return {
      exitCode: result.code ?? 1,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }

  async spawn({
    command,
    workingDirectory,
    env,
    abortSignal,
  }: {
    command: string;
    workingDirectory?: string;
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
  }): Promise<Experimental_SandboxProcess> {
    abortSignal?.throwIfAborted();
    const child = spawn(
      "docker",
      [
        "exec",
        ...envArgs(env),
        ...(workingDirectory ? ["--workdir", workingDirectory] : []),
        this.container,
        "bash",
        "-lc",
        command,
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );

    const killedByAbort = () => child.kill("SIGTERM");
    abortSignal?.addEventListener("abort", killedByAbort, { once: true });

    return {
      stdout: nodeStreamToWeb(child.stdout),
      stderr: nodeStreamToWeb(child.stderr),
      wait: () =>
        new Promise((resolve, reject) => {
          child.on("error", reject);
          child.on("close", (code) => {
            abortSignal?.removeEventListener("abort", killedByAbort);
            if (abortSignal?.aborted) {
              reject(
                abortSignal.reason ?? new DOMException("Aborted", "AbortError")
              );
              return;
            }
            resolve({ exitCode: code ?? 1 });
          });
        }),
      kill: async () => {
        child.kill("SIGTERM");
      },
    };
  }

  async readFile({
    path,
    abortSignal,
  }: {
    path: string;
    abortSignal?: AbortSignal;
  }): Promise<ReadableStream<Uint8Array> | null> {
    const bytes = await this.readBinaryFile({ path, abortSignal });
    if (bytes == null) return null;
    return bytesToStream(bytes);
  }

  async readBinaryFile({
    path,
    abortSignal,
  }: {
    path: string;
    abortSignal?: AbortSignal;
  }): Promise<Uint8Array | null> {
    const quoted = shQuote(path);
    const result = await dockerExec(
      this.container,
      `if [ -f ${quoted} ]; then base64 -w 0 ${quoted}; elif [ -e ${quoted} ]; then exit 2; else exit 1; fi`,
      {},
      abortSignal
    );
    if (result.code === 1) return null;
    if (result.code !== 0) {
      throw new Error(
        `failed to read ${path} from Docker sandbox: ${result.stderr || result.stdout}`
      );
    }
    return new Uint8Array(Buffer.from(result.stdout, "base64"));
  }

  async readTextFile({
    path,
    encoding = "utf-8",
    startLine,
    endLine,
    abortSignal,
  }: {
    path: string;
    encoding?: string;
    startLine?: number;
    endLine?: number;
    abortSignal?: AbortSignal;
  }): Promise<string | null> {
    const bytes = await this.readBinaryFile({ path, abortSignal });
    if (bytes == null) return null;
    const text = Buffer.from(bytes).toString(encoding as BufferEncoding);
    return extractLines({ text, startLine, endLine });
  }

  async writeFile({
    path,
    content,
    abortSignal,
  }: {
    path: string;
    content: ReadableStream<Uint8Array>;
    abortSignal?: AbortSignal;
  }): Promise<void> {
    const bytes = await collectStream(content);
    await this.writeBinaryFile({ path, content: bytes, abortSignal });
  }

  async writeBinaryFile({
    path,
    content,
    abortSignal,
  }: {
    path: string;
    content: Uint8Array;
    abortSignal?: AbortSignal;
  }): Promise<void> {
    abortSignal?.throwIfAborted();
    const dir = posix.dirname(path);
    if (dir && dir !== "." && dir !== "/") {
      const mkdirResult = await dockerExec(
        this.container,
        `mkdir -p ${shQuote(dir)}`,
        {},
        abortSignal
      );
      if (mkdirResult.code !== 0) {
        throw new Error(`failed to create ${dir}: ${mkdirResult.stderr}`);
      }
    }

    const tmp = await mkdtemp(join(tmpdir(), "mcpuse-docker-copy-"));
    const localFile = join(tmp, basename(path));
    try {
      await writeFile(localFile, content);
      await docker(["cp", localFile, `${this.container}:${path}`], abortSignal);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  }

  async writeTextFile({
    path,
    content,
    encoding = "utf-8",
    abortSignal,
  }: {
    path: string;
    content: string;
    encoding?: string;
    abortSignal?: AbortSignal;
  }): Promise<void> {
    const buffer = Buffer.from(content, encoding as BufferEncoding);
    await this.writeBinaryFile({
      path,
      content: new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length),
      abortSignal,
    });
  }
}

class DockerNetworkSandboxSession
  extends DockerSandboxSession
  implements HarnessV1NetworkSandboxSession
{
  readonly id: string;

  constructor(
    private readonly opts: {
      container: string;
      ports: ReadonlyArray<number>;
      defaultWorkingDirectory: string;
    }
  ) {
    super(opts.container);
    this.id = opts.container;
  }

  get defaultWorkingDirectory(): string {
    return this.opts.defaultWorkingDirectory;
  }

  get ports(): ReadonlyArray<number> {
    return this.opts.ports;
  }

  restricted(): Experimental_SandboxSession {
    return new DockerSandboxSession(this.opts.container);
  }

  getPortUrl = async (options: {
    port: number;
    protocol?: "http" | "https" | "ws";
  }): Promise<string> => {
    if (!this.opts.ports.includes(options.port)) {
      throw new Error(
        `Port ${options.port} is not exposed on Docker sandbox ${this.opts.container}`
      );
    }
    const result = await docker([
      "port",
      this.opts.container,
      `${options.port}/tcp`,
    ]);
    const hostPort = result.stdout.trim().split(":").pop();
    if (!hostPort) {
      throw new Error(`Docker did not report a host port for ${options.port}`);
    }
    const protocol = options.protocol === "ws" ? "ws" : "http";
    return `${protocol}://127.0.0.1:${hostPort}`;
  };

  stop = async (): Promise<void> => {
    await docker(["stop", this.opts.container]).catch(() => {});
  };

  destroy = async (): Promise<void> => {
    await docker(["rm", "--force", this.opts.container]).catch(() => {});
  };
}

async function ensureDockerAvailable(): Promise<void> {
  const result = await run("docker", ["version", "--format", "{{.Server.Version}}"]);
  if (result.code !== 0) {
    throw new Error(
      `Docker is required for MCP_USE_EVAL_SANDBOX=docker: ${result.stderr || result.stdout}`
    );
  }
}

async function docker(
  args: string[],
  abortSignal?: AbortSignal
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  abortSignal?.throwIfAborted();
  const result = await run("docker", args);
  abortSignal?.throwIfAborted();
  if (result.code !== 0) {
    throw new Error(`docker ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  }
  return result;
}

function dockerExec(
  container: string,
  command: string,
  opts: { workingDirectory?: string; env?: Record<string, string> },
  abortSignal?: AbortSignal
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  abortSignal?.throwIfAborted();
  return run("docker", [
    "exec",
    ...envArgs(opts.env),
    ...(opts.workingDirectory ? ["--workdir", opts.workingDirectory] : []),
    container,
    "bash",
    "-lc",
    command,
  ]);
}

function envArgs(env: Record<string, string> | undefined): string[] {
  return Object.entries(env ?? {}).flatMap(([key, value]) => [
    "--env",
    `${key}=${value}`,
  ]);
}

function sanitizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_.-]/g, "-").slice(0, 60);
}

function shQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

async function collectStream(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function bytesToStream(bytes: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

function nodeStreamToWeb(
  stream: NodeJS.ReadableStream | null
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      if (!stream) {
        controller.close();
        return;
      }
      stream.on("data", (chunk: Buffer | string) => {
        controller.enqueue(
          typeof chunk === "string" ? Buffer.from(chunk) : new Uint8Array(chunk)
        );
      });
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });
}
