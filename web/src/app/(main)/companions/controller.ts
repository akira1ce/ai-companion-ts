/* 「controller」 */

import { apiGetCompanions } from "./service";
import type { CompanionSchema } from "./type";

export async function getCompanions(): Promise<CompanionSchema[]> {
  const { data } = await apiGetCompanions();
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    personality: c.personality.join("、"),
  }));
}
