/**
 * Deterministic API-correctness lints over the agent's generated code.
 *
 * These are the v1 findings that are mechanically detectable. They are
 * heuristics (regex over concatenated source) — conservative by design and
 * easy to refine against real runs. Each fired lint becomes a deterministic
 * Finding and deducts from the API-correctness dimension.
 */
import type { Finding, Lever, Severity } from './types.js';
import type { SourceBundle } from './source.js';

export interface LintContext {
  source: SourceBundle;
  scenario: string;
  usesOAuth: boolean;
}

interface Lint {
  id: string;
  title: string;
  lever: Lever;
  severity: Severity;
  /** scenario gate (e.g. OAuth-only lints) */
  applies?: (ctx: LintContext) => boolean;
  detect: (ctx: LintContext) => { fired: boolean; evidence?: string };
}

function firstMatchLine(text: string, re: RegExp): string | undefined {
  for (const line of text.split('\n')) {
    if (re.test(line)) return line.trim().slice(0, 200);
  }
  return undefined;
}

const REGISTERS_TOOLS = /\.tool\s*\(|defineTool|addTool|registerTool|tools\s*:/;
const RESPONSE_HELPER_IMPORT =
  /import\s*\{[^}]*\b(text|object|markdown|json|image|resourceLink|embeddedResource|toolResult)\b[^}]*\}\s*from\s*['"]mcp-use(\/[^'"]*)?['"]/;

export const LINTS: Lint[] = [
  {
    id: 'missing-mcp-use',
    title: 'Did not use the mcp-use SDK',
    lever: 'sdk',
    severity: 'high',
    detect: (ctx) => ({
      fired: !ctx.source.importsMcpUse,
      evidence: 'mcp-use is neither imported in code nor declared as a dependency',
    }),
  },
  {
    id: 'legacy-factory',
    title: 'Used the legacy createMCPServer() factory instead of new MCPServer()',
    lever: 'sdk',
    severity: 'medium',
    detect: (ctx) => {
      const line = firstMatchLine(ctx.source.combined, /\bcreateMCPServer\s*\(/);
      return { fired: Boolean(line), evidence: line };
    },
  },
  {
    id: 'deep-dist-import',
    title: 'Imported from an internal mcp-use path (dist/ or src/)',
    lever: 'sdk',
    severity: 'medium',
    detect: (ctx) => {
      const line = firstMatchLine(ctx.source.combined, /from\s+['"]mcp-use\/(dist|src)\//);
      return { fired: Boolean(line), evidence: line };
    },
  },
  {
    id: 'hand-rolled-content-block',
    title: 'Hand-rolled a content block instead of using a response helper',
    lever: 'skill',
    severity: 'low',
    applies: (ctx) => ctx.source.importsMcpUse,
    detect: (ctx) => {
      const line = firstMatchLine(
        ctx.source.combined,
        /content\s*:\s*\[\s*\{\s*type\s*:\s*['"]text['"]/,
      );
      return { fired: Boolean(line), evidence: line };
    },
  },
  {
    id: 'no-response-helper',
    title: 'Registered tools but imported no mcp-use response helper',
    lever: 'docs',
    severity: 'low',
    applies: (ctx) => ctx.source.importsMcpUse && REGISTERS_TOOLS.test(ctx.source.combined),
    detect: (ctx) => ({
      fired: !RESPONSE_HELPER_IMPORT.test(ctx.source.combined),
      evidence: 'no { text | object | markdown | … } import from mcp-use alongside tool registration',
    }),
  },
  {
    id: 'hand-rolled-jwks',
    title: 'Hand-rolled JWKS verification instead of jwksVerifier()',
    lever: 'docs',
    severity: 'medium',
    applies: (ctx) => ctx.usesOAuth,
    detect: (ctx) => {
      const line = firstMatchLine(ctx.source.combined, /createRemoteJWKSet|from\s+['"]jose['"]/);
      const usesHelper = /jwksVerifier\s*\(/.test(ctx.source.combined);
      return { fired: Boolean(line) && !usesHelper, evidence: line };
    },
  },
];

export function runLints(ctx: LintContext): Finding[] {
  // No code captured at all — emit one strong signal rather than a pile of lints.
  if (ctx.source.serverFiles.length === 0 && !ctx.source.packageJson) {
    return [
      {
        id: 'no-output',
        title: 'Agent produced no source code',
        lever: 'process',
        severity: 'high',
        source: 'deterministic',
        detail: 'No generated server files were captured for this run.',
      },
    ];
  }

  const out: Finding[] = [];
  for (const lint of LINTS) {
    if (lint.applies && !lint.applies(ctx)) continue;
    const r = lint.detect(ctx);
    if (r.fired) {
      out.push({
        id: lint.id,
        title: lint.title,
        lever: lint.lever,
        severity: lint.severity,
        source: 'deterministic',
        detail: r.evidence,
      });
    }
  }
  return out;
}
