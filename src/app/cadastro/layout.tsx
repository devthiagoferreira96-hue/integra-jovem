import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta — Integra Jovem",
  description:
    "Crie sua conta gratuita no Integra Jovem e comece suas trilhas de educação financeira, carreira, autoconhecimento e bem-estar digital.",
  openGraph: {
    title: "Criar conta — Integra Jovem",
    description: "Cadastro de novos usuários no Integra Jovem.",
  },
};

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
