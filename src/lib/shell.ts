import {
  LayoutGrid,
  FileText,
  Mail,
  AlertTriangle,
  HelpCircle,
  Repeat,
  Link2,
  Target,
  Wrench,
  Timer,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Risk, RoleResponsibility } from "../types";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  to: string;
  /** Which risk-derived badge to show, if any. */
  badge?: "open" | "overdue";
}

export interface NavSection {
  heading?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: "Dashboard", icon: LayoutGrid, to: "/" }],
  },
  {
    heading: "Modules",
    items: [
      { label: "Documents", icon: FileText, to: "/m/documents" },
      { label: "Correspondence", icon: Mail, to: "/m/correspondence" },
      { label: "NCR", icon: AlertTriangle, to: "/m/ncr" },
      { label: "RFI", icon: HelpCircle, to: "/m/rfi" },
      { label: "Change Management", icon: Repeat, to: "/m/change" },
      { label: "Interface Management", icon: Link2, to: "/m/interface" },
      { label: "Risk Management", icon: Target, to: "/risks", badge: "open" },
      { label: "Technical Query", icon: Wrench, to: "/m/technical-query" },
      { label: "Time Log", icon: Timer, to: "/m/time-log" },
    ],
  },
  {
    items: [
      { label: "Roles & Responsibility", icon: Users, to: "/roles" },
      { label: "Settings", icon: Settings, to: "/settings" },
    ],
  },
];

/** Risks that are past due and not yet resolved. */
export function overdueRisks(risks: Risk[]): Risk[] {
  const now = Date.now();
  return risks.filter(
    (r) =>
      r.status !== "resolved" &&
      r.dueDate &&
      r.dueDate.toDate().getTime() < now
  );
}

export function openRisks(risks: Risk[]): Risk[] {
  return risks.filter((r) => r.status !== "resolved");
}

export function daysOverdue(risk: Risk): number {
  if (!risk.dueDate) return 0;
  const diff = Date.now() - risk.dueDate.toDate().getTime();
  return diff > 0 ? Math.ceil(diff / 86400000) : 0;
}

export interface TodoItem {
  risk: Risk;
  daysOverdue: number;
}

/**
 * Split risks into the signed-in user's "Responsible" and "Informed" buckets.
 * Until per-user role mapping exists, derive from the RACI type of the risk's
 * linked workstream roles (responsible / informed).
 */
export function deriveTodos(
  risks: Risk[],
  roles: RoleResponsibility[]
): { responsible: TodoItem[]; informed: TodoItem[] } {
  const responsibleRoleIds = new Set(
    roles.filter((r) => r.type === "responsible").map((r) => r.id)
  );
  const informedRoleIds = new Set(
    roles.filter((r) => r.type === "informed").map((r) => r.id)
  );

  const responsible: TodoItem[] = [];
  const informed: TodoItem[] = [];

  for (const risk of risks) {
    if (risk.status === "resolved") continue;
    const isResponsible = risk.workstreamIds.some((id) =>
      responsibleRoleIds.has(id)
    );
    const isInformed = risk.workstreamIds.some((id) => informedRoleIds.has(id));
    if (isResponsible) {
      responsible.push({ risk, daysOverdue: daysOverdue(risk) });
    } else if (isInformed) {
      informed.push({ risk, daysOverdue: daysOverdue(risk) });
    }
  }
  return { responsible, informed };
}
