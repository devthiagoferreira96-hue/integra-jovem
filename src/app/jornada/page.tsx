import type { Metadata } from "next";

import { JornadaConteudo } from "@/components/jornada/JornadaConteudo";

export const metadata: Metadata = {
  title: "Minha jornada — Integra Jovem",
  description:
    "Trilha de evolução do Integra Jovem: etapas concluídas, etapa atual e próximos marcos da sua jornada.",
  openGraph: {
    title: "Minha jornada — Integra Jovem",
    description: "Veja onde você está na jornada de preparo para a vida adulta.",
  },
};

export default function JornadaPage() {
  return <JornadaConteudo />;
}
