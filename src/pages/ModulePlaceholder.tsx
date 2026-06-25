import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";
import { NAV_SECTIONS } from "../lib/shell";

/** Generic "coming soon" page for modules not yet implemented. */
export default function ModulePlaceholder() {
  const { pathname } = useLocation();

  const match = NAV_SECTIONS.flatMap((s) => s.items).find(
    (i) => i.to === pathname
  );
  const title =
    match?.label ||
    pathname
      .split("/")
      .filter(Boolean)
      .pop()!
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex h-full flex-col">
      <div
        className="border-b bg-white px-6 py-4"
        style={{ borderColor: "#e7e6fa" }}
      >
        <h1 className="font-head text-[24px] font-bold text-[#0d08d2]">
          {title}
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-graytext">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7e6fa] text-[#0d08d2]">
            <Construction size={26} />
          </div>
          <div className="text-[15px] font-semibold text-ink">
            {title} module
          </div>
          <div className="max-w-sm text-[13px]">
            This module is part of the RTPM roadmap and isn't built yet. Risk
            Management is the active module for now.
          </div>
        </div>
      </div>
    </div>
  );
}
