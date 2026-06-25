import { useNavigate } from "react-router-dom";
import { X, Target } from "lucide-react";
import { useShellStore } from "../../store/shellStore";
import { useRiskStore } from "../../store/riskStore";
import { deriveTodos, type TodoItem } from "../../lib/shell";
import { PRIORITY_CHIP } from "../../lib/format";

export default function MyTodosOverlay() {
  const { closeTodos } = useShellStore();
  const { risks, roles } = useRiskStore();
  const navigate = useNavigate();
  const { responsible, informed } = deriveTodos(risks, roles);
  const empty = responsible.length === 0 && informed.length === 0;

  function open(riskDocId: string) {
    closeTodos();
    navigate(`/risks/${riskDocId}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={closeTodos} />

      <div className="relative flex h-full w-[480px] max-w-full flex-col bg-white shadow-panel">
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "#e7e6fa" }}
        >
          <h2 className="font-head text-[20px] font-bold text-[#0d08d2]">
            My To Do's
          </h2>
          <button
            onClick={closeTodos}
            className="flex h-8 w-8 items-center justify-center rounded-full text-graytext hover:bg-[#e7e6fa]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto p-5">
          {empty ? (
            <div className="mt-16 text-center text-[15px] text-graytext">
              All clear 🎉
            </div>
          ) : (
            <>
              <Section
                title="Responsible"
                subtitle="Items you must act on"
                items={responsible}
                showPriority
                onOpen={open}
              />
              <Section
                title="Informed"
                subtitle="Items you're kept across"
                items={informed}
                showPriority={false}
                onOpen={open}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  items,
  showPriority,
  onOpen,
}: {
  title: string;
  subtitle: string;
  items: TodoItem[];
  showPriority: boolean;
  onOpen: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="mb-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-graytext">
          {title}
        </div>
        <div className="text-[11px] text-graytext/70">{subtitle}</div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(({ risk, daysOverdue }) => {
          const prio = PRIORITY_CHIP[risk.priority];
          return (
            <button
              key={risk.id}
              onClick={() => onOpen(risk.id)}
              className="flex items-center gap-3 rounded-card border px-3 py-2.5 text-left transition-colors hover:bg-[#e7e6fa]/40"
              style={{ borderColor: "#e7e6fa" }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7e6fa] text-[#0d08d2]">
                <Target size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-graytext">
                    {risk.riskId}
                  </span>
                  {showPriority && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: prio.bg, color: prio.text }}
                    >
                      {prio.label}
                    </span>
                  )}
                  {daysOverdue > 0 && (
                    <span className="text-[10px] font-semibold text-critical">
                      {daysOverdue}d overdue
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-semibold text-ink">
                  {risk.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
