/**
 * Turns the agent's generated files (path → content, from agent-eval's git-diff
 * capture) into a bundle the deterministic lints can grep over.
 */

export interface SourceFile {
  path: string;
  content: string;
}

export interface SourceBundle {
  /** every file the agent added/modified */
  files: SourceFile[];
  /** code files only (excludes EVAL.ts, tests, vitest config, node_modules) */
  serverFiles: SourceFile[];
  /** all serverFiles concatenated — the grep target */
  combined: string;
  /** parsed package.json, if the agent touched it */
  packageJson?: Record<string, unknown>;
  /** whether mcp-use is imported in code or declared as a dependency */
  importsMcpUse: boolean;
}

const CODE_RE = /\.(ts|tsx|cts|mts|js|cjs|mjs)$/;
const SKIP_RE = /(^|\/)(EVAL\.tsx?|.*\.(test|spec)\.[tj]sx?|vitest\.config\.[tj]s)$/;

export function buildSourceBundle(generatedFiles?: Record<string, string>): SourceBundle {
  const files: SourceFile[] = Object.entries(generatedFiles ?? {}).map(([path, content]) => ({
    path,
    content,
  }));

  const serverFiles = files.filter(
    (f) => CODE_RE.test(f.path) && !SKIP_RE.test(f.path) && !f.path.includes('node_modules'),
  );
  const combined = serverFiles.map((f) => f.content).join('\n');

  let packageJson: Record<string, unknown> | undefined;
  const pkg = files.find((f) => f.path === 'package.json' || f.path.endsWith('/package.json'));
  if (pkg) {
    try {
      packageJson = JSON.parse(pkg.content) as Record<string, unknown>;
    } catch {
      /* malformed package.json — leave undefined */
    }
  }

  const depBlob = packageJson ? JSON.stringify(packageJson) : '';
  const importsMcpUse =
    /from\s+['"]mcp-use(\/[^'"]*)?['"]|require\(\s*['"]mcp-use/.test(combined) ||
    /"mcp-use"\s*:/.test(depBlob);

  return { files, serverFiles, combined, packageJson, importsMcpUse };
}
