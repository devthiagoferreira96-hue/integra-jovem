

import { quizzesPorTrilha, type Curso } from "@/data/content";

export type ProgressoOverlay = Record<string, Record<string, boolean>>;

const CHAVE_PROGRESSO = "integra-jovem:progresso:aulas";
const CHAVE_QUIZ = "integra-jovem:progresso:quiz";

export function carregarProgresso(): ProgressoOverlay {
  if (typeof window === "undefined") return {};
  try {
    const bruto = window.localStorage.getItem(CHAVE_PROGRESSO);
    if (!bruto) return {};
    const dados: unknown = JSON.parse(bruto);
    return typeof dados === "object" && dados !== null ? (dados as ProgressoOverlay) : {};
  } catch {
    return {};
  }
}

function salvarProgresso(overlay: ProgressoOverlay): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(overlay));
  } catch {

  }
}

export function definirConclusaoAula(
  cursoSlug: string,
  aulaId: string,
  concluida: boolean,
): ProgressoOverlay {
  const overlay = carregarProgresso();
  overlay[cursoSlug] = { ...overlay[cursoSlug], [aulaId]: concluida };
  salvarProgresso(overlay);
  return overlay;
}

export function calcularProgressoCurso(curso: Curso, overlay: ProgressoOverlay) {
  const overlayCurso = overlay[curso.slug] ?? {};
  const aulas = curso.modulos.flatMap((m) => m.aulas);

  const concluidasPorId = new Map(aulas.map((a) => [a.id, overlayCurso[a.id] ?? false]));
  const total = aulas.length;
  const concluidas = aulas.filter((a) => concluidasPorId.get(a.id)).length;
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);
  return { concluidasPorId, total, concluidas, percentual };
}

export type ResultadoQuiz = {
  cursoSlug: string;
  acertos: number;
  total: number;
  data: string;
};

export function carregarResultadosQuiz(): ResultadoQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_QUIZ);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as ResultadoQuiz[]) : [];
  } catch {
    return [];
  }
}

export function salvarResultadoQuiz(resultado: ResultadoQuiz): void {
  if (typeof window === "undefined") return;
  try {
    const atuais = carregarResultadosQuiz().filter((r) => r.cursoSlug !== resultado.cursoSlug);
    window.localStorage.setItem(CHAVE_QUIZ, JSON.stringify([...atuais, resultado]));
  } catch {

  }
}

export function trilhaEstaConcluida(
  curso: Curso,
  overlay: ProgressoOverlay,
  resultadosQuiz: ResultadoQuiz[],
): boolean {
  const { percentual } = calcularProgressoCurso(curso, overlay);
  if (percentual < 100) return false;

  const temQuiz = Boolean(quizzesPorTrilha[curso.slug]);
  if (!temQuiz) return true;

  return resultadosQuiz.some((r) => r.cursoSlug === curso.slug);
}
