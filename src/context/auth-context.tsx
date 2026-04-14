"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  ApiError,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
} from "@/lib/api";

export interface AuthUser {
  user_id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  mfaRequired: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyMfa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "erp_auth_user";

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(() => {
    const stored = loadUser();
    return { user: stored, loading: false, mfaRequired: false };
  });

  const login = useCallback(
    async (data: LoginRequest): Promise<LoginResponse> => {
      const res = await auth.login(data);

      if (res.mfa_required) {
        // Store partial user info — MFA still pending
        const partial: AuthUser = {
          user_id: res.user_id,
          email: res.email,
          role: res.role,
        };
        setState((s) => ({ ...s, user: partial, mfaRequired: true }));
        return res;
      }

      const user: AuthUser = {
        user_id: res.user_id,
        email: res.email,
        role: res.role,
      };
      saveUser(user);
      setState({ user, loading: false, mfaRequired: false });
      return res;
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await auth.register(data);
      router.push("/auth/login?registered=1");
    },
    [router],
  );

  const verifyMfa = useCallback(
    async (code: string) => {
      await auth.mfaVerify({ code });
      // MFA passed — persist user and clear flag
      if (state.user) {
        saveUser(state.user);
      }
      setState((s) => ({ ...s, mfaRequired: false }));
    },
    [state.user],
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch (e) {
      // Ignore errors — clear local state anyway
      if (!(e instanceof ApiError)) throw e;
    }
    saveUser(null);
    setState({ user: null, loading: false, mfaRequired: false });
    router.push("/auth/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, verifyMfa, logout }),
    [state, login, register, verifyMfa, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
