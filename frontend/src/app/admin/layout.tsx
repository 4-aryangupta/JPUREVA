"use client";

import { LayoutDashboard, CheckSquare, Users, BarChart3, ScrollText, Package } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { RoleGate } from "@/components/layout/RoleGate";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Approvals", href: "/admin/approvals", icon: CheckSquare },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Catalog", href: "/admin/catalog", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="ADMIN">
      <DashboardShell roleLabel="JPureva Admin" navItems={navItems}>
        {children}
      </DashboardShell>
    </RoleGate>
  );
}
