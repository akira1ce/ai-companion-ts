/* 「view」 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Form, Typography, Alert } from "antd";
import { apiLogin } from "@/services";
import { appActions } from "@/stores";
import type { UserProfile } from "@/types";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: LoginFormValues) => {
    setError("");
    setLoading(true);

    try {
      const { data } = await apiLogin(values);
      const profile: UserProfile = {
        id: data.id,
        name: data.name ?? "",
        username: data.username,
        occupation: data.occupation ?? "",
        interests: data.interests ?? "",
        recentEvents: data.recent_events ?? "",
      };
      appActions.setUser(profile);
      router.replace("/companions");
    } catch {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 p-10">
        <Title level={4} className="mb-6! text-center">
          登录
        </Title>

        {error && <Alert type="error" message={error} showIcon className="mb-4" />}

        <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500">
          还没有账号？{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            去注册
          </Link>
        </p>
      </div>
    </div>
  );
}
