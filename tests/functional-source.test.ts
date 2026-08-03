import { describe, expect, it } from "vitest";
import { requiredImportProblems } from "../src/graders/functional.js";

describe("requiredImportProblems", () => {
  it("passes when required module sources are imported", () => {
    const files = new Map([
      [
        "index.ts",
        `
import { MCPServer, text } from "mcp-use/server";
import { McpUseProvider } from "mcp-use/react";
`,
      ],
    ]);

    expect(
      requiredImportProblems(files, [
        { source: "mcp-use/server" },
        { source: "mcp-use/react" },
      ])
    ).toEqual([]);
  });

  it("can require named imports without caring about aliases", () => {
    const files = new Map([
      [
        "index.ts",
        `
import {
  MCPServer as Server,
  text,
} from "mcp-use/server";
`,
      ],
    ]);

    expect(
      requiredImportProblems(files, [
        { source: "mcp-use/server", names: ["MCPServer", "text"] },
      ])
    ).toEqual([]);
  });

  it("treats namespace imports as satisfying named import requirements", () => {
    const files = new Map([
      ["index.ts", 'import * as serverSdk from "mcp-use/server";'],
    ]);

    expect(
      requiredImportProblems(files, [
        { source: "mcp-use/server", names: ["MCPServer"] },
      ])
    ).toEqual([]);
  });

  it("reports missing module sources and missing named exports", () => {
    const files = new Map([
      ["index.ts", 'import { text } from "mcp-use/server";'],
    ]);

    expect(
      requiredImportProblems(files, [
        { source: "mcp-use/server", names: ["MCPServer"] },
        { source: "mcp-use/react" },
      ])
    ).toEqual([
      'import from "mcp-use/server" missing named export(s): MCPServer (found index.ts:1)',
      'missing import from "mcp-use/react"',
    ]);
  });
});
