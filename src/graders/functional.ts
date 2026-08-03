import { access, readFile, readdir } from "node:fs/promises";
import { createServer, connect } from "node:net";
import { tmpdir } from "node:os";
import { extname, join, relative } from "node:path";
import {
  Client as OfficialMcpClient,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { MCPClient } from "mcp-use";
import { startOAuthBackend, type OAuthBackend } from "../oauth-backends.js";
import { run, sanitizedEnv, spawnDaemon } from "../proc.js";
import type {
  Expectation,
  FailureCode,
  GradeCheck,
  LoadedTask,
  RequiredImport,
  SdkPath,
  TaskConfig,
  TrialGrade,
} from "../types.js";

/** Reserved for future grading-environment knobs; intentionally empty today. */
export interface GradeEnv {}

const START_TIMEOUT_MS = 30_000;
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".mcp-use",
  ".claude",
  "public",
]);

/**
 * Grade a post-agent workspace against the task's declarative contract
 * (task.json), producing one deterministic, unweighted `TrialGrade`. No
 * scores, no penalties: every check is required and `contractPass` is just
 * "did every check pass". `sdkPath` is a recorded fact about which SDK the
 * source imports from — it never affects `contractPass`.
 */
export async function gradeWorkspace(opts: {
  workspace: string;
  task: LoadedTask;
}): Promise<TrialGrade> {
  const config = opts.task.config;
  const sources = await collectSourceFiles(opts.workspace).catch(
    () => new Map<string, string>()
  );
  const sdkPath = detectSdkPath(sources);

  if (config.deterministicReadiness?.mode === "source-imports") {
    const checks = await gradeSourceImports(
      opts.workspace,
      config.deterministicReadiness.imports,
      sources
    );
    return {
      contractPass: checks.every((c) => c.pass),
      checks,
      failureCode: firstFailureCode(checks),
      sdkPath,
      scoredForPassRate: false,
    };
  }

  const checks = await gradeContract(opts.workspace, config, sources);
  return {
    contractPass: checks.every((c) => c.pass),
    checks,
    failureCode: firstFailureCode(checks),
    sdkPath,
    scoredForPassRate: true,
  };
}

/**
 * The runtime check ladder: install → typecheck → entry → start → [auth] →
 * handshake → tools → [resources] → calls. Stages before "start" that fail
 * hard (install) stop execution entirely; a failed typecheck does NOT stop
 * the ladder (a server can run fine under tsx despite a type error, so we
 * still want to know whether it starts and serves tools). Every check that
 * couldn't run because an earlier stage blocked it is still recorded, with
 * detail `"blocked by <stage>"`, so `checks[]` always has one entry per
 * planned check.
 */
async function gradeContract(
  workspace: string,
  task: TaskConfig,
  sources: Map<string, string>
): Promise<GradeCheck[]> {
  const checks: GradeCheck[] = [];
  const fail = (id: string, detail: string) =>
    checks.push({ id, pass: false, required: true, detail });
  const pass = (id: string, detail: string | null = null) =>
    checks.push({ id, pass: true, required: true, detail });

  const hasResourceChecks =
    (task.expectedResources?.length ?? 0) > 0 ||
    (task.resourceReads?.length ?? 0) > 0 ||
    (task.postCallResourceReads?.length ?? 0) > 0;

  // Full id ladder after "install", in execution order. Used to fill in
  // "blocked by <stage>" checks when an earlier stage stops the ladder.
  const plannedIds: string[] = ["typecheck"];
  if (
    (task.requiredSourcePatterns?.length ?? 0) > 0 ||
    (task.forbiddenSourcePatterns?.length ?? 0) > 0
  ) {
    plannedIds.push("source");
  }
  plannedIds.push("entry");
  if (task.buildCommand) plannedIds.push("build");
  plannedIds.push("start");
  if (task.oauth) plannedIds.push("auth");
  plannedIds.push("handshake", "tools");
  if (task.expectedResources?.length) plannedIds.push("resources");
  for (const [read, n] of withCounts(task.resourceReads ?? [], (r) => r.uri)) {
    plannedIds.push(`resource-read:${read.uri}:${n}`);
  }
  for (const [call, n] of withCounts(task.calls, (c) => c.tool)) {
    plannedIds.push(`call:${call.tool}:${n}`);
  }
  for (const [read, n] of withCounts(
    task.postCallResourceReads ?? [],
    (r) => r.uri
  )) {
    plannedIds.push(`post-call-resource-read:${read.uri}:${n}`);
  }
  for (const [call, n] of withCounts(
    task.inputRequiredCalls ?? [],
    (c) => c.tool
  )) {
    plannedIds.push(`input-required:${call.tool}:${n}`);
  }

  const blockAllPlanned = (reason: string) => {
    for (const id of plannedIds) fail(id, `blocked by ${reason}`);
  };
  const blockAfter = (id: string, reason: string) => {
    const idx = plannedIds.indexOf(id);
    for (let i = idx + 1; i < plannedIds.length; i++) {
      fail(plannedIds[i], `blocked by ${reason}`);
    }
  };

  // ── install ──
  if (!(await exists(join(workspace, "package.json")))) {
    fail("install", "no package.json in workspace");
    blockAllPlanned("install");
    return checks;
  }

  if (!(await exists(join(workspace, "node_modules")))) {
    const install = await run(
      "npm",
      ["install", "--no-audit", "--no-fund", "--loglevel=error"],
      {
        cwd: workspace,
        timeoutMs: 5 * 60_000,
        env: graderNpmEnv(),
      }
    );
    if (install.code !== 0) {
      fail("install", `npm install failed: ${tail(install.stderr)}`);
      blockAllPlanned("install");
      return checks;
    }
  }
  pass("install");

  // ── typecheck (does not block downstream stages) ──
  if (!(await exists(join(workspace, "tsconfig.json")))) {
    fail(
      "typecheck",
      "no tsconfig.json (contract requires a typechecking TypeScript project)"
    );
  } else {
    const tsc = await run("npx", ["-y", "tsc", "--noEmit"], {
      cwd: workspace,
      timeoutMs: 180_000,
    });
    if (tsc.code === 0) pass("typecheck");
    else
      fail(
        "typecheck",
        `tsc --noEmit failed:\n${tail(tsc.stdout + tsc.stderr)}`
      );
  }

  // ── source assertions (do not block runtime checks) ──
  if (plannedIds.includes("source")) {
    const problems = sourceAssertionProblems(
      sources,
      task.requiredSourcePatterns ?? [],
      task.forbiddenSourcePatterns ?? []
    );
    if (problems.length === 0) pass("source");
    else fail("source", problems.join("; "));
  }

  // ── entry ──
  const entry = await findEntry(workspace, task.entryCandidates);
  if (!entry) {
    fail(
      "entry",
      `no entry file found (tried: ${task.entryCandidates.join(", ")})`
    );
    blockAfter("entry", "entry");
    return checks;
  }
  pass("entry", entry);

  // ── optional project build ──
  if (task.buildCommand) {
    const [command, ...args] = interpolateCommand(task.buildCommand, {
      entry,
      port: "0",
    });
    const build = await run(command, args, {
      cwd: workspace,
      timeoutMs: 5 * 60_000,
    });
    if (build.code !== 0) {
      fail(
        "build",
        `${task.buildCommand.join(" ")} failed:\n${tail(build.stdout + build.stderr)}`
      );
      blockAfter("build", "build");
      return checks;
    }
    pass("build");
  }

  // ── start ──
  const backend: OAuthBackend | null = task.oauth
    ? await startOAuthBackend(task.oauth.backend, await freePort())
    : null;
  const port = await freePort();
  const launch = task.startCommand
    ? interpolateCommand(task.startCommand, { entry, port: String(port) })
    : ["npx", "-y", "tsx", entry];
  const [launchCommand, ...launchArgs] = launch;
  const server = spawnDaemon(launchCommand, launchArgs, {
    cwd: workspace,
    env: {
      ...sanitizedEnv(),
      PORT: String(port),
      __PORT: String(port),
      NODE_ENV: "production",
      ...(backend ? backend.env : {}),
    },
  });

  try {
    let activePort: number | null = null;
    if (await waitForPort(port, START_TIMEOUT_MS)) {
      activePort = port;
      pass("start", `entry ${entry}, port ${port} (PORT env respected)`);
    } else if (await waitForPort(3000, 2_000)) {
      activePort = 3000;
      fail(
        "start",
        `server ignored PORT env (came up on hardcoded :3000). Entry: ${entry}`
      );
    } else {
      fail(
        "start",
        `server did not come up within ${START_TIMEOUT_MS}ms. Output:\n${tail(server.output())}`
      );
      blockAfter("start", "start");
      return checks;
    }

    const token = backend ? await backend.getToken() : null;

    // ── auth (OAuth tasks only; does not gate the tools/calls checks below —
    // they run authenticated with the same IdP-issued token regardless) ──
    if (task.oauth) {
      const problems: string[] = [];
      const noToken = await probeMcpStatus(activePort);
      if (noToken !== 401)
        problems.push(
          `request without Authorization header -> HTTP ${noToken ?? "unreachable"} (expected 401)`
        );
      const wrongToken = await probeMcpStatus(
        activePort,
        "definitely-not-a-token-the-idp-issued"
      );
      if (wrongToken !== 401)
        problems.push(
          `request with a wrong bearer token -> HTTP ${wrongToken ?? "unreachable"} (expected 401)`
        );
      const validToken = await probeMcpStatus(activePort, token!);
      if (validToken === 401 || validToken === null)
        problems.push(
          `request with a valid ${task.oauth.backend} token -> ${validToken === null ? "unreachable" : "HTTP 401"} (expected acceptance)`
        );
      if (problems.length === 0)
        pass(
          "auth",
          "401 for missing and wrong bearer token; IdP-issued token accepted"
        );
      else fail("auth", problems.join("; "));
    }

    // ── handshake ──
    const client = new MCPClient({
      mcpServers: {
        sut: {
          url: `http://localhost:${activePort}/mcp`,
          ...(token ? { authToken: token } : {}),
        },
      },
    });
    let session: Awaited<ReturnType<MCPClient["getSession"]>>;
    try {
      await client.createAllSessions();
      session = client.getSession("sut");
      if (!session)
        throw new Error("no session created for the server under test");
      pass("handshake");
    } catch (err) {
      fail(
        "handshake",
        `MCP client could not connect to http://localhost:${activePort}/mcp: ${truncate(String(err), 300)}`
      );
      blockAfter("handshake", "handshake");
      await client.closeAllSessions().catch(() => {});
      return checks;
    }

    // ── tools ──
    let tools: Array<Record<string, unknown>>;
    try {
      tools = (await session.listTools()) as Array<Record<string, unknown>>;
    } catch (err) {
      fail("tools", `listTools failed: ${truncate(String(err), 300)}`);
      blockAfter("tools", "tools");
      await client.closeAllSessions().catch(() => {});
      return checks;
    }
    const toolProblems: string[] = [];
    for (const expected of task.expectedTools) {
      const tool = tools.find((t) => t.name === expected.name);
      if (!tool) {
        toolProblems.push(
          `tool "${expected.name}" not listed (got: ${tools.map((t) => t.name).join(", ") || "none"})`
        );
        continue;
      }
      const props = schemaProps(tool);
      for (const p of expected.requiredProps ?? []) {
        if (!(p in props))
          toolProblems.push(
            `tool "${expected.name}" schema missing property "${p}"`
          );
      }
      if (expected.viewUri) {
        const meta = asRecord(tool._meta);
        const ui = asRecord(meta.ui);
        if (
          ui.resourceUri !== expected.viewUri ||
          meta["ui/resourceUri"] !== expected.viewUri
        ) {
          toolProblems.push(
            `tool "${expected.name}" did not advertise view URI "${expected.viewUri}" in nested and legacy metadata`
          );
        }
      }
    }
    if (task.exactToolNames) {
      const got = tools
        .map((tool) => String(tool.name))
        .sort((a, b) => a.localeCompare(b));
      const wanted = [...task.exactToolNames].sort((a, b) =>
        a.localeCompare(b)
      );
      if (JSON.stringify(got) !== JSON.stringify(wanted)) {
        toolProblems.push(
          `exact tool names were [${got.join(", ")}] (expected [${wanted.join(", ")}])`
        );
      }
    }
    if (toolProblems.length === 0) pass("tools");
    else fail("tools", toolProblems.join("; "));

    // ── resources ──
    if (hasResourceChecks) {
      if (task.expectedResources?.length) {
        try {
          const listed = (await session.listResources()) as Record<
            string,
            unknown
          >;
          const resources = Array.isArray(listed.resources)
            ? (listed.resources as Array<Record<string, unknown>>)
            : [];
          const resourceProblems: string[] = [];
          for (const expected of task.expectedResources) {
            const resource = resources.find((r) => r.uri === expected.uri);
            if (!resource) {
              resourceProblems.push(
                `resource "${expected.uri}" not listed (got: ${resources.map((r) => r.uri).join(", ") || "none"})`
              );
              continue;
            }
            if (expected.name && resource.name !== expected.name) {
              resourceProblems.push(
                `resource "${expected.uri}" name was "${String(resource.name)}" (expected "${expected.name}")`
              );
            }
            if (
              expected.mimeType &&
              resource.mimeType !== expected.mimeType
            ) {
              resourceProblems.push(
                `resource "${expected.uri}" mimeType was "${String(resource.mimeType)}" (expected "${expected.mimeType}")`
              );
            }
          }
          if (resourceProblems.length === 0) pass("resources");
          else fail("resources", resourceProblems.join("; "));
        } catch (err) {
          fail(
            "resources",
            `resources/list failed: ${truncate(String(err), 300)}`
          );
        }
      }

      for (const [read, n] of withCounts(
        task.resourceReads ?? [],
        (r) => r.uri
      )) {
        const id = `resource-read:${read.uri}:${n}`;
        try {
          const result = (await session.readResource(read.uri)) as Record<
            string,
            unknown
          >;
          const text = flattenResourceResult(result);
          if (matchExpectation(text, read.expect)) pass(id);
          else
            fail(
              id,
              `readResource(${read.uri}) -> "${truncate(text, 120)}" did not match ${JSON.stringify(read.expect)}`
            );
        } catch (err) {
          fail(
            id,
            `resources/read(${read.uri}) failed: ${truncate(String(err), 300)}`
          );
        }
      }
    }

    // ── calls ──
    for (const [call, n] of withCounts(task.calls, (c) => c.tool)) {
      const id = `call:${call.tool}:${n}`;
      try {
        const result = (await session.callTool(
          call.tool,
          call.args
        )) as Record<string, unknown>;
        const text = flattenCallResult(result);
        const expectationPass = matchExpectation(text, call.expect);
        const errorPass =
          call.isError === undefined ||
          (result.isError === true) === call.isError;
        const resultMeta = asRecord(result._meta);
        const resultUi = asRecord(resultMeta.ui);
        const viewPass =
          call.viewUri === undefined ||
          (resultUi.resourceUri === call.viewUri &&
            resultMeta["ui/resourceUri"] === call.viewUri);
        if (expectationPass && errorPass && viewPass) pass(id);
        else
          fail(
            id,
            `${call.tool}(${JSON.stringify(call.args)}) -> "${truncate(text, 120)}" did not match ${JSON.stringify(call.expect)}${errorPass ? "" : `; isError was ${String(result.isError)} (expected ${String(call.isError)})`}${viewPass ? "" : `; result did not advertise view URI ${JSON.stringify(call.viewUri)}`}`
          );
      } catch (err) {
        fail(id, `${call.tool}(${JSON.stringify(call.args)}) threw: ${truncate(String(err), 200)}`);
      }
    }

    // ── resource reads after state-changing calls ──
    for (const [read, n] of withCounts(
      task.postCallResourceReads ?? [],
      (r) => r.uri
    )) {
      const id = `post-call-resource-read:${read.uri}:${n}`;
      try {
        const result = (await session.readResource(read.uri)) as Record<
          string,
          unknown
        >;
        const text = flattenResourceResult(result);
        if (matchExpectation(text, read.expect)) pass(id);
        else
          fail(
            id,
            `readResource(${read.uri}) after calls -> "${truncate(text, 120)}" did not match ${JSON.stringify(read.expect)}`
          );
      } catch (err) {
        fail(
          id,
          `resources/read(${read.uri}) after calls failed: ${truncate(String(err), 300)}`
        );
      }
    }

    // ── raw input_required round trips ──
    if ((task.inputRequiredCalls?.length ?? 0) > 0) {
      const officialClient = new OfficialMcpClient(
        { name: "mcp-use-evals-input-required", version: "1.0.0" },
        {
          capabilities: { elicitation: { form: {}, url: {} } },
          versionNegotiation: { mode: { pin: "2026-07-28" } },
          inputRequired: { autoFulfill: false },
        }
      );
      try {
        await officialClient.connect(
          new StreamableHTTPClientTransport(
            new URL(`http://localhost:${activePort}/mcp`)
          )
        );
        for (const [call, n] of withCounts(
          task.inputRequiredCalls ?? [],
          (c) => c.tool
        )) {
          const id = `input-required:${call.tool}:${n}`;
          try {
            const initial = (await officialClient.callTool(
              { name: call.tool, arguments: call.args },
              { allowInputRequired: true }
            )) as Record<string, unknown>;
            const inputRequests = asRecord(initial.inputRequests);
            const inputRequest = asRecord(inputRequests[call.key]);
            const inputRequestParams = asRecord(inputRequest.params);
            const schema = asRecord(inputRequestParams.requestedSchema);
            const properties = asRecord(schema.properties);
            const requestProblems: string[] = [];
            if (Object.keys(inputRequests).length === 0)
              requestProblems.push("initial result was not input_required");
            if (inputRequestParams.message !== call.message)
              requestProblems.push(
                `message was ${JSON.stringify(inputRequestParams.message)} (expected ${JSON.stringify(call.message)})`
              );
            for (const prop of call.requiredSchemaProps ?? []) {
              if (!(prop in properties))
                requestProblems.push(
                  `requested schema missing property "${prop}"`
                );
            }

            const retried = (await officialClient.callTool(
              {
                name: call.tool,
                arguments: call.args,
                inputResponses: { [call.key]: call.response },
                ...(typeof initial.requestState === "string"
                  ? { requestState: initial.requestState }
                  : {}),
              } as never,
              { allowInputRequired: true }
            )) as Record<string, unknown>;
            const finalText = flattenCallResult(retried);
            if (!matchExpectation(finalText, call.expect)) {
              requestProblems.push(
                `final result "${truncate(finalText, 120)}" did not match ${JSON.stringify(call.expect)}`
              );
            }
            if (
              call.isError !== undefined &&
              (retried.isError === true) !== call.isError
            ) {
              requestProblems.push(
                `final isError was ${String(retried.isError)} (expected ${String(call.isError)})`
              );
            }
            if (requestProblems.length === 0) pass(id);
            else fail(id, requestProblems.join("; "));
          } catch (err) {
            fail(id, `input_required flow failed: ${truncate(String(err), 300)}`);
          }
        }
      } catch (err) {
        for (const [call, n] of withCounts(
          task.inputRequiredCalls ?? [],
          (c) => c.tool
        )) {
          fail(
            `input-required:${call.tool}:${n}`,
            `official v2 client could not connect: ${truncate(String(err), 300)}`
          );
        }
      } finally {
        await officialClient.close().catch(() => {});
      }
    }

    await client.closeAllSessions().catch(() => {});
    return checks;
  } finally {
    server.stop();
    await backend?.stop();
  }
}

/**
 * Static-grading contract for open-ended tasks (`deterministicReadiness.mode
 * === "source-imports"`): typecheck + required-import presence only, no
 * runtime server checks. Grade gets `scoredForPassRate: false` upstream.
 */
async function gradeSourceImports(
  workspace: string,
  imports: RequiredImport[],
  sources: Map<string, string>
): Promise<GradeCheck[]> {
  const checks: GradeCheck[] = [];
  const fail = (id: string, detail: string) =>
    checks.push({ id, pass: false, required: true, detail });
  const pass = (id: string, detail: string | null = null) =>
    checks.push({ id, pass: true, required: true, detail });

  if (await exists(join(workspace, "package.json"))) {
    if (!(await exists(join(workspace, "node_modules")))) {
      const install = await run(
        "npm",
        ["install", "--no-audit", "--no-fund", "--loglevel=error"],
        {
          cwd: workspace,
          timeoutMs: 5 * 60_000,
          env: graderNpmEnv(),
        }
      );
      if (install.code !== 0) {
        fail("typecheck", `npm install failed: ${tail(install.stderr)}`);
      }
    }
    if (!checks.some((c) => c.id === "typecheck")) {
      if (!(await exists(join(workspace, "tsconfig.json")))) {
        fail(
          "typecheck",
          "no tsconfig.json (contract requires a typechecking TypeScript project)"
        );
      } else {
        const tsc = await run("npx", ["-y", "tsc", "--noEmit"], {
          cwd: workspace,
          timeoutMs: 180_000,
        });
        if (tsc.code === 0) pass("typecheck");
        else
          fail(
            "typecheck",
            `tsc --noEmit failed:\n${tail(tsc.stdout + tsc.stderr)}`
          );
      }
    }
  } else {
    fail("typecheck", "no package.json in workspace");
  }

  const importProblems = requiredImportProblems(sources, imports);
  if (importProblems.length === 0) {
    pass(
      "imports",
      `found required imports: ${imports.map((i) => i.source).join(", ")}`
    );
  } else {
    fail("imports", importProblems.join("; "));
  }

  return checks;
}

function firstFailureCode(checks: GradeCheck[]): FailureCode | null {
  const first = checks.find((c) => !c.pass);
  return first ? failureCodeFor(first.id) : null;
}

function failureCodeFor(id: string): FailureCode {
  if (id === "install") return "contract.install";
  if (id === "typecheck") return "contract.typecheck";
  if (id === "source") return "contract.source";
  if (id === "entry") return "contract.entry";
  if (id === "build") return "contract.build";
  if (id === "start") return "contract.start";
  if (id === "handshake") return "contract.handshake";
  if (id === "tools") return "contract.tools";
  if (
    id === "resources" ||
    id.startsWith("resource-read:") ||
    id.startsWith("post-call-resource-read:")
  )
    return "contract.resources";
  if (id.startsWith("call:") || id.startsWith("input-required:"))
    return "contract.calls";
  if (id === "auth") return "contract.auth";
  if (id === "imports") return "contract.imports";
  throw new Error(`unmapped grade check id "${id}"`);
}

/** Per-key occurrence counter, e.g. duplicate `add` calls become 1, 2, 3. */
function withCounts<T>(
  items: T[],
  keyOf: (item: T) => string
): Array<[T, number]> {
  const counts = new Map<string, number>();
  return items.map((item) => {
    const key = keyOf(item);
    const n = (counts.get(key) ?? 0) + 1;
    counts.set(key, n);
    return [item, n];
  });
}

/** Validate task-owned source provenance checks without constraining file layout. */
export function sourceAssertionProblems(
  files: Map<string, string>,
  required: string[],
  forbidden: string[]
): string[] {
  const problems: string[] = [];
  const entries = [...files.entries()];
  for (const pattern of required) {
    const regex = compileSourcePattern(pattern);
    if (!entries.some(([, content]) => regex.test(content))) {
      problems.push(`required source pattern not found: /${pattern}/`);
    }
  }
  for (const pattern of forbidden) {
    const regex = compileSourcePattern(pattern);
    const match = entries.find(([, content]) => regex.test(content));
    if (match) {
      problems.push(`forbidden source pattern found in ${match[0]}: /${pattern}/`);
    }
  }
  return problems;
}

function compileSourcePattern(pattern: string): RegExp {
  try {
    return new RegExp(pattern, "m");
  } catch (err) {
    throw new Error(`invalid task source pattern ${JSON.stringify(pattern)}: ${String(err)}`);
  }
}

function interpolateCommand(
  command: string[],
  values: { entry: string; port: string }
): string[] {
  return command.map((part) =>
    part.replaceAll("{entry}", values.entry).replaceAll("{port}", values.port)
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function graderNpmEnv(): NodeJS.ProcessEnv {
  return {
    ...sanitizedEnv(),
    npm_config_cache:
      process.env.MCP_USE_EVAL_NPM_CACHE ??
      join(tmpdir(), "mcp-use-evals-npm-cache"),
  };
}

/**
 * Which SDK the agent actually built on, from source imports alone: mcp-use
 * (incl. subpaths) wins, then the raw official SDK, then "hand-rolled" when
 * source exists but uses neither, then "unknown" when there's no source at
 * all. A recorded fact — never affects `contractPass`.
 */
function detectSdkPath(files: Map<string, string>): SdkPath {
  if (files.size === 0) return "unknown";
  const imports = collectSourceImports(files);
  if (
    imports.some(
      (i) => i.source === "mcp-use" || i.source.startsWith("mcp-use/")
    )
  )
    return "mcp-use";
  if (
    imports.some(
      (i) =>
        i.source === "@modelcontextprotocol/sdk" ||
        i.source.startsWith("@modelcontextprotocol/sdk/")
    )
  )
    return "official-sdk";
  return "hand-rolled";
}

interface SourceImport {
  file: string;
  line: number;
  source: string;
  names: Set<string>;
  namespace: boolean;
}

export function requiredImportProblems(
  files: Map<string, string>,
  requirements: RequiredImport[]
): string[] {
  const imports = collectSourceImports(files);
  const problems: string[] = [];

  for (const req of requirements) {
    const matches = imports.filter((item) => item.source === req.source);
    if (matches.length === 0) {
      problems.push(`missing import from "${req.source}"`);
      continue;
    }

    const missingNames = (req.names ?? []).filter(
      (name) =>
        !matches.some((item) => item.names.has(name) || item.namespace)
    );
    if (missingNames.length > 0) {
      const locations = matches
        .map((item) => `${item.file}:${item.line}`)
        .join(", ");
      problems.push(
        `import from "${req.source}" missing named export(s): ${missingNames.join(", ")} (found ${locations})`
      );
    }
  }

  return problems;
}

function collectSourceImports(files: Map<string, string>): SourceImport[] {
  const imports: SourceImport[] = [];
  for (const [file, content] of files) {
    imports.push(...collectEsmImports(file, content));
    imports.push(...collectRequireImports(file, content));
    imports.push(...collectDynamicImports(file, content));
  }
  return imports;
}

function collectEsmImports(file: string, content: string): SourceImport[] {
  const imports: SourceImport[] = [];
  const pattern =
    /import\s+(?:type\s+)?(?:(?<clause>[^;]*?)\s+from\s+)?["'](?<source>[^"']+)["']/g;
  for (const match of content.matchAll(pattern)) {
    const source = match.groups?.source;
    if (!source) continue;
    const clause = match.groups?.clause ?? "";
    const names = new Set<string>();
    const named = clause.match(/\{([\s\S]*?)\}/);
    if (named) {
      for (const raw of named[1].split(",")) {
        const name = raw
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)[0]
          .trim();
        if (name) names.add(name);
      }
    }
    imports.push({
      file,
      line: lineNumber(content, match.index ?? 0),
      source,
      names,
      namespace: /\*\s+as\s+\w+/.test(clause),
    });
  }
  return imports;
}

function collectRequireImports(file: string, content: string): SourceImport[] {
  const imports: SourceImport[] = [];
  const pattern =
    /(?:const|let|var)\s+(?<binding>\{[^}]*\}|\w+)?\s*=?\s*require\(\s*["'](?<source>[^"']+)["']\s*\)/g;
  for (const match of content.matchAll(pattern)) {
    const source = match.groups?.source;
    if (!source) continue;
    const binding = match.groups?.binding ?? "";
    const names = new Set<string>();
    const named = binding.match(/\{([\s\S]*?)\}/);
    if (named) {
      for (const raw of named[1].split(",")) {
        const name = raw.trim().split(/\s*:\s*/)[0].trim();
        if (name) names.add(name);
      }
    }
    imports.push({
      file,
      line: lineNumber(content, match.index ?? 0),
      source,
      names,
      namespace: binding.trim() !== "" && names.size === 0,
    });
  }
  return imports;
}

function collectDynamicImports(file: string, content: string): SourceImport[] {
  const imports: SourceImport[] = [];
  const pattern = /\bimport\(\s*["'](?<source>[^"']+)["']\s*\)/g;
  for (const match of content.matchAll(pattern)) {
    const source = match.groups?.source;
    if (!source) continue;
    imports.push({
      file,
      line: lineNumber(content, match.index ?? 0),
      source,
      names: new Set(),
      namespace: false,
    });
  }
  return imports;
}

function lineNumber(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

export async function collectSourceFiles(
  workspace: string
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  await walk(workspace, workspace, files);
  return files;
}

async function walk(
  root: string,
  dir: string,
  files: Map<string, string>
): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name))
        await walk(root, join(dir, entry.name), files);
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      const path = join(dir, entry.name);
      files.set(relative(root, path), await readFile(path, "utf8"));
    }
  }
}

function schemaProps(tool: Record<string, unknown>): Record<string, unknown> {
  for (const key of ["inputSchema", "input_schema", "parameters"]) {
    const schema = tool[key];
    if (
      schema &&
      typeof schema === "object" &&
      "properties" in (schema as object)
    ) {
      const props = (schema as { properties?: unknown }).properties;
      if (props && typeof props === "object")
        return props as Record<string, unknown>;
    }
  }
  return {};
}

export function flattenCallResult(result: Record<string, unknown>): string {
  const parts: string[] = [];
  if (Array.isArray(result.content)) {
    for (const block of result.content as Array<Record<string, unknown>>) {
      if (block.type === "text" && typeof block.text === "string")
        parts.push(block.text);
    }
  }
  if (result.structuredContent !== undefined)
    parts.push(JSON.stringify(result.structuredContent));
  return parts.join(" ");
}

export function flattenResourceResult(
  result: Record<string, unknown>
): string {
  const parts: string[] = [];
  if (Array.isArray(result.contents)) {
    for (const block of result.contents as Array<Record<string, unknown>>) {
      if (typeof block.text === "string") parts.push(block.text);
      else if (typeof block.blob === "string") parts.push(block.blob);
      else parts.push(JSON.stringify(block));
    }
  }
  return parts.join(" ");
}

export function matchExpectation(text: string, expect: Expectation): boolean {
  if (expect.type === "contains") return text.includes(String(expect.value));
  if (expect.type === "not-contains")
    return !text.includes(String(expect.value));
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  return (matches ?? []).some((m) => Number(m) === Number(expect.value));
}

async function probeMcpStatus(
  port: number,
  token?: string
): Promise<number | null> {
  try {
    const res = await fetch(`http://localhost:${port}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "eval-auth-probe", version: "0.0.0" },
        },
      }),
    });
    await res.body?.cancel();
    return res.status;
  } catch {
    return null;
  }
}

async function findEntry(
  workspace: string,
  candidates: string[]
): Promise<string | null> {
  for (const c of candidates) {
    if (await exists(join(workspace, c))) return c;
  }
  return null;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, () => {
      const address = srv.address();
      if (address && typeof address === "object") {
        const port = address.port;
        srv.close(() => resolve(port));
      } else {
        srv.close(() => reject(new Error("could not allocate port")));
      }
    });
  });
}

async function waitForPort(port: number, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const host of ["127.0.0.1", "::1"]) {
      const up = await new Promise<boolean>((resolve) => {
        const sock = connect({ port, host }, () => {
          sock.destroy();
          resolve(true);
        });
        sock.on("error", () => resolve(false));
        sock.setTimeout(1000, () => {
          sock.destroy();
          resolve(false);
        });
      });
      if (up) return true;
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

function tail(s: string, n = 1500): string {
  const t = s.trim();
  return t.length > n ? `...${t.slice(-n)}` : t;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}...` : s;
}

export async function installedSdkVersion(
  workspace: string
): Promise<string | null> {
  try {
    const pkg = JSON.parse(
      await readFile(
        join(workspace, "node_modules", "mcp-use", "package.json"),
        "utf8"
      )
    );
    return typeof pkg.version === "string" ? pkg.version : null;
  } catch {
    return null;
  }
}
