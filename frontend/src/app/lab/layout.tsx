"use client";

import { LayoutDashboard, ClipboardList, FileCheck2, Receipt, BarChart3, Bell } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { RoleGate } from "@/components/layout/RoleGate";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/lab/dashboard", icon: LayoutDashboard },
  { label: "Requests", href: "/lab/requests", icon: ClipboardList },
  { label: "Certificates", href: "/lab/certificates", icon: FileCheck2 },
  { label: "Invoices", href: "/lab/invoices", icon: Receipt },
  { label: "Analytics", href: "/lab/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/lab/notifications", icon: Bell },
];

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="LAB">
      <DashboardShell roleLabel="Verification Lab" navItems={navItems}>
        {children}
      </DashboardShell>
    </RoleGate>
  );
}
