import { END, START, StateGraph } from "@langchain/langgraph";
import { ChatConfig } from "./config";
import { ChatState } from "./state";
import { hydrateContextNode } from "./nodes/hydrate-context";
import { buildPromptNode } from "./nodes/build-prompt";
import { buildReplyNode } from "./nodes/build-reply";
import { classifyEmotionNode } from "./nodes/classify-emotion";
import { updateEmotionNode } from "./nodes/update-emoption";
import { extractMemoryNode } from "./nodes/extract-memory";
import { retrieveMemoryNode } from "./nodes/retrieve-memory";
import { shouldExtractMemory } from "./router/should-extract-memory";
import { skipExtractMemoryNode } from "./nodes/skip-extract-memory";
import { skipRetrieveMemoryNode } from "./nodes/skip-retrieve-memory";
import { shouldRetrieveMemory } from "./router/should-retrieve-memory";

export const ChatGraph = new StateGraph(ChatState, ChatConfig)
  .addNode("loadContext", hydrateContextNode)
  .addNode("classifyEmotion", classifyEmotionNode)
  .addNode("updateEmotion", updateEmotionNode)
  .addNode("extractMemory", extractMemoryNode)
  .addNode("retrieveMemory", retrieveMemoryNode)
  .addNode("buildPrompt", buildPromptNode)
  .addNode("buildReply", buildReplyNode)
  .addNode("skipExtractMemory", skipExtractMemoryNode)
  .addNode("skipRetrieveMemory", skipRetrieveMemoryNode)
  .addEdge(START, "loadContext")
  .addEdge("loadContext", "classifyEmotion")
  .addEdge("classifyEmotion", "updateEmotion")
  .addConditionalEdges("retrieveMemory", shouldRetrieveMemory, {
    retrieve: "retrieveMemory",
    skip: "skipRetrieveMemory",
  })
  .addEdge("retrieveMemory", "buildPrompt")
  .addEdge("skipRetrieveMemory", "buildPrompt")
  .addEdge("buildPrompt", "buildReply")
  .addConditionalEdges("buildReply", shouldExtractMemory, {
    extract: "extractMemory",
    skip: "skipExtractMemory",
  })
  .addEdge("extractMemory", END)
  .addEdge("skipExtractMemory", END)
  .compile();
