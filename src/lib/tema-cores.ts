

export const CHAVE_CORES = "integra-jovem:cores-claro";

export type CorDestaque = { id: string; nome: string; hex: string };
export type TomFundo = {
  id: string;
  nome: string;
  fundo: string;
  superficie: string;
  superficieAlta: string;
  borda: string;
};

export const CORES_DESTAQUE: CorDestaque[] = [
  { id: "verde", nome: "Verde (padrão)", hex: "#0a8f60" },
  { id: "azul", nome: "Azul", hex: "#1d64d8" },
  { id: "roxo", nome: "Roxo", hex: "#7a3fd1" },
  { id: "rosa", nome: "Rosa", hex: "#c2337a" },
  { id: "laranja", nome: "Laranja", hex: "#c2560c" },
  { id: "vermelho", nome: "Vermelho", hex: "#c62828" },
  { id: "petroleo", nome: "Petróleo", hex: "#0f766e" },
  { id: "grafite", nome: "Grafite", hex: "#374151" },
];

export const TONS_FUNDO: TomFundo[] = [
  { id: "gelo", nome: "Gelo", fundo: "#eef6f8", superficie: "#fbfeff", superficieAlta: "#e1eff3", borda: "#cfe2e8" },
  { id: "ceu", nome: "Céu", fundo: "#eef4fb", superficie: "#fcfdff", superficieAlta: "#e2ecf7", borda: "#cddbec" },
  { id: "lavanda", nome: "Lavanda", fundo: "#f3f0fb", superficie: "#fdfcff", superficieAlta: "#e9e4f7", borda: "#d9d1ee" },
  { id: "menta", nome: "Menta", fundo: "#eef8f3", superficie: "#fbfffd", superficieAlta: "#e3f2ea", borda: "#cfe5da" },
  { id: "neutro", nome: "Neutro (padrão)", fundo: "#f5f7f6", superficie: "#ffffff", superficieAlta: "#eef2f0", borda: "#dde3e0" },
  { id: "pistache", nome: "Pistache", fundo: "#f3f7ec", superficie: "#fdfffa", superficieAlta: "#e8f0dc", borda: "#d6e2c4" },
  { id: "marfim", nome: "Marfim", fundo: "#f8f6ef", superficie: "#fffefb", superficieAlta: "#f0ece0", borda: "#e2dccb" },
  { id: "areia", nome: "Areia", fundo: "#f7f4ec", superficie: "#fffefa", superficieAlta: "#efe9dc", borda: "#e0d8c5" },
  { id: "pessego", nome: "Pêssego", fundo: "#fbf3ee", superficie: "#fffdfb", superficieAlta: "#f5e8df", borda: "#ead5c8" },
  { id: "damasco", nome: "Damasco", fundo: "#fcf0e6", superficie: "#fffcf8", superficieAlta: "#f7e3d2", borda: "#ecceb5" },
  { id: "rose", nome: "Rosé", fundo: "#fbf0f1", superficie: "#fffcfc", superficieAlta: "#f6e2e5", borda: "#ebcdd2" },
];

export type DegradeFundo = { ativo: boolean; topo: string; final: string };

export type PreferenciaCores = { destaque: string; fundo: string; degrade?: DegradeFundo };

export const DEGRADE_PADRAO: DegradeFundo = { ativo: false, topo: "ceu", final: "pessego" };

export const TONS_FRIOS = ["gelo", "ceu", "lavanda", "menta", "neutro"];
export const TONS_QUENTES = ["pistache", "marfim", "areia", "pessego", "damasco", "rose"];

export const CORES_PADRAO: PreferenciaCores = { destaque: "#0a8f60", fundo: "neutro" };

function hexParaRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgbParaHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;

function luminancia([r, g, b]: [number, number, number]): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

const contrasteComBranco = (rgb: [number, number, number]) => 1.05 / (luminancia(rgb) + 0.05);

export function corLegivel(hex: string): string {

  const pronta = CORES_DESTAQUE.find((c) => c.hex.toLowerCase() === hex.trim().toLowerCase());
  if (pronta) return pronta.hex;
  let rgb = hexParaRgb(hex);
  if (!rgb) return CORES_PADRAO.destaque;
  for (let i = 0; i < 20 && contrasteComBranco(rgb) < 4.5; i += 1) {
    rgb = [rgb[0] * 0.9, rgb[1] * 0.9, rgb[2] * 0.9];
  }
  return rgbParaHex(...rgb);
}

function escurecer(hex: string, fator: number): string {
  const rgb = hexParaRgb(hex) ?? [10, 143, 96];
  return rgbParaHex(rgb[0] * fator, rgb[1] * fator, rgb[2] * fator);
}

export function variaveisDasCores(pref: PreferenciaCores): Record<string, string> {
  const destaque = corLegivel(pref.destaque);
  const rgb = hexParaRgb(destaque) ?? [10, 143, 96];
  const degrade = pref.degrade?.ativo ? pref.degrade : null;

  const tom =
    TONS_FUNDO.find((t) => t.id === (degrade ? degrade.topo : pref.fundo)) ??
    TONS_FUNDO.find((t) => t.id === "neutro") ??
    TONS_FUNDO[0];
  const topo = degrade ? (TONS_FUNDO.find((t) => t.id === degrade.topo) ?? tom) : null;
  const final = degrade ? (TONS_FUNDO.find((t) => t.id === degrade.final) ?? tom) : null;
  const comLuz = (cor: string) => `color-mix(in srgb, ${cor} var(--mistura-luz, 100%), #a9b3ae)`;
  return {
    "--fundo-degrade":
      topo && final ? `linear-gradient(180deg, ${comLuz(topo.fundo)} 0%, ${comLuz(final.fundo)} 100%)` : "none",
    "--cor-destaque": destaque,
    "--cor-destaque-forte": escurecer(destaque, 0.8),
    "--cor-destaque-suave": `rgb(${rgb.map(Math.round).join(" ")} / 0.1)`,
    "--base-fundo": tom.fundo,
    "--base-superficie": tom.superficie,
    "--base-superficie-alta": tom.superficieAlta,
    "--base-borda": tom.borda,
  };
}

export function aplicarCores(pref: PreferenciaCores): void {
  const raiz = document.documentElement;
  Object.entries(variaveisDasCores(pref)).forEach(([nome, valor]) => raiz.style.setProperty(nome, valor));
}

export function lerCoresSalvas(): PreferenciaCores {
  try {
    const bruto = localStorage.getItem(CHAVE_CORES);
    if (!bruto) return CORES_PADRAO;
    const dados = JSON.parse(bruto) as Partial<PreferenciaCores> & { vars?: unknown };
    const d = dados.degrade;
    return {
      destaque: typeof dados.destaque === "string" && hexParaRgb(dados.destaque) ? dados.destaque : CORES_PADRAO.destaque,
      fundo: TONS_FUNDO.some((t) => t.id === dados.fundo) ? (dados.fundo as string) : CORES_PADRAO.fundo,
      degrade:
        d && typeof d === "object"
          ? {
              ativo: Boolean(d.ativo),
              topo: TONS_FUNDO.some((t) => t.id === d.topo) ? d.topo : DEGRADE_PADRAO.topo,
              final: TONS_FUNDO.some((t) => t.id === d.final) ? d.final : DEGRADE_PADRAO.final,
            }
          : DEGRADE_PADRAO,
    };
  } catch {
    return CORES_PADRAO;
  }
}

export function salvarCores(pref: PreferenciaCores): void {
  try {
    localStorage.setItem(CHAVE_CORES, JSON.stringify({ ...pref, vars: variaveisDasCores(pref) }));
  } catch {

  }
}
