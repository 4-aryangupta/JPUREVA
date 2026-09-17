"use client";

import { LayoutDashboard, ShoppingBag, ShoppingCart, ClipboardList, ShieldCheck, FileCheck2, CreditCard, Bell } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { RoleGate } from "@/components/layout/RoleGate";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/hotel/dashboard", icon: LayoutDashboard },
  { label: "Browse", href: "/hotel/browse", icon: ShoppingBag },
  { label: "Cart", href: "/hotel/cart", icon: ShoppingCart },
  { label: "Orders", href: "/hotel/orders", icon: ClipboardList },
  { label: "Trust Badge", href: "/hotel/trust-badge", icon: ShieldCheck },
  { label: "Compliance", href: "/hotel/compliance", icon: FileCheck2 },
  { label: "Subscription", href: "/hotel/subscription", icon: CreditCard },
  { label: "Notifications", href: "/hotel/notifications", icon: Bell },
];

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="HOTEL">
      <DashboardShell roleLabel="Hotel / Restaurant" navItems={navItems}>
        {children}
      </DashboardShell>
    </RoleGate>
  );
}
