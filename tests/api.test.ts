import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@/lib/api";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
  };
}

describe("auth.login", () => {
  it("sends POST with credentials and returns response", async () => {
    const body = { user_id: "abc", email: "a@b.com", role: "OWNER", mfa_required: false };
    mockFetch.mockResolvedValueOnce(jsonResponse(body));

    const res = await auth.login({ email: "a@b.com", password: "12345678" });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("/api/v1/auth/login");
    expect(opts.credentials).toBe("include");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.com", password: "12345678" });
    expect(res).toEqual(body);
  });

  it("throws ApiError on 401", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ detail: "Invalid credentials" }, 401));

    await expect(auth.login({ email: "a@b.com", password: "wrong" })).rejects.toThrow(
      "Invalid credentials",
    );
  });
});

describe("auth.register", () => {
  it("sends POST and returns register response", async () => {
    const body = {
      tenant_id: "t1",
      user_id: "u1",
      email: "a@b.com",
      studio_slug: "mi-estudio",
    };
    mockFetch.mockResolvedValueOnce(jsonResponse(body, 201));

    const res = await auth.register({
      studio_name: "Mi Estudio",
      full_name: "Juan",
      email: "a@b.com",
      password: "12345678",
    });

    expect(res).toEqual(body);
    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe("POST");
  });
});

describe("auth.refresh", () => {
  it("sends POST to refresh endpoint", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ detail: "ok" }));

    const res = await auth.refresh();

    expect(res.detail).toBe("ok");
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("/api/v1/auth/refresh");
    expect(opts.method).toBe("POST");
  });
});

describe("auth.logout", () => {
  it("sends POST to logout endpoint", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ detail: "Logged out" }));

    const res = await auth.logout();

    expect(res.detail).toBe("Logged out");
  });
});

describe("auth.mfaVerify", () => {
  it("sends TOTP code to verify endpoint", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ detail: "MFA activated" }));

    const res = await auth.mfaVerify({ code: "123456" });

    expect(res.detail).toBe("MFA activated");
    const [, opts] = mockFetch.mock.calls[0];
    expect(JSON.parse(opts.body)).toEqual({ code: "123456" });
  });
});
