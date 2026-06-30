import { useState } from "react";
import { Target, Tag, UserPlus } from "lucide-react";
import type { Risk, RoleResponsibility } from "../../types";
import { formatEdited, initials } from "../../lib/format";

interface Props {
  risk: Risk;
  roles: RoleResponsibility[];
  onTitleChange: (title: string) => void;
  onAssign: (roleId: string) => void;
}

export default function RiskHeader({
  risk,
  roles,
  onTitleChange,
  onAssign,
}: Props) {
  const [title, setTitle] = useState(risk.title);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="rounded-card bg-white px-6 py-4 shadow-card">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="shrink-0 text-[13px] font-medium text-gray-500">
            Risk Management Agent:
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== risk.title && onTitleChange(title)}
            className="min-w-0 flex-1 border-b border-transparent bg-transparent text-[22px] font-bold text-ink outline-none focus:border-indigo"
          />
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[11px] uppercase text-gray-400">ID</div>
          <div className="font-mono text-[13px] font-semibold text-gray-700">
            {risk.riskId}
          </div>
        </div>
      </div>

      {/* Audit line */}
      <div className="mt-1 text-[12px] text-gray-400">
        Created {formatEdited(risk.createdAt)} by you · Last edited{" "}
        {formatEdited(risk.updatedAt)} by you
      </div>

      {/* Quick-action rows */}
      <div className="mt-3 flex flex-col gap-1.5">
        <button
          disabled
          className="flex items-center gap-2 text-[13px] text-gray-300"
        >
          <Target size={15} /> Opret forbindelse til et mål
        </button>
        <button className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700">
          <Tag size={15} /> Tilføj mærkat
        </button>
        <div className="relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700"
          >
            <UserPlus size={15} /> Tildel til
          </button>
          {pickerOpen && (
            <div className="absolute z-20 mt-1 w-72 rounded-card border border-bordergray bg-white py-1 shadow-panel">
              {roles.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400">
                  No people defined in Roles &amp; Responsibility.
                </div>
              )}
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onAssign(r.id);
                    setPickerOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo/15 text-[10px] font-semibold text-indigo">
                    {initials(r.person.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-ink">
                      {r.person.name}
                    </span>
                    <span className="block truncate text-[11px] text-gray-400">
                      {r.workstream} · {r.role}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
