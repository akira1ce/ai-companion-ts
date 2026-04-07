# graph

```ts
export function createChatGraph() {
  return new StateGraph(ChatGraphState, ChatGraphConfig)
    .addNode("loadContext", loadContextNode)
    .addNode("loadSession", loadSessionNode) // 前移
    .addNode("retrieveMemory", retrieveMemoryNode)
    .addNode("skipRetrieveMemory", skipRetrieveMemoryNode)
    .addNode("classifyEmotion", classifyEmotionNode)
    .addNode("updateEmotion", updateEmotionNode)
    .addNode("buildPrompt", buildPromptNode)
    .addNode("generateReply", generateReplyNode)
    .addNode("persistTurn", persistTurnNode) // 内部 fire-and-forget
    .addNode("buildResponse", buildResponseNode)
    .addEdge(START, "loadContext")
    .addEdge("loadContext", "loadSession") // 前移到分叉前
    .addConditionalEdges("loadSession", shouldRetrieveMemory, {
      retrieve: "retrieveMemory",
      skip: "skipRetrieveMemory",
    })
    .addEdge("retrieveMemory", "classifyEmotion")
    .addEdge("skipRetrieveMemory", "classifyEmotion")
    .addEdge("classifyEmotion", "updateEmotion")
    .addEdge("updateEmotion", "buildPrompt")
    .addEdge("buildPrompt", "generateReply")
    .addEdge("generateReply", "persistTurn")
    .addEdge("persistTurn", "buildResponse") // 直通，不再分叉
    .addEdge("buildResponse", END)
    .compile();
}
```
