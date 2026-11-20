import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "muted" | "accent-soft" | "neutral-soft";
  className?: string;
};

const variants = {
  solid: "bg-primary text-primary-foreground font-semibold",
  outline: "border border-primary text-primary-light",
  muted: "border border-border text-muted-foreground",
  "accent-soft": "bg-primary/10 border border-primary/20 text-primary-light",
  "neutral-soft": "bg-zinc-500/10 border border-zinc-500/20 text-zinc-300",
} as const;

export function Tag({ children, variant = "muted", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}