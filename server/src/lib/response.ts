import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { Hook } from "@hono/zod-validator";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/type";

export const ok = <T>(c: Context, data: T, status: ContentfulStatusCode = 200) => {
  return c.json<ApiSuccessResponse<T>>({ success: true, data }, status);
};

export const fail = (c: Context, error: string, status: ContentfulStatusCode = 400, code?: string) => {
  return c.json<ApiErrorResponse>({ success: false, error, code }, status);
};

/**
 * Shared zod-validator hook that formats validation errors
 * into the unified API error response shape.
 *
 * Pass as the third argument to `zValidator(target, schema, validationHook)`.
 */
export const validationHook: Hook<any, any, any> = (result, c) => {
  if (!result.success) {
    const messages = result.error.issues.map(
      (i: { path: PropertyKey[]; message: string }) => `${i.path.join(".")}: ${i.message}`,
    );
    return fail(c, messages.join("; "), 400, "VALIDATION_ERROR");
  }
};
