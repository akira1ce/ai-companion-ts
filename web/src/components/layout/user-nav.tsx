"use client";

import { useRouter } from "next/navigation";
import { Avatar, Button } from "antd";
import { useUserStore } from "@/stores";

export function UserNav() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

  if (!user) return null;

  const handleLogout = () => {
    clearUser();
    router.replace("/login");
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar size={28}>
        {(user.name || user.username)[0]}
      </Avatar>
      <span className="flex-1 truncate text-sm">{user.name || user.username}</span>
      <Button type="text" size="small" onClick={handleLogout} className="text-gray-400">
        退出
      </Button>
    </div>
  );
}
