import { useNavigate } from "react-router-dom";
import { RISK_STATUSES } from "../types";
import { useRiskStore } from "../store/riskStore";
import { overdueRisks, openRisks } from "../lib/shell";
import { RISK_STATUS_CHIP, PRIORITY_CHIP, STATUS_LABEL, formatDate } from "../lib/format";

export default function Overview() {
  const { risks } = useRiskStore();
  const navigate = useNavigate();

  const overdue = overdueRisks(risks);
  const open = openRisks(risks);
  const critical = risks.filter(
    (r) => r.priority === "critical" && r.status !== "resolved"
  );

  const kpis = [
    { label: "Total risks", value: risks.length, color: "#0d08d2" },
    { label: "Open", value: open.length, color: "#ff8b00" },
    { label: "Overdue", value: overdue.length, color: "#e63946" },
    { label: "Critical", value: critical.length, color: "#e63946" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div
        className="border-b bg-white px-6 py-4"
        style={{ borderColor: "#e7e6fa" }}
      >
        <h1 className="font-head text-[24px] font-bold text-[#0d08d2]">
          Dashboard
        </h1>
        <p className="text-[13px] text-graytext">Viking DC — Phase 1 overview</p>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto p-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-card border bg-white p-4 shadow-card"
              style={{ borderColor: "#e7e6fa" }}
            >
              <div
                className="font-head text-[32px] font-bold leading-none"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <div className="mt-1 text-[12px] font-medium text-graytext">
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* By status */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            className="rounded-card border bg-white p-5 shadow-card"
            style={{ borderColor: "#e7e6fa" }}
          >
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-graytext">
              Risks by status
            </h2>
            <div className="flex flex-col gap-2">
              {RISK_STATUSES.map((status) => {
                const count = risks.filter((r) => r.status === status).length;
                const chip = RISK_STATUS_CHIP[status];
                const pct = risks.length ? (count / risks.length) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span
                      className="w-24 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold"
                      style={{ background: chip.bg, color: chip.text }}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7e6fa]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: chip.bg }}
                      />
                    </div>
                    <span className="w-6 text-right text-[13px] font-semibold text-ink">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overdue list */}
          <div
            className="rounded-card border bg-white p-5 shadow-card"
            style={{ borderColor: "#e7e6fa" }}
          >
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-graytext">
              Overdue &amp; at risk
            </h2>
            {overdue.length === 0 ? (
              <div className="py-6 text-center text-[13px] text-graytext">
                Nothing overdue 🎉
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {overdue.map((risk) => {
                  const prio = PRIORITY_CHIP[risk.priority];
                  return (
                    <button
                      key={risk.id}
                      onClick={() => navigate(`/risks/${risk.id}`)}
                      className="flex items-center gap-2 rounded-btn px-2 py-1.5 text-left hover:bg-[#e7e6fa]/40"
                    >
                      <span className="font-mono text-[11px] font-semibold text-graytext">
                        {risk.riskId}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
                        {risk.title}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: prio.bg, color: prio.text }}
                      >
                        {prio.label}
                      </span>
                      <span className="shrink-0 text-[11px] text-graytext">
                        {formatDate(risk.dueDate)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
