"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { apiGetSessions, apiDeleteSession } from "@/services";
import { useApp, useSession, sessionActions } from "@/stores";

export function SessionList() {
  const pathname = usePathname();
  const user = useApp((s) => s.user);
  const sessions = useSession((s) => s.sessions);

  useEffect(() => {
    if (!user) return;
    apiGetSessions(user.id).then(({ data }) => {
      sessionActions.setSessions(
        data.map((s) => ({
          id: s.id,
          companionId: s.companion_id,
          title: s.title || "新会话",
          updatedAt: s.updated_at,
        })),
      );
    });
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await apiDeleteSession(sessionId);
    sessionActions.removeSession(sessionId);
  };

  if (sessions.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-gray-400">暂无会话</p>
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
            className={`group flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-200 ${
              active ? "bg-gray-200 font-medium" : ""
            }`}
          >
            <span className="truncate">{session.title}</span>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              className="invisible h-5! w-5! min-w-0! text-gray-400 hover:text-red-500! group-hover:visible"
              onClick={(e) => handleDelete(e, session.id)}
            />
          </Link>
        );
      })}
    </div>
  );
}
