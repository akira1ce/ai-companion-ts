/* 「view」 */
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@akira1ce/r-hooks";
import { apiCreateSession } from "@/services";
import { useApp } from "@/stores";
import { getCompanions } from "./controller";
import { CompanionCard } from "./components/companion-card";

export default function CompanionsPage() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const { data: companions, loading } = useQuery(getCompanions, {
    defaultData: [],
  });

  const handleSelect = async (companionId: string) => {
    if (!user) return;
    const { data: session } = await apiCreateSession({
      userId: user.id,
      companionId,
    });
    router.push(`/chat/${session.id}`);
  };

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="text-lg font-semibold">选择你的伴侣</h1>

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">加载中...</p>
      ) : companions.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">暂无可用伴侣</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companions.map((c) => (
            <CompanionCard key={c.id} companion={c} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
