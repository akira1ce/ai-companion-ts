const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787";

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string>;
  body?: unknown;
}

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: string | Record<string, string[]>;
}

export class RequestError extends Error {
  constructor(
    public status: number,
    public payload: ApiError,
  ) {
    super(typeof payload.error === "string" ? payload.error : "Request failed");
  }
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const res = await fetch(buildUrl(path, params), {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => ({ error: res.statusText }))) as ApiError;
    throw new RequestError(res.status, payload);
  }

  return res.json() as Promise<T>;
}

export const http = {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request(path, { ...options, method: "PUT", body });
  },
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request(path, { ...options, method: "DELETE" });
  },
};
