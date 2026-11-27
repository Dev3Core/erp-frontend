import type { Me } from "@/modules/identity";

declare global {
  namespace App {
    interface Locals {
      /** Session user, set by the middleware on /app routes. */
      me: Me | null;
      /** Cookie header to forward to the API (may hold freshly rotated tokens). */
      apiCookie: string;
      /** Griffel rules already emitted in this response (see shared/fluent). */
      fluentSeen: Set<string>;
      /** Fluent renders so far, for unique id prefixes. */
      fluentCount: number;
    }
  }
}

interface ImportMetaEnv {
  /** Base URL of erp-backend, reachable from the Astro server. */
  readonly API_URL?: string;
}
