

const CHAVE = "integra-jovem:retorno-trilha";

export type RetornoTrilha = {

  href: string;
  trilha: string;
  bloco: string;

  exercicioId?: string;
  criadoEm: string;
};

export function hrefDoBloco(cursoSlug: string, aulaId: string): string {
  return `/trilhas/${cursoSlug}?bloco=${encodeURIComponent(aulaId)}`;
}

export function salvarRetorno(dados: Omit<RetornoTrilha, "criadoEm">): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHAVE, JSON.stringify({ ...dados, criadoEm: new Date().toISOString() }));
    window.dispatchEvent(new Event("integra-jovem:retorno-trilha"));
  } catch {

  }
}

export function lerRetorno(): RetornoTrilha | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.sessionStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as RetornoTrilha;
    return typeof dados?.href === "string" && dados.href.startsWith("/trilhas/") ? dados : null;
  } catch {
    return null;
  }
}

export function limparRetorno(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CHAVE);
    window.dispatchEvent(new Event("integra-jovem:retorno-trilha"));
  } catch {

  }
}
