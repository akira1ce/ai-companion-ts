/* 「view」 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiLogin } from "@/services";
import { useUserStore } from "@/stores";
import type { UserProfile } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await apiLogin(username, password);
      const profile: UserProfile = {
        id: data.id,
        name: data.name ?? "",
        username: data.username,
        occupation: data.occupation ?? "",
        interests: data.interests ? JSON.parse(data.interests) : [],
        recentEvents: data.recent_events ? JSON.parse(data.recent_events) : [],
      };
      setUser(profile);
      router.replace("/companions");
    } catch {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 rounded-lg border p-6">
        <h1 className="text-center text-lg font-semibold">登录</h1>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <div className="space-y-2">
          <Label htmlFor="username">账号</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "登录中..." : "登录"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          还没有账号？{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            去注册
          </Link>
        </p>
      </form>
    </div>
  );
}
