import { defineExperiment } from '../scoring/index.js';

// Codex · mcp-use skill · no scaffold.
export default defineExperiment({ agent: 'codex', agentLabel: 'codex', skill: true, scaffold: false });
