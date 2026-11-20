import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir senha — Integra Jovem",
  description: "Crie uma senha nova para a sua conta do Integra Jovem.",
  robots: { index: false },
};

export default function RedefinirSenhaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
