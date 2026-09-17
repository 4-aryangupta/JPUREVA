"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Wallet } from "lucide-react";
import { listSupplierLedger } from "@/lib/api/suppliers";
import type { LedgerEntry } from "@/lib/api/types";

export default function SupplierLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    listSupplierLedger().then((res) => setEntries(res.results));
  }, []);

  const pending = entries.filter((e) => e.status === "PENDING").reduce((s, e) => s + Number(e.amount), 0);
  const paid = entries.filter((e) => e.status === "PAID").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Payout ledger</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Pending payout" value={`₹${pending.toFixed(2)}`} icon={Wallet} />
        <StatCard label="Paid out" value={`₹${paid.toFixed(2)}`} icon={Wallet} tone="accent" />
      </div>

      <Card>
        <CardBody className="space-y-3">
          {entries.length === 0 && <p className="text-sm text-foreground-secondary">No ledger entries yet.</p>}
          {entries.map((e) => (
            <div key={e.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">{e.entry_type} · ₹{e.amount}</div>
                <div className="text-xs text-foreground-secondary">{e.note} · {new Date(e.created_at).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={e.status} />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
