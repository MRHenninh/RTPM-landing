/**
 * Seed the 6 Viking DC demo risks into the Firestore "risks" collection.
 *
 * Usage (run against the live rtpm-cf560 project):
 *   export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
 *   npx ts-node --esm scripts/seedRisks.ts
 *   # or: npm run seed:risks
 *
 * The app filters the risk board by projectId, so each risk is written with
 * PROJECT_ID below (the project the app auto-seeds on first run). Override with
 * the RTPM_PROJECT_ID env var if your deployment uses a different project doc.
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "node:fs";

const PROJECT_ID = process.env.RTPM_PROJECT_ID || "datacenter-vejle-phase-1";

const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json";

if (existsSync(KEY_PATH)) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(KEY_PATH, "utf8"))) });
} else {
  initializeApp({ credential: applicationDefault() });
}

const db = getFirestore();

type Status = "identified" | "assessed" | "mitigated" | "resolved";
type Priority = "low" | "medium" | "high" | "critical";

interface SeedRisk {
  riskId: string;
  title: string;
  status: Status;
  workstream: string;
  likelihood: number;
  impact: number;
  score: number;
  nextStepOwner: string;
  priority: Priority;
  description: string;
}

const RISKS: SeedRisk[] = [
  {
    riskId: "RISK-001",
    title: "HV Transformer Delivery Delay",
    status: "assessed",
    workstream: "Finance & Contract",
    likelihood: 4,
    impact: 5,
    score: 20,
    nextStepOwner: "Lead Scheduler",
    priority: "high",
    description:
      "Main 60MVA transformer lead time extended to 110 weeks. Forecast delivery 6 weeks behind Baseline ROS Date. Energisation milestone at risk.",
  },
  {
    riskId: "RISK-002",
    title: "MV Switchgear FAT Failure",
    status: "mitigated",
    workstream: "Design & Engineering",
    likelihood: 3,
    impact: 4,
    score: 12,
    nextStepOwner: "Quality Manager",
    priority: "high",
    description:
      "Protection relay injection test failed on first witness. NCR raised. Cure period active - 18 days remaining before contractor installation window opens.",
  },
  {
    riskId: "RISK-003",
    title: "Energinet Grid Connection Delay",
    status: "identified",
    workstream: "Permit & Authorities",
    likelihood: 4,
    impact: 5,
    score: 20,
    nextStepOwner: "Package PM",
    priority: "high",
    description:
      "Energinet maturation phase approval 8 weeks behind programme. Hard constraint on utility energisation milestone. Zero float available.",
  },
  {
    riskId: "RISK-004",
    title: "MEP / OFCI Interface Scope Gap",
    status: "identified",
    workstream: "HSE",
    likelihood: 3,
    impact: 3,
    score: 9,
    nextStepOwner: "Package PM",
    priority: "medium",
    description:
      "Scope boundary dispute between MEP contractor and OFCI installation team on HV cable termination. Level 3 pre-commissioning at risk.",
  },
  {
    riskId: "RISK-005",
    title: "Generator Set Delivery - Port Congestion",
    status: "assessed",
    workstream: "Finance & Contract",
    likelihood: 2,
    impact: 3,
    score: 6,
    nextStepOwner: "Lead Scheduler",
    priority: "medium",
    description:
      "2.5MW diesel generator vessel delayed at Hamburg. Oversize transport permit not yet approved by Vejdirektoratet.",
  },
  {
    riskId: "RISK-006",
    title: "Commissioning Level 4 Sequence Conflict",
    status: "resolved",
    workstream: "Project Management",
    likelihood: 3,
    impact: 5,
    score: 15,
    nextStepOwner: "Commissioning Authority",
    priority: "high",
    description:
      "UPS installation 3 weeks behind. Level 4 integrated systems test cannot start without full UPS energisation. COD date was under pressure. CxA confirmed zero residual impact after recovery plan executed. Closed.",
  },
];

async function main() {
  console.log(`Seeding ${RISKS.length} Viking DC risks into project "${PROJECT_ID}"…`);

  for (const r of RISKS) {
    // Use the human-readable riskId as the document id so re-running is idempotent.
    await db
      .collection("risks")
      .doc(r.riskId)
      .set({
        projectId: PROJECT_ID,
        riskId: r.riskId,
        title: r.title,
        status: r.status,
        priority: r.priority,
        workstream: r.workstream,
        likelihood: r.likelihood,
        impact: r.impact,
        score: r.score,
        nextStepOwner: r.nextStepOwner,
        notes: r.description,
        // Fields the app UI expects to exist.
        startDate: null,
        dueDate: null,
        recurrence: "none",
        collection: "Viking DC",
        workstreamIds: [],
        checklist: [],
        attachments: [],
        statusHistory: [],
        createdBy: "seed-script",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    console.log(`  ✓ ${r.riskId} - ${r.title} (${r.status}, score ${r.score})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
