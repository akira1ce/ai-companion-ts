/* 「view」 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Form, Typography, Alert } from "antd";
import { apiRegister } from "../service";

const { Title } = Typography;

interface RegisterFormValues {
  name: string;
  username: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: RegisterFormValues) => {
    setError("");
    setLoading(true);

    try {
      await apiRegister(values);
      router.replace("/login");
    } catch {
      setError("注册失败，账号可能已存在");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 p-10">
        <Title level={4} className="mb-6! text-center">
          注册
        </Title>

        {error && <Alert type="error" message={error} showIcon className="mb-4" />}

        <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item label="昵称" name="name">
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500">
          已有账号？{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            去登录
          </Link>
        </p>
      </div>
    </div>
  );
}
