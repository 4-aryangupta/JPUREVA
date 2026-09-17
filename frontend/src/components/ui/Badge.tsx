import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-neutral/15 text-neutral border-neutral/25",
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-danger/15 text-danger border-danger/25",
  info: "bg-info/15 text-info border-info/25",
  accent: "bg-accent/15 text-accent-dark border-accent/25",
  primary: "bg-primary/10 text-primary border-primary/25",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

// VERIFIED keeps the brand "primary" tone — it's the product's core trust signal,
// distinct from a generic "success" outcome. All other in-flight states use "info".
const STATUS_TONE: Record<string, Tone> = {
  DRAFT: "neutral",
  PENDING_VERIFICATION: "warning",
  VERIFIED: "primary",
  REJECTED: "danger",
  LISTED: "success",
  SOLD_OUT: "neutral",
  EXPIRED: "danger",
  PENDING: "warning",
  APPROVED: "success",
  PASS: "success",
  FAIL: "danger",
  CONDITIONAL: "warning",
  CONFIRMED: "info",
  PACKED: "info",
  OUT_FOR_DELIVERY: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  FULFILLED: "success",
  PAID: "success",
  ACTIVE: "success",
  VALID: "success",
  EXPIRING_SOON: "warning",
  REQUESTED: "warning",
  ASSIGNED: "info",
  SAMPLE_COLLECTED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status.replace(/_/g, " ")}</Badge>;
}
