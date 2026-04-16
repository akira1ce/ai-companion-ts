"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CompanionItem } from "@/types";

interface CompanionCardProps {
  companion: CompanionItem;
  onSelect: (id: string) => void;
}

export function CompanionCard({ companion, onSelect }: CompanionCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect(companion.id)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="text-lg">{companion.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base">{companion.name}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {companion.personality}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
