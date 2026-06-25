import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore, currentIdentity } from "./store/authStore";
import { useRiskStore } from "./store/riskStore";
import { seedIfEmpty } from "./lib/seed";
import { SEED_PROJECT } from "./lib/seedData";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import RiskDetail from "./pages/RiskDetail";
import RolesResponsibility from "./pages/RolesResponsibility";
import ModulePlaceholder from "./pages/ModulePlaceholder";
import AppShell from "./components/AppShell";

export default function App() {
  const { user, loading, init } = useAuthStore();
  const setProject = useRiskStore((s) => s.setProject);
  const subscribe = useRiskStore((s) => s.subscribe);

  useEffect(() => init(), [init]);

  useEffect(() => {
    if (!user) return;
    // Seed demo data on first run, then point the store at the project.
    const id = currentIdentity(user);
    void seedIfEmpty(id.uid).then(() => {
      setProject(SEED_PROJECT.id);
    });
  }, [user, setProject]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribe();
    return unsub;
  }, [user, subscribe]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/risks" element={<Dashboard />} />
        <Route path="/risks/:riskId" element={<RiskDetail />} />
        <Route path="/roles" element={<RolesResponsibility />} />
        <Route path="/settings" element={<ModulePlaceholder />} />
        <Route path="/m/:module" element={<ModulePlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
