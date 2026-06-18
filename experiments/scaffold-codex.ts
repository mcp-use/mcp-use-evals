import { defineExperiment } from '../scoring/index.js';

// Codex · no skill · create-mcp-use-app scaffold.
export default defineExperiment({ agent: 'codex', agentLabel: 'codex', skill: false, scaffold: true });
