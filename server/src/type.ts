import { HTTPException } from "hono/http-exception";

export interface AppEnv {
  Bindings: {
    AI: Ai;
    KV: KVNamespace;
    DB: D1Database;
    VECTORIZE: VectorizeIndex;
    DEEPSEEK_API_KEY: string;
    DEEPSEEK_BASE_URL: string;
    DEEPSEEK_MODEL: string;
    EMBEDDING_API_KEY: string;
    EMBEDDING_BASE_URL: string;
    LANGSMITH_API_KEY: string;
    LANGSMITH_PROJECT: string;
  };
}

export type Env = AppEnv["Bindings"];

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class BusinessException extends HTTPException {
  public readonly code: string;

  constructor(
    status: ConstructorParameters<typeof HTTPException>[0],
    options: { message: string; code?: string; cause?: unknown },
  ) {
    super(status, { message: options.message, cause: options.cause });
    this.code = options.code ?? "BUSINESS_ERROR";
  }
}

export class NotFoundException extends BusinessException {
  constructor(resource: string, cause?: unknown) {
    super(404, { message: `${resource} not found`, code: "NOT_FOUND", cause });
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(message = "Unauthorized", cause?: unknown) {
    super(401, { message, code: "UNAUTHORIZED", cause });
  }
}
