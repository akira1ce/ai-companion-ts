import { MemoryDocument } from "@/domain/memory/schema";

export function memoryLayer(memories: MemoryDocument[]): string {
  if (memories.length === 0) return "";

  const formatted = memories
    .map((m) => {
      const date = new Date(m.created_at).toLocaleDateString("zh-CN");
      return `- [${date}] ${m.content}`;
    })
    .join("\n");

  return [
    "【相关记忆】",
    "以下是你和用户之间的历史记忆。使用规则：",
    "- 自然地融入回复中，不要逐条念出或刻意提及。",
    `- 记忆中出现的"助手"、"伴侣"、"她/他"等称呼，如果指的是你自己，请以"我"的视角理解（例如"带助手去了成都"＝"我和用户一起去了成都"）。`,
    "- 回忆时用第一人称，像是你亲身经历过的事情。",
    formatted,
  ].join("\n");
}
