"use client";

import { Button, Input, Form } from "antd";
import type { UserProfile, ApiUpdateUserReq } from "@/types";

const { TextArea } = Input;

interface ProfileFormProps {
  profile: UserProfile;
  saving: boolean;
  onSave: (params: ApiUpdateUserReq) => void;
}

interface ProfileFormValues {
  name: string;
  occupation: string;
  interests: string;
  recentEvents: string;
}

export function ProfileForm({ profile, saving, onSave }: ProfileFormProps) {
  const handleFinish = (values: ProfileFormValues) => {
    onSave({
      name: values.name,
      occupation: values.occupation,
      interests: JSON.stringify(values.interests.split("、").filter(Boolean)),
      recent_events: JSON.stringify(values.recentEvents.split("、").filter(Boolean)),
    });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        username: profile.username,
        name: profile.name,
        occupation: profile.occupation,
        interests: profile.interests.join("、"),
        recentEvents: profile.recentEvents.join("、"),
      }}
      className="max-w-md"
    >
      <Form.Item label="账号" name="username">
        <Input disabled />
      </Form.Item>

      <Form.Item label="昵称" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="职业" name="occupation">
        <Input />
      </Form.Item>

      <Form.Item label="兴趣爱好（用顿号分隔）" name="interests">
        <TextArea rows={2} />
      </Form.Item>

      <Form.Item label="近期事件（用顿号分隔）" name="recentEvents">
        <TextArea rows={2} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}
