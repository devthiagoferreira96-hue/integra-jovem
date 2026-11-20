import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">{label}</p>
      {hint ? <p className="mt-2 font-mono text-[10px] text-subtle-foreground">{hint}</p> : null}
    </div>
  );
}
