"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionList } from "./session-list";
import { UserNav } from "./user-nav";

const NAV_ITEMS = [
  { href: "/companions", label: "伴侣" },
  { href: "/settings", label: "设置" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r bg-sidebar">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <Link href="/companions" className="text-sm font-semibold">
          AI Companion
        </Link>
      </div>

      <nav className="shrink-0 space-y-0.5 p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href &&
                "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">会话</span>
      </div>

      <ScrollArea className="flex-1 px-2">
        <SessionList />
      </ScrollArea>

      <div className="shrink-0 border-t p-3">
        <UserNav />
      </div>
    </aside>
  );
}
