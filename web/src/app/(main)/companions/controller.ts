/* 「controller」 */

import { apiGetCompanions } from "@/services";
import type { CompanionItem } from "@/types";

export async function getCompanions(): Promise<CompanionItem[]> {
  const { data } = await apiGetCompanions();
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    personality: c.personality.join("、"),
  }));
}
