import { httpsCallable } from "firebase/functions";
import { functions } from "./config";
import type { Risk, RoleResponsibility } from "../types";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

interface AgentRequest {
  messages: AgentMessage[];
  riskContext: Record<string, unknown>;
}

interface AgentResponse {
  content: string;
}

const callAgent = httpsCallable<AgentRequest, AgentResponse>(
  functions,
  "riskManagerAgent"
);

/** Build a compact, AI-friendly context block from the current risk record. */
export function buildRiskContext(
  risk: Risk,
  roles: RoleResponsibility[]
): Record<string, unknown> {
  const involved = roles.filter((r) => risk.workstreamIds.includes(r.id));
  return {
    riskId: risk.riskId,
    title: risk.title,
    status: risk.status,
    priority: risk.priority,
    recurrence: risk.recurrence,
    dueDate: risk.dueDate ? risk.dueDate.toDate().toISOString() : null,
    notes: risk.notes,
    checklist: risk.checklist.map((c) => ({ text: c.text, done: c.completed })),
    involvedParties: involved.map((r) => ({
      workstream: r.workstream,
      organization: r.organizationName,
      orgType: r.organization,
      role: r.role,
      person: r.person.name,
      raci: r.type,
    })),
    statusHistory: risk.statusHistory.map((h) => ({
      from: h.from,
      to: h.to,
      comment: h.comment,
    })),
  };
}

export async function askRiskManager(
  messages: AgentMessage[],
  riskContext: Record<string, unknown>
): Promise<string> {
  const res = await callAgent({ messages, riskContext });
  return res.data.content;
}
