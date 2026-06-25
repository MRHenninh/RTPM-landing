import { Menu, Search, Bell } from "lucide-react";
import { useShellStore } from "../../store/shellStore";
import { useRiskStore } from "../../store/riskStore";
import { useAuthStore, currentIdentity } from "../../store/authStore";
import { overdueRisks } from "../../lib/shell";
import { initials } from "../../lib/format";

export default function Header() {
  const { mode, toggleFocus, dismissLanding, openTodos } = useShellStore();
  const risks = useRiskStore((s) => s.risks);
  const user = useAuthStore((s) => s.user);
  const me = currentIdentity(user);
  const overdue = overdueRisks(risks).length;

  function onToggle() {
    // From the landing screen the toggle drops straight into the workspace.
    if (mode === "landing") dismissLanding();
    else toggleFocus();
  }

  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between px-4 text-white"
      style={{ background: "#090693" }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-btn hover:bg-white/10"
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="font-head text-[18px] font-bold tracking-wide">
          RTPM
        </span>
        <span className="hidden text-white/50 sm:inline">·</span>
        <span className="hidden text-[14px] font-normal text-white/90 sm:inline">
          Viking DC — Phase 1
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-btn hover:bg-white/10"
          title="Search"
        >
          <Search size={18} />
        </button>
        <button
          onClick={openTodos}
          className="relative flex h-9 w-9 items-center justify-center rounded-btn hover:bg-white/10"
          title="My To Do's"
        >
          <Bell size={18} />
          {overdue > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-black"
              style={{ background: "#ffcc00" }}
            >
              {overdue}
            </span>
          )}
        </button>
        <div
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: "#0d08d2" }}
          title={me.name}
        >
          {initials(me.name)}
        </div>
      </div>
    </header>
  );
}
