import type { CompanionItem, ApiEmotion } from "@/types";

interface ChatHeaderProps {
  companion: CompanionItem | null;
  emotion: ApiEmotion | null;
}

const EMOTION_EMOJI: Record<string, string> = {
  calm: "\u{1F60C}",
  happy: "\u{1F60A}",
  angry: "\u{1F621}",
  sad: "\u{1F622}",
  shy: "\u{1F633}",
  jealous: "\u{1F612}",
};

export function ChatHeader({ companion, emotion }: ChatHeaderProps) {
  const emoji = emotion ? (EMOTION_EMOJI[emotion.state] ?? "\u{1F60C}") : null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 shadow px-4">
      {companion ? (
        <>
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600">
              {companion.name.charAt(0)}
            </div>
            {emoji && (
              <span className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">{emoji}</span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium leading-tight">{companion.name}</span>
          </div>
        </>
      ) : (
        <span className="text-sm text-zinc-400">{"\u4F1A\u8BDD"}</span>
      )}
    </header>
  );
}
