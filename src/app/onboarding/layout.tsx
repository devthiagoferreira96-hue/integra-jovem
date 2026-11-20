import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalizar minha jornada — Integra Jovem",
  description:
    "Responda cinco perguntas rápidas e receba uma jornada inicial com as trilhas que fazem sentido para o seu momento.",
  openGraph: {
    title: "Personalizar minha jornada — Integra Jovem",
    description: "Onboarding do Integra Jovem: interesses, objetivos e ritmo de estudo.",
  },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
