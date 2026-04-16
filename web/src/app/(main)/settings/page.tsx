/* 「view」 */
"use client";

import { useSettingsController } from "./controller";
import { ProfileForm } from "./components/profile-form";

export default function SettingsPage() {
  const { profile, loading, saving, handleSave } = useSettingsController();

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="text-lg font-semibold">设置</h1>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
      ) : !profile ? (
        <p className="mt-4 text-sm text-muted-foreground">未登录</p>
      ) : (
        <div className="mt-4">
          <ProfileForm profile={profile} saving={saving} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
