/* 「service」 */

import { http } from "@/lib/request";
import type { ApiCompanion } from "@/types";

export const apiGetCompanions = (): Promise<{ data: ApiCompanion[] }> => {
  return http.get<ApiCompanion[]>("/api/companions");
};
