import { defineExperiment } from '../scoring/index.js';

// Codex · mcp-use skill · create-mcp-use-app scaffold.
export default defineExperiment({ agent: 'vercel-ai-gateway/codex', agentLabel: 'codex', skill: true, scaffold: true });
