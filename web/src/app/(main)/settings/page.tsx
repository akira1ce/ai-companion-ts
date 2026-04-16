/* 「view」 */
"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@akira1ce/r-hooks";
import { useUserStore } from "@/stores";
import { getUser, updateUser } from "./controller";
import { ProfileForm } from "./components/profile-form";
import type { ApiUpdateUserReq } from "@/types";

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [saving, setSaving] = useState(false);

  const {
    data: profile,
    loading,
    run,
  } = useQuery(
    () => {
      if (!user) throw new Error("no user");
      return getUser(user.id);
    },
    { defaultData: null as never },
  );

  const handleSave = useCallback(
    async (params: ApiUpdateUserReq) => {
      if (!user) return;
      setSaving(true);
      try {
        const updated = await updateUser(user.id, params);
        setUser(updated);
        run();
      } finally {
        setSaving(false);
      }
    },
    [user, setUser, run],
  );

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="text-lg font-semibold">设置</h1>

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">加载中...</p>
      ) : !profile ? (
        <p className="mt-4 text-sm text-gray-500">未登录</p>
      ) : (
        <div className="mt-4">
          <ProfileForm profile={profile} saving={saving} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
