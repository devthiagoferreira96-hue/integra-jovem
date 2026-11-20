import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Calculator,
  Clock,
  Compass,
  Flag,
  Gift,
  Landmark,
  Lock,
  Map,
  Pencil,
  PiggyBank,
  Receipt,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useId } from "react";

import type { CategoriaConquista } from "@/lib/conquistas";

const cores: Record<CategoriaConquista, { de: string; ate: string; borda: string }> = {
  Leitura: { de: "#34d399", ate: "#047857", borda: "#a7f3d0" },
  Trilhas: { de: "#22d3ee", ate: "#0e7490", borda: "#a5f3fc" },
  Quiz: { de: "#fbbf24", ate: "#b45309", borda: "#fde68a" },
  Ferramentas: { de: "#c084fc", ate: "#7e22ce", borda: "#e9d5ff" },
  Desafios: { de: "#fde047", ate: "#a16207", borda: "#fef08a" },
  Nível: { de: "#fb923c", ate: "#c2410c", borda: "#fed7aa" },
};

const icones: Record<string, LucideIcon> = {
  "primeiro-passo": ArrowRight,
  "leitor-dedicado": BookOpen,
  maratonista: BookMarked,
  "primeira-trilha": Flag,
  "meio-caminho": Map,
  "jornada-completa": Award,
  gabaritou: Target,
  "mestre-quizzes": Trophy,
  "dono-do-dinheiro": Wallet,
  "cientista-dos-juros": Calculator,
  "sonho-com-plano": Star,
  "momento-de-pausa": Pencil,
  "mao-na-massa": Gift,
  "primeiro-ouro": Award,
  "mao-de-ouro": Trophy,
  colecionador: Star,
  "brilho-de-diamante": Sparkles,

  "especialista-primeiro-dinheiro": Wallet,
  "especialista-saude-emocional": ShieldAlert,
  "especialista-descobrindo-profissoes": Receipt,
  "especialista-quem-eu-sou": Landmark,
  "especialista-vida-adulta-burocracia": PiggyBank,
  "especialista-uso-consciente-tecnologia": TrendingUp,

  "todos-os-quizzes": Compass,
  "gabarito-total": Trophy,

  "kit-completo": Gift,
  "nova-identidade": UserRound,
  "mestre-da-planilha": Receipt,
  "laboratorio-de-juros": Calculator,
  "investidor-iniciante": TrendingUp,

  praticante: Target,
  "todos-os-exercicios": Award,
  "primeira-platina": Star,
  "primeira-esmeralda": Sparkles,
  "chuva-de-diamantes": Sparkles,
  "trilha-dourada": Clock,

  "nivel-3": Star,
  "nivel-10": Trophy,
  "nivel-20": Award,
  "nivel-30": Sparkles,
  "nivel-5": Sparkles,
};

type Props = {
  id: string;
  categoria: CategoriaConquista;
  conquistada: boolean;
  className?: string;
};

export function EmblemaConquista({ id, categoria, conquistada, className = "" }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cor = cores[categoria];
  const Icone = icones[id] ?? Award;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 110" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={conquistada ? cor.de : "#3f3f46"} />
            <stop offset="100%" stopColor={conquistada ? cor.ate : "#27272a"} />
          </linearGradient>
        </defs>
        <polygon
          points="50,3 94,28 94,82 50,107 6,82 6,28"
          fill={`url(#grad-${uid})`}
          stroke={conquistada ? cor.borda : "#52525b"}
          strokeWidth="4"
        />
        <polygon
          points="50,14 84,33 84,77 50,96 16,77 16,33"
          fill="none"
          stroke={conquistada ? "#ffffff" : "#52525b"}
          strokeOpacity={conquistada ? 0.35 : 0.6}
          strokeWidth="2"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        {conquistada ? (
          <Icone className="h-[38%] w-[38%] text-white drop-shadow" aria-hidden="true" />
        ) : (
          <Lock className="h-[30%] w-[30%] text-zinc-500" aria-hidden="true" />
        )}
      </span>
    </div>
  );
}
