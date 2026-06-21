import { Users } from "lucide-react";
import type { RoleResponsibility } from "../../types";
import { orgAccent } from "../../lib/format";

interface Props {
  roles: RoleResponsibility[];
  selectedIds: string[];
}

interface OrgGroup {
  organizationName: string;
  organization: string;
  entries: RoleResponsibility[];
}

function groupByOrg(roles: RoleResponsibility[]): OrgGroup[] {
  const map = new Map<string, OrgGroup>();
  for (const r of roles) {
    const key = r.organizationName;
    if (!map.has(key)) {
      map.set(key, {
        organizationName: r.organizationName,
        organization: r.organization,
        entries: [],
      });
    }
    map.get(key)!.entries.push(r);
  }
  return [...map.values()];
}

function Column({ title, groups }: { title: string; groups: OrgGroup[] }) {
  return (
    <div className="flex-1">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </div>
      {groups.length === 0 && (
        <div className="text-[11px] text-gray-300">None</div>
      )}
      <div className="flex flex-col gap-2">
        {groups.map((g) => (
          <div
            key={g.organizationName}
            className="rounded-r-md bg-gray-50 py-1.5 pl-3 pr-2"
            style={{ borderLeft: `3px solid ${orgAccent(g.organization)}` }}
          >
            <div className="text-[12px] font-semibold text-gray-800">
              {g.organizationName}{" "}
              <span className="font-normal text-gray-400">
                ({g.organization})
              </span>
            </div>
            {g.entries.map((e) => (
              <div key={e.id} className="text-[11px] text-gray-500">
                › {e.workstream}: {e.person.name} — {e.role}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InvolvedPartiesCard({ roles, selectedIds }: Props) {
  const involved = roles.filter((r) => selectedIds.includes(r.id));
  const responsible = groupByOrg(
    involved.filter((r) => r.type === "responsible")
  );
  const informed = groupByOrg(involved.filter((r) => r.type === "informed"));

  return (
    <div className="rounded-card border border-bordergray bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-gray-700">
        <Users size={15} /> Involved in this risk
      </div>
      {involved.length === 0 ? (
        <p className="text-xs text-gray-400">
          Select one or more workstreams to see responsible and informed parties.
        </p>
      ) : (
        <div className="flex gap-6">
          <Column title="Responsible (R)" groups={responsible} />
          <Column title="Informed (I)" groups={informed} />
        </div>
      )}
    </div>
  );
}
