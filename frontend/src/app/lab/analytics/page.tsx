"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, FlaskConical, XCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { fetchLabAnalytics } from "@/lib/api/labs";
import type { LabAnalytics } from "@/lib/api/types";

export default function LabAnalyticsPage() {
  const [analytics, setAnalytics] = useState<LabAnalytics | null>(null);

  useEffect(() => {
    fetchLabAnalytics().then(setAnalytics);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tests completed" value={analytics?.tests_completed ?? "…"} icon={FlaskConical} />
        <StatCard label="Passed" value={analytics?.pass_count ?? "…"} icon={CheckCircle2} tone="accent" />
        <StatCard label="Failed" value={analytics?.fail_count ?? "…"} icon={XCircle} />
        <StatCard label="Avg turnaround" value={analytics?.avg_turnaround_hours != null ? `${analytics.avg_turnaround_hours}h` : "—"} icon={Clock} />
      </div>
    </div>
  );
}
