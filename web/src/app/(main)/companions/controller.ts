/* 「controller」 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGetCompanions, apiCreateSession } from "@/services";
import { useCompanionStore } from "@/stores";
import { useUserStore } from "@/stores";
import type { CompanionItem } from "@/types";

async function fetchCompanionList(): Promise<CompanionItem[]> {
  const { data } = await apiGetCompanions();
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    personality: c.personality.join("、"),
  }));
}

export function useCompanionsController() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { companions, setCompanions } = useCompanionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanionList()
      .then(setCompanions)
      .finally(() => setLoading(false));
  }, [setCompanions]);

  const handleSelect = useCallback(
    async (companionId: string) => {
      if (!user) return;
      const { data: session } = await apiCreateSession({
        userId: user.id,
        companionId,
      });
      router.push(`/chat/${session.id}`);
    },
    [user, router],
  );

  return { companions, loading, handleSelect };
}
