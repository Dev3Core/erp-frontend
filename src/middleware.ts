import { defineMiddleware } from "astro:middleware";
import { rolesForPath } from "@/app/navigation";
import { resolveSession } from "@/modules/identity";

// Guards /app/*: resolves the session (identity module) and checks the role
// against the module registry. Roles only shape the UI; the API enforces
// permissions on every call.

const PROTECTED = /^\/app(\/|$)/;

/**
 * Astro emits a hash-based CSP. Scripts keep their hashes; styles need
 * 'unsafe-inline' because Fluent's Griffel CSS is emitted inline per render.
 * (Inline styles cannot run code; the script policy is what matters.)
 */
function relaxStyleSrc(response: Response) {
  const csp = response.headers.get("content-security-policy");
  if (!csp) return;
  const directives = csp
    .split(";")
    .map((d) => d.trim())
    .filter((d) => d && !d.startsWith("style-src"));
  directives.push("style-src 'self' 'unsafe-inline'");
  response.headers.set("content-security-policy", directives.join("; "));
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  ctx.locals.me = null;
  ctx.locals.apiCookie = "";
  ctx.locals.fluentSeen = new Set();
  ctx.locals.fluentCount = 0;

  const { pathname, search } = ctx.url;
  if (!PROTECTED.test(pathname)) {
    const response = await next();
    relaxStyleSrc(response);
    return response;
  }

  const session = await resolveSession(ctx.cookies, ctx.clientAddress);
  if (session.status === "anonymous") {
    return ctx.redirect(`/login?next=${encodeURIComponent(pathname + search)}`);
  }

  ctx.locals.me = session.me;
  ctx.locals.apiCookie = session.apiCookie;

  const allowed = rolesForPath(pathname);
  if (allowed && !allowed.includes(session.me.role)) return ctx.rewrite("/403");

  const response = await next();
  relaxStyleSrc(response);
  // Authenticated pages hold tenant data: never cache them.
  response.headers.set("cache-control", "private, no-store");
  return response;
});
