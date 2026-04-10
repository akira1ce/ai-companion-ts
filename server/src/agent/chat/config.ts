import { Annotation } from "@langchain/langgraph";
import { AppCtx } from "@/lib/create-app-ctx";
import { RunnableConfig } from "@langchain/core/runnables";

export const ChatConfig = Annotation.Root({
  appCtx: Annotation<AppCtx>,
});

export type ChatConfigType = RunnableConfig<typeof ChatConfig.State>;
