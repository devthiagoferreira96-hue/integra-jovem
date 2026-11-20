import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu perfil — Integra Jovem",
  description:
    "Progresso pessoal, trilhas concluídas, metas e diário privado de reflexão no Integra Jovem.",
  openGraph: {
    title: "Meu perfil — Integra Jovem",
    description: "Seu progresso e seu diário privado.",
  },
};

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
