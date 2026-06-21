import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, ShieldAlert, LogOut } from "lucide-react";
import { useAuthStore, currentIdentity } from "../store/authStore";
import { signOut } from "../firebase/auth";
import { initials } from "../lib/format";

export default function AppShell() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const id = currentIdentity(user);

  const navItem =
    "flex items-center gap-3 rounded-btn px-3 py-2 text-sm font-medium transition-colors";

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-bordergray bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-indigo text-white">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight text-ink">
              Risk Manager
            </div>
            <div className="text-[11px] text-gray-400">Construction risks</div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-indigo/10 text-indigo"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <LayoutGrid size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/roles"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-indigo/10 text-indigo"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Users size={18} /> Roles &amp; Responsibility
          </NavLink>
        </nav>

        {/* User footer */}
        <div className="border-t border-bordergray p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo/15 text-xs font-semibold text-indigo">
              {initials(id.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-ink">
                {id.name}
              </div>
              <div className="truncate text-[11px] text-gray-400">
                {user?.email}
              </div>
            </div>
            <button
              title="Sign out"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-fog">
        <Outlet />
      </main>
    </div>
  );
}
