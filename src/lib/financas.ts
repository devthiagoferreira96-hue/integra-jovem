
import {
  Dumbbell,
  Home,
  PiggyBank,
  Plug,
  ShoppingCart,
  Tag,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type CategoriaPadrao = "aluguel" | "mercado" | "transporte" | "energia" | "academia" | "reserva";

export type CategoriaGasto = string;

export type Gasto = {
  id: string;
  categoria: CategoriaGasto;
  valor: number;

  mes: string;

  criadoEm: string;
  observacao?: string;
};

export type CategoriaInfo = {
  label: string;
  cor: string;
  icon: LucideIcon;

  tipo: "despesa" | "reserva";
};

export type CategoriaCustom = {
  id: string;
  label: string;
  cor: string;
};

export const categoriasGasto: Record<CategoriaPadrao, CategoriaInfo> = {
  aluguel: { label: "Aluguel", cor: "#38BDF8", icon: Home, tipo: "despesa" },
  mercado: { label: "Mercado", cor: "#A78BFA", icon: ShoppingCart, tipo: "despesa" },
  transporte: { label: "Transporte", cor: "#ee23f5", icon: Zap, tipo: "despesa" },
  energia: { label: "Energia", cor: "#FB923C", icon: Plug, tipo: "despesa" },
  academia: { label: "Academia", cor: "#FB7185", icon: Dumbbell, tipo: "despesa" },
  reserva: { label: "Reserva de emergência", cor: "#34E4A1", icon: PiggyBank, tipo: "reserva" },
};

export const ordemCategorias: CategoriaPadrao[] = [
  "aluguel",
  "mercado",
  "transporte",
  "energia",
  "academia",
  "reserva",
];

const CORES_CATEGORIA_CUSTOM = [
  "#38BDF8",
  "#A78BFA",
  "#ee23f5",
  "#FB923C",
  "#FB7185",
  "#34E4A1",
  "#F472B6",
  "#60A5FA",
  "#FACC15",
  "#4ADE80",
];

export const iconeCategoriaCustom = Tag;

export const categoriasDespesa = ordemCategorias.filter(
  (chave) => categoriasGasto[chave].tipo === "despesa",
);

export function montarMapaCategorias(
  customizadas: CategoriaCustom[],
): Record<string, CategoriaInfo> {
  const mapa: Record<string, CategoriaInfo> = { ...categoriasGasto };
  customizadas.forEach((c) => {
    mapa[c.id] = { label: c.label, cor: c.cor, icon: iconeCategoriaCustom, tipo: "despesa" };
  });
  return mapa;
}

export function montarOrdemCategorias(customizadas: CategoriaCustom[]): string[] {
  return [...ordemCategorias, ...customizadas.map((c) => c.id)];
}

export function infoDaCategoria(
  chave: string,
  mapa: Record<string, CategoriaInfo>,
): CategoriaInfo {
  return (
    mapa[chave] ?? {
      label: "Categoria removida",
      cor: "#8A8A92",
      icon: iconeCategoriaCustom,
      tipo: "despesa",
    }
  );
}

export const CATEGORIA_RENDA = "renda" as const;
export const labelRenda = "Minha Renda";
export const corRenda = "#85BB65";
export type RendaPorMes = Record<string, number>;

const CHAVE_GASTOS = "integra-jovem:financas:gastos";
const CHAVE_META_RESERVA = "integra-jovem:financas:meta-reserva";
const CHAVE_RENDAS = "integra-jovem:financas:rendas";
const CHAVE_CATEGORIAS_CUSTOM = "integra-jovem:financas:categorias-custom";
const META_RESERVA_PADRAO = 600;

export function gerarId(): string {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function mesAtual(referencia = new Date()): string {
  return `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, "0")}`;
}

export function formatarMesLabel(mes: string): string {
  const [ano, mesNum] = mes.split("-").map(Number);
  if (!ano || !mesNum) return mes;
  const data = new Date(ano, mesNum - 1, 1);
  const label = data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

  return label.replace(". de ", "/").replace(".", "");
}

export function formatarMesCompleto(mes: string): string {
  const [ano, mesNum] = mes.split("-").map(Number);
  if (!ano || !mesNum) return mes;
  const data = new Date(ano, mesNum - 1, 1);
  const label = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarMoedaQuebravel(valor: number): string {
  return formatarMoeda(valor).replace(/\u00a0/g, " ");
}

function agruparMilhares(digitos: string): string {
  const semZerosAEsquerda = digitos.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return semZerosAEsquerda.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function mascararValorDigitado(bruto: string, anterior?: string): string {
  let texto = (bruto ?? "").replace(/[^0-9.,]/g, "");
  if (!texto) return "";

  const editandoNoCampo =
    anterior !== undefined && Math.abs(texto.length - anterior.length) <= 1;

  if (!texto.includes(",")) {
    if (texto.endsWith(".") && !(anterior ?? "").endsWith(".")) {
      texto = `${texto.slice(0, -1)},`;
    } else if (!editandoNoCampo) {
      const comoDecimal = texto.match(/^(\d*)\.(\d{1,2})$/);
      if (comoDecimal) texto = `${comoDecimal[1]},${comoDecimal[2]}`;
    }
  }

  texto = texto.replace(/\./g, "");

  const primeiraVirgula = texto.indexOf(",");
  if (primeiraVirgula === -1) {
    return agruparMilhares(texto);
  }
  const inteira = agruparMilhares(texto.slice(0, primeiraVirgula)) || "0";
  const decimal = texto.slice(primeiraVirgula + 1).replace(/\D/g, "").slice(0, 2);
  return `${inteira},${decimal}`;
}

export const MAX_DIGITOS_INTEIROS = 9;
export const VALOR_MAXIMO = 999_999_999.99;

export function limitarValorDigitado(
  bruto: string,
  anterior: string,
  maxDigitos: number = MAX_DIGITOS_INTEIROS,
): { valor: string; excedeu: boolean } {
  const mascarado = mascararValorDigitado(bruto, anterior);
  const parteInteira = mascarado.split(",")[0].replace(/\D/g, "");
  if (parteInteira.length > maxDigitos) {
    return { valor: anterior, excedeu: true };
  }
  return { valor: mascarado, excedeu: false };
}

export function valorMascaradoParaNumero(mascarado: string): number {
  if (!mascarado) return 0;
  const limpo = mascarado.replace(/\./g, "").replace(",", ".");
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : 0;
}

export function formatarValorParaMascara(numero: number): string {
  if (!numero) return "";
  return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ultimosMeses(qtd: number, referencia = new Date()): string[] {
  const meses: string[] = [];
  for (let i = qtd - 1; i >= 0; i--) {
    const data = new Date(referencia.getFullYear(), referencia.getMonth() - i, 1);
    meses.push(mesAtual(data));
  }
  return meses;
}

export function mesesDoAno(ano = new Date().getFullYear()): string[] {
  return Array.from({ length: 12 }, (_, i) => `${ano}-${String(i + 1).padStart(2, "0")}`);
}

export function carregarGastos(): Gasto[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_GASTOS);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (item): item is Gasto =>
        typeof item === "object" &&
        item !== null &&
        "categoria" in item &&
        "valor" in item &&
        "mes" in item,
    );
  } catch {
    return [];
  }
}

export function salvarGastos(gastos: Gasto[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_GASTOS, JSON.stringify(gastos));
  } catch {

  }
}

export function carregarMetaReserva(): number {
  if (typeof window === "undefined") return META_RESERVA_PADRAO;
  try {
    const bruto = window.localStorage.getItem(CHAVE_META_RESERVA);
    const valor = bruto ? Number(bruto) : NaN;
    return Number.isFinite(valor) && valor > 0 ? valor : META_RESERVA_PADRAO;
  } catch {
    return META_RESERVA_PADRAO;
  }
}

export function salvarMetaReserva(valor: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_META_RESERVA, String(valor));
  } catch {

  }
}

export function carregarRendas(): RendaPorMes {
  if (typeof window === "undefined") return {};
  try {
    const bruto = window.localStorage.getItem(CHAVE_RENDAS);
    if (!bruto) return {};
    const dados: unknown = JSON.parse(bruto);
    if (typeof dados !== "object" || dados === null) return {};
    return dados as RendaPorMes;
  } catch {
    return {};
  }
}

export function salvarRendas(rendas: RendaPorMes): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_RENDAS, JSON.stringify(rendas));
  } catch {

  }
}

export function carregarCategoriasCustom(): CategoriaCustom[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_CATEGORIAS_CUSTOM);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (item): item is CategoriaCustom =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "label" in item &&
        "cor" in item,
    );
  } catch {
    return [];
  }
}

export function salvarCategoriasCustom(categorias: CategoriaCustom[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_CATEGORIAS_CUSTOM, JSON.stringify(categorias));
  } catch {

  }
}

export function criarCategoriaCustom(
  label: string,
  existentes: CategoriaCustom[],
): CategoriaCustom {
  const cor = CORES_CATEGORIA_CUSTOM[existentes.length % CORES_CATEGORIA_CUSTOM.length];
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label: label.trim(),
    cor,
  };
}

export function limparDadosFinancas(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE_GASTOS);
    window.localStorage.removeItem(CHAVE_META_RESERVA);
    window.localStorage.removeItem(CHAVE_RENDAS);
    window.localStorage.removeItem(CHAVE_CATEGORIAS_CUSTOM);
  } catch {

  }
}

export function totalPorCategoria(gastos: Gasto[], categoria: CategoriaGasto): number {
  return gastos.filter((g) => g.categoria === categoria).reduce((acc, g) => acc + g.valor, 0);
}

export function totalGeral(gastos: Gasto[]): number {
  return gastos.reduce((acc, g) => acc + g.valor, 0);
}

export function labelDeChave(
  chave: string,
  mapa: Record<string, CategoriaInfo> = categoriasGasto,
): string {
  if (chave === CATEGORIA_RENDA) return labelRenda;
  return mapa[chave]?.label ?? chave;
}

export function corDeChave(
  chave: string,
  mapa: Record<string, CategoriaInfo> = categoriasGasto,
): string {
  if (chave === CATEGORIA_RENDA) return corRenda;
  return mapa[chave]?.cor ?? "#8A8A92";
}
