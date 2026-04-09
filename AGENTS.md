# Repository Guidelines

## Project Structure & Module Organization
This repository currently contains one backend app under `server/`. Keep all runtime code in `server/src`.

- `server/src/domain`: core business modules such as `emotion`, `memory`, `message`, `session`, and `user`
- `server/src/lib`: app context and shared infrastructure
- `server/src/llm`: model and embedding adapters
- `server/src/prompt`: prompt assembly and layer definitions
- `server/src/sql`: D1 schema
- `server/src/routes` and `server/src/agent`: reserved for Hono routes and graph workflow code

There is no frontend, asset pipeline, or test directory yet.

## Build, Test, and Development Commands
Run commands from `server/`.

- `npm install`: install dependencies
- `npm run dev`: start the Cloudflare Worker with Wrangler
- `npm run type-check`: run `tsc --noEmit`
- `npm run build`: validate the deploy build with `wrangler deploy --dry-run`
- `npm run deploy`: deploy the Worker

Operational helpers live in `server/wrangler.bash`, including D1 migration and Vectorize setup commands.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation and ES module imports. Prefer small modules with clear boundaries: `type.ts`, `repository.ts`, and `service.ts` inside each domain folder.

- Use `PascalCase` for classes and interfaces
- Use `camelCase` for functions, variables, and methods
- Use short, descriptive file names in lowercase
- Use the `@/` path alias for imports from `server/src`

This project does not have ESLint or Prettier configured yet, so keep formatting consistent with the existing code.

## Testing Guidelines
There is no automated test suite yet. Until one is added, treat `npm run type-check` as the minimum gate before every commit. When you add tests, place them next to the feature or under `server/src/**/__tests__`, and name files `*.test.ts`.

Focus first on repository behavior, prompt assembly, and future graph nodes.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commits: `feat:` and `chore:`. Keep that pattern. Example: `feat: add chat graph persist node`.

Each pull request should include:

- a short summary of the change
- linked issue or task when available
- notes for schema, KV, or Vectorize changes
- request or response examples for API changes

## Security & Configuration Tips
Keep secrets in `server/.dev.vars` or Wrangler secrets. Do not commit credentials. Before running D1 or Vectorize commands, verify the target environment in `server/wrangler.toml`.
