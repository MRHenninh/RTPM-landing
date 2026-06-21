import { useState } from "react";
import { Plus } from "lucide-react";
import type { RaciType, RoleResponsibility } from "../types";
import { useRiskStore } from "../store/riskStore";
import { upsertRole } from "../firebase/firestore";
import { toast } from "../lib/toast";

const ORG_TYPES = [
  "Owner",
  "Main Contractor",
  "Advisor",
  "Subcontractor",
  "Authority",
];

export default function RolesResponsibility() {
  const { roles, projectId } = useRiskStore();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(role: Partial<RoleResponsibility>) {
    setSavingId(role.id || "new");
    try {
      await upsertRole({ ...role, projectId });
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function addRow() {
    await save({
      workstream: "New Workstream",
      organization: "Main Contractor",
      organizationName: "",
      role: "",
      person: { name: "", email: "" },
      type: "responsible",
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-bordergray bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-ink">
            Roles &amp; Responsibility
          </h1>
          <p className="text-xs text-gray-400">
            Source of truth for workstream lookups and involved parties
          </p>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 rounded-btn bg-indigo px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo/90"
        >
          <Plus size={16} /> Add entry
        </button>
      </div>

      <div className="scroll-thin flex-1 overflow-auto p-6">
        <div className="overflow-hidden rounded-card border border-bordergray bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-3 py-2.5">Workstream</th>
                <th className="px-3 py-2.5">Organization</th>
                <th className="px-3 py-2.5">Org Name</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Person</th>
                <th className="px-3 py-2.5">Email</th>
                <th className="px-3 py-2.5">Type</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <Row key={r.id} role={r} onSave={save} saving={savingId === r.id} />
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-300">
                    No entries yet. Add the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({
  role,
  onSave,
  saving,
}: {
  role: RoleResponsibility;
  onSave: (r: Partial<RoleResponsibility>) => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState(role);

  const cell =
    "w-full bg-transparent px-1 py-1 text-sm outline-none focus:rounded focus:bg-indigo/5";

  function commit(next: RoleResponsibility) {
    setDraft(next);
    onSave(next);
  }

  return (
    <tr className={`border-t border-bordergray ${saving ? "opacity-60" : ""}`}>
      <td className="px-3 py-1.5">
        <input
          className={cell}
          value={draft.workstream}
          onChange={(e) => setDraft({ ...draft, workstream: e.target.value })}
          onBlur={() => commit(draft)}
        />
      </td>
      <td className="px-3 py-1.5">
        <select
          className={cell}
          value={draft.organization}
          onChange={(e) => commit({ ...draft, organization: e.target.value })}
        >
          {ORG_TYPES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-1.5">
        <input
          className={cell}
          value={draft.organizationName}
          onChange={(e) =>
            setDraft({ ...draft, organizationName: e.target.value })
          }
          onBlur={() => commit(draft)}
        />
      </td>
      <td className="px-3 py-1.5">
        <input
          className={cell}
          value={draft.role}
          onChange={(e) => setDraft({ ...draft, role: e.target.value })}
          onBlur={() => commit(draft)}
        />
      </td>
      <td className="px-3 py-1.5">
        <input
          className={cell}
          value={draft.person.name}
          onChange={(e) =>
            setDraft({ ...draft, person: { ...draft.person, name: e.target.value } })
          }
          onBlur={() => commit(draft)}
        />
      </td>
      <td className="px-3 py-1.5">
        <input
          className={cell}
          value={draft.person.email}
          onChange={(e) =>
            setDraft({
              ...draft,
              person: { ...draft.person, email: e.target.value },
            })
          }
          onBlur={() => commit(draft)}
        />
      </td>
      <td className="px-3 py-1.5">
        <select
          className={cell}
          value={draft.type}
          onChange={(e) =>
            commit({ ...draft, type: e.target.value as RaciType })
          }
        >
          <option value="responsible">Responsible (R)</option>
          <option value="informed">Informed (I)</option>
        </select>
      </td>
    </tr>
  );
}
