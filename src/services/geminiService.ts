import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../firebase/config";
import type { Risk, RoleResponsibility } from "../types";

// ---------------------------------------------------------------------------
// Message shape passed in from the chat panel.
// ---------------------------------------------------------------------------
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Backwards-compatible alias so existing imports keep working.
export type AgentMessage = ChatMessage;

// ---------------------------------------------------------------------------
// System prompt — RTPM Risk Manager AI, Viking DC programme context.
// (Replaces the prompt logic previously held in functions/src/index.ts.)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are the RTPM Risk Manager AI for Viking DC — a hyperscale data centre construction programme in Denmark managed by the Owner's Representative. You understand RAG status (RED/AMBER/GREEN), OFCI procurement, commissioning levels L0-L5, NEC4 compensation events, and workstream ownership. Next-Step Owner logic: Identified = Package PM, Assessed = Lead Scheduler, Mitigated = Quality Manager, Resolved = Commissioning Authority (CxA). Always be direct. Flag critical path impacts immediately. Sign off as: Risk Manager AI`;

const MODEL = "gemini-2.0-flash";

/**
 * Build a compact, AI-friendly context block from the current risk record.
 * (Moved verbatim from the former firebase/agent.ts so the frontend no longer
 * depends on the Firebase Cloud Function.)
 */
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
    workstream: risk.workstream ?? null,
    nextStepOwner: risk.nextStepOwner ?? null,
    likelihood: risk.likelihood ?? null,
    impact: risk.impact ?? null,
    score: risk.score ?? null,
    checklist: risk.checklist?.map((c) => ({ text: c.text, done: c.completed })),
    involvedParties: involved.map((r) => ({
      workstream: r.workstream,
      organization: r.organizationName,
      orgType: r.organization,
      role: r.role,
      person: r.person.name,
      raci: r.type,
    })),
    statusHistory: risk.statusHistory?.map((h) => ({
      from: h.from,
      to: h.to,
      comment: h.comment,
    })),
  };
}

/**
 * Call Gemini directly from the frontend with the full conversation history
 * and the current risk context injected into the system instruction.
 *
 * Requires the user to be authenticated and VITE_GEMINI_API_KEY to be set.
 */
/**
 * Build a programme-wide context block from ALL project risks, for the global
 * Project Manager assistant (right panel / landing card).
 */
export function buildProjectContext(
  risks: Risk[]
): Record<string, unknown> {
  const now = Date.now();
  const overdue = risks.filter(
    (r) =>
      r.status !== "resolved" &&
      r.dueDate &&
      r.dueDate.toDate().getTime() < now
  );
  return {
    project: "Viking DC — Phase 1",
    totalRisks: risks.length,
    byStatus: {
      identified: risks.filter((r) => r.status === "identified").length,
      assessed: risks.filter((r) => r.status === "assessed").length,
      mitigated: risks.filter((r) => r.status === "mitigated").length,
      resolved: risks.filter((r) => r.status === "resolved").length,
    },
    overdueCount: overdue.length,
    risks: risks.map((r) => ({
      id: r.riskId,
      title: r.title,
      status: r.status,
      priority: r.priority,
      workstream: r.workstream ?? null,
      score: r.score ?? null,
      nextStepOwner: r.nextStepOwner ?? null,
      dueDate: r.dueDate ? r.dueDate.toDate().toISOString() : null,
      notes: r.notes,
    })),
  };
}

export async function askRiskManager(
  messages: ChatMessage[],
  riskContext: Record<string, unknown>
): Promise<string> {
  // Keep the authentication check — user must be signed in to use AI chat.
  if (!auth.currentUser) {
    throw new Error("You must be signed in to use the Risk Agent.");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Add it to your .env file."
    );
  }

  if (messages.length === 0) {
    throw new Error("No message to send.");
  }

  const contextBlock = `Current risk context:\n${JSON.stringify(
    riskContext,
    null,
    2
  )}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: `${SYSTEM_PROMPT}\n\n${contextBlock}`,
  });

  // Gemini chat history must start with a user turn and alternate. Our agent
  // threads already alternate user/assistant, so map all but the last message
  // into history and send the final user message.
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));
  const last = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(last.content);
  return result.response.text();
}
