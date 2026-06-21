import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import Anthropic from "@anthropic-ai/sdk";

// Store the key as a Functions secret:
//   firebase functions:secrets:set ANTHROPIC_API_KEY
const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

const SYSTEM_PROMPT = `You are Risk Manager, an expert AI agent for large-scale data center construction projects.
You help project teams identify, assess, mitigate, and resolve construction risks.
You have access to the current risk record context provided in each message, including:
- Risk title, current status, priority, workstream, involved parties
- Risk history and notes

Your role:
- Analyze risks and suggest mitigation strategies
- Ask clarifying questions to refine risk assessment
- Suggest probability and impact scores (1-5 scale)
- Recommend responsible parties and escalation paths
- Draft risk register entries in plain language
- Flag if a risk requires immediate escalation

Keep responses concise, professional, and construction-specific.
Use the ISO 31000 risk management framework as your reference.
Always sign off responses as: Risk Manager`;

interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

interface AgentRequest {
  messages: AgentMessage[];
  riskContext: Record<string, unknown>;
}

export const riskManagerAgent = onCall<AgentRequest>(
  { secrets: [ANTHROPIC_API_KEY], cors: true, enforceAppCheck: false },
  async (request) => {
    // Require an authenticated caller.
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to use Risk Manager."
      );
    }

    const { messages, riskContext } = request.data || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new HttpsError("invalid-argument", "messages array is required.");
    }

    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY.value() });

    const contextBlock = `Current risk context:\n${JSON.stringify(
      riskContext ?? {},
      null,
      2
    )}`;

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: `${SYSTEM_PROMPT}\n\n${contextBlock}`,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const first = response.content[0];
      return {
        content: first && first.type === "text" ? first.text : "",
      };
    } catch (err) {
      console.error("Anthropic request failed", err);
      throw new HttpsError(
        "internal",
        "Risk Manager could not generate a response."
      );
    }
  }
);
