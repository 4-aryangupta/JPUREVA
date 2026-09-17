"use client";

import { useEffect, useState } from "react";
import { CheckSquare, ClipboardList, FlaskConical, Leaf, ShieldCheck, Store, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { fetchAnalyticsOverview } from "@/lib/api/admin";
import type { AdminAnalyticsOverview } from "@/lib/api/types";

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null);

  useEffect(() => {
    fetchAnalyticsOverview().then(setOverview);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Platform analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Suppliers" value={overview?.suppliers_total ?? "…"} icon={Leaf} />
        <StatCard label="Labs" value={overview?.labs_total ?? "…"} icon={FlaskConical} />
        <StatCard label="Hotels" value={overview?.hotels_total ?? "…"} icon={Store} />
        <StatCard label="Pending approvals" value={overview?.pending_approvals ?? "…"} icon={CheckSquare} tone="accent" />
        <StatCard label="Batches total" value={overview?.batches_total ?? "…"} icon={ShieldCheck} />
        <StatCard label="Batches listed" value={overview?.batches_listed ?? "…"} icon={ShieldCheck} tone="accent" />
        <StatCard label="Verifications pending" value={overview?.verification_requests_pending ?? "…"} icon={ClipboardList} />
        <StatCard label="Certificates issued" value={overview?.certificates_issued ?? "…"} icon={FlaskConical} />
        <StatCard label="Orders placed" value={overview?.orders_total ?? "…"} icon={ClipboardList} />
        <StatCard label="Ledger pending" value={`₹${overview?.ledger_pending_amount ?? "0"}`} icon={Wallet} />
      </div>
    </div>
  );
}
