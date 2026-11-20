import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilhas — Integra Jovem",
  description:
    "Catálogo de trilhas do Integra Jovem: educação financeira, carreira, autoconhecimento, vida prática e bem-estar digital.",
  openGraph: {
    title: "Trilhas — Integra Jovem",
    description:
      "Escolha livremente qual trilha começar. Blocos curtos, atividade prática ao final de cada um.",
  },
};

export default function TrilhasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
