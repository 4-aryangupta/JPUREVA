"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Package, ShieldCheck, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { listBatches, listSupplierLedger, listSupplierOrders } from "@/lib/api/suppliers";
import type { Batch, LedgerEntry, SupplierOrderItem } from "@/lib/api/types";

export default function SupplierDashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    listBatches().then((res) => setBatches(res.results));
    listSupplierOrders().then((res) => setOrders(res.results));
    listSupplierLedger().then((res) => setLedger(res.results));
  }, []);

  const listedCount = batches.filter((b) => b.status === "LISTED").length;
  const pendingOrders = orders.filter((o) => o.fulfillment_status === "PENDING").length;
  const pendingPayout = ledger.filter((l) => l.status === "PENDING").reduce((s, l) => s + Number(l.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground-secondary">List harvest batches, get lab-certified, and fulfill orders.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Batches" value={batches.length} icon={Package} />
        <StatCard label="Listed for sale" value={listedCount} icon={ShieldCheck} tone="accent" />
        <StatCard label="Pending fulfillment" value={pendingOrders} icon={ClipboardList} />
        <StatCard label="Pending payout" value={`₹${pendingPayout.toFixed(2)}`} icon={Wallet} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent batches</CardTitle>
          <Button href="/supplier/batches" variant="ghost" size="sm">View all</Button>
        </CardHeader>
        <CardBody className="space-y-3">
          {batches.length === 0 && <p className="text-sm text-foreground-secondary">No batches yet.</p>}
          {batches.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">{b.ingredient_name}</div>
                <div className="text-xs text-foreground-secondary">Batch {b.public_id}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </CardBody>
      </Card>

      <Button href="/supplier/batches/new" variant="accent" size="lg">
        <Package size={18} /> List a new harvest batch
      </Button>
    </div>
  );
}
