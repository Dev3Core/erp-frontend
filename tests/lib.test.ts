import { describe, expect, it } from "vitest";
import { isUuid } from "../src/shared/api/client";
import { safeNext } from "../src/shared/lib/forms";

describe("safeNext", () => {
  it("acepta rutas internas de /app", () => {
    expect(safeNext("/app/shifts?status=ACTIVE")).toBe(
      "/app/shifts?status=ACTIVE",
    );
  });
  it("rechaza redirecciones abiertas", () => {
    for (const bad of [
      "//evil.com",
      "https://evil.com/app",
      "/login",
      "/app\\@evil.com",
      null,
    ]) {
      expect(safeNext(bad)).toMatch(/^\/app/);
      expect(safeNext(bad)).not.toContain("evil");
    }
  });
});

describe("isUuid", () => {
  it("valida ids", () => {
    expect(isUuid("e5bf9f51-5cfe-475c-926c-4ef78667d06b")).toBe(true);
    expect(isUuid("../users")).toBe(false);
  });
});
