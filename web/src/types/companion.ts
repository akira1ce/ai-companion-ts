/* 「service-type」 */

export interface ApiCompanion {
  id: string;
  name: string;
  personality: string[];
}

export interface ApiCompanionListRes {
  data: ApiCompanion[];
}

/* 「controller-type」 */

export interface CompanionItem {
  id: string;
  name: string;
  personality: string;
}
