The agent relied heavily on package-local discovery rather than a skill or fetched docs: it inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and searched for `"listen|serve|Streamable|streamable|http"`. It later inspected the upstream SDK’s `client/streamableHttp.d.ts` and `client/index.d.ts` to build its verification client.

The initial scaffold retained CommonJS defaults, causing avoidable TypeScript failures: `The 'import.meta' meta-property is not allowed in files which will build into CommonJS output` and `The current file is a CommonJS module and cannot use 'await' at the top level.` Node typings were installed but not configured, producing `Cannot find name 'process'` and requiring package/tsconfig corrections.

Package introspection hit an exports papercut when `require('mcp-use/package.json').version` failed with `ERR_PACKAGE_PATH_NOT_EXPORTED: Package subpath './package.json' is not defined by "exports"`.

A combined typecheck/start command appears to have left the server running; the next launch failed with `Error: listen EADDRINUSE: address already in use 127.0.0.1:3100`, after which `ps` showed `npm exec tsx src/server.ts`. This added process-management cleanup work.

The advertised mcp-use CLI verification path was confusing. Running `npx mcp-use client ...` said `[mcp-use] installing @mcp-use/client…` and `added 1 package`, but immediately failed with `@mcp-use/client is not installed` and instructed `npm install @mcp-use/client`. The agent abandoned that route and used `@modelcontextprotocol/sdk/client/streamableHttp.js` directly, then removed the transient client package with `npm uninstall @mcp-use/client`.

Final cleanup also assumed Git despite the blank workspace: `git diff --check` yielded `warning: Not a git repository`, creating noise without useful validation.