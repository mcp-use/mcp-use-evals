import {
  McpUseProvider,
  ModelContext,
  useWidget,
  type WidgetMetadata,
} from "mcp-use/react";
import React, { useMemo, useState } from "react";
import { z } from "zod";

const incidentSchema = z.object({
  id: z.string(),
  hazard: z.string(),
  priority: z.number(),
  status: z.string(),
  location: z.string(),
  summary: z.string(),
});

const crewSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
  capabilities: z.array(z.string()),
  base: z.string(),
});

const siteSchema = z.object({
  id: z.string(),
  name: z.string(),
  access: z.string(),
  notes: z.string(),
});

const assignmentSchema = z.object({
  crewId: z.string(),
  incidentId: z.string(),
  stagingSiteId: z.string(),
  rationale: z.string(),
});

const timelineSchema = z.object({
  id: z.string(),
  label: z.string(),
  dueInMinutes: z.number(),
  owner: z.string(),
});

const propsSchema = z.object({
  neighborhood: z.string(),
  hazardType: z.string(),
  severity: z.string(),
  incidents: z.array(incidentSchema),
  crews: z.array(crewSchema),
  recommendedAssignments: z.array(assignmentSchema),
  stagingSites: z.array(siteSchema),
  supplyConstraints: z.array(
    z.object({ item: z.string(), status: z.string(), detail: z.string() })
  ),
  blockedRoads: z.array(
    z.object({ name: z.string(), reason: z.string(), severity: z.string() })
  ),
  riskFlags: z.array(z.string()),
  timeline: z.array(timelineSchema),
});

type StormProps = z.infer<typeof propsSchema>;
type StormState = {
  selectedIncidentIds: string[];
  selectedStagingSiteId: string | null;
  checkedTimelineIds: string[];
  draftAssignments: Record<string, string>;
};

const initialState: StormState = {
  selectedIncidentIds: [],
  selectedStagingSiteId: null,
  checkedTimelineIds: [],
  draftAssignments: {},
};

export const widgetMetadata: WidgetMetadata = {
  description: "StormDesk operations planning console",
  props: propsSchema,
  exposeAsTool: false,
  metadata: {
    autoResize: true,
    prefersBorder: true,
    widgetDescription:
      "Interactive storm-response plan with incidents, crews, staging, risks, and timeline",
  },
};

export default function StormDeskWidget() {
  const {
    props,
    isPending,
    theme,
    safeArea,
    maxHeight,
    state,
    setState,
    callTool,
  } = useWidget<StormProps, StormState>();
  const [status, setStatus] = useState<string>("");
  const current = { ...initialState, ...(state ?? {}) };
  const isDark = theme === "dark";

  const incidents = props.incidents ?? [];
  const crews = props.crews ?? [];
  const sites = props.stagingSites ?? [];
  const selectedIncidentIds =
    current.selectedIncidentIds.length > 0
      ? current.selectedIncidentIds
      : incidents.map((incident) => incident.id);
  const selectedSiteId = current.selectedStagingSiteId ?? sites[0]?.id ?? null;

  const selectedIncidents = useMemo(
    () =>
      incidents.filter((incident) => selectedIncidentIds.includes(incident.id)),
    [incidents, selectedIncidentIds]
  );
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? null;
  const assignmentSummary = Object.entries(current.draftAssignments)
    .map(([incidentId, crewId]) => `${incidentId}:${crewId}`)
    .join(", ");

  async function patchState(patch: Partial<StormState>) {
    await setState({ ...current, ...patch });
  }

  async function toggleIncident(id: string) {
    const next = selectedIncidentIds.includes(id)
      ? selectedIncidentIds.filter((item) => item !== id)
      : [...selectedIncidentIds, id];
    await patchState({ selectedIncidentIds: next });
  }

  async function toggleTimeline(id: string) {
    const next = current.checkedTimelineIds.includes(id)
      ? current.checkedTimelineIds.filter((item) => item !== id)
      : [...current.checkedTimelineIds, id];
    await patchState({ checkedTimelineIds: next });
  }

  async function assignRecommended(incidentId: string, crewId: string) {
    if (!selectedSiteId) return;
    setStatus("Assigning crew...");
    const result = await callTool("assign-crew", {
      incidentId,
      crewId,
      stagingSiteId: selectedSiteId,
    });
    await patchState({
      draftAssignments: { ...current.draftAssignments, [incidentId]: crewId },
    });
    setStatus(result.isError ? "Assignment failed" : "Assignment confirmed");
  }

  async function generateUpdate() {
    setStatus("Generating public update...");
    const result = await callTool("generate-public-update", {
      neighborhood: props.neighborhood,
      tone: "calm",
      includeShelterInfo: true,
    });
    const textBlock = result.content?.find((block) => block.type === "text");
    setStatus(
      textBlock && "text" in textBlock
        ? String(textBlock.text)
        : "Public update generated"
    );
  }

  const shellStyle: React.CSSProperties = {
    boxSizing: "border-box",
    minHeight: 280,
    maxHeight: maxHeight ? Math.max(260, maxHeight) : undefined,
    overflow: "auto",
    paddingTop: 14 + (safeArea?.insets?.top ?? 0),
    paddingRight: 14 + (safeArea?.insets?.right ?? 0),
    paddingBottom: 14 + (safeArea?.insets?.bottom ?? 0),
    paddingLeft: 14 + (safeArea?.insets?.left ?? 0),
    color: isDark ? "#f8fafc" : "#172033",
    background: isDark ? "#111827" : "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  };

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div style={shellStyle}>
          <div style={panelStyle(isDark)}>Building storm response plan...</div>
        </div>
      </McpUseProvider>
    );
  }

  return (
    <McpUseProvider autoSize>
      <ModelContext
        content={`StormDesk plan for ${props.neighborhood}. Selected incidents: ${selectedIncidents.map((item) => `${item.id} ${item.hazard}`).join(", ") || "none"}. Staging site: ${selectedSite?.name ?? "none"}. Active risks: ${(props.riskFlags ?? []).join("; ")}. Draft assignments: ${assignmentSummary || "none"}.`}
      >
        <div style={shellStyle}>
          <header style={{ marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>StormDesk</h2>
            <div style={{ opacity: 0.8 }}>
              {props.neighborhood} · {props.hazardType} · {props.severity}
            </div>
          </header>

          <div style={gridStyle}>
            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Incidents</h3>
              {incidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => void toggleIncident(incident.id)}
                  style={itemButtonStyle(
                    isDark,
                    selectedIncidentIds.includes(incident.id)
                  )}
                >
                  <strong>
                    {incident.id} · P{incident.priority}
                  </strong>
                  <span>{incident.hazard}</span>
                  <small>{incident.summary}</small>
                </button>
              ))}
            </section>

            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Crews</h3>
              {crews.map((crew) => (
                <div key={crew.id} style={rowStyle(isDark)}>
                  <strong>{crew.label}</strong>
                  <span>{crew.available ? "available" : "unavailable"}</span>
                  <small>{crew.capabilities.join(", ")}</small>
                </div>
              ))}
            </section>

            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Staging</h3>
              <select
                value={selectedSiteId ?? ""}
                onChange={(event) =>
                  void patchState({ selectedStagingSiteId: event.target.value })
                }
                style={selectStyle(isDark)}
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.access})
                  </option>
                ))}
              </select>
              <p style={{ margin: "8px 0 0" }}>{selectedSite?.notes}</p>
            </section>

            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Assignments</h3>
              {(props.recommendedAssignments ?? []).map((assignment) => (
                <div key={`${assignment.incidentId}-${assignment.crewId}`} style={rowStyle(isDark)}>
                  <strong>{assignment.incidentId}</strong>
                  <span>{assignment.crewId}</span>
                  <small>{assignment.rationale}</small>
                  <button
                    onClick={() =>
                      void assignRecommended(
                        assignment.incidentId,
                        assignment.crewId
                      )
                    }
                    style={actionStyle}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </section>

            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Timeline</h3>
              {(props.timeline ?? []).map((step) => (
                <label key={step.id} style={checkboxRow}>
                  <input
                    type="checkbox"
                    checked={current.checkedTimelineIds.includes(step.id)}
                    onChange={() => void toggleTimeline(step.id)}
                  />
                  <span>
                    {step.label} · {step.owner} · {step.dueInMinutes}m
                  </span>
                </label>
              ))}
            </section>

            <section style={panelStyle(isDark)}>
              <h3 style={sectionTitle}>Risks</h3>
              {(props.riskFlags ?? []).map((risk) => (
                <div key={risk} style={riskStyle(isDark)}>
                  {risk}
                </div>
              ))}
              {(props.blockedRoads ?? []).map((road) => (
                <small key={road.name}>
                  Blocked: {road.name} ({road.reason})
                </small>
              ))}
              {(props.supplyConstraints ?? []).map((constraint) => (
                <small key={constraint.item}>
                  Supply: {constraint.item} {constraint.status} —{" "}
                  {constraint.detail}
                </small>
              ))}
            </section>
          </div>

          <footer style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => void generateUpdate()} style={actionStyle}>
              Public update
            </button>
            <span style={{ alignSelf: "center", fontSize: 12 }}>{status}</span>
          </footer>
        </div>
      </ModelContext>
    </McpUseProvider>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  textTransform: "uppercase",
};

const checkboxRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "flex-start",
  marginBottom: 8,
  fontSize: 13,
};

const actionStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 6,
  background: "#2563eb",
  color: "white",
  padding: "7px 10px",
  cursor: "pointer",
};

function panelStyle(isDark: boolean): React.CSSProperties {
  return {
    display: "grid",
    gap: 8,
    borderRadius: 8,
    padding: 12,
    border: `1px solid ${isDark ? "#374151" : "#d8dee9"}`,
    background: isDark ? "#1f2937" : "#ffffff",
  };
}

function rowStyle(isDark: boolean): React.CSSProperties {
  return {
    display: "grid",
    gap: 3,
    borderRadius: 6,
    padding: 8,
    background: isDark ? "#111827" : "#f1f5f9",
  };
}

function itemButtonStyle(
  isDark: boolean,
  selected: boolean
): React.CSSProperties {
  return {
    ...rowStyle(isDark),
    textAlign: "left",
    color: "inherit",
    border: selected ? "2px solid #2563eb" : "1px solid transparent",
    cursor: "pointer",
  };
}

function selectStyle(isDark: boolean): React.CSSProperties {
  return {
    borderRadius: 6,
    padding: 8,
    color: isDark ? "#f8fafc" : "#172033",
    background: isDark ? "#111827" : "#ffffff",
    border: `1px solid ${isDark ? "#4b5563" : "#cbd5e1"}`,
  };
}

function riskStyle(isDark: boolean): React.CSSProperties {
  return {
    borderRadius: 999,
    padding: "5px 8px",
    background: isDark ? "#7f1d1d" : "#fee2e2",
    color: isDark ? "#fee2e2" : "#7f1d1d",
    fontSize: 12,
  };
}
