/* 「controller」 */

import { useEffect, useState, useCallback } from "react";
import { apiGetUser, apiUpdateUser } from "@/services";
import { useUserStore } from "@/stores";
import type { UserProfile, ApiUpdateUserReq } from "@/types";

function parseUserProfile(data: {
  id: string;
  name?: string;
  username: string;
  occupation?: string;
  interests?: string;
  recent_events?: string;
}): UserProfile {
  return {
    id: data.id,
    name: data.name ?? "",
    username: data.username,
    occupation: data.occupation ?? "",
    interests: data.interests ? JSON.parse(data.interests) : [],
    recentEvents: data.recent_events ? JSON.parse(data.recent_events) : [],
  };
}

export function useSettingsController() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiGetUser(user.id)
      .then(({ data }) => {
        const parsed = parseUserProfile(data);
        setProfile(parsed);
        setUser(parsed);
      })
      .finally(() => setLoading(false));
  }, [user, setUser]);

  const handleSave = useCallback(
    async (params: ApiUpdateUserReq) => {
      if (!user) return;
      setSaving(true);
      try {
        await apiUpdateUser(user.id, params);
        const { data } = await apiGetUser(user.id);
        const parsed = parseUserProfile(data);
        setProfile(parsed);
        setUser(parsed);
      } finally {
        setSaving(false);
      }
    },
    [user, setUser],
  );

  return { profile, loading, saving, handleSave };
}
