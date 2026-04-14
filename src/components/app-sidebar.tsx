"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";

function getRoleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Administrador";
    case "ADMIN":
      return "Admin";
    case "MONITOR":
      return "Monitor";
    case "MODEL":
      return "Modelo";
    default:
      return role;
  }
}

function getDashboardUrl(role: string) {
  switch (role) {
    case "OWNER":
    case "ADMIN":
      return "/admin/dashboard";
    case "MONITOR":
      return "/monitor/dashboard";
    case "MODEL":
      return "/modelo/dashboard";
    default:
      return "/admin/dashboard";
  }
}

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const role = user?.role ?? "OWNER";
  const dashboardUrl = getDashboardUrl(role);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={dashboardUrl} />}>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">StudioCore</span>
                <span className="truncate text-xs text-muted-foreground">
                  {getRoleLabel(role)}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={dashboardUrl} />}
                  isActive={pathname === dashboardUrl}
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
