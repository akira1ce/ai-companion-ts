import { ChatOpenAI } from "@langchain/openai";
import type { Env } from "../index.js";

/** 创建 chat model */
export function createChatModel(env: Env) {
  return new ChatOpenAI({
    model: env.DEEPSEEK_MODEL,
    apiKey: env.DEEPSEEK_API_KEY,
    configuration: { baseURL: env.DEEPSEEK_BASE_URL },
  });
}
