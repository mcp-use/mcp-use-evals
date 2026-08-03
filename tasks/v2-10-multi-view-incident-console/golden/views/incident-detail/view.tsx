import { useToolContext } from "mcp-use/react";
import "./view.css";

type Incident = { id: string; title: string; severity: string; owner: string; status: string };

export default function IncidentDetail() {
  const ctx = useToolContext<"get_incident">();
  if (ctx.status === "pending") return <main data-view="incident-detail">Loading incident…</main>;
  if (ctx.status === "error") return <main data-view="incident-detail">Unable to load incident.</main>;
  const incident = ctx.toolOutput as Incident;
  return (
    <main data-view="incident-detail">
      <h1>{incident?.id ?? "Incident detail"}</h1>
      <h2>{incident?.title}</h2>
      <dl><dt>Severity</dt><dd>{incident?.severity}</dd><dt>Owner</dt><dd>{incident?.owner}</dd><dt>Status</dt><dd>{incident?.status}</dd></dl>
    </main>
  );
}
