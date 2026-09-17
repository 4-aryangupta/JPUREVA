"use client";

import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { clearTokens, getTokens, setTokens } from "@/lib/api/client";
import type { ApprovalStatus, JwtClaims, Role } from "@/lib/api/types";

interface AuthUser {
  userId: number;
  email: string;
  role: Role;
  approvalStatus: ApprovalStatus;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => void;
  syncApprovalStatus: () => Promise<ApprovalStatus | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeUser(accessToken: string): AuthUser {
  const claims = jwtDecode<JwtClaims>(accessToken);
  return {
    userId: claims.user_id,
    email: claims.email,
    role: claims.role,
    approvalStatus: claims.approval_status,
  };
}

function syncRoleCookie(user: AuthUser | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = "jp_role=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "jp_approval=; Path=/; Max-Age=0; SameSite=Lax";
    return;
  }
  document.cookie = `jp_role=${user.role}; Path=/; Max-Age=604800; SameSite=Lax`;
  document.cookie = `jp_approval=${user.approvalStatus}; Path=/; Max-Age=604800; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const tokens = getTokens();
    if (!tokens?.access) {
      setUser(null);
      syncRoleCookie(null);
      return;
    }
    try {
      const decoded = decodeUser(tokens.access);
      setUser(decoded);
      syncRoleCookie(decoded);
    } catch {
      clearTokens();
      setUser(null);
      syncRoleCookie(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setTokens({ access: res.access, refresh: res.refresh });
    const decoded = decodeUser(res.access);
    setUser(decoded);
    syncRoleCookie(decoded);
    return decoded;
  }, []);

  const logout = useCallback(() => {
    const tokens = getTokens();
    if (tokens?.refresh) {
      authApi.logout(tokens.refresh).catch(() => {});
    }
    clearTokens();
    setUser(null);
    syncRoleCookie(null);
  }, []);

  // The JWT's approval_status claim is stamped at login time and does not update itself;
  // this asks Django for the live value (e.g. after an admin approves the account) and
  // patches local state/cookie without requiring the user to log in again.
  const syncApprovalStatus = useCallback(async (): Promise<ApprovalStatus | null> => {
    try {
      const me = await authApi.fetchMe();
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, approvalStatus: me.approval_status };
        syncRoleCookie(updated);
        return updated;
      });
      return me.approval_status;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, syncApprovalStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "HOTEL":
      return "/hotel/dashboard";
    case "LAB":
      return "/lab/dashboard";
    case "SUPPLIER":
      return "/supplier/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
  }
}
