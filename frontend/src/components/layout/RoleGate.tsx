"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/api/types";

export function RoleGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, loading, syncApprovalStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && (user.role === "SUPPLIER" || user.role === "LAB")) {
      syncApprovalStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.userId]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role && user.role !== "ADMIN") {
      router.replace("/login");
      return;
    }
    if ((user.role === "SUPPLIER" || user.role === "LAB") && user.approvalStatus !== "APPROVED") {
      router.replace("/pending-approval");
    }
  }, [loading, user, role, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground/60">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
