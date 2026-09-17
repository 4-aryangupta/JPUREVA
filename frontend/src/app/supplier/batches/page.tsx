"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { listBatches } from "@/lib/api/suppliers";
import type { Batch } from "@/lib/api/types";

export default function SupplierBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBatches().then((res) => setBatches(res.results)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-foreground">Batches</h1>
        <Button href="/supplier/batches/new">New batch</Button>
      </div>

      {loading ? (
        <p className="text-sm text-foreground-secondary">Loading…</p>
      ) : batches.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No batches yet. Create your first harvest batch.</p>
      ) : (
        <div className="space-y-3">
          {batches.map((b) => (
            <Card key={b.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {b.ingredient_name}
                    {b.is_growth_anomaly && <AlertTriangle size={14} className="text-danger" aria-label="Growth anomaly flagged" />}
                  </div>
                  <div className="text-xs text-foreground-secondary">Batch {b.public_id} · {b.quantity} {b.unit}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  <Button href={`/supplier/batches/${b.id}`} size="sm" variant="outline">Manage</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
