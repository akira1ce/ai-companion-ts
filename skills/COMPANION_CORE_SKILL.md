---
name: ai-companion-dev
description: >-
  Guide development in the ai-companion-refactor backend: adding domain modules,
  graph nodes, routes, and prompt layers. Use when creating new features, extending
  the chat pipeline, adding API endpoints, or modifying domain logic in this project.
---

# AI Companion Backend Development

## Tech Stack

- **Runtime:** Hono on Cloudflare Workers (D1 + KV + Vectorize + AI bindings)
- **Orchestration:** LangGraph (`@langchain/langgraph`) for chat pipeline
- **LLM:** ChatOpenAI adapter pointing at DeepSeek-compatible endpoint
- **Embeddings:** Cloudflare AI `@cf/baai/bge-m3`
- **Validation:** Zod for schemas and HTTP body parsing
- **Tracing:** Optional LangSmith

## Directory Map

```
server/src/
├── index.ts                  # Hono entry, Env type, route mounting
├── lib/
│   ├── create-app-ctx.ts     # Composition root (AppCtx)
│   └── tracing.ts            # LangSmith tracer factory
├── llm/
│   ├── model.ts              # createChatModel(env)
│   └── embeddings.ts         # createEmbeddings(env)
├── domain/                   # Bounded contexts
│   ├── context/              #   session context (KV)
│   ├── emotion/              #   emotion FSM + intimacy (KV)
│   ├── memory/               #   long-term memory (D1 + Vectorize)
│   ├── message/              #   chat messages (D1)
│   ├── session/              #   sessions (D1)
│   └── user/                 #   user profiles (D1)
├── agent/chat/               # LangGraph chat pipeline
│   ├── graph.ts              #   compiled StateGraph
│   ├── state.ts              #   ChatState (Annotation.Root)
│   ├── config.ts             #   ChatConfig (appCtx injection)
│   ├── util.ts               #   getAppCtx helper
│   ├── nodes/                #   graph node functions
│   └── router/               #   conditional edge routers
├── prompt/                   # System prompt assembly
│   ├── index.ts              #   assemblePrompt (layer concat)
│   ├── type.ts               #   PromptContext, CompanionProfile
│   └── layers/               #   safety, companion, personal, emotion, memory
├── routes/                   # Hono route modules
│   ├── companion.ts          #   GET /api/companions
│   ├── session.ts            #   GET/POST/DELETE /api/sessions
│   ├── chat.ts               #   POST /api/chat
│   ├── message.ts            #   GET /api/messages/:sessionId
│   └── user.ts               #   POST/GET/PUT /api/users
└── sql/
    └── schema.sql            # D1 DDL
```

## Key Conventions

### Imports

- Use `@/*` path alias (maps to `./src/*`) for cross-cutting imports.
- Use relative imports within the same module (e.g. `./schema`, `../config`).
- No barrel `index.ts` files under `domain/`.

### Naming

- Files: lowercase, hyphens for multi-word (`hydrate-context.ts`).
- Types/interfaces: PascalCase (`EmotionContext`, `MemoryDocument`).
- Zod schemas: camelCase with `Schema` suffix (`emotionContextSchema`).
- Domain files always named `schema.ts` (not `type.ts`), `repository.ts`, `service.ts`.

### Env & Bindings

`Env` is defined in `server/src/index.ts`. Hono apps typed as `Hono<{ Bindings: Env }>`. Access via `c.env` in handlers.

---

## Adding a Domain Module

Create `server/src/domain/<name>/` with three files:

### 1. `schema.ts` — Zod types

```typescript
import { z } from "zod";

export const fooSchema = z.object({
  id: z.string(),
  session_id: z.string(),
  // ...D1 column names in snake_case
  created_at: z.number(),
});
export type Foo = z.infer<typeof fooSchema>;
```

### 2. `repository.ts` — Storage I/O

```typescript
import { Env } from "@/index";
import { Foo } from "./schema";

export class FooRepository {
  constructor(private readonly db: Env["DB"]) {}
  // D1: prepare / bind / run|first|all
  // KV: get / put / delete with key prefix
  // Vectorize: query / upsert
}
```

Repositories own all SQL / KV / Vectorize calls. Use `Env["DB"]`, `Env["KV"]`, or `Env["VECTORIZE"]` as constructor args.

### 3. `service.ts` — Domain logic

```typescript
import { FooRepository } from "./repository";

export class FooService {
  constructor(private readonly repo: FooRepository) {}
  // Orchestration, validation, business rules
  // Never write SQL here
}
```

### 4. Wire into AppCtx

Add the service to `AppCtx` interface and `createAppCtx()` in `server/src/lib/create-app-ctx.ts`:

```typescript
export interface AppCtx {
  // ...existing services
  fooService: FooService;
}
```

---

## Adding a Graph Node

Nodes live in `server/src/agent/chat/nodes/`. Each is an async function:

```typescript
import { ChatStateType, NodeResultType } from "../state";
import { ChatConfigType } from "../config";
import { getAppCtx } from "../util";

export async function myNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);
  // Use appCtx.someService, state.sessionId, etc.
  return { /* partial state updates */ };
}
```

**Key rules:**
- Return `Partial<ChatStateType>` (only updated fields).
- Access services via `getAppCtx(config)`, never construct them in nodes.
- For fire-and-forget writes, use `appCtx.executionCtx.waitUntil(promise)`.
- For hydration that must not block on failures, use `Promise.allSettled`.

### Registering in the graph

In `server/src/agent/chat/graph.ts`:

```typescript
.addNode("myNode", myNode)
.addEdge("previousNode", "myNode")
```

For conditional branching, add a router in `router/` returning branch key strings, then use `addConditionalEdges`.

---

## Adding a Conditional Router

Routers live in `server/src/agent/chat/router/`. Pure functions:

```typescript
import { ChatStateType } from "../state";

export function shouldDoSomething(state: ChatStateType): string {
  return state.someFlag ? "do" : "skip";
}
```

Wire with `addConditionalEdges` and matching branch map in `graph.ts`.

---

## Adding a Route

Routes live in `server/src/routes/`. Each file exports a default Hono app:

```typescript
import { Env } from "@/index";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  // construct services from c.env
  return c.json({ data: result });
});

export default app;
```

**Patterns:**
- Validate POST/PUT bodies with Zod `safeParse`.
- Consistent response envelope: `{ data }` on success, `{ error }` on failure.
- For chat route: use `createAppCtx(c.env, c.executionCtx)` to get full context.
- For simple CRUD: inline `new XService(new XRepository(c.env.DB))`.

### Mount in index.ts

```typescript
import fooRoutes from "@/routes/foo";
app.route("/api/foo", fooRoutes);
```

---

## Adding a Prompt Layer

Prompt layers live in `server/src/prompt/layers/`. Each exports a function returning a string:

```typescript
export function myLayer(/* relevant args */): string {
  // Return formatted prompt section or "" to skip
}
```

Register in `server/src/prompt/index.ts` within `assemblePrompt`. Layer order matters:
1. safety
2. companion
3. personal
4. emotion
5. memory

---

## Data Store Mapping

| Store | Used For | Domain Modules |
|-------|----------|----------------|
| D1 | Relational records | session, message, memory, user |
| KV | Session-scoped snapshots (TTL 30d) | emotion (`emotion:{sessionId}`), context (`context:{sessionId}`) |
| Vectorize | Semantic search vectors | memory (dual-write with D1) |

---

## Verification

After any change, run from `server/`:

```bash
npm run type-check    # tsc --noEmit (required gate)
npm run build         # wrangler deploy --dry-run
```

No lint or test scripts exist yet. Treat `type-check` as the minimum gate.

---

## Gotchas

- **EmotionService.transition** throws if no KV record exists. Call `getEmotion` first (it synthesizes initial state but does not persist).
- **Memory writes are dual-store**: D1 rows + Vectorize vectors via `insertMemoryBatch`. Both use `Promise.allSettled`.
- **Vectorize queries** must include `returnMetadata: "all"` or content comes back empty.
- **Session delete** must cascade: session + messages + memories + emotion + context.
- **`extractMemoryNode`** uses `executionCtx.waitUntil` — graph completes before memory persistence finishes.
- **Companion profiles** are hardcoded in `prompt/layers/companion.ts`, not in D1.
- **`hydrateContextNode`** uses `Promise.allSettled` — missing context/user/emotion does not crash the graph.
