import type { Role } from "@/shared/module";

export type { Role };

export interface Me {
  user_id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  mfa_enabled: boolean;
  tenant_id: string;
  studio_slug: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  mfa_enabled: boolean;
  created_at: string;
}

export interface LoginResponse {
  user_id: string;
  email: string;
  role: Role;
  mfa_required: boolean;
}
