import { useToolContext } from "mcp-use/react";
import "./view.css";

type Incident = { id: string; title: string; severity: string; owner: string; status: string };

export default function IncidentList() {
  const ctx = useToolContext<"list_incidents">();
  if (ctx.status === "pending") return <main data-view="incident-list">Loading incidents…</main>;
  if (ctx.status === "error") return <main data-view="incident-list">Unable to load incidents.</main>;
  const data = ctx.toolOutput as { incidents?: Incident[] };
  return (
    <main data-view="incident-list">
      <h1>Incident console</h1>
      {(data?.incidents ?? []).map((incident) => (
        <article key={incident.id}><strong>{incident.id}</strong><span>{incident.title}</span><small>{incident.severity} · {incident.status}</small></article>
      ))}
    </main>
  );
}
