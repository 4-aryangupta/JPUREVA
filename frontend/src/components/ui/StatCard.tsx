import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "accent";
}) {
  return (
    <Card className="p-6 transition-shadow duration-200 hover:shadow-lifted">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary">{label}</div>
          <div className="mt-2 font-heading text-3xl tracking-tight text-foreground">{value}</div>
        </div>
        <div
          className={
            tone === "primary"
              ? "rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 p-3 text-primary shadow-soft"
              : "rounded-xl bg-gradient-to-br from-accent/25 to-accent/10 p-3 text-accent-dark shadow-soft"
          }
        >
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
