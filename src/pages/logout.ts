import type { APIRoute } from "astro";
import { logout } from "@/modules/identity";

// POST only: a GET link to log out could be triggered cross-site.
export const POST: APIRoute = async ({ cookies, redirect, clientAddress }) => {
  await logout({ cookies, clientIp: clientAddress });
  return redirect("/login", 303);
};
