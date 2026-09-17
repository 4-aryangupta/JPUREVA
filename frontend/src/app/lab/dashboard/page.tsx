"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, FlaskConical, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { fetchLabAnalytics, listVerificationRequests } from "@/lib/api/labs";
import type { LabAnalytics, VerificationRequest } from "@/lib/api/types";

export default function LabDashboardPage() {
  const [analytics, setAnalytics] = useState<LabAnalytics | null>(null);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);

  useEffect(() => {
    fetchLabAnalytics().then(setAnalytics);
    listVerificationRequests().then((res) => setRequests(res.results));
  }, []);

  const pending = requests.filter((r) => r.status === "REQUESTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground-secondary">Review incoming samples and issue verified certificates.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Pending requests" value={pending} icon={ClipboardList} />
        <StatCard label="Tests completed" value={analytics?.tests_completed ?? "…"} icon={FlaskConical} />
        <StatCard label="Pass rate" value={analytics?.pass_rate != null ? `${analytics.pass_rate}%` : "—"} icon={CheckCircle2} tone="accent" />
        <StatCard label="Avg turnaround" value={analytics?.avg_turnaround_hours != null ? `${analytics.avg_turnaround_hours}h` : "—"} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Incoming sample requests</CardTitle>
          <Button href="/lab/requests" variant="ghost" size="sm">View all</Button>
        </CardHeader>
        <CardBody className="space-y-3">
          {requests.length === 0 && <p className="text-sm text-foreground-secondary">No verification requests yet.</p>}
          {requests.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium">{r.ingredient_name} · {r.supplier_name}</div>
                <div className="text-xs text-foreground-secondary">Batch {r.batch_public_id}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={r.status} />
                <Button href={`/lab/requests/${r.id}`} size="sm" variant="outline">Review</Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
