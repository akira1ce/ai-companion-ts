"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionList } from "./session-list";
import { UserNav } from "./user-nav";

const NAV_ITEMS = [
  { href: "/companions", label: "伴侣" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex h-14 shrink-0 items-center shadow px-4">
        <Link href="/companions" className="text-sm font-semibold">
          AI Companion
        </Link>
      </div>

      <nav className="shrink-0 space-y-0.5 p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-200 ${
              pathname === item.href ? "bg-gray-200 font-medium" : ""
            }`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center px-4 py-2">
        <span className="text-xs font-medium text-gray-400">会话</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <SessionList />
      </div>

      <div className="shrink-0 border-t border-gray-200 p-3">
        <UserNav />
      </div>
    </aside>
  );
}
