"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { dashboardPathForRole, useAuth } from "@/lib/auth/AuthContext";

export default function PendingApprovalPage() {
  const { user, loading, logout, syncApprovalStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.approvalStatus === "APPROVED") {
      router.replace(dashboardPathForRole(user.role));
    }
  }, [user, router]);

  useEffect(() => {
    const interval = setInterval(() => syncApprovalStatus(), 15000);
    return () => clearInterval(interval);
  }, [syncApprovalStatus]);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md text-center">
        <CardBody>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
            <Clock size={26} />
          </div>
          <h1 className="font-heading text-2xl text-foreground">Your account is pending approval</h1>
          <p className="mt-2 text-sm text-foreground/60">
            A JPureva admin is reviewing your business documents and accreditation details.
            You&apos;ll be notified as soon as your account is approved.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={() => syncApprovalStatus()}>Refresh status</Button>
            <Button variant="ghost" onClick={() => { logout(); router.replace("/login"); }}>Log out</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
