import { useState } from "react";
import { Bot, ArrowRight } from "lucide-react";
import { useShellStore } from "../../store/shellStore";
import { useRiskStore } from "../../store/riskStore";
import { useAuthStore, currentIdentity } from "../../store/authStore";
import { overdueRisks } from "../../lib/shell";
import { SEED_PROJECT } from "../../lib/seedData";

const SUGGESTIONS = [
  "Show critical risks",
  "How many open RFIs?",
  "Draft weekly report",
];

export default function LandingOverlay() {
  const { dismissLanding, sendPM } = useShellStore();
  const risks = useRiskStore((s) => s.risks);
  const user = useAuthStore((s) => s.user);
  const me = currentIdentity(user);
  const overdue = overdueRisks(risks).length;
  const [text, setText] = useState("");

  function go(message?: string) {
    const value = (message ?? text).trim();
    if (value) void sendPM(value);
    dismissLanding();
  }

  return (
    <div className="absolute inset-0 z-40">
      {/* Dimmed dashboard backdrop — click to enter the workspace */}
      <div
        onClick={() => dismissLanding()}
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(13,8,210,0.65)" }}
      />

      {/* Centered card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-[480px] max-w-full rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{ background: "#0d08d2" }}
            >
              <Bot size={24} />
            </div>
            <div>
              <h1 className="font-head text-[24px] font-bold leading-tight text-[#0d08d2]">
                Project Manager Agent
              </h1>
            </div>
          </div>

          <p className="mt-3 text-[14px] text-graytext">
            God morgen, {me.name}. {SEED_PROJECT.name} has{" "}
            <span className="font-semibold text-ink">{overdue}</span> overdue{" "}
            {overdue === 1 ? "risk" : "risks"}.
          </p>

          {/* Chat input */}
          <div className="mt-4 flex items-center gap-2">
            <input
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Ask anything about Viking DC..."
              className="flex-1 rounded-btn border px-3 py-2.5 text-[14px] outline-none focus:border-[#0d08d2]"
              style={{ borderColor: "#0d08d2" }}
            />
            <button
              onClick={() => go()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn text-black"
              style={{ background: "#ffcc00" }}
              title="Ask"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => go(s)}
                className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0d08d2] transition-colors hover:brightness-95"
                style={{ background: "#e7e6fa" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
