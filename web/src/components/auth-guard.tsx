"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useApp } from "@/stores";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /**
     * zustand persist 从 localStorage 水合是异步的，
     * 需要等水合完成后再判断用户状态。
     */
    const unsub = useApp.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useApp.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  return <>{children}</>;
}
