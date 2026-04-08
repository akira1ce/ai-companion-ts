import { EmotionContext } from "@/domain/emotion/type";
import { MemoryDocument } from "@/domain/memory/type";
import { UserProfile } from "@/domain/user/type";

export interface CompanionProfile {
  /** 伴侣ID */
  id: string;
  /** 伴侣名称 */
  name: string;
  /** 伴侣性格 */
  personality: string[];
  /** 伴侣说话风格 */
  speakingStyle: string[];
  /** 伴侣边界 */
  boundaries: string[];
  /** 伴侣示例 */
  fewShots: string[];
}

export interface PromptContext {
  /** 伴侣ID */
  companionId: string;
  /** 用户信息 */
  userProfile: UserProfile;
  /** 情绪状态 */
  emotion: EmotionContext;
  /** 记忆 */
  memories: MemoryDocument[];
}
