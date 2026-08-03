import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gradeWorkspace } from "../src/graders/functional.js";
import type { LoadedTask, RequiredImport, TaskConfig } from "../src/types.js";

// The repo's own installed `typescript` is vendored into fabricated
// workspaces so `tsc --noEmit` runs instantly and offline instead of falling
// back to an `npx` network fetch.
const REPO_TYPESCRIPT = resolve(
  import.meta.dirname,
  "..",
  "node_modules",
  "typescript"
);

const cleanupDirs: string[] = [];
afterEach(async () => {
  await Promise.all(cleanupDirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
});

async function tempWorkspace(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "functional-test-"));
  cleanupDirs.push(dir);
  return dir;
}

/** A workspace with package.json/tsconfig.json/node_modules already in place so `tsc --noEmit` succeeds fast. */
async function typecheckableWorkspace(sourceFiles: Record<string, string>): Promise<string> {
  const dir = await tempWorkspace();
  await mkdir(join(dir, "node_modules", ".bin"), { recursive: true });
  await cp(REPO_TYPESCRIPT, join(dir, "node_modules", "typescript"), {
    recursive: true,
  });
  await symlink(
    join("..", "typescript", "bin", "tsc"),
    join(dir, "node_modules", ".bin", "tsc")
  );
  await writeFile(
    join(dir, "package.json"),
    JSON.stringify({ name: "wk", version: "0.0.0" })
  );
  await writeFile(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        module: "commonjs",
        target: "es2020",
        strict: false,
        noEmit: true,
      },
    })
  );
  for (const [name, content] of Object.entries(sourceFiles)) {
    await writeFile(join(dir, name), content);
  }
  return dir;
}

function sourceImportsTask(imports: RequiredImport[]): LoadedTask {
  const config: TaskConfig = {
    id: "test-task",
    title: "Test",
    entryCandidates: ["index.ts"],
    expectedTools: [],
    calls: [],
    deterministicReadiness: { mode: "source-imports", imports },
  };
  return { config, prompt: "", promptHash: "deadbeef", dir: "/nonexistent" };
}

describe("gradeWorkspace: source-imports mode", () => {
  it("contractPass is true only when every check passes", async () => {
    // The required import is stashed in a comment so the regex-based import
    // scan matches it without tsc trying to actually resolve the module.
    const workspace = await typecheckableWorkspace({
      "index.ts": `// import { MCPServer } from "mcp-use/server";\nexport const ok = true;\n`,
    });
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.checks.map((c) => [c.id, c.pass])).toEqual([
      ["typecheck", true],
      ["imports", true],
    ]);
    expect(grade.contractPass).toBe(true);
    expect(grade.failureCode).toBeNull();
  });

  it("contractPass is false when only one check fails, and reports it", async () => {
    const workspace = await typecheckableWorkspace({
      "index.ts": `export const ok = true;\n`, // no import of mcp-use/server anywhere
    });
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.contractPass).toBe(false);
    expect(grade.checks.find((c) => c.id === "typecheck")?.pass).toBe(true);
    expect(grade.checks.find((c) => c.id === "imports")?.pass).toBe(false);
  });

  it("failureCode is the first failing check, not just any failing check", async () => {
    // No package.json at all: typecheck fails immediately (before imports
    // is even evaluated), so failureCode must point at typecheck.
    const workspace = await tempWorkspace();
    await writeFile(
      join(workspace, "index.ts"),
      `import { MCPServer } from "mcp-use/server";\n`
    );
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.checks.find((c) => c.id === "typecheck")?.pass).toBe(false);
    expect(grade.checks.find((c) => c.id === "imports")?.pass).toBe(true);
    expect(grade.failureCode).toBe("contract.typecheck");
  });

  it("is never scored for the headline pass rate", async () => {
    const workspace = await tempWorkspace();
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.scoredForPassRate).toBe(false);
  });
});

describe("gradeWorkspace: sdkPath detection", () => {
  it("detects mcp-use (including subpaths)", async () => {
    const workspace = await tempWorkspace();
    await writeFile(
      join(workspace, "index.ts"),
      `import { MCPServer } from "mcp-use/server";\n`
    );
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.sdkPath).toBe("mcp-use");
  });

  it("detects the raw official SDK when mcp-use isn't imported", async () => {
    const workspace = await tempWorkspace();
    await writeFile(
      join(workspace, "index.ts"),
      `import { Server } from "@modelcontextprotocol/sdk/server/index.js";\n`
    );
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.sdkPath).toBe("official-sdk");
  });

  it("falls back to hand-rolled when source exists but imports neither SDK", async () => {
    const workspace = await tempWorkspace();
    await writeFile(
      join(workspace, "index.ts"),
      `import express from "express";\n`
    );
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.sdkPath).toBe("hand-rolled");
  });

  it("is unknown when the workspace has no source files at all", async () => {
    const workspace = await tempWorkspace();
    const grade = await gradeWorkspace({
      workspace,
      task: sourceImportsTask([{ source: "mcp-use/server" }]),
    });
    expect(grade.sdkPath).toBe("unknown");
  });
});
