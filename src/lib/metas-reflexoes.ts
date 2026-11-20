

export type Meta = {
  id: string;
  titulo: string;

  prazo: string;

  progresso: number;
  criadoEm: string;
};

export type Reflexao = {
  id: string;
  pergunta: string;
  texto: string;
  criadoEm: string;
};

const CHAVE_METAS = "integra-jovem:perfil:metas";
const CHAVE_REFLEXOES = "integra-jovem:perfil:reflexoes";

export function gerarIdPerfil(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function carregarMetas(): Meta[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_METAS);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as Meta[]) : [];
  } catch {
    return [];
  }
}

export function salvarMetas(metas: Meta[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_METAS, JSON.stringify(metas));
  } catch {

  }
}

export function criarMeta(titulo: string, prazo: string): Meta {
  return {
    id: gerarIdPerfil(),
    titulo: titulo.trim(),
    prazo: prazo.trim(),
    progresso: 0,
    criadoEm: new Date().toISOString(),
  };
}

export function carregarReflexoes(): Reflexao[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_REFLEXOES);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as Reflexao[]) : [];
  } catch {
    return [];
  }
}

export function salvarReflexoes(reflexoes: Reflexao[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_REFLEXOES, JSON.stringify(reflexoes));
  } catch {

  }
}

export function criarReflexao(pergunta: string, texto: string): Reflexao {
  return {
    id: gerarIdPerfil(),
    pergunta,
    texto: texto.trim(),
    criadoEm: new Date().toISOString(),
  };
}
