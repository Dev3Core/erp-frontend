const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  { body, headers, ...opts }: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, data.detail ?? "Unknown error");
  }

  return res.json() as Promise<T>;
}

// --- Auth types matching backend schemas ---

export interface RegisterRequest {
  studio_name: string;
  full_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  tenant_id: string;
  user_id: string;
  email: string;
  studio_slug: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  email: string;
  role: string;
  mfa_required: boolean;
}

export interface TokenResponse {
  detail: string;
}

export interface MFAVerifyRequest {
  code: string;
}

export interface MFAVerifyResponse {
  detail: string;
}

// --- Auth API ---

export const auth = {
  register: (data: RegisterRequest) =>
    request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: LoginRequest) =>
    request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: data,
    }),

  refresh: () =>
    request<TokenResponse>("/api/v1/auth/refresh", { method: "POST" }),

  logout: () =>
    request<TokenResponse>("/api/v1/auth/logout", { method: "POST" }),

  mfaVerify: (data: MFAVerifyRequest) =>
    request<MFAVerifyResponse>("/api/v1/auth/mfa/verify", {
      method: "POST",
      body: data,
    }),
};

export { ApiError };
