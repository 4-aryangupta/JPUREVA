"use client";

import { LayoutDashboard, Package, ClipboardList, Thermometer, Wallet, Bell } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { RoleGate } from "@/components/layout/RoleGate";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
  { label: "Batches", href: "/supplier/batches", icon: Package },
  { label: "Orders", href: "/supplier/orders", icon: ClipboardList },
  { label: "Cold Chain", href: "/supplier/coldchain", icon: Thermometer },
  { label: "Ledger", href: "/supplier/ledger", icon: Wallet },
  { label: "Notifications", href: "/supplier/notifications", icon: Bell },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="SUPPLIER">
      <DashboardShell roleLabel="Supplier / FPO" navItems={navItems}>
        {children}
      </DashboardShell>
    </RoleGate>
  );
}
