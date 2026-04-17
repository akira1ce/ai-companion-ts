import { Hono } from "hono";
import type { AppEnv } from "@/type";
import { ok } from "@/lib/response";
import { COMPANION_PROFILES } from "@/prompt/layers/companion";

const app = new Hono<AppEnv>();

app.get("/", (c) => {
  const companions = COMPANION_PROFILES.map(({ id, name, personality }) => ({
    id,
    name,
    personality,
  }));
  return ok(c, companions);
});

export default app;
