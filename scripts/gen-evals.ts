/**
 * Generate each scenario's `evals/<scenario>/EVAL.ts` functional probe.
 *
 * Why a generator: the probe body is identical across scenarios, but `EVAL.ts` is
 * the ONLY file the harness hides from the agent and uploads *after* it runs
 * (`@vercel/agent-eval` `TEST_FILE_PATTERNS` = EVAL.ts/EVAL.tsx/PROMPT.md). A shared
 * helper file in the scenario dir would be uploaded *before* the agent (visible /
 * modifiable by it), so the probe must be self-contained in each EVAL.ts. We keep a
 * single source of truth here (the SHARED body) and inject a tiny per-scenario config
 * header. Re-run after editing: `node scripts/gen-evals.ts`.
 *
 * The probe:
 *   - boots the agent's server (npm install → npx tsx <entry>, else npm run dev/start)
 *     on a free PORT, polls /mcp until reachable,
 *   - connects with the mcp-use client SDK (raw JSON-RPC fallback) and lists tools,
 *   - pass bar (connect + list): non-OAuth ⇒ booted && >=1 tool; OAuth ⇒ booted && a
 *     correct 401/403 challenge to the unauthenticated client (we can't mint tokens),
 *   - emits one line `__READINESS_PROBE__{json}__READINESS_PROBE_END__` to stdout,
 *     which the harness captures as `runData.outputContent.eval` for `scoring/score.ts`.
 *
 * The probe test ALWAYS asserts green so it never conflates with the build gate
 * (`scripts: ['build']`), which stays the independent 25-pt `build` dimension.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const EVALS = join(REPO, 'evals');

interface ScenarioConfig {
  /** OAuth scenario: a 401/403 challenge to the unauthenticated probe counts as pass. */
  oauth: boolean;
  /** Placeholder env so an OAuth server can boot (and challenge) without real secrets. */
  env?: Record<string, string>;
}

const SCENARIOS: Record<string, ScenarioConfig> = {
  'basic-tool-server': { oauth: false },
  'stateful-notes-server': { oauth: false },
  'stormdesk-mcp-app': { oauth: false },
  'stormdesk-skybridge-app': { oauth: false },
  'oauth-clerk': {
    oauth: true,
    env: { MCP_USE_OAUTH_CLERK_FRONTEND_API_URL: 'https://probe-placeholder.clerk.accounts.dev' },
  },
  'oauth-custom-idp': {
    oauth: true,
    env: {
      OAUTH_ISSUER: 'https://probe-placeholder.idp.local',
      OAUTH_AUTH_ENDPOINT: 'https://probe-placeholder.idp.local/authorize',
      OAUTH_TOKEN_ENDPOINT: 'https://probe-placeholder.idp.local/token',
      OAUTH_JWKS_URL: 'https://probe-placeholder.idp.local/.well-known/jwks.json',
      OAUTH_AUDIENCE: 'mcp-probe',
    },
  },
};

/**
 * The shared probe body. MUST contain no backtick and no `${` so it embeds verbatim
 * in this template literal — it uses single quotes + concatenation throughout.
 * References `PROBE_CONFIG`, injected by the generated header.
 */
const SHARED = `import { execSync, spawn } from 'node:child_process';
import { createServer, connect as netConnect } from 'node:net';
import { request as httpRequest } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { test, expect } from 'vitest';

const MARKER_START = '__READINESS_PROBE__';
const MARKER_END = '__READINESS_PROBE_END__';
// Generous: the scaffold's mcp-use server bundles widgets on a cold tsx start (~50-60s).
const READY_TIMEOUT_MS = 150000;
const PROBE_TEST_TIMEOUT_MS = 360000;

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

function emit(result) {
  process.stdout.write('\\n' + MARKER_START + JSON.stringify(result) + MARKER_END + '\\n');
}

function getFreePort() {
  return new Promise(function (resolve, reject) {
    const srv = createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', function () {
      const addr = srv.address();
      const port = addr && typeof addr === 'object' ? addr.port : 0;
      srv.close(function () { resolve(port); });
    });
  });
}

// TCP-connect readiness: unambiguous (a GET to a streamable /mcp endpoint can hang on
// SSE or 405). mcp-use mounts routes before it binds, so a successful connect == ready.
// Dual-stack: mcp-use servers frequently bind IPv6-only (::1), which a 127.0.0.1-only
// check would miss — so we try both and report which host actually answered.
const PROBE_HOSTS = ['127.0.0.1', '::1'];

function tcpUp(host, port) {
  return new Promise(function (resolve) {
    const sock = netConnect({ host: host, port: port }, function () {
      sock.destroy();
      resolve(true);
    });
    sock.setTimeout(2000, function () { sock.destroy(); resolve(false); });
    sock.on('error', function () { resolve(false); });
  });
}

// Returns the host that accepted a connection, or null on timeout.
async function waitForServer(port, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    for (let i = 0; i < PROBE_HOSTS.length; i++) {
      if (await tcpUp(PROBE_HOSTS[i], port)) return PROBE_HOSTS[i];
    }
    await sleep(500);
  }
  return null;
}

function postJsonRpc(url, body, sessionId) {
  return new Promise(function (resolve) {
    const data = Buffer.from(JSON.stringify(body));
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Content-Length': String(data.length),
    };
    if (sessionId) headers['mcp-session-id'] = sessionId;
    const req = httpRequest(url, { method: 'POST', headers: headers }, function (res) {
      let chunks = '';
      res.on('data', function (d) { chunks += d.toString(); });
      res.on('end', function () {
        resolve({
          status: res.statusCode || 0,
          sessionId: res.headers['mcp-session-id'] || sessionId || null,
          body: chunks,
        });
      });
    });
    req.setTimeout(8000, function () { req.destroy(); resolve({ status: 0, sessionId: sessionId || null, body: '' }); });
    req.on('error', function () { resolve({ status: 0, sessionId: sessionId || null, body: '' }); });
    req.write(data);
    req.end();
  });
}

function parseRpc(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.charAt(0) === '{') {
    try { return JSON.parse(trimmed); } catch (e) { /* fall through to SSE */ }
  }
  const lines = raw.split('\\n');
  let payload = '';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('data:') === 0) payload += lines[i].slice(5).trim();
  }
  if (payload) { try { return JSON.parse(payload); } catch (e) { return null; } }
  return null;
}

async function rawProbe(mcpUrl) {
  const out = { oauthChallenge: false, tools: null, error: null };
  const initBody = {
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'readiness-probe', version: '0.0.0' },
    },
  };
  const init = await postJsonRpc(mcpUrl, initBody, null);
  if (init.status === 401 || init.status === 403) { out.oauthChallenge = true; return out; }
  if (init.status === 0) { out.error = 'no response to initialize'; return out; }
  const sessionId = init.sessionId;
  await postJsonRpc(mcpUrl, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId);
  const list = await postJsonRpc(mcpUrl, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, sessionId);
  if (list.status === 401 || list.status === 403) { out.oauthChallenge = true; return out; }
  const parsed = parseRpc(list.body);
  if (parsed && parsed.result && Array.isArray(parsed.result.tools)) out.tools = parsed.result.tools;
  else if (parsed && parsed.error) out.error = 'tools/list error: ' + JSON.stringify(parsed.error).slice(0, 200);
  return out;
}

function normalizeTools(r) {
  if (!r) return null;
  if (Array.isArray(r)) return r;
  if (Array.isArray(r.tools)) return r.tools;
  return null;
}

async function listToolsViaSdk(session) {
  if (session && typeof session.listTools === 'function') return normalizeTools(await session.listTools());
  if (session && session.connector) {
    const c = session.connector;
    if (typeof c.listTools === 'function') return normalizeTools(await c.listTools());
    if (c.tools) return normalizeTools(c.tools);
  }
  if (session && typeof session.initialize === 'function') {
    await session.initialize();
    if (session.connector && session.connector.tools) return normalizeTools(session.connector.tools);
  }
  if (session && session.tools) return normalizeTools(session.tools);
  return null;
}

function toolNames(tools) {
  const names = [];
  for (let i = 0; i < tools.length && i < 50; i++) {
    const t = tools[i];
    if (t && t.name) names.push(t.name);
    else if (typeof t === 'string') names.push(t);
  }
  return names;
}

function detectEntry() {
  const candidates = ['src/server.ts', 'src/index.ts', 'index.ts', 'server.ts', 'src/main.ts', 'main.ts'];
  for (let i = 0; i < candidates.length; i++) if (existsSync(candidates[i])) return candidates[i];
  return null;
}

function readScripts() {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    return pkg.scripts || {};
  } catch (e) { return {}; }
}

function killTree(child) {
  if (!child || !child.pid) return;
  try { process.kill(-child.pid, 'SIGKILL'); }
  catch (e) { try { child.kill('SIGKILL'); } catch (e2) { /* already gone */ } }
}

// The probe ALWAYS asserts green: its verdict travels in the emitted marker so it
// never conflates with the build gate. scoring/score.ts parses the marker.
test('functional probe: MCP server boots and serves tools', async function () {
  const result = {
    booted: false, connected: false, oauthChallenge: false,
    toolCount: 0, tools: [], pass: false, via: null, error: null,
  };
  let child = null;
  try {
    // Materialize whatever the agent declared (idempotent / fast if already installed).
    try { execSync('npm install --no-audit --no-fund --silent', { stdio: 'pipe', timeout: 180000 }); }
    catch (e) { /* maybe offline or already installed — keep going and let boot decide */ }

    const port = await getFreePort();
    const env = Object.assign({}, process.env, { PORT: String(port), MCP_URL: 'http://127.0.0.1:' + port }, PROBE_CONFIG.env || {});

    const entry = detectEntry();
    const scripts = readScripts();
    let cmd = null;
    let args = null;
    if (entry) { cmd = 'npx'; args = ['--yes', 'tsx', entry]; }
    else if (scripts.dev) { cmd = 'npm'; args = ['run', 'dev']; }
    else if (scripts.start) { cmd = 'npm'; args = ['run', 'start']; }
    if (!cmd) { result.error = 'no entry file or dev/start script found'; return; }

    let serverLog = '';
    child = spawn(cmd, args, { env: env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    child.stdout.on('data', function (d) { serverLog += d.toString(); });
    child.stderr.on('data', function (d) { serverLog += d.toString(); });
    child.on('error', function (e) { serverLog += '[spawn error] ' + (e && e.message ? e.message : String(e)); });

    const host = await waitForServer(port, READY_TIMEOUT_MS);
    if (!host) {
      result.error = 'server did not become reachable. log tail: ' + serverLog.slice(-600);
      return;
    }
    result.booted = true;
    await sleep(1000); // small grace so the HTTP layer is fully ready after the port binds
    const hostForUrl = host.indexOf(':') >= 0 ? '[' + host + ']' : host;
    const mcpUrl = 'http://' + hostForUrl + ':' + port + '/mcp';

    // Primary: the mcp-use client SDK. Computed specifier keeps tsc from resolving it.
    let tools = null;
    try {
      const spec = 'mcp-use' + '/client';
      const mod = await import(spec);
      const MCPClient = mod.MCPClient || (mod.default && mod.default.MCPClient) || mod.default;
      if (!MCPClient) throw new Error('MCPClient export not found');
      const client = new MCPClient({ mcpServers: { probe: { url: mcpUrl } } });
      const session = await client.createSession('probe');
      result.connected = true;
      result.via = 'mcp-use';
      tools = await listToolsViaSdk(session);
      try { if (typeof client.closeAllSessions === 'function') await client.closeAllSessions(); } catch (e) { /* ignore */ }
    } catch (e) {
      result.error = 'sdk: ' + (e && e.message ? e.message : String(e));
    }

    // Fallback: raw JSON-RPC (also the reliable OAuth-401 detector).
    if (!tools || tools.length === 0) {
      const raw = await rawProbe(mcpUrl);
      if (raw.oauthChallenge) result.oauthChallenge = true;
      if (raw.tools && raw.tools.length) {
        tools = raw.tools;
        result.connected = true;
        if (!result.via) result.via = 'raw';
      }
      if (raw.error && !result.error) result.error = raw.error;
    }

    if (tools && tools.length) {
      result.toolCount = tools.length;
      result.tools = toolNames(tools);
    }

    if (PROBE_CONFIG.oauth) result.pass = result.booted && (result.oauthChallenge || result.toolCount > 0);
    else result.pass = result.booted && result.toolCount > 0;
  } catch (e) {
    result.error = (result.error ? result.error + ' | ' : '') + (e && e.message ? e.message : String(e));
  } finally {
    killTree(child);
    emit(result);
  }
  expect(true).toBe(true);
}, PROBE_TEST_TIMEOUT_MS);
`;

function render(cfg: ScenarioConfig): string {
  return [
    '// @ts-nocheck',
    '/* AUTO-GENERATED by scripts/gen-evals.ts — do not edit by hand. Re-run: node scripts/gen-evals.ts */',
    `const PROBE_CONFIG = ${JSON.stringify(cfg)};`,
    '',
    SHARED,
  ].join('\n');
}

let wrote = 0;
for (const [name, cfg] of Object.entries(SCENARIOS)) {
  const dir = join(EVALS, name);
  if (!existsSync(dir)) {
    console.warn(`skip (no scenario dir): ${name}`);
    continue;
  }
  writeFileSync(join(dir, 'EVAL.ts'), render(cfg) + '\n');
  console.log(`wrote ${name}/EVAL.ts${cfg.oauth ? ' (oauth)' : ''}`);
  wrote += 1;
}
console.log(`\n${wrote} EVAL.ts file(s) generated.`);
