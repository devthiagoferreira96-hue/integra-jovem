export type TemaDaTrilha = "azul" | "ambar" | "laranja" | "violeta" | "rosa";

export const temaPorTrilha: Partial<Record<string, TemaDaTrilha>> = {
  "descobrindo-profissoes": "azul",
  "quem-eu-sou": "ambar",
  "vida-adulta-burocracia": "laranja",
  "uso-consciente-tecnologia": "violeta",
  "saude-emocional": "rosa",
};
