import { access, readFile, readdir } from "node:fs/promises";
import { createServer, connect } from "node:net";
import { extname, join, relative } from "node:path";
import { MCPClient } from "mcp-use";
import { startOAuthBackend, type OAuthBackend } from "../oauth-backends.js";
import { run, sanitizedEnv, spawnDaemon } from "../proc.js";
import type {
  Expectation,
  Finding,
  LoadedTask,
  ReadinessBudgets,
  ReadinessCheck,
  ReadinessGrade,
  ReadinessPenalty,
  RequiredImport,
  TaskConfig,
} from "../types.js";
import { gradeWithJudge } from "./judge.js";

const DEFAULT_BUDGETS: Required<ReadinessBudgets> = {
  turns: 30,
  costUsd: 1.5,
  durationMs: 300_000,
};

const TASK_DEFAULT_BUDGETS: Record<string, Required<ReadinessBudgets>> = {
  "01-basic-tool-server": {
    turns: 20,
    costUsd: 0.75,
    durationMs: 150_000,
  },
  "02-stateful-notes-server": {
    turns: 25,
    costUsd: 0.95,
    durationMs: 210_000,
  },
  "03-oauth-clerk": {
    turns: 40,
    costUsd: 2.25,
    durationMs: 360_000,
  },
  "04-oauth-custom-idp": {
    turns: 40,
    costUsd: 2.25,
    durationMs: 360_000,
  },
  "05-job-board-context": {
    turns: 30,
    costUsd: 1.15,
    durationMs: 240_000,
  },
};

const FUNCTIONAL_WEIGHTS = {
  compiles: 20,
  starts: 20,
  tools: 30,
  calls: 30,
} as const;
const RESOURCE_WEIGHTS = {
  compiles: 15,
  starts: 15,
  tools: 20,
  resources: 20,
  calls: 30,
} as const;
const AUTH_WEIGHTS = {
  compiles: 15,
  starts: 15,
  auth: 20,
  tools: 25,
  calls: 25,
} as const;
const AUTH_RESOURCE_WEIGHTS = {
  compiles: 10,
  starts: 10,
  auth: 20,
  tools: 20,
  resources: 15,
  calls: 25,
} as const;
const SOURCE_IMPORT_WEIGHTS = {
  compiles: 50,
  imports: 50,
} as const;
type CheckId =
  | keyof typeof FUNCTIONAL_WEIGHTS
  | keyof typeof RESOURCE_WEIGHTS
  | keyof typeof AUTH_WEIGHTS
  | keyof typeof AUTH_RESOURCE_WEIGHTS
  | keyof typeof SOURCE_IMPORT_WEIGHTS;

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

const RESPONSE_HELPERS = [
  "text",
  "object",
  "markdown",
  "error",
  "image",
  "html",
  "xml",
  "json",
  "audio",
];

const DETECTOR_POINTS: Record<string, number> = {
  "raw-sdk-import": 25,
  "sdk-api-not-used": 25,
  "hand-rolled-auth": 20,
  "wrong-oauth-provider": 15,
  "direct-window-openai": 12,
  "create-mcp-server-factory": 10,
  "hand-rolled-jwks-verify": 10,
  "missing-zod-schema": 10,
  "hand-rolled-content-block": 8,
  "no-response-helper-import": 8,
  "judge:error-handling-unreasonable": 8,
  "judge:unclear-tool-descriptions": 8,
};

interface Detector {
  id: string;
  lever: Finding["lever"];
  appliesTo: (task: TaskConfig) => boolean;
  detect: (files: Map<string, string>, task: TaskConfig) => Finding[];
}

const DETECTORS: Detector[] = [
  {
    id: "create-mcp-server-factory",
    lever: "docs",
    appliesTo: () => true,
    detect: (files) =>
      grepFiles(
        files,
        /\bcreateMCPServer\s*\(/,
        (file, line, text) => ({
          detector: "create-mcp-server-factory",
          file,
          line,
          evidence:
            text.trim() ||
            "createMCPServer() used instead of `new MCPServer(...)`",
          lever: "docs",
        })
      ),
  },
  {
    id: "raw-sdk-import",
    lever: "docs",
    appliesTo: () => true,
    detect: (files) =>
      grepFiles(
        files,
        /from\s+["']@modelcontextprotocol\/sdk/,
        (file, line, text) => ({
          detector: "raw-sdk-import",
          file,
          line,
          evidence: text.trim(),
          lever: "docs",
        })
      ),
  },
  {
    id: "hand-rolled-content-block",
    lever: "skill",
    appliesTo: () => true,
    detect: (files) =>
      grepFiles(
        files,
        /content:\s*\[\s*\{[^}]*type:\s*["'](?:text|image)["']/,
        (file, line, text) => ({
          detector: "hand-rolled-content-block",
          file,
          line,
          evidence: text.trim(),
          lever: "skill",
        })
      ),
  },
  {
    id: "direct-window-openai",
    lever: "docs",
    appliesTo: () => true,
    detect: (files) => {
      const findings: Finding[] = [];
      for (const [file, content] of files) {
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (!/\bwindow\.openai\b/.test(lines[i])) continue;
          const trimmed = lines[i].trim();
          if (/^(?:\/\/|\/\*|\*)/.test(trimmed)) continue;
          findings.push({
            detector: "direct-window-openai",
            file,
            line: i + 1,
            evidence: trimmed,
            lever: "docs",
          });
        }
      }
      return findings;
    },
  },
  {
    id: "no-response-helper-import",
    lever: "docs",
    appliesTo: () => true,
    detect: (files) => {
      let registersTools = false;
      let importsHelper = false;
      for (const content of files.values()) {
        if (/\.tool\s*\(/.test(content)) registersTools = true;
        for (const match of content.matchAll(
          /import\s*\{([^}]*)\}\s*from\s*["']mcp-use(?:\/server)?["']/g
        )) {
          const names = match[1]
            .split(",")
            .map((n) => n.trim().split(/\s+as\s+/)[0]);
          if (names.some((n) => RESPONSE_HELPERS.includes(n)))
            importsHelper = true;
        }
      }
      if (registersTools && !importsHelper) {
        return [
          {
            detector: "no-response-helper-import",
            evidence:
              "tools are registered but no response helper (text/object/markdown/...) is imported from mcp-use/server",
            lever: "docs",
          },
        ];
      }
      return [];
    },
  },
  {
    id: "hand-rolled-auth",
    lever: "docs",
    appliesTo: (task) => Boolean(task.oauth),
    detect: (files) => {
      for (const content of files.values()) {
        if (
          /\boauth\s*:/.test(content) ||
          /\boauth\w*(Provider|Proxy)\s*\(/.test(content)
        )
          return [];
      }
      return [
        {
          detector: "hand-rolled-auth",
          evidence:
            "OAuth implemented without the SDK's oauth support (no `oauth:` server config / oauth*Provider factory)",
          lever: "docs",
        },
      ];
    },
  },
  {
    id: "wrong-oauth-provider",
    lever: "docs",
    appliesTo: (task) => Boolean(task.oauth),
    detect: (files, task) => {
      const expected =
        task.oauth!.backend === "clerk"
          ? "oauthClerkProvider"
          : "oauthCustomProvider";
      let usesSdkOauth = false;
      for (const content of files.values()) {
        if (new RegExp(`\\b${expected}\\s*\\(`).test(content)) return [];
        if (
          /\boauth\s*:/.test(content) ||
          /\boauth\w*(Provider|Proxy)\s*\(/.test(content)
        )
          usesSdkOauth = true;
      }
      if (!usesSdkOauth) return [];
      return [
        {
          detector: "wrong-oauth-provider",
          evidence: `SDK oauth config is used, but not via ${expected}() - the documented factory for this task's IdP`,
          lever: "docs",
        },
      ];
    },
  },
  {
    id: "hand-rolled-jwks-verify",
    lever: "docs",
    appliesTo: (task) => task.oauth?.backend === "okta",
    detect: (files) => {
      let usesJoseDirectly = false;
      let usesHelper = false;
      for (const content of files.values()) {
        if (/\bcreateRemoteJWKSet\s*\(/.test(content)) usesJoseDirectly = true;
        if (/\bjwksVerifier\s*\(/.test(content)) usesHelper = true;
      }
      if (usesJoseDirectly && !usesHelper) {
        return [
          {
            detector: "hand-rolled-jwks-verify",
            evidence:
              "token verification wires jose's createRemoteJWKSet directly instead of the SDK's jwksVerifier() helper",
            lever: "docs",
          },
        ];
      }
      return [];
    },
  },
  {
    id: "missing-zod-schema",
    lever: "docs",
    appliesTo: (task) => task.requiresZodSchema,
    detect: (files) => {
      let importsZod = false;
      let usesSchemaKey = false;
      for (const content of files.values()) {
        if (/from\s*["']zod["']/.test(content)) importsZod = true;
        if (/schema\s*:/.test(content)) usesSchemaKey = true;
      }
      if (!importsZod || !usesSchemaKey) {
        return [
          {
            detector: "missing-zod-schema",
            evidence: importsZod
              ? "zod is imported but no `schema:` is passed to a tool definition"
              : "zod is never imported - tool inputs are untyped/unvalidated",
            lever: "docs",
          },
        ];
      }
      return [];
    },
  },
];

export function readinessBudgets(
  task: TaskConfig
): Required<ReadinessBudgets> {
  return {
    ...(TASK_DEFAULT_BUDGETS[task.id] ?? DEFAULT_BUDGETS),
    ...task.readinessBudgets,
  };
}

export async function gradeReadiness(opts: {
  workspace: string;
  task: LoadedTask;
  variant: string;
  transcript: string;
  turns: number | null;
  costUsd: number | null;
  durationMs: number | null;
  judgeModel: string | null;
}): Promise<ReadinessGrade> {
  const config = opts.task.config;
  const functional = await gradeFunctionalReadiness(opts.workspace, config);
  const sources = await collectSourceFiles(opts.workspace);
  const penalties: ReadinessPenalty[] = [];
  const seen = new Set<string>();

  const addPenalty = (penalty: ReadinessPenalty) => {
    if (seen.has(penalty.detector)) return;
    seen.add(penalty.detector);
    penalties.push(penalty);
  };

  for (const finding of detectReadinessFindings(sources, config)) {
    const points = DETECTOR_POINTS[finding.detector];
    if (!points) continue;
    addPenalty({
      detector: finding.detector,
      points,
      lever: finding.lever,
      evidence: finding.evidence,
      file: finding.file,
      line: finding.line,
      source: "deterministic",
    });
  }

  for (const penalty of detectProcessPenalties({
    task: config,
    variant: opts.variant,
    transcript: opts.transcript,
    turns: opts.turns,
    costUsd: opts.costUsd,
    durationMs: opts.durationMs,
  })) {
    addPenalty(penalty);
  }

  const judge = opts.judgeModel
    ? await gradeWithJudge({
        task: opts.task,
        sources,
        transcript: opts.transcript,
        model: opts.judgeModel,
      })
    : null;
  for (const criterion of judge?.criteria ?? []) {
    if (criterion.verdict !== "no") continue;
    addPenalty({
      detector: criterion.detector,
      points: criterion.points,
      lever: criterion.lever,
      evidence: criterion.evidence,
      source: "judge",
    });
  }

  return {
    score: calculateReadinessScore(functional.score, penalties),
    functionalScore: functional.score,
    functionalSuccess: functional.success,
    checks: functional.checks,
    penalties,
    judge,
  };
}

export function emptyReadiness(): ReadinessGrade {
  return {
    score: 0,
    functionalScore: 0,
    functionalSuccess: false,
    checks: [],
    penalties: [],
    judge: null,
  };
}

export async function gradeFunctionalReadiness(
  workspace: string,
  task: TaskConfig
): Promise<{ score: number; success: boolean; checks: ReadinessCheck[] }> {
  if (task.deterministicReadiness?.mode === "source-imports") {
    return gradeSourceImportReadiness(
      workspace,
      task.deterministicReadiness.imports
    );
  }

  const hasResourceChecks =
    (task.expectedResources?.length ?? 0) > 0 ||
    (task.resourceReads?.length ?? 0) > 0;
  const weights: Partial<Record<CheckId, number>> = task.oauth
    ? hasResourceChecks
      ? AUTH_RESOURCE_WEIGHTS
      : AUTH_WEIGHTS
    : hasResourceChecks
      ? RESOURCE_WEIGHTS
      : FUNCTIONAL_WEIGHTS;
  const checkIds = Object.keys(weights) as CheckId[];
  const checks: ReadinessCheck[] = [];
  const fail = (id: CheckId, detail: string) =>
    checks.push({ id, weight: weights[id]!, passed: false, detail });
  const pass = (id: CheckId, detail?: string) =>
    checks.push({ id, weight: weights[id]!, passed: true, detail });

  if (!(await exists(join(workspace, "package.json")))) {
    for (const id of checkIds) fail(id, "no package.json in workspace");
    return finalize(checks);
  }

  if (!(await exists(join(workspace, "node_modules")))) {
    const install = await run(
      "npm",
      ["install", "--no-audit", "--no-fund", "--loglevel=error"],
      {
        cwd: workspace,
        timeoutMs: 5 * 60_000,
      }
    );
    if (install.code !== 0) {
      for (const id of checkIds)
        fail(id, `npm install failed: ${tail(install.stderr)}`);
      return finalize(checks);
    }
  }

  if (!(await exists(join(workspace, "tsconfig.json")))) {
    fail(
      "compiles",
      "no tsconfig.json (contract requires a typechecking TypeScript project)"
    );
  } else {
    const tsc = await run("npx", ["-y", "tsc", "--noEmit"], {
      cwd: workspace,
      timeoutMs: 180_000,
    });
    if (tsc.code === 0) pass("compiles");
    else
      fail(
        "compiles",
        `tsc --noEmit failed:\n${tail(tsc.stdout + tsc.stderr)}`
      );
  }

  const entry = await findEntry(workspace, task.entryCandidates);
  if (!entry) {
    fail(
      "starts",
      `no entry file found (tried: ${task.entryCandidates.join(", ")})`
    );
    if (task.oauth) fail("auth", "server not running");
    fail("tools", "server not running");
    if (hasResourceChecks) fail("resources", "server not running");
    fail("calls", "server not running");
    return finalize(checks);
  }

  const backend: OAuthBackend | null = task.oauth
    ? await startOAuthBackend(task.oauth.backend, await freePort())
    : null;

  const port = await freePort();
  const server = spawnDaemon("npx", ["-y", "tsx", entry], {
    cwd: workspace,
    env: {
      ...sanitizedEnv(),
      PORT: String(port),
      __PORT: String(port),
      NODE_ENV: "production",
      ...(backend ? backend.env : {}),
    },
  });

  let activePort: number | null = null;
  try {
    if (await waitForPort(port, START_TIMEOUT_MS)) {
      activePort = port;
      pass("starts", `entry ${entry}, port ${port} (PORT env respected)`);
    } else if (await waitForPort(3000, 2_000)) {
      activePort = 3000;
      fail(
        "starts",
        `server ignored PORT env (came up on hardcoded :3000). Entry: ${entry}`
      );
    } else {
      fail(
        "starts",
        `server did not come up within ${START_TIMEOUT_MS}ms. Output:\n${tail(server.output())}`
      );
      if (task.oauth) fail("auth", "server not running");
      fail("tools", "server not running");
      if (hasResourceChecks) fail("resources", "server not running");
      fail("calls", "server not running");
      return finalize(checks);
    }

    const token = backend ? await backend.getToken() : null;
    if (task.oauth) {
      const problems: string[] = [];
      const providerProblem = await oauthProviderContractProblem(
        workspace,
        task
      );
      if (providerProblem) problems.push(providerProblem);
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

    const client = new MCPClient({
      mcpServers: {
        sut: {
          url: `http://localhost:${activePort}/mcp`,
          ...(token ? { authToken: token } : {}),
        },
      },
    });
    try {
      await client.createAllSessions();
      const session = client.getSession("sut");
      if (!session)
        throw new Error("no session created for the server under test");
      const tools = (await session.listTools()) as Array<
        Record<string, unknown>
      >;

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
      }
      if (toolProblems.length === 0) pass("tools");
      else fail("tools", toolProblems.join("; "));

      if (hasResourceChecks) {
        const resourceProblems: string[] = [];
        try {
          const listed = (await session.listResources()) as Record<
            string,
            unknown
          >;
          const resources = Array.isArray(listed.resources)
            ? (listed.resources as Array<Record<string, unknown>>)
            : [];
          for (const expected of task.expectedResources ?? []) {
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
          }

          for (const read of task.resourceReads ?? []) {
            const result = (await session.readResource(read.uri)) as Record<
              string,
              unknown
            >;
            const text = flattenResourceResult(result);
            if (!matchExpectation(text, read.expect)) {
              resourceProblems.push(
                `readResource(${read.uri}) -> "${truncate(text, 120)}" did not match ${JSON.stringify(read.expect)}`
              );
            }
          }
        } catch (err) {
          resourceProblems.push(
            `resources/list or resources/read failed: ${truncate(String(err), 300)}`
          );
        }
        if (resourceProblems.length === 0) pass("resources");
        else fail("resources", resourceProblems.join("; "));
      }

      const callProblems: string[] = [];
      for (const call of task.calls) {
        try {
          const result = (await session.callTool(
            call.tool,
            call.args
          )) as Record<string, unknown>;
          const text = flattenCallResult(result);
          if (!matchExpectation(text, call.expect)) {
            callProblems.push(
              `${call.tool}(${JSON.stringify(call.args)}) -> "${truncate(text, 120)}" did not match ${JSON.stringify(call.expect)}`
            );
          }
        } catch (err) {
          callProblems.push(
            `${call.tool}(${JSON.stringify(call.args)}) threw: ${truncate(String(err), 200)}`
          );
        }
      }
      if (callProblems.length === 0) pass("calls");
      else fail("calls", callProblems.join("; "));

      await client.closeAllSessions();
    } catch (err) {
      fail(
        "tools",
        `MCP client could not connect to http://localhost:${activePort}/mcp: ${truncate(String(err), 300)}`
      );
      if (hasResourceChecks) fail("resources", "MCP client could not connect");
      fail("calls", "MCP client could not connect");
    }
  } finally {
    server.stop();
    await backend?.stop();
  }

  return finalize(checks);
}

export async function gradeSourceImportReadiness(
  workspace: string,
  imports: RequiredImport[]
): Promise<{ score: number; success: boolean; checks: ReadinessCheck[] }> {
  const weights = SOURCE_IMPORT_WEIGHTS;
  const checks: ReadinessCheck[] = [];
  const fail = (id: keyof typeof SOURCE_IMPORT_WEIGHTS, detail: string) =>
    checks.push({ id, weight: weights[id], passed: false, detail });
  const pass = (id: keyof typeof SOURCE_IMPORT_WEIGHTS, detail?: string) =>
    checks.push({ id, weight: weights[id], passed: true, detail });

  if (await exists(join(workspace, "package.json"))) {
    if (!(await exists(join(workspace, "node_modules")))) {
      const install = await run(
        "npm",
        ["install", "--no-audit", "--no-fund", "--loglevel=error"],
        {
          cwd: workspace,
          timeoutMs: 5 * 60_000,
        }
      );
      if (install.code !== 0) {
        fail("compiles", `npm install failed: ${tail(install.stderr)}`);
      }
    }

    if (!checks.some((c) => c.id === "compiles")) {
      if (!(await exists(join(workspace, "tsconfig.json")))) {
        fail(
          "compiles",
          "no tsconfig.json (contract requires a typechecking TypeScript project)"
        );
      } else {
        const tsc = await run("npx", ["-y", "tsc", "--noEmit"], {
          cwd: workspace,
          timeoutMs: 180_000,
        });
        if (tsc.code === 0) pass("compiles");
        else
          fail(
            "compiles",
            `tsc --noEmit failed:\n${tail(tsc.stdout + tsc.stderr)}`
          );
      }
    }
  } else {
    fail("compiles", "no package.json in workspace");
  }

  const sources = await collectSourceFiles(workspace);
  const importProblems = requiredImportProblems(sources, imports);
  if (importProblems.length === 0) {
    pass(
      "imports",
      `found required imports: ${imports.map((i) => i.source).join(", ")}`
    );
  } else {
    fail("imports", importProblems.join("; "));
  }

  return finalize(checks);
}

export function detectReadinessFindings(
  files: Map<string, string>,
  task: TaskConfig
): Finding[] {
  const findings: Finding[] = [];
  for (const detector of DETECTORS) {
    if (!detector.appliesTo(task)) continue;
    findings.push(...detector.detect(files, task));
  }
  return findings;
}

export function calculateReadinessScore(
  functionalScore: number,
  penalties: ReadinessPenalty[]
): number {
  const penaltyScore = Math.max(
    0,
    100 - penalties.reduce((sum, p) => sum + p.points, 0)
  );
  return Math.min(functionalScore, penaltyScore);
}

export function detectProcessPenalties(opts: {
  task: TaskConfig;
  variant: string;
  transcript: string;
  turns: number | null;
  costUsd: number | null;
  durationMs: number | null;
}): ReadinessPenalty[] {
  const penalties: ReadinessPenalty[] = [];
  const transcript = opts.transcript.trim();
  const lower = transcript.toLowerCase();

  if (transcript) {
    if (packageExportConfusing(transcript)) {
      penalties.push({
        detector: "package-export-confusing",
        points: 10,
        lever: "sdk",
        evidence:
          "package export probing failed while the agent was trying to discover SDK usage",
        source: "deterministic",
      });
    }

    if (publicApiNotObvious(transcript)) {
      penalties.push({
        detector: "public-api-not-obvious",
        points: 15,
        lever: "docs",
        evidence:
          "agent inspected installed internals before finding a core mcp-use server API",
        source: "deterministic",
      });
    }

    if (deepTypeSpelunking(transcript)) {
      penalties.push({
        detector: "deep-type-spelunking",
        points: 10,
        lever: "docs",
        evidence:
          "agent grepped/read large generated declaration or dist files to learn basic SDK usage",
        source: "deterministic",
      });
    }

    if (docsSkillMiss(opts.variant, transcript)) {
      penalties.push({
        detector: "docs-skill-miss",
        points: 12,
        lever: opts.variant.startsWith("skill+") ? "skill" : "docs",
        evidence:
          "skill/scaffold/docs were present but did not expose the golden path clearly enough",
        source: "deterministic",
      });
    }

    if (inventedApiRepair(transcript)) {
      penalties.push({
        detector: "invented-api-repair",
        points: 15,
        lever: "sdk",
        evidence:
          "agent attempted a nonexistent mcp-use API and repaired after compiler/runtime feedback",
        source: "deterministic",
      });
    }

    if (compileRepairLoop(transcript)) {
      penalties.push({
        detector: "compile-repair-loop",
        points: 10,
        lever: "process",
        evidence: "multiple failed typecheck/build attempts occurred before success",
        source: "deterministic",
      });
    }

    if (verificationDetour(opts.task, transcript)) {
      penalties.push({
        detector: "verification-detour",
        points: 8,
        lever: "process",
        evidence:
          "agent hand-drove MCP/OAuth verification instead of using the canonical client path",
        source: "deterministic",
      });
    }

    if (!selfVerified(lower)) {
      penalties.push({
        detector: "no-self-verification",
        points: 12,
        lever: "process",
        evidence:
          "transcript contains no typecheck, server start, MCP client, or tool-call verification before finishing",
        source: "deterministic",
      });
    }

    if (scaffoldConfusion(opts.variant, transcript)) {
      penalties.push({
        detector: "scaffold-confusion",
        points: 10,
        lever: "template",
        evidence:
          "agent removed or fought scaffold code because the starter shape obscured the task path",
        source: "deterministic",
      });
    }
  }

  const budgets = readinessBudgets(opts.task);
  if (opts.turns !== null && opts.turns > budgets.turns) {
    penalties.push({
      detector: "budget-overrun",
      points: 5,
      lever: "process",
      evidence: `turns ${opts.turns} exceeded budget ${budgets.turns}`,
      source: "deterministic",
    });
  }
  if (opts.costUsd !== null && opts.costUsd > budgets.costUsd) {
    penalties.push({
      detector: "budget-overrun:cost",
      points: 5,
      lever: "process",
      evidence: `cost $${opts.costUsd.toFixed(2)} exceeded budget $${budgets.costUsd.toFixed(2)}`,
      source: "deterministic",
    });
  }
  if (opts.durationMs !== null && opts.durationMs > budgets.durationMs) {
    penalties.push({
      detector: "budget-overrun:duration",
      points: 5,
      lever: "process",
      evidence: `duration ${opts.durationMs}ms exceeded budget ${budgets.durationMs}ms`,
      source: "deterministic",
    });
  }

  return penalties;
}

function packageExportConfusing(transcript: string): boolean {
  return /ERR_PACKAGE_PATH_NOT_EXPORTED|Package subpath .*not defined by "exports"|not exported by package|No "exports" main defined/i.test(
    transcript
  );
}

function publicApiNotObvious(transcript: string): boolean {
  return (
    /(node_modules\/mcp-use|dist\/src|dist\/|\.d\.ts|declaration file)/i.test(
      transcript
    ) &&
    /(MCPServer|createMCPServer|server\.tool|response helper|text\(\)|object\(\)|mcp-use\/server)/i.test(
      transcript
    ) &&
    /(grep|rg|sed|cat|inspect|looked? through|search)/i.test(transcript)
  );
}

function deepTypeSpelunking(transcript: string): boolean {
  return (
    /(grep|rg|sed|cat).*(dist\/src|node_modules\/mcp-use|\.d\.ts)/is.test(
      transcript
    ) &&
    /(Output too large|declaration file|\.d\.ts|[1-9]\d(?:\.\d+)?KB|large)/i.test(
      transcript
    )
  );
}

function docsSkillMiss(variant: string, transcript: string): boolean {
  if (!variant.startsWith("skill+") && !variant.endsWith("+scaffold"))
    return false;
  return /(skill explicitly documents|despite the skill|docs say|documented.*canonical|couldn't find.*docs|could not find.*docs|skill.*did not)/i.test(
    transcript
  );
}

function inventedApiRepair(transcript: string): boolean {
  return (
    /(createMCPServer|MCPServer|oauth|server\.tool|mcp-use)/i.test(transcript) &&
    /(not assignable to parameter|has no exported member|Property .* does not exist|is not a function|Cannot find name|does not exist on type|TS23\d\d|TS25\d\d)/i.test(
      transcript
    )
  );
}

function compileRepairLoop(transcript: string): boolean {
  const failedChecks = transcript.match(
    /(tsc --noEmit|npm run build|pnpm build|typecheck)[\s\S]{0,700}(\[result ERROR\]|error TS|failed)/gi
  );
  if ((failedChecks?.length ?? 0) >= 2) return true;
  const typeErrors = transcript.match(/error TS\d+:/g);
  return (typeErrors?.length ?? 0) >= 2;
}

function verificationDetour(task: TaskConfig, transcript: string): boolean {
  if (!task.oauth) return false;
  return /(consent POST|get code|authorization-code|authorization code|custom node.*initialize|raw curl|manually.*oauth|manual.*oauth)/i.test(
    transcript
  );
}

function selfVerified(lowerTranscript: string): boolean {
  return /(tsc|typecheck|npm run build|pnpm build|npm test|pnpm test|mcp-use client|listtools|calltool|call tool|server started|list tools|curl .*\/mcp|tsx .*server)/i.test(
    lowerTranscript
  );
}

function scaffoldConfusion(variant: string, transcript: string): boolean {
  if (!variant.endsWith("+scaffold")) return false;
  return /(rm -f index\.ts|removed? .*index\.ts|delete[d]? .*template|old index\.ts|weather demo|fought .*template|scaffold.*wrong|starter.*wrong)/i.test(
    transcript
  );
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
        !matches.some(
          (item) => item.names.has(name) || item.namespace
        )
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

function grepFiles(
  files: Map<string, string>,
  pattern: RegExp,
  toFinding: (file: string, line: number, text: string) => Finding
): Finding[] {
  const findings: Finding[] = [];
  for (const [file, content] of files) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i]))
        findings.push(toFinding(file, i + 1, lines[i]));
    }
    if (pattern.flags.includes("s") || findings.every((f) => f.file !== file)) {
      const multi = content.match(new RegExp(pattern.source, "s"));
      if (multi && !findings.some((f) => f.file === file)) {
        const line = content.slice(0, multi.index ?? 0).split("\n").length;
        findings.push(toFinding(file, line, multi[0].split("\n")[0]));
      }
    }
  }
  return findings;
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

export async function oauthProviderContractProblem(
  workspace: string,
  task: TaskConfig
): Promise<string | null> {
  if (!task.oauth) return null;

  const expectedProvider =
    task.oauth.backend === "clerk"
      ? "oauthClerkProvider"
      : "oauthCustomProvider";
  const sources = await collectSourceFiles(workspace);
  const usesExpectedProvider = [...sources.values()].some((content) =>
    new RegExp(`\\b${expectedProvider}\\s*\\(`).test(content)
  );

  if (usesExpectedProvider) return null;
  return `source does not use ${expectedProvider}(), the required SDK OAuth provider for the ${task.oauth.backend} task`;
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

export function flattenResourceResult(result: Record<string, unknown>): string {
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

function finalize(
  checks: ReadinessCheck[]
): { score: number; success: boolean; checks: ReadinessCheck[] } {
  const score = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);
  return {
    score,
    success: checks.length > 0 && checks.every((c) => c.passed),
    checks,
  };
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
