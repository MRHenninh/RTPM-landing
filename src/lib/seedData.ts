// Shared seed data definition, consumed by both the client-side first-run
// seeder (src/lib/seed.ts) and the standalone admin script (scripts/seed.ts).

export const SEED_PROJECT = {
  id: "datacenter-vejle-phase-1",
  name: "DataCenter Vejle — Phase 1",
  description:
    "Greenfield hyperscale data center build in Vejle, Denmark. Phase 1 covers civil works, MEP infrastructure and IT/data fit-out.",
};

export const WORKSTREAMS = [
  "Civil Works",
  "MEP Infrastructure",
  "IT/Data Infrastructure",
];

// Each role gets a stable id so risks can reference them deterministically.
export interface SeedRole {
  id: string;
  workstream: string;
  organization: string;
  organizationName: string;
  role: string;
  person: { name: string; email: string };
  type: "responsible" | "informed";
}

export const SEED_ROLES: SeedRole[] = [
  {
    id: "rr-001",
    workstream: "Civil Works",
    organization: "Main Contractor",
    organizationName: "MT Højgaard",
    role: "Site Manager",
    person: { name: "Jens Larsen", email: "jens.larsen@mth.dk" },
    type: "responsible",
  },
  {
    id: "rr-002",
    workstream: "MEP Infrastructure",
    organization: "Main Contractor",
    organizationName: "MT Højgaard",
    role: "MEP Lead",
    person: { name: "Peter Koch", email: "peter.koch@mth.dk" },
    type: "responsible",
  },
  {
    id: "rr-003",
    workstream: "Civil Works",
    organization: "Advisor",
    organizationName: "WSP Denmark",
    role: "Structural Advisor",
    person: { name: "Anna Nielsen", email: "anna.nielsen@wsp.com" },
    type: "responsible",
  },
  {
    id: "rr-004",
    workstream: "IT/Data Infrastructure",
    organization: "Owner",
    organizationName: "Ørsted A/S",
    role: "Project Director",
    person: { name: "Lars Møller", email: "lars.moller@orsted.dk" },
    type: "informed",
  },
  {
    id: "rr-005",
    workstream: "MEP Infrastructure",
    organization: "Authority",
    organizationName: "Region Syddanmark",
    role: "Compliance Officer",
    person: { name: "Mette Sørensen", email: "mette.sorensen@rsyd.dk" },
    type: "informed",
  },
];

export interface SeedRisk {
  riskId: string;
  title: string;
  status: "identified" | "assessed" | "mitigated" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  recurrence: "none" | "daily" | "weekly" | "monthly";
  workstreamIds: string[];
  notes: string;
  checklist: { id: string; text: string; completed: boolean }[];
  dueOffsetDays: number; // days from seeding date
}

export const SEED_RISKS: SeedRisk[] = [
  {
    riskId: "RK-001",
    title: "Groundwater ingress in foundation excavation",
    status: "assessed",
    priority: "high",
    recurrence: "weekly",
    workstreamIds: ["rr-001", "rr-003"],
    notes:
      "High water table observed during trial pits in the north-east plot. Risk of flooding the foundation excavation and delaying the concrete pour.",
    checklist: [
      { id: "c1", text: "Commission geotechnical survey", completed: true },
      { id: "c2", text: "Design dewatering plan", completed: false },
      { id: "c3", text: "Procure well-point pumps", completed: false },
    ],
    dueOffsetDays: 14,
  },
  {
    riskId: "RK-002",
    title: "Grid connection capacity not confirmed for Phase 1 load",
    status: "identified",
    priority: "critical",
    recurrence: "none",
    workstreamIds: ["rr-002", "rr-004"],
    notes:
      "Utility has not yet confirmed the 60kV grid connection capacity required for the Phase 1 IT load. Could block energization milestone.",
    checklist: [
      { id: "c1", text: "Submit grid capacity request to TSO", completed: true },
      { id: "c2", text: "Confirm transformer lead times", completed: false },
    ],
    dueOffsetDays: 30,
  },
  {
    riskId: "RK-003",
    title: "Structural cement supplier delivery delay",
    status: "mitigated",
    priority: "medium",
    recurrence: "monthly",
    workstreamIds: ["rr-001"],
    notes:
      "Primary cement supplier flagged a 3-week delay. Secondary supplier engaged as backup to protect the slab pour schedule.",
    checklist: [
      { id: "c1", text: "Qualify secondary supplier", completed: true },
      { id: "c2", text: "Update procurement schedule", completed: true },
      { id: "c3", text: "Confirm buffer stock on site", completed: false },
    ],
    dueOffsetDays: 7,
  },
];
