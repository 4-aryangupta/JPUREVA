"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { listAuditLog } from "@/lib/api/admin";
import type { AuditLogEntry } from "@/lib/api/types";

export default function AdminAuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    listAuditLog().then((res) => setEntries(res.results));
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Audit log</h1>

      <Card>
        <CardBody className="space-y-3">
          {entries.length === 0 && <p className="text-sm text-foreground-secondary">No audit events recorded yet.</p>}
          {entries.map((e) => (
            <div key={e.id} className="border-b border-border pb-3 text-sm last:border-0 last:pb-0">
              <div className="font-medium">{e.action.replace(/_/g, " ")}</div>
              <div className="text-xs text-foreground-secondary">
                {e.actor_email ?? "system"} · {e.target_type} #{e.target_id} · {new Date(e.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
