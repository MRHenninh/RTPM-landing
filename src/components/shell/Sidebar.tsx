import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { NAV_SECTIONS, openRisks, type NavItem } from "../../lib/shell";
import { useRiskStore } from "../../store/riskStore";
import { useAuthStore, currentIdentity } from "../../store/authStore";
import { signOut } from "../../firebase/auth";
import { initials } from "../../lib/format";

interface Props {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: Props) {
  const risks = useRiskStore((s) => s.risks);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const me = currentIdentity(user);

  const openCount = openRisks(risks).length;
  const badgeFor = (item: NavItem): number | null => {
    if (item.badge === "open") return openCount || null;
    return null;
  };

  return (
    <aside
      className="flex h-full shrink-0 flex-col text-white transition-[width] duration-200 ease-in-out"
      style={{ width: collapsed ? 60 : 220, background: "#070474" }}
    >
      <nav className="scroll-thin flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className="mb-2">
            {section.heading && !collapsed && (
              <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                {section.heading}
              </div>
            )}
            {section.heading && collapsed && (
              <div className="mx-3 my-2 border-t border-white/10" />
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const badge = badgeFor(item);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group relative mb-0.5 flex items-center gap-3 rounded-btn px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "text-[#0d08d2]"
                        : "text-white hover:bg-[#090693]"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          background: "#e7e6fa",
                          borderLeft: "3px solid #ffcc00",
                          paddingLeft: collapsed ? 9 : 9,
                        }
                      : undefined
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && badge && (
                    <span
                      className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                      style={{ background: "#0d08d2" }}
                    >
                      {badge}
                    </span>
                  )}
                  {collapsed && badge && (
                    <span
                      className="absolute right-1 top-1 h-2 w-2 rounded-full"
                      style={{ background: "#ffcc00" }}
                    />
                  )}
                  {/* Tooltip in focus mode */}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-full z-30 ml-2 hidden whitespace-nowrap rounded-btn bg-[#070474] px-2 py-1 text-[12px] text-white shadow-panel group-hover:block">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
            {initials(me.name)}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-white">
                  {me.name}
                </div>
                <div className="truncate text-[11px] text-white/50">
                  {user?.email}
                </div>
              </div>
              <button
                title="Sign out"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="text-white/60 hover:text-white"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
