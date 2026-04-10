import { ChatConfigType } from "./config";

/** 获取应用上下文 */
export function getAppCtx(config: ChatConfigType) {
  const appCtx = config.configurable?.appCtx;
  if (!appCtx) {
    throw new Error("appCtx is not set");
  }
  return appCtx;
}
