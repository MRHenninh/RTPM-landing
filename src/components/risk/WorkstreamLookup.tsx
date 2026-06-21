import { X, Check } from "lucide-react";
import type { RoleResponsibility } from "../../types";
import { initials } from "../../lib/format";

interface Props {
  open: boolean;
  roles: RoleResponsibility[];
  selected: string[];
  onToggle: (roleId: string) => void;
  onClose: () => void;
}

export default function WorkstreamLookup({
  open,
  roles,
  selected,
  onToggle,
  onClose,
}: Props) {
  if (!open) return null;

  // Group R&R entries by workstream so the user picks at workstream granularity.
  const byWorkstream = roles.reduce<Record<string, RoleResponsibility[]>>(
    (acc, r) => {
      (acc[r.workstream] ||= []).push(r);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="flex h-full w-[380px] flex-col bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-bordergray px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">
            Look up in Roles &amp; Responsibility
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-auto p-4">
          {Object.entries(byWorkstream).map(([workstream, entries]) => (
            <div key={workstream} className="mb-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {workstream}
              </div>
              <div className="flex flex-col gap-1.5">
                {entries.map((r) => {
                  const isSel = selected.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => onToggle(r.id)}
                      className={`flex items-center gap-3 rounded-btn border px-3 py-2 text-left transition-colors ${
                        isSel
                          ? "border-indigo bg-indigo/5"
                          : "border-bordergray hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo/15 text-[10px] font-semibold text-indigo">
                        {initials(r.person.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium text-ink">
                          {r.person.name} · {r.role}
                        </span>
                        <span className="block truncate text-[11px] text-gray-400">
                          {r.organizationName} ({r.organization}) ·{" "}
                          {r.type === "responsible" ? "Responsible" : "Informed"}
                        </span>
                      </span>
                      {isSel && (
                        <Check size={16} className="shrink-0 text-indigo" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="text-sm text-gray-400">
              No workstreams defined yet. Add entries in Roles &amp;
              Responsibility.
            </p>
          )}
        </div>

        <div className="border-t border-bordergray px-5 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-btn bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo/90"
          >
            Done ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
