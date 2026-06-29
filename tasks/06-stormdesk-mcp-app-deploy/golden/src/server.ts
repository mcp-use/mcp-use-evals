import { MCPServer, error, object, text, widget } from "mcp-use/server";
import { z } from "zod";

type IncidentStatus = "queued" | "assigned" | "monitor";

interface Incident {
  id: string;
  neighborhood: string;
  hazard: string;
  priority: number;
  status: IncidentStatus;
  location: string;
  summary: string;
}

interface Crew {
  id: string;
  label: string;
  available: boolean;
  capabilities: string[];
  base: string;
}

interface StagingSite {
  id: string;
  name: string;
  access: string;
  notes: string;
}

interface Assignment {
  id: string;
  crewId: string;
  incidentId: string;
  stagingSiteId: string;
  status: string;
}

const incidents: Incident[] = [
  {
    id: "INC-104",
    neighborhood: "Harborview",
    hazard: "flooding",
    priority: 5,
    status: "queued",
    location: "Bayfront pump station",
    summary: "Street flooding is rising around the pump station and homes.",
  },
  {
    id: "INC-221",
    neighborhood: "Harborview",
    hazard: "downed-tree",
    priority: 3,
    status: "queued",
    location: "7th and Alder",
    summary: "Large downed tree is blocking one lane near a feeder route.",
  },
  {
    id: "INC-315",
    neighborhood: "West Hill",
    hazard: "power",
    priority: 4,
    status: "monitor",
    location: "Hillcrest substation",
    summary: "Intermittent power loss requires utility coordination.",
  },
];

const crews: Crew[] = [
  {
    id: "crew-pump-7",
    label: "Pump Crew 7",
    available: true,
    capabilities: ["pumping", "flood response", "water rescue support"],
    base: "Public Works Yard",
  },
  {
    id: "crew-saw-2",
    label: "Saw Crew 2",
    available: true,
    capabilities: ["tree removal", "road clearance", "traffic safety"],
    base: "Parks Depot",
  },
  {
    id: "crew-med-1",
    label: "Medical Strike Team 1",
    available: false,
    capabilities: ["first aid", "shelter triage"],
    base: "Regional mutual-aid standby",
  },
];

const stagingSites: StagingSite[] = [
  {
    id: "site-civic",
    name: "Civic Center",
    access: "accessible",
    notes: "Best for public updates, resident intake, and supply handoff.",
  },
  {
    id: "site-north",
    name: "North Lot",
    access: "limited access",
    notes: "Use only for small equipment; entrance is narrowed by debris.",
  },
];

const blockedRoads = [
  {
    name: "Bayfront Ave",
    reason: "standing water over curb line",
    severity: "high",
  },
  {
    name: "Alder Connector",
    reason: "tree debris in westbound lane",
    severity: "medium",
  },
];

const supplyConstraints = [
  {
    item: "sandbags",
    status: "low",
    detail: "Only 420 filled sandbags staged; request refill within 2 hours.",
  },
];

const assignments: Assignment[] = [];

const PlanInputSchema = z.object({
  neighborhood: z.string().describe("Neighborhood to plan for"),
  hazardType: z.string().describe("Primary storm hazard to address"),
  severity: z
    .enum(["low", "medium", "high", "critical"])
    .or(z.string())
    .describe("Operational severity level"),
  timeWindowHours: z
    .number()
    .positive()
    .describe("Planning window in hours"),
  priorities: z
    .array(z.string())
    .describe("Operational priorities to optimize for"),
});

const AssignmentSchema = z.object({
  crewId: z.string(),
  incidentId: z.string(),
  stagingSiteId: z.string(),
  rationale: z.string(),
});

const PlanOutputSchema = z.object({
  neighborhood: z.string(),
  hazardType: z.string(),
  severity: z.string(),
  incidents: z.array(
    z.object({
      id: z.string(),
      neighborhood: z.string(),
      hazard: z.string(),
      priority: z.number(),
      status: z.string(),
      location: z.string(),
      summary: z.string(),
    })
  ),
  crews: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      available: z.boolean(),
      capabilities: z.array(z.string()),
      base: z.string(),
    })
  ),
  recommendedAssignments: z.array(AssignmentSchema),
  stagingSites: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      access: z.string(),
      notes: z.string(),
    })
  ),
  supplyConstraints: z.array(
    z.object({ item: z.string(), status: z.string(), detail: z.string() })
  ),
  blockedRoads: z.array(
    z.object({ name: z.string(), reason: z.string(), severity: z.string() })
  ),
  riskFlags: z.array(z.string()),
  timeline: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      dueInMinutes: z.number(),
      owner: z.string(),
    })
  ),
});

const server = new MCPServer({
  name: "stormdesk",
  version: "1.0.0",
  description: "Storm-response planning MCP App with an operations widget",
});

server.tool(
  {
    name: "plan-storm-response",
    description: "Build an interactive storm-response plan for a neighborhood",
    schema: PlanInputSchema,
    outputSchema: PlanOutputSchema,
    widget: {
      name: "stormdesk",
      invoking: "Building storm response plan...",
      invoked: "Storm response plan ready",
    },
  },
  async ({ neighborhood, hazardType, severity, timeWindowHours, priorities }) => {
    const plan = buildPlan({
      neighborhood,
      hazardType,
      severity: String(severity),
      timeWindowHours,
      priorities,
    });

    return widget({
      props: plan,
      message: [
        `StormDesk plan for ${plan.neighborhood}: ${plan.incidents.length} incidents, ${plan.crews.filter((crew) => crew.available).length} available crews.`,
        `Top incident ${plan.incidents[0]?.id ?? "none"}; blocked road ${plan.blockedRoads[0]?.name ?? "none"}.`,
        `Recommended crew ${plan.recommendedAssignments[0]?.crewId ?? "none"}.`,
      ].join(" "),
    });
  }
);

server.tool(
  {
    name: "assign-crew",
    description: "Assign an available storm-response crew to an incident",
    schema: z.object({
      crewId: z.string().describe("Crew id to assign"),
      incidentId: z.string().describe("Incident id needing response"),
      stagingSiteId: z.string().describe("Staging site id for the crew"),
    }),
  },
  async ({ crewId, incidentId, stagingSiteId }) => {
    const crew = crews.find((item) => item.id === crewId);
    if (!crew) return error(`unknown crew: ${crewId}`);
    if (!crew.available) return error(`crew ${crewId} is unavailable`);

    const incident = incidents.find((item) => item.id === incidentId);
    if (!incident) return error(`unknown incident: ${incidentId}`);

    const site = stagingSites.find((item) => item.id === stagingSiteId);
    if (!site) return error(`unknown staging site: ${stagingSiteId}`);

    incident.status = "assigned";
    crew.available = false;
    const assignment: Assignment = {
      id: `ASN-${assignments.length + 1}`,
      crewId,
      incidentId,
      stagingSiteId,
      status: "dispatched",
    };
    assignments.push(assignment);

    return object({
      message: `Assignment confirmed: ${crew.label} to ${incident.id} via ${site.name}`,
      assignment,
    });
  }
);

server.tool(
  {
    name: "generate-public-update",
    description: "Draft a concise public update for residents",
    schema: z.object({
      neighborhood: z.string().describe("Neighborhood for the public update"),
      tone: z.string().describe("Tone for the public-facing message"),
      includeShelterInfo: z
        .boolean()
        .optional()
        .describe("Whether to include shelter information"),
    }),
    outputSchema: z.object({
      update: z.string(),
    }),
  },
  async ({ neighborhood, tone, includeShelterInfo }) => {
    const update = [
      `StormDesk public update for ${neighborhood}: crews are responding to storm impacts and prioritizing life safety, road access, and flood mitigation.`,
      `Tone: ${tone}. Avoid flooded roads including Bayfront Ave and follow posted detours.`,
      includeShelterInfo
        ? "Shelter and charging support are available at the Civic Center."
        : "Further shelter information will be shared if conditions change.",
    ].join(" ");
    return object({ update });
  }
);

const PLAYBOOK = `# StormDesk Playbook

## Escalation
- Escalate to the emergency operations center when life safety is at risk, flood depth reaches curb height, or two critical corridors are blocked.
- Request mutual aid when available crews cannot reach all priority-5 incidents within the planning window.

## Shelter guidance
- Use the Civic Center for resident intake, charging, warming, and public briefings.
- Confirm ADA access and backup power before naming a shelter in a public update.

## Crew safety rules
- Do not dispatch crews through standing water over curb height.
- Pair saw crews with traffic control when clearing lanes.
- Recheck crew rest status after each assignment.

## public communications
- Publish concise, calm updates with neighborhood, affected roads, safety instructions, and next update timing.
- Avoid unverified restoration estimates.`;

server.resource(
  {
    uri: "stormdesk://playbook",
    name: "stormdesk-playbook",
    description: "Escalation, shelter, crew safety, and communications rules",
    mimeType: "text/markdown",
  },
  async () => text(PLAYBOOK)
);

function buildPlan(input: z.infer<typeof PlanInputSchema>) {
  const matchingIncidents = incidents
    .filter(
      (incident) =>
        incident.neighborhood.toLowerCase() === input.neighborhood.toLowerCase()
    )
    .sort((a, b) => b.priority - a.priority);

  const recommendedAssignments = matchingIncidents
    .map((incident) => {
      const crew =
        incident.hazard === "flooding"
          ? crews.find((item) => item.id === "crew-pump-7")
          : incident.hazard === "downed-tree"
            ? crews.find((item) => item.id === "crew-saw-2")
            : crews.find((item) => item.available);
      if (!crew) return null;
      return {
        crewId: crew.id,
        incidentId: incident.id,
        stagingSiteId: "site-civic",
        rationale: `${crew.label} matches ${incident.hazard} response needs.`,
      };
    })
    .filter((item): item is z.infer<typeof AssignmentSchema> => Boolean(item));

  return {
    neighborhood: input.neighborhood,
    hazardType: input.hazardType,
    severity: String(input.severity),
    incidents: matchingIncidents,
    crews,
    recommendedAssignments,
    stagingSites,
    supplyConstraints,
    blockedRoads,
    riskFlags: [
      "Bayfront Ave is blocked by standing water",
      "sandbags are constrained",
      "medical mutual-aid crew is unavailable",
    ],
    timeline: [
      {
        id: "t-0",
        label: "Confirm life-safety sweep and road closures",
        dueInMinutes: 15,
        owner: "Operations lead",
      },
      {
        id: "t-1",
        label: "Dispatch pump crew to INC-104 from Civic Center staging",
        dueInMinutes: 30,
        owner: "Public Works",
      },
      {
        id: "t-2",
        label: "Send public update and shelter guidance",
        dueInMinutes: Math.min(60, input.timeWindowHours * 10),
        owner: "PIO",
      },
    ],
  };
}

await server.listen();
