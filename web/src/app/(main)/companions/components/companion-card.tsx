"use client";

import { Card, Avatar, Typography } from "antd";
import type { CompanionItem } from "@/types";

const { Text, Paragraph } = Typography;

interface CompanionCardProps {
  companion: CompanionItem;
  onSelect: (id: string) => void;
}

export function CompanionCard({ companion, onSelect }: CompanionCardProps) {
  return (
    <Card
      hoverable
      onClick={() => onSelect(companion.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <Avatar size={48}>{companion.name[0]}</Avatar>
        <div className="flex-1 min-w-0">
          <Text strong className="block">{companion.name}</Text>
          <Paragraph type="secondary" className="mb-0! text-sm" ellipsis={{ rows: 2 }}>
            {companion.personality}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
}
