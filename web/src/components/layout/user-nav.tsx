"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-xs">
          {(user.name || user.username)[0]}
        </AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate text-sm">{user.name || user.username}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground"
        onClick={handleLogout}
      >
        退出
      </Button>
    </div>
  );
}
