import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

// Module boundaries, enforced in CI:
//  - shared/  is domain-free: it never imports app/ or modules/.
//  - modules/ import other modules only through their public index
//    ("@/modules/<name>"), never their internals, and never app/ or pages/.
//  - app/ and pages/ use modules only through their public index.

const SRC = resolve(__dirname, "../src");
const IMPORT_RE =
  /(?:import|export)\s[^"'`]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|astro)$/.test(name) ? [path] : [];
  });
}

/** Resolves an import to a path relative to src/, or null if external. */
function target(from: string, spec: string): string | null {
  if (spec.startsWith("@/")) return spec.slice(2);
  if (spec.startsWith("."))
    return relative(SRC, resolve(dirname(from), spec))
      .split(sep)
      .join("/");
  return null;
}

const layer = (rel: string) => rel.split("/")[0];
const moduleOf = (rel: string) =>
  rel.startsWith("modules/") ? rel.split("/")[1] : null;

const violations: string[] = [];
for (const file of files(SRC)) {
  const from = relative(SRC, file).split(sep).join("/");
  const code = readFileSync(file, "utf8");
  for (const m of code.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3];
    const to = target(file, spec);
    if (!to) continue;
    const fromLayer = layer(from);
    const toLayer = layer(to);
    const fromMod = moduleOf(from);
    const toMod = moduleOf(to);

    if (
      fromLayer === "shared" &&
      (toLayer === "modules" || toLayer === "app" || toLayer === "pages")
    ) {
      violations.push(`${from} -> ${spec} (shared must stay domain-free)`);
    }
    if (fromLayer === "modules" && (toLayer === "app" || toLayer === "pages")) {
      violations.push(
        `${from} -> ${spec} (modules cannot depend on the app shell)`,
      );
    }
    if (toMod && toMod !== fromMod) {
      const isPublic =
        to === `modules/${toMod}` ||
        to === `modules/${toMod}/index` ||
        to === `modules/${toMod}/index.ts`;
      if (!isPublic)
        violations.push(`${from} -> ${spec} (use "@/modules/${toMod}")`);
    }
  }
}

describe("architecture", () => {
  it("respects module boundaries", () => {
    expect(violations).toEqual([]);
  });

  it("every module exposes a public index", () => {
    for (const name of readdirSync(join(SRC, "modules"))) {
      expect(statSync(join(SRC, "modules", name, "index.ts")).isFile()).toBe(
        true,
      );
    }
  });
});
