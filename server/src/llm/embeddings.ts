import type { Env } from "@/index";

/** 创建 embeddings */
export function createEmbeddings(env: Env) {
  return createCloudflareEmbeddings(env);
}

export function createCloudflareEmbeddings(env: Env) {
  return {
    async embedQuery(text: string): Promise<number[]> {
      const result = (await env.AI.run("@cf/baai/bge-m3", {
        text: text,
      })) as any;
      return result.data[0];
    },
  };
}

export type Embeddings = ReturnType<typeof createEmbeddings>;
