"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { listInvoices, markInvoicePaid } from "@/lib/api/labs";
import type { Invoice } from "@/lib/api/types";

export default function LabInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  function load() {
    listInvoices().then((res) => setInvoices(res.results));
  }

  useEffect(load, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Testing fee invoices</h1>

      {invoices.length === 0 ? (
        <p className="text-sm text-foreground-secondary">No invoices yet.</p>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">₹{inv.amount}</div>
                  <div className="text-xs text-foreground-secondary">Issued {new Date(inv.issued_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inv.status} />
                  {inv.status === "PENDING" && (
                    <Button size="sm" variant="outline" onClick={() => markInvoicePaid(inv.id).then(load)}>
                      Mark paid
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
