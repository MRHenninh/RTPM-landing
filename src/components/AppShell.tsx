import { Outlet } from "react-router-dom";
import { useShellStore } from "../store/shellStore";
import Header from "./shell/Header";
import Sidebar from "./shell/Sidebar";
import ProjectManagerPanel from "./shell/ProjectManagerPanel";
import LandingOverlay from "./shell/LandingOverlay";
import MyTodosOverlay from "./shell/MyTodosOverlay";

export default function AppShell() {
  const mode = useShellStore((s) => s.mode);
  const todosOpen = useShellStore((s) => s.todosOpen);
  const workspace = mode !== "landing";

  return (
    <div className="flex h-full flex-col">
      <Header />

      <div className="relative flex flex-1 overflow-hidden">
        {workspace && (
          <div className="anim-slide-left h-full">
            <Sidebar collapsed={mode === "focus"} />
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-hidden bg-fog">
          <Outlet />
        </main>

        {workspace && (
          <div className="anim-slide-right h-full">
            <ProjectManagerPanel />
          </div>
        )}

        {mode === "landing" && <LandingOverlay />}
      </div>

      {todosOpen && <MyTodosOverlay />}
    </div>
  );
}
