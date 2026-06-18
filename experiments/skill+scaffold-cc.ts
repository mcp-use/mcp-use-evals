import { defineExperiment } from '../scoring/index.js';

// Claude Code · mcp-use skill · create-mcp-use-app scaffold.
export default defineExperiment({ agent: 'claude-code', agentLabel: 'cc', skill: true, scaffold: true });
