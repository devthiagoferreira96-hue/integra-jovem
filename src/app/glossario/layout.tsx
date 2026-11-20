import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossário — Integra Jovem",
  description: "Termos financeiros explicados sem jargão, acessíveis a qualquer momento.",
  openGraph: {
    title: "Glossário — Integra Jovem",
    description: "Glossário de termos financeiros do Integra Jovem.",
  },
};

export default function GlossarioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
