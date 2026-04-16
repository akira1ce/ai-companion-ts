"use client";

import { useRouter } from "next/navigation";
import { Avatar, Dropdown } from "antd";
import { Ellipsis, Settings, LogOut } from "lucide-react";
import type { MenuProps } from "antd";
import { useApp, appActions } from "@/stores";

export function UserNav() {
  const router = useRouter();
  const user = useApp((s) => s.user);

  if (!user) return null;

  const menuItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <Settings size={14} />,
      label: "设置",
      onClick: () => router.push("/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      label: "退出登录",
      danger: true,
      onClick: () => {
        appActions.clearUser();
        router.replace("/login");
      },
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Avatar size={28}>
        {(user.name || user.username)[0]}
      </Avatar>
      <span className="flex-1 truncate text-sm">{user.name || user.username}</span>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topRight">
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600">
          <Ellipsis size={16} />
        </button>
      </Dropdown>
    </div>
  );
}
