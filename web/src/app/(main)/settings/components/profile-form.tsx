"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile, ApiUpdateUserReq } from "@/types";

interface ProfileFormProps {
  profile: UserProfile;
  saving: boolean;
  onSave: (params: ApiUpdateUserReq) => void;
}

export function ProfileForm({ profile, saving, onSave }: ProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [interests, setInterests] = useState(profile.interests.join("、"));
  const [recentEvents, setRecentEvents] = useState(profile.recentEvents.join("、"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      occupation,
      interests: JSON.stringify(interests.split("、").filter(Boolean)),
      recent_events: JSON.stringify(recentEvents.split("、").filter(Boolean)),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">账号</Label>
        <Input id="username" value={profile.username} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">昵称</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">职业</Label>
        <Input
          id="occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">兴趣爱好（用顿号分隔）</Label>
        <Textarea
          id="interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recentEvents">近期事件（用顿号分隔）</Label>
        <Textarea
          id="recentEvents"
          value={recentEvents}
          onChange={(e) => setRecentEvents(e.target.value)}
          rows={2}
        />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
