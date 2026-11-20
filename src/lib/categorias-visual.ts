import {
  ClipboardList,
  Compass,
  Smartphone,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { Categoria } from "@/data/content";

export type VisualCategoria = {
  icon: LucideIcon;

  dot: string;

  glow: string;

  gradiente: { de: string; para: string };

  iconeCor: string;
};

export const categoriaVisual: Record<Categoria, VisualCategoria> = {
  "Educação Financeira": {
    icon: Wallet,
    dot: "bg-primary",
    glow: "bg-primary/30",
    gradiente: { de: "from-primary/25", para: "to-transparent" },
    iconeCor: "text-primary",
  },
  "Carreira e Futuro": {
    icon: Compass,
    dot: "bg-blue-400",
    glow: "bg-blue-500/25",
    gradiente: { de: "from-blue-500/25", para: "to-transparent" },
    iconeCor: "text-blue-400",
  },
  Autoconhecimento: {
    icon: Sparkles,
    dot: "bg-violet-400",
    glow: "bg-violet-500/25",
    gradiente: { de: "from-violet-500/25", para: "to-transparent" },
    iconeCor: "text-violet-400",
  },
  "Vida Prática": {
    icon: ClipboardList,
    dot: "bg-emerald-400",
    glow: "bg-emerald-500/25",
    gradiente: { de: "from-emerald-500/25", para: "to-transparent" },
    iconeCor: "text-emerald-400",
  },
  "Bem-Estar Digital": {
    icon: Smartphone,
    dot: "bg-rose-400",
    glow: "bg-rose-500/25",
    gradiente: { de: "from-rose-500/25", para: "to-transparent" },
    iconeCor: "text-rose-400",
  },
};

export const categoriaVisualPadrao: VisualCategoria = {
  icon: Sparkles,
  dot: "bg-primary",
  glow: "bg-primary/25",
  gradiente: { de: "from-primary/20", para: "to-transparent" },
  iconeCor: "text-primary",
};
