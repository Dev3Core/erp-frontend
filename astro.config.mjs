// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";

// SSR: every page is rendered on the server, which talks to the API with the
// browser's HttpOnly cookies. The browser never calls the API directly.
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  // Fluent UI v9 (React) is rendered on the server only; see src/shared/fluent.
  integrations: [react()],
  server: { port: 3000, host: true },
  security: {
    // CSRF: rejects cross-origin form posts (Sec-Fetch-Site / Origin).
    checkOrigin: true,
    // Hash-based CSP for the scripts and styles Astro emits.
    csp: true,
  },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
