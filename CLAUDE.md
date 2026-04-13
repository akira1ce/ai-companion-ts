# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- Git root contains repo-level guidance in `AGENTS.md` and the actual app under `server/`.
- All runtime code lives in `server/src`.
- `server/src/index.ts` bootstraps a minimal Hono Cloudflare Worker. Right now it only exposes `GET /`; most application behavior is implemented in services and the chat graph rather than HTTP routes.
- `server/src/lib/create-app-ctx.ts` is the composition root. It wires Cloudflare bindings and adapters into domain services.
- `server/src/domain/*` follows a consistent split by business area (`emotion`, `memory`, `message`, `session`, `context`, `user`) with `type.ts`, `repository.ts`, and `service.ts` files.
- `server/src/agent/chat/*` contains the LangGraph-based chat workflow.
- `server/src/prompt/*` builds the runtime system prompt from layered prompt sections.
- `server/src/sql/schema.sql` is the D1 schema for sessions, messages, memories, and users.

## Working directory and commands

Run app commands from `server/`.

```bash
cd server
npm install
npm run dev
npm run type-check
npm run build
npm run deploy
```

Equivalent one-off forms from the git root:

```bash
npm --prefix server install
npm --prefix server run dev
npm --prefix server run type-check
npm --prefix server run build
npm --prefix server run deploy
```

Current available scripts in `server/package.json`:

- `npm run dev` — start Wrangler dev for the Worker
- `npm run type-check` — run `tsc --noEmit` (current main validation gate)
- `npm run build` — `wrangler deploy --dry-run`
- `npm run deploy` — deploy the Worker

There is currently **no lint script** and **no automated test script**. There are also no `*.test.ts` or `*.spec.ts` files under `server/src`, so there is no single-test command yet.

## Local infra and Cloudflare bindings

`server/wrangler.toml` defines the Worker entrypoint and bindings:

- `AI` — Cloudflare AI binding used for embeddings
- `KV` — stores session emotion/context snapshots
- `DB` — D1 database for users, sessions, messages, and memory rows
- `VECTORIZE` — vector index for semantic memory retrieval
- `LANGSMITH_*` vars — optional tracing setup

`server/readme.md` notes that `localflare` is used for local startup and provides a web UI for Cloudflare resources. Generated Localflare artifacts live under `server/.localflare/` and are ignored.

Important caveat: `server/wrangler.bash` contains helpful D1 / KV / Vectorize helper commands.

## High-level architecture

### Runtime stack

- Hono on Cloudflare Workers (`server/src/index.ts`)
- LangGraph for orchestrating the chat pipeline (`server/src/agent/chat/graph.ts`)
- LangChain / ChatOpenAI adapter for chat-model calls (`server/src/llm/model.ts`)
- Cloudflare AI embeddings via `@cf/baai/bge-m3` (`server/src/llm/embeddings.ts`)
- D1 + Vectorize + KV as the persistence layer
- Optional LangSmith tracing (`server/src/lib/tracing.ts`)

### Composition root

`server/src/lib/create-app-ctx.ts` is the main place to understand dependencies. It constructs:

- `MemoryService` from D1 + Vectorize + embeddings
- `EmotionService` from KV
- `MessageService` from D1
- `SessionService` from D1
- `ContextService` from KV
- `UserService` from D1

If you add new routes or graph entrypoints, they should usually start by creating and passing this app context.

### Chat pipeline

`server/src/agent/chat/graph.ts` defines the current orchestration:

1. `loadContext` — hydrate session context, user profile, and emotion state
2. `classifyEmotion` — classify the incoming message into an emotion event
3. `updateEmotion` — apply the FSM/intimacy transition and persist it
4. `retrieveMemory` or skip — fetch relevant long-term memories when enabled
5. `buildPrompt` — assemble the final system prompt from layered prompt sections
6. `buildReply` — invoke the chat model
7. `extractMemory` or skip — extract reusable memories from the user/assistant exchange and persist them asynchronously

The graph is compiled but not yet wired to an HTTP route in `server/src/index.ts`, so a future integration likely needs to invoke `ChatGraph` from a new route or handler.

### Prompt assembly

`server/src/prompt/index.ts` assembles the system prompt in this order:

1. safety layer
2. companion layer
3. persona/personal layer
4. emotion layer
5. memory layer

This ordering matters because most runtime behavior is controlled by prompt composition rather than route logic.

### Data ownership by store

- **D1**: relational records for `sessions`, `messages`, `memories`, `users`
- **KV**: session-scoped `emotion:*` and `context:*` documents
- **Vectorize**: semantic index for long-term memory retrieval

Memory writes are dual-written: structured rows go into D1 and semantic vectors go into Vectorize.

## Non-obvious implementation details

- User `interests` and `recent_events` are stored in D1 as JSON strings and converted in `server/src/domain/user/util.ts`. Preserve that transform boundary when editing user persistence.
- Memory retrieval is multi-channel in `server/src/domain/memory/service.ts`: semantic search, structured type retrieval, summary retrieval, and keyword retrieval are fused into a single ranked result set.
- `server/pitfalls.md` documents two important Vectorize/D1 gotchas:
  - Vectorize metadata filtering only works after creating the metadata index first.
  - Vectorize queries must request `returnMetadata: "all"` or memory content will come back empty.
- `EmotionService.transition` expects an existing emotion record in KV. `getEmotion()` can synthesize an initial state, but transition itself does not initialize missing records automatically.
- `hydrateContextNode` uses `Promise.allSettled`, so missing context/user/emotion data does not fail the whole node.
- Memory extraction is fire-and-forget via `executionCtx.waitUntil(...)`, so graph completion does not wait for vector/database writes.

## When changing this codebase

- Prefer following the existing domain pattern (`type.ts` / `repository.ts` / `service.ts`) instead of introducing new architectural styles.
- If you add chat features, check whether they belong in the graph state, a graph node, or prompt assembly before touching HTTP routes.
- If you add routes, remember that the current Hono app is intentionally minimal and there is no established routes directory in use yet.
- Use `@/*` imports inside `server/src` as defined in `server/tsconfig.json`.
- Treat `npm run type-check` as the required verification step until a real test/lint setup is added.
