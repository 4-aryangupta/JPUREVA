"use client";

import { useEffect, useState } from "react";
import { CheckSquare, ClipboardList, FlaskConical, Leaf, ShieldCheck, Store } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchAnalyticsOverview, listPendingOrders } from "@/lib/api/admin";
import type { AdminAnalyticsOverview, Order } from "@/lib/api/types";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null);
  const [pending, setPending] = useState<Order[]>([]);

  useEffect(() => {
    fetchAnalyticsOverview().then(setOverview);
    listPendingOrders().then((res) => setPending(res.results));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Platform overview</h1>
        <p className="text-sm text-foreground-secondary">Approve hotel checkout orders and monitor platform activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Suppliers" value={overview?.suppliers_total ?? "…"} icon={Leaf} />
        <StatCard label="Labs" value={overview?.labs_total ?? "…"} icon={FlaskConical} />
        <StatCard label="Hotels" value={overview?.hotels_total ?? "…"} icon={Store} />
        <StatCard label="Orders awaiting approval" value={overview?.pending_approvals ?? "…"} icon={CheckSquare} tone="accent" />
        <StatCard label="Batches listed" value={overview?.batches_listed ?? "…"} icon={ShieldCheck} />
        <StatCard label="Verifications pending" value={overview?.verification_requests_pending ?? "…"} icon={ClipboardList} />
        <StatCard label="Certificates issued" value={overview?.certificates_issued ?? "…"} icon={FlaskConical} />
        <StatCard label="Orders placed" value={overview?.orders_total ?? "…"} icon={ClipboardList} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Orders awaiting approval</CardTitle>
          <Button href="/admin/approvals" variant="ghost" size="sm">View all</Button>
        </CardHeader>
        <CardBody className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-foreground-secondary">No orders awaiting approval.</p>}
          {pending.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">Order #{o.id}</div>
                <div className="text-xs text-foreground-secondary">{o.items.length} item(s) · {o.delivery_date}</div>
              </div>
              <div className="text-sm font-medium tabular-nums">₹{o.total_amount}</div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
