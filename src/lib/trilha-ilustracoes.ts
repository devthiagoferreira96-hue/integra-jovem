import { Coins, Scale, Target, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import { IlustracaoBurocraciaAdulta } from "@/components/cursos/ilustracoes/BurocraciaAdulta";
import { IlustracaoDescobrindoProfissoes } from "@/components/cursos/ilustracoes/DescobrindoProfissoes";
import { IlustracaoPrimeiroDinheiro } from "@/components/cursos/ilustracoes/PrimeiroDinheiro";
import { IlustracaoQuemEuSou } from "@/components/cursos/ilustracoes/QuemEuSou";
import { IlustracaoSaudeEmocional } from "@/components/cursos/ilustracoes/SaudeEmocional";
import { IlustracaoUsoConscienteTecnologia } from "@/components/cursos/ilustracoes/UsoConscienteTecnologia";

export const heroIlustracaoPorTrilha: Partial<Record<string, ComponentType<{ className?: string }>>> = {
  "primeiro-dinheiro": IlustracaoPrimeiroDinheiro,
  "descobrindo-profissoes": IlustracaoDescobrindoProfissoes,
  "quem-eu-sou": IlustracaoQuemEuSou,
  "vida-adulta-burocracia": IlustracaoBurocraciaAdulta,
  "uso-consciente-tecnologia": IlustracaoUsoConscienteTecnologia,
  "saude-emocional": IlustracaoSaudeEmocional,
};

export const moduloIconesPorTrilha: Partial<Record<string, LucideIcon[]>> = {
  "primeiro-dinheiro": [Coins, Scale, Target],
};

export const corPorTrilha: Partial<
  Record<string, { glow: string; dot: string; iconeCor: string; gradiente: { de: string; para: string } }>
> = {
  "primeiro-dinheiro": {
    glow: "bg-primary/45",
    dot: "bg-primary",
    iconeCor: "text-primary",
    gradiente: { de: "from-primary/25", para: "to-transparent" },
  },
  "descobrindo-profissoes": {
    glow: "bg-blue-500/45",
    dot: "bg-blue-400",
    iconeCor: "text-blue-400",
    gradiente: { de: "from-blue-500/25", para: "to-transparent" },
  },
  "quem-eu-sou": {
    glow: "bg-amber-500/45",
    dot: "bg-amber-400",
    iconeCor: "text-amber-400",
    gradiente: { de: "from-amber-500/25", para: "to-transparent" },
  },
  "vida-adulta-burocracia": {
    glow: "bg-orange-500/45",
    dot: "bg-orange-400",
    iconeCor: "text-orange-400",
    gradiente: { de: "from-orange-500/25", para: "to-transparent" },
  },
  "uso-consciente-tecnologia": {
    glow: "bg-violet-500/45",
    dot: "bg-violet-400",
    iconeCor: "text-violet-400",
    gradiente: { de: "from-violet-500/25", para: "to-transparent" },
  },
  "saude-emocional": {
    glow: "bg-rose-500/45",
    dot: "bg-rose-400",
    iconeCor: "text-rose-400",
    gradiente: { de: "from-rose-500/25", para: "to-transparent" },
  },
};

export { temaPorTrilha, type TemaDaTrilha } from "@/lib/temas-trilha";
