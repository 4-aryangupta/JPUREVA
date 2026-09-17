"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { listVerificationRequests } from "@/lib/api/labs";
import type { VerificationRequest } from "@/lib/api/types";

export default function LabRequestsPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVerificationRequests().then((res) => setRequests(res.results)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Verification requests</h1>

      {loading ? (
        <p className="text-sm text-foreground-secondary">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No verification requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.ingredient_name}</div>
                  <div className="text-xs text-foreground-secondary">Supplier: {r.supplier_name} · Batch {r.batch_public_id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={r.status} />
                  <Button href={`/lab/requests/${r.id}`} size="sm" variant="outline">
                    {r.status === "COMPLETED" ? "View" : "Review"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
