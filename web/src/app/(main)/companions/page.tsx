/* 「view」 */
"use client";

import { useCompanionsController } from "./controller";
import { CompanionCard } from "./components/companion-card";

export default function CompanionsPage() {
  const { companions, loading, handleSelect } = useCompanionsController();

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="text-lg font-semibold">选择你的伴侣</h1>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
      ) : companions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">暂无可用伴侣</p>
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
