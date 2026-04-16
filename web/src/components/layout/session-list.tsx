"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { apiGetSessions, apiDeleteSession } from "@/services";
import { useSessionStore, useUserStore } from "@/stores";

export function SessionList() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { sessions, setSessions, removeSession } = useSessionStore();

  useEffect(() => {
    if (!user) return;
    apiGetSessions(user.id).then(({ data }) => {
      setSessions(
        data.map((s) => ({
          id: s.id,
          companionId: s.companion_id,
          title: s.title || "新会话",
          updatedAt: s.updated_at,
        })),
      );
    });
  }, [user, setSessions]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await apiDeleteSession(sessionId);
    removeSession(sessionId);
  };

  if (sessions.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-muted-foreground">暂无会话</p>
    );
  }

  return (
    <div className="space-y-0.5">
      {sessions.map((session) => {
        const href = `/chat/${session.id}`;
        const active = pathname === href;
        return (
          <Link
            key={session.id}
            href={href}
            className={cn(
              "group flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
            )}
          >
            <span className="truncate">{session.title}</span>
            <Button
              variant="ghost"
              size="sm"
              className="invisible h-5 w-5 p-0 text-muted-foreground hover:text-destructive group-hover:visible"
              onClick={(e) => handleDelete(e, session.id)}
            >
              &times;
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
