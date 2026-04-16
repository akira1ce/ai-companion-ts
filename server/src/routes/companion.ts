import { Env } from "@/index";
import { COMPANION_PROFILES } from "@/prompt/layers/companion";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  const companions = COMPANION_PROFILES.map(({ id, name, personality }) => ({
    id,
    name,
    personality,
  }));
  return c.json({ data: companions });
});

export default app;
