"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { listCertificates } from "@/lib/api/labs";
import type { Certificate } from "@/lib/api/types";

export default function LabCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCertificates().then((res) => setCerts(res.results)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Certificates issued</h1>

      {loading ? (
        <p className="text-sm text-foreground-secondary">Loading…</p>
      ) : certs.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No certificates issued yet.</p>
      ) : (
        <div className="space-y-3">
          {certs.map((c) => (
            <Card key={c.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.certificate_number}</div>
                  <div className="text-xs text-foreground-secondary">{c.ingredient_name} · Batch {c.batch_public_id}</div>
                  <div className="mt-1 truncate text-[11px] text-foreground-tertiary" title={c.integrity_hash}>Hash: {c.integrity_hash}</div>
                </div>
                <StatusBadge status={c.overall_result} />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
