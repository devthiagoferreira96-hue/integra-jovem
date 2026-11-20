type ProgressBarProps = {
  value: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export function ProgressBar({ value, label, size = "sm", className = "" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      <div
        className={`w-full overflow-hidden rounded-full bg-border ${size === "md" ? "h-2.5" : "h-1.5"}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progresso"}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary/70 transition-[width] duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}